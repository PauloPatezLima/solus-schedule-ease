
import { useState } from "react";

interface FuelLevelProps {
  value: number;
  onChange: (value: number) => void;
  pinCount?: number;
}

const FuelLevel = ({ value, onChange, pinCount = 5 }: FuelLevelProps) => {
  // Gerar os níveis baseado no número de pinos
  const generateLevels = () => {
    const levels = [];
    for (let i = 0; i < pinCount; i++) {
      levels.push(i / (pinCount - 1));
    }
    return levels;
  };

  const levels = generateLevels();

  return (
    <div className="my-4">
      <label className="block text-sm font-medium mb-2">Nível de Combustível</label>
      <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg">
        <div className="w-full flex justify-between items-center h-8">
          {levels.map((level, index) => (
            <button
              key={index}
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                value >= level 
                  ? 'bg-solus-primary border-solus-primary' 
                  : 'bg-white border-gray-300'
              }`}
              onClick={() => onChange(level)}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>Vazio</span>
        <span className="ml-auto">Cheio</span>
      </div>
    </div>
  );
};

export default FuelLevel;
