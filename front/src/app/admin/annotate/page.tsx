"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag as TagIcon, Loader2, ArrowLeft, X, Pencil, Save, Check } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { getImageById, getImageTagsByIdForAdmin, removeTagFromImage, updateTag } from "@/actions/image_actions";
import { useSession } from "@/lib/auth-client";

// Helper to color tags by source
function getTagColor(source: string) {
  switch (source) {
    case "USER":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "AI":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    case "ADMIN":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    default:
      return "";
  }
}

function AdminAnnotatePageContent() {
  const searchParams = useSearchParams();
  const imageId = searchParams.get("imageId") || "";

  const [image, setImage] = useState<{
    imageId: string;
    filename: string;
    originalName: string;
    url: string;
    groupId: string;
    tags: {
      tagId: string;
      name: string;
      value: string;
      source: "USER" | "AI" | "ADMIN";
      createdAt: Date;
      updatedAt: Date;
      likelihoodScore: number;
    }[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const session = useSession();
  const token = session?.data?.session?.token || "";

  // Tag editing state
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editingTagValue, setEditingTagValue] = useState<string>("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    async function fetchImage() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getImageTagsByIdForAdmin(imageId);
        if (response.success && response.result) {
          setImage(response.result);
        } else {
          setError("Image not found.");
        }
      } catch {
        setError("Failed to fetch image.");
      } finally {
        setIsLoading(false);
      }
    }
    if (imageId) {
      fetchImage();
    }
  }, [imageId]);

  const handleRemoveTag = async (tagId: string) => {
    setEditing(true);
    try {
      const result = await removeTagFromImage(tagId);
      if (result.success) {
        setImage((prev: any) => ({
          ...prev,
          tags: prev.tags.filter((tag: { tagId: string }) => tag.tagId !== tagId),
        }));
        toast.success("Tag removed!");
      } else {
        toast.error("Could not remove tag");
      }
    } catch {
      toast.error("Error removing tag");
    } finally {
      setEditing(false);
    }
  };

  const handleStartEditTag = (tagId: string, currentValue: string) => {
    setEditingTagId(tagId);
    setEditingTagValue(currentValue);
  };

  const handleCancelEdit = () => {
    setEditingTagId(null);
    setEditingTagValue("");
  };

  const handleSaveEditTag = async (tagId: string) => {
    if (!editingTagValue.trim()) {
      toast.error("Tag value cannot be empty");
      return;
    }
    setEditing(true);
    try {
      const result = await updateTag(tagId, editingTagValue.trim(), token, "ADMIN");
      if (result.success && result.tag) {
        setImage((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            tags: prev.tags.map((tag) =>
              tag.tagId === tagId ? { ...tag, value: editingTagValue.trim(), source: "ADMIN" } : tag
            ),
          };
        });
        toast.success("Tag updated!");
        setEditingTagId(null);
        setEditingTagValue("");
      } else {
        toast.error("Could not update tag");
      }
    } catch {
      toast.error("Error updating tag");
    } finally {
      setEditing(false);
    }
  };

  const handleApproveTag = async (tagId: string, value: string) => {
    setEditing(true);
    try {
      const result = await updateTag(tagId, value, token, "ADMIN");
      if (result.success && result.tag) {
        setImage((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            tags: prev.tags.map((tag) => (tag.tagId === tagId ? { ...tag, source: "ADMIN" } : tag)),
          };
        });
      }
      toast.success("Tag approved!");
    } catch {
      toast.error("Error approving tag");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !image) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-red-500 mb-2">{error || "Image not found."}</div>
            <Link href="/admin/images">
              <span className="inline-flex items-center text-blue-600 underline text-sm">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Admin
              </span>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <Link href={`/admin/groups/group-detail?groupId=${encodeURIComponent(image.groupId)}`}>
            <Button variant="ghost" size="sm" className="cursor-pointer mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Images
            </Button>
          </Link>
          <CardTitle>Image Tags (Admin View)</CardTitle>
          <CardDescription>
            <span>
              Image: <span className="font-medium">{image.originalName}</span>
            </span>
            <br />
            <span className="text-xs opacity-60">{image.filename}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.url}
              alt={image.originalName}
              className="rounded-lg border max-h-72 max-w-full object-contain mb-3"
            />
          </div>

          <div className="mb-2 flex items-center gap-2">
            <TagIcon className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">Tags for this image ({image.tags.length})</span>
          </div>

          <div className="flex flex-wrap gap-3">
            {image.tags.length === 0 ? (
              <span className="text-muted-foreground text-sm">No tags for this image.</span>
            ) : (
              image.tags.map((tag: any) => (
                <div
                  key={tag.tagId}
                  className="relative group border rounded-md px-3 py-2 bg-white dark:bg-zinc-900 flex flex-col gap-1 min-w-[220px]"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className={`${getTagColor(tag.source)} pr-1`}>
                      {editingTagId === tag.tagId ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleSaveEditTag(tag.tagId);
                          }}
                          className="flex items-center gap-1"
                        >
                          <Input
                            type="text"
                            value={editingTagValue}
                            onChange={(e) => setEditingTagValue(e.target.value)}
                            autoFocus
                            size={12}
                            disabled={editing}
                            className="h-7 px-2 py-1 text-xs"
                            maxLength={32}
                          />
                          <Button
                            type="submit"
                            size="icon"
                            variant="ghost"
                            disabled={editing}
                            className="h-7 w-7 p-0"
                            title="Save"
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={handleCancelEdit}
                            className="h-7 w-7 p-0"
                            disabled={editing}
                            title="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </form>
                      ) : (
                        <>
                          {tag.value}
                          <span className="ml-1 text-xs opacity-60">{tag.source || "USER"}</span>
                        </>
                      )}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground break-all">
                      Tagged by:{" "}
                      {tag.name ? (
                        <span className="font-semibold">{tag.name}</span>
                      ) : (
                        <span className="italic">Unknown</span>
                      )}
                      <div className="text-xs opacity-60">Likelihood Score: {tag.likelihoodScore?.toFixed(2)}</div>
                    </span>
                    <div className="flex gap-0.5">
                      {editingTagId !== tag.tagId && (
                        <>
                          <button
                            onClick={() => handleStartEditTag(tag.tagId, tag.value)}
                            className="hover:bg-black/10 dark:hover:bg-white/10 rounded p-0.5"
                            disabled={editing}
                            title="Edit"
                          >
                            <Pencil className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleRemoveTag(tag.tagId)}
                            className="hover:bg-black/10 dark:hover:bg-white/10 rounded p-0.5"
                            disabled={editing}
                            title="Remove"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleApproveTag(tag.tagId, tag.value)}
                            className="hover:bg-black/10 dark:hover:bg-white/10 rounded p-0.5"
                            disabled={editing}
                            title="Approve"
                          >
                            <Check className="h-3 w-3" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-6 text-xs text-muted-foreground">
            <span>
              <b>Note:</b> As admin, you can edit or remove <u>all</u> tags regardless of author.
              <br /> The "Tagged by" value is the user ID who created the tag.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminAnnotatePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <AdminAnnotatePageContent />
    </Suspense>
  );
}
