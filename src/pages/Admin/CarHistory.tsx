
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Dados simulados de histórico de carros
const carBookings = [
  {
    id: 1,
    user: "Usuário Teste",
    car: "Fiat Mobi",
    requestDate: "01/05/2025",
    requestTime: "09:00",
    returnDate: "01/05/2025",
    returnTime: "17:30",
    initialKm: 15420,
    finalKm: 15498,
    fuelLevel: "0.8",
  },
  {
    id: 2,
    user: "Administrador",
    car: "VW Gol",
    requestDate: "02/05/2025",
    requestTime: "08:30",
    returnDate: "02/05/2025",
    returnTime: "14:15",
    initialKm: 45680,
    finalKm: 45720,
    fuelLevel: "0.6",
  },
  {
    id: 3,
    user: "Usuário Teste",
    car: "Renault Kwid",
    requestDate: "03/05/2025",
    requestTime: "10:00",
    returnDate: null,
    returnTime: null,
    initialKm: 12350,
    finalKm: null,
    fuelLevel: null,
  }
];

const CarHistory = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Reservas de Carros</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Carro</TableHead>
              <TableHead>Data Retirada</TableHead>
              <TableHead>Data Devolução</TableHead>
              <TableHead>Km Inicial</TableHead>
              <TableHead>Km Final</TableHead>
              <TableHead>Nível Combustível</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {carBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.user}</TableCell>
                <TableCell>{booking.car}</TableCell>
                <TableCell>
                  {booking.requestDate} - {booking.requestTime}
                </TableCell>
                <TableCell>
                  {booking.returnDate 
                    ? `${booking.returnDate} - ${booking.returnTime}`
                    : "Em uso"}
                </TableCell>
                <TableCell>{booking.initialKm} km</TableCell>
                <TableCell>
                  {booking.finalKm ? `${booking.finalKm} km` : "-"}
                </TableCell>
                <TableCell>
                  {booking.fuelLevel 
                    ? `${parseInt((parseFloat(booking.fuelLevel) * 100).toString())}%` 
                    : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CarHistory;
