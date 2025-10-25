"use client";
import { getUserGroups } from "@/actions/group_actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Image as ImageIcon, FolderOpen } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";

type Group = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  _count: {
    images: number;
    members: number;
  };
  images: Array<{
    id: string;
    status: "UNLABELED" | "LABELED" | "REVIEWED";
  }>;
};

export default function UserGroupsPage() {
  const { data: session, isPending } = useSession();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGroups() {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const result = await getUserGroups(session.user.id);
        if (result.success && result.groups) {
          setGroups(result.groups as Group[]);
        } else {
          setError(result.error || "Failed to fetch groups");
        }
      } catch (err) {
        setError("An error occurred while fetching groups");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    if (!isPending) {
      fetchGroups();
    }
  }, [session, isPending]);

  if (isPending || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your groups...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Please sign in to view your groups</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Groups</h1>
          <p className="text-muted-foreground">Groups you've been assigned to for image labeling</p>
        </div>

        {groups.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No groups assigned</h3>
              <p className="text-muted-foreground text-center max-w-sm">
                You haven't been assigned to any groups yet. Contact your administrator to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <Link key={group.id} href={`/groups/group-detail?groupId=${group.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="truncate">{group.name}</span>
                    </CardTitle>
                    {group.description && (
                      <CardDescription className="line-clamp-2">{group.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <ImageIcon className="h-4 w-4" />
                        <span>{group._count.images} images</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{group._count.members} labelers</span>
                      </div>
                    </div>

                    {group.images.length > 0 && (
                      <div className="mt-4">
                        <div className="text-xs text-muted-foreground mb-1">Status</div>
                        <div className="flex gap-2 text-xs">
                          <span className="text-yellow-600">
                            {group.images.filter((img) => img.status === "UNLABELED").length} unlabeled
                          </span>
                          <span className="text-cyan-600">
                            {group.images.filter((img) => img.status === "LABELED").length} labeled
                          </span>
                          <span className="text-emerald-600">
                            {group.images.filter((img) => img.status === "REVIEWED").length} reviewed
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
