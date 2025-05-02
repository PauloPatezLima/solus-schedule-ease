
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthGuard from "./components/AuthGuard";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import RoomBooking from "./pages/RoomBooking";
import RoomRequest from "./pages/RoomRequest";
import CarBooking from "./pages/CarBooking";
import CarRequest from "./pages/CarRequest";
import CarReturn from "./pages/CarReturn";
import AdminDashboard from "./pages/Admin/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Rotas protegidas - usuário comum */}
          <Route 
            path="/" 
            element={
              <AuthGuard>
                <Index />
              </AuthGuard>
            } 
          />
          <Route 
            path="/salas" 
            element={
              <AuthGuard>
                <RoomBooking />
              </AuthGuard>
            } 
          />
          <Route 
            path="/salas/solicitar" 
            element={
              <AuthGuard>
                <RoomRequest />
              </AuthGuard>
            } 
          />
          <Route 
            path="/carros" 
            element={
              <AuthGuard>
                <CarBooking />
              </AuthGuard>
            } 
          />
          <Route 
            path="/carros/solicitar" 
            element={
              <AuthGuard>
                <CarRequest />
              </AuthGuard>
            } 
          />
          <Route 
            path="/carros/devolver" 
            element={
              <AuthGuard>
                <CarReturn />
              </AuthGuard>
            } 
          />
          
          {/* Rotas protegidas - apenas admin */}
          <Route 
            path="/admin" 
            element={
              <AuthGuard requireAdmin={true}>
                <AdminDashboard />
              </AuthGuard>
            } 
          />
          
          {/* Página não encontrada */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
