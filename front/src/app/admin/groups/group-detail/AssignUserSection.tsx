"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getAvailableLabelers, assignUserToGroup, removeUserFromGroup } from "@/actions/group_actions";

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
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadAvailableUsers();
  }, []);

  const loadAvailableUsers = async () => {
    const result = await getAvailableLabelers();
    if (result.success && result.users) {
      // Filter out users already in the group
      const memberIds = currentMembers.map((m) => m.userId);
      const available = result.users.filter((u) => !memberIds.includes(u.id));
      setAvailableUsers(available);
    }
  };

  const handleAssign = async () => {
    if (!selectedUserId) {
      toast.error("Please select a user");
      return;
    }

    setLoading(true);
    const result = await assignUserToGroup(selectedUserId, groupId);
    setLoading(false);

    if (result.success) {
      toast.success("User assigned successfully");
      setSelectedUserId("");
      router.refresh();
      loadAvailableUsers();
    } else {
      toast.error(result.error || "Failed to assign user");
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
      <div className="flex gap-2">
        <Select value={selectedUserId} onValueChange={setSelectedUserId} disabled={loading}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select a labeler" />
          </SelectTrigger>
          <SelectContent>
            {availableUsers.length === 0 ? (
              <div className="p-2 text-sm text-muted-foreground">No available labelers</div>
            ) : (
              availableUsers.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        <Button onClick={handleAssign} disabled={loading || !selectedUserId} size="sm">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              Assign
            </>
          )}
        </Button>
      </div>

      {/* Show current members with remove option */}
      {currentMembers.length > 0 && (
        <div className="space-y-2">
          {currentMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-3 bg-muted rounded-lg group">
              <div>
                <p className="font-medium text-sm">{member.user.name}</p>
                <p className="text-xs text-muted-foreground">{member.user.email}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(member.userId)}
                disabled={removing === member.userId}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {removing === member.userId ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
