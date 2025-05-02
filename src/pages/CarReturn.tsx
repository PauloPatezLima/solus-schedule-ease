
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FuelLevel from "@/components/FuelLevel";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const carOptions = [
  { id: 1, name: "Fiat Mobi", lastUsed: true },
  { id: 2, name: "VW Gol", lastUsed: false },
  { id: 3, name: "Renault Kwid", lastUsed: false }
];

const CarReturn = () => {
  const navigate = useNavigate();
  const [selectedCar, setSelectedCar] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [fuelLevel, setFuelLevel] = useState(0.5);
  
  // Set current time with zeroed seconds
  const now = new Date();
  now.setSeconds(0);
  const formattedTime = format(now, "HH:mm");
  const [returnTime, setReturnTime] = useState(formattedTime);
  
  // Auto-select the last used car
  useEffect(() => {
    const lastUsedCar = carOptions.find(car => car.lastUsed);
    if (lastUsedCar) {
      setSelectedCar(lastUsedCar.id.toString());
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!selectedCar) {
      toast.error("Selecione um carro");
      return;
    }
    
    // Success message and redirect
    toast.success("Devolução registrada com sucesso!");
    navigate("/carros");
  };

  return (
    <div className="min-h-screen flex flex-col bg-solus-light">
      <Header title="Registrar Devolução de Carro" />
      
      <div className="solus-container flex-1">
        <div className="max-w-lg mx-auto bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Preencha os dados da devolução</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="car">Carro</Label>
              <Select 
                value={selectedCar} 
                onValueChange={setSelectedCar}
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
              <Label>Horário de Devolução (Atual)</Label>
              <div className="bg-gray-100 p-3 rounded-md">
                {returnTime}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Horário atual registrado automaticamente
              </p>
            </div>
            
            <FuelLevel value={fuelLevel} onChange={setFuelLevel} />
            
            <div className="flex justify-end mt-8">
              <Button type="submit" className="option-button">
                Confirmar Devolução
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CarReturn;
