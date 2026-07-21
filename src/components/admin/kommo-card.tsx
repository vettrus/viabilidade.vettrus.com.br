"use client";

import { useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getKommoConfig,
  listKommoCustomFields,
  saveKommoConfig,
  type KommoConfig,
  type KommoCustomField,
  type KommoFieldKey,
} from "@/lib/admin/api";
import {
  AdminButton,
  Badge,
  Card,
  Field,
  IconSave,
  Input,
  Spinner,
} from "@/components/admin/ui";

// Fallbacks espelham lp/_shared/kommo.ts (resolveField).
const FIELD_DEFS: { key: KommoFieldKey; label: string; fallback: number }[] = [
  { key: "origem_lead", label: "Origem do Lead", fallback: 188364 },
  { key: "investimento", label: "Investimento", fallback: 848356 },
  { key: "faturamento_texto", label: "Faturamento (Texto)", fallback: 854005 },
  { key: "cnpj_ativo", label: "Possui CNPJ Ativo?", fallback: 0 },
  { key: "canal_venda", label: "Qual canal principal de venda", fallback: 0 },
  { key: "objetivo_avaliar", label: "O que você quer avaliar?", fallback: 0 },
  { key: "utm_source", label: "utm_source", fallback: 185090 },
  { key: "utm_medium", label: "utm_medium", fallback: 185086 },
  { key: "utm_campaign", label: "utm_campaign", fallback: 185088 },
  { key: "utm_content", label: "utm_content", fallback: 185084 },
];

type FormState = {
  subdomain: string;
  base_url: string;
  access_token: string;
  pipeline_id: string;
  responsible_user_id: string;
  field_ids: Record<KommoFieldKey, string>;
};

const emptyFieldIds = () =>
  Object.fromEntries(FIELD_DEFS.map((f) => [f.key, ""])) as Record<KommoFieldKey, string>;

function toForm(cfg: KommoConfig): FormState {
  const field_ids = emptyFieldIds();
  for (const f of FIELD_DEFS) {
    const v = cfg.field_ids?.[f.key];
    if (v !== undefined && v !== null && String(v).trim()) field_ids[f.key] = String(v);
  }
  return {
    subdomain: cfg.subdomain ?? "",
    base_url: cfg.base_url ?? "",
    access_token: "",
    pipeline_id: cfg.pipeline_id ?? "",
    responsible_user_id: cfg.responsible_user_id ?? "",
    field_ids,
  };
}

