"use client";

import { KommoCard } from "@/components/admin/kommo-card";
import { AdminsCard } from "@/components/admin/admins-card";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-extrabold text-heading">Configurações</h1>
        <p className="text-sm text-muted-foreground">
          Integração com o Kommo e administradores do painel.
        </p>
      </header>

      <AdminsCard />
      <KommoCard />
    </div>
  );
}
