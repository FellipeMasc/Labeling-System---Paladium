"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getGroupById } from "@/actions/group_actions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Image as ImageIcon, ArrowLeft, Tag as TagIcon, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type User = {
  id: string;
  name: string;
  email: string;
};

type Member = {
  id: string;
  userId: string;
  user: User;
  joinedAt: Date;
};

type Tag = {
  id: string;
  value: string;
  source: "USER" | "AI" | "ADMIN";
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: Date;
};

type ImageType = {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  status: "UNLABELED" | "LABELED" | "REVIEWED";
  tags: Tag[];
};

type GroupType = {
  id: string;
  name: string;
  description: string | null;
  images: ImageType[];
  members: Member[];
  createdAt: string | Date;
};

function GroupDetailPageContent() {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId") || "";
  const [group, setGroup] = useState<GroupType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGroupDetail() {
      if (!groupId) {
        setError("No group ID provided");
        setIsLoading(false);
        return;
      }
      try {
        const result = await getGroupById(groupId);
        if (result.success && result.group) {
          setGroup(result.group as GroupType);
        } else {
          setError(result.error || "Failed to fetch group");
        }
      } catch (err) {
        setError("An error occurred while fetching the group");
      } finally {
        setIsLoading(false);
      }
    }
    fetchGroupDetail();
  }, [groupId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card>
          <CardContent className="py-12 text-center">
            <span className="text-muted-foreground">Loading group...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-red-500 mb-2">{error || "Group not found"}</div>
            <Link href="/group">
              <span className="text-blue-600 underline text-sm flex items-center justify-center">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Groups
              </span>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UNLABELED":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "LABELED":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200";
      case "REVIEWED":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
      default:
        return "";
    }
  };

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

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
      <div className="max-w-7xl mx-auto">
        <Link href="/groups">
          <span className="inline-flex items-center gap-1 text-blue-600 underline text-sm mb-4 cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
            Back to Groups
          </span>
        </Link>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{group.name}</CardTitle>
            {group.description && <CardDescription>{group.description}</CardDescription>}
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                <span>{group.images.length} images</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{group.members.length} labelers</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {group.images.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No images yet</h3>
              <p className="text-muted-foreground text-center max-w-sm">This group doesn't have any images yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {group.images.map((image) => (
              <Card key={image.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative w-32 h-32 flex-shrink-0 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                      <Image src={image.url} alt={image.originalName} fill className="object-cover" sizes="128px" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{image.originalName}</h3>
                          <p className="text-xs text-muted-foreground truncate">{image.filename}</p>
                        </div>
                        <Badge className={getStatusColor(image.status)}>{image.status}</Badge>
                      </div>

                      <div className="mt-3">
                        <div className="flex items-center gap-2 mb-2">
                          <TagIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Tags ({image.tags.length})</span>
                        </div>
                        {image.tags.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No tags yet</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {image.tags.map((tag) => (
                              <Badge key={tag.id} className={getTagColor(tag.source)}>
                                {tag.value}
                                <span className="ml-1 text-xs opacity-70">({tag.source})</span>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-4">
                        <Link href={`/annotate?imageId=${image.id}`}>
                          <Button size="sm" variant="outline">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Annotate
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function GroupDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <GroupDetailPageContent />
    </Suspense>
  );
}
