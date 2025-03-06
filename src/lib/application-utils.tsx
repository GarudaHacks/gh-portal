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
import { ApplicationQuestion } from "@/types/application";

export function renderQuestion(applicationQuestion: ApplicationQuestion) {
  if (applicationQuestion.type === "string") {
    return (
      <div className="flex flex-col gap-1">
        <Label className="text-md font-semibold">
          {applicationQuestion.text}
        </Label>
        <Input />
      </div>
    );
  } else if (applicationQuestion.type === "number") {
    return (
      <div className="flex flex-col gap-1">
        <Label className="text-md font-semibold">
          {applicationQuestion.text}
        </Label>
        <Input type="number" />
      </div>
    );
  } else if (applicationQuestion.type === "file") {
    return (
      <div className="flex flex-col gap-1">
        <Label className="text-md font-semibold">
          {applicationQuestion.text}
        </Label>
        <Input type="file" />
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
        />
      </div>
    );
  } else if (applicationQuestion.type === "dropdown") {
    return (
      <div className="flex flex-col gap-1">
        <Label className="text-md font-semibold">
          {applicationQuestion.text}
        </Label>
        <Select>
          <SelectTrigger className="border p-2 w-full">
            <SelectValue placeholder="Select one..."/>
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
