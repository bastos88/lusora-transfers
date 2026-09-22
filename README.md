# Lusora Transfers

Plataforma de reservas de transfers privados em Portugal, com frontend em Next.js e API Laravel. O projeto inclui pesquisa de localidades, cálculo de orçamento, autenticação de cliente, criação de reservas, área de cliente e administração operacional no backend.

## Stack

- Next.js 16, React 19 e TypeScript no frontend.
- CSS Modules e CSS global próprio, sem biblioteca de componentes.
- Vitest e Testing Library para testes do frontend.
- Laravel 13, PHP 8.3, Sanctum, Filament e MySQL no backend.
- Stripe para fluxo de pagamento online no backend.
- Geoapify para autocomplete de localidades.

## Funcionalidades

- Pesquisa de origem e destino com autocomplete limitado a Portugal e preferência pela região do Porto.
- Proxy de localidades via backend, mantendo a chave Geoapify fora do bundle do navegador.
- Formulário de reserva com tipo de viagem, datas, horários, passageiros e bagagem.
- Seleção de serviço e viatura compatível com o grupo.
- Cálculo de orçamento e validação do total esperado antes de criar a reserva.
- Checkout com pagamento no veículo ou checkout Stripe, conforme configuração.
- Autenticação, registo, recuperação de palavra-passe e perfil de cliente.
- Área de cliente com listagem, detalhe e cancelamento de reservas.
- Painel administrativo Filament para gerir reservas, viaturas, serviços, FAQs, testemunhos e utilizadores.

## Estrutura

```text
app/                 Rotas Next.js App Router
src/                 Componentes, vistas, serviços, hooks, dados e estilos do frontend
backend/             API Laravel, Filament, modelos, migrations, testes e integrações
public/              Assets públicos do frontend
docs/                Documentação auxiliar
compose.yaml         MySQL local para desenvolvimento
```

## Requisitos

- Node.js compatível com Next.js 16.
- npm.
- PHP 8.3 ou superior.
- Composer.
- MySQL 8.4, local ou via Docker Compose.

## Configuração do frontend

Instale as dependências na raiz do projeto:

```bash
npm install
```

Crie `.env.local` a partir de `.env.example`:

```env
BACKEND_URL=http://127.0.0.1:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`BACKEND_URL` é usado pelo servidor Next.js para ler catálogo e dados vindos da API Laravel. `NEXT_PUBLIC_SITE_URL` define a origem pública usada em metadados e links.

Inicie o frontend:

```bash
npm run dev
```

Por padrão, a aplicação fica disponível em `http://localhost:3000`.

## Configuração do backend

Entre na pasta do backend:

```bash
cd backend
composer install
npm install
```

Crie o ficheiro `.env` do Laravel e gere a chave da aplicação:

```bash
copy .env.example .env
php artisan key:generate
```

Configure no `.env` a base de dados, a URL do frontend e as chaves externas necessárias. Os nomes exatos dependem do ambiente, mas estes são os pontos principais:

```env
APP_URL=http://127.0.0.1:8000
FRONTEND_URL=http://localhost:3000
GEOAPIFY_API_KEY=a_sua_chave_geoapify
STRIPE_KEY=a_sua_chave_publica_stripe
STRIPE_SECRET=a_sua_chave_secreta_stripe
STRIPE_WEBHOOK_SECRET=o_segredo_do_webhook
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=lusora
DB_USERNAME=lusora
DB_PASSWORD=a_sua_password
```

Se quiser usar o MySQL incluído no projeto, defina as passwords no ambiente e suba o serviço:

```bash
$env:DB_PASSWORD="a_sua_password"
$env:MYSQL_ROOT_PASSWORD="a_password_root"
docker compose up -d mysql
```

Depois execute as migrations e, se necessário, os seeders:

```bash
php artisan migrate
php artisan db:seed
```

Inicie a API:

```bash
php artisan serve
```

Para usar o script de desenvolvimento do Laravel, que arranca servidor, fila, logs e Vite do backend em paralelo:

```bash
composer run dev
```

