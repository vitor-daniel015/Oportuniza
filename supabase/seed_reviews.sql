-- Mocks de avaliações do Oportuniza.
-- Execute no SQL Editor somente depois da migration 20260906_harden_marketplace_schema.sql.
-- O script é idempotente: os UUIDs fixos impedem duplicação ao executá-lo novamente.

begin;

insert into public.service_requests (
  id,
  contratante_id,
  prestador_id,
  categoria_id,
  titulo,
  descricao,
  cidade,
  estado,
  status,
  completed_at
)
values
  ('10000000-0000-4000-8000-000000000001', '1a51c774-b288-43f7-8622-47e4c916c425', 'd632cf65-6d5b-4198-bf40-46c5c4cc1af9', null, 'Reparo de vazamento', 'Reparo de vazamento e revisão da tubulação da cozinha.', 'Capela do Alto', 'SP', 'concluido', now() - interval '90 days'),
  ('10000000-0000-4000-8000-000000000002', '48c9b579-f8bc-479f-8376-6fa36786efe5', 'd632cf65-6d5b-4198-bf40-46c5c4cc1af9', null, 'Troca de torneira', 'Troca de torneira e correção de um pequeno vazamento.', 'Capela do Alto', 'SP', 'concluido', now() - interval '52 days'),
  ('10000000-0000-4000-8000-000000000003', 'dffc6d7e-5847-47fd-9f08-bb60c14be865', 'd632cf65-6d5b-4198-bf40-46c5c4cc1af9', null, 'Manutenção hidráulica', 'Manutenção preventiva na caixa de água e encanamentos.', 'Capela do Alto', 'SP', 'concluido', now() - interval '18 days'),

  ('10000000-0000-4000-8000-000000000004', '1a51c774-b288-43f7-8622-47e4c916c425', '39c95a7d-c9c1-4a2d-9845-c5cf7b316bf1', null, 'Construção de muro', 'Construção e acabamento de muro na área externa da residência.', 'Capela do Alto', 'SP', 'concluido', now() - interval '120 days'),
  ('10000000-0000-4000-8000-000000000005', '48c9b579-f8bc-479f-8376-6fa36786efe5', '39c95a7d-c9c1-4a2d-9845-c5cf7b316bf1', null, 'Reparo no telhado', 'Substituição de telhas quebradas e correção de infiltração.', 'Capela do Alto', 'SP', 'concluido', now() - interval '66 days'),

  ('10000000-0000-4000-8000-000000000006', 'dffc6d7e-5847-47fd-9f08-bb60c14be865', '5bd19bb7-612e-406c-a976-f94383017a07', null, 'Limpeza residencial', 'Limpeza completa e organização dos principais ambientes.', 'Capela do Alto', 'SP', 'concluido', now() - interval '35 days'),
  ('10000000-0000-4000-8000-000000000007', '1a51c774-b288-43f7-8622-47e4c916c425', '5bd19bb7-612e-406c-a976-f94383017a07', null, 'Limpeza pós-obra', 'Limpeza detalhada da residência após uma pequena reforma.', 'Capela do Alto', 'SP', 'concluido', now() - interval '12 days'),

  ('10000000-0000-4000-8000-000000000008', '48c9b579-f8bc-479f-8376-6fa36786efe5', '603cb11a-8af0-4c89-9359-705bad2e2432', null, 'Organização residencial', 'Organização de armários e limpeza técnica dos ambientes.', 'Capela do Alto', 'SP', 'concluido', now() - interval '73 days'),
  ('10000000-0000-4000-8000-000000000009', 'dffc6d7e-5847-47fd-9f08-bb60c14be865', '603cb11a-8af0-4c89-9359-705bad2e2432', null, 'Limpeza comercial', 'Limpeza e conservação de um pequeno espaço comercial.', 'Capela do Alto', 'SP', 'concluido', now() - interval '22 days'),

  ('10000000-0000-4000-8000-000000000010', '1a51c774-b288-43f7-8622-47e4c916c425', 'a6495e36-fc9c-4218-a792-f9bbb7b67d33', null, 'Cuidados infantis', 'Acompanhamento infantil durante um compromisso da família.', 'Capela do Alto', 'SP', 'concluido', now() - interval '44 days'),
  ('10000000-0000-4000-8000-000000000011', '48c9b579-f8bc-479f-8376-6fa36786efe5', 'a6495e36-fc9c-4218-a792-f9bbb7b67d33', null, 'Acompanhamento infantil', 'Cuidados infantis durante o período da tarde na residência.', 'Capela do Alto', 'SP', 'concluido', now() - interval '9 days'),

  ('10000000-0000-4000-8000-000000000012', 'dffc6d7e-5847-47fd-9f08-bb60c14be865', 'd3d1b1c0-a345-4e05-8ac4-b2a9ce97b616', null, 'Reboco externo', 'Aplicação de reboco e preparação da parede para pintura.', 'Capela do Alto', 'SP', 'concluido', now() - interval '81 days'),
  ('10000000-0000-4000-8000-000000000013', '1a51c774-b288-43f7-8622-47e4c916c425', 'd3d1b1c0-a345-4e05-8ac4-b2a9ce97b616', null, 'Assentamento de piso', 'Assentamento e acabamento de piso na área de serviço.', 'Capela do Alto', 'SP', 'concluido', now() - interval '28 days')
