
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from "./UserManagement";
import RoomHistory from "./RoomHistory";
import CarHistory from "./CarHistory";
import RoomManagement from "./RoomManagement";
import CarManagement from "./CarManagement";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("usuarios");
  const isMobile = useIsMobile();
  
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
          {isMobile ? (
            <div className="mb-6">
              <TabsList className="grid w-full grid-cols-3 gap-1 mb-2">
                <TabsTrigger value="usuarios">Usuários</TabsTrigger>
                <TabsTrigger value="salas">Salas</TabsTrigger>
                <TabsTrigger value="carros">Carros</TabsTrigger>
              </TabsList>
              <TabsList className="grid w-full grid-cols-2 gap-1">
                <TabsTrigger value="historico-salas">Hist. Salas</TabsTrigger>
                <TabsTrigger value="historico-carros">Hist. Carros</TabsTrigger>
              </TabsList>
            </div>
          ) : (
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="usuarios">Usuários</TabsTrigger>
              <TabsTrigger value="salas">Salas</TabsTrigger>
              <TabsTrigger value="carros">Carros</TabsTrigger>
              <TabsTrigger value="historico-salas">Hist. Salas</TabsTrigger>
              <TabsTrigger value="historico-carros">Hist. Carros</TabsTrigger>
            </TabsList>
          )}
          
          <TabsContent value="usuarios">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="salas">
            <RoomManagement />
          </TabsContent>
          
          <TabsContent value="carros">
            <CarManagement />
          </TabsContent>
          
          <TabsContent value="historico-salas">
            <RoomHistory />
          </TabsContent>
          
          <TabsContent value="historico-carros">
            <CarHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
