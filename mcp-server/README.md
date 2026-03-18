# MCP Server

Servidor MCP focado em expor o motor fiscal e de precificacao do Profit Navigator 2026 para agentes e automacoes.

## Ferramentas

- `calculate_pricing`
- `explain_mei`
- `list_states_icms`
- `decode_nfe_access_key`
- `calculate_cibs_base`
- `calculate_is_base`
- `get_receita_api_catalog`
- `check_receita_pilot_status`

## Instalar

```bash
cd mcp-server
npm install
npm start
```

## Exemplo de configuracao MCP

```json
{
  "mcpServers": {
    "profit-navigator-2026": {
      "command": "node",
      "args": ["C:/caminho/para/profit-navigator-2026-main/mcp-server/server.mjs"]
    }
  }
}
```

## Objetivo

Permitir que um agente consulte rapidamente:

- preco de venda sugerido
- carga tributaria percentual
- rateio do DAS do MEI
- ICMS interno por estado
- base tecnica de CBS e IBS
- base tecnica de Imposto Seletivo
- leitura de chave NF-e
- catalogo de endpoints da Receita Federal
