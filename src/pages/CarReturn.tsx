
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FuelLevel from "@/components/FuelLevel";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { carService } from "@/services/api";

interface CarReservation {
  id: number;
  carId: number;
  car?: {
    id: number;
    model: string;
    plate: string;
    fuelLevel: number;
    odometer: number;
  };
  initialOdometer: number;
  startTime: string;
  date: string;
  userId: number;
}

const CarReturn = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<CarReservation[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [fuelLevel, setFuelLevel] = useState(0.5);
  const [finalOdometer, setFinalOdometer] = useState(0);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Set current time with zeroed seconds
  const now = new Date();
  now.setSeconds(0);
  const formattedTime = format(now, "HH:mm");
  const [returnTime, setReturnTime] = useState(formattedTime);
  
  // Buscar reservas ativas do usuário atual
  useEffect(() => {
    async function loadUserReservations() {
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
        
        // Buscar reservas ativas do usuário
        const response = await carService.getCarReservations({
          userId: user.id.toString()
        });
        
        // Filtrar apenas reservas não devolvidas
        const activeReservations = response.filter((r: any) => r.returned === false);
        
        // Buscar detalhes dos carros para cada reserva
        const reservationsWithCarDetails = await Promise.all(
          activeReservations.map(async (reservation: any) => {
            try {
              const carData = await carService.getCar(reservation.carId);
              return {
                ...reservation,
                car: carData
              };
            } catch (error) {
              console.error("Erro ao buscar detalhes do carro:", error);
              return reservation;
            }
          })
        );
        
        setReservations(reservationsWithCarDetails);
        
        // Se houver apenas uma reserva, selecioná-la automaticamente
        if (reservationsWithCarDetails.length === 1) {
          const reservation = reservationsWithCarDetails[0];
          setSelectedReservation(reservation.id.toString());
          setFinalOdometer(reservation.initialOdometer);
          
          if (reservation.car) {
            setFuelLevel(reservation.car.fuelLevel / 100); // Convertendo de 0-100 para 0-1
          }
        }
      } catch (error) {
        console.error("Erro ao carregar reservas:", error);
        toast.error("Erro ao carregar suas reservas ativas");
      } finally {
        setIsLoading(false);
      }
    }
    
    loadUserReservations();
  }, [navigate]);

  const handleReservationChange = (value: string) => {
    setSelectedReservation(value);
    const reservation = reservations.find(r => r.id.toString() === value);
    
    if (reservation) {
      setFinalOdometer(reservation.initialOdometer);
      
      if (reservation.car) {
        setFuelLevel(reservation.car.fuelLevel / 100); // Convertendo de 0-100 para 0-1
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedReservation) {
      toast.error("Selecione uma reserva");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Enviar dados da devolução
      await carService.returnCar({
        reservationId: parseInt(selectedReservation),
        returnTime,
        endTime: returnTime, // Mesmo horário para retorno e fim
        fuelLevel: Math.round(fuelLevel * 100), // Convertendo de 0-1 para 0-100
        finalOdometer,
        notes
      });
      
      // Success message and redirect
      toast.success("Devolução registrada com sucesso!");
      navigate("/carros");
    } catch (error: any) {
      console.error("Erro ao registrar devolução:", error);
      toast.error(error.response?.data?.message || "Erro ao registrar devolução");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-solus-light">
      <Header title="Registrar Devolução de Carro" />
      
      <div className="solus-container flex-1">
        <div className="max-w-lg mx-auto bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Preencha os dados da devolução</h2>
          
          {reservations.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-gray-500">
                Você não possui reservas ativas para devolução.
              </p>
              <Button 
                onClick={() => navigate("/carros")}
                className="mt-4"
              >
                Voltar para Carros
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Label htmlFor="reservation">Reserva</Label>
                <Select 
                  value={selectedReservation} 
                  onValueChange={handleReservationChange}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione uma reserva" />
                  </SelectTrigger>
                  <SelectContent>
                    {reservations.map((reservation) => (
                      <SelectItem key={reservation.id} value={reservation.id.toString()}>
                        {reservation.car?.model || `Carro ID: ${reservation.carId}`} - {format(new Date(reservation.date), "dd/MM/yyyy")} {reservation.startTime}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mb-4">
                <Label>Data de Devolução</Label>
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
                <Label>Horário de Devolução (Atual)</Label>
                <div className="bg-gray-100 p-3 rounded-md">
                  {returnTime}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Horário atual registrado automaticamente
                </p>
              </div>
              
              <div className="mb-4">
                <Label htmlFor="finalKm">Quilometragem Final</Label>
                <Input
                  id="finalKm"
                  type="number"
                  value={finalOdometer}
                  onChange={(e) => setFinalOdometer(parseInt(e.target.value) || 0)}
                  className="text-right"
                  disabled={isLoading}
                />
                <div className="flex justify-end">
                  <span className="text-xs text-gray-500">km</span>
                </div>
              </div>
              
              <div className="mb-4">
                <Label htmlFor="notes">Observações</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Observações sobre o carro (opcional)"
                  disabled={isLoading}
                />
              </div>
              
              <div className="mb-4">
                <Label>Nível de Combustível</Label>
                <FuelLevel value={fuelLevel} onChange={setFuelLevel} pinCount={10} />
                <p className="text-xs text-gray-500 mt-1">
                  Indique o nível atual de combustível
                </p>
              </div>
              
              <div className="flex justify-end mt-8">
                <Button 
                  type="submit" 
                  className="option-button"
                  disabled={isLoading}
                >
                  {isLoading ? "Processando..." : "Confirmar Devolução"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarReturn;
