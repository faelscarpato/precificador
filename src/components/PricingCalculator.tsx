import { useEffect, useState } from "react";
import { BreakdownBar } from "./BreakdownBar";
import { MathExplainer } from "@/components/MathExplainer";
import { calculateCibsBase, calculateIsBase } from "@/lib/baseCalculo";
import { calcularPrecoVenda, type CalculatorInput } from "@/lib/calculator";
import { decodeNFeAccessKey, isValidNFeAccessKey } from "@/lib/nfe";
import {
  ESTADOS,
  MARKETPLACES,
  MEI_DAS_2026,
  type MeiCategoria,
  type RegimeTributario,
} from "@/lib/taxData";

type TabId =
  | "precificacao"
  | "mei"
  | "base"
  | "nfe"
  | "estados"
  | "regimes"
  | "historico";

interface SavedScenario {
  id: string;
  createdAt: string;
  input: CalculatorInput;
  precoVenda: number;
  lucroLiquido: number;
  cargaTributariaPercent: number;
}

const HISTORY_KEY = "profit-navigator-history-v2";
const VERIFICADOR_CNPJ_URL = "https://precificador-8ks.pages.dev/";
const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const tabs: Array<{ id: TabId; label: string }> = [
  { id: "precificacao", label: "Precificacao" },
  { id: "mei", label: "Base MEI" },
  { id: "base", label: "Base CBS/IS" },
  { id: "nfe", label: "Chave NF-e" },
  { id: "estados", label: "Estados" },
  { id: "regimes", label: "Regimes" },
  { id: "historico", label: "Historico" },
];

const regimeInfo = [
  {
    key: "mei",
    title: "MEI",
    text: "Tributo fixo mensal via DAS. O sistema mostra o impacto por venda sem esconder o custo real.",
  },
  {
    key: "simples",
    title: "Simples Nacional",
    text: "Usa a aliquota efetiva pelo faturamento de 12 meses para formar preco com criterio.",
  },
  {
    key: "presumido",
    title: "Lucro Presumido",
    text: "Separa tributos federais e ICMS por UF para leitura mais profissional do resultado.",
  },
];

const defaultInput: CalculatorInput = {
  custoProduto: 55,
  custoFrete: 8,
  custoFixoExtra: 5,
  taxaMarketplace: 16,
  margemDesejada: 20,
  regime: "mei",
  faturamento12m: 360000,
  meiCategoria: "comercio",
  vendasMensais: 120,
  ufOrigem: "SP",
  ufDestino: "SP",
  incluirIva2026: true,
};

const defaultCibs = {
  valorFornecimento: 1000,
  ajusteValorOperacao: 0,
  juros: 0,
  multas: 0,
  acrescimos: 0,
  encargos: 0,
  descontosCondicionais: 0,
  fretePorDentro: 0,
  outrosTributos: 0,
  impostoSeletivo: 0,
  demaisImportancias: 0,
  icms: 0,
  iss: 0,
  pis: 0,
  cofins: 0,
};

const defaultIs = {
  valorIntegralCobrado: 1000,
  ajusteValorOperacao: 0,
  juros: 0,
  multas: 0,
  acrescimos: 0,
  encargos: 0,
  descontosCondicionais: 0,
  fretePorDentro: 0,
  outrosTributos: 0,
  demaisImportancias: 0,
  icms: 0,
  iss: 0,
  pis: 0,
  cofins: 0,
  bonificacao: 0,
  devolucaoVendas: 0,
};

function parseHistory() {
  if (typeof window === "undefined") return [] as SavedScenario[];

  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString("pt-BR");
}

function labelize(value: string) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (char) => char.toUpperCase());
}

function FieldNumber({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block text-sm text-muted-foreground">
      {label}
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => onChange(Number(event.target.value) || 0)}
        className="mt-2 w-full rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-foreground"
      />
    </label>
  );
}

function FieldSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="block text-sm text-muted-foreground">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-foreground"
      >
        {options.map((option) => (
          <option key={`${option.value}-${option.label}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function MetricCard({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        strong ? "border-primary/30 bg-primary/10" : "border-border/50 bg-muted/20"
      }`}
    >
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-2 text-lg font-semibold ${strong ? "text-primary" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}

function ResultCallout({ title, value, lines }: { title: string; value: string; lines: string[] }) {
  return (
    <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
      <p className="text-xs uppercase tracking-wider text-primary">{title}</p>
      <p className="mt-2 text-2xl font-display font-bold text-foreground">{value}</p>
      <div className="mt-3 space-y-1 text-sm text-muted-foreground">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  );
}

export function PricingCalculator() {
  const [activeTab, setActiveTab] = useState<TabId>("precificacao");
  const [input, setInput] = useState<CalculatorInput>(defaultInput);
  const [selectedMarketplace, setSelectedMarketplace] = useState("mercadolivre");
  const [cibsInput, setCibsInput] = useState(defaultCibs);
  const [isInput, setIsInput] = useState(defaultIs);
  const [nfeKey, setNfeKey] = useState("");
  const [history, setHistory] = useState<SavedScenario[]>([]);

  const result = calcularPrecoVenda(input);
  const meiInfo = MEI_DAS_2026[input.meiCategoria];
  const decodedNFe = decodeNFeAccessKey(nfeKey);
  const cibsBase = calculateCibsBase(cibsInput);
  const isBase = calculateIsBase(isInput);

  useEffect(() => {
    setHistory(parseHistory());
  }, []);

  const saveScenario = () => {
    const nextHistory: SavedScenario[] = [
      {
        id: `${Date.now()}`,
        createdAt: new Date().toISOString(),
        input,
        precoVenda: result.precoVenda,
        lucroLiquido: result.lucroLiquido,
        cargaTributariaPercent: result.cargaTributariaPercent,
      },
      ...history,
    ].slice(0, 12);

    setHistory(nextHistory);
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
  };

  const exportScenario = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      input,
      result,
      meiInfo,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "profit-navigator-cenario.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const loadScenario = (scenario: SavedScenario) => {
    setInput(scenario.input);
    setActiveTab("precificacao");
  };

  const clearHistory = () => {
    setHistory([]);
    window.localStorage.removeItem(HISTORY_KEY);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border/50 bg-card/60 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Atalho operacional</p>
            <p className="mt-1 text-sm text-foreground">
              Use o verificador de CNPJ em paralelo sem sair do fluxo principal de precificacao.
            </p>
          </div>
          <a
            href={VERIFICADOR_CNPJ_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/15"
          >
            Abrir Verificador CNPJ
          </a>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-3 sm:p-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 rounded-xl border px-4 py-2 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "border-primary/40 bg-primary/15 text-primary"
                  : "border-border/50 bg-muted/20 text-muted-foreground hover:bg-muted/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "precificacao" && (
        <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-4 sm:p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Entrada operacional</p>
                  <h3 className="text-xl font-display font-bold text-foreground">Precificacao assistida</h3>
                </div>
                <div className="rounded-xl border border-accent/20 bg-accent/10 px-3 py-2 text-right text-xs text-accent">
                  <div>Metodo</div>
                  <div className="font-semibold">Markup divisor</div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <FieldSelect
                  label="Regime tributario"
                  value={input.regime}
                  onChange={(value) => setInput({ ...input, regime: value as RegimeTributario })}
                  options={[
                    { value: "mei", label: "MEI" },
                    { value: "simples", label: "Simples Nacional" },
                    { value: "presumido", label: "Lucro Presumido" },
                  ]}
                />
                <FieldSelect
                  label="Canal de venda"
                  value={selectedMarketplace}
                  onChange={(value) => {
                    setSelectedMarketplace(value);
                    const selected = MARKETPLACES.find((market) => market.id === value);
                    if (selected && selected.id !== "custom") {
                      setInput({ ...input, taxaMarketplace: selected.taxaMin });
                    }
                  }}
                  options={MARKETPLACES.map((market) => ({
                    value: market.id,
                    label:
                      market.id === "custom"
                        ? `${market.nome} (${formatPercent(input.taxaMarketplace)})`
                        : `${market.nome} (${market.taxaMin}% a ${market.taxaMax}%)`,
                  }))}
                />
                <FieldNumber
                  label="Custo do produto"
                  value={input.custoProduto}
                  onChange={(value) => setInput({ ...input, custoProduto: value })}
                />
                <FieldNumber
                  label="Frete / captacao"
                  value={input.custoFrete}
                  onChange={(value) => setInput({ ...input, custoFrete: value })}
                />
                <FieldNumber
                  label="Custos fixos extras"
                  value={input.custoFixoExtra}
                  onChange={(value) => setInput({ ...input, custoFixoExtra: value })}
                />
                <FieldNumber
                  label="Margem desejada %"
                  value={input.margemDesejada}
                  onChange={(value) => setInput({ ...input, margemDesejada: value })}
                />
                <FieldNumber
                  label="Taxa do canal %"
                  value={input.taxaMarketplace}
                  onChange={(value) => setInput({ ...input, taxaMarketplace: value })}
                />
                <FieldNumber
                  label="Faturamento 12 meses"
                  value={input.faturamento12m}
                  onChange={(value) => setInput({ ...input, faturamento12m: value })}
                />
                <FieldSelect
                  label="Categoria MEI"
                  value={input.meiCategoria}
                  onChange={(value) => setInput({ ...input, meiCategoria: value as MeiCategoria })}
                  options={Object.entries(MEI_DAS_2026).map(([value, item]) => ({
                    value,
                    label: `${item.label} (${brl.format(item.totalMensal)}/mes)`,
                  }))}
                />
                <FieldNumber
                  label="Vendas no mes"
                  value={input.vendasMensais}
                  onChange={(value) => setInput({ ...input, vendasMensais: value })}
                />
                <FieldSelect
                  label="UF origem"
                  value={input.ufOrigem}
                  onChange={(value) => setInput({ ...input, ufOrigem: value })}
                  options={ESTADOS.map((estado) => ({
                    value: estado.uf,
                    label: `${estado.uf} - ${estado.nome}`,
                  }))}
                />
                <FieldSelect
                  label="UF destino"
                  value={input.ufDestino}
                  onChange={(value) => setInput({ ...input, ufDestino: value })}
                  options={ESTADOS.map((estado) => ({
                    value: estado.uf,
                    label: `${estado.uf} - ${estado.nome}`,
                  }))}
                />
              </div>

              <label className="mt-4 flex items-center gap-3 rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={input.incluirIva2026}
                  onChange={(event) => setInput({ ...input, incluirIva2026: event.target.checked })}
                  className="h-4 w-4"
                />
                Incluir fase de teste 2026 com CBS 0,9% + IBS 0,1% quando aplicavel
              </label>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={saveScenario}
                  className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary"
                >
                  Salvar cenario
                </button>
                <button
                  type="button"
                  onClick={exportScenario}
                  className="rounded-xl border border-border/50 bg-muted/20 px-4 py-2 text-sm font-semibold text-foreground"
                >
                  Exportar JSON
                </button>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4 sm:p-5">
              <div className="mb-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Leitura executiva</p>
                <h3 className="text-xl font-display font-bold text-foreground">Resultado do preco</h3>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard label="Preco de venda" value={brl.format(result.precoVenda)} strong />
                <MetricCard label="Lucro liquido" value={brl.format(result.lucroLiquido)} />
                <MetricCard label="Imposto total" value={brl.format(result.impostoTotal)} />
                <MetricCard label="DAS por venda" value={brl.format(result.impostoFixoPorVenda)} />
                <MetricCard label="Carga tributaria" value={formatPercent(result.cargaTributariaPercent)} />
                <MetricCard label="Markup" value={`x${result.markupMultiplicador.toFixed(4)}`} />
                <MetricCard label="Taxa marketplace" value={brl.format(result.taxaMarketplaceValor)} />
                <MetricCard label="Custo operacional" value={brl.format(result.custoOperacional)} />
              </div>

              <div className="mt-4 rounded-2xl border border-border/50 bg-muted/20 p-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Memoria de calculo</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground">{result.formulaExplicacao}</p>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4 sm:p-5">
              <BreakdownBar
                breakdown={result.breakdown}
                custoTotal={result.custoOperacional}
                lucroLiquido={result.lucroLiquido}
                taxaMarketplaceValor={result.taxaMarketplaceValor}
                precoVenda={result.precoVenda}
              />
            </div>
          </div>

          <div className="space-y-4">
            <MathExplainer
              formulaExplicacao={result.formulaExplicacao}
              markupMultiplicador={result.markupMultiplicador}
              cargaTributariaPercent={result.cargaTributariaPercent}
              taxaMarketplace={input.taxaMarketplace}
              margemDesejada={input.margemDesejada}
            />

            <div className="glass-card rounded-2xl p-4 sm:p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Diagnostico rapido</p>
              <div className="mt-3 space-y-3 text-sm text-muted-foreground">
                <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
                  <p className="font-semibold text-foreground">Regime ativo</p>
                  <p className="mt-1">
                    {input.regime === "mei" && "Preco ja incorpora o DAS fixo rateado por venda."}
                    {input.regime === "simples" && "Preco considera aliquota efetiva do Simples sobre a receita."}
                    {input.regime === "presumido" &&
                      "Preco separa tributos federais e ICMS de referencia por UF."}
                  </p>
                </div>
                <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
                  <p className="font-semibold text-foreground">Faixa de MEI</p>
                  <p className="mt-1">
                    {meiInfo.label}: {brl.format(meiInfo.totalMensal)} por mes, equivalente a{" "}
                    {brl.format(result.impostoFixoPorVenda)} por venda no volume informado.
                  </p>
                </div>
                <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
                  <p className="font-semibold text-foreground">Uso pratico</p>
                  <p className="mt-1">
                    Serve para curiosidade, proposta comercial, defesa de preco e alinhamento com o escritorio contabil.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "mei" && (
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="glass-card rounded-2xl p-4 sm:p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Imposto fixo</p>
            <h3 className="text-xl font-display font-bold text-foreground">Base do MEI</h3>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
                <p className="font-semibold text-foreground">{meiInfo.label}</p>
                <p className="mt-2">INSS: {brl.format(meiInfo.inss)}</p>
                <p>ICMS: {brl.format(meiInfo.icms)}</p>
                <p>ISS: {brl.format(meiInfo.iss)}</p>
                <p className="mt-2 font-semibold text-primary">Total mensal: {brl.format(meiInfo.totalMensal)}</p>
              </div>
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <p className="font-semibold text-foreground">Rateio unitario</p>
                <p className="mt-2">
                  Com {input.vendasMensais} vendas/mensais, o DAS vira {brl.format(result.impostoFixoPorVenda)} por venda.
                </p>
                <p className="mt-2">
                  Isso evita o erro comum de ignorar imposto fixo e achar que o preco ainda esta saudavel.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 sm:p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Tabela de referencia</p>
            <h3 className="text-xl font-display font-bold text-foreground">Categorias MEI 2026</h3>
            <div className="mt-4 space-y-3">
              {Object.values(MEI_DAS_2026).map((item) => (
                <div key={item.label} className="rounded-xl border border-border/50 bg-muted/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">
                        INSS {brl.format(item.inss)} | ICMS {brl.format(item.icms)} | ISS {brl.format(item.iss)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-primary">{brl.format(item.totalMensal)}/mes</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "base" && (
        <div className="grid gap-4 xl:grid-cols-2">
          <div className="glass-card rounded-2xl p-4 sm:p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Base de calculo</p>
            <h3 className="text-xl font-display font-bold text-foreground">CBS / IBS mercadorias</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {Object.entries(cibsInput).map(([key, value]) => (
                <FieldNumber
                  key={key}
                  label={labelize(key)}
                  value={value}
                  onChange={(nextValue) => setCibsInput({ ...cibsInput, [key]: nextValue })}
                />
              ))}
            </div>
            <ResultCallout
              title="Resultado CIBS"
              value={brl.format(cibsBase.baseCalculo)}
              lines={[
                `Adicoes: ${brl.format(cibsBase.additions)}`,
                `Deducoes: ${brl.format(cibsBase.deductions)}`,
                cibsBase.memoria,
              ]}
            />
          </div>

          <div className="glass-card rounded-2xl p-4 sm:p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Base de calculo</p>
            <h3 className="text-xl font-display font-bold text-foreground">Imposto Seletivo</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {Object.entries(isInput).map(([key, value]) => (
                <FieldNumber
                  key={key}
                  label={labelize(key)}
                  value={value}
                  onChange={(nextValue) => setIsInput({ ...isInput, [key]: nextValue })}
                />
              ))}
            </div>
            <ResultCallout
              title="Resultado IS"
              value={brl.format(isBase.baseCalculo)}
              lines={[
                `Adicoes: ${brl.format(isBase.additions)}`,
                `Deducoes: ${brl.format(isBase.deductions)}`,
                isBase.memoria,
              ]}
            />
          </div>
        </div>
      )}

      {activeTab === "nfe" && (
        <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="glass-card rounded-2xl p-4 sm:p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Analise documental</p>
            <h3 className="text-xl font-display font-bold text-foreground">Leitor de chave NF-e</h3>
            <div className="mt-4 space-y-3">
              <label className="block text-sm text-muted-foreground">
                Chave de acesso com 44 digitos
                <input
                  value={nfeKey}
                  onChange={(event) => setNfeKey(event.target.value.replace(/\D/g, "").slice(0, 44))}
                  className="mt-2 w-full rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-foreground"
                  placeholder="Ex.: 35260112345678000123550010000012341000012345"
                />
              </label>
              <div className="rounded-xl border border-border/50 bg-muted/20 p-4 text-sm text-muted-foreground">
                {nfeKey.length === 0 && "Cole uma chave para extrair UF, periodo, CNPJ, modelo, serie e numero."}
                {nfeKey.length > 0 && !isValidNFeAccessKey(nfeKey) && "A chave precisa conter exatamente 44 digitos numericos."}
                {decodedNFe && "Chave valida. Os campos abaixo foram decodificados para conferencia rapida."}
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 sm:p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Campos extraidos</p>
            <h3 className="text-xl font-display font-bold text-foreground">Resultado da leitura</h3>
            <div className="mt-4 space-y-3">
              {decodedNFe ? (
                Object.entries(decodedNFe).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-muted/20 px-4 py-3">
                    <span className="text-sm text-muted-foreground">{labelize(key)}</span>
                    <span className="text-sm font-semibold text-foreground">{String(value)}</span>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-border/50 bg-muted/20 p-4 text-sm text-muted-foreground">
                  Nenhuma decodificacao disponivel no momento.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "estados" && (
        <div className="glass-card rounded-2xl p-4 sm:p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Base nacional</p>
          <h3 className="text-xl font-display font-bold text-foreground">ICMS interno de referencia por UF</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {ESTADOS.map((estado) => (
              <div key={estado.uf} className="rounded-xl border border-border/50 bg-muted/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-foreground">{estado.uf}</p>
                  <p className="text-sm font-semibold text-primary">{estado.icmsInterno}%</p>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{estado.nome}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "regimes" && (
        <div className="grid gap-4 lg:grid-cols-3">
          {regimeInfo.map((item) => (
            <div key={item.key} className="glass-card rounded-2xl p-4 sm:p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Regime tributario</p>
              <h3 className="mt-2 text-xl font-display font-bold text-foreground">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "historico" && (
        <div className="glass-card rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Persistencia local</p>
              <h3 className="text-xl font-display font-bold text-foreground">Historico de cenarios</h3>
            </div>
            <button
              type="button"
              onClick={clearHistory}
              className="rounded-xl border border-border/50 bg-muted/20 px-4 py-2 text-sm font-semibold text-foreground"
            >
              Limpar historico
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {history.length === 0 && (
              <div className="rounded-xl border border-border/50 bg-muted/20 p-4 text-sm text-muted-foreground">
                Nenhum cenario salvo ainda.
              </div>
            )}

            {history.map((scenario) => (
              <div key={scenario.id} className="rounded-xl border border-border/50 bg-muted/20 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-foreground">
                      {scenario.input.regime.toUpperCase()} | {brl.format(scenario.precoVenda)}
                    </p>
                    <p className="text-sm text-muted-foreground">{formatDate(scenario.createdAt)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => loadScenario(scenario)}
                    className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary"
                  >
                    Recarregar
                  </button>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-3 text-sm">
                  <div className="rounded-xl border border-border/50 bg-card/60 p-3">
                    <p className="text-muted-foreground">Lucro</p>
                    <p className="font-semibold text-foreground">{brl.format(scenario.lucroLiquido)}</p>
                  </div>
                  <div className="rounded-xl border border-border/50 bg-card/60 p-3">
                    <p className="text-muted-foreground">Carga tributaria</p>
                    <p className="font-semibold text-foreground">{formatPercent(scenario.cargaTributariaPercent)}</p>
                  </div>
                  <div className="rounded-xl border border-border/50 bg-card/60 p-3">
                    <p className="text-muted-foreground">UF</p>
                    <p className="font-semibold text-foreground">
                      {scenario.input.ufOrigem} - {scenario.input.ufDestino}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
