
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Edit } from "lucide-react";

// Dados simulados de salas
const initialRooms = [
  { id: 1, name: "Sala de Reunião", capacity: 8, description: "Equipada com projetor e videoconferência" },
  { id: 2, name: "Sala Coworking", capacity: 12, description: "Espaço colaborativo com mesas compartilhadas" },
  { id: 3, name: "Sala Colab (Aquário)", capacity: 6, description: "Sala para trabalho em equipe com quadro interativo" },
];

const RoomManagement = () => {
  const [rooms, setRooms] = useState(() => {
    const savedRooms = localStorage.getItem("solusRooms");
    return savedRooms ? JSON.parse(savedRooms) : initialRooms;
  });
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(8);
  const [description, setDescription] = useState("");

  // Modal de edição
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editCapacity, setEditCapacity] = useState(0);
  const [editDescription, setEditDescription] = useState("");

  // Salvar salas no localStorage quando houver alterações
  useEffect(() => {
    localStorage.setItem("solusRooms", JSON.stringify(rooms));
  }, [rooms]);

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações simples
    if (!name.trim()) {
      toast.error("Preencha o nome da sala");
      return;
    }
    
    // Verificar se o nome já existe
    if (rooms.some(room => room.name === name)) {
      toast.error("Já existe uma sala com este nome");
      return;
    }
    
    // Adicionar nova sala
    const newRoom = {
      id: rooms.length + 1,
      name,
      capacity,
      description,
      isAvailable: true
    };
    
    setRooms([...rooms, newRoom]);
    toast.success("Sala cadastrada com sucesso!");
    
    // Limpar formulário
    setName("");
    setCapacity(8);
    setDescription("");
  };

  const handleDeleteRoom = (id: number) => {
    setRooms(rooms.filter(room => room.id !== id));
    toast.success("Sala removida com sucesso!");
  };

  const openEditModal = (room: any) => {
    setEditingRoom(room);
    setEditName(room.name);
    setEditCapacity(room.capacity);
    setEditDescription(room.description || "");
    setIsEditOpen(true);
  };

  const handleEditRoom = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editName.trim()) {
      toast.error("Preencha o nome da sala");
      return;
    }
    
    // Verificar se o nome já existe (exceto o da sala atual)
    if (rooms.some(room => room.name === editName && room.id !== editingRoom.id)) {
      toast.error("Já existe uma sala com este nome");
      return;
    }
    
    // Atualizar a sala
    const updatedRooms = rooms.map(room => {
      if (room.id === editingRoom.id) {
        return {
          ...room,
          name: editName,
          capacity: editCapacity,
          description: editDescription
        };
      }
      return room;
    });
    
    setRooms(updatedRooms);
    setIsEditOpen(false);
    toast.success("Sala atualizada com sucesso!");
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Nova Sala</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddRoom} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Sala de Reunião"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacidade</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={capacity}
                  onChange={(e) => setCapacity(parseInt(e.target.value) || 8)}
                  placeholder="8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva as características da sala"
                rows={3}
              />
            </div>
            
            <Button 
              type="submit" 
              className="bg-solus-primary hover:bg-solus-primary/90"
            >
              Cadastrar Sala
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Salas Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Capacidade</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>{room.name}</TableCell>
                  <TableCell>{room.capacity} pessoas</TableCell>
                  <TableCell className="max-w-xs truncate">{room.description}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(room)}
                      className="mr-2"
                    >
                      <Edit className="h-4 w-4 mr-1" /> Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteRoom(room.id)}
                    >
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal de Edição */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Sala</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditRoom} className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editName">Nome</Label>
                <Input
                  id="editName"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editCapacity">Capacidade</Label>
                <Input
                  id="editCapacity"
                  type="number"
                  min="1"
                  value={editCapacity}
                  onChange={(e) => setEditCapacity(parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editDescription">Descrição</Label>
                <Textarea
                  id="editDescription"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-solus-primary hover:bg-solus-primary/90">
                Salvar Alterações
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomManagement;
