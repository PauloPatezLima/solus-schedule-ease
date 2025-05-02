
interface ResourceCardProps {
  name: string;
  isAvailable: boolean;
  resourceType: "room" | "car";
  details?: string;
  onClick: () => void;
}

const ResourceCard = ({ 
  name, 
  isAvailable, 
  resourceType, 
  details,
  onClick 
}: ResourceCardProps) => {
  return (
    <div 
      className={`rounded-lg p-4 mb-4 cursor-pointer transition-all hover:shadow-lg border ${
        isAvailable ? "resource-available" : "resource-unavailable"
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between">
        <h3 className="font-semibold text-lg">{name}</h3>
        <span className="text-sm rounded-full px-3 py-1 bg-white/20">
          {isAvailable ? "Disponível" : "Ocupado"}
        </span>
      </div>
      {details && <p className="text-sm mt-1 text-white/90">{details}</p>}
      <div className="mt-2 text-sm">
        {resourceType === "room" ? "Sala" : "Carro"} • Clique para detalhes
      </div>
    </div>
  );
};

export default ResourceCard;
