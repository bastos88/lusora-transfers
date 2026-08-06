# Auditoria e plano de refatoração

## Limitação de acesso ao repositório indicado

O repositório `bastos88/portifolio` devolveu `404 Not Found` tanto pela integração GitHub como pelo endereço público. Por isso, a auditoria foi realizada sobre o projeto Getting Travel disponível nesta conversa (`getting-travel-react-assets.zip`). Nenhuma alteração foi enviada ao GitHub.

## Estado inicial encontrado

### Stack

- React 18.3.1.
- TypeScript 5.7.2 em modo `strict`.
- Vite 5.4.14.
- CSS global num único ficheiro.
- Sem ESLint, Prettier ou testes configurados.

### Estrutura inicial

- `src/App.tsx` concentrava tipos, dados, ícones, formulário, carrossel, secções, modal e rodapé.
- `src/styles.css` concentrava todos os estilos da aplicação.
- Imagens eram servidas diretamente pela pasta `public`.
- O fundo principal usava um SVG ilustrativo em vez da fotografia fornecida.

### Problemas identificados

- Componente principal excessivamente grande e com várias responsabilidades.
- Dados repetitivos escritos diretamente no mesmo ficheiro da interface.
- Tipos locais, sem reutilização entre componentes.
- Estado do menu, formulário, carrossel e modal misturado no componente principal.
- CSS global com nomes de classes de toda a aplicação.
- Modal sem focus trap completo e sem reposição de foco.
- Mensagem de erro geral em vez de erros associados aos campos.
- Ausência de skip link.
- Ausência de suporte explícito a `prefers-reduced-motion` no carrossel.
- Imagens grandes em PNG sem otimização e sem importação pelo grafo do Vite.
- Metadados sociais, favicon, lint, formatação e testes ausentes.
- Contactos e regras comerciais não confirmados.

## Riscos

- O formulário é apenas demonstrativo e não verifica disponibilidade ou preço real.
- Avaliações atuais são conteúdo ilustrativo e precisam de validação antes da publicação.
- Contactos, política de privacidade, termos e condições ainda precisam de dados reais.
- Sem acesso ao repositório original não foi possível preservar ou comparar histórico, branches ou CI.

## Plano executado

1. Manter React, TypeScript e Vite para evitar uma atualização de dependências sem validação.
2. Dividir a landing page em componentes e secções com responsabilidades claras.
3. Extrair dados e tipos para ficheiros dedicados.
4. Migrar os estilos de secções e componentes para CSS Modules.
5. Criar hooks apenas para comportamentos com estado, efeitos ou limpeza.
6. Integrar e otimizar as imagens fornecidas.
7. Melhorar navegação por teclado, erros do formulário, modal e redução de movimento.
8. Adicionar metadados de SEO, favicon e imagem Open Graph.
9. Configurar ESLint, Prettier e Vitest.
10. Validar sintaxe localmente e documentar o bloqueio externo do registry de pacotes.
