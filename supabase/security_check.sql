-- Auditoria somente leitura. Execute no SQL Editor depois da migration de
-- endurecimento. O resultado ideal das duas primeiras consultas é zero linhas.

-- 1. Tabelas expostas sem RLS.
select n.nspname as schema_name, c.relname as table_name
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'r'
  and not c.relrowsecurity
order by c.relname;

-- 2. Operações de escrita concedidas ao visitante anônimo.
select table_schema, table_name, privilege_type
from information_schema.role_table_grants
where grantee = 'anon'
  and table_schema = 'public'
  and privilege_type in ('INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER')
order by table_name, privilege_type;

-- 3. Políticas RLS efetivas para revisão manual.
select schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname in ('public', 'storage')
order by schemaname, tablename, policyname;

-- 4. Permissões das funções públicas mais sensíveis.
select
  n.nspname as schema_name,
  p.proname as function_name,
  p.prosecdef as security_definer,
  has_function_privilege('anon', p.oid, 'EXECUTE') as anon_execute,
  has_function_privilege('authenticated', p.oid, 'EXECUTE') as authenticated_execute
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
order by p.proname;
