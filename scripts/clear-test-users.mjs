import { createClient } from "@supabase/supabase-js";
import process from "node:process";

const args = process.argv.slice(2);
const execute = args.includes("--execute");
const deleteAll = args.includes("--all");
const emailIndex = args.indexOf("--emails");
const requestedEmails = new Set(
  emailIndex >= 0
    ? (args[emailIndex + 1] ?? "")
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean)
    : [],
);

if (!deleteAll && requestedEmails.size === 0) {
  throw new Error("Use --all ou --emails email1,email2 para selecionar usuários.");
}

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceRoleKey) {
  throw new Error(
    "Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY somente neste terminal administrativo.",
  );
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function listAllUsers() {
  const users = [];
  for (let page = 1; ; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 1000,
    });
    if (error) throw error;
    users.push(...data.users);
    if (data.users.length < 1000) return users;
  }
}

async function removeUserMedia(userId) {
  for (const folder of ["avatar", "portfolio"]) {
    const prefix = `${userId}/${folder}`;
    const { data, error } = await supabase.storage
      .from("profile-media")
      .list(prefix, { limit: 1000 });
    if (error) throw error;
    const paths = (data ?? []).map((item) => `${prefix}/${item.name}`);
    if (paths.length) {
      const { error: removeError } = await supabase.storage
        .from("profile-media")
        .remove(paths);
      if (removeError) throw removeError;
    }
  }
}

const users = await listAllUsers();
const targets = users.filter(
  (user) => deleteAll || requestedEmails.has((user.email ?? "").toLowerCase()),
);

console.table(
  targets.map((user) => ({ id: user.id, email: user.email ?? "sem e-mail" })),
);

if (!execute) {
  console.log(
    `Simulação: ${targets.length} usuário(s) seriam removidos. Acrescente --execute após conferir a lista.`,
  );
  process.exit(0);
}

if (process.env.CONFIRM_DELETE_USERS !== "APAGAR_USUARIOS_DE_TESTE") {
  throw new Error(
    "Para executar, defina CONFIRM_DELETE_USERS=APAGAR_USUARIOS_DE_TESTE.",
  );
}

for (const user of targets) {
  await removeUserMedia(user.id);
  const { error } = await supabase.auth.admin.deleteUser(user.id, false);
  if (error) throw error;
  console.log(`Removido: ${user.email ?? user.id}`);
}

console.log(`Limpeza concluída: ${targets.length} usuário(s) removidos.`);
