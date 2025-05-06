
import React, { useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface TimeSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: string[];
}

const TimeSelect = ({ label, value, onChange, className, disabled = [] }: TimeSelectProps) => {
  // Generate all 24 hours with 15-minute intervals
  const hours = [];
  for (let i = 0; i < 24; i++) {
    const hour = i < 10 ? `0${i}` : `${i}`;
    // Include minutes 00, 15, 30, 45
    ["00", "15", "30", "45"].forEach(minute => {
      hours.push(`${hour}:${minute}`);
    });
  }
  
  // Find closest time to current time
  useEffect(() => {
    if (!value) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      // Round up to the nearest 15 min
      let nearestMinute = Math.ceil(currentMinute / 15) * 15;
      let nearestHour = currentHour;
      
      if (nearestMinute === 60) {
        nearestMinute = 0;
        nearestHour = (nearestHour + 1) % 24;
      }
      
      const hourStr = nearestHour < 10 ? `0${nearestHour}` : `${nearestHour}`;
      const minuteStr = nearestMinute === 0 ? "00" : `${nearestMinute}`;
      const nearestTime = `${hourStr}:${minuteStr}`;
      
      // Check if the time is available (not in disabled list)
      if (!disabled.includes(nearestTime)) {
        onChange(nearestTime);
      } else {
        // If the nearest time is disabled, find the next available time
        const nearestTimeIndex = hours.indexOf(nearestTime);
        let nextAvailableTime = null;
        
        for (let i = nearestTimeIndex; i < hours.length; i++) {
          if (!disabled.includes(hours[i])) {
            nextAvailableTime = hours[i];
            break;
          }
        }
        
        if (nextAvailableTime) {
          onChange(nextAvailableTime);
        }
      }
    }
  }, []);

  return (
    <div className={cn("mb-4", className)}>
      <Label htmlFor={label}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione o horário" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {hours.map((time) => (
            <SelectItem 
              key={time} 
              value={time}
              disabled={disabled.includes(time)}
            >
              {time} {disabled.includes(time) ? "(Ocupado)" : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeSelect;
