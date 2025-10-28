"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminStore } from "@/store/admin_store";
import { Users, Layers, Image, CheckCircle, Clock, FileCheck, BarChart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboardPage() {
  const { stats, getStats, isLoading } = useAdminStore();
  console.log("stats", stats);
  useEffect(() => {
    getStats();
  }, []);

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      description: "Registered users in the system",
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Total Labelers",
      value: stats.totalLabelers,
      description: "Active labelers",
      icon: Users,
      color: "text-green-500",
    },
    {
      title: "Total Groups",
      value: stats.totalGroups,
      description: "Image groups created",
      icon: Layers,
      color: "text-purple-500",
    },
    {
      title: "Total Images",
      value: stats.totalImages,
      description: "Images in the system",
      icon: Image,
      color: "text-orange-500",
    },
    {
      title: "Unlabeled",
      value: stats.unlabeledImages,
      description: "Images waiting for labels",
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      title: "Labeled",
      value: stats.labeledImages,
      description: "Images with labels",
      icon: CheckCircle,
      color: "text-cyan-500",
    },
    {
      title: "Reviewed",
      value: stats.reviewedImages,
      description: "Reviewed images",
      icon: FileCheck,
      color: "text-emerald-500",
    },
    {
      title: "Average Users Likelihood Score",
      value: stats.averageUsersLikelihoodScore?.toFixed(2),
      description: "Average likelihood score of users",
      icon: BarChart,
      color: "text-red-500",
    },
  ];

  const router = useRouter();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <Button variant="outline" size="sm" className="w-full" onClick={() => router.push("/admin")}>
          Voltar
        </Button>
        <p className="text-muted-foreground">Overview of your labeling system</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Image Progress</CardTitle>
            <CardDescription>Overall labeling progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Unlabeled</span>
                  <span className="font-medium">
                    {stats.totalImages > 0 ? Math.round((stats.unlabeledImages / stats.totalImages) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{
                      width: `${stats.totalImages > 0 ? (stats.unlabeledImages / stats.totalImages) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Labeled</span>
                  <span className="font-medium">
                    {stats.totalImages > 0 ? Math.round((stats.labeledImages / stats.totalImages) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-cyan-500 h-2 rounded-full"
                    style={{
                      width: `${stats.totalImages > 0 ? (stats.labeledImages / stats.totalImages) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Reviewed</span>
                  <span className="font-medium">
                    {stats.totalImages > 0 ? Math.round((stats.reviewedImages / stats.totalImages) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{
                      width: `${stats.totalImages > 0 ? (stats.reviewedImages / stats.totalImages) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Key metrics at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average images per group</span>
                <span className="font-medium">
                  {stats.totalGroups > 0 ? Math.round(stats.totalImages / stats.totalGroups) : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Completion rate</span>
                <span className="font-medium">
                  {stats.totalImages > 0
                    ? Math.round(((stats.labeledImages + stats.reviewedImages) / stats.totalImages) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Review rate</span>
                <span className="font-medium">
                  {stats.totalImages > 0 ? Math.round((stats.reviewedImages / stats.totalImages) * 100) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
