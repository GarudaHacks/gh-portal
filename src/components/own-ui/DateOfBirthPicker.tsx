import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DateOfBirthPicker.css";
import { format } from "date-fns";

interface DateOfBirthPickerProps {
  value: string | null;
  onChange: (date: string | null) => void;
}

const DateOfBirthPicker = ({ value, onChange }: DateOfBirthPickerProps) => {
  const maxDate = new Date();
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 100);

  return (
    <div className="form-field">
      <DatePicker
        selected={value ? new Date(value) : null}
        onChange={(date) => onChange(date ? format(date, "MM/dd/yyyy") : null)}
        placeholderText="Select your date of birth..."
        dateFormat="MM/dd/yyyy"
        showYearDropdown
        showMonthDropdown
        dropdownMode="select"
        minDate={minDate}
        maxDate={maxDate}
        className="form-input"
        wrapperClassName="datepicker-wrapper"
      />
    </div>
  );
};

export default DateOfBirthPicker;
