export const ESTADOS = [
  { uf: "AC", nome: "Acre", icmsInterno: 19 },
  { uf: "AL", nome: "Alagoas", icmsInterno: 19 },
  { uf: "AM", nome: "Amazonas", icmsInterno: 20 },
  { uf: "AP", nome: "Amapa", icmsInterno: 18 },
  { uf: "BA", nome: "Bahia", icmsInterno: 20.5 },
  { uf: "CE", nome: "Ceara", icmsInterno: 20 },
  { uf: "DF", nome: "Distrito Federal", icmsInterno: 20 },
  { uf: "ES", nome: "Espirito Santo", icmsInterno: 17 },
  { uf: "GO", nome: "Goias", icmsInterno: 19 },
  { uf: "MA", nome: "Maranhao", icmsInterno: 22 },
  { uf: "MG", nome: "Minas Gerais", icmsInterno: 18 },
  { uf: "MS", nome: "Mato Grosso do Sul", icmsInterno: 17 },
  { uf: "MT", nome: "Mato Grosso", icmsInterno: 17 },
  { uf: "PA", nome: "Para", icmsInterno: 19 },
  { uf: "PB", nome: "Paraiba", icmsInterno: 20 },
  { uf: "PE", nome: "Pernambuco", icmsInterno: 20.5 },
  { uf: "PI", nome: "Piaui", icmsInterno: 21 },
  { uf: "PR", nome: "Parana", icmsInterno: 19.5 },
  { uf: "RJ", nome: "Rio de Janeiro", icmsInterno: 22 },
  { uf: "RN", nome: "Rio Grande do Norte", icmsInterno: 20 },
  { uf: "RO", nome: "Rondonia", icmsInterno: 19.5 },
  { uf: "RR", nome: "Roraima", icmsInterno: 20 },
  { uf: "RS", nome: "Rio Grande do Sul", icmsInterno: 17 },
  { uf: "SC", nome: "Santa Catarina", icmsInterno: 17 },
  { uf: "SE", nome: "Sergipe", icmsInterno: 19 },
  { uf: "SP", nome: "Sao Paulo", icmsInterno: 18 },
  { uf: "TO", nome: "Tocantins", icmsInterno: 20 },
];

export const MEI_DAS_2026 = {
  comercio: { label: "MEI Comercio", totalMensal: 82.05, inss: 81.05, icms: 1, iss: 0 },
  servicos: { label: "MEI Servicos", totalMensal: 86.05, inss: 81.05, icms: 0, iss: 5 },
  comercio_servicos: { label: "MEI Comercio + Servicos", totalMensal: 87.05, inss: 81.05, icms: 1, iss: 5 },
  caminhoneiro: { label: "MEI Caminhoneiro", totalMensal: 200.52, inss: 194.52, icms: 1, iss: 5 },
};

export const RECEITA_API_BASE =
  "https://piloto-cbs.tributos.gov.br:48118/servico/calculadora-consumo/api";

