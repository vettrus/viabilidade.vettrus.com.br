"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getKommoConfig,
  kommoLeadUrl,
  listLeads,
  retryKommo,
  type Lead,
} from "@/lib/admin/api";
import {
  AdminButton,
  Badge,
  Card,
  Input,
  Modal,
  Spinner,
} from "@/components/admin/ui";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "synced" | "error" | "pending";

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function leadStatus(lead: Lead): StatusFilter {
  if (lead.kommo_error) return "error";
  if (lead.kommo_lead_id) return "synced";
  return "pending";
}

function KommoStatus({ lead }: { lead: Lead }) {
  const s = leadStatus(lead);
  if (s === "synced") return <Badge tone="success">Sincronizado</Badge>;
  if (s === "error") return <Badge tone="danger">Erro</Badge>;
  return <Badge tone="warn">Pendente</Badge>;
}

function utmSummary(utm: Record<string, string>): string {
  const parts = [utm.utm_source, utm.utm_medium, utm.utm_campaign].filter(Boolean);
  return parts.length ? parts.join(" · ") : "—";
}

const norm = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/** Extrai pares "Chave: valor" da mensagem (mesmo formato usado no Kommo). */
function messageExtras(message?: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!message) return out;
  message
    .split(/\s·\s|\s\|\s|\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .forEach((part) => {
      const m = part.match(/^([^:]+):\s*(.+)$/);
      if (m) out[norm(m[1])] = m[2].trim();
    });
  return out;
}

