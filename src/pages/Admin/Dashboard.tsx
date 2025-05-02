
import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from "./UserManagement";
import RoomHistory from "./RoomHistory";
import CarHistory from "./CarHistory";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("usuarios");
  
  const handleLogout = () => {
    localStorage.removeItem("solusUser");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-solus-light flex flex-col">
      <Header title="Painel Administrativo" showBackButton={false} />
      
      <div className="solus-container flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-solus-primary">
            Administração
          </h1>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="border-solus-primary text-solus-primary hover:bg-solus-primary hover:text-white"
          >
            Sair
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="usuarios">Usuários</TabsTrigger>
            <TabsTrigger value="salas">Histórico de Salas</TabsTrigger>
            <TabsTrigger value="carros">Histórico de Carros</TabsTrigger>
          </TabsList>
          
          <TabsContent value="usuarios">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="salas">
            <RoomHistory />
          </TabsContent>
          
          <TabsContent value="carros">
            <CarHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
