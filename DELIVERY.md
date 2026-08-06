# Entrega técnica — Getting Travel 3.0

## 1. Objetivo executado

O projeto deixou de ser apenas uma landing page com um diálogo de resumo e passou a apresentar um fluxo completo de reserva no frontend:

1. pesquisa da viagem na landing page;
2. escolha do serviço de transfer;
3. escolha de uma viatura compatível;
4. checkout com dados do passageiro;
5. confirmação demonstrativa da reserva;
6. área de login, cadastro e sessão local demonstrativa.

A identidade visual foi preservada: azul-marinho, laranja, tipografia forte, cartões claros, imagens das viaturas e logótipo fornecido.

## 2. Decisões de arquitetura

### Rotas sem dependência adicional

Foi criado `src/hooks/useAppRouter.ts`, utilizando a History API. Esta decisão evita instalar uma biblioteca apenas para cinco rotas e mantém o bundle reduzido.

Rotas criadas:

- `/`;
- `/conta`;
- `/transfers`;
- `/checkout`;
- `/confirmacao`.

Foram adicionados `vercel.json` e `public/_redirects` para permitir acesso direto às rotas em alojamentos SPA.

### Estado persistido

`src/hooks/useStoredState.ts` centraliza a leitura e escrita segura no armazenamento do navegador:

- dados da viagem, serviço, viatura e confirmação: `sessionStorage`;
- conta demonstrativa: `localStorage`.

### Dados e preços

- `src/data/transferServices.ts` contém os serviços disponíveis;
- `src/data/vehicles.ts` passou a incluir capacidade e suplemento;
- `src/utils/pricing.ts` centraliza o cálculo e a formatação em euros.

Todos os preços são identificados na interface como demonstrativos.

### Autenticação

A área de cliente é apenas uma demonstração frontend. Não são enviados emails, palavras-passe ou telefones para um servidor. A interface informa isso de forma explícita.

### Checkout

O checkout não recolhe números de cartão. As opções são pagamento no veículo por cartão ou dinheiro. Uma integração real deve ser adicionada posteriormente no backend ou através de um fornecedor de pagamentos.

## 3. Componentes criados

- `src/components/OrderSummary/OrderSummary.tsx`;
- `src/components/PageShell/PageShell.tsx`;
- `src/components/ProgressSteps/ProgressSteps.tsx`;
- `src/components/ServiceCard/ServiceCard.tsx`;
- `src/components/TripSummary/TripSummary.tsx`.

Cada componente visual possui o respetivo CSS Module quando necessário.

## 4. Páginas criadas

- `src/pages/HomePage/HomePage.tsx`;
- `src/pages/AuthPage/AuthPage.tsx`;
- `src/pages/TransfersPage/TransfersPage.tsx`;
- `src/pages/CheckoutPage/CheckoutPage.tsx`;
- `src/pages/ConfirmationPage/ConfirmationPage.tsx`;
- `src/pages/NotFoundPage/NotFoundPage.tsx`.

## 5. Hooks criados

- `src/hooks/useAppRouter.ts`;
- `src/hooks/useAuthForm.ts`;
- `src/hooks/useCheckoutForm.ts`;
- `src/hooks/useStoredState.ts`.

## 6. Ficheiros modificados

Principais ficheiros alterados:

- `src/App.tsx` — coordenação das rotas e do estado da reserva;
- `src/types/travel.ts` — novos tipos de serviço, utilizador, checkout, preço e confirmação;
- `src/data/vehicles.ts` — capacidade, bagagem e suplemento;
- `src/components/Header/Header.tsx` — acesso à conta e navegação entre páginas;
- `src/components/VehicleCard/VehicleCard.tsx` — preço, badge e estado indisponível;
- `src/sections/Hero/Hero.tsx` — integração com a navegação;
- `src/sections/Footer/Footer.tsx` — navegação entre páginas;
- `index.html` — descrição atualizada;
- `README.md` — novo fluxo e estrutura;
- `package.json` — versão 3.0.0.

## 7. Ficheiros removidos

- `src/components/BookingDialog/`;
- `src/hooks/useDialogFocus.ts`.

O diálogo foi substituído pelas páginas completas de seleção, checkout e confirmação.

## 8. Acessibilidade

- um único `h1` em cada página;
- navegação semântica e botão de salto para o conteúdo;
- formulários com labels, `aria-invalid` e mensagens associadas;
- serviços selecionados através de inputs radio reais;
- viaturas incompatíveis desativadas com mensagem de capacidade;
- foco visível global;
- navegação mobile acessível;
- etapas da reserva com `aria-current="step"`;
- animações continuam a respeitar `prefers-reduced-motion`.

## 9. Responsividade

As novas páginas utilizam grids que passam progressivamente para uma coluna em tablets e dispositivos móveis. O resumo lateral deixa de ser sticky em ecrãs menores e não existe largura fixa que provoque overflow horizontal.

## 10. Testes

Foram preservados os testes existentes e adicionados:

- `src/pages/AuthPage/AuthPage.test.tsx`;
- `src/pages/TransfersPage/TransfersPage.test.tsx`.

Cobrem criação de conta, seleção de serviço e bloqueio de viaturas sem capacidade.

## 11. Validação realizada no ambiente

Executado com sucesso:

- resolução de imports relativos em 51 ficheiros TypeScript/TSX;
- análise sintática e verificação TypeScript estrita com declarações temporárias de validação;
- verificação da árvore final e remoção do diálogo antigo.

A instalação oficial das dependências foi tentada, mas o registry interno devolveu `404` para `@eslint/js`. Uma segunda tentativa contra o registry público expirou por bloqueio de rede. Por esse motivo, não foi possível executar neste ambiente:

- `npm run lint`;
- `npm run test`;
- `npm run build`.

Executar localmente:

```bash
npm install
npm run lint
npm run type-check
npm run test
npm run build
```

## 12. Integrações pendentes para produção

- autenticação real;
- API de disponibilidade e preços;
- criação e persistência da reserva;
- emails ou SMS de confirmação;
- pagamento online, caso necessário;
- contactos, termos e política de privacidade oficiais;
- preços e regras comerciais definitivos.
