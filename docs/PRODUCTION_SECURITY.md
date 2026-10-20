# Preparação segura para produção

## 1. Aplicar as proteções do banco

Execute no SQL Editor, depois das migrations anteriores:

`supabase/migrations/20261019_zz_production_security_hardening.sql`

Em seguida, execute `supabase/security_check.sql`. As duas primeiras consultas
devem retornar zero linhas. Revise a lista de funções: somente endpoints usados
pelo aplicativo devem permitir execução por `anon` ou `authenticated`.

## 2. Simular a remoção dos usuários de teste

Use uma chave `service_role` apenas em um terminal administrativo. Nunca use
prefixo `VITE_`, nunca coloque essa chave no código e não envie o arquivo `.env`
ao Git.

```powershell
$env:SUPABASE_URL="https://SEU-PROJETO.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="SUA-CHAVE-SERVICE-ROLE"
npm run users:clear -- --all
```

O comando acima apenas mostra quem seria apagado. Para remover somente e-mails
específicos, use:

```powershell
npm run users:clear -- --emails "ana@mock.com,darcy@mock.com"
```

## 3. Executar a exclusão depois de conferir a lista

```powershell
$env:CONFIRM_DELETE_USERS="APAGAR_USUARIOS_DE_TESTE"
npm run users:clear -- --all --execute
```

O script remove primeiro os arquivos do usuário no Storage e depois remove a
conta pelo Admin API. As chaves estrangeiras com `on delete cascade` limpam os
dados relacionados. Ao terminar, feche o terminal para descartar as variáveis.

## 4. Checklist do painel Supabase

- Ative confirmação de e-mail para novas contas.
- Configure apenas os endereços reais do site em Auth > URL Configuration.
- Remova URLs de localhost antes do lançamento.
- Mantenha a chave `service_role` apenas em ambiente administrativo/servidor.
- Use a chave publicável/anon no navegador; ela depende das regras RLS.
- Revise os alertas do Security Advisor e do Performance Advisor.
- Defina expiração curta para JWT e considere MFA para contas administrativas.
- Faça backup antes da limpeza e antes de cada migration de produção.
