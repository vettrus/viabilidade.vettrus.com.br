"use client";

import { useQuery } from "@tanstack/react-query";
import { listLeads } from "@/lib/admin/api";
import { Spinner, Stat } from "@/components/admin/ui";

export default function OverviewPage() {
  const leadsQuery = useQuery({ queryKey: ["leads"], queryFn: listLeads });
  const leads = leadsQuery.data ?? [];

  const kommoErrors = leads.filter((l) => l.kommo_error).length;
  const experiments = new Set<string>();
  for (const l of leads) {
    for (const k of Object.keys(l.ab_assignments ?? {})) experiments.add(k);
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-extrabold text-heading">Visão geral</h1>
        <p className="text-sm text-muted-foreground">Resumo do painel.</p>
      </header>

      {leadsQuery.isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="size-6 text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Stat label="Leads capturados" value={leads.length} />
          <Stat
            label="Erros Kommo"
            value={kommoErrors}
            tone={kommoErrors > 0 ? "danger" : "default"}
          />
          <Stat label="Experimentos ativos" value={experiments.size} />
        </div>
      )}

      {leadsQuery.isError && (
        <p className="text-sm text-danger">{(leadsQuery.error as Error).message}</p>
      )}
    </div>
  );
}
