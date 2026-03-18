export interface ReceitaEndpointCatalogItem {
  path: string;
  method: "GET" | "POST";
  category: string;
  summary: string;
  practicalUse: string;
}

export const RECEITA_API_BASE =
  "https://piloto-cbs.tributos.gov.br:48118/servico/calculadora-consumo/api";

export const RECEITA_ENDPOINTS: ReceitaEndpointCatalogItem[] = [
  {
    path: "/calculadora/dados-abertos/versao",
    method: "GET",
    category: "Dados Abertos",
    summary: "Versao do aplicativo e do banco de dados do piloto.",
    practicalUse: "Monitorar versao da base governamental e sinalizar mudancas normativas.",
  },
  {
    path: "/calculadora/dados-abertos/ufs",
    method: "GET",
    category: "Dados Abertos",
    summary: "Lista de UFs cadastradas.",
    practicalUse: "Base oficial para seletores de UF e validacao de origem/destino.",
  },
  {
    path: "/calculadora/dados-abertos/ufs/municipios",
    method: "GET",
    category: "Dados Abertos",
    summary: "Municipios por UF.",
    practicalUse: "Cadastro de municipio IBGE para operacoes, emissao fiscal e analytics.",
  },
  {
    path: "/calculadora/dados-abertos/situacoes-tributarias/cbs-ibs",
    method: "GET",
    category: "Dados Abertos",
    summary: "CSTs vigentes para CBS/IBS por data.",
    practicalUse: "Atualizacao de cadastro fiscal, validacao de CST e regras de credito.",
  },
  {
    path: "/calculadora/dados-abertos/situacoes-tributarias/imposto-seletivo",
    method: "GET",
    category: "Dados Abertos",
    summary: "CSTs vigentes para Imposto Seletivo.",
    practicalUse: "Classificacao de mercadorias e servicos sujeitos ao IS.",
  },
  {
    path: "/calculadora/dados-abertos/classificacoes-tributarias/cbs-ibs",
    method: "GET",
    category: "Dados Abertos",
    summary: "Classificacoes tributarias CBS/IBS.",
    practicalUse: "Mapear tratamento tributario, reducoes, credito e compatibilidade documental.",
  },
  {
    path: "/calculadora/dados-abertos/classificacoes-tributarias/cbs-ibs/{siglaDfe}/{cClassTrib}",
    method: "GET",
    category: "Dados Abertos",
    summary: "Valida classificacao por DFe e codigo.",
    practicalUse: "Pre-validacao de cadastro fiscal antes de emitir XML.",
  },
  {
    path: "/calculadora/dados-abertos/classificacoes-tributarias/imposto-seletivo",
    method: "GET",
    category: "Dados Abertos",
    summary: "Classificacoes do Imposto Seletivo.",
    practicalUse: "Analise de incidencia e preparo de memoria de calculo do IS.",
  },
  {
    path: "/calculadora/dados-abertos/fundamentacoes-legais",
    method: "GET",
    category: "Dados Abertos",
    summary: "Fundamentacoes legais vinculadas a classificacoes.",
    practicalUse: "Explicacao juridica do tratamento tributario para contador e auditoria.",
  },
  {
    path: "/calculadora/dados-abertos/ncm",
    method: "GET",
    category: "Dados Abertos",
    summary: "Consulta de NCM e incidencia de IS.",
    practicalUse: "Base para cadastro de produto, seletivo e leitura fiscal por item.",
  },
  {
    path: "/calculadora/dados-abertos/nbs",
    method: "GET",
    category: "Dados Abertos",
    summary: "Consulta de NBS e incidencia de IS.",
    practicalUse: "Base para servicos, exploracao de via e classificacao futura.",
  },
  {
    path: "/calculadora/dados-abertos/aliquota-uniao",
    method: "GET",
    category: "Dados Abertos",
    summary: "Aliquota federal / uniao.",
    practicalUse: "Monitorar parte federal da tributacao e comparar com simulacoes internas.",
  },
  {
    path: "/calculadora/dados-abertos/aliquota-uf",
    method: "GET",
    category: "Dados Abertos",
    summary: "Aliquota estadual por UF.",
    practicalUse: "Atualizar camadas de tributacao por estado e analytics gerencial.",
  },
  {
    path: "/calculadora/dados-abertos/aliquota-municipio",
    method: "GET",
    category: "Dados Abertos",
    summary: "Aliquota municipal.",
    practicalUse: "Calcular componente municipal e consultar municipio com precisao.",
  },
  {
    path: "/calculadora/regime-geral",
    method: "POST",
    category: "Calculadora",
    summary: "Calcula tributos de operacao de consumo.",
    practicalUse: "Simulador oficial de CBS/IBS/IS para memoria de calculo.",
  },
  {
    path: "/calculadora/base-calculo/cbs-ibs-mercadorias",
    method: "POST",
    category: "Base de Calculo",
    summary: "Afere base de calculo de CIBS.",
    practicalUse: "Memoria tecnica da base tributavel de mercadorias.",
  },
  {
    path: "/calculadora/base-calculo/is-mercadorias",
    method: "POST",
    category: "Base de Calculo",
    summary: "Afere base de calculo do Imposto Seletivo.",
    practicalUse: "Memoria tecnica do IS por mercadoria.",
  },
  {
    path: "/calculadora/pedagio",
    method: "POST",
    category: "Pedagio",
    summary: "Calcula CBS/IBS para pedagio.",
    practicalUse: "Caso especial de exploracao de via com apuracao por trecho.",
  },
  {
    path: "/calculadora/xml/validate",
    method: "GET",
    category: "XML",
    summary: "Tipos de DFe para validacao.",
    practicalUse: "Listar formatos suportados para conferencias documentais.",
  },
  {
    path: "/calculadora/xml/generate",
    method: "POST",
    category: "XML",
    summary: "Converte dados calculados em XML.",
    practicalUse: "Gerar payload XML de CBS/IBS/IS para fluxo fiscal.",
  },
];

export function getReceitaCatalogByCategory() {
  return RECEITA_ENDPOINTS.reduce<Record<string, ReceitaEndpointCatalogItem[]>>((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});
}
