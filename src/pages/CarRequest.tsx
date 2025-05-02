
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TimeSelect from "@/components/TimeSelect";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Car } from "lucide-react";
import { cn } from "@/lib/utils";

const carOptions = [
  { id: 1, name: "Fiat Mobi", fuelLevel: 0.75, odometer: 15420 },
  { id: 2, name: "VW Gol", fuelLevel: 0.5, odometer: 45680 },
  { id: 3, name: "Renault Kwid", fuelLevel: 1, odometer: 12350 },
  { id: 4, name: "Fiat Argo", fuelLevel: 0.8, odometer: 8750 }
];

const CarRequest = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const carId = searchParams.get("carId");
  const carName = searchParams.get("carName");
  const fuelLevel = searchParams.get("fuelLevel");
  
  const [selectedCar, setSelectedCar] = useState(carId || "");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState("");
  const [initialOdometer, setInitialOdometer] = useState(0);
  const [currentFuelLevel, setCurrentFuelLevel] = useState(
    fuelLevel ? parseFloat(fuelLevel) : 0
  );

  const getFuelLevelText = (level: number) => {
    if (level === 0) return "Vazio";
    if (level === 0.25) return "1/4";
    if (level === 0.5) return "1/2";
    if (level === 0.75) return "3/4";
    if (level === 1) return "Cheio";
    return "";
  };

  const handleCarChange = (value: string) => {
    setSelectedCar(value);
    const selectedCarData = carOptions.find(car => car.id.toString() === value);
    if (selectedCarData) {
      setCurrentFuelLevel(selectedCarData.fuelLevel);
      setInitialOdometer(selectedCarData.odometer);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!selectedCar) {
      toast.error("Selecione um carro");
      return;
    }
    
    if (!date) {
      toast.error("Selecione uma data");
      return;
    }
    
    if (!startTime) {
      toast.error("Selecione o horário de início");
      return;
    }
    
    // Success message and redirect
    toast.success("Reserva solicitada com sucesso!");
    navigate("/carros");
  };

  return (
    <div className="min-h-screen flex flex-col bg-solus-light">
      <Header title="Solicitar Reserva de Carro" />
      
      <div className="solus-container flex-1">
        <div className="max-w-lg mx-auto bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Preencha os dados da solicitação</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="car">Carro</Label>
              <Select 
                value={selectedCar} 
                onValueChange={handleCarChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um carro" />
                </SelectTrigger>
                <SelectContent>
                  {carOptions.map((car) => (
                    <SelectItem key={car.id} value={car.id.toString()}>
                      {car.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedCar && (
              <div className="mb-4 p-3 bg-gray-100 rounded-md">
                <p className="text-sm">
                  <strong>Nível de Combustível Atual:</strong> {getFuelLevelText(currentFuelLevel)}
                </p>
              </div>
            )}
            
            <div className="mb-4">
              <Label>Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd/MM/yyyy") : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    className="p-3"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <TimeSelect 
              label="Horário de Início" 
              value={startTime} 
              onChange={setStartTime} 
            />
            
            <div className="mb-4">
              <Label htmlFor="initialKm">Quilometragem Inicial</Label>
              <Input
                id="initialKm"
                type="number"
                value={initialOdometer}
                onChange={(e) => setInitialOdometer(parseInt(e.target.value) || 0)}
                className="text-right"
              />
              <div className="flex justify-end">
                <span className="text-xs text-gray-500">km</span>
              </div>
            </div>
            
            <div className="flex justify-end mt-8">
              <Button type="submit" className="option-button">
                Confirmar Reserva
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CarRequest;
