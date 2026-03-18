import { RECEITA_API_BASE } from "./receitaCatalog";

export interface ReceitaLiveStatus {
  ok: boolean;
  mode: "online" | "offline";
  message: string;
  data?: unknown;
}

async function fetchReceita(path: string) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${RECEITA_API_BASE}${path}`, {
      method: "GET",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function checkReceitaPilotVersion(): Promise<ReceitaLiveStatus> {
  try {
    const data = await fetchReceita("/calculadora/dados-abertos/versao");
    return {
      ok: true,
      mode: "online",
      message: "Piloto da Receita respondeu com sucesso.",
      data,
    };
  } catch (error) {
    const detail =
      error instanceof Error ? error.message : "Falha nao identificada ao consultar o piloto.";

    return {
      ok: false,
      mode: "offline",
      message: `Piloto oficial indisponivel a partir deste ambiente. Fallback local ativo. Detalhe: ${detail}`,
    };
  }
}
