"use client";
import { getGroupById } from "@/actions/group_actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, UserPlus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ImageUploadSection from "./ImageUploadSection";
import AssignUserSection from "./AssignUserSection";
import ImageGallery from "./ImageGallery";
import { useSearchParams } from "next/navigation";
import { useAdminStore } from "@/store/admin_store";
import { useEffect } from "react";

export default function GroupDetailPage() {
  const searchParams = useSearchParams();
  const { currentGroup, isLoading, getGroup } = useAdminStore();

  useEffect(() => {
    getGroup(searchParams.get("groupId") || "");
  }, [searchParams, getGroup]);

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }
  if (!currentGroup) {
    return <div className="p-8">Group not found</div>;
  }
  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/admin/groups">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Groups
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">{currentGroup.name}</h1>
        {currentGroup.description && <p className="text-muted-foreground">{currentGroup.description}</p>}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - Images */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Images</span>
                <span className="text-sm font-normal text-muted-foreground">{currentGroup.images.length} total</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploadSection groupId={currentGroup.id} />
            </CardContent>
          </Card>

          <ImageGallery images={currentGroup.images} />
        </div>

        {/* Right column - Assigned Labelers */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Labelers</CardTitle>
              <CardDescription>Users who can label images in this group</CardDescription>
            </CardHeader>
            <CardContent>
              <AssignUserSection groupId={currentGroup.id} currentMembers={currentGroup.members} />

              <div className="mt-4 space-y-2">
                {currentGroup.members.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No labelers assigned yet</p>
                ) : (
                  currentGroup.members.map((member: any) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{member.user.name}</p>
                        <p className="text-xs text-muted-foreground">{member.user.email}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{new Date(member.joinedAt).toLocaleDateString()}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Images</span>
                  <span className="font-medium">{currentGroup.images.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Unlabeled</span>
                  <span className="font-medium text-yellow-600">
                    {currentGroup.images.filter((img: any) => img.status === "UNLABELED").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Labeled</span>
                  <span className="font-medium text-cyan-600">
                    {currentGroup.images.filter((img: any) => img.status === "LABELED").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reviewed</span>
                  <span className="font-medium text-emerald-600">
                    {currentGroup.images.filter((img: any) => img.status === "REVIEWED").length}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-muted-foreground">Assigned Labelers</span>
                  <span className="font-medium">{currentGroup.members.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
