# Getting Travel — Reserva de transfers

Aplicação responsiva para pesquisa e reserva demonstrativa de transfers privados no Porto, construída com React, TypeScript, Vite e CSS Modules.

## Fluxo implementado

1. O utilizador indica origem, destino, data, horário e passageiros na landing page.
2. A aplicação abre a página de transfers disponíveis.
3. O utilizador seleciona o nível de serviço e uma viatura compatível com o grupo.
4. O preço estimado é calculado para ida ou ida e volta.
5. O checkout recolhe os dados do passageiro e a forma de pagamento no veículo.
6. A aplicação apresenta uma confirmação demonstrativa com referência da reserva.

Também existe uma área de cliente com formulários de login e criação de conta. A autenticação é apenas frontend e não envia credenciais para um servidor.

## Destaques técnicos

- Rotas internas sem dependência adicional, através da History API.
- Estado da reserva preservado em `sessionStorage` durante o fluxo.
- Sessão demonstrativa preservada em `localStorage`.
- Formulários controlados, tipados e com validação acessível.
- Serviços e viaturas armazenados em ficheiros de dados tipados.
- Viaturas incompatíveis com o número de passageiros ficam desativadas.
- Cálculo centralizado do preço estimado.
- Checkout sem recolha de dados reais de cartão.
- Navegação por teclado, foco visível e suporte a `prefers-reduced-motion`.
- CSS Modules, tokens globais e layout responsivo.
- Regras de fallback para rotas no Vercel e Netlify.

## Executar

```bash
npm install
npm run dev
```

## Validar

```bash
npm run lint
npm run type-check
npm run test
npm run build
```

## Páginas

- `/` — landing page e pesquisa;
- `/conta` — login, cadastro e conta iniciada;
- `/transfers` — serviços e veículos disponíveis;
- `/checkout` — dados do passageiro e confirmação;
- `/confirmacao` — referência e resumo da reserva.

## Estrutura principal

```text
src/
├── assets/
├── components/
│   ├── BookingForm/
│   ├── Header/
│   ├── OrderSummary/
│   ├── PageShell/
│   ├── ProgressSteps/
│   ├── ServiceCard/
│   ├── TripSummary/
│   └── VehicleCard/
├── data/
│   ├── transferServices.ts
│   └── vehicles.ts
├── hooks/
│   ├── useAppRouter.ts
│   ├── useAuthForm.ts
│   ├── useBookingForm.ts
│   ├── useCheckoutForm.ts
│   └── useStoredState.ts
├── pages/
│   ├── AuthPage/
│   ├── CheckoutPage/
│   ├── ConfirmationPage/
│   ├── HomePage/
│   ├── NotFoundPage/
│   └── TransfersPage/
├── sections/
├── styles/
├── types/
├── utils/
├── App.tsx
└── main.tsx
```

## Integrações reais ainda necessárias

A interface não inventa backend ou pagamento. Para produção, ainda é necessário:

- integrar autenticação real;
- consultar disponibilidade e preços num serviço real;
- enviar e persistir reservas num backend;
- integrar um fornecedor de pagamento, caso exista pagamento online;
- substituir preços demonstrativos por preços comerciais;
- adicionar contactos, política de privacidade e termos oficiais;
- configurar notificações por email ou SMS.