// ---------------------------------------------------------------------------
// CSV export (delimitador ; + BOM → abre certo no Excel PT-BR)
// ---------------------------------------------------------------------------
function toCsv(leads: Lead[]): string {
  const headers = [
    "Data",
    "Nome",
    "E-mail",
    "WhatsApp",
    "Empresa",
    "Faturamento",
    "Investimento",
    "Origem",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "Status Kommo",
    "Kommo ID",
    "Erro Kommo",
  ];
  const esc = (v: unknown) => {
    const s = String(v ?? "");
    return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = leads.map((l) => {
    const ex = messageExtras(l.message);
    const utm = l.utm ?? {};
    const status =
      leadStatus(l) === "synced" ? "Sincronizado" : leadStatus(l) === "error" ? "Erro" : "Pendente";
    return [
      fmtDate(l.created_at),
      l.name,
      l.email,
      l.phone,
      l.company,
      ex[norm("Faturamento")],
      ex[norm("Investimento")],
      l.source_section,
      utm.utm_source,
      utm.utm_medium,
      utm.utm_campaign,
      utm.utm_content,
      status,
      l.kommo_lead_id,
      l.kommo_error,
    ]
      .map(esc)
      .join(";");
  });
  return "﻿" + [headers.join(";"), ...rows].join("\r\n");
}

function downloadCsv(leads: Lead[]) {
  const blob = new Blob([toCsv(leads)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = fmtDate(new Date().toISOString()).replace(/[/:\s,]/g, "-");
  a.href = url;
  a.download = `leads-${stamp}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "synced", label: "Sincronizado" },
  { key: "error", label: "Erro" },
  { key: "pending", label: "Pendente" },
];

const PAGE_SIZE = 20;

export default function LeadsPage() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<Lead | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);

  const leadsQuery = useQuery({ queryKey: ["leads"], queryFn: listLeads });
  const kommoQuery = useQuery({
    queryKey: ["kommo-config-min"],
    queryFn: getKommoConfig,
    staleTime: 5 * 60 * 1000,
  });
  const subdomain = kommoQuery.data?.subdomain;

  const retry = useMutation({
    mutationFn: (leadId: string) => retryKommo(leadId),
    onSuccess: async () => {
      const fresh = await qc.fetchQuery({ queryKey: ["leads"], queryFn: listLeads });
      // Mantém o modal aberto com o dado atualizado.
      setSelected((cur) => (cur ? fresh.find((l) => l.id === cur.id) ?? cur : cur));
    },
  });

  const leads = leadsQuery.data ?? [];
  const q = search.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      leads
        .filter((l) => status === "all" || leadStatus(l) === status)
        .filter((l) =>
          !q
            ? true
            : [l.name, l.email, l.phone, l.company, l.utm?.utm_campaign, l.source_section]
                .filter(Boolean)
                .some((v) => String(v).toLowerCase().includes(q)),
        ),
    [leads, status, q],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Volta pra pág. 1 quando filtro/busca muda o conjunto.
  useEffect(() => {
    setPage(1);
  }, [status, q]);

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-heading">Leads</h1>
          <p className="text-sm text-muted-foreground">
            {leadsQuery.isSuccess
              ? `${filtered.length} de ${leads.length} registro(s)`
              : "Carregando…"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar nome, e-mail, campanha…"
            className="h-10 w-56"
          />
          <AdminButton
            variant="outline"
            onClick={() => downloadCsv(filtered)}
            disabled={filtered.length === 0}
          >
            Exportar CSV
          </AdminButton>
          <AdminButton
            variant="outline"
            onClick={() => qc.invalidateQueries({ queryKey: ["leads"] })}
          >
            Atualizar
          </AdminButton>
        </div>
      </header>

      {/* Filtro de status Kommo */}
      <div className="flex flex-wrap gap-1">
        {STATUS_TABS.map((tab) => {
          const active = status === tab.key;
          const count =
            tab.key === "all"
              ? leads.length
              : leads.filter((l) => leadStatus(l) === tab.key).length;
          return (
            <button
              key={tab.key}
              onClick={() => setStatus(tab.key)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-heading",
              )}
            >
              {tab.label}{" "}
              <span className="text-xs opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {leadsQuery.isError && (
        <Card className="border-danger/40">
          <p className="text-sm text-danger">{(leadsQuery.error as Error).message}</p>
        </Card>
      )}

      <Card className="overflow-hidden p-0">
        {leadsQuery.isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner className="size-6 text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            Nenhum lead encontrado.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Data</th>
                  <th className="px-4 py-3 font-medium">Lead</th>
                  <th className="px-4 py-3 font-medium">Origem</th>
                  <th className="px-4 py-3 font-medium">Campanha (UTM)</th>
                  <th className="px-4 py-3 font-medium">Kommo</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((lead) => (
                  <tr
                    key={lead.id}
                    className="cursor-pointer border-b border-border/60 transition-colors hover:bg-muted/40"
                    onClick={() => setSelected(lead)}
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {fmtDate(lead.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-heading">{lead.name ?? "—"}</p>
                      <p className="text-xs text-muted-foreground">
                        {lead.email ?? lead.phone ?? "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {lead.source_section ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {utmSummary(lead.utm ?? {})}
                    </td>
                    <td className="px-4 py-3">
                      <KommoStatus lead={lead} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {filtered.length > PAGE_SIZE && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {(safePage - 1) * PAGE_SIZE + 1}–
            {Math.min(safePage * PAGE_SIZE, filtered.length)} de {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <AdminButton
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
            >
              Anterior
            </AdminButton>
            <span className="text-sm text-muted-foreground">
              Página {safePage} de {pageCount}
            </span>
            <AdminButton
              variant="outline"
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={safePage >= pageCount}
            >
              Próxima
            </AdminButton>
          </div>
        </div>
      )}

      <LeadModal
        lead={selected}
        subdomain={subdomain}
        onClose={() => setSelected(null)}
        onRetry={() => selected && retry.mutate(selected.id)}
        retrying={retry.isPending}
        retryError={retry.isError ? (retry.error as Error).message : null}
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1 border-b border-border/50 py-3 sm:flex-row sm:gap-6">
      <span className="w-40 shrink-0 text-muted-foreground">{label}</span>
      <span className="break-words font-medium text-heading">{value}</span>
    </div>
  );
}

function LeadModal({
  lead,
  subdomain,
  onClose,
  onRetry,
  retrying,
  retryError,
}: {
  lead: Lead | null;
  subdomain?: string;
  onClose: () => void;
  onRetry: () => void;
  retrying: boolean;
  retryError: string | null;
}) {
  const open = lead !== null;
  const ex = messageExtras(lead?.message);
  const utm = lead?.utm ?? {};
  const hasUtm = Object.keys(utm).some((k) => utm[k]);

  return (
    <Modal open={open} onClose={onClose}>
      {lead && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-heading">Detalhes do lead</h2>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                ID {lead.id}
              </p>
            </div>
            {lead.kommo_lead_id && (
              <a
                href={kommoLeadUrl(lead.kommo_lead_id, subdomain)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-col rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
              >
                <span className="inline-flex items-center gap-1">Abrir no Kommo ↗</span>
                <span className="text-xs">#{lead.kommo_lead_id}</span>
              </a>
            )}
          </div>

          <div className="text-sm">
            <Row label="Nome" value={lead.name} />
            <Row label="E-mail" value={lead.email} />
            <Row label="WhatsApp" value={lead.phone} />
            <Row label="Empresa" value={lead.company} />
            <Row label="Faturamento" value={ex[norm("Faturamento")]} />
            <Row label="Investimento" value={ex[norm("Investimento")]} />
            <Row label="Seção de origem" value={lead.source_section} />
            <Row label="Criado em" value={fmtDate(lead.created_at)} />
          </div>

          {lead.message && !ex[norm("Faturamento")] && (
            <div>
              <p className="mb-1 text-sm text-muted-foreground">Mensagem</p>
              <p className="whitespace-pre-wrap break-words rounded-md bg-muted/50 p-3 text-sm text-heading">
                {lead.message}
              </p>
            </div>
          )}

          {hasUtm && (
            <div>
              <p className="mb-1 text-sm text-muted-foreground">UTM</p>
              <pre className="overflow-x-auto rounded-md bg-muted/50 p-3 text-xs text-heading">
                {JSON.stringify(utm, null, 2)}
              </pre>
            </div>
          )}

          {lead.kommo_error && (
            <div className="rounded-md border border-danger/40 bg-danger/10 p-3">
              <p className="text-xs uppercase tracking-wide text-danger">
                Erro na sincronização
              </p>
              <p className="mt-1 whitespace-pre-wrap break-words text-sm text-danger">
                {lead.kommo_error}
              </p>
            </div>
          )}

          {retryError && <p className="text-sm text-danger">{retryError}</p>}

          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <AdminButton
              variant="outline"
              className="sm:flex-1"
              onClick={onRetry}
              disabled={retrying}
            >
              {retrying ? <Spinner /> : "Reenviar ao Kommo"}
            </AdminButton>
            <AdminButton className="h-11 sm:flex-1" onClick={onClose}>
              Fechar
            </AdminButton>
          </div>
        </div>
      )}
    </Modal>
  );
}
