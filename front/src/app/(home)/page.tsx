"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen, LogOut, Tag, User } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl mb-4">
            Image Labeling Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Welcome {session?.user?.name ? `, ${session.user.name}` : ""}! Manage your image labeling groups and
            contribute to Paladium's dataset.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <FolderOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>My Groups</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                View and access all the groups you've been assigned to for image labeling.
              </CardDescription>
              <Link href="/groups">
                <Button className="w-full cursor-pointer">View Groups</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <User className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Your Profile</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>{session?.user?.email || "Not signed in"}</CardDescription>
              <Button variant="ghost" size="sm" className="cursor-pointer mb-2" onClick={() => handleSignOut()}>
                <LogOut className="h-4 w-4 mr-1" /> Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  1
                </div>
                <div>
                  <h3 className="font-medium mb-1">Check Your Groups</h3>
                  <p className="text-sm text-muted-foreground">
                    Navigate to "My Groups" to see which image collections you've been assigned to.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  2
                </div>
                <div>
                  <h3 className="font-medium mb-1">Select a Group</h3>
                  <p className="text-sm text-muted-foreground">
                    Click on any group to view its details and see the images that need labeling.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  3
                </div>
                <div>
                  <h3 className="font-medium mb-1">Start Labeling</h3>
                  <p className="text-sm text-muted-foreground">
                    Add tags and annotations to images to help build high-quality datasets.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
