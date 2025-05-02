
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RoomBooking from "./pages/RoomBooking";
import RoomRequest from "./pages/RoomRequest";
import CarBooking from "./pages/CarBooking";
import CarRequest from "./pages/CarRequest";
import CarReturn from "./pages/CarReturn";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/salas" element={<RoomBooking />} />
          <Route path="/salas/solicitar" element={<RoomRequest />} />
          <Route path="/carros" element={<CarBooking />} />
          <Route path="/carros/solicitar" element={<CarRequest />} />
          <Route path="/carros/devolver" element={<CarReturn />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
