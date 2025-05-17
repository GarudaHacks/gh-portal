import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { LocalApplicationState } from "@/pages/Application";
import {
  ApplicationQuestion,
  QUESTION_TYPE,
  StringValidation,
  NumberValidation,
  FileValidation,
  DatetimeValidation,
  DropdownValidation,
  FileApplicationQuestion, // Specifically for file validation access
  DropdownApplicationQuestion, // Specifically for dropdown options access
} from "@/types/application";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { CalendarDaysIcon } from "lucide-react";
import { cn } from "./utils";
import { format, isValid, parseISO } from "date-fns";

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function validateResponse(
  question: ApplicationQuestion,
  response: any
): string | null {
  // General required check (can be on base or specific validation)
  const isGenerallyRequired = question.required;
  let specificRulesRequired = false;

  // Check for required status within specific validation rules
  if (question.validation && "required" in question.validation) {
    specificRulesRequired = !!question.validation.required;
  }

  const effectiveRequired = isGenerallyRequired || specificRulesRequired;

  if (
    effectiveRequired &&
    (response === null || response === undefined || response === "")
  ) {
    return "This field is required.";
  }

  // If not required and no response, then it's valid
  if (
    !effectiveRequired &&
    (response === null || response === undefined || response === "")
  ) {
    return null;
  }

  switch (question.type) {
    case QUESTION_TYPE.STRING:
    case QUESTION_TYPE.TEXTAREA: {
      const rules = question.validation as StringValidation | undefined;
      const value = String(response || "");
      if (rules?.minLength && value.length < rules.minLength) {
        return `Minimum length is ${rules.minLength} characters.`;
      }
      if (rules?.maxLength && value.length > rules.maxLength) {
        return `Maximum length is ${rules.maxLength} characters.`;
      }
      if (rules?.pattern) {
        const regex = new RegExp(rules.pattern);
        if (!regex.test(value)) {
          return "Invalid format."; // Or a more specific message if pattern has a known meaning
        }
      }
      break;
    }
    case QUESTION_TYPE.NUMBER: {
      const rules = question.validation as NumberValidation | undefined;
      const numValue = parseFloat(response);
      if (isNaN(numValue) && effectiveRequired) {
        // only error if required and not a number
        return "Must be a valid number.";
      }
      if (!isNaN(numValue)) {
        // only apply min/max if it's a number
        if (rules?.minValue !== undefined && numValue < rules.minValue) {
          return `Minimum value is ${rules.minValue}.`;
        }
        if (rules?.maxValue !== undefined && numValue > rules.maxValue) {
          return `Maximum value is ${rules.maxValue}.`;
        }
      }
      break;
    }
    case QUESTION_TYPE.DATE: {
      const rules = question.validation as DatetimeValidation | undefined;
      const dateValue =
        typeof response === "string"
          ? parseISO(response)
          : response instanceof Date
          ? response
          : null;
      if (!dateValue || !isValid(dateValue)) {
        if (effectiveRequired) return "Please select a valid date.";
        break;
      }
      if (rules?.earliest) {
        const earliestDate = parseISO(rules.earliest);
        if (isValid(earliestDate) && dateValue < earliestDate) {
          return `Date cannot be earlier than ${format(earliestDate, "PPP")}.`;
        }
      }
      if (rules?.latest) {
        const latestDate = parseISO(rules.latest);
        if (isValid(latestDate) && dateValue > latestDate) {
          return `Date cannot be later than ${format(latestDate, "PPP")}.`;
        }
      }
      break;
    }
    case QUESTION_TYPE.DROPDOWN: {
      const rules = question.validation as DropdownValidation | undefined;
      const q = question as DropdownApplicationQuestion; // To access options
      if (rules?.multiple) {
        const selectedOptions = Array.isArray(response)
          ? response
          : response
          ? [response]
          : [];
        if (
          rules.minSelections &&
          selectedOptions.length < rules.minSelections
        ) {
          return `Please select at least ${rules.minSelections} option(s).`;
        }
        if (
          rules.maxSelections &&
          selectedOptions.length > rules.maxSelections
        ) {
          return `Please select no more than ${rules.maxSelections} option(s).`;
        }
      } else {
        // For single-select dropdown, the 'required' check at the beginning is usually sufficient.
        // If there's a response, it's one of the options.
      }
      break;
    }
    case QUESTION_TYPE.FILE: {
      // For files, response object is { name: string, size: number, type: string, ... }
      // The initial 'required' check handles if the object itself is missing.
      const fileDetails = response as {
        name: string;
        size: number;
        type: string;
        error?: string;
      };
      const rules = (question as FileApplicationQuestion).validation; // FileApplicationQuestion ensures validation exists

      if (fileDetails && fileDetails.error) {
        return `Upload error: ${fileDetails.error}`;
      }

      if (effectiveRequired && !fileDetails) {
        // Redundant due to top check, but for clarity
        return "This field is required.";
      }

      if (fileDetails) {
        // Only validate if a file object exists
        if (rules.allowedTypes) {
          const allowed = rules.allowedTypes
            .split(",")
            .map((t) => t.trim().toLowerCase());
          if (!allowed.includes(fileDetails.type.toLowerCase())) {
            return `Invalid file type. Allowed types: ${rules.allowedTypes}.`;
          }
        }
        if (rules.maxSize) {
          const maxSizeInBytes = rules.maxSize * 1024 * 1024;
          if (fileDetails.size > maxSizeInBytes) {
            return `File is too large. Maximum size is ${formatBytes(
              maxSizeInBytes
            )}.`;
          }
        }
      }
      break;
    }
    default:
      // No specific validation for this type, or type not handled
      break;
  }

  return null; // No validation errors
}

