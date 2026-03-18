interface MathExplainerProps {
  formulaExplicacao: string;
  markupMultiplicador: number;
  cargaTributariaPercent: number;
  taxaMarketplace: number;
  margemDesejada: number;
}

export function MathExplainer({
  formulaExplicacao,
  markupMultiplicador,
  cargaTributariaPercent,
  taxaMarketplace,
  margemDesejada,
}: MathExplainerProps) {
  const totalDedutivel = cargaTributariaPercent + taxaMarketplace + margemDesejada;

  return (
    <div className="glass-card rounded-xl p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
          <span className="text-xl">🧮</span>
        </div>
        <div>
          <h3 className="font-display font-bold text-foreground">
            A Matemática por trás da Mágica
          </h3>
          <p className="text-xs text-muted-foreground">Markup Divisor — o cálculo "por dentro"</p>
        </div>
      </div>

      {/* Fórmula principal */}
      <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
        <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-semibold">Fórmula do Markup Divisor</p>
        <div className="font-mono text-sm text-foreground leading-relaxed space-y-1">
          <p>Preço de Venda = <span className="text-primary font-bold">Custo</span> ÷ (1 − <span className="text-accent font-bold">Σ Deduções%</span>)</p>
        </div>
      </div>

      {/* Composição */}
      <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
        <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-semibold">Composição das Deduções</p>
        <div className="space-y-2 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-chart-blue">Impostos</span>
            <span className="text-chart-blue font-bold">{cargaTributariaPercent.toFixed(2)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">+ Marketplace</span>
            <span className="text-muted-foreground font-bold">{taxaMarketplace.toFixed(2)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-primary">+ Margem Desejada</span>
            <span className="text-primary font-bold">{margemDesejada.toFixed(2)}%</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between">
            <span className="text-accent font-bold">= Total Dedutível</span>
            <span className="text-accent font-bold">{totalDedutivel.toFixed(2)}%</span>
          </div>
        </div>
      </div>

      {/* Resultado */}
      <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
        <p className="text-xs text-primary mb-2 uppercase tracking-wider font-semibold">Seu Cálculo</p>
        <p className="font-mono text-sm text-foreground">{formulaExplicacao}</p>
        <p className="font-mono text-sm text-muted-foreground mt-2">
          Multiplicador: <span className="text-accent font-bold">×{markupMultiplicador.toFixed(4)}</span>
        </p>
      </div>

      {/* Alerta educacional */}
      <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
        <p className="text-xs font-bold text-destructive mb-1">⚠️ O erro que 90% dos empreendedores cometem</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Somar impostos <strong>sobre</strong> o custo (markup multiplicador) é diferente de calcular impostos{" "}
          <strong>por dentro</strong> do preço de venda (markup divisor). O primeiro método faz você pagar mais
          imposto do que precisa, porque o imposto incide sobre o preço final — não sobre o custo.
          O Markup Divisor garante que sua margem líquida seja <strong>exatamente</strong> o que você definiu.
        </p>
      </div>
    </div>
  );
}
