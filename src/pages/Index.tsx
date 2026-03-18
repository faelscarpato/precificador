import { ArrowUpRight, Blocks, Calculator, Files, ShieldCheck } from "lucide-react";
import { PricingCalculator } from "@/components/PricingCalculator";

const VERIFICADOR_CNPJ_URL = "https://bomcnpj.faelscarpato.workers.dev";

const topMenu = [
  { label: "Calculadora", href: "#workspace" },
  { label: "Governanca", href: "#governanca" },
  { label: "Verificador CNPJ", href: "https://bomcnpj.faelscarpato.workers.dev" },
];

const Index = () => {
  return (
    <div className="min-h-screen terminal-bg grid-pattern">
      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8">
        <header className="sticky top-3 z-20 mb-6 rounded-[28px] border border-border/50 bg-black/50 px-4 py-4 backdrop-blur-xl sm:px-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-accent">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-lg font-display font-black tracking-tight text-accent">
                    Profit Navigator 2026
                  </p>
                  
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Workspace de precificação tributária com atalhos operacionais e leitura fiscal objetiva.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:items-end">
              <nav className="flex flex-wrap gap-2">
                {topMenu.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="rounded-full border border-border/50 bg-muted/20 px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-primary/30 hover:text-primary"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              <div className="flex flex-wrap gap-2">
               
              </div>
            </div>
          </div>
        </header>

        <section id="workspace" className="space-y-4">
         

          <PricingCalculator />
        </section>

        <footer
          id="governanca"
          className="mt-8 grid gap-4 text-sm text-muted-foreground sm:grid-cols-2 xl:grid-cols-3"
        >
          

        </footer>
      </div>
    </div>
  );
};

export default Index;