on conflict (id) do update set
  contratante_id = excluded.contratante_id,
  prestador_id = excluded.prestador_id,
  titulo = excluded.titulo,
  descricao = excluded.descricao,
  cidade = excluded.cidade,
  estado = excluded.estado,
  status = excluded.status,
  completed_at = excluded.completed_at;

insert into public.reviews (
  id,
  solicitacao_id,
  autor_id,
  avaliado_id,
  nota,
  comentario,
  created_at
)
values
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '1a51c774-b288-43f7-8622-47e4c916c425', 'd632cf65-6d5b-4198-bf40-46c5c4cc1af9', 5, 'Atendimento excelente. Resolveu o vazamento rapidamente e deixou tudo organizado.', now() - interval '89 days'),
  ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002', '48c9b579-f8bc-479f-8376-6fa36786efe5', 'd632cf65-6d5b-4198-bf40-46c5c4cc1af9', 4, 'Serviço bem executado e profissional muito educado. Recomendo.', now() - interval '51 days'),
  ('20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000003', 'dffc6d7e-5847-47fd-9f08-bb60c14be865', 'd632cf65-6d5b-4198-bf40-46c5c4cc1af9', 5, 'Foi pontual, explicou o problema e realizou uma manutenção muito cuidadosa.', now() - interval '17 days'),

  ('20000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000004', '1a51c774-b288-43f7-8622-47e4c916c425', '39c95a7d-c9c1-4a2d-9845-c5cf7b316bf1', 5, 'O muro ficou muito bem alinhado e o acabamento superou as expectativas.', now() - interval '119 days'),
  ('20000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000005', '48c9b579-f8bc-479f-8376-6fa36786efe5', '39c95a7d-c9c1-4a2d-9845-c5cf7b316bf1', 4, 'Bom trabalho no telhado e atendimento rápido. A infiltração foi resolvida.', now() - interval '65 days'),

  ('20000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000006', 'dffc6d7e-5847-47fd-9f08-bb60c14be865', '5bd19bb7-612e-406c-a976-f94383017a07', 5, 'A casa ficou impecável e muito bem organizada. Excelente profissional.', now() - interval '34 days'),
  ('20000000-0000-4000-8000-000000000007', '10000000-0000-4000-8000-000000000007', '1a51c774-b288-43f7-8622-47e4c916c425', '5bd19bb7-612e-406c-a976-f94383017a07', 4, 'Fez uma ótima limpeza pós-obra e teve muito cuidado com os móveis.', now() - interval '11 days'),

  ('20000000-0000-4000-8000-000000000008', '10000000-0000-4000-8000-000000000008', '48c9b579-f8bc-479f-8376-6fa36786efe5', '603cb11a-8af0-4c89-9359-705bad2e2432', 4, 'Organização muito boa e trabalho realizado dentro do prazo combinado.', now() - interval '72 days'),
  ('20000000-0000-4000-8000-000000000009', '10000000-0000-4000-8000-000000000009', 'dffc6d7e-5847-47fd-9f08-bb60c14be865', '603cb11a-8af0-4c89-9359-705bad2e2432', 5, 'Profissional cuidadosa, pontual e muito eficiente na limpeza comercial.', now() - interval '21 days'),

  ('20000000-0000-4000-8000-000000000010', '10000000-0000-4000-8000-000000000010', '1a51c774-b288-43f7-8622-47e4c916c425', 'a6495e36-fc9c-4218-a792-f9bbb7b67d33', 5, 'Muito carinhosa e responsável. As crianças adoraram a companhia.', now() - interval '43 days'),
  ('20000000-0000-4000-8000-000000000011', '10000000-0000-4000-8000-000000000011', '48c9b579-f8bc-479f-8376-6fa36786efe5', 'a6495e36-fc9c-4218-a792-f9bbb7b67d33', 5, 'Transmitiu muita confiança e manteve contato durante todo o período.', now() - interval '8 days'),

  ('20000000-0000-4000-8000-000000000012', '10000000-0000-4000-8000-000000000012', 'dffc6d7e-5847-47fd-9f08-bb60c14be865', 'd3d1b1c0-a345-4e05-8ac4-b2a9ce97b616', 4, 'Reboco bem feito, profissional experiente e ambiente entregue organizado.', now() - interval '80 days'),
  ('20000000-0000-4000-8000-000000000013', '10000000-0000-4000-8000-000000000013', '1a51c774-b288-43f7-8622-47e4c916c425', 'd3d1b1c0-a345-4e05-8ac4-b2a9ce97b616', 5, 'O piso ficou excelente. Trabalho caprichoso e ótimo acabamento.', now() - interval '27 days')
