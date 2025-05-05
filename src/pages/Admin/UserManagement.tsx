
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

// Dados simulados de usuários
const initialUsers = [
  { id: 1, name: "Administrador", email: "admin@solus.com", driverLicense: "12345678900", driverLicenseFile: null, isAdmin: true },
  { id: 2, name: "Usuário Teste", email: "usuario@solus.com", driverLicense: "98765432100", driverLicenseFile: null, isAdmin: false },
];

const UserManagement = () => {
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("solusUsers");
    return savedUsers ? JSON.parse(savedUsers) : initialUsers;
  });
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [driverLicense, setDriverLicense] = useState("");
  const [driverLicenseFile, setDriverLicenseFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    
    // Validação de arquivo de CNH
    if (!driverLicenseFile) {
      toast.error("É necessário anexar uma cópia da CNH");
      return;
    }
    
    // Convertemos o arquivo para URL base64 para armazenamento
    const reader = new FileReader();
    reader.onloadend = () => {
      // Adicionar novo usuário
      const newUser = {
        id: users.length + 1,
        name,
        email,
        driverLicense,
        driverLicenseFile: {
          name: driverLicenseFile.name,
          type: driverLicenseFile.type,
          data: reader.result
        },
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
      setDriverLicenseFile(null);
      setPassword("");
      setIsAdmin(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
    
    reader.readAsDataURL(driverLicenseFile);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Verificar o tamanho do arquivo (limite de 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("O arquivo é muito grande. Tamanho máximo: 5MB");
        return;
      }
      
      // Verificar o tipo do arquivo
      const acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!acceptedTypes.includes(file.type)) {
        toast.error("Formato de arquivo não aceito. Use PDF, JPEG ou PNG");
        return;
      }
      
      setDriverLicenseFile(file);
    }
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
            
            <div className="space-y-2">
              <Label htmlFor="driverLicenseFile" className="block text-sm font-medium">
                Documento da CNH (PDF, JPEG, PNG)
              </Label>
              <Input
                id="driverLicenseFile"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="cursor-pointer"
              />
              {driverLicenseFile && (
                <p className="text-xs text-green-600">
                  Arquivo selecionado: {driverLicenseFile.name}
                </p>
              )}
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
                <TableHead>Documento</TableHead>
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
                    {user.driverLicenseFile ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (user.driverLicenseFile?.data) {
                            window.open(user.driverLicenseFile.data as string, '_blank');
                          }
                        }}
                      >
                        Ver documento
                      </Button>
                    ) : (
                      <span className="text-gray-400">Não anexado</span>
                    )}
                  </TableCell>
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
