# Lusóra Tranfers — Reserva de transfers

Aplicação frontend responsiva para pesquisa e reserva demonstrativa de transfers privados em Portugal, com preferência de resultados para a região do Porto.

Construída com React 18, TypeScript estrito, Vite, CSS Modules, Vitest e Testing Library. Não utiliza biblioteca de componentes nem cliente HTTP externo.

## Funcionalidades

- Autocomplete de origem e destino com a Geoapify Address Autocomplete API.
- Pesquisa limitada a Portugal, com preferência geográfica pela região do Porto.
- Combobox acessível com navegação por teclado e anúncios através de `aria-live`.
- Validação que exige localidades selecionadas e impede origem e destino iguais.
- Escolha do tipo de viagem, datas, horários e número de passageiros.
- Seleção de serviço e viatura compatível com o grupo.
- Cálculo demonstrativo do preço para ida ou ida e volta.
- Checkout demonstrativo e página de confirmação.
- Estado da reserva preservado em `sessionStorage` durante o fluxo.
- Área de cliente demonstrativa preservada em `localStorage`.

## Configuração local

Instale as dependências:

```bash
npm install
```

Crie um ficheiro `.env.local` a partir de `.env.example`:

```env
VITE_GEOAPIFY_API_KEY=a_sua_chave
```

Depois, inicie o servidor de desenvolvimento:

```bash
npm run dev
```

### Segurança da chave Geoapify

Variáveis com o prefixo `VITE_*` são incluídas no bundle do navegador. Esta chave não deve ser tratada como um segredo de servidor.

No painel da Geoapify:

- restrinja a chave aos domínios e origens autorizados;
- autorize apenas as APIs necessárias;
- configure separadamente os domínios de desenvolvimento e produção;
- não coloque uma chave real em `.env.example` ou noutro ficheiro versionado.

O ficheiro `.env.local` está ignorado pelo Git. Sem a variável configurada, a aplicação não executa o pedido e apresenta uma mensagem adequada. A reserva continua bloqueada até o utilizador selecionar uma localidade válida.

## Autocomplete de localidades

A integração utiliza `GET https://api.geoapify.com/v1/geocode/autocomplete` com estas regras:

- pesquisa iniciada a partir de três caracteres;
- debounce de 350 ms;
- máximo de seis sugestões em português;
- resultados limitados a Portugal;
- preferência geográfica pela região do Porto;
- cancelamento de pedidos anteriores com `AbortController`;
- cache em memória por consulta normalizada;
- proteção contra respostas antigas substituírem pesquisas mais recentes.

O código específico da Geoapify está isolado em `src/services/locationApi.ts`. Os componentes trabalham apenas com o tipo de domínio `LocationOption`, permitindo substituir o fornecedor sem acoplar as páginas à resposta externa.

As respostas são validadas antes da utilização. Resultados inválidos ou duplicados são descartados, e erros de configuração, rede, resposta e limite da API recebem mensagens distintas.

## Acessibilidade

Os campos de localidade implementam o padrão ARIA de combobox:

- `role="combobox"`, `aria-autocomplete`, `aria-expanded` e `aria-activedescendant`;
- sugestões com `role="listbox"` e `role="option"`;
- suporte a `ArrowDown`, `ArrowUp`, `Home`, `End`, `Enter` e `Escape`;
- foco mantido no input durante a navegação;
- erros associados através de `aria-invalid` e `aria-describedby`;
- estados e quantidade de resultados anunciados com `aria-live`.

## Persistência e compatibilidade

A reserva guarda os objetos completos de origem e destino no `sessionStorage`, incluindo identificador, label e coordenadas. Ao regressar ao formulário, as seleções são restauradas.

Reservas antigas que guardavam origem ou destino apenas como strings são rejeitadas com segurança.

## Fluxo da aplicação

1. O utilizador seleciona origem, destino, datas, horários e passageiros.
2. A aplicação apresenta serviços e viaturas disponíveis.
3. O utilizador escolhe o serviço e uma viatura compatível.
4. O preço estimado é calculado.
5. O checkout recolhe os dados do passageiro e a forma de pagamento no veículo.
6. A aplicação apresenta uma confirmação demonstrativa.

## Páginas

- `/` — landing page e formulário de pesquisa;
- `/conta` — login, criação de conta e sessão demonstrativa;
- `/transfers` — seleção do serviço e da viatura;
- `/checkout` — dados do passageiro e confirmação;
- `/confirmacao` — referência e resumo da reserva.

## Comandos disponíveis

```bash
npm run dev          # servidor de desenvolvimento
npm run build        # valida os tipos e gera a versão de produção
npm run preview      # pré-visualiza o build localmente
npm run lint         # executa o ESLint
npm run type-check   # verifica os tipos TypeScript
npm run test         # executa os testes uma vez
npm run test:watch   # executa os testes em modo interativo
npm run format       # formata os ficheiros com Prettier
npm run format:check # verifica a formatação
```

Para validar o projeto antes de publicar:

```bash
npm run lint
npm run type-check
npm run test
npm run build
```

Os testes da integração mockam `fetch` e não dependem de acesso à rede nem de uma chave real.

## Estrutura principal

```text
src/
├── assets/
├── components/
│   ├── BookingForm/
│   ├── LocationAutocomplete/
│   ├── OrderSummary/
│   └── TripSummary/
├── data/
├── hooks/
│   ├── useBookingForm.ts
│   ├── useLocationAutocomplete.ts
│   └── useStoredState.ts
├── pages/
├── sections/
├── services/
│   └── locationApi.ts
├── styles/
├── test/
├── types/
├── utils/
│   └── bookingStorage.ts
├── App.tsx
└── main.tsx
```

## Limitações da demonstração

- A autenticação existe apenas no frontend.
- Os serviços, preços e viaturas são dados demonstrativos.
- Não existe consulta real de disponibilidade.
- Nenhuma reserva é enviada para um backend.
- Não são processados dados reais de cartão ou pagamentos online.
- Não existe fallback silencioso para outro fornecedor de localidades.
- Texto livre não é aceite quando a Geoapify está indisponível; alterar essa regra exige uma decisão comercial explícita.

Para produção, ainda são necessários backend, persistência de reservas, autenticação real, disponibilidade, preços comerciais, notificações, documentos legais e eventual integração de pagamentos.
