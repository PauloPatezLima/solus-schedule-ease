
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ResourceCard from "@/components/ResourceCard";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

// Dummy data for room availability
const initialRoomsData = [
  { id: 1, name: "Sala de Reunião", isAvailable: true, capacity: "10 pessoas" },
  { id: 2, name: "Sala Coworking", isAvailable: false, capacity: "8 pessoas" },
  { id: 3, name: "Sala Colab (Aquário)", isAvailable: true, capacity: "6 pessoas" }
];

const RoomBooking = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [rooms, setRooms] = useState(() => {
    const savedRooms = localStorage.getItem("solusRooms");
    return savedRooms ? JSON.parse(savedRooms) : initialRoomsData;
  });
  const today = new Date();

  // Salvar salas no localStorage
  useEffect(() => {
    localStorage.setItem("solusRooms", JSON.stringify(rooms));
  }, [rooms]);
  
  return (
    <div className="min-h-screen flex flex-col bg-solus-light">
      <Header title="Agendamento de Salas" />
      
      <div className="solus-container flex-1">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Status do Dia</h2>
          <p className="text-gray-600 mb-4">
            {format(today, "dd 'de' MMMM 'de' yyyy")}
          </p>
          
          <div className="divide-y">
            {rooms.map(room => (
              <ResourceCard
                key={room.id}
                name={room.name}
                isAvailable={room.isAvailable}
                resourceType="room"
                details={`Capacidade: ${room.capacity}`}
                onClick={() => {
                  if (room.isAvailable) {
                    navigate(`/salas/solicitar?roomId=${room.id}&roomName=${encodeURIComponent(room.name)}`);
                  } else {
                    toast.error("Esta sala já está reservada");
                  }
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button 
            className="option-button"
            onClick={() => navigate("/salas/solicitar")}
          >
            Solicitar Agendamento
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoomBooking;