## Painel administrativo

O backend usa Filament. Depois de configurar o Laravel, crie um administrador com o comando do projeto, informando o email do utilizador:

```bash
php artisan lusora:create-admin admin@example.com
```

Aceda ao painel em:

```text
http://127.0.0.1:8000/admin
```

## Rotas principais

Frontend:

- `/` - página inicial e formulário de pesquisa.
- `/transfers` - seleção de serviço e viatura.
- `/checkout` - dados do passageiro e pagamento.
- `/confirmation` - confirmação da reserva.
- `/login`, `/register`, `/forgot-password`, `/reset-password` - autenticação.
- `/customer` - área de cliente.
- `/customer/bookings` - reservas do cliente.
- `/customer/profile` - perfil do cliente.

API Laravel:

- `/api/locations` - autocomplete de localidades via Geoapify.
- `/api/quotes` - cálculo de orçamento.
- `/api/bookings` - criação e consulta de reservas autenticadas.
- `/api/vehicles` - catálogo de viaturas.
- `/api/login`, `/api/register`, `/api/logout`, `/api/user` - autenticação e sessão.
- `/api/stripe/webhook` - webhook Stripe.

## Comandos úteis

Na raiz do projeto:

```bash
npm run dev          # servidor Next.js de desenvolvimento
npm run build        # build de produção do frontend
npm run start        # executa o build Next.js
npm run lint         # ESLint em src e app
npm run type-check   # verificação TypeScript
npm run test         # testes do frontend
npm run test:watch   # testes em modo watch
npm run format       # formata com Prettier
npm run format:check # verifica formatação
```

No backend:

```bash
composer run dev     # servidor Laravel, fila, logs e Vite em paralelo
composer run test    # testes PHPUnit/Laravel
php artisan migrate  # migrations
php artisan db:seed  # seeders
npm run dev          # Vite do backend
npm run build        # build dos assets do backend
```

Validação recomendada antes de publicar alterações no frontend:

```bash
npm run lint
npm run type-check
npm run test
npm run build
```

Validação recomendada no backend:

```bash
cd backend
composer run test
npm run build
```

## Geoapify

A pesquisa de localidades chama `/api/locations` no frontend. O backend encaminha o pedido para `https://api.geoapify.com/v1/geocode/autocomplete` com a chave `GEOAPIFY_API_KEY`.

Regras implementadas no frontend:

- pesquisa a partir de três caracteres;
- debounce antes do pedido;
- cache em memória por consulta normalizada;
- cancelamento de pedidos anteriores com `AbortController`;
- validação e normalização dos resultados recebidos;
- mensagens distintas para erro de configuração, rede, limite da API e ausência de resultados.

A chave Geoapify deve ficar apenas no `.env` do backend. Restrinja a chave por domínio/origem e ative apenas as APIs necessárias no painel da Geoapify.

## Persistência e estado

- O fluxo de reserva preserva dados temporários no navegador para permitir avançar entre páginas.
- A reserva final é criada no backend quando o checkout é submetido.
- Reservas e dados de cliente exigem sessão autenticada via Laravel Sanctum.
- O backend valida preço, passageiros, bagagem, datas e permissões antes de aceitar operações críticas.

## Testes

O frontend cobre serviços, hooks e vistas principais com Vitest e Testing Library. Os testes da pesquisa de localidades mockam `fetch`, por isso não dependem de rede nem de uma chave Geoapify real.

O backend inclui testes de autenticação, reservas e Stripe em `backend/tests`.

## Limitações e notas de produção

- Os preços, serviços, viaturas e conteúdos podem depender dos seeders e do catálogo configurado no backend.
- Disponibilidade real de viaturas, gestão operacional avançada e notificações devem ser revistas antes de produção.
- Pagamentos Stripe exigem configuração das chaves e do webhook no ambiente final.
- CORS, cookies, `APP_URL`, `FRONTEND_URL`, domínio público e HTTPS devem ser ajustados para o domínio de produção.
- Não versione ficheiros `.env` com chaves reais.
