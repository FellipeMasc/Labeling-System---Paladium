"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAdminStore } from "@/store/admin_store";

export default function ImageUploadSection({ groupId }: { groupId: string }) {
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [autoUsersAssigning, setAutoUsersAssigning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const session = useSession();
  const { setRefreshing } = useAdminStore();
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    setUploading(true);

    try {
      // Create FormData to send files
      const formData = new FormData();
      formData.append("groupId", groupId);

      // Append all files to FormData
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      formData.append("autoUsersAssigning", autoUsersAssigning ? "true" : "false");

      const response = await fetch("/api/s3", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Upload failed");
      }

      toast.success(`Successfully uploaded ${selectedFiles.length} image(s)`);
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setRefreshing(true);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Button type="button" variant="outline" size="sm" asChild>
            <span>
              <Upload className="h-4 w-4 mr-2" />
              Select Images
            </span>
          </Button>
        </label>

        {selectedFiles.length > 0 && (
          <Button onClick={handleUpload} disabled={uploading} size="sm">
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading {selectedFiles.length} file(s)...
              </>
            ) : (
              <>Upload {selectedFiles.length} file(s)</>
            )}
          </Button>
        )}
      </div>
      <div className="flex items-center gap-4">
        <Checkbox
          id="autoUsersAssigning"
          checked={autoUsersAssigning}
          onClick={() => setAutoUsersAssigning(!autoUsersAssigning)}
          className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        />
        <Label htmlFor="autoUsersAssigning">Auto-assign users to images</Label>
      </div>
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Selected files:</p>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                <span className="truncate flex-1">{file.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  disabled={uploading}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Supported formats: JPEG, PNG, GIF, WEBP. Images are uploaded to S3 and stored in the database.
      </p>
    </div>
  );
}
