
import { useState } from "react";

interface FuelLevelProps {
  value: number;
  onChange: (value: number) => void;
}

const FuelLevel = ({ value, onChange }: FuelLevelProps) => {
  const levels = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="my-4">
      <label className="block text-sm font-medium mb-2">Nível de Combustível</label>
      <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg">
        <div className="w-full flex justify-between items-center h-8">
          {levels.map((level, index) => (
            <button
              key={index}
              className={`w-6 h-6 rounded-full border-2 transition-all ${
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
        <span>1/4</span>
        <span>1/2</span>
        <span>3/4</span>
        <span>Cheio</span>
      </div>
    </div>
  );
};

export default FuelLevel;
