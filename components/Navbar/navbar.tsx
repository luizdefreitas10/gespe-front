"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from "@heroui/drawer";

import { ThemeSwitch } from "@/components/theme-switch";
import { PwaInstallButton } from "@/components/PwaInstallButton/pwaInstallButton";
import Image from "next/image";
import arpeLogo from "../../public/arpe-light-logo.svg";
import arpeColoredLogo from "../../public/arpe-colored-logo.png";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@heroui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const { handleSignOut, loggedUser, isAuthenticated } = useAuthContext();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isManagerRole =
    !!loggedUser?.role &&
    (loggedUser.role.startsWith("GESTOR") || loggedUser.role.startsWith("ADMIN"));
  const isUserRole = !!loggedUser?.role && loggedUser.role.startsWith("USER");

  // console.log("loggedUser", loggedUser);
  // console.log("isAuthenticated", isAuthenticated);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <HeroUINavbar
      isBordered={false}
      isBlurred={false}
      maxWidth="2xl"
      position="sticky"
      className="h-[96px] bg-transparent border-b border-white/40 dark:border-white/10 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[linear-gradient(to_right,rgba(0,0,0,0.4)_0%,rgba(255,255,255,0.6)_50%,rgba(0,0,0,0.4)_100%)] dark:after:bg-[linear-gradient(to_right,rgba(0,0,0,0.5)_0%,rgba(255,255,255,0.8)_50%,rgba(0,0,0,0.5)_100%)]"
    >
      <NavbarContent className="gap-3" justify="start">
        {isAuthenticated && loggedUser && (isManagerRole || isUserRole) && (
          <Button
            isIconOnly
            variant="light"
            className="text-[#0C2856] dark:text-white"
            aria-label="Abrir menu"
            onPress={() => setMenuOpen(true)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </Button>
        )}
        <Image src={arpeLogo} alt="light logo arpe" width={80} height={10} />
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-4 items-center">
          <PwaInstallButton />
          <ThemeSwitch />
          {isAuthenticated && loggedUser ? (
            <>
              {isManagerRole && (
                <Button
                  className="bg-white text-[#0C2856] border-[#0C2856] border-1 font-bold text-[12px]"
                  onPress={() => router.push("/gestor/management")}
                >
                  PAINEL DE GERENCIA
                </Button>
              )}
              <Button
                onPress={handleSignOut}
                className="bg-[#E6021D] text-white font-bold text-[12px]"
              >
                SAIR
              </Button>
            </>
          ) : (
            <div className="flex gap-4">
              <Button className="dark:bg-white dark:text-[#1E1E1E] border-black border-1 bg-white text-black font-bold text-[12px]">
                REGISTRAR-SE
              </Button>
              <Button className="dark:bg-[#0C2856] dark:text-white text-white border-black border-1 font-bold bg-[#0C2856] text-[12px]">
                ENTRAR
              </Button>
            </div>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4 gap-2 flex-wrap justify-end" justify="end">
        <PwaInstallButton />
        <ThemeSwitch />
        {isAuthenticated && loggedUser && (
          <Button onPress={handleSignOut}>SAIR</Button>
        )}
      </NavbarContent>

      <Drawer
        isOpen={menuOpen}
        onOpenChange={setMenuOpen}
        placement="left"
        size="xs"
        backdrop="opaque"
        hideCloseButton
      >
        <DrawerContent className="w-[520px] max-w-[calc(100vw-28px)] border-r border-[#b7c4d6] bg-[#f0f4f8] dark:border-[#1f4672] dark:bg-gradient-to-b dark:from-[#040b17] dark:via-[#0a1e3f] dark:to-[#061229]">
          {(onClose) => (
            <>
              <DrawerHeader className="pb-0 pt-7 px-8">
                <div className="w-full">
                  <div className="relative flex items-center justify-center">
                    <Image
                      src={arpeColoredLogo}
                      alt="Arpe logo colorida"
                      width={78}
                      height={48}
                      className="h-auto w-auto"
                    />
                    <Button
                      isIconOnly
                      variant="light"
                      className="absolute right-1 text-[#36465b] dark:text-[#dce8ff] min-w-0 w-9 h-9 hover:bg-[#dbe3ee] dark:hover:bg-white/10"
                      onPress={onClose}
                      aria-label="Fechar menu"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                    </Button>
                  </div>
                  <div className="mt-6 h-px w-full bg-[linear-gradient(to_right,rgba(150,163,181,0.35),rgba(150,163,181,0.8),rgba(150,163,181,0.35))] dark:bg-[linear-gradient(to_right,rgba(18,41,77,0.35),rgba(164,194,236,0.55),rgba(18,41,77,0.35))]" />
                </div>
              </DrawerHeader>
              <DrawerBody className="pt-10 px-8">
                <div className="flex h-full flex-col items-center">
                  <div className="mt-1 flex w-[400px] max-w-full flex-col gap-[16px]">
                    {isManagerRole ? (
                      <>
                        <Button
                          variant="flat"
                          className="h-[40px] rounded-[12px] bg-white text-[#1a1a1a] text-[13px] font-semibold tracking-wide uppercase hover:bg-white/90 dark:bg-[rgba(255,255,255,0.14)] dark:text-white dark:hover:bg-[rgba(255,255,255,0.2)]"
                          onPress={() => {
                            onClose();
                            router.push("/gestor");
                          }}
                        >
                          MEU PAINEL
                        </Button>
                        <Button
                          variant="flat"
                          className="h-[40px] rounded-[12px] bg-white text-[#1a1a1a] text-[13px] font-semibold tracking-wide uppercase hover:bg-white/90 dark:bg-[rgba(255,255,255,0.14)] dark:text-white dark:hover:bg-[rgba(255,255,255,0.2)]"
                          onPress={() => {
                            onClose();
                            router.push("/gestor/overview");
                          }}
                        >
                          VISUALIZAÇÃO GERAL
                        </Button>
                        <Button
                          variant="flat"
                          className="mt-2 h-[40px] rounded-[12px] bg-[#0C2856] text-white text-[13px] font-semibold tracking-wide uppercase hover:bg-[#173b73] dark:bg-[#10366d] dark:hover:bg-[#184582]"
                          onPress={() => {
                            onClose();
                            router.push("/gestor/management");
                          }}
                        >
                          PAINEL DE GESTÃO
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="flat"
                          className="h-[40px] rounded-[12px] bg-white text-[#1a1a1a] text-[13px] font-semibold tracking-wide uppercase hover:bg-white/90 dark:bg-[rgba(255,255,255,0.14)] dark:text-white dark:hover:bg-[rgba(255,255,255,0.2)]"
                          onPress={() => {
                            onClose();
                            router.push("/user?tab=tre");
                          }}
                        >
                          TRE
                        </Button>
                        <Button
                          variant="flat"
                          className="h-[40px] rounded-[12px] bg-white text-[#1a1a1a] text-[13px] font-semibold tracking-wide uppercase hover:bg-white/90 dark:bg-[rgba(255,255,255,0.14)] dark:text-white dark:hover:bg-[rgba(255,255,255,0.2)]"
                          onPress={() => {
                            onClose();
                            router.push("/user");
                          }}
                        >
                          FÉRIAS
                        </Button>
                      </>
                    )}
                  </div>

                  <Button
                    variant="flat"
                    className="mt-[58px] w-[400px] max-w-full h-[40px] rounded-[12px] bg-[#E6021D] text-white text-[13px] font-semibold tracking-wide uppercase hover:bg-[#c90019] dark:bg-[#e6021d] dark:hover:bg-[#c90019]"
                    onPress={() => {
                      onClose();
                      handleSignOut();
                    }}
                  >
                    Logout
                  </Button>
                </div>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </HeroUINavbar>
  );
};
