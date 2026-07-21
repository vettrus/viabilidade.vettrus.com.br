"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn } from "@/lib/admin/api";
import { AdminButton, Card, Field, Input, Spinner } from "@/components/admin/ui";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      router.replace("/admin/leads");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao entrar");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <Image
            src="/assets/logo-vettrus.png"
            alt="Vettrus"
            width={368}
            height={84}
            priority
            className="h-12 w-auto"
          />
          <p className="text-sm text-muted-foreground">Painel administrativo</p>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Field label="E-mail">
            <Input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </Field>
          <Field label="Senha">
            <Input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </Field>
          {error && (
            <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">
              {error}
            </p>
          )}
          <AdminButton type="submit" disabled={loading} className="mt-2 h-11">
            {loading ? <Spinner /> : "Entrar"}
          </AdminButton>
        </form>
      </Card>
    </div>
  );
}
