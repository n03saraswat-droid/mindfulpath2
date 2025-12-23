import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Award, Download, Share2 } from "lucide-react";
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
        backgroundColor: "#ffffff",
        logging: false,
      });

      const link = document.createElement("a");
      link.download = `${courseName.replace(/\s+/g, "-")}-Certificate.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast.success("Certificate downloaded successfully!");
    } catch (error) {
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
        backgroundColor: "#ffffff",
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

        // Fallback: copy to clipboard or show message
        toast.info("Share feature not available. Please download and share manually.");
      });
    } catch (error) {
      toast.error("Failed to share certificate");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white">
          <Award className="w-5 h-5" />
          View Certificate
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Certificate of Completion
          </DialogTitle>
        </DialogHeader>

        {/* Certificate Preview */}
        <div className="overflow-auto max-h-[70vh]">
          <div
            ref={certificateRef}
            className="bg-white p-8 rounded-lg mx-auto"
            style={{ width: "700px", minHeight: "500px" }}
          >
            {/* Certificate Design */}
            <div className="relative border-8 border-double border-amber-400 rounded-lg p-8 bg-gradient-to-br from-amber-50 to-yellow-50">
              {/* Decorative corners */}
              <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-amber-500 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-amber-500 rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-amber-500 rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-amber-500 rounded-br-lg" />

              <div className="text-center space-y-6">
                {/* Header */}
                <div className="flex justify-center mb-2">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">MP</span>
                  </div>
                </div>

                <div>
                  <h1 className="text-3xl font-serif font-bold text-amber-800 tracking-wide">
                    Certificate of Completion
                  </h1>
                  <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-2" />
                </div>

                <p className="text-gray-600 text-lg">This is to certify that</p>

                <div>
                  <p className="text-3xl font-serif font-bold text-gray-800 border-b-2 border-amber-400 inline-block px-8 pb-1">
                    {userName}
                  </p>
                </div>

                <p className="text-gray-600 text-lg">has successfully completed the course</p>

                <div className="flex items-center justify-center gap-3">
                  <span className="text-4xl">{courseIcon}</span>
                  <h2 className="text-2xl font-bold text-teal-700">{courseName}</h2>
                </div>

                <div className="pt-4">
                  <p className="text-gray-500">Completed on</p>
                  <p className="text-lg font-semibold text-gray-700">{formatDate(completionDate)}</p>
                </div>

                {/* Signature area */}
                <div className="flex justify-between items-end pt-8 px-8">
                  <div className="text-center">
                    <div className="w-32 border-b border-gray-400 mb-1" />
                    <p className="text-sm text-gray-500">MindfulPath</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Award className="w-12 h-12 text-amber-500 mb-1" />
                    <p className="text-xs text-gray-400">Verified</p>
                  </div>
                  <div className="text-center">
                    <div className="w-32 border-b border-gray-400 mb-1" />
                    <p className="text-sm text-gray-500">Date</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-3 pt-4">
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="gap-2"
          >
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
