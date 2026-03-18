import { useEffect, useMemo, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

function getStandaloneState() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(display-mode: standalone)").matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
}

function getPlatform() {
  if (typeof navigator === "undefined") {
    return "web";
  }

  const agent = navigator.userAgent.toLowerCase();
  if (agent.includes("android")) return "android";
  if (agent.includes("windows")) return "windows";
  if (agent.includes("iphone") || agent.includes("ipad") || agent.includes("ipod")) return "ios";
  return "web";
}

export function usePwaInstall() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(getStandaloneState);
  const [isInstalled, setIsInstalled] = useState(getStandaloneState);

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const onInstalled = () => {
      setIsInstalled(true);
      setIsStandalone(true);
      setInstallPrompt(null);
    };

    const media = window.matchMedia("(display-mode: standalone)");
    const onDisplayModeChange = (next: MediaQueryListEvent) => {
      setIsStandalone(next.matches);
      if (next.matches) {
        setIsInstalled(true);
      }
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);
    media.addEventListener("change", onDisplayModeChange);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      media.removeEventListener("change", onDisplayModeChange);
    };
  }, []);

  const install = async () => {
    if (!installPrompt) {
      return false;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setInstallPrompt(null);
      return true;
    }

    return false;
  };

  const platform = useMemo(() => getPlatform(), []);

  return {
    platform,
    isInstalled,
    isStandalone,
    canInstall: Boolean(installPrompt) && !isStandalone,
    install,
  };
}
