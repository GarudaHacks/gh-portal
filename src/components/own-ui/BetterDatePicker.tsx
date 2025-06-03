import { useState } from "react";
import "./betterDatePicker.css";
import { isValid } from "date-fns";
import Calendar from "react-calendar";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

export default function BetterDatePicker({
  value,
  onChange,
}: {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  error?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const tileDisabled = ({ date }: { date: Date }) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date > today;
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="better-datepicker-input-wrapper">
            <input
              type="date"
              value={value ? value.toLocaleDateString("en-CA") : ""}
              onClick={() => setIsOpen(!isOpen)}
              readOnly
              placeholder="mm-dd-yyyy"
              className={`better-datepicker-input ${isOpen ? "open" : ""}`}
            />
            <div
              className="better-datepicker-icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="flex *:flex-col items-center justify-center p-0">
          <Calendar
            onClickDay={(date: Date) => {
              onChange(date);
              setIsOpen(false);
            }}
            value={value}
            tileClassName={({ date }) => {
              date.setHours(0, 0, 0, 0);
              if (
                isValid(value) &&
                value != null &&
                date.getDate() === value.getDate() &&
                date.getMonth() === value.getMonth() &&
                date.getFullYear() === value.getFullYear()
              ) {
                return "highlighted";
              }
            }}
            locale="en-US"
            calendarType="iso8601"
            showNeighboringMonth={false}
            prev2Label={null}
            next2Label={null}
            tileDisabled={tileDisabled}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
