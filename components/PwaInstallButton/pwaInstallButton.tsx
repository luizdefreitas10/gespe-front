"use client";

import { Button } from "@heroui/button";
import { useCallback, useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalonePwa(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches;
}

export function PwaInstallButton() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    if (isStandalonePwa()) {
      setInstalled(true);
      return;
    }

    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    );

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };

    const onAppInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, [mounted]);

  const onInstall = useCallback(async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  }, [deferred]);

  if (!mounted || installed) {
    return null;
  }

  if (isIOS) {
    return (
      <span
        className="max-w-[min(100%,280px)] text-[10px] leading-tight text-[#36465b] dark:text-[#b8d2f7] sm:text-[11px]"
        title="No Safari: Compartilhar → Adicionar à Tela de Início"
      >
        Safari:{" "}
        <span className="font-semibold text-[#0C2856] dark:text-white">Compartilhar</span> →{" "}
        <span className="font-semibold text-[#0C2856] dark:text-white">Tela de Início</span>
      </span>
    );
  }

  if (!deferred) {
    return null;
  }

  return (
    <Button
      size="sm"
      variant="bordered"
      className="border-[#0C2856] text-[#0C2856] font-semibold text-[11px] dark:border-[#8db8f0] dark:text-[#dce8ff]"
      onPress={onInstall}
    >
      Instalar app
    </Button>
  );
}
