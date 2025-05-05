
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
        isAvailable ? "bg-solus-secondary/20 border-solus-secondary text-solus-dark" : "bg-solus-warning/20 border-solus-warning text-solus-dark"
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between">
        <h3 className="font-semibold text-lg mb-1 sm:mb-0">{name}</h3>
        <span className={`text-sm rounded-full px-3 py-1 inline-block w-max ${
          isAvailable ? "bg-solus-secondary/20 text-solus-secondary" : "bg-solus-warning/20 text-solus-warning"
        }`}>
          {isAvailable ? "Disponível" : "Ocupado"}
        </span>
      </div>
      {details && <p className="text-sm mt-1 opacity-90">{details}</p>}
      <div className="mt-2 text-sm">
        {resourceType === "room" ? "Sala" : "Carro"} • Clique para detalhes
      </div>
    </div>
  );
};

export default ResourceCard;