export const RECEITA_ENDPOINTS = [
  {
    path: "/calculadora/dados-abertos/versao",
    method: "GET",
    category: "Dados Abertos",
    summary: "Versao do aplicativo e do banco de dados do piloto.",
    practicalUse: "Monitorar mudancas normativas e sincronismo da base oficial.",
  },
  {
    path: "/calculadora/dados-abertos/ufs",
    method: "GET",
    category: "Dados Abertos",
    summary: "Lista de UFs cadastradas.",
    practicalUse: "Atualizar cadastros de origem e destino no sistema.",
  },
  {
    path: "/calculadora/dados-abertos/ufs/municipios",
    method: "GET",
    category: "Dados Abertos",
    summary: "Municipios por UF.",
    practicalUse: "Cadastro, analitico regional e enderecamento fiscal.",
  },
  {
    path: "/calculadora/dados-abertos/situacoes-tributarias/cbs-ibs",
    method: "GET",
    category: "Dados Abertos",
    summary: "Situacoes tributarias de CBS e IBS.",
    practicalUse: "Atualizacao de CST e regras de classificacao.",
  },
  {
    path: "/calculadora/dados-abertos/situacoes-tributarias/imposto-seletivo",
    method: "GET",
    category: "Dados Abertos",
    summary: "Situacoes tributarias de Imposto Seletivo.",
    practicalUse: "Mapeamento de incidencia do IS.",
  },
  {
    path: "/calculadora/dados-abertos/ncm",
    method: "GET",
    category: "Dados Abertos",
    summary: "Consulta de NCM e incidencia de IS.",
    practicalUse: "Cadastro de produto e analise de mercadoria.",
  },
  {
    path: "/calculadora/dados-abertos/nbs",
    method: "GET",
    category: "Dados Abertos",
    summary: "Consulta de NBS e incidencia de IS.",
    practicalUse: "Cadastro de servicos e classificacao futura.",
  },
  {
    path: "/calculadora/dados-abertos/fundamentacoes-legais",
    method: "GET",
    category: "Dados Abertos",
    summary: "Fundamentacoes legais vinculadas a classificacoes.",
    practicalUse: "Memoria juridica para contador e auditoria.",
  },
  {
    path: "/calculadora/dados-abertos/classificacoes-tributarias/cbs-ibs",
    method: "GET",
    category: "Dados Abertos",
    summary: "Classificacoes tributarias de CBS e IBS.",
    practicalUse: "Catalogo fiscal para novos cadastros.",
  },
  {
    path: "/calculadora/dados-abertos/classificacoes-tributarias/imposto-seletivo",
    method: "GET",
    category: "Dados Abertos",
    summary: "Classificacoes do Imposto Seletivo.",
    practicalUse: "Regras de incidencia e cruzamento com produto/servico.",
  },
  {
    path: "/calculadora/dados-abertos/aliquota-uniao",
    method: "GET",
    category: "Dados Abertos",
    summary: "Aliquota federal.",
    practicalUse: "Comparacao entre simulacao e aliquota governamental.",
  },
  {
    path: "/calculadora/dados-abertos/aliquota-uf",
    method: "GET",
    category: "Dados Abertos",
    summary: "Aliquota estadual.",
    practicalUse: "Atualizacao da camada por estado.",
  },
  {
    path: "/calculadora/dados-abertos/aliquota-municipio",
    method: "GET",
    category: "Dados Abertos",
    summary: "Aliquota municipal.",
    practicalUse: "Componente municipal e consultas geograficas.",
  },
  {
    path: "/calculadora/regime-geral",
    method: "POST",
    category: "Calculadora",
    summary: "Calcula tributos de operacao de consumo.",
    practicalUse: "Simulacao oficial de CBS, IBS e IS.",
  },
  {
    path: "/calculadora/base-calculo/cbs-ibs-mercadorias",
    method: "POST",
    category: "Base de Calculo",
    summary: "Afere base de calculo de CBS e IBS.",
    practicalUse: "Memoria tecnica de mercadorias.",
  },
  {
    path: "/calculadora/base-calculo/is-mercadorias",
    method: "POST",
    category: "Base de Calculo",
    summary: "Afere base do Imposto Seletivo.",
    practicalUse: "Memoria tecnica do IS por mercadoria.",
  },
  {
    path: "/calculadora/pedagio",
    method: "POST",
    category: "Pedagio",
    summary: "Calcula tributacao de pedagio.",
    practicalUse: "Caso especial de exploracao de via.",
  },
  {
    path: "/calculadora/xml/validate",
    method: "GET",
    category: "XML",
    summary: "Tipos de DFe para validacao.",
    practicalUse: "Checagem de formatos aceitos.",
  },
  {
    path: "/calculadora/xml/generate",
    method: "POST",
    category: "XML",
    summary: "Converte dados calculados em XML.",
    practicalUse: "Integracao documental para fluxo fiscal.",
  },
];

const SIMPLES_FAIXAS = [
  { ate: 180000, aliquota: 4.0, deducao: 0 },
  { ate: 360000, aliquota: 7.3, deducao: 5940 },
  { ate: 720000, aliquota: 9.5, deducao: 13860 },
  { ate: 1800000, aliquota: 10.7, deducao: 22500 },
  { ate: 3600000, aliquota: 14.3, deducao: 87300 },
  { ate: 4800000, aliquota: 19.0, deducao: 378000 },
];

const PRESUMIDO = { pis: 0.65, cofins: 3.0, irpj: 1.2, csll: 1.08 };
const SUL_SUDESTE = ["SP", "RJ", "MG", "ES", "PR", "SC", "RS"];
const IVA = { cbs: 0.9, ibs: 0.1, total: 1.0 };

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Marco",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const UF_CODES = {
  "11": "Rondonia",
  "12": "Acre",
  "13": "Amazonas",
  "14": "Roraima",
  "15": "Para",
  "16": "Amapa",
  "17": "Tocantins",
  "21": "Maranhao",
  "22": "Piaui",
  "23": "Ceara",
  "24": "Rio Grande do Norte",
  "25": "Paraiba",
  "26": "Pernambuco",
  "27": "Alagoas",
  "28": "Sergipe",
  "29": "Bahia",
  "31": "Minas Gerais",
  "32": "Espirito Santo",
  "33": "Rio de Janeiro",
  "35": "Sao Paulo",
  "41": "Parana",
  "42": "Santa Catarina",
  "43": "Rio Grande do Sul",
  "50": "Mato Grosso do Sul",
  "51": "Mato Grosso",
  "52": "Goias",
  "53": "Distrito Federal",
};

const MODEL_CODES = {
  "55": "NF-e",
  "65": "NFC-e",
};

