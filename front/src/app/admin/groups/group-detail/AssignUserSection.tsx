"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus, Loader2, X, Users } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getAvailableLabelers, assignMultipleUsersToGroup, removeUserFromGroup } from "@/actions/group_actions";

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

export default function AssignUserSection({ groupId, currentMembers }: { groupId: string; currentMembers: Member[] }) {
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadAvailableUsers();
  }, []);

  const loadAvailableUsers = async () => {
    const result = await getAvailableLabelers();
    console.log("result", result);
    if (result.success && result.users) {
      // Filter out users already in the group
      const memberIds = currentMembers.map((m) => m.userId);
      const available = result.users.filter((u) => !memberIds.includes(u.id));
      setAvailableUsers(available);
    }
  };

  const handleToggleUser = (userId: string) => {
    setSelectedUserIds((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]));
  };

  const handleSelectAll = () => {
    if (selectedUserIds.length === availableUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(availableUsers.map((u) => u.id));
    }
  };

  const handleAssign = async () => {
    if (selectedUserIds.length === 0) {
      toast.error("Please select at least one user");
      return;
    }

    setLoading(true);
    const result = await assignMultipleUsersToGroup(selectedUserIds, groupId);
    setLoading(false);

    if (result.success) {
      toast.success(`${result.count} user(s) assigned successfully`);
      setSelectedUserIds([]);
      router.refresh();
      loadAvailableUsers();
    } else {
      toast.error(result.error || "Failed to assign users");
    }
  };

  const handleRemove = async (userId: string) => {
    setRemoving(userId);
    const result = await removeUserFromGroup(userId, groupId);
    setRemoving(null);

    if (result.success) {
      toast.success("User removed successfully");
      router.refresh();
      loadAvailableUsers();
    } else {
      toast.error(result.error || "Failed to remove user");
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {/* Header with select all and assign button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Available Labelers</h3>
            <span className="text-sm text-muted-foreground">({selectedUserIds.length} selected)</span>
          </div>
          <div className="flex gap-2">
            {availableUsers.length > 0 && (
              <Button onClick={handleSelectAll} variant="outline" size="sm" disabled={loading}>
                {selectedUserIds.length === availableUsers.length ? "Deselect All" : "Select All"}
              </Button>
            )}
            <Button onClick={handleAssign} disabled={loading || selectedUserIds.length === 0} size="sm">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Assign ({selectedUserIds.length})
                </>
              )}
            </Button>
          </div>
        </div>

        {/* User list with checkboxes */}
        {availableUsers.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground border rounded-lg">
            No available labelers to assign
          </div>
        ) : (
          <div className="border rounded-lg divide-y max-h-64 overflow-y-auto">
            {availableUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => handleToggleUser(user.id)}
              >
                <Checkbox
                  checked={selectedUserIds.includes(user.id)}
                  onCheckedChange={() => handleToggleUser(user.id)}
                  disabled={loading}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Current members section */}
      {currentMembers.length > 0 && (
        <div className="space-y-2 pt-4 border-t">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Users className="h-4 w-4" />
            Assigned Labelers ({currentMembers.length})
          </h3>
          <div className="space-y-2">
            {currentMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-muted rounded-lg group">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{member.user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{member.user.email}</p>
                  <p className="text-xs text-muted-foreground">
                    Joined {new Date(member.joinedAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(member.userId)}
                  disabled={removing === member.userId}
                  className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  {removing === member.userId ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
