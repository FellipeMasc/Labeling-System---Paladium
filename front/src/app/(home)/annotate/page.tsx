"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag as TagIcon, Loader2, Plus, ArrowLeft, X, Pencil } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { getImageById, addTagToImage, removeTagFromImage, updateTag } from "@/actions/image_actions";
import { useSession } from "@/lib/auth-client";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addLabelerUsage, getLabelerUsage } from "@/actions/labeler_actions";

const getTagColor = (source: string) => {
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
};

function AnnotateImagePageContent() {
  const searchParams = useSearchParams();
  const imageId = searchParams.get("imageId") || "";
  const [image, setImage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tagInput, setTagInput] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"USER" | "AI">("USER");
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editingTagValue, setEditingTagValue] = useState("");
  const { data: session, isPending } = useSession();
  const [usedAI, setUsedAI] = useState(false);

  const handleSuggestTags = async () => {
    const result = await fetch(`${process.env.AI_API_URL}/infer-tags`, {
      method: "POST",
      body: JSON.stringify({ image_url: image.url, user_id: session?.user?.id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await result.json();
    console.log("data", data);
    if (result.ok) {
      setSuggestedTags(data);
      const result = await addLabelerUsage(session?.user?.id || "", imageId);
      if (result.success && result.labelerUsage) {
        setUsedAI(true);
      }
    }
  };
  useEffect(() => {
    async function fetchImage() {
      if (!imageId) {
        setIsLoading(false);
        return;
      }
      if (!session?.user?.id) {
        return;
      }
      try {
        const result = await getImageById(imageId);
        console.log("result", result);
        const labelerUsage = await getLabelerUsage(session?.user?.id, imageId);
        console.log("labelerUsage", labelerUsage);
        if (labelerUsage.success && labelerUsage.labelerUsage) {
          setUsedAI(true);
        }
        if (result.success && result.image) {
          setImage(result.image);
        } else {
          setError("Image not found.");
        }
      } catch {
        setError("Failed to fetch image.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchImage();
  }, [imageId, isPending]);

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagInput.trim()) return;
    setAdding(true);
    try {
      const result = await addTagToImage(image.id, tagInput.trim(), session?.user?.id || "", source);
      if (result.success && result.tag) {
        setImage({
          ...image,
          tags: [...image.tags, result.tag],
        });
        setTagInput("");
        toast.success("Tag added!");
      } else {
        toast.error("Could not add tag");
      }
    } catch {
      toast.error("Error adding tag");
    } finally {
      setAdding(false);
    }
  };

  const handleAddSuggestedTag = async (tagValue: string) => {
    setAdding(true);
    try {
      const result = await addTagToImage(image.id, tagValue, session?.user?.id || "", "AI");
      if (result.success && result.tag) {
        setImage({
          ...image,
          tags: [...image.tags, result.tag],
        });
        // Remove the tag from suggested tags after adding
        setSuggestedTags(suggestedTags.filter((tag) => tag !== tagValue));
        toast.success("Tag added!");
      } else {
        toast.error("Could not add tag");
      }
    } catch {
      toast.error("Error adding tag");
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveTag = async (tagId: string) => {
    setAdding(true);
    try {
      const result = await removeTagFromImage(tagId);
      if (result.success) {
        setImage({
          ...image,
          tags: image.tags.filter((tag: any) => tag.id !== tagId),
        });
        toast.success("Tag removed!");
      } else {
        toast.error("Could not remove tag");
      }
    } catch {
      toast.error("Error removing tag");
    } finally {
      setAdding(false);
    }
  };

  const handleStartEditTag = (tagId: string, currentValue: string) => {
    setEditingTagId(tagId);
    setEditingTagValue(currentValue);
  };

  const handleSaveEditTag = async (tagId: string) => {
    if (!editingTagValue.trim()) {
      toast.error("Tag value cannot be empty");
      return;
    }
    setAdding(true);
    try {
      const result = await updateTag(tagId, editingTagValue.trim());
      if (result.success && result.tag) {
        setImage({
          ...image,
          tags: image.tags.map((tag: any) => (tag.id === tagId ? result.tag : tag)),
        });
        setEditingTagId(null);
        setEditingTagValue("");
        toast.success("Tag updated!");
      } else {
        toast.error("Could not update tag");
      }
    } catch {
      toast.error("Error updating tag");
    } finally {
      setAdding(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingTagId(null);
    setEditingTagValue("");
  };

  if (isLoading || isPending) {
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
            <Link href="/groups">
              <span className="inline-flex items-center text-blue-600 underline text-sm">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Groups
              </span>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <Link href={`/groups/group-detail?groupId=${encodeURIComponent(image.groupId)}`}>
            <Button variant="ghost" size="sm" className="cursor-pointer mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Images
            </Button>
          </Link>
          <CardTitle>Add Tags to Image</CardTitle>
          <CardDescription>
            Original Name: <span className="font-medium">{image.originalName}</span>
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
            <div className="text-xs text-muted-foreground truncate w-full text-center">{image.filename}</div>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <TagIcon className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {image.tags.length === 0 ? (
                <span className="text-sm text-muted-foreground">No tags yet.</span>
              ) : (
                image.tags.map((tag: any) => (
                  <div key={tag.id} className="relative group">
                    {editingTagId === tag.id ? (
                      <div className="flex items-center gap-1 bg-white dark:bg-zinc-800 border rounded-md p-1">
                        <Input
                          type="text"
                          value={editingTagValue}
                          onChange={(e) => setEditingTagValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSaveEditTag(tag.id);
                            } else if (e.key === "Escape") {
                              handleCancelEdit();
                            }
                          }}
                          className="h-6 w-32 text-sm"
                          autoFocus
                          maxLength={32}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => handleSaveEditTag(tag.id)}
                          disabled={adding}
                        >
                          ✓
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={handleCancelEdit}
                          disabled={adding}
                        >
                          ✗
                        </Button>
                      </div>
                    ) : (
                      <Badge variant="outline" className={`${getTagColor(tag.source)} pr-1`}>
                        {tag.value}
                        <span className="ml-1 text-xs opacity-60">{tag.source || "USER"}</span>
                        {tag.createdById === session?.user?.id && (
                          <div className="inline-flex ml-1 gap-0.5">
                            <button
                              onClick={() => handleStartEditTag(tag.id, tag.value)}
                              className="hover:bg-black/10 dark:hover:bg-white/10 rounded p-0.5"
                              disabled={adding}
                            >
                              <Pencil className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleRemoveTag(tag.id)}
                              className="hover:bg-black/10 dark:hover:bg-white/10 rounded p-0.5"
                              disabled={adding}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <form onSubmit={handleAddTag} className="flex gap-2 mb-2">
            <Input
              type="text"
              placeholder="Add a tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              disabled={adding}
              maxLength={32}
            />
            <Select value={source} onValueChange={(value) => setSource(value as "USER" | "AI")}>
              <SelectTrigger>
                <SelectValue placeholder="Select a source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="AI">AI</SelectItem>
              </SelectContent>
            </Select>

            <Button type="submit" disabled={adding || !tagInput.trim()}>
              {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />}
              Add
            </Button>
          </form>
          <div className="text-xs text-muted-foreground mb-2">Example tags: "cat", "outdoor", "night", etc.</div>
          <Button onClick={handleSuggestTags} disabled={adding || usedAI} className="cursor-pointer w-full mb-4">
            {usedAI ? "Tags already suggested" : "Suggest tags (AI)"}
          </Button>

          {suggestedTags.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-semibold mb-2 text-muted-foreground">Suggested Tags (click to add):</div>
              <div className="flex flex-wrap gap-2">
                {suggestedTags.map((tag) => (
                  <Badge
                    key={tag}
                    onClick={() => handleAddSuggestedTag(tag)}
                    className="cursor-pointer bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AnnotateImagePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <AnnotateImagePageContent />
    </Suspense>
  );
}
