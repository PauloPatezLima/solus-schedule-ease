
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ResourceCard from "@/components/ResourceCard";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { carService } from "@/services/api";

interface Car {
  id: number;
  model: string;
  plate: string;
  isAvailable: boolean;
  fuelLevel: number;
}

const CarBooking = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const today = new Date();
  
  // Carregar carros da API
  useEffect(() => {
    async function loadCars() {
      try {
        setIsLoading(true);
        const carsData = await carService.getCars();
        setCars(carsData);
      } catch (error) {
        console.error("Erro ao carregar carros:", error);
        toast.error("Erro ao carregar lista de carros");
      } finally {
        setIsLoading(false);
      }
    }
    
    loadCars();
  }, []);
  
  const getFuelLevelText = (level: number) => {
    const normalizedLevel = level / 100; // Convertendo de 0-100 para 0-1
    if (normalizedLevel < 0.125) return "Vazio";
    if (normalizedLevel < 0.375) return "1/4";
    if (normalizedLevel < 0.625) return "1/2";
    if (normalizedLevel < 0.875) return "3/4";
    return "Cheio";
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
          
          {isLoading ? (
            <div className="py-8 text-center">
              <p className="text-gray-500">Carregando carros...</p>
            </div>
          ) : (
            <div className="divide-y">
              {cars.length === 0 ? (
                <p className="py-4 text-gray-500 text-center">Nenhum carro disponível</p>
              ) : (
                cars.map(car => (
                  <ResourceCard
                    key={car.id}
                    name={car.model}
                    isAvailable={car.isAvailable}
                    resourceType="car"
                    details={`Placa: ${car.plate} • Combustível: ${getFuelLevelText(car.fuelLevel)}`}
                    onClick={() => {
                      if (car.isAvailable) {
                        navigate(`/carros/solicitar?carId=${car.id}&carName=${encodeURIComponent(car.model)}`);
                      } else {
                        toast.error("Este carro já está reservado");
                      }
                    }}
                  />
                ))
              )}
            </div>
          )}
        </div>
        
        <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'flex-row space-x-4'} justify-center`}>
          <Button 
            className="option-button w-full sm:w-auto"
            onClick={() => navigate("/carros/solicitar")}
          >
            Solicitar Reserva
          </Button>
          <Button 
            className="bg-solus-warning text-white py-3 px-6 rounded-md hover:bg-opacity-90 transition-all font-medium w-full sm:w-auto"
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
