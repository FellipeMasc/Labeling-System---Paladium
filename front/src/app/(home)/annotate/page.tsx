"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag as TagIcon, Loader2, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { getImageById, addTagToImage } from "@/actions/image_actions";
import { useSession } from "@/lib/auth-client";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

export default function AnnotateImagePage() {
  const searchParams = useSearchParams();
  const imageId = searchParams.get("imageId") || "";
  const [image, setImage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tagInput, setTagInput] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"USER" | "AI">("USER");
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const { data: session, isPending } = useSession();

  const handleSuggestTags = async () => {
    setSource("AI");
    // const result = await suggestTags(image.id);
    // if (result.success && result.tags) {
    // 	setImage({ ...image, tags: result.tags });
    // }
  };
  useEffect(() => {
    async function fetchImage() {
      if (!imageId) {
        setError("No image ID provided.");
        setIsLoading(false);
        return;
      }
      try {
        const result = await getImageById(imageId);
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
  }, [imageId]);

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
                  <Badge key={tag.id} className={getTagColor(tag.source)}>
                    {tag.value}
                    <span className="ml-1 text-xs opacity-60">{tag.source === "USER" ? "" : tag.source}</span>
                  </Badge>
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
          <Button onClick={handleSuggestTags} disabled={adding} className="cursor-pointer">
            Suggest tags (AI)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
