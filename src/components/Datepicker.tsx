import { CalendarIcon } from "lucide-react";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [stringDate, setStringDate] = useState<string>(value);
  const [date, setDate] = useState<Date>(value ? parseISO(value) : new Date());
  const [errorMessage, setErrorMessage] = useState<string>("");

  return (
    <Popover>
      <div className="relative w-[280px]">
        <Input
          type="text"
          value={stringDate}
          className="text-white"
          placeholder="MM/DD/YYYY"
          onChange={(e) => {
            setStringDate(e.target.value);
            const parsedDate = new Date(e.target.value);
            if (parsedDate.toString() === "Invalid Date") {
              setErrorMessage("Invalid Date");
              setDate(new Date());
            } else {
              setErrorMessage("");
              setDate(parsedDate);
              onChange(format(parsedDate, "MM/dd/yyyy"));
            }
          }}
        />
        {errorMessage !== "" && (
          <div className="absolute left-[18rem] top-1/2 -translate-y-1/2 text-red-700 text-sm">
            {errorMessage}
          </div>
        )}
        <PopoverTrigger asChild>
          <button
            className={cn(
              "font-normal absolute right-0 translate-y-[-50%] top-[50%] rounded-md p-2 border",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="w-4 h-4 text-white" />
          </button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            if (!selectedDate) return;
            setDate(selectedDate);
            setStringDate(format(selectedDate, "MM/dd/yyyy"));
            setErrorMessage("");
            onChange(format(selectedDate, "MM/dd/yyyy"));
          }}
          defaultMonth={date}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}