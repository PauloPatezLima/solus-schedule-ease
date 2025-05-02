
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
}

const Header = ({ title, showBackButton = true }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-solus-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center">
        {showBackButton && (
          <button 
            onClick={() => navigate(-1)} 
            className="mr-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            ← Voltar
          </button>
        )}
        <h1 className="text-xl font-bold flex-1 text-center">{title}</h1>
      </div>
    </div>
  );
};

export default Header;
