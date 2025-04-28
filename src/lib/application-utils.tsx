import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea";
import { LocalApplicationState } from "@/pages/Application";
import { ApplicationQuestion } from "@/types/application";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { CalendarDaysIcon } from "lucide-react";
import { cn } from "./utils";
import { format } from "date-fns"

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

              fetch(`/api/application/file-upload?questionId=${applicationQuestion.id}`, {
                method: "POST",
                headers: {
                  // "Content-Type": "multipart/form-data" // implicitly from browser
                  "x-csrf-token": Cookies.get("XSRF-TOKEN") || ""
                },
                body: formData
              })
                .then(data => {
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
                .catch(error => {
                  console.error("Error uploading file:", error);
                  toast.error("Failed to upload file");
                  onChange?.(applicationQuestion, {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    lastModified: file.lastModified,
                    // uploaded: false,
                    error: error.message
                  });
                })
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
              {value ? format(new Date(value), "PPP") : <span>Pick a date</span>}
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
