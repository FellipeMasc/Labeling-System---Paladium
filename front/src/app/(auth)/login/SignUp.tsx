"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2, User, Mail, Lock } from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { createAdmin } from "@/actions/admin_actions";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const allRules = (password: string, passwordConfirmation: string, email: string, username: string) => {
    if (password.length < 8) {
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      return false;
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return false;
    }
    if (password !== passwordConfirmation) {
      return false;
    }
    if (!/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      return false;
    }
    if (username.length === 0) {
      return false;
    }
    return true;
  };

  return (
    <Card className="border-none shadow-none bg-background rounded-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-medium text-[var(--color-text-default)]">Cadastrar</CardTitle>
        <CardDescription className="text-[var(--color-text-subtle)]">
          Digite suas informações para criar uma conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name" className="text-[var(--color-text-default)] font-medium">
                Nome de Usuário
              </Label>
              <div className="relative">
                <Input
                  id="first-name"
                  placeholder="João"
                  required
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                  value={firstName}
                  className="pl-10 bg-background border-secondary focus:border-primary focus:ring-primary transition-all duration-200"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--color-text-subtle)]" />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="checkbox" className="text-[var(--color-text-default)] font-medium">
              Sou admin
            </Label>
            <Input
              id="checkbox"
              type="checkbox"
              checked={isAdmin}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsAdmin(e.target.checked)}
              className="w-4 h-4 border-secondary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[var(--color-text-default)] font-medium">
              Email
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
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
          {email.length > 0 && !/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email) && (
            <p className="text-red-500 text-sm">Email inválido</p>
          )}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[var(--color-text-default)] font-medium">
              Senha
            </Label>
            <div className="relative">
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="Senha"
                className="pl-10 bg-background border-secondary focus:border-primary focus:ring-primary transition-all duration-200"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--color-text-subtle)]" />
            </div>
          </div>

          {/* <div className="space-y-2">
            {password.length < 8 && password.length > 0 && (
              <p className="text-red-500 text-sm">A senha deve ter pelo menos 8 caracteres</p>
            )}
            {password.length > 0 && !/[A-Z]/.test(password) && (
              <p className="text-red-500 text-sm">A senha deve ter pelo menos uma letra maiúscula</p>
            )}
            {password.length > 0 && !/[!@#$%^&*]/.test(password) && (
              <p className="text-red-500 text-sm">A senha deve ter pelo menos um caracter especial</p>
            )}
          </div> */}
          <div className="space-y-2">
            <Label htmlFor="password_confirmation" className="text-[var(--color-text-default)] font-medium">
              Confirmar Senha
            </Label>
            <div className="relative">
              <Input
                id="password_confirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                autoComplete="new-password"
                placeholder="Confirmar Senha"
                className="pl-10 bg-background border-secondary focus:border-primary focus:ring-primary transition-all duration-200"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--color-text-subtle)]" />
            </div>
          </div>
          {/* {password !== passwordConfirmation && <p className="text-red-500 text-sm">As senhas não coincidem</p>} */}

          <Button
            type="submit"
            variant="default"
            className="w-full h-11 cursor-pointer"
            disabled={loading /* || !allRules(password, passwordConfirmation, email, firstName)*/}
            onClick={async () => {
              await signUp.email({
                email,
                password,
                name: `${firstName}`,
                callbackURL: "/",
                fetchOptions: {
                  onResponse: () => {
                    setLoading(false);
                  },
                  onRequest: () => {
                    setLoading(true);
                  },
                  onError: (ctx) => {
                    // Verificar se é o erro específico de usuário já existente
                    if (
                      ctx.error.code === "USER_ALREADY_EXISTS" ||
                      (ctx.error.message && ctx.error.message.includes("User already exists"))
                    ) {
                      toast.error("Este email já está cadastrado. Por favor, use outro email ou faça login.");
                    } else {
                      toast.error(ctx.error.message || "Erro ao criar conta. Tente novamente.");
                    }
                  },
                  onSuccess: async (data) => {
                    // Verifica se o usuário foi realmente criado
                    console.log(data);
                    try {
                      // Verificar sessão
                      const response = await fetch("/api/auth/get-session");
                      const sessionData = await response.json();
                      if (isAdmin) {
                        await createAdmin(sessionData.user.id);
                        router.push("/admin");
                      } else {
                        router.push("/");
                      }
                    } catch (error) {
                      console.error("Erro ao verificar sessão após registro:", error);
                    }
                  },
                },
              });
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processando...
              </span>
            ) : (
              "Criar conta"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
