import { getSupabase } from "@/lib/supabase/client";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------
export type Lead = {
  id: string;
  created_at: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  message: string | null;
  source_section: string | null;
  ab_assignments: Record<string, string>;
  utm: Record<string, string>;
  kommo_lead_id: string | null;
  kommo_synced_at: string | null;
  kommo_error: string | null;
};

export type AdminUser = {
  id: string;
  email: string;
  created_at?: string;
};

export type KommoFieldKey =
  | "origem_lead"
  | "investimento"
  | "faturamento_texto"
  | "cnpj_ativo"
  | "canal_venda"
  | "objetivo_avaliar"
  | "utm_source"
  | "utm_medium"
  | "utm_campaign"
  | "utm_content";

export type KommoConfig = {
  subdomain: string;
  base_url: string;
  pipeline_id: string;
  responsible_user_id: string;
  field_ids: Partial<Record<KommoFieldKey, number | string>>;
  has_token: boolean;
  configured: boolean;
  source: "db" | "env" | "none";
  connected: boolean;
};

export type KommoCustomField = {
  id: number;
  name: string;
  code: string | null;
  type: string;
};

// ---------------------------------------------------------------------------
// invoke — chama Edge Function no contrato { data } e extrai o erro do corpo.
// ---------------------------------------------------------------------------
async function invoke<T>(fn: string, payload?: unknown): Promise<T> {
  const supabase = getSupabase();
  const { data, error } = await supabase.functions.invoke(fn, {
    body: { data: payload ?? null },
  });
  if (error) {
    let message = error.message;
    const ctx = (error as { context?: Response }).context;
    if (ctx && typeof ctx.json === "function") {
      try {
        const body = await ctx.json();
        if (body?.error) message = body.error;
      } catch {
        // corpo não-JSON — mantém a mensagem original
      }
    }
    throw new Error(message);
  }
  return data as T;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export async function signIn(email: string, password: string) {
  const { error } = await getSupabase().auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
}

export async function signOut() {
  await getSupabase().auth.signOut();
}

export async function currentEmail(): Promise<string | null> {
  const { data } = await getSupabase().auth.getUser();
  return data.user?.email ?? null;
}

// ---------------------------------------------------------------------------
// Leads (PostgREST direto, RLS admin-only)
// ---------------------------------------------------------------------------
export async function listLeads(): Promise<Lead[]> {
  const { data, error } = await getSupabase()
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw new Error(error.message);
  return (data ?? []) as Lead[];
}

export async function retryKommo(leadId: string) {
  return invoke<{ ok: boolean }>("retry-kommo-sync", { leadId });
}

// ---------------------------------------------------------------------------
// Administradores
// ---------------------------------------------------------------------------
export async function listAdmins(): Promise<AdminUser[]> {
  const res = await invoke<{ admins: AdminUser[] }>("list-admins");
  return res.admins ?? [];
}

export async function createAdmin(email: string, password: string) {
  return invoke<{ ok: boolean; id: string }>("create-admin", { email, password });
}

export async function deleteAdmin(userId: string) {
  return invoke<{ ok: boolean }>("delete-admin", { userId });
}

// ---------------------------------------------------------------------------
// Kommo
// ---------------------------------------------------------------------------
export async function getKommoConfig(): Promise<KommoConfig> {
  return invoke<KommoConfig>("get-kommo-config");
}

export type SaveKommoInput = {
  subdomain: string;
  base_url: string;
  access_token?: string;
  pipeline_id: string;
  responsible_user_id: string;
  field_ids: Partial<Record<KommoFieldKey, string>>;
};

export async function saveKommoConfig(input: SaveKommoInput) {
  return invoke<{ ok: boolean; has_token: boolean }>("save-kommo-config", input);
}

export type KommoFieldsPage = {
  fields: KommoCustomField[];
  page: number;
  hasMore: boolean;
  total?: number;
};

export async function listKommoCustomFields(params?: {
  page?: number;
  query?: string;
}): Promise<KommoFieldsPage> {
  const res = await invoke<KommoFieldsPage>("list-kommo-custom-fields", params ?? {});
  return { fields: res.fields ?? [], page: res.page ?? 1, hasMore: !!res.hasMore, total: res.total };
}

// ---------------------------------------------------------------------------
// Helpers de UI
// ---------------------------------------------------------------------------
const KOMMO_FALLBACK_SUBDOMAIN = "contatovettruscombr";

/** Monta o link do lead no Kommo a partir do subdomínio configurado. */
export function kommoLeadUrl(kommoLeadId: string, subdomain?: string): string {
  const sub = (subdomain?.trim() || KOMMO_FALLBACK_SUBDOMAIN)
    .replace(/^https?:\/\//, "")
    .replace(/\.kommo\.com.*$/i, "")
    .replace(/\/.*$/, "");
  return `https://${sub}.kommo.com/leads/detail/${kommoLeadId}`;
}
