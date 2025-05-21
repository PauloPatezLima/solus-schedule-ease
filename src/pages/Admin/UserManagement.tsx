
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit } from "lucide-react";
import { userService } from "@/services/api";

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [driverLicense, setDriverLicense] = useState("");
  const [driverLicenseFile, setDriverLicenseFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado para controlar o modal de edição
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editDriverLicense, setEditDriverLicense] = useState("");
  const [editDriverLicenseFile, setEditDriverLicenseFile] = useState<File | null>(null);
  const [editIsAdmin, setEditIsAdmin] = useState(false);
  const [editPassword, setEditPassword] = useState("");
  const [changePassword, setChangePassword] = useState(false);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Carregar usuários da API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      toast.error("Não foi possível buscar os usuários");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
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
    
    // Função para processar o envio do usuário
    const processFileAndSendUser = () => {
      // Convertemos o arquivo para URL base64 para armazenamento
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          // Preparar dados do usuário
          const userData = {
            name,
            email,
            password,
            driverLicense,
            driverLicenseFile: {
              name: driverLicenseFile.name,
              type: driverLicenseFile.type,
              data: reader.result
            },
            isAdmin
          };
          
          // Chamar a API para criar o usuário
          const response = await userService.createUser(userData);
          
          if (response.success) {
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
            
            // Atualizar lista de usuários
            fetchUsers();
          } else {
            toast.error(response.message || "Erro ao cadastrar usuário");
          }
        } catch (error: any) {
          console.error("Erro ao cadastrar usuário:", error);
          toast.error(error.response?.data?.message || "Erro ao cadastrar usuário");
        }
      };
      
      reader.readAsDataURL(driverLicenseFile);
    };
    
    processFileAndSendUser();
  };

  const handleDeleteUser = async (id: number) => {
    // Não permitir excluir o usuário admin
    if (id === 1) {
      toast.error("Não é possível excluir o administrador principal");
      return;
    }
    
    try {
      const response = await userService.deleteUser(id);
      
      if (response.success) {
        toast.success("Usuário removido com sucesso!");
        // Atualizar lista de usuários
        fetchUsers();
      } else {
        toast.error(response.message || "Erro ao remover usuário");
      }
    } catch (error: any) {
      console.error("Erro ao remover usuário:", error);
      toast.error(error.response?.data?.message || "Erro ao remover usuário");
    }
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditDriverLicense(user.driverLicense || "");
    setEditIsAdmin(user.isAdmin);
    setChangePassword(false);
    setEditPassword("");
    setIsEditOpen(true);
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editName.trim() || !editEmail.trim()) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    // Verificar se a nova senha tem pelo menos 6 caracteres (se estiver sendo alterada)
    if (changePassword && editPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    
    // Função para processar e atualizar o usuário
    const processUserUpdate = async (driverLicenseFileData?: any) => {
      try {
        // Preparar dados para atualização
        const userData: any = {
          name: editName,
          email: editEmail,
          driverLicense: editDriverLicense,
          isAdmin: editIsAdmin
        };
        
        // Incluir senha apenas se foi solicitada alteração
        if (changePassword) {
          userData.password = editPassword;
        }
        
        // Incluir arquivo da CNH se foi enviado
        if (driverLicenseFileData) {
          userData.driverLicenseFile = driverLicenseFileData;
        }
        
        // Chamar API para atualizar o usuário
        const response = await userService.updateUser(editingUser.id, userData);
        
        if (response.success) {
          toast.success("Usuário atualizado com sucesso!");
          setIsEditOpen(false);
          
          // Atualizar lista de usuários
          fetchUsers();
        } else {
          toast.error(response.message || "Erro ao atualizar usuário");
        }
      } catch (error: any) {
        console.error("Erro ao atualizar usuário:", error);
        toast.error(error.response?.data?.message || "Erro ao atualizar usuário");
      }
    };

    // Se um novo arquivo foi selecionado, convertê-lo
    if (editDriverLicenseFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        processUserUpdate({
          name: editDriverLicenseFile.name,
          type: editDriverLicenseFile.type,
          data: reader.result
        });
      };
      reader.readAsDataURL(editDriverLicenseFile);
    } else {
      // Se não tiver novo arquivo, apenas atualizar os outros dados
      processUserUpdate();
    }
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

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      
      setEditDriverLicenseFile(file);
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
          {loading ? (
            <p>Carregando usuários...</p>
          ) : (
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
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Nenhum usuário cadastrado
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.driverLicense || "N/A"}</TableCell>
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
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(user)}
                          className="mr-2"
                          disabled={user.id === 1} // Não permitir editar o admin principal
                        >
                          <Edit className="h-4 w-4 mr-1" /> Editar
                        </Button>
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
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal de Edição de Usuário */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Edite as informações do usuário abaixo.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <form onSubmit={handleEditUser} className="space-y-4 pt-4 px-1">
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
                  <Label htmlFor="editEmail">Email</Label>
                  <Input
                    id="editEmail"
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="editDriverLicense">CNH</Label>
                  <Input
                    id="editDriverLicense"
                    value={editDriverLicense}
                    onChange={(e) => setEditDriverLicense(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox 
                      id="changePassword" 
                      checked={changePassword} 
                      onCheckedChange={(checked) => setChangePassword(checked === true)}
                    />
                    <label htmlFor="changePassword" className="text-sm font-medium">
                      Alterar senha
                    </label>
                  </div>
                  
                  {changePassword && (
                    <div className="space-y-2">
                      <Label htmlFor="editPassword">Nova Senha</Label>
                      <Input
                        id="editPassword"
                        type="password"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        placeholder="Nova senha"
                      />
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="editDriverLicenseFile">
                    Documento da CNH (Opcional - Deixe em branco para manter o atual)
                  </Label>
                  <Input
                    id="editDriverLicenseFile"
                    type="file"
                    ref={editFileInputRef}
                    onChange={handleEditFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="cursor-pointer"
                  />
                  {editDriverLicenseFile && (
                    <p className="text-xs text-green-600">
                      Novo arquivo: {editDriverLicenseFile.name}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="editIsAdmin" 
                    checked={editIsAdmin} 
                    onCheckedChange={(checked) => setEditIsAdmin(checked === true)}
                    disabled={editingUser?.id === 1} // Não permitir mudar o status do admin principal
                  />
                  <label htmlFor="editIsAdmin" className="text-sm font-medium">
                    Administrador
                  </label>
                </div>
              </div>
            </form>
          </ScrollArea>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleEditUser} className="bg-solus-primary hover:bg-solus-primary/90">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