on conflict (id) do update set
  nota = excluded.nota,
  comentario = excluded.comentario,
  created_at = excluded.created_at;

insert into public.review_replies (
  id,
  avaliacao_id,
  prestador_id,
  resposta_texto,
  created_at
)
values
  ('30000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'd632cf65-6d5b-4198-bf40-46c5c4cc1af9', 'Muito obrigado pela confiança! Fico feliz que o problema tenha sido resolvido.', now() - interval '88 days'),
  ('30000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000004', '39c95a7d-c9c1-4a2d-9845-c5cf7b316bf1', 'Obrigado pela avaliação! Foi um prazer realizar esse trabalho.', now() - interval '118 days'),
  ('30000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000006', '5bd19bb7-612e-406c-a976-f94383017a07', 'Agradeço muito pelo retorno e pela preferência!', now() - interval '33 days'),
  ('30000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000009', '603cb11a-8af0-4c89-9359-705bad2e2432', 'Muito obrigada! Espero poder ajudar novamente em breve.', now() - interval '20 days'),
  ('30000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000010', 'a6495e36-fc9c-4218-a792-f9bbb7b67d33', 'Obrigada pela confiança e pelo carinho da família!', now() - interval '42 days'),
  ('30000000-0000-4000-8000-000000000006', '20000000-0000-4000-8000-000000000013', 'd3d1b1c0-a345-4e05-8ac4-b2a9ce97b616', 'Obrigado! Foi ótimo participar dessa melhoria na residência.', now() - interval '26 days')
on conflict (avaliacao_id) do update set
  resposta_texto = excluded.resposta_texto,
  created_at = excluded.created_at;

commit;

-- Conferência rápida das médias calculadas:
select
  p.nome,
  round(avg(r.nota)::numeric, 1) as media,
  count(r.id) as total_avaliacoes
from public.profiles p
join public.reviews r on r.avaliado_id = p.id
group by p.id, p.nome
order by p.nome;
