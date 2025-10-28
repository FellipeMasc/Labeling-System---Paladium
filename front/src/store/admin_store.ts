import { create } from "zustand";
import { AdminStats } from "@/dtos/admin";
import { getAdminStats } from "@/actions/admin_stats_actions";
import { toast } from "sonner";
import { getGroups, getGroupById } from "@/actions/group_actions";

interface AdminStore {
  stats: AdminStats;
  isLoading: boolean;
  currentGroup: any | null;
  isRefreshing: boolean;
  setRefreshing: (refreshing: boolean) => void;
  groups: any | null;
  setLoading: (loading: boolean) => void;
  setStats: (stats: AdminStats) => void;
  getStats: () => Promise<void>;
  getGroups: () => Promise<void>;
  getGroup: (groupId: string) => Promise<void>;
}

export const useAdminStore = create<AdminStore>((set) => ({
  currentGroup: null,
  groups: null,
  isRefreshing: false,
  setRefreshing: (refreshing: boolean) => set({ isRefreshing: refreshing }),
  stats: {
    totalUsers: 0,
    totalGroups: 0,
    totalImages: 0,
    totalLabelers: 0,
    unlabeledImages: 0,
    labeledImages: 0,
    reviewedImages: 0,
    averageUsersLikelihoodScore: 0,
  },
  group: {
    id: "",
    name: "",
    description: null,
    createdAt: new Date(),
    members: [],
    images: [],
  },
  isLoading: false,
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setStats: (stats: AdminStats) => set({ stats }),
  getStats: async () => {
    set({ isLoading: true });
    const result = await getAdminStats();
    set({ isLoading: false });
    if (result.success) {
      set({ stats: result.stats });
    } else {
      toast.error(result.error);
    }
  },
  getGroup: async (groupId: string) => {
    set({ isLoading: true });
    const result = await getGroupById(groupId);
    set({ isLoading: false, isRefreshing: false });
    if (result.success) {
      set({ currentGroup: result.group });
    } else {
      toast.error(result.error);
    }
  },
  getGroups: async () => {
    set({ isLoading: true });
    const result = await getGroups();
    set({ isLoading: false, isRefreshing: false });
    if (result.success) {
      set({ groups: result.groups });
    } else {
      toast.error(result.error);
    }
  },
}));
