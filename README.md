# Profit Navigator 2026

Hub de precificacao tributaria com foco em leitura clara do preco de venda, markup divisor e impacto fiscal em 2026.

## Entregas do repositorio

### 1. Aplicacao principal

Pasta raiz do projeto Vite/React.

Entrega:

- experiencia mais parecida com sistema profissional
- layout mobile-first
- navegacao por abas
- base de calculo para MEI, Simples e Lucro Presumido
- explicacao visual do preco de venda

### 2. Extensao Chrome

Pasta: `chrome-extension`

Entrega:

- popup de calculo rapido
- rateio do DAS do MEI
- consulta de estados e ICMS interno

Como carregar:

1. Abra `chrome://extensions`
2. Ative `Developer mode`
3. Clique em `Load unpacked`
4. Selecione a pasta `chrome-extension`

### 3. Servidor MCP

Pasta: `mcp-server`

Entrega:

- tool `calculate_pricing`
- tool `explain_mei`
- tool `list_states_icms`

Uso basico:

```bash
cd mcp-server
npm install
npm start
```

## Rodar a aplicacao web

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Observacao importante

Se `vite` ou `vitest` falharem no seu ambiente Windows com erro de `spawn EPERM`, o problema tende a estar no ambiente local de execucao do `esbuild`, nao na logica da calculadora.
