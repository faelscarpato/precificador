import { AppWindow, Download, MonitorSmartphone, Smartphone } from "lucide-react";
import { usePwaInstall } from "@/hooks/use-pwa-install";

const platformCopy = {
  android: "Instale no Android pelo prompt do navegador.",
  windows: "Instale no Windows pelo Edge ou Chrome como app.",
  ios: "No iPhone ou iPad, use Compartilhar > Adicionar a Tela de Inicio.",
  web: "Instale para abrir como app no desktop ou celular.",
} as const;

export function PwaInstallBar() {
  const { platform, isInstalled, isStandalone, canInstall, install } = usePwaInstall();

  return (
    <div className="rounded-[28px] border border-border/50 bg-black/45 p-4 backdrop-blur-xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            {platform === "windows" ? (
              <AppWindow className="h-5 w-5" />
            ) : (
              <MonitorSmartphone className="h-5 w-5" />
            )}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">PWA ativo</p>
            <p className="mt-1 text-sm text-foreground">
              Profit pronto para rodar como aplicativo em Android, Windows e navegador.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{platformCopy[platform]}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-border/50 bg-muted/20 px-3 py-1.5 text-xs text-muted-foreground">
            WebApp
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/20 px-3 py-1.5 text-xs text-muted-foreground">
            <Smartphone className="h-3.5 w-3.5" />
            Android
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/20 px-3 py-1.5 text-xs text-muted-foreground">
            <AppWindow className="h-3.5 w-3.5" />
            Windows
          </span>

          {canInstall && (
            <button
              type="button"
              onClick={() => void install()}
              className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/15"
            >
              <Download className="h-4 w-4" />
              Instalar app
            </button>
          )}

          {!canInstall && (isInstalled || isStandalone) && (
            <span className="rounded-xl border border-primary/25 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              App instalado
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