const EMISSION_TYPES = {
  "1": "Emissao normal",
  "2": "Contingencia FS-IA",
  "3": "Contingencia SCAN",
  "4": "Contingencia DPEC",
  "5": "Contingencia FS-DA",
  "6": "Contingencia SVC-AN",
  "7": "Contingencia SVC-RS",
  "9": "Contingencia offline NFC-e",
};

function sane(value) {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? number : 0;
}

function sanitizeCurrency(value) {
  return Math.max(sane(value), 0);
}

function sanitizePercent(value) {
  return Math.max(sane(value), 0);
}

export function getIcmsInterestadual(ufOrigem, ufDestino) {
  if (ufOrigem === ufDestino) {
    return ESTADOS.find((estado) => estado.uf === ufOrigem)?.icmsInterno ?? 18;
  }
  if (SUL_SUDESTE.includes(ufOrigem) && !SUL_SUDESTE.includes(ufDestino)) {
    return 7;
  }
  return 12;
}

export function getAliquotaSimples(faturamento12m) {
  if (faturamento12m <= 0) return 0;
  const faixa =
    SIMPLES_FAIXAS.find((item) => faturamento12m <= item.ate) ??
    SIMPLES_FAIXAS[SIMPLES_FAIXAS.length - 1];
  return Math.max((((faturamento12m * faixa.aliquota) / 100) - faixa.deducao) / faturamento12m * 100, 0);
}

export function calcularPrecificacao(input) {
  const custoProduto = sanitizeCurrency(input.custoProduto);
  const custoFrete = sanitizeCurrency(input.custoFrete);
  const custoFixoExtra = sanitizeCurrency(input.custoFixoExtra);
  const taxaMarketplace = sanitizePercent(input.taxaMarketplace);
  const margemDesejada = sanitizePercent(input.margemDesejada);
  const faturamento12m = sanitizeCurrency(input.faturamento12m);
  const vendasMensais = Math.max(sanitizeCurrency(input.vendasMensais), 1);
  const regime = input.regime ?? "simples";
  const meiCategoria = input.meiCategoria ?? "comercio";
  const ufOrigem = input.ufOrigem ?? "SP";
  const ufDestino = input.ufDestino ?? "SP";
  const incluirIva2026 = Boolean(input.incluirIva2026);

  const custoBase = custoProduto + custoFrete + custoFixoExtra;
  const impostoFixoMensal = regime === "mei" ? MEI_DAS_2026[meiCategoria].totalMensal : 0;
  const impostoFixoPorVenda = regime === "mei" ? impostoFixoMensal / vendasMensais : 0;
  const custoOperacional = custoBase + impostoFixoPorVenda;
  let cargaTributariaPercent = 0;
  const breakdown = [];

  if (regime === "mei") {
    breakdown.push({ label: "DAS MEI rateado", percentual: 0, valor: impostoFixoPorVenda });
  } else if (regime === "simples") {
    const simples = getAliquotaSimples(faturamento12m);
    cargaTributariaPercent += simples;
    breakdown.push({ label: "Simples Nacional", percentual: simples, valor: 0 });
  } else {
    const icms = getIcmsInterestadual(ufOrigem, ufDestino);
    const componentes = [
      ["PIS", PRESUMIDO.pis],
      ["COFINS", PRESUMIDO.cofins],
      ["IRPJ", PRESUMIDO.irpj],
      ["CSLL", PRESUMIDO.csll],
      [`ICMS ${ufOrigem}-${ufDestino}`, icms],
    ];

    for (const [label, percentual] of componentes) {
      cargaTributariaPercent += percentual;
      breakdown.push({ label, percentual, valor: 0 });
    }
  }

  if (incluirIva2026 && regime !== "mei") {
    cargaTributariaPercent += IVA.total;
    breakdown.push(
      { label: "CBS 2026", percentual: IVA.cbs, valor: 0 },
      { label: "IBS 2026", percentual: IVA.ibs, valor: 0 },
    );
  }

  const totalDedutivel = cargaTributariaPercent + taxaMarketplace + margemDesejada;
  if (totalDedutivel >= 100) {
    return {
      ok: false,
      motivo: "Impostos, taxa de canal e margem ultrapassam 100% do preco.",
      custoBase,
      custoOperacional,
      cargaTributariaPercent,
    };
  }

  const divisor = 1 - totalDedutivel / 100;
  const precoVenda = custoOperacional / divisor;
  const lucroLiquido = precoVenda * (margemDesejada / 100);
  const impostoTotal = precoVenda * (cargaTributariaPercent / 100);
  const taxaMarketplaceValor = precoVenda * (taxaMarketplace / 100);

  for (const item of breakdown) {
    if (item.percentual > 0) {
      item.valor = precoVenda * (item.percentual / 100);
    }
  }

  return {
    ok: true,
    regime,
    custoBase,
    custoOperacional,
    impostoFixoMensal,
    impostoFixoPorVenda,
    cargaTributariaPercent,
    precoVenda,
    lucroLiquido,
    impostoTotal,
    taxaMarketplaceValor,
    markupMultiplicador: custoOperacional > 0 ? precoVenda / custoOperacional : 0,
    formula:
      `Preco = ${custoOperacional.toFixed(2)} / (1 - ${totalDedutivel.toFixed(2)}%) = ` +
      `${precoVenda.toFixed(2)}`,
    breakdown,
  };
}

