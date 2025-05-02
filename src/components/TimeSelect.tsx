
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface TimeSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const TimeSelect = ({ label, value, onChange, className }: TimeSelectProps) => {
  // Generate hours (8:00 to 18:00)
  const hours = [];
  for (let i = 8; i <= 18; i++) {
    const hour = i < 10 ? `0${i}` : `${i}`;
    // Only include minutes 00, 15, 30, 45
    ["00", "15", "30", "45"].forEach(minute => {
      hours.push(`${hour}:${minute}`);
    });
  }

  return (
    <div className={cn("mb-4", className)}>
      <Label htmlFor={label}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione o horário" />
        </SelectTrigger>
        <SelectContent>
          {hours.map((time) => (
            <SelectItem key={time} value={time}>
              {time}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeSelect;
