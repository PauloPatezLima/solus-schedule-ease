
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
  { id: 3, name: "Sala Colab (Aquário)" }
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
  const [occupiedTimes, setOccupiedTimes] = useState<string[]>([]);

  // Efeito para mostrar toast quando sala for selecionada via query param
  useEffect(() => {
    if (roomId && roomName) {
      const room = roomOptions.find(room => room.id.toString() === roomId);
      if (room) {
        toast.info(`Sala ${decodeURIComponent(roomName)} selecionada`);
      }
    }
    
    // Verificar horários ocupados para o dia selecionado
    if (date) {
      updateOccupiedTimes(date);
    }
  }, [roomId, roomName]);

  // Atualizar horários ocupados quando a data mudar
  useEffect(() => {
    if (date) {
      updateOccupiedTimes(date);
    }
  }, [date]);
  
  // Reset end time when start time changes
  useEffect(() => {
    if (startTime) {
      setEndTime("");
    }
  }, [startTime]);
  
  const updateOccupiedTimes = (selectedDate: Date) => {
    const reservations = JSON.parse(localStorage.getItem("roomReservations") || "[]");
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    
    // Get all reserved time slots for the selected date and room
    const reservationsForDay = reservations.filter((r: any) => 
      r.date === dateStr && 
      (selectedRoom ? r.roomId === selectedRoom : true)
    );
    
    // Extract all occupied time slots (including slots between start and end)
    const occupiedSlots: string[] = [];
    
    reservationsForDay.forEach((reservation: any) => {
      const [startHour, startMinute] = reservation.startTime.split(':').map(Number);
      const [endHour, endMinute] = reservation.endTime.split(':').map(Number);
      
      const startTotalMinutes = startHour * 60 + startMinute;
      const endTotalMinutes = endHour * 60 + endMinute;
      
      // Mark all time slots between start and end as occupied
      for (let i = 0; i < 96; i++) { // 24 hours * 4 (15-minute intervals)
        const hour = Math.floor(i / 4);
        const minute = (i % 4) * 15;
        const totalMinutes = hour * 60 + minute;
        
        if (totalMinutes >= startTotalMinutes && totalMinutes <= endTotalMinutes) {
          const hourStr = hour < 10 ? `0${hour}` : `${hour}`;
          const minuteStr = minute === 0 ? "00" : `${minute}`;
          occupiedSlots.push(`${hourStr}:${minuteStr}`);
        }
      }
    });
    
    setOccupiedTimes(occupiedSlots);
    
    // Reset times if they're now occupied
    if (occupiedSlots.includes(startTime)) {
      setStartTime("");
    }
    if (occupiedSlots.includes(endTime)) {
      setEndTime("");
    }
  };

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
    
    // Register reservation
    const reservations = JSON.parse(localStorage.getItem("roomReservations") || "[]");
    const newReservation = {
      id: Date.now(),
      roomId: selectedRoom,
      date: format(date, "yyyy-MM-dd"),
      startTime,
      endTime,
      userId: JSON.parse(localStorage.getItem("solusUser") || '{"id": 1}').id
    };
    
    reservations.push(newReservation);
    localStorage.setItem("roomReservations", JSON.stringify(reservations));
    
    // Update room availability
    const roomsData = JSON.parse(localStorage.getItem("solusRooms") || "[]");
    const updatedRooms = roomsData.map((room: any) => {
      if (room.id.toString() === selectedRoom) {
        return { ...room, isAvailable: false };
      }
      return room;
    });
    
    localStorage.setItem("solusRooms", JSON.stringify(updatedRooms));
    
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
                onValueChange={(value) => {
                  setSelectedRoom(value);
                  // Update occupied times when room changes
                  if (date) {
                    updateOccupiedTimes(date);
                  }
                }}
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
                    onSelect={(newDate) => {
                      if (newDate) {
                        setDate(newDate);
                        updateOccupiedTimes(newDate);
                      }
                    }}
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
              disabled={occupiedTimes}
            />
            
            <TimeSelect 
              label="Horário de Fim" 
              value={endTime} 
              onChange={setEndTime} 
              disabled={occupiedTimes}
              minTime={startTime} // This enforces end time to be after start time
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
