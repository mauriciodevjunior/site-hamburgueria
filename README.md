# Site Hamburgueria (React + Vite)

Aplicação de exemplo de hamburgueria com carrinho de compras, regras de pedido (retirada/entrega/PIX antecipado), checkout e mensagem via WhatsApp.

## Recursos implementados

- Estrutura de componentes: `Header`, `Hero`, `Menu`, `About`, `CTA`, `Footer`, `Cart`, `Checkout`
- Estado global via `CartContext` (Context API + useReducer)
- Carrinho persistente em `localStorage`
- Regras de negócios:
  - tipos de pedido: `retirada`, `entrega`, `pix_antecipado`
  - métodos de pagamento: `dinheiro`, `pix`, `cartao`
  - cálculo de total + taxa entrega + desconto PIX
- Integração de pedido via `WhatsApp` com mensagem pré-formatada (número: +55 51 99501-0567)

## Instalação

```bash
npm install
```

## Dev

```bash
npm run dev
```

O frontend roda em `http://localhost:5173` (ou 5174 se a porta 5173 estiver em uso).

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## Notas de segurança

- `localStorage` usado para estado de carrinho apenas. Não armazene dados sensíveis (cartão, CPF) no frontend.
- Valide preços, estoque e status do pedido em backend para produção.
- Use HTTPS em produção.

## Estrutura de pastas

- `src/App.jsx` - ponto de entrada da aplicação
- `src/contexts/CartContext.jsx` - lógica de carrinho, pedidos, ações e utilitários
- `src/components/*` - seções e componentes UI
- `src/index.css` + `styles.css` - estilos globais

## Atualização do projeto

Se você quiser separar o contexto em utilitários:

- crie `src/contexts/cart-utils.js`
- mova `ORDER_TYPES`, `ORDER_STATUS`, `PAYMENT_METHODS`, `calculateCartTotal`, `generateWhatsAppMessage` etc.
- deixe em `src/contexts/CartContext.jsx` apenas provider + hook

---

Feito por você com ajuda do Copilot (Raptor mini).

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
