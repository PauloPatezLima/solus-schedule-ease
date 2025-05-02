
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const carOptions = [
  { id: 1, name: "Fiat Mobi", lastUsed: true, fuelLevel: 0.8, fuelPins: 5, odometer: 15420 },
  { id: 2, name: "VW Gol", lastUsed: false, fuelLevel: 0.6, fuelPins: 8, odometer: 45680 },
  { id: 3, name: "Renault Kwid", lastUsed: false, fuelLevel: 0.5, fuelPins: 6, odometer: 12350 },
  { id: 4, name: "Fiat Argo", lastUsed: false, fuelLevel: 0.9, fuelPins: 12, odometer: 8750 }
];

const CarRequest = () => {
  const navigate = useNavigate();
  const [selectedCar, setSelectedCar] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [fuelLevel, setFuelLevel] = useState(0);
  const [fuelPins, setFuelPins] = useState(5);
  const [initialOdometer, setInitialOdometer] = useState(0);
  
  // Auto-select the last used car
  useEffect(() => {
    const lastUsedCar = carOptions.find(car => car.lastUsed);
    if (lastUsedCar) {
      setSelectedCar(lastUsedCar.id.toString());
      setFuelLevel(lastUsedCar.fuelLevel);
      setFuelPins(lastUsedCar.fuelPins);
      setInitialOdometer(lastUsedCar.odometer);
    }
  }, []);

  const handleCarChange = (value: string) => {
    setSelectedCar(value);
    const car = carOptions.find(car => car.id.toString() === value);
    if (car) {
      setFuelLevel(car.fuelLevel);
      setFuelPins(car.fuelPins);
      setInitialOdometer(car.odometer);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
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
    
    // Success message and redirect
    toast.success("Reserva realizada com sucesso!");
    navigate("/carros");
  };

  return (
    <div className="min-h-screen flex flex-col bg-solus-light">
      <Header title="Solicitar Reserva de Carro" />
      
      <div className="solus-container flex-1">
        <div className="max-w-lg mx-auto bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Preencha os dados da reserva</h2>
          
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
                      {car.name} {car.lastUsed ? " (Último reservado)" : ""}
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
              <Label>Horário de Retirada</Label>
              <TimeSelect 
                label="Horário de Retirada"
                value={startTime}
                onChange={setStartTime}
                className="w-full"
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
              />
              <div className="flex justify-end">
                <span className="text-xs text-gray-500">km</span>
              </div>
            </div>
            
            <FuelLevel 
              value={fuelLevel} 
              onChange={() => {}} 
              pinCount={fuelPins} 
            />
            <p className="text-xs text-gray-500 mt-1">
              Nível atual de combustível (somente visualização)
            </p>
            
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