export function KommoCard() {
  const configQuery = useQuery({ queryKey: ["kommo-config"], queryFn: getKommoConfig });

  const [form, setForm] = useState<FormState | null>(null);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  // Catálogo de campos Kommo: infinite scroll (paginado) + busca via API.
  const [fieldsOpen, setFieldsOpen] = useState(false);
  const [fieldItems, setFieldItems] = useState<KommoCustomField[]>([]);
  const [fieldPage, setFieldPage] = useState(0);
  const [fieldHasMore, setFieldHasMore] = useState(false);
  const [fieldQuery, setFieldQuery] = useState("");
  const [fieldsLoading, setFieldsLoading] = useState(false);
  const [fieldsError, setFieldsError] = useState<string | null>(null);
  const loadingRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function loadFields(page: number, query: string, replace: boolean) {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setFieldsLoading(true);
    setFieldsError(null);
    try {
      const q = query.trim();
      const res = await listKommoCustomFields({ page: q ? undefined : page, query: q || undefined });
      setFieldItems((prev) => (replace ? res.fields : [...prev, ...res.fields]));
      setFieldPage(res.page);
      setFieldHasMore(res.hasMore);
    } catch (e) {
      setFieldsError(e instanceof Error ? e.message : "Erro ao buscar campos");
    } finally {
      loadingRef.current = false;
      setFieldsLoading(false);
    }
  }

  function openFields() {
    setFieldsOpen(true);
    setFieldQuery("");
    loadFields(1, "", true);
  }

  function onFieldSearch(value: string) {
    setFieldQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => loadFields(1, value, true), 350);
  }

  function onFieldsScroll(e: React.UIEvent<HTMLDivElement>) {
    if (fieldQuery.trim() || !fieldHasMore || loadingRef.current) return;
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 48) {
      loadFields(fieldPage + 1, "", false);
    }
  }

  // Inicializa o form quando a config chega (padrão "ajustar estado no render":
  // guardado por `form === null`, não faz loop). https://react.dev/learn/you-might-not-need-an-effect
  if (form === null && configQuery.data) {
    setForm(toForm(configQuery.data));
  }

  const save = useMutation({
    mutationFn: () => {
      if (!form) throw new Error("Formulário não carregado");
      return saveKommoConfig({
        subdomain: form.subdomain,
        base_url: form.base_url,
        // Envia o token só quando o admin digitou algo novo.
        access_token: form.access_token.trim() || undefined,
        pipeline_id: form.pipeline_id,
        responsible_user_id: form.responsible_user_id,
        field_ids: form.field_ids,
      });
    },
    onSuccess: () => {
      setSavedMsg("Configuração salva.");
      setForm((f) => (f ? { ...f, access_token: "" } : f));
      configQuery.refetch();
      setTimeout(() => setSavedMsg(null), 4000);
    },
  });

  const cfg = configQuery.data;
  const hasToken = cfg?.has_token ?? false;

  if (configQuery.isLoading || !form) {
    return (
      <Card>
        <div className="flex justify-center py-16">
          <Spinner className="size-6 text-primary" />
        </div>
      </Card>
    );
  }

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => (f ? { ...f, [key]: value } : f));
  const setField = (key: KommoFieldKey, value: string) =>
    setForm((f) => (f ? { ...f, field_ids: { ...f.field_ids, [key]: value } } : f));

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-heading">Integração Kommo</h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Cadastre as credenciais do Kommo. Ficam salvas no banco e são usadas
            para sincronizar leads automaticamente.
          </p>
        </div>
        {cfg?.connected ? (
          <Badge tone="success">● Conectado</Badge>
        ) : cfg?.configured ? (
          <Badge tone="warn">● Configurado</Badge>
        ) : (
          <Badge tone="danger">● Desconectado</Badge>
        )}
      </div>

      <form
        className="mt-6 flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Subdomínio Kommo">
            <Input
              value={form.subdomain}
              onChange={(e) => set("subdomain", e.target.value)}
              placeholder="contatovettruscombr"
            />
          </Field>
          <Field label="URL base" hint="Opcional — sobrepõe o subdomínio.">
            <Input
              value={form.base_url}
              onChange={(e) => set("base_url", e.target.value)}
              placeholder="https://vettrus.kommo.com"
            />
          </Field>
        </div>

        <Field
          label="Access Token (longa duração)"
          hint={
            hasToken
              ? "Por segurança o valor fica oculto após salvar. Reenvie para alterar."
              : "Cole o token de longa duração do Kommo."
          }
        >
          <Input
            type="password"
            value={form.access_token}
            onChange={(e) => set("access_token", e.target.value)}
            placeholder={hasToken ? "•••••••••••••••• (salvo)" : "Bearer token"}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Pipeline ID" hint="Opcional — usa o padrão da conta se vazio.">
            <Input
              value={form.pipeline_id}
              onChange={(e) => set("pipeline_id", e.target.value)}
              placeholder="usa o padrão da conta se vazio"
            />
          </Field>
          <Field
            label="Responsável (User ID)"
            hint="Opcional — usa o padrão da conta se vazio."
          >
            <Input
              value={form.responsible_user_id}
              onChange={(e) => set("responsible_user_id", e.target.value)}
              placeholder="usa o padrão da conta se vazio"
            />
          </Field>
        </div>

        {/* IDs dos campos ------------------------------------------------ */}
        <div className="border-t border-border pt-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-heading">IDs dos campos no Kommo</h3>
              <p className="max-w-xl text-sm text-muted-foreground">
                Deixe vazio para detectar automaticamente pelo nome/code. Use
                &quot;Buscar na API&quot; para listar e copiar os IDs reais.
              </p>
            </div>
            <AdminButton
              variant="outline"
              onClick={openFields}
              disabled={fieldsLoading && !fieldsOpen}
            >
              {fieldsLoading && !fieldsOpen ? <Spinner /> : "Buscar na API"}
            </AdminButton>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {FIELD_DEFS.map((f) => (
              <Field key={f.key} label={f.label}>
                <Input
                  value={form.field_ids[f.key]}
                  onChange={(e) => setField(f.key, e.target.value)}
                  placeholder={
                    f.fallback ? `auto / fallback ${f.fallback}` : "auto (detecta pelo nome)"
                  }
                />
              </Field>
            ))}
          </div>

          {fieldsOpen && (
            <div className="mt-5">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Input
                  value={fieldQuery}
                  onChange={(e) => onFieldSearch(e.target.value)}
                  placeholder="Buscar campo por nome, code ou ID (na API)…"
                  className="h-9 flex-1"
                />
                <span className="text-sm text-muted-foreground">
                  {fieldItems.length}
                  {fieldHasMore && !fieldQuery.trim() ? "+" : ""} campo(s)
                </span>
              </div>

              {fieldsError && (
                <p className="mb-2 text-sm text-danger">{fieldsError}</p>
              )}

              <div
                onScroll={onFieldsScroll}
                className="max-h-72 overflow-y-auto rounded-md border border-border"
              >
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-card">
                    <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-3 py-2 font-medium">ID</th>
                      <th className="px-3 py-2 font-medium">Nome</th>
                      <th className="px-3 py-2 font-medium">Code</th>
                      <th className="px-3 py-2 font-medium">Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fieldItems.length === 0 && !fieldsLoading ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-3 py-6 text-center text-muted-foreground"
                        >
                          Nenhum campo encontrado.
                        </td>
                      </tr>
                    ) : (
                      fieldItems.map((cf) => (
                        <tr key={cf.id} className="border-t border-border/60">
                          <td className="px-3 py-1.5 font-mono text-primary">{cf.id}</td>
                          <td className="px-3 py-1.5 text-heading">{cf.name}</td>
                          <td className="px-3 py-1.5 text-muted-foreground">
                            {cf.code ?? "—"}
                          </td>
                          <td className="px-3 py-1.5 text-muted-foreground">{cf.type}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                {fieldsLoading && (
                  <div className="flex justify-center py-3">
                    <Spinner className="size-4 text-primary" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
          <span className="text-xs text-muted-foreground">
            {cfg?.source === "db"
              ? "Configuração ativa via banco."
              : cfg?.source === "env"
                ? "Ativa via variáveis de ambiente (legacy)."
                : "Ainda não configurado."}
          </span>
          <div className="flex items-center gap-3">
            {savedMsg && <span className="text-sm text-emerald-400">{savedMsg}</span>}
            {save.isError && (
              <span className="text-sm text-danger">
                {(save.error as Error).message}
              </span>
            )}
            <AdminButton type="submit" disabled={save.isPending} className="h-11 px-6">
              {save.isPending ? <Spinner /> : <><IconSave /> Salvar</>}
            </AdminButton>
          </div>
        </div>
      </form>
    </Card>
  );
}