export function explainMei(categoria = "comercio", vendasMensais = 1) {
  const data = MEI_DAS_2026[categoria] ?? MEI_DAS_2026.comercio;
  const rateioPorVenda = data.totalMensal / Math.max(sane(vendasMensais), 1);

  return {
    categoria,
    ...data,
    rateioPorVenda,
    explicacao:
      "No MEI, o DAS fixo mensal precisa ser rateado pelo volume de vendas para nao subestimar o preco de venda.",
  };
}

export function calculateCibsBase(input) {
  const additions =
    sane(input.valorFornecimento) +
    sane(input.ajusteValorOperacao) +
    sane(input.juros) +
    sane(input.multas) +
    sane(input.acrescimos) +
    sane(input.encargos) +
    sane(input.fretePorDentro) +
    sane(input.outrosTributos) +
    sane(input.impostoSeletivo) +
    sane(input.demaisImportancias);

  const deductions =
    sane(input.descontosCondicionais) +
    sane(input.icms) +
    sane(input.iss) +
    sane(input.pis) +
    sane(input.cofins);

  return {
    additions,
    deductions,
    baseCalculo: Math.max(additions - deductions, 0),
    memoria:
      "Base CIBS = fornecimento + ajustes + encargos + frete + outros tributos + IS + demais importancias - descontos condicionais - tributos legados",
  };
}

export function calculateIsBase(input) {
  const additions =
    sane(input.valorIntegralCobrado) +
    sane(input.ajusteValorOperacao) +
    sane(input.juros) +
    sane(input.multas) +
    sane(input.acrescimos) +
    sane(input.encargos) +
    sane(input.fretePorDentro) +
    sane(input.outrosTributos) +
    sane(input.demaisImportancias);

  const deductions =
    sane(input.descontosCondicionais) +
    sane(input.icms) +
    sane(input.iss) +
    sane(input.pis) +
    sane(input.cofins) +
    sane(input.bonificacao) +
    sane(input.devolucaoVendas);

  return {
    additions,
    deductions,
    baseCalculo: Math.max(additions - deductions, 0),
    memoria:
      "Base IS = valor integral + ajustes + encargos + frete + outros tributos + demais importancias - descontos - tributos legados - bonificacoes - devolucoes",
  };
}

export function isValidNFeAccessKey(chave) {
  return /^\d{44}$/.test(String(chave ?? ""));
}

export function decodeNFeAccessKey(chave) {
  if (!isValidNFeAccessKey(chave)) return null;

  const text = String(chave);
  const ufCodigo = text.slice(0, 2);
  const anoCurto = Number(text.slice(2, 4));
  const mes = Number(text.slice(4, 6));
  const modeloCodigo = text.slice(20, 22);
  const tipoEmissaoCodigo = text.slice(34, 35);

  return {
    chave: text,
    ufCodigo,
    ufNome: UF_CODES[ufCodigo] ?? "Nao identificado",
    ano: 2000 + anoCurto,
    mes,
    mesNome: MONTHS[mes - 1] ?? "Nao identificado",
    cnpj: text.slice(6, 20),
    modeloCodigo,
    modeloNome: MODEL_CODES[modeloCodigo] ?? "Modelo nao mapeado",
    serie: text.slice(22, 25),
    numeroNota: text.slice(25, 34),
    tipoEmissaoCodigo,
    tipoEmissaoNome: EMISSION_TYPES[tipoEmissaoCodigo] ?? "Tipo nao mapeado",
    codigoNumerico: text.slice(35, 43),
    digitoVerificador: text.slice(43),
  };
}

export function getReceitaCatalogByCategory() {
  return RECEITA_ENDPOINTS.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});
}

export async function checkReceitaPilotStatus() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${RECEITA_API_BASE}/calculadora/dados-abertos/versao`, {
      method: "GET",
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return {
      ok: true,
      mode: "online",
      message: "Piloto da Receita respondeu com sucesso.",
      data,
    };
  } catch (error) {
    return {
      ok: false,
      mode: "offline",
      message: `Piloto oficial indisponivel neste ambiente. Detalhe: ${error instanceof Error ? error.message : "erro desconhecido"}`,
    };
  } finally {
    clearTimeout(timeout);
  }
}
