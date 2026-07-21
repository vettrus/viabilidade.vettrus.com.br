import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/shell";

// Server Component: metadata das rotas privadas /admin/*. noindex cobre os
// filhos (login/leads/settings) — que são client e não exportam metadata.
export const metadata: Metadata = {
  title: "Painel administrativo — Vettrus",
  robots: { index: false, follow: false },
  // Rotas privadas não compartilham: remove o OG/Twitter herdado do root.
  openGraph: null,
  twitter: null,
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
