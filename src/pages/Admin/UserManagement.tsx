
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

// Dados simulados de usuários
const initialUsers = [
  { id: 1, name: "Administrador", email: "admin@solus.com", driverLicense: "12345678900", isAdmin: true },
  { id: 2, name: "Usuário Teste", email: "usuario@solus.com", driverLicense: "98765432100", isAdmin: false },
];

const UserManagement = () => {
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("solusUsers");
    return savedUsers ? JSON.parse(savedUsers) : initialUsers;
  });
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [driverLicense, setDriverLicense] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações simples
    if (!name.trim() || !email.trim() || !password.trim() || !driverLicense.trim()) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    
    // Verificar se o email já existe
    if (users.some(user => user.email === email)) {
      toast.error("Este email já está em uso");
      return;
    }

    // Validação simples de CNH
    if (driverLicense.length < 9) {
      toast.error("CNH inválida - deve ter pelo menos 9 caracteres");
      return;
    }
    
    // Adicionar novo usuário
    const newUser = {
      id: users.length + 1,
      name,
      email,
      driverLicense,
      isAdmin
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem("solusUsers", JSON.stringify(updatedUsers));
    toast.success("Usuário cadastrado com sucesso!");
    
    // Limpar formulário
    setName("");
    setEmail("");
    setDriverLicense("");
    setPassword("");
    setIsAdmin(false);
  };

  const handleDeleteUser = (id: number) => {
    // Não permitir excluir o próprio usuário admin
    if (id === 1) {
      toast.error("Não é possível excluir o administrador principal");
      return;
    }
    
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem("solusUsers", JSON.stringify(updatedUsers));
    toast.success("Usuário removido com sucesso!");
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Novo Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">Nome</label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome completo"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@exemplo.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="driverLicense" className="block text-sm font-medium">CNH</label>
                <Input
                  id="driverLicense"
                  value={driverLicense}
                  onChange={(e) => setDriverLicense(e.target.value)}
                  placeholder="Número da CNH"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">Senha</label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="admin" 
                checked={isAdmin} 
                onCheckedChange={(checked) => setIsAdmin(checked === true)}
              />
              <label htmlFor="admin" className="text-sm font-medium">
                Administrador
              </label>
            </div>
            
            <Button 
              type="submit" 
              className="bg-solus-primary hover:bg-solus-primary/90"
            >
              Cadastrar Usuário
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Usuários Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>CNH</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.driverLicense}</TableCell>
                  <TableCell>
                    {user.isAdmin ? "Administrador" : "Usuário"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={user.id === 1} // Não permitir excluir o admin principal
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

export default UserManagement;
