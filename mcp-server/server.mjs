import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import {
  ESTADOS,
  calculateCibsBase,
  calculateIsBase,
  calcularPrecificacao,
  checkReceitaPilotStatus,
  decodeNFeAccessKey,
  explainMei,
  getReceitaCatalogByCategory,
  isValidNFeAccessKey,
} from "./pricing-engine.mjs";

const server = new Server(
  { name: "profit-navigator-2026", version: "2.0.0" },
  { capabilities: { tools: {} } },
);

const tools = [
  {
    name: "calculate_pricing",
    description: "Calcula preco de venda com markup divisor para MEI, Simples ou Lucro Presumido.",
    inputSchema: {
      type: "object",
      properties: {
        regime: { type: "string", enum: ["mei", "simples", "presumido"] },
        custoProduto: { type: "number" },
        custoFrete: { type: "number" },
        custoFixoExtra: { type: "number" },
        taxaMarketplace: { type: "number" },
        margemDesejada: { type: "number" },
        faturamento12m: { type: "number" },
        meiCategoria: {
          type: "string",
          enum: ["comercio", "servicos", "comercio_servicos", "caminhoneiro"],
        },
        vendasMensais: { type: "number" },
        ufOrigem: { type: "string" },
        ufDestino: { type: "string" },
        incluirIva2026: { type: "boolean" },
      },
      required: ["regime", "custoProduto", "taxaMarketplace", "margemDesejada"],
    },
  },
  {
    name: "explain_mei",
    description: "Explica o DAS do MEI e calcula o rateio do imposto fixo por venda.",
    inputSchema: {
      type: "object",
      properties: {
        categoria: {
          type: "string",
          enum: ["comercio", "servicos", "comercio_servicos", "caminhoneiro"],
        },
        vendasMensais: { type: "number" },
      },
      required: ["categoria"],
    },
  },
  {
    name: "list_states_icms",
    description: "Lista estados brasileiros e o ICMS interno de referencia.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "decode_nfe_access_key",
    description: "Decodifica uma chave de acesso de NF-e ou NFC-e com 44 digitos.",
    inputSchema: {
      type: "object",
      properties: {
        chave: { type: "string" },
      },
      required: ["chave"],
    },
  },
  {
    name: "calculate_cibs_base",
    description: "Calcula a base de CBS e IBS para mercadorias a partir dos campos financeiros.",
    inputSchema: {
      type: "object",
      properties: {
        valorFornecimento: { type: "number" },
        ajusteValorOperacao: { type: "number" },
        juros: { type: "number" },
        multas: { type: "number" },
        acrescimos: { type: "number" },
        encargos: { type: "number" },
        descontosCondicionais: { type: "number" },
        fretePorDentro: { type: "number" },
        outrosTributos: { type: "number" },
        impostoSeletivo: { type: "number" },
        demaisImportancias: { type: "number" },
        icms: { type: "number" },
        iss: { type: "number" },
        pis: { type: "number" },
        cofins: { type: "number" },
      },
      required: ["valorFornecimento"],
    },
  },
  {
    name: "calculate_is_base",
    description: "Calcula a base do Imposto Seletivo a partir dos campos financeiros.",
    inputSchema: {
      type: "object",
      properties: {
        valorIntegralCobrado: { type: "number" },
        ajusteValorOperacao: { type: "number" },
        juros: { type: "number" },
        multas: { type: "number" },
        acrescimos: { type: "number" },
        encargos: { type: "number" },
        descontosCondicionais: { type: "number" },
        fretePorDentro: { type: "number" },
        outrosTributos: { type: "number" },
        demaisImportancias: { type: "number" },
        icms: { type: "number" },
        iss: { type: "number" },
        pis: { type: "number" },
        cofins: { type: "number" },
        bonificacao: { type: "number" },
        devolucaoVendas: { type: "number" },
      },
      required: ["valorIntegralCobrado"],
    },
  },
  {
    name: "get_receita_api_catalog",
    description: "Retorna o catalogo de endpoints do piloto da Receita agrupado por categoria.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "check_receita_pilot_status",
    description: "Verifica se o endpoint de versao do piloto da Receita esta acessivel.",
    inputSchema: { type: "object", properties: {} },
  },
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  if (name === "calculate_pricing") {
    return textResponse(calcularPrecificacao(args));
  }

  if (name === "explain_mei") {
    return textResponse(explainMei(args.categoria, args.vendasMensais));
  }

  if (name === "list_states_icms") {
    return textResponse(ESTADOS);
  }

  if (name === "decode_nfe_access_key") {
    if (!isValidNFeAccessKey(args.chave)) {
      return textResponse({
        ok: false,
        message: "A chave deve conter exatamente 44 digitos numericos.",
      });
    }

    return textResponse({
      ok: true,
      data: decodeNFeAccessKey(args.chave),
    });
  }

  if (name === "calculate_cibs_base") {
    return textResponse(calculateCibsBase(args));
  }

  if (name === "calculate_is_base") {
    return textResponse(calculateIsBase(args));
  }

  if (name === "get_receita_api_catalog") {
    return textResponse(getReceitaCatalogByCategory());
  }

  if (name === "check_receita_pilot_status") {
    return textResponse(await checkReceitaPilotStatus());
  }

  throw new Error(`Ferramenta nao suportada: ${name}`);
});

function textResponse(payload) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(payload, null, 2),
      },
    ],
  };
}

const transport = new StdioServerTransport();
await server.connect(transport);
