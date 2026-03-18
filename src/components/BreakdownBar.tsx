import { TaxBreakdown } from "@/lib/calculator";

interface BreakdownBarProps {
  breakdown: TaxBreakdown[];
  custoTotal: number;
  lucroLiquido: number;
  taxaMarketplaceValor: number;
  precoVenda: number;
}

const corMap = {
  green: "bg-primary",
  amber: "bg-accent",
  red: "bg-destructive",
  blue: "bg-chart-blue",
  purple: "bg-chart-purple",
};

const corTextMap = {
  green: "text-primary",
  amber: "text-accent",
  red: "text-destructive",
  blue: "text-chart-blue",
  purple: "text-chart-purple",
};

export function BreakdownBar({
  breakdown,
  custoTotal,
  lucroLiquido,
  taxaMarketplaceValor,
  precoVenda,
}: BreakdownBarProps) {
  if (precoVenda <= 0) return null;

  const segments = [
    { label: "Custo", valor: custoTotal, percent: (custoTotal / precoVenda) * 100, bg: "bg-secondary", text: "text-secondary-foreground" },
    ...breakdown.map(b => ({
      label: b.label,
      valor: b.valor,
      percent: b.percentual,
      bg: corMap[b.cor],
      text: corTextMap[b.cor],
    })),
    { label: "Marketplace", valor: taxaMarketplaceValor, percent: (taxaMarketplaceValor / precoVenda) * 100, bg: "bg-muted-foreground", text: "text-muted-foreground" },
    { label: "Seu Lucro", valor: lucroLiquido, percent: (lucroLiquido / precoVenda) * 100, bg: "bg-primary", text: "text-primary" },
  ].filter(s => s.percent > 0);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Para onde vai cada centavo
      </h3>

      {/* Visual bar */}
      <div className="flex h-8 rounded-lg overflow-hidden gap-0.5">
        {segments.map((seg, i) => (
          <div
            key={i}
            className={`${seg.bg} transition-all duration-700 ease-out relative group`}
            style={{ width: `${seg.percent}%`, minWidth: seg.percent > 0 ? "4px" : "0" }}
            title={`${seg.label}: R$ ${seg.valor.toFixed(2)} (${seg.percent.toFixed(1)}%)`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <div className={`w-3 h-3 rounded-sm ${seg.bg} shrink-0`} />
            <div className="min-w-0">
              <span className="text-muted-foreground truncate block text-xs">{seg.label}</span>
              <span className={`font-mono font-semibold text-xs ${seg.text}`}>
                R$ {seg.valor.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
