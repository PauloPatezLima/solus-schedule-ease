
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
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const roomOptions = [
  { id: 1, name: "Sala de Reunião" },
  { id: 2, name: "Sala Coworking" },
  { id: 3, name: "Sala Colab" }
];

const RoomRequest = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId");
  const roomName = searchParams.get("roomName");
  
  const [selectedRoom, setSelectedRoom] = useState(roomId || "");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!selectedRoom) {
      toast.error("Selecione uma sala");
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
    
    if (!endTime) {
      toast.error("Selecione o horário de fim");
      return;
    }
    
    // Success message and redirect
    toast.success("Agendamento solicitado com sucesso!");
    navigate("/salas");
  };

  return (
    <div className="min-h-screen flex flex-col bg-solus-light">
      <Header title="Solicitar Agendamento de Sala" />
      
      <div className="solus-container flex-1">
        <div className="max-w-lg mx-auto bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Preencha os dados da solicitação</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="room">Sala</Label>
              <Select 
                value={selectedRoom} 
                onValueChange={setSelectedRoom}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma sala" />
                </SelectTrigger>
                <SelectContent>
                  {roomOptions.map((room) => (
                    <SelectItem key={room.id} value={room.id.toString()}>
                      {room.name}
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
            
            <TimeSelect 
              label="Horário de Fim" 
              value={endTime} 
              onChange={setEndTime} 
            />
            
            <div className="flex justify-end mt-8">
              <Button type="submit" className="option-button">
                Confirmar Agendamento
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoomRequest;
