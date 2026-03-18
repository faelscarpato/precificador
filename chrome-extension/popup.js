const ESTADOS = [
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

const MARKETPLACES = [
  { id: "mercadolivre", nome: "Mercado Livre", taxa: 16 },
  { id: "shopee", nome: "Shopee", taxa: 17 },
  { id: "amazon", nome: "Amazon", taxa: 14 },
  { id: "magalu", nome: "Magazine Luiza", taxa: 16 },
  { id: "proprio", nome: "Loja Propria", taxa: 2 },
  { id: "custom", nome: "Personalizado", taxa: 0 },
];

const MEI = {
  comercio: { label: "MEI Comercio", totalMensal: 82.05, inss: 81.05, icms: 1, iss: 0 },
  servicos: { label: "MEI Servicos", totalMensal: 86.05, inss: 81.05, icms: 0, iss: 5 },
  comercio_servicos: { label: "MEI Comercio + Servicos", totalMensal: 87.05, inss: 81.05, icms: 1, iss: 5 },
  caminhoneiro: { label: "MEI Caminhoneiro", totalMensal: 200.52, inss: 194.52, icms: 1, iss: 5 },
};

const SIMPLES_FAIXAS = [
  { ate: 180000, aliquota: 4.0, deducao: 0 },
  { ate: 360000, aliquota: 7.3, deducao: 5940 },
  { ate: 720000, aliquota: 9.5, deducao: 13860 },
  { ate: 1800000, aliquota: 10.7, deducao: 22500 },
  { ate: 3600000, aliquota: 14.3, deducao: 87300 },
  { ate: 4800000, aliquota: 19.0, deducao: 378000 },
];

const PRESUMIDO = { pis: 0.65, cofins: 3.0, irpj: 1.2, csll: 1.08 };
const IVA = { cbs: 0.9, ibs: 0.1, total: 1.0 };
const SUL_SUDESTE = ["SP", "RJ", "MG", "ES", "PR", "SC", "RS"];
const MONTHS = ["Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const UF_CODES = {
  "11": "Rondonia", "12": "Acre", "13": "Amazonas", "14": "Roraima", "15": "Para", "16": "Amapa", "17": "Tocantins",
  "21": "Maranhao", "22": "Piaui", "23": "Ceara", "24": "Rio Grande do Norte", "25": "Paraiba", "26": "Pernambuco",
  "27": "Alagoas", "28": "Sergipe", "29": "Bahia", "31": "Minas Gerais", "32": "Espirito Santo", "33": "Rio de Janeiro",
  "35": "Sao Paulo", "41": "Parana", "42": "Santa Catarina", "43": "Rio Grande do Sul", "50": "Mato Grosso do Sul",
  "51": "Mato Grosso", "52": "Goias", "53": "Distrito Federal",
};
const MODEL_CODES = { "55": "NF-e", "65": "NFC-e" };
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

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

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

function getIcmsInterestadual(origem, destino) {
  if (origem === destino) {
    return ESTADOS.find((estado) => estado.uf === origem)?.icmsInterno ?? 18;
  }
  if (SUL_SUDESTE.includes(origem) && !SUL_SUDESTE.includes(destino)) {
    return 7;
  }
  return 12;
}

function getAliquotaSimples(faturamento12m) {
  if (faturamento12m <= 0) return 0;
  const faixa = SIMPLES_FAIXAS.find((item) => faturamento12m <= item.ate) ?? SIMPLES_FAIXAS[SIMPLES_FAIXAS.length - 1];
  return Math.max((((faturamento12m * faixa.aliquota) / 100) - faixa.deducao) / faturamento12m * 100, 0);
}

function calcularPrecoVenda(input) {
  const custoProduto = sanitizeCurrency(input.custoProduto);
  const custoFrete = sanitizeCurrency(input.custoFrete);
  const custoFixoExtra = sanitizeCurrency(input.custoFixoExtra);
  const taxaMarketplace = sanitizePercent(input.taxaMarketplace);
  const margemDesejada = sanitizePercent(input.margemDesejada);
  const faturamento12m = sanitizeCurrency(input.faturamento12m);
  const vendasMensais = Math.max(sanitizeCurrency(input.vendasMensais), 1);
  const custoBase = custoProduto + custoFrete + custoFixoExtra;
  const impostoFixoMensal = input.regime === "mei" ? MEI[input.meiCategoria].totalMensal : 0;
  const impostoFixoPorVenda = input.regime === "mei" ? impostoFixoMensal / vendasMensais : 0;
  const custoOperacional = custoBase + impostoFixoPorVenda;
  const breakdown = [];
  let cargaTributaria = 0;

  if (input.regime === "mei") {
    breakdown.push({ label: "DAS MEI rateado", valor: impostoFixoPorVenda, percentual: 0 });
  } else if (input.regime === "simples") {
    const simples = getAliquotaSimples(faturamento12m);
    cargaTributaria += simples;
    breakdown.push({ label: "Simples Nacional", valor: 0, percentual: simples });
  } else {
    const icms = getIcmsInterestadual(input.ufOrigem, input.ufDestino);
    const componentes = [
      ["PIS", PRESUMIDO.pis],
      ["COFINS", PRESUMIDO.cofins],
      ["IRPJ", PRESUMIDO.irpj],
      ["CSLL", PRESUMIDO.csll],
      [`ICMS ${input.ufOrigem}-${input.ufDestino}`, icms],
    ];

    componentes.forEach(([label, percentual]) => {
      cargaTributaria += percentual;
      breakdown.push({ label, valor: 0, percentual });
    });
  }

  if (input.incluirIva2026 && input.regime !== "mei") {
    cargaTributaria += IVA.total;
    breakdown.push({ label: "CBS 2026", valor: 0, percentual: IVA.cbs });
    breakdown.push({ label: "IBS 2026", valor: 0, percentual: IVA.ibs });
  }

  const totalDedutivel = cargaTributaria + taxaMarketplace + margemDesejada;
  if (totalDedutivel >= 100) {
    return {
      erro: "Impostos + taxa + margem ultrapassam 100%.",
      precoVenda: 0,
      lucroLiquido: 0,
      impostoTotal: 0,
      impostoFixoPorVenda: 0,
      formula: "Operacao inviavel",
      breakdown: [],
    };
  }

  const divisor = 1 - totalDedutivel / 100;
  const precoVenda = custoOperacional / divisor;
  const lucroLiquido = precoVenda * (margemDesejada / 100);
  const impostoTotal = precoVenda * (cargaTributaria / 100);

  breakdown.forEach((item) => {
    if (item.percentual > 0) item.valor = precoVenda * (item.percentual / 100);
  });

  return {
    erro: "",
    precoVenda,
    lucroLiquido,
    impostoTotal,
    impostoFixoPorVenda,
    formula: `Preco = ${brl.format(custoOperacional)} ÷ (1 - ${totalDedutivel.toFixed(2)}%) = ${brl.format(precoVenda)}`,
    breakdown,
  };
}

function calculateCibsBase(input) {
  const additions = sane(input.valorFornecimento);
  const deductions = sane(input.descontosCondicionais) + sane(input.icms) + sane(input.pisCofins);
  return Math.max(additions - deductions, 0);
}

function calculateIsBase(input) {
  const additions = sane(input.valorIntegralCobrado);
  const deductions = sane(input.bonificacaoDevolucao);
  return Math.max(additions - deductions, 0);
}

function decodeNFeAccessKey(chave) {
  if (!/^\d{44}$/.test(chave)) return null;

  const ufCodigo = chave.slice(0, 2);
  const anoCurto = Number(chave.slice(2, 4));
  const mes = Number(chave.slice(4, 6));
  const modeloCodigo = chave.slice(20, 22);
  const tipoEmissaoCodigo = chave.slice(34, 35);

  return {
    UF: UF_CODES[ufCodigo] ?? "Nao identificado",
    ano: 2000 + anoCurto,
    mes: MONTHS[mes - 1] ?? "Nao identificado",
    CNPJ: chave.slice(6, 20),
    modelo: MODEL_CODES[modeloCodigo] ?? "Nao mapeado",
    serie: chave.slice(22, 25),
    numero: chave.slice(25, 34),
    emissao: EMISSION_TYPES[tipoEmissaoCodigo] ?? "Nao mapeado",
  };
}

const els = {
  regime: document.querySelector("#regime"),
  marketplace: document.querySelector("#marketplace"),
  custoProduto: document.querySelector("#custoProduto"),
  custoFrete: document.querySelector("#custoFrete"),
  custoFixoExtra: document.querySelector("#custoFixoExtra"),
  margemDesejada: document.querySelector("#margemDesejada"),
  taxaMarketplace: document.querySelector("#taxaMarketplace"),
  faturamento12m: document.querySelector("#faturamento12m"),
  meiCategoria: document.querySelector("#meiCategoria"),
  vendasMensais: document.querySelector("#vendasMensais"),
  ufOrigem: document.querySelector("#ufOrigem"),
  ufDestino: document.querySelector("#ufDestino"),
  incluirIva: document.querySelector("#incluirIva"),
  precoVenda: document.querySelector("#precoVenda"),
  lucroLiquido: document.querySelector("#lucroLiquido"),
  impostoTotal: document.querySelector("#impostoTotal"),
  dasPorVenda: document.querySelector("#dasPorVenda"),
  formula: document.querySelector("#formula"),
  breakdown: document.querySelector("#breakdown"),
  meiList: document.querySelector("#meiList"),
  meiExplain: document.querySelector("#meiExplain"),
  cibsValor: document.querySelector("#cibsValor"),
  cibsDescontos: document.querySelector("#cibsDescontos"),
  cibsIcms: document.querySelector("#cibsIcms"),
  cibsPisCofins: document.querySelector("#cibsPisCofins"),
  isValor: document.querySelector("#isValor"),
  isBonificacao: document.querySelector("#isBonificacao"),
  cibsBase: document.querySelector("#cibsBase"),
  isBase: document.querySelector("#isBase"),
  baseExplain: document.querySelector("#baseExplain"),
  nfeKey: document.querySelector("#nfeKey"),
  nfeResult: document.querySelector("#nfeResult"),
};

function setOptions(select, items, labelFn) {
  select.innerHTML = items.map(labelFn).join("");
}

function updateMarketplaceDefault() {
  const market = MARKETPLACES.find((item) => item.id === els.marketplace.value);
  if (market && market.id !== "custom") {
    els.taxaMarketplace.value = market.taxa;
  }
  update();
}

function updatePricing() {
  const result = calcularPrecoVenda({
    regime: els.regime.value,
    custoProduto: els.custoProduto.value,
    custoFrete: els.custoFrete.value,
    custoFixoExtra: els.custoFixoExtra.value,
    margemDesejada: els.margemDesejada.value,
    taxaMarketplace: els.taxaMarketplace.value,
    faturamento12m: els.faturamento12m.value,
    meiCategoria: els.meiCategoria.value,
    vendasMensais: els.vendasMensais.value,
    ufOrigem: els.ufOrigem.value,
    ufDestino: els.ufDestino.value,
    incluirIva2026: els.incluirIva.checked,
  });

  els.precoVenda.textContent = result.erro ? "--" : brl.format(result.precoVenda);
  els.lucroLiquido.textContent = result.erro ? "--" : brl.format(result.lucroLiquido);
  els.impostoTotal.textContent = result.erro ? "--" : brl.format(result.impostoTotal);
  els.dasPorVenda.textContent = result.erro ? "--" : brl.format(result.impostoFixoPorVenda);
  els.formula.textContent = result.erro || result.formula;
  els.breakdown.innerHTML = result.breakdown.length
    ? result.breakdown.map((item) => `<div class="row"><span>${item.label}</span><strong>${brl.format(item.valor)}</strong></div>`).join("")
    : `<div class="muted">${result.erro || "Sem detalhamento."}</div>`;

  const mei = MEI[els.meiCategoria.value];
  const rateio = mei.totalMensal / Math.max(sane(els.vendasMensais.value), 1);
  els.meiExplain.innerHTML = `
    <div class="row"><span>Categoria</span><strong>${mei.label}</strong></div>
    <div class="row"><span>DAS mensal</span><strong>${brl.format(mei.totalMensal)}</strong></div>
    <div class="row"><span>Rateio por venda</span><strong>${brl.format(rateio)}</strong></div>
    <div class="tiny muted">O imposto fixo precisa entrar no custo operacional para nao mascarar margem.</div>
  `;
}

function updateBases() {
  const cibs = calculateCibsBase({
    valorFornecimento: els.cibsValor.value,
    descontosCondicionais: els.cibsDescontos.value,
    icms: els.cibsIcms.value,
    pisCofins: els.cibsPisCofins.value,
  });
  const isBase = calculateIsBase({
    valorIntegralCobrado: els.isValor.value,
    bonificacaoDevolucao: els.isBonificacao.value,
  });

  els.cibsBase.textContent = brl.format(cibs);
  els.isBase.textContent = brl.format(isBase);
  els.baseExplain.innerHTML = `
    <div class="row"><span>Memoria CBS/IBS</span><strong>Fornecimento - descontos - tributos legados</strong></div>
    <div class="row"><span>Memoria IS</span><strong>Valor integral - bonificacoes/devolucoes</strong></div>
  `;
}

function updateNFe() {
  const key = els.nfeKey.value.replace(/\D/g, "").slice(0, 44);
  els.nfeKey.value = key;
  const decoded = decodeNFeAccessKey(key);
  els.nfeResult.innerHTML = decoded
    ? Object.entries(decoded).map(([label, value]) => `<div class="row"><span>${label}</span><strong>${value}</strong></div>`).join("")
    : `<div class="muted">${key.length ? "A chave precisa ter 44 digitos." : "Cole uma chave para leitura rapida."}</div>`;
}

function update() {
  updatePricing();
  updateBases();
  updateNFe();
}

document.querySelectorAll(".tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab === button));
    document.querySelectorAll(".panel").forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === button.dataset.tab));
  });
});

setOptions(els.marketplace, MARKETPLACES, (item) => `<option value="${item.id}">${item.nome}</option>`);
setOptions(els.meiCategoria, Object.entries(MEI), ([key, item]) => `<option value="${key}">${item.label}</option>`);
setOptions(els.ufOrigem, ESTADOS, (item) => `<option value="${item.uf}">${item.uf}</option>`);
setOptions(els.ufDestino, ESTADOS, (item) => `<option value="${item.uf}">${item.uf}</option>`);

els.ufOrigem.value = "SP";
els.ufDestino.value = "SP";
els.marketplace.value = "mercadolivre";
updateMarketplaceDefault();

Object.values(els).forEach((element) => {
  if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement) {
    element.addEventListener("input", update);
    element.addEventListener("change", update);
  }
});

els.marketplace.addEventListener("change", updateMarketplaceDefault);

els.meiList.innerHTML = Object.values(MEI).map((item) => `
  <div class="row">
    <span>${item.label}</span>
    <strong>${brl.format(item.totalMensal)}/mes</strong>
  </div>
`).join("");

update();
