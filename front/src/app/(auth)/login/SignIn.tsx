"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Loader2, Mail, Lock } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <Card className="border-none shadow-none bg-background rounded-none min-h-[400px]">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-medium text-[var(--color-text-default)]">Login</CardTitle>
        <CardDescription className="text-[var(--color-text-subtle)]">
          Enter your email below to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[var(--color-text-default)] font-medium">
              Email
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="paladium.ai@exemplo.com"
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
                className="pl-10 bg-background border-secondary focus:border-primary focus:ring-primary transition-all duration-200"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--color-text-subtle)]" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="password" className="text-[var(--color-text-default)] font-medium">
                Senha
              </Label>
            </div>
            <div className="relative">
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                autoComplete="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-background border-secondary focus:border-primary focus:ring-primary transition-all duration-200"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--color-text-subtle)]" />
            </div>
          </div>

          <Button
            type="submit"
            variant="default"
            className="w-full h-11 cursor-pointer"
            disabled={loading}
            onClick={async () => {
              try {
                setLoading(true);
                await signIn.email({
                  email,
                  password,
                  callbackURL: "/",
                  fetchOptions: {
                    onSuccess: () => {
                      // Redireciona automaticamente após login bem-sucedido
                    },
                    onError: async (ctx) => {
                      if (ctx.error.status === 401) {
                        toast.error("Email ou senha inválidos");
                      }
                      console.error("Erro de login:", ctx.error.message);
                    },
                  },
                });
              } catch (error) {
                console.error("Erro ao fazer login:", error);
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </span>
            ) : (
              "Login"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
