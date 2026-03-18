export interface BaseCalculoCibsInput {
  valorFornecimento: number;
  ajusteValorOperacao: number;
  juros: number;
  multas: number;
  acrescimos: number;
  encargos: number;
  descontosCondicionais: number;
  fretePorDentro: number;
  outrosTributos: number;
  impostoSeletivo: number;
  demaisImportancias: number;
  icms: number;
  iss: number;
  pis: number;
  cofins: number;
}

export interface BaseCalculoIsInput {
  valorIntegralCobrado: number;
  ajusteValorOperacao: number;
  juros: number;
  multas: number;
  acrescimos: number;
  encargos: number;
  descontosCondicionais: number;
  fretePorDentro: number;
  outrosTributos: number;
  demaisImportancias: number;
  icms: number;
  iss: number;
  pis: number;
  cofins: number;
  bonificacao: number;
  devolucaoVendas: number;
}

function sanitizeNumber(value: number) {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCibsBase(input: BaseCalculoCibsInput) {
  const additions =
    sanitizeNumber(input.valorFornecimento) +
    sanitizeNumber(input.ajusteValorOperacao) +
    sanitizeNumber(input.juros) +
    sanitizeNumber(input.multas) +
    sanitizeNumber(input.acrescimos) +
    sanitizeNumber(input.encargos) +
    sanitizeNumber(input.fretePorDentro) +
    sanitizeNumber(input.outrosTributos) +
    sanitizeNumber(input.impostoSeletivo) +
    sanitizeNumber(input.demaisImportancias);

  const deductions =
    sanitizeNumber(input.descontosCondicionais) +
    sanitizeNumber(input.icms) +
    sanitizeNumber(input.iss) +
    sanitizeNumber(input.pis) +
    sanitizeNumber(input.cofins);

  return {
    additions,
    deductions,
    baseCalculo: Math.max(additions - deductions, 0),
    memoria:
      "Base CIBS = valor fornecimento + ajustes + encargos + frete por dentro + outros tributos + imposto seletivo + demais importancias - descontos condicionais - ICMS - ISS - PIS - COFINS",
  };
}

export function calculateIsBase(input: BaseCalculoIsInput) {
  const additions =
    sanitizeNumber(input.valorIntegralCobrado) +
    sanitizeNumber(input.ajusteValorOperacao) +
    sanitizeNumber(input.juros) +
    sanitizeNumber(input.multas) +
    sanitizeNumber(input.acrescimos) +
    sanitizeNumber(input.encargos) +
    sanitizeNumber(input.fretePorDentro) +
    sanitizeNumber(input.outrosTributos) +
    sanitizeNumber(input.demaisImportancias);

  const deductions =
    sanitizeNumber(input.descontosCondicionais) +
    sanitizeNumber(input.icms) +
    sanitizeNumber(input.iss) +
    sanitizeNumber(input.pis) +
    sanitizeNumber(input.cofins) +
    sanitizeNumber(input.bonificacao) +
    sanitizeNumber(input.devolucaoVendas);

  return {
    additions,
    deductions,
    baseCalculo: Math.max(additions - deductions, 0),
    memoria:
      "Base IS = valor integral cobrado + ajustes + encargos + frete por dentro + outros tributos + demais importancias - descontos condicionais - tributos legados - bonificacoes - devolucoes",
  };
}
