
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const AuthGuard = ({ children, requireAdmin = false }: AuthGuardProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const userJson = localStorage.getItem("solusUser");
    
    if (!userJson) {
      // Usuário não está logado, redirecionar para login
      navigate("/login");
      return;
    }
    
    if (requireAdmin) {
      const user = JSON.parse(userJson);
      if (!user.isAdmin) {
        // Usuário não é admin, redirecionar para home
        navigate("/");
        return;
      }
    }
  }, [navigate, requireAdmin]);

  return <>{children}</>;
};

export default AuthGuard;
