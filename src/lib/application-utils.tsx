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
import { ApplicationQuestion } from "@/types/application";

export function renderQuestion(
  applicationQuestion: ApplicationQuestion,
  localState: LocalApplicationState,
  onChange?: (question: ApplicationQuestion, value: any) => void
) {
  const value = localState?.data[applicationQuestion.id]?.response || "";

  if (applicationQuestion.type === "string") {
    return (
      <div className="flex flex-col gap-1">
        <Label className="text-md font-semibold">
          {applicationQuestion.text}
        </Label>
        <Input
          value={value}
          onChange={(e) => onChange?.(applicationQuestion, e.target.value)}
        />
      </div>
    );
  } else if (applicationQuestion.type === "number") {
    return (
      <div className="flex flex-col gap-1">
        <Label className="text-md font-semibold">
          {applicationQuestion.text}
        </Label>
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange?.(applicationQuestion, e.target.value)}
        />
      </div>
    );
  } else if (applicationQuestion.type === "file") {
    return (
      <div className="flex flex-col gap-1">
        <Label className="text-md font-semibold">
          {applicationQuestion.text}
        </Label>
        <Input
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            // store metadata
            const file = e.target.files?.[0];
            if (file) {
              onChange?.(applicationQuestion, {
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified,
              });
            }
          }}
        />
      </div>
    );
  } else if (applicationQuestion.type === "textarea") {
    return (
      <div className="flex flex-col gap-1">
        <Label className="text-md font-semibold">
          {applicationQuestion.text}
        </Label>
        <Textarea
          className="border p-2 w-full h-40 resize-none lg:resize-y"
          placeholder="Your response here..."
          value={value}
          onChange={(e) => onChange?.(applicationQuestion, e.target.value)}
        />
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
          <SelectTrigger className="border p-2 w-full">
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
      </div>
    );
  }
}
