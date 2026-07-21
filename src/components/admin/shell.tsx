"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getSupabase } from "@/lib/supabase/client";
import { signOut } from "@/lib/admin/api";
import { AdminButton, Spinner } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Visão geral", exact: true },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/settings", label: "Configurações" },
];

const isActive = (pathname: string, item: { href: string; exact?: boolean }) =>
  item.exact ? pathname === item.href : pathname.startsWith(item.href);

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";

  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // A tela de login se renderiza sozinha, sem shell. (O proxy já garante
  // sessão nas demais rotas /admin.)
  if (isLogin) return <>{children}</>;

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        <Spinner className="size-6 text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card/40 p-5 md:flex">
        <div className="mb-8 px-2">
          <Image
            src="https://supabase.viabilidade.vettrus.com.br/storage/v1/object/public/assets/logo-vettrus.png"
            alt="Vettrus"
            width={368}
            height={84}
            priority
            className="h-9 w-auto"
          />
          <p className="mt-2 text-xs text-muted-foreground">Painel administrativo</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const active = isActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-heading",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 border-t border-border pt-4">
          <p className="truncate px-3 pb-2 text-xs text-muted-foreground">{email}</p>
          <AdminButton
            variant="ghost"
            className="w-full justify-start"
            onClick={async () => {
              await signOut();
              router.replace("/admin/login");
            }}
          >
            Sair
          </AdminButton>
        </div>
      </aside>

      <div className="flex-1">
        {/* Nav mobile */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-border bg-card/40 px-4 py-2 md:hidden">
          {NAV.map((item) => {
            const active = isActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium",
                  active ? "bg-primary/15 text-primary" : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <button
            className="ml-auto whitespace-nowrap px-3 py-1.5 text-xs text-muted-foreground"
            onClick={async () => {
              await signOut();
              router.replace("/admin/login");
            }}
          >
            Sair
          </button>
        </div>

        <main className="mx-auto max-w-6xl p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
