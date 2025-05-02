
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Dados simulados de histórico de salas
const roomBookings = [
  {
    id: 1,
    user: "Usuário Teste",
    room: "Sala de Reunião",
    date: "02/05/2025",
    startTime: "09:00",
    endTime: "10:30",
    status: "Concluído"
  },
  {
    id: 2,
    user: "Usuário Teste",
    room: "Sala Coworking",
    date: "03/05/2025",
    startTime: "14:00",
    endTime: "15:30",
    status: "Agendado"
  },
  {
    id: 3,
    user: "Administrador",
    room: "Sala Colab",
    date: "01/05/2025",
    startTime: "10:00",
    endTime: "11:00",
    status: "Concluído"
  }
];

const RoomHistory = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Reservas de Salas</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Sala</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Horário Início</TableHead>
              <TableHead>Horário Fim</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roomBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.user}</TableCell>
                <TableCell>{booking.room}</TableCell>
                <TableCell>{booking.date}</TableCell>
                <TableCell>{booking.startTime}</TableCell>
                <TableCell>{booking.endTime}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs 
                    ${booking.status === 'Concluído' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'}`}
                  >
                    {booking.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RoomHistory;
