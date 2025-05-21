import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export default function ProofofPaymentUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    } else {
      setSelectedFile(null);
      setFileName("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/api/application/payment", {
        method: "POST",
        headers: {
          "x-xsrf-token": Cookies.get("XSRF-TOKEN") || "",
        },
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        let errorMessage = "Failed to upload file.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {}
        throw new Error(errorMessage);
      }

      toast.success("Proof of payment uploaded successfully!");
      setSelectedFile(null);
      setFileName("");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload file"
      );
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setFileName(file.name);
    } else if (file) {
      toast.error("Invalid file type. Please upload an image.");
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="border rounded-lg shadow-md">
      <div className="p-6 space-y-4">
        <div
          className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col gap-1 p-6 items-center cursor-pointer hover:border-gray-400"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <FileIcon className="w-12 h-12 text-gray-400" />
          <span className="text-sm font-medium text-gray-500">
            {fileName || "Drag and drop an image or click to browse"}
          </span>
          <span className="text-xs text-gray-500">
            Accepted: Images (e.g., PNG, JPG)
          </span>
        </div>
        <div className="space-y-2 text-sm">
          <Input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
      <div className="p-6 pt-0">
        <Button size="lg" onClick={handleUpload} disabled={!selectedFile}>
          Upload
        </Button>
      </div>
    </div>
  );
}

function FileIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}
