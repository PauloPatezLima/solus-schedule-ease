
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Simulação de dados de usuário
const users = [
  { email: "admin@solus.com", password: "admin123", isAdmin: true },
  { email: "usuario@solus.com", password: "user123", isAdmin: false },
];

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulando uma verificação de login
    setTimeout(() => {
      const user = users.find(
        (user) => user.email === email && user.password === password
      );

      if (user) {
        // Armazenando dados do usuário logado
        localStorage.setItem("solusUser", JSON.stringify({ 
          email: user.email, 
          isAdmin: user.isAdmin 
        }));
        
        toast.success("Login realizado com sucesso!");
        
        if (user.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        toast.error("Email ou senha inválidos");
      }
      
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-solus-light flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-solus-primary rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <span className="text-white font-bold text-2xl">SC</span>
          </div>
          <h1 className="text-2xl font-bold text-solus-primary">
            Solus Convenience
          </h1>
          <p className="text-gray-600 mt-2">Faça login para continuar</p>
        </div>

        <Card className="border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais para acessar
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">
                  Senha
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full"
                />
              </div>
            </form>
          </CardContent>
          
          <CardFooter>
            <Button 
              onClick={handleSubmit}
              disabled={isLoading} 
              className="w-full bg-solus-primary hover:bg-solus-primary/90"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
