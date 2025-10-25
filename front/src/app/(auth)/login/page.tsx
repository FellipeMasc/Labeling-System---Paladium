"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    localStorage.clear();
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-4">
        <div className="mb-2 text-center animate-fade-in-down">
          <h1 className="text-3xl font-medium text-[var(--color-text-default)] mb-2">
            Welcome to Paladium AI Labelling System
          </h1>
        </div>
        <div className="rounded-lg shadow-lg border border-[hsl(var(--positive-stroke))] bg-foreground overflow-hidden">
          <Tabs defaultValue="signin" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full rounded-xl h-14 p-1 bg-gradient-to-r from-surface via-primary to-surface backdrop-blur-sm  border-secondary">
              <TabsTrigger
                value="signin"
                className={cn(
                  "transition-all duration-300 rounded-lg text-[var(--color-text-default)] relative overflow-hidden group",
                  "hover:bg-[var(--layer-hover)] hover:shadow-sm",
                  "data-[state=active]:bg-primary data-[state=active]:text-[var(--color-text-subtle)] data-[state=active]:shadow-md"
                )}
              >
                <span className="relative z-10">Login</span>
                <span className="absolute inset-0 bg-gradient-to-tr from-[hsla(var(--btn-primary)/0.8)] to-[hsla(var(--btn-primary)/0.6)] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className={cn(
                  "transition-all duration-300 rounded-lg text-[var(--color-text-default)] relative overflow-hidden group",
                  "hover:bg-[var(--layer-hover)] hover:shadow-sm",
                  "data-[state=active]:bg-primary data-[state=active]:text-[var(--color-text-subtle)] data-[state=active]:shadow-md"
                )}
              >
                <span className="relative z-10">Register</span>
                <span className="absolute inset-0 bg-gradient-to-tr from-primary to-primary-hover opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
              </TabsTrigger>
            </TabsList>

            <div className="relative">
              <div
                className={cn(
                  "transition-all duration-300 transform",
                  activeTab === "signin"
                    ? "translate-x-0 opacity-100"
                    : "translate-x-[-100%] opacity-0 absolute inset-0"
                )}
              >
                <TabsContent value="signin" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  <SignIn />
                </TabsContent>
              </div>

              <div
                className={cn(
                  "transition-all duration-300 transform",
                  activeTab === "signup" ? "translate-x-0 opacity-100" : "translate-x-[100%] opacity-0 absolute inset-0"
                )}
              >
                <TabsContent value="signup" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  <SignUp />
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </div>

      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 bg-background rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-background rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "10s", animationDelay: "1s" }}
        />
      </div>
    </div>
  );
}
