import {
  getAliquotaSimples,
  getIcmsInterestadual,
  getMeiDasMensal,
  IVA_2026,
  PRESUMIDO_TAXAS,
  type MeiCategoria,
  type RegimeTributario,
} from "./taxData";

export interface CalculatorInput {
  custoProduto: number;
  custoFrete: number;
  custoFixoExtra: number;
  taxaMarketplace: number; // %
  margemDesejada: number; // % sobre venda
  regime: RegimeTributario;
  faturamento12m: number; // para Simples
  meiCategoria: MeiCategoria;
  vendasMensais: number;
  ufOrigem: string;
  ufDestino: string;
  incluirIva2026: boolean;
}

export interface TaxBreakdown {
  label: string;
  percentual: number;
  valor: number;
  cor: "green" | "amber" | "red" | "blue" | "purple";
}

export interface CalculatorResult {
  precoVenda: number;
  custoTotal: number;
  custoOperacional: number;
  lucroLiquido: number;
  margemReal: number;
  impostoTotal: number;
  impostoFixoMensal: number;
  impostoFixoPorVenda: number;
  taxaMarketplaceValor: number;
  breakdown: TaxBreakdown[];
  markupMultiplicador: number;
  cargaTributariaPercent: number;
  formulaExplicacao: string;
}

function sanitizeCurrency(value: number) {
  return Number.isFinite(value) ? Math.max(value, 0) : 0;
}

function sanitizePercent(value: number) {
  return Number.isFinite(value) ? Math.max(value, 0) : 0;
}

export function calcularPrecoVenda(input: CalculatorInput): CalculatorResult {
  const custoProduto = sanitizeCurrency(input.custoProduto);
  const custoFrete = sanitizeCurrency(input.custoFrete);
  const custoFixoExtra = sanitizeCurrency(input.custoFixoExtra);
  const taxaMarketplace = sanitizePercent(input.taxaMarketplace);
  const margemDesejada = sanitizePercent(input.margemDesejada);
  const faturamento12m = sanitizeCurrency(input.faturamento12m);
  const vendasMensais = sanitizeCurrency(input.vendasMensais);

  const custoBase = custoProduto + custoFrete + custoFixoExtra;
  const impostoFixoMensal = input.regime === "mei" ? getMeiDasMensal(input.meiCategoria) : 0;
  const impostoFixoPorVenda =
    input.regime === "mei"
      ? impostoFixoMensal / Math.max(vendasMensais, 1)
      : 0;
  const custoOperacional = custoBase + impostoFixoPorVenda;

  // 1. Calcular carga tributária total
  let cargaTributaria = 0;
  const breakdown: TaxBreakdown[] = [];

  if (input.regime === "mei") {
    breakdown.push({
      label: "DAS MEI rateado",
      percentual: 0,
      valor: impostoFixoPorVenda,
      cor: "green",
    });
  } else if (input.regime === "simples") {
    const aliqSimples = getAliquotaSimples(faturamento12m);
    cargaTributaria += aliqSimples;
    breakdown.push({
      label: "Simples Nacional (DAS)",
      percentual: aliqSimples,
      valor: 0, // calculado depois
      cor: "blue",
    });
  } else {
    // Lucro Presumido
    const icms = getIcmsInterestadual(input.ufOrigem, input.ufDestino);
    cargaTributaria += PRESUMIDO_TAXAS.pis;
    cargaTributaria += PRESUMIDO_TAXAS.cofins;
    cargaTributaria += PRESUMIDO_TAXAS.irpj;
    cargaTributaria += PRESUMIDO_TAXAS.csll;
    cargaTributaria += icms;

    breakdown.push(
      { label: "PIS", percentual: PRESUMIDO_TAXAS.pis, valor: 0, cor: "blue" },
      { label: "COFINS", percentual: PRESUMIDO_TAXAS.cofins, valor: 0, cor: "blue" },
      { label: "IRPJ", percentual: PRESUMIDO_TAXAS.irpj, valor: 0, cor: "purple" },
      { label: "CSLL", percentual: PRESUMIDO_TAXAS.csll, valor: 0, cor: "purple" },
      { label: `ICMS (${input.ufOrigem}→${input.ufDestino})`, percentual: icms, valor: 0, cor: "red" },
    );
  }

  // 2. IVA Dual 2026 (adicional)
  if (input.incluirIva2026 && input.regime !== "mei") {
    cargaTributaria += IVA_2026.total;
    breakdown.push(
      { label: "CBS (Federal)", percentual: IVA_2026.cbs, valor: 0, cor: "amber" },
      { label: "IBS (Est./Mun.)", percentual: IVA_2026.ibs, valor: 0, cor: "amber" },
    );
  }

  // 3. Taxa marketplace
  const taxaMkt = taxaMarketplace;

  // 4. MARKUP DIVISOR (cálculo por dentro)
  // Preço = Custo / (1 - (Impostos% + Marketplace% + Margem%) / 100)
  const totalDedutivel = cargaTributaria + taxaMkt + margemDesejada;

  if (totalDedutivel >= 100) {
    // Impossível: as deduções superam 100%
    return {
      precoVenda: 0,
      custoTotal: custoBase,
      custoOperacional,
      lucroLiquido: 0,
      margemReal: 0,
      impostoTotal: 0,
      impostoFixoMensal,
      impostoFixoPorVenda,
      taxaMarketplaceValor: 0,
      breakdown: [],
      markupMultiplicador: 0,
      cargaTributariaPercent: cargaTributaria,
      formulaExplicacao: "ERRO: A soma de impostos + taxa + margem ultrapassa 100%. Operação inviável.",
    };
  }

  const divisor = 1 - totalDedutivel / 100;
  const precoVenda = custoOperacional / divisor;
  const markupMultiplicador = custoOperacional > 0 ? precoVenda / custoOperacional : 0;

  // Calcular valores absolutos
  const taxaMarketplaceValor = precoVenda * (taxaMkt / 100);
  const impostoTotal = precoVenda * (cargaTributaria / 100);
  const lucroLiquido = precoVenda * (margemDesejada / 100);
  const margemReal = precoVenda > 0 ? (lucroLiquido / precoVenda) * 100 : 0;

  // Atualizar valores no breakdown
  breakdown.forEach(b => {
    if (b.percentual > 0) {
      b.valor = precoVenda * (b.percentual / 100);
    }
  });

  // Fórmula explicativa
  const baseExplicacao = input.regime === "mei"
    ? `Custo operacional = custo base R$ ${custoBase.toFixed(2)} + rateio DAS R$ ${impostoFixoPorVenda.toFixed(2)}`
    : `Custo operacional = R$ ${custoOperacional.toFixed(2)}`;
  const formulaExplicacao = `${baseExplicacao}. Preço = R$ ${custoOperacional.toFixed(2)} ÷ (1 − ${totalDedutivel.toFixed(1)}%) = R$ ${custoOperacional.toFixed(2)} ÷ ${divisor.toFixed(4)} = R$ ${precoVenda.toFixed(2)}`;

  return {
    precoVenda,
    custoTotal: custoBase,
    custoOperacional,
    lucroLiquido,
    margemReal,
    impostoTotal,
    impostoFixoMensal,
    impostoFixoPorVenda,
    taxaMarketplaceValor,
    breakdown,
    markupMultiplicador,
    cargaTributariaPercent: cargaTributaria,
    formulaExplicacao,
  };
}
