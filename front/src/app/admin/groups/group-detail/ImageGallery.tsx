"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, ImageIcon } from "lucide-react";
import { deleteImage } from "@/actions/image_actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

type Image = {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  status: "UNLABELED" | "LABELED" | "REVIEWED";
  createdAt: Date;
};

export default function ImageGallery({ images }: { images: Image[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) {
      return;
    }

    setDeleting(imageId);
    const result = await deleteImage(imageId);
    setDeleting(null);

    if (result.success) {
      toast.success("Image deleted successfully");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to delete image");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UNLABELED":
        return "bg-yellow-500";
      case "LABELED":
        return "bg-cyan-500";
      case "REVIEWED":
        return "bg-emerald-500";
      default:
        return "bg-gray-500";
    }
  };

  if (images.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No images uploaded yet</p>
          <p className="text-sm text-muted-foreground mt-1">Upload images using the button above</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Image Gallery</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative group border rounded-lg overflow-hidden bg-muted aspect-square">
              {/* Placeholder for actual image - replace with <img src={image.url} /> when you have real images */}
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 ">
                <Image src={image.url} alt={image.originalName} width={200} height={200} />
              </div>

              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                <p className="text-white text-xs text-center truncate w-full px-2">{image.originalName}</p>
                <Badge className={getStatusColor(image.status)}>{image.status}</Badge>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(image.id)}
                  disabled={deleting === image.id}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Status badge (always visible) */}
              <div className="absolute top-2 right-2">
                <Badge className={`${getStatusColor(image.status)} text-xs`}>{image.status.charAt(0)}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
