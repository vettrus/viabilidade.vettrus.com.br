import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/lead-schema";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  // Forward to a lead webhook/CRM when configured; otherwise accept and log.
  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error(`Webhook respondeu ${res.status}`);
    } catch (err) {
      console.error("Falha ao encaminhar lead:", err);
      return NextResponse.json(
        { error: "Não foi possível enviar agora. Tente novamente." },
        { status: 502 },
      );
    }
  } else {
    console.info("Novo lead (sem webhook configurado):", parsed.data);
  }

  return NextResponse.json({ ok: true });
}
