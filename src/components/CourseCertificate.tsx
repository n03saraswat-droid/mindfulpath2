import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Award, Download, Share2, Heart } from "lucide-react";
import { toast } from "sonner";

interface CourseCertificateProps {
  courseName: string;
  courseIcon: string;
  userName: string;
  completionDate: Date;
}

const CourseCertificate = ({ courseName, courseIcon, userName, completionDate }: CourseCertificateProps) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `${courseName.replace(/\s+/g, "-")}-Certificate.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Certificate downloaded successfully!");
    } catch {
      toast.error("Failed to download certificate");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!certificateRef.current) return;
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false,
      });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        if (navigator.share && navigator.canShare) {
          const file = new File([blob], `${courseName}-Certificate.png`, { type: "image/png" });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: `${courseName} Certificate`,
              text: `I completed the ${courseName} course on MindfulPath!`,
              files: [file],
            });
            return;
          }
        }
        toast.info("Share feature not available. Please download and share manually.");
      });
    } catch {
      toast.error("Failed to share certificate");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
          <Award className="w-5 h-5" />
          View Certificate
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-teal-400" />
            Certificate of Completion
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-auto max-h-[70vh]">
          <div
            ref={certificateRef}
            className="mx-auto relative"
            style={{ width: "700px", minHeight: "500px" }}
          >
            {/* Background */}
            <div className="absolute inset-0 rounded-lg" style={{ backgroundColor: "#1a3a2a" }} />

            {/* Decorative wave shapes */}
            <div className="absolute top-0 right-0 w-40 h-40 overflow-hidden rounded-tr-lg">
              <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full" style={{ backgroundColor: "#2a6b5a", opacity: 0.6 }} />
              <div className="absolute -top-16 -right-2 w-40 h-40 rounded-full" style={{ backgroundColor: "#3bb8a0", opacity: 0.4 }} />
            </div>
            <div className="absolute top-0 left-0 w-32 h-32 overflow-hidden rounded-tl-lg">
              <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full" style={{ backgroundColor: "#2a6b5a", opacity: 0.5 }} />
            </div>
            <div className="absolute bottom-0 left-0 w-40 h-40 overflow-hidden rounded-bl-lg">
              <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full" style={{ backgroundColor: "#2a6b5a", opacity: 0.6 }} />
              <div className="absolute -bottom-16 -left-2 w-40 h-40 rounded-full" style={{ backgroundColor: "#3bb8a0", opacity: 0.4 }} />
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32 overflow-hidden rounded-br-lg">
              <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full" style={{ backgroundColor: "#2a6b5a", opacity: 0.5 }} />
            </div>

            {/* Inner border */}
            <div className="absolute inset-6 border-2 rounded-lg" style={{ borderColor: "#3bb8a055" }} />

            {/* Content */}
            <div className="relative z-10 p-12 text-center flex flex-col items-center justify-center min-h-[500px]">
              {/* Title */}
              <h1
                className="text-4xl font-bold tracking-wider mb-1"
                style={{
                  color: "#e0f2f1",
                  fontFamily: "'Georgia', serif",
                  fontVariant: "small-caps",
                  letterSpacing: "0.15em",
                }}
              >
                Certificate of Completion
              </h1>

              {/* Dashed line */}
              <div className="w-96 my-3" style={{ borderTop: "3px dashed #3bb8a0" }} />

              {/* User name */}
              <div className="mt-8 mb-2">
                <p
                  className="text-3xl font-bold tracking-wide"
                  style={{
                    color: "#e0f2f1",
                    fontFamily: "'Georgia', serif",
                    letterSpacing: "0.05em",
                  }}
                >
                  {userName || "Student"}
                </p>
                <div className="w-64 mx-auto mt-2" style={{ borderTop: "2px solid #3bb8a0" }} />
              </div>

              {/* Completed text */}
              <p className="text-lg mt-6" style={{ color: "#a0c4b8", fontFamily: "'Georgia', serif" }}>
                Completed the Course
              </p>

              {/* Course name with icon */}
              <div className="flex items-center justify-center gap-3 mt-4 mb-2">
                <span className="text-3xl">{courseIcon}</span>
                <h2 className="text-2xl font-bold" style={{ color: "#4fd1c5" }}>
                  {courseName}
                </h2>
              </div>

              {/* Date */}
              <p className="text-sm mt-2" style={{ color: "#7fb8aa" }}>
                {formatDate(completionDate)}
              </p>

              {/* Bottom section */}
              <div className="flex items-end justify-between w-full mt-10 px-8">
                {/* Badge icon */}
                <div className="flex flex-col items-center">
                  <Award className="w-14 h-14" style={{ color: "#3bb8a0" }} />
                </div>

                {/* Heart + brand */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-2"
                    style={{ backgroundColor: "#3bb8a0" }}
                  >
                    <Heart className="w-7 h-7" style={{ color: "#1a3a2a" }} />
                  </div>
                  <div className="w-40" style={{ borderTop: "2px solid #3bb8a0" }} />
                  <p
                    className="text-sm font-bold mt-2 tracking-widest"
                    style={{ color: "#3bb8a0", fontVariant: "small-caps" }}
                  >
                    Mindful Path & Team
                  </p>
                </div>

                {/* Verified */}
                <div className="flex flex-col items-center">
                  <div
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ backgroundColor: "#3bb8a022", color: "#3bb8a0", border: "1px solid #3bb8a055" }}
                  >
                    Verified ✓
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-3 pt-4">
          <Button onClick={handleDownload} disabled={isDownloading} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
            <Download className="w-4 h-4" />
            {isDownloading ? "Downloading..." : "Download Certificate"}
          </Button>
          <Button variant="outline" onClick={handleShare} className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseCertificate;
