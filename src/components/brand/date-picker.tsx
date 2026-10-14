import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
export function DatePicker({
  value,
  onChange,
  future = false,
}: {
  value: string;
  onChange: (v: string) => void;
  future?: boolean;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" className="justify-start font-normal w-full h-11">
          <CalendarIcon />
          {value || "Choose a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          className="pointer-events-auto"
          mode="single"
          selected={value ? new Date(`${value}T12:00:00`) : undefined}
          onSelect={(d) => onChange(d ? format(d, "yyyy-MM-dd") : "")}
          disabled={future ? { before: new Date(new Date().setHours(0, 0, 0, 0)) } : undefined}
        />
      </PopoverContent>
    </Popover>
  );
}
