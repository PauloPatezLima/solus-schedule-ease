import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import TimeSelect from "@/components/TimeSelect";
import FuelLevel from "@/components/FuelLevel";
import { useIsMobile } from "@/hooks/use-mobile";
import { carService } from "@/services/api";

interface Car {
  id: number;
  model: string;
  plate: string;
  isAvailable: boolean;
  fuelLevel: number;
  odometer?: number;
}

const CarRequest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const carIdFromQuery = queryParams.get('carId');
  const carNameFromQuery = queryParams.get('carName');
  const isMobile = useIsMobile();
  
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState("");
  const [fuelLevel, setFuelLevel] = useState(0);
  const [fuelPins, setFuelPins] = useState(5);
  const [initialOdometer, setInitialOdometer] = useState(0);
  const [destination, setDestination] = useState("");
  const [purpose, setPurpose] = useState("");
  const [occupiedTimes, setOccupiedTimes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Carregar carros da API
  useEffect(() => {
    async function loadCars() {
      try {
        setIsLoading(true);
        const carsData = await carService.getCars();
        
        // Filtrar apenas carros disponíveis
        const availableCars = carsData.filter((car: Car) => car.isAvailable);
        setCars(availableCars);
        
        // Auto-select do carro baseado no query param
        if (carIdFromQuery) {
          const selectedCarFromQuery = carsData.find((car: Car) => car.id.toString() === carIdFromQuery);
          if (selectedCarFromQuery) {
            setSelectedCar(selectedCarFromQuery.id.toString());
            setFuelLevel(selectedCarFromQuery.fuelLevel / 100); // Convertendo de 0-100 para 0-1
            setInitialOdometer(selectedCarFromQuery.odometer || 0);
            // Mostrar toast confirmando a seleção do carro
            toast.info(`Carro ${decodeURIComponent(carNameFromQuery || selectedCarFromQuery.model)} selecionado`);
          }
        } else if (availableCars.length > 0) {
          // Caso não tenha carro na query, selecionar o primeiro disponível
          setSelectedCar(availableCars[0].id.toString());
          setFuelLevel(availableCars[0].fuelLevel / 100); // Convertendo de 0-100 para 0-1
          setInitialOdometer(availableCars[0].odometer || 0);
        }
      } catch (error) {
        console.error("Erro ao carregar carros:", error);
        toast.error("Erro ao carregar lista de carros");
      } finally {
        setIsLoading(false);
      }
    }
    
    loadCars();
  }, [carIdFromQuery, carNameFromQuery]);

  // Verificar horários ocupados quando a data mudar
  useEffect(() => {
    async function checkOccupiedTimes() {
      if (!selectedCar) return;
      
      try {
        const formattedDate = format(date, "yyyy-MM-dd");
        const reservations = await carService.getCarReservations({
          date: formattedDate,
          carId: selectedCar
        });
        
        // Extrair horários ocupados
        const times = reservations.map((r: any) => r.startTime);
        setOccupiedTimes(times);
        
        // Se o horário atual estiver ocupado, resetar
        if (times.includes(startTime)) {
          setStartTime("");
        }
      } catch (error) {
        console.error("Erro ao verificar horários ocupados:", error);
      }
    }
    
    if (selectedCar && date) {
      checkOccupiedTimes();
    }
  }, [date, selectedCar]);
  
  const handleCarChange = (value: string) => {
    setSelectedCar(value);
    const car = cars.find(car => car.id.toString() === value);
    if (car) {
      setFuelLevel(car.fuelLevel / 100); // Convertendo de 0-100 para 0-1
      setInitialOdometer(car.odometer || 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCar) {
      toast.error("Selecione um carro");
      return;
    }
    
    if (!date) {
      toast.error("Selecione uma data");
      return;
    }
    
    if (!startTime) {
      toast.error("Selecione um horário de retirada");
      return;
    }
    
    if (!destination.trim()) {
      toast.error("Informe o destino");
      return;
    }
    
    if (!purpose.trim()) {
      toast.error("Informe a finalidade da reserva");
      return;
    }
    
    // Verificar se o horário já está ocupado
    if (occupiedTimes.includes(startTime)) {
      toast.error("Este horário já está ocupado. Por favor, escolha outro.");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Obter o ID do usuário do localStorage
      const userStr = localStorage.getItem("solusUser");
      const user = userStr ? JSON.parse(userStr) : null;
      
      if (!user || !user.id) {
        toast.error("Usuário não identificado. Faça login novamente.");
        navigate("/login");
        return;
      }
      
      // Criar reserva via API
      await carService.createCarReservation({
        carId: selectedCar,
        date: format(date, "yyyy-MM-dd"),
        startTime,
        destination,
        purpose,
        initialOdometer, // Agora está corretamente tipado
        userId: user.id
      });
      
      toast.success("Reserva realizada com sucesso!");
      navigate("/carros");
    } catch (error: any) {
      console.error("Erro ao criar reserva:", error);
      toast.error(error.response?.data?.message || "Erro ao criar reserva");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-solus-light">
      <Header title="Solicitar Reserva de Carro" />
      
      <div className="solus-container flex-1">
        <div className="max-w-lg mx-auto bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Preencha os dados da reserva</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
              <Label htmlFor="car">Carro</Label>
              <Select 
                value={selectedCar} 
                onValueChange={handleCarChange}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um carro" />
                </SelectTrigger>
                <SelectContent>
                  {cars.map((car) => (
                    <SelectItem key={car.id} value={car.id.toString()}>
                      {car.model} - {car.plate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="mb-4">
              <Label>Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal"
                    )}
                    disabled={isLoading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, "dd/MM/yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    initialFocus
                    className="p-3"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="mb-4">
              <TimeSelect 
                label="Horário de Retirada"
                value={startTime}
                onChange={setStartTime}
                className="w-full"
                disabled={occupiedTimes}
              />
            </div>
            
            <div className="mb-4">
              <Label htmlFor="destination">Destino</Label>
              <Input
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Para onde vai"
                disabled={isLoading}
              />
            </div>
            
            <div className="mb-4">
              <Label htmlFor="purpose">Finalidade</Label>
              <Input
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Motivo da reserva"
                disabled={isLoading}
              />
            </div>
            
            <div className="mb-4">
              <Label htmlFor="initialKm">Quilometragem Inicial</Label>
              <Input
                id="initialKm"
                type="number"
                value={initialOdometer}
                onChange={(e) => setInitialOdometer(parseInt(e.target.value) || 0)}
                className="text-right"
                disabled={isLoading}
              />
              <div className="flex justify-end">
                <span className="text-xs text-gray-500">km</span>
              </div>
            </div>
            
            <div className="mb-4">
              <Label>Nível atual de combustível</Label>
              <FuelLevel 
                value={fuelLevel} 
                onChange={() => {}} 
                pinCount={10} 
                readOnly={true}
              />
              <p className="text-xs text-gray-500 mt-1">
                Nível atual de combustível (somente visualização)
              </p>
            </div>
            
            <div className="flex justify-end mt-8">
              <Button 
                type="submit" 
                className="option-button"
                disabled={isLoading}
              >
                {isLoading ? "Enviando..." : "Confirmar Reserva"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CarRequest;
