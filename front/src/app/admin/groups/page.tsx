"use client";
import { getGroups } from "@/actions/group_actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import CreateGroupDialog from "./CreateGroupDialog";
import { useAdminStore } from "@/store/admin_store";
import { useEffect } from "react";

export default function AdminGroupsPage() {
  const { groups, isLoading, getGroups } = useAdminStore();

  useEffect(() => {
    getGroups();
  }, [getGroups]);

  console.log(groups);

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }
  if (!groups) {
    return <div className="p-8">No groups found</div>;
  }
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Groups</h1>
          <p className="text-muted-foreground">Manage image groups and assign labelers</p>
        </div>
        <CreateGroupDialog />
      </div>

      {groups.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No groups yet</h3>
            <p className="text-muted-foreground mb-4">Create your first group to get started</p>
            <CreateGroupDialog />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group: any) => (
            <Link key={group.id} href={`/admin/groups/group-detail?groupId=${group.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{group.name}</span>
                  </CardTitle>
                  {group.description && <CardDescription className="line-clamp-2">{group.description}</CardDescription>}
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
                          {group.images.filter((img: any) => img.status === "UNLABELED").length} unlabeled
                        </span>
                        <span className="text-cyan-600">
                          {group.images.filter((img: any) => img.status === "LABELED").length} labeled
                        </span>
                        <span className="text-emerald-600">
                          {group.images.filter((img: any) => img.status === "REVIEWED").length} reviewed
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
  );
}
