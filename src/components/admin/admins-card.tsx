"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAdmin,
  currentEmail,
  deleteAdmin,
  listAdmins,
  type AdminUser,
} from "@/lib/admin/api";
import {
  AdminButton,
  Card,
  Field,
  IconUserPlus,
  Input,
  Spinner,
} from "@/components/admin/ui";

// Senha forte aleatória (crypto). Evita caracteres ambíguos (0/O, 1/l/I).
function generatePassword(len = 14): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*";
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr, (n) => chars[n % chars.length]).join("");
}

function fmtDate(iso?: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("pt-BR");
  } catch {
    return iso;
  }
}

export function AdminsCard() {
  const qc = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const adminsQuery = useQuery({ queryKey: ["admins"], queryFn: listAdmins });
  const meQuery = useQuery({ queryKey: ["me-email"], queryFn: currentEmail });

  const create = useMutation({
    mutationFn: () => createAdmin(email.trim(), password),
    onSuccess: () => {
      setEmail("");
      setPassword("");
      setFormError(null);
      qc.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (e) => setFormError(e instanceof Error ? e.message : "Erro"),
  });

  const remove = useMutation({
    mutationFn: (userId: string) => deleteAdmin(userId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admins"] }),
  });

  const admins = adminsQuery.data ?? [];

  function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (password.length < 8) {
      setFormError("A senha precisa de ao menos 8 caracteres.");
      return;
    }
    create.mutate();
  }

  return (
    <Card>
      <h2 className="text-xl font-extrabold text-heading">Administradores</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Gerencie quem tem acesso ao painel.
      </p>

      {/* Form inline: E-mail | Senha | Adicionar */}
      <form
        onSubmit={onCreate}
        className="mt-5 grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto]"
      >
        <Field label="E-mail">
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nome@vettrus.com.br"
          />
        </Field>
        <Field label="Senha (mín. 8)">
          <div className="flex gap-2">
            <Input
              type="text"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="senha inicial"
            />
            <AdminButton
              variant="outline"
              className="shrink-0"
              title="Gerar senha aleatória"
              onClick={() => {
                setPassword(generatePassword());
                setFormError(null);
              }}
            >
              Gerar
            </AdminButton>
          </div>
        </Field>
        <AdminButton type="submit" disabled={create.isPending} className="h-11 px-5">
          {create.isPending ? <Spinner /> : <><IconUserPlus /> Adicionar</>}
        </AdminButton>
      </form>

      {formError && (
        <p className="mt-3 rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">
          {formError}
        </p>
      )}

      {/* Lista */}
      <div className="mt-5 border-t border-border pt-4">
        {adminsQuery.isLoading ? (
          <div className="flex justify-center py-6">
            <Spinner className="size-5 text-primary" />
          </div>
        ) : admins.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Nenhum administrador.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-border/60">
            {admins.map((a: AdminUser) => {
              const isSelf = a.email === meQuery.data;
              const removing = remove.isPending && remove.variables === a.id;
              return (
                <li key={a.id} className="flex items-center gap-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-heading">
                      {a.email}
                      {isSelf && (
                        <span className="ml-2 text-xs text-muted-foreground">(você)</span>
                      )}
                    </p>
                    {a.created_at && (
                      <p className="text-xs text-muted-foreground">
                        desde {fmtDate(a.created_at)}
                      </p>
                    )}
                  </div>
                  <AdminButton
                    variant="danger"
                    disabled={isSelf || removing}
                    onClick={() => {
                      if (confirm(`Remover o administrador ${a.email}?`))
                        remove.mutate(a.id);
                    }}
                  >
                    {removing ? <Spinner /> : "Remover"}
                  </AdminButton>
                </li>
              );
            })}
          </ul>
        )}
        {remove.isError && (
          <p className="mt-2 text-sm text-danger">{(remove.error as Error).message}</p>
        )}
      </div>
    </Card>
  );
}
