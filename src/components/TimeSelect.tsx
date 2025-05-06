
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
  minTime?: string;  // New prop to enforce minimum time selection
}

const TimeSelect = ({ 
  label, 
  value, 
  onChange, 
  className, 
  disabled = [], 
  minTime 
}: TimeSelectProps) => {
  // Generate all 24 hours with 15-minute intervals
  const hours = [];
  for (let i = 0; i < 24; i++) {
    const hour = i < 10 ? `0${i}` : `${i}`;
    // Include minutes 00, 15, 30, 45
    ["00", "15", "30", "45"].forEach(minute => {
      hours.push(`${hour}:${minute}`);
    });
  }
  
  // Filter available hours based on minTime if provided
  const availableHours = minTime 
    ? hours.filter(time => {
        // Convert times to comparable format (minutes since midnight)
        const [minHour, minMinute] = minTime.split(':').map(Number);
        const [timeHour, timeMinute] = time.split(':').map(Number);
        
        const minTotalMinutes = minHour * 60 + minMinute;
        const timeTotalMinutes = timeHour * 60 + timeMinute;
        
        return timeTotalMinutes > minTotalMinutes;
      }) 
    : hours;
  
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
      
      // Check if the time is available (not in disabled list) and respects minTime
      const isAvailable = !disabled.includes(nearestTime);
      const respectsMinTime = minTime ? compareTimeStrings(nearestTime, minTime) > 0 : true;
      
      if (isAvailable && respectsMinTime) {
        onChange(nearestTime);
      } else {
        // If the nearest time is disabled or before minTime, find the next available time
        let nextAvailableTime = null;
        
        for (const time of hours) {
          if (!disabled.includes(time) && (!minTime || compareTimeStrings(time, minTime) > 0)) {
            nextAvailableTime = time;
            break;
          }
        }
        
        if (nextAvailableTime) {
          onChange(nextAvailableTime);
        }
      }
    }
  }, [minTime, disabled]);

  // Utility function to compare time strings
  const compareTimeStrings = (time1: string, time2: string): number => {
    const [hour1, minute1] = time1.split(':').map(Number);
    const [hour2, minute2] = time2.split(':').map(Number);
    
    const time1Minutes = hour1 * 60 + minute1;
    const time2Minutes = hour2 * 60 + minute2;
    
    return time1Minutes - time2Minutes;
  };

  return (
    <div className={cn("mb-4", className)}>
      <Label htmlFor={label}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione o horário" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {(minTime ? availableHours : hours).map((time) => (
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
