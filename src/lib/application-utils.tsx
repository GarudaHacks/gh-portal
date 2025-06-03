import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LocalApplicationState } from "@/pages/Application";
import {
  ApplicationQuestion,
  QUESTION_TYPE,
  StringValidation,
  NumberValidation,
  DatetimeValidation,
  DropdownValidation,
  FileApplicationQuestion,
  DropdownApplicationQuestion,
} from "@/types/application";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { format, isValid, parseISO } from "date-fns";
import { DatePicker } from "@/components/Datepicker";
import DateOfBirthPicker from "@/components/own-ui/DateOfBirthPicker";

function countWords(text: string): number {
  if (!text || text.trim() === "") return 0;
  return text.trim().split(/\s+/).length;
}

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
  const isGenerallyRequired = question.required;
  let specificRulesRequired = false;

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

      if (question.type === QUESTION_TYPE.TEXTAREA) {
        const wordCount = countWords(value);
        if (rules?.minLength && wordCount < rules.minLength) {
          return `Minimum word count is ${rules.minLength} words.`;
        }
        if (rules?.maxLength && wordCount > rules.maxLength) {
          return `Maximum word count is ${rules.maxLength} words.`;
        }
      } else {
        if (rules?.minLength && value.length < rules.minLength) {
          return `Minimum length is ${rules.minLength} characters.`;
        }
        if (rules?.maxLength && value.length > rules.maxLength) {
          return `Maximum length is ${rules.maxLength} characters.`;
        }
      }

      if (rules?.pattern) {
        const regex = new RegExp(rules.pattern);
        if (!regex.test(value)) {
          return "Invalid format.";
        }
      }
      break;
    }
    case QUESTION_TYPE.NUMBER: {
      const rules = question.validation as NumberValidation | undefined;
      const numValue = response === "" ? "" : parseFloat(response);
      if (numValue === "" && effectiveRequired) {
        return "Must be a valid number.";
      }
      if (numValue !== "") {
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
          ? new Date(response)
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
      }
      break;
    }
    case QUESTION_TYPE.FILE: {
      const fileDetails = response as {
        name: string;
        size: number;
        type: string;
        error?: string;
      };
      const rules = (question as FileApplicationQuestion).validation;

      if (fileDetails && fileDetails.error) {
        return `Upload error: ${fileDetails.error}`;
      }

      if (effectiveRequired && !fileDetails) {
        return "This field is required.";
      }

      if (fileDetails) {
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
      break;
  }

  return null;
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
      return <p className="text-rose-400 text-sm mt-1">{errorMessage}</p>;
    }
    return null;
  };

  if (applicationQuestion.type === "string") {
    const stringValidation = applicationQuestion.validation as
      | StringValidation
      | undefined;

    return (
      <div className="flex flex-col gap-1">
        <Label className="text-md font-semibold text-white">
          {applicationQuestion.text}
          <span className="text-xs text-red-600">
            {applicationQuestion.required ? "*" : ""}
          </span>
        </Label>
        <Input
          className="text-white"
          value={value}
          placeholder={`Your answer...`}
          onChange={(e) => onChange?.(applicationQuestion, e.target.value)}
          maxLength={stringValidation?.maxLength}
        />
        {renderError()}
      </div>
    );
  } else if (applicationQuestion.type === "number") {
    return (
      <div className="flex flex-col gap-1">
        <Label className="text-md font-semibold text-white">
          {applicationQuestion.text}
          <span className="text-xs text-red-600">
            {applicationQuestion.required ? "*" : ""}
          </span>
        </Label>
        <Input
          className="text-white"
          placeholder="0"
          type="text"
          pattern="[0-9]*"
          inputMode="numeric"
          value={value}
          onChange={(e) => {
            const inputValue = e.target.value;
            if (inputValue === "" || /^\d+$/.test(inputValue)) {
              onChange?.(applicationQuestion, inputValue);
            }
          }}
        />
        {renderError()}
      </div>
    );
  } else if (applicationQuestion.type === "file") {
    return (
      <div className="flex flex-col gap-1">
        <Label className="text-md font-semibold text-white">
          {applicationQuestion.text}
          <span className="text-xs text-red-600">
            {applicationQuestion.required ? "*" : ""}
          </span>
        </Label>
        <Input
          className="text-white"
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
                    "x-xsrf-token": Cookies.get("XSRF-TOKEN") || "",
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
    const stringValidation = applicationQuestion.validation as
      | StringValidation
      | undefined;
    const minWords = stringValidation?.minLength || 150;
    const currentWordCount = countWords(value);

    return (
      <div className="flex flex-col gap-1">
        <Label className="text-md font-semibold text-white">
          {applicationQuestion.text}
          <span className="text-xs text-red-600">
            {applicationQuestion.required ? "*" : ""}
          </span>
        </Label>
        <Textarea
          className="border p-2 w-full h-40 resize-none lg:resize-y text-white"
          placeholder="Your response here..."
          value={value}
          onChange={(e) => onChange?.(applicationQuestion, e.target.value)}
        />
        <div className="flex justify-end text-xs">
          <span className="text-primary-foreground">
            {currentWordCount} / {minWords} words
          </span>
        </div>
        {renderError()}
      </div>
    );
  } else if (applicationQuestion.type === "dropdown") {
    return (
      <div className="flex flex-col gap-1">
        <Label className="text-md font-semibold text-white">
          {applicationQuestion.text}
          <span className="text-xs text-red-600">
            {applicationQuestion.required ? "*" : ""}
          </span>
        </Label>
        <Select
          defaultValue={value}
          onValueChange={(value) => onChange?.(applicationQuestion, value)}
        >
          <SelectTrigger className="border p-2 w-full text-white">
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
      <div className="flex flex-col gap-1 w-full">
        <Label className="text-md font-semibold text-white">
          {applicationQuestion.text}
          <span className="text-xs text-red-600">
            {applicationQuestion.required ? "*" : ""}
          </span>
        </Label>
        <DateOfBirthPicker
          value={value}
          onChange={(date) => onChange?.(applicationQuestion, date)}
        />
        {renderError()}
      </div>
    );
  }
}