export function renderQuestion(
  applicationQuestion: ApplicationQuestion,
  localState: LocalApplicationState,
  onChange?: (question: ApplicationQuestion, value: any) => void
) {
  const value = localState?.data[applicationQuestion.id]?.response || "";
  const errorMessage = localState?.data[applicationQuestion.id]?.error || "";

  const renderError = () => {
    if (errorMessage) {
      return <p className="text-red-500 text-sm mt-1">{errorMessage}</p>;
    }
    return null;
  };

  if (applicationQuestion.type === "string") {
    return (
      <div className="flex flex-col gap-1">
        <Label className="text-md font-semibold">
          {applicationQuestion.text}
        </Label>
        <Input
          className="bg-white"
          value={value}
          placeholder={`Your answer...`}
          onChange={(e) => onChange?.(applicationQuestion, e.target.value)}
        />
        {renderError()}
      </div>
    );
  } else if (applicationQuestion.type === "number") {
    return (
      <div className="flex flex-col gap-1">
        <Label className="text-md font-semibold">
          {applicationQuestion.text}
        </Label>
        <Input
          className="bg-white"
          placeholder="0"
          type="number"
          value={value}
          onChange={(e) => {
            const numValue = e.target.value ? parseFloat(e.target.value) : "";
            onChange?.(applicationQuestion, numValue);
          }}
        />
        {renderError()}
      </div>
    );
  } else if (applicationQuestion.type === "file") {
    return (
      <div className="flex flex-col gap-1">
        <Label className="text-md font-semibold">
          {applicationQuestion.text}
        </Label>
        <Input
          className="bg-white"
          type="file"
          accept={applicationQuestion.validation.allowedTypes || "*"}
          onChange={(e) => {
            // store metadata
            const file = e.target.files?.[0];
            if (file) {
              const formData = new FormData();
              formData.append("file", file);

              fetch(
                `/api/application/file-upload?questionId=${applicationQuestion.id}`,
                {
                  method: "POST",
                  headers: {
                    // "Content-Type": "multipart/form-data" // implicitly from browser
                    "x-csrf-token": Cookies.get("XSRF-TOKEN") || "",
                  },
                  body: formData,
                  credentials: "include",
                }
              )
                .then((data) => {
                  toast.success("File uploaded successfully");
                  onChange?.(applicationQuestion, {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    lastModified: file.lastModified,
                    // uploaded: true,
                    // responseData: data
                  });
                })
                .catch((error) => {
                  console.error("Error uploading file:", error);
                  toast.error("Failed to upload file");
                  onChange?.(applicationQuestion, {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    lastModified: file.lastModified,
                    // uploaded: false,
                    error: error.message,
                  });
                });
            }
          }}
        />
        {renderError()}
      </div>
    );
  } else if (applicationQuestion.type === "textarea") {
    return (
      <div className="flex flex-col gap-1">
        <Label className="text-md font-semibold">
          {applicationQuestion.text}
          <span className="text-xs text-red-600">
            {applicationQuestion.required ? "*" : ""}
          </span>
        </Label>
        <Textarea
          className="border p-2 w-full h-40 resize-none lg:resize-y bg-white"
          placeholder="Your response here..."
          value={value}
          onChange={(e) => onChange?.(applicationQuestion, e.target.value)}
        />
        {renderError()}
      </div>
    );
  } else if (applicationQuestion.type === "dropdown") {
    return (
      <div className="flex flex-col gap-1">
        <Label className="text-md font-semibold">
          {applicationQuestion.text}
        </Label>
        <Select
          defaultValue={value}
          onValueChange={(value) => onChange?.(applicationQuestion, value)}
        >
          <SelectTrigger className="border p-2 w-full bg-white">
            <SelectValue placeholder="Select one..." />
          </SelectTrigger>
          <SelectContent>
            {applicationQuestion.options?.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {renderError()}
      </div>
    );
  } else if (applicationQuestion.type === "datetime") {
    return (
      <div className="flex flex-col gap-1 w-min">
        <Label className="text-md font-semibold">
          {applicationQuestion.text}
        </Label>
        <Popover>
          <PopoverTrigger className="">
            <div
              className={cn(
                "h-9 px-4 py-2 has-[>svg]:px-3 border border-input shadow-xs hover:bg-accent hover:text-accent-foreground w-[280px] justify-start text-left font-normal bg-white flex items-center rounded-lg",
                !value && "text-muted-foreground"
              )}
            >
              <CalendarDaysIcon className="mr-2 h-4 w-4" />
              {value ? (
                format(new Date(value), "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="single"
              selected={value ? new Date(value) : undefined}
              onSelect={(date) => {
                onChange?.(applicationQuestion, date?.toISOString());
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {renderError()}
      </div>
    );
  }
}
