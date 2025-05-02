
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
}

const Header = ({ title, showBackButton = true }: HeaderProps) => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userJson = localStorage.getItem("solusUser");
    if (userJson) {
      const user = JSON.parse(userJson);
      setIsAdmin(user.isAdmin);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("solusUser");
    navigate("/login");
  };

  return (
    <div className="bg-solus-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          {showBackButton && (
            <button 
              onClick={() => navigate(-1)} 
              className="mr-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              ← Voltar
            </button>
          )}
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {isAdmin && (
            <button
              onClick={() => navigate("/admin")}
              className="p-2 hover:bg-white/20 rounded-md transition-colors text-sm"
            >
              Painel Admin
            </button>
          )}
          
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-white/20 rounded-md transition-colors text-sm"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
