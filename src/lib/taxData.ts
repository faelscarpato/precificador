// ===== ESTADOS BRASILEIROS =====
export const ESTADOS = [
  { uf: "AC", nome: "Acre", icmsInterno: 19 },
  { uf: "AL", nome: "Alagoas", icmsInterno: 19 },
  { uf: "AM", nome: "Amazonas", icmsInterno: 20 },
  { uf: "AP", nome: "Amapá", icmsInterno: 18 },
  { uf: "BA", nome: "Bahia", icmsInterno: 20.5 },
  { uf: "CE", nome: "Ceará", icmsInterno: 20 },
  { uf: "DF", nome: "Distrito Federal", icmsInterno: 20 },
  { uf: "ES", nome: "Espírito Santo", icmsInterno: 17 },
  { uf: "GO", nome: "Goiás", icmsInterno: 19 },
  { uf: "MA", nome: "Maranhão", icmsInterno: 22 },
  { uf: "MG", nome: "Minas Gerais", icmsInterno: 18 },
  { uf: "MS", nome: "Mato Grosso do Sul", icmsInterno: 17 },
  { uf: "MT", nome: "Mato Grosso", icmsInterno: 17 },
  { uf: "PA", nome: "Pará", icmsInterno: 19 },
  { uf: "PB", nome: "Paraíba", icmsInterno: 20 },
  { uf: "PE", nome: "Pernambuco", icmsInterno: 20.5 },
  { uf: "PI", nome: "Piauí", icmsInterno: 21 },
  { uf: "PR", nome: "Paraná", icmsInterno: 19.5 },
  { uf: "RJ", nome: "Rio de Janeiro", icmsInterno: 22 },
  { uf: "RN", nome: "Rio Grande do Norte", icmsInterno: 20 },
  { uf: "RO", nome: "Rondônia", icmsInterno: 19.5 },
  { uf: "RR", nome: "Roraima", icmsInterno: 20 },
  { uf: "RS", nome: "Rio Grande do Sul", icmsInterno: 17 },
  { uf: "SC", nome: "Santa Catarina", icmsInterno: 17 },
  { uf: "SE", nome: "Sergipe", icmsInterno: 19 },
  { uf: "SP", nome: "São Paulo", icmsInterno: 18 },
  { uf: "TO", nome: "Tocantins", icmsInterno: 20 },
] as const;

// Estados do Sul/Sudeste (para ICMS interestadual)
const SUL_SUDESTE = ["SP", "RJ", "MG", "ES", "PR", "SC", "RS"];

export function getIcmsInterestadual(ufOrigem: string, ufDestino: string): number {
  if (ufOrigem === ufDestino) {
    return ESTADOS.find(e => e.uf === ufOrigem)?.icmsInterno ?? 18;
  }
  // S/SE para N/NE/CO = 7%, outros = 12%
  if (SUL_SUDESTE.includes(ufOrigem) && !SUL_SUDESTE.includes(ufDestino)) {
    return 7;
  }
  return 12;
}

// ===== REGIMES TRIBUTÁRIOS =====
export type RegimeTributario = "mei" | "simples" | "presumido";

export type MeiCategoria = "comercio" | "servicos" | "comercio_servicos" | "caminhoneiro";

export const MEI_DAS_2026: Record<MeiCategoria, {
  label: string;
  inss: number;
  icms: number;
  iss: number;
  totalMensal: number;
}> = {
  comercio: {
    label: "MEI Comércio",
    inss: 81.05,
    icms: 1.0,
    iss: 0,
    totalMensal: 82.05,
  },
  servicos: {
    label: "MEI Serviços",
    inss: 81.05,
    icms: 0,
    iss: 5.0,
    totalMensal: 86.05,
  },
  comercio_servicos: {
    label: "MEI Comércio + Serviços",
    inss: 81.05,
    icms: 1.0,
    iss: 5.0,
    totalMensal: 87.05,
  },
  caminhoneiro: {
    label: "MEI Caminhoneiro",
    inss: 194.52,
    icms: 1.0,
    iss: 5.0,
    totalMensal: 200.52,
  },
};

// Simples Nacional - Anexo I (Comércio) faixas simplificadas
export const SIMPLES_FAIXAS = [
  { ate: 180_000, aliquota: 4.0, deducao: 0 },
  { ate: 360_000, aliquota: 7.3, deducao: 5_940 },
  { ate: 720_000, aliquota: 9.5, deducao: 13_860 },
  { ate: 1_800_000, aliquota: 10.7, deducao: 22_500 },
  { ate: 3_600_000, aliquota: 14.3, deducao: 87_300 },
  { ate: 4_800_000, aliquota: 19.0, deducao: 378_000 },
];

export function getAliquotaSimples(faturamento12m: number): number {
  if (faturamento12m <= 0) return 0;
  const faixa = SIMPLES_FAIXAS.find(f => faturamento12m <= f.ate);
  if (!faixa) return 19.0;
  // Alíquota efetiva = ((RBT12 × Aliq) - Ded) / RBT12
  const efetiva = ((faturamento12m * faixa.aliquota / 100) - faixa.deducao) / faturamento12m * 100;
  return Math.max(efetiva, 0);
}

// Lucro Presumido - taxas para comércio
export const PRESUMIDO_TAXAS = {
  pis: 0.65,
  cofins: 3.0,
  irpj: 1.2, // 15% sobre presunção de 8%
  csll: 1.08, // 9% sobre presunção de 12%
  // ICMS é separado (varia por estado)
};

export function getTotalPresumido(): number {
  return PRESUMIDO_TAXAS.pis + PRESUMIDO_TAXAS.cofins + PRESUMIDO_TAXAS.irpj + PRESUMIDO_TAXAS.csll;
}

export function getMeiDasMensal(categoria: MeiCategoria): number {
  return MEI_DAS_2026[categoria].totalMensal;
}

// ===== IVA DUAL 2026 (Transição) =====
export const IVA_2026 = {
  cbs: 0.9,  // Contribuição sobre Bens e Serviços (federal)
  ibs: 0.1,  // Imposto sobre Bens e Serviços (estadual/municipal)
  total: 1.0,
};

// ===== MARKETPLACES =====
export const MARKETPLACES = [
  { id: "mercadolivre", nome: "Mercado Livre", taxaMin: 11, taxaMax: 19 },
  { id: "shopee", nome: "Shopee", taxaMin: 14, taxaMax: 20 },
  { id: "amazon", nome: "Amazon", taxaMin: 9, taxaMax: 20 },
  { id: "magalu", nome: "Magazine Luiza", taxaMin: 12, taxaMax: 20 },
  { id: "americanas", nome: "Americanas", taxaMin: 12, taxaMax: 22 },
  { id: "proprio", nome: "Loja Própria", taxaMin: 0, taxaMax: 5 },
  { id: "custom", nome: "Personalizado", taxaMin: 0, taxaMax: 0 },
];
