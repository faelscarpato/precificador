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

const UF_CODES: Record<string, string> = {
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

const MODEL_CODES: Record<string, string> = {
  "55": "NF-e",
  "65": "NFC-e",
};

const EMISSION_TYPES: Record<string, string> = {
  "1": "Emissao normal",
  "2": "Contingencia FS-IA",
  "3": "Contingencia SCAN",
  "4": "Contingencia DPEC",
  "5": "Contingencia FS-DA",
  "6": "Contingencia SVC-AN",
  "7": "Contingencia SVC-RS",
  "9": "Contingencia offline NFC-e",
};

export interface NFeDecodedKey {
  chave: string;
  ufCodigo: string;
  ufNome: string;
  ano: number;
  mes: number;
  mesNome: string;
  cnpj: string;
  modeloCodigo: string;
  modeloNome: string;
  serie: string;
  numeroNota: string;
  tipoEmissaoCodigo: string;
  tipoEmissaoNome: string;
  codigoNumerico: string;
  digitoVerificador: string;
}

export function isValidNFeAccessKey(chave: string) {
  return /^\d{44}$/.test(chave);
}

export function decodeNFeAccessKey(chave: string): NFeDecodedKey | null {
  if (!isValidNFeAccessKey(chave)) {
    return null;
  }

  const ufCodigo = chave.slice(0, 2);
  const anoCurto = Number(chave.slice(2, 4));
  const mes = Number(chave.slice(4, 6));
  const modeloCodigo = chave.slice(20, 22);
  const tipoEmissaoCodigo = chave.slice(34, 35);

  return {
    chave,
    ufCodigo,
    ufNome: UF_CODES[ufCodigo] ?? "Nao identificado",
    ano: 2000 + anoCurto,
    mes,
    mesNome: MONTHS[mes - 1] ?? "Nao identificado",
    cnpj: chave.slice(6, 20),
    modeloCodigo,
    modeloNome: MODEL_CODES[modeloCodigo] ?? "Modelo nao mapeado",
    serie: chave.slice(22, 25),
    numeroNota: chave.slice(25, 34),
    tipoEmissaoCodigo,
    tipoEmissaoNome: EMISSION_TYPES[tipoEmissaoCodigo] ?? "Tipo nao mapeado",
    codigoNumerico: chave.slice(35, 43),
    digitoVerificador: chave.slice(43),
  };
}
