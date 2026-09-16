# Análise e decisões de migração

## Estado inicial

React 18 + TypeScript + Vite, sem backend, router próprio baseado em History API.
`src/pages` contém Home, Transfers, Checkout, Confirmation, Auth, CustomerArea e NotFound.
Os 13 componentes em `src/components` e as secções Hero, Features, Fleet, Testimonials,
FAQ, TrustBar e Footer usam CSS Modules; global.css define a identidade navy/laranja,
tipografia Inter, breakpoints e acessibilidade. Imagens, avatars e ícones locais são preservados.

Hooks: formulários de reserva/auth/checkout, autocomplete, router, storage, menu mobile,
carrossel e preferência de movimento. Autocomplete Geoapify: debounce 350ms, cache,
AbortController, navegação por teclado e tratamento de erros. A chave Vite estava exposta
ao browser; passa para Laravel. Não se copiam segredos para ficheiros versionados.

Dados estáticos: 4 categorias de veículo, 3 níveis de serviço, 10 testemunhos demonstrativos,
4 FAQs, características, navegação e indicadores de confiança. Os quatro primeiros conjuntos
passam para a base de dados; conteúdo editorial estrutural mantém-se nos componentes.

Reserva: ida/volta, localidades com coordenadas, datas/horas, 1–8 passageiros, seleção
de serviço/veículo, contacto, voo, notas, termos e pagamento à chegada (dinheiro/cartão).
Preço inicial: (32/45/62 EUR + suplemento 0/18/32/55 EUR) × 1 ou 2 trajetos.
Não existia cálculo de distância nem disponibilidade de viaturas individuais.

Autenticação era simulada. Utilizador e uma única confirmação residiam em localStorage;
rascunho e seleções em sessionStorage. Não existiam persistência partilhada, permissões,
pagamentos online, recuperação de password ou gestão administrativa.
Existem testes Vitest/Testing Library de formulários, navegação, frota, autocomplete e API.
Execução inicial bloqueada pelas permissões do sandbox no esbuild, antes de executar testes.

## Plano e arquitetura

1. Manter frontend na raiz, migrar para App Router e mover páginas de apresentação para
   `src/views` (evita conflito com Pages Router). Preservar CSS/artefactos visuais.
2. Laravel 13 independente em `backend`, Filament 5 em `/admin`, MySQL em desenvolvimento
   e produção; SQLite em memória apenas para testes automatizados.
3. Sanctum com sessão HttpOnly e CSRF. Browser usa API no mesmo domínio via rewrite Next;
   não há tokens/passwords em storage. Rotas privadas autorizadas no backend.
4. Preços em cêntimos inteiros e snapshot de preço na reserva; o servidor recalcula no
   momento da criação. Orçamentos não são pagamentos. Sem aceitar total enviado pelo cliente.
5. Manter ida/volta e contactos como snapshots para preservar dados históricos. Referência
   aleatória única e idempotência por cliente para impedir duplicados em retries.
6. Categorias de veículo, não inventário de motoristas/viaturas: disponibilidade operacional
   manual via ativo/disponível. Reserva começa pendente e pagamento pendente.
7. Cancelamento do cliente até 24 horas antes; transições e autorização no serviço/policy.
8. Filament gere catálogo, conteúdo e reservas; apenas role admin acede ao painel.

O anexo termina em `GET /api/bookings/{book`; não foram assumidos requisitos adicionais.

Referências oficiais consultadas: https://laravel.com/docs/13.x/sanctum,
https://filamentphp.com/docs/5.x/introduction/installation,
https://nextjs.org/docs/app/guides/migrating/from-vite.
