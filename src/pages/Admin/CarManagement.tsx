
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

// Dados simulados de carros
const initialCars = [
  { id: 1, name: "Fiat Mobi", plate: "ABC-1234", fuelCapacity: 5, isAvailable: true, fuelLevel: 0.8, odometer: 15420 },
  { id: 2, name: "VW Gol", plate: "XYZ-5678", fuelCapacity: 8, isAvailable: true, fuelLevel: 0.6, odometer: 45680 },
  { id: 3, name: "Renault Kwid", plate: "DEF-9012", fuelCapacity: 6, isAvailable: true, fuelLevel: 0.5, odometer: 12350 },
  { id: 4, name: "Fiat Argo", plate: "GHI-3456", fuelCapacity: 12, isAvailable: true, fuelLevel: 0.9, odometer: 8750 },
];

const CarManagement = () => {
  const [cars, setCars] = useState(() => {
    const savedCars = localStorage.getItem("solusCars");
    return savedCars ? JSON.parse(savedCars) : initialCars;
  });
  
  const [name, setName] = useState("");
  const [plate, setPlate] = useState("");
  const [fuelCapacity, setFuelCapacity] = useState(8);

  // Salvar carros no localStorage quando houver alterações
  useEffect(() => {
    localStorage.setItem("solusCars", JSON.stringify(cars));
  }, [cars]);

  const handleAddCar = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações simples
    if (!name.trim() || !plate.trim()) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    // Verificar se a placa já existe
    if (cars.some(car => car.plate === plate)) {
      toast.error("Esta placa já está cadastrada");
      return;
    }
    
    // Adicionar novo carro
    const newCar = {
      id: cars.length + 1,
      name,
      plate,
      fuelCapacity,
      isAvailable: true,
      fuelLevel: 1, // Tanque cheio ao cadastrar
      odometer: 0
    };
    
    setCars([...cars, newCar]);
    toast.success("Carro cadastrado com sucesso!");
    
    // Limpar formulário
    setName("");
    setPlate("");
    setFuelCapacity(8);
  };

  const handleDeleteCar = (id: number) => {
    setCars(cars.filter(car => car.id !== id));
    toast.success("Carro removido com sucesso!");
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Novo Carro</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddCar} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Modelo</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Fiat Mobi"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="plate">Placa</Label>
                <Input
                  id="plate"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                  placeholder="Ex: ABC-1234"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fuelCapacity">Capacidade de Combustível (pins)</Label>
              <Input
                id="fuelCapacity"
                type="number"
                min="1"
                max="20"
                value={fuelCapacity}
                onChange={(e) => setFuelCapacity(parseInt(e.target.value) || 8)}
                placeholder="8"
              />
            </div>
            
            <Button 
              type="submit" 
              className="bg-solus-primary hover:bg-solus-primary/90"
            >
              Cadastrar Carro
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Carros Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Modelo</TableHead>
                <TableHead>Placa</TableHead>
                <TableHead>Capacidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cars.map((car) => (
                <TableRow key={car.id}>
                  <TableCell>{car.name}</TableCell>
                  <TableCell>{car.plate}</TableCell>
                  <TableCell>{car.fuelCapacity} pins</TableCell>
                  <TableCell>
                    <span className={car.isAvailable ? "text-green-500" : "text-yellow-500"}>
                      {car.isAvailable ? "Disponível" : "Reservado"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteCar(car.id)}
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
    </div>
  );
};

export default CarManagement;
