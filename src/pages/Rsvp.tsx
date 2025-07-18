import React, { useState } from "react";
import Page from "../components/Page";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import GlassyRectangleBackground from "@/components/RedGradientBackground";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const Rsvp: React.FC = () => {
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [consentFile, setConsentFile] = useState<File | null>(null);
  const [isUnder18, setIsUnder18] = useState(false);

  const handleConfirmClick = () => {
    // Check if user is under 18 and hasn't uploaded consent form
    if (isUnder18 && !consentFile) {
      alert(
        "Please upload the underage consent form before confirming your RSVP."
      );
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleConfirmRSVP = async () => {
    try {
      const response = await fetch("/api/application/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-xsrf-token": Cookies.get("XSRF-TOKEN") || "",
        },
        credentials: "include",
        body: JSON.stringify({ rsvp: true }), // Add any required payload here
      });
      if (!response.ok) {
        throw new Error("Failed to confirm RSVP.\nPlease log out and log back in to refresh your session.");
      }
      toast.success("RSVP Confirmed!");
      setShowConfirmDialog(false);
      navigate("/ticket");
    } catch (error: any) {
      alert(error.message || "Failed to confirm RSVP.\nPlease log out and log back in to refresh your session.");
      toast.error("Failed to confirm RSVP.\nPlease log out and log back in to refresh your session.");
    }
  };

  const handleCancelRSVP = () => {
    setShowConfirmDialog(false);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is PDF
      if (file.type !== "application/pdf") {
        alert("Please upload a PDF file.");
        return;
      }
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB.");
        return;
      }
      // Upload file to API
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await fetch("/api/application/consent-form", {
          method: "POST",
          headers: {
            "x-xsrf-token": Cookies.get("XSRF-TOKEN") || "",
          },
          body: formData,
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to upload file. Please try again.");
        }
        setConsentFile(file);
        toast.success("File uploaded successfully");
      } catch (error: any) {
        alert(error.message || "Failed to upload file. Please try again.");
        toast.error("Failed to upload file");
      }
    }
  };

  const handleRemoveFile = () => {
    setConsentFile(null);
    // Reset the file input
    const fileInput = document.getElementById(
      "consent-file"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <Page
      title="RSVP Confirmation"
      description="Confirm your attendance for Garuda Hacks 6.0."
    >
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 w-full">
        {/* Success Message Card */}
        <GlassyRectangleBackground className="w-full max-w-2xl p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            {/* Success Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-[#FF0068] to-[#B25F5F] rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* Main Content */}
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-white">You're In! 🎉</h1>
              <p className="text-lg text-gray-200 leading-relaxed">
                Congratulations on being accepted to{" "}
                <span className="font-semibold text-[#FF0068]">
                  Garuda Hacks 6.0
                </span>
                ! Please confirm your attendance to secure your spot and unlock
                your exclusive ticket.
              </p>
            </div>
          </div>
        </GlassyRectangleBackground>

        {/* Age Check and Consent Form Card */}
        <GlassyRectangleBackground className="w-full max-w-lg p-6">
          <div className="space-y-4">
            {/* Age Check */}
            <p>Please check the box below if you are under 18 years old.</p>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="under18"
                checked={isUnder18}
                onChange={(e) => setIsUnder18(e.target.checked)}
                className="w-4 h-4 text-[#FF0068] bg-transparent border-gray-400 rounded focus:ring-[#FF0068] focus:ring-2"
              />
              <label htmlFor="under18" className="text-white font-medium">
                I am under 18 years old
              </label>
            </div>

            {/* Consent Form Section */}
            {isUnder18 && (
              <div className="space-y-3 border-t border-gray-600 pt-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#FF0068]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-[#FF0068]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-2">
                      Underage Consent Form
                    </h3>
                    <p className="text-gray-300 mb-3 text-sm">
                      Please download, complete, and upload the signed consent
                      form.
                    </p>

                    {/* Download Link */}
                    <a
                      href="/underage-consent.pdf"
                      download
                      className="inline-flex items-center gap-2 text-[#FF0068] hover:text-[#B25F5F] font-medium transition-colors text-sm mb-3"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Download Consent Form (PDF)
                    </a>

                    {/* File Upload */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Upload Completed Form (PDF only, max 5MB)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          id="consent-file"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#FF0068] file:text-white hover:file:bg-[#B25F5F] file:cursor-pointer cursor-pointer"
                        />
                        {consentFile && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleRemoveFile}
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      {consentFile && (
                        <p className="text-sm text-green-400 flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {consentFile.name} uploaded successfully
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </GlassyRectangleBackground>

        {/* Action Button */}
        <div className="flex flex-col items-center gap-4">
          <Button
            className="px-8 py-3 text-lg font-semibold bg-[#FF0068] hover:bg-[#B25F5F] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={handleConfirmClick}
            size="lg"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Confirm My RSVP
          </Button>
          <p className="text-sm text-gray-400 text-center">
            By confirming, you agree to attend Garuda Hacks 6.0
          </p>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-[#001745] border-gray-600 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#FF0068]">
              Confirm Your RSVP
            </DialogTitle>
            <DialogDescription className="text-gray-300 text-lg">
              Are you sure you want to confirm your attendance for Garuda Hacks
              6.0? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleCancelRSVP}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmRSVP}
              className="bg-[#FF0068] hover:bg-[#B25F5F] text-white"
            >
              Yes, Confirm RSVP
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Page>
  );
};

export default Rsvp;
