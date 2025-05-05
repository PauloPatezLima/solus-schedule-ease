
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ResourceCard from "@/components/ResourceCard";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const CarBooking = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<any[]>([]);
  const today = new Date();
  
  // Carregar carros do localStorage
  useEffect(() => {
    const savedCars = localStorage.getItem("solusCars");
    if (savedCars) {
      setCars(JSON.parse(savedCars));
    } else {
      // Dados iniciais se não existir no localStorage
      const initialCars = [
        { id: 1, name: "Fiat Mobi", isAvailable: true, fuelLevel: 0.75, plate: "ABC-1234" },
        { id: 2, name: "VW Gol", isAvailable: false, fuelLevel: 0.5, plate: "XYZ-5678" },
        { id: 3, name: "Renault Kwid", isAvailable: true, fuelLevel: 1, plate: "DEF-9012" }
      ];
      setCars(initialCars);
      localStorage.setItem("solusCars", JSON.stringify(initialCars));
    }
  }, []);
  
  const getFuelLevelText = (level: number) => {
    if (level === 0) return "Vazio";
    if (level === 0.25) return "1/4";
    if (level === 0.5) return "1/2";
    if (level === 0.75) return "3/4";
    if (level === 1) return "Cheio";
    return "";
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-solus-light">
      <Header title="Agendamento de Carros" />
      
      <div className="solus-container flex-1">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Status do Dia</h2>
          <p className="text-gray-600 mb-4">
            {format(today, "dd 'de' MMMM 'de' yyyy")}
          </p>
          
          <div className="divide-y">
            {cars.map(car => (
              <ResourceCard
                key={car.id}
                name={car.name}
                isAvailable={car.isAvailable}
                resourceType="car"
                details={`Placa: ${car.plate} • Combustível: ${getFuelLevelText(car.fuelLevel)}`}
                onClick={() => {
                  if (car.isAvailable) {
                    navigate(`/carros/solicitar?carId=${car.id}&carName=${car.name}&fuelLevel=${car.fuelLevel}`);
                  } else {
                    toast.error("Este carro já está reservado");
                  }
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          <Button 
            className="option-button"
            onClick={() => navigate("/carros/solicitar")}
          >
            Solicitar Reserva
          </Button>
          <Button 
            className="bg-solus-warning text-white py-3 px-6 rounded-md hover:bg-opacity-90 transition-all font-medium"
            onClick={() => navigate("/carros/devolver")}
          >
            Registrar Devolução
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CarBooking;
