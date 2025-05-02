
import { useNavigate } from "react-router-dom";
import { Car, DoorClosed } from "lucide-react";
import { useEffect, useState } from "react";
import Header from "@/components/Header";

const Index = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Verificar se há um usuário logado
    const userJson = localStorage.getItem("solusUser");
    if (userJson) {
      const user = JSON.parse(userJson);
      setUserName(user.email.split('@')[0]); // Apenas o nome antes do @
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-solus-light flex flex-col">
      <Header title="Solus Convenience" showBackButton={false} />
      
      <div className="solus-container flex-1 flex flex-col justify-center items-center">
        <div className="text-center mb-12 animate-fade-in">
          <div className="bg-solus-primary rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <span className="text-white font-bold text-3xl">SC</span>
          </div>
          <h1 className="text-3xl font-bold text-solus-primary mb-2">Solus Convenience</h1>
          <p className="text-gray-600">Olá, {userName}! O que deseja agendar hoje?</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-md">
          <div 
            className="main-option" 
            onClick={() => navigate("/salas")}
          >
            <DoorClosed size={48} />
            <span className="mt-4 text-lg font-medium">Salas</span>
            <p className="text-sm text-center mt-2 text-gray-600">Agendar sala de reunião</p>
          </div>
          
          <div 
            className="main-option" 
            onClick={() => navigate("/carros")}
          >
            <Car size={48} />
            <span className="mt-4 text-lg font-medium">Carros</span>
            <p className="text-sm text-center mt-2 text-gray-600">Agendar ou devolver carro</p>
          </div>
        </div>
      </div>
      
      <footer className="bg-solus-primary text-white p-4 text-center text-sm">
        <p>&copy; 2025 Solus Convenience</p>
      </footer>
    </div>
  );
};

export default Index;
