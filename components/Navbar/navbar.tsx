"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";
import { Spinner } from "@heroui/spinner";

import { ThemeSwitch } from "@/components/theme-switch";
import Image from "next/image";
import arpeLogo from "../../public/arpe-light-logo.svg";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button, ButtonGroup } from "@heroui/button";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const { handleSignOut, loggedUser, isAuthenticated } = useAuthContext();
  const [mounted, setMounted] = useState(false);

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
      maxWidth="xl"
      position="sticky"
      className="h-[96px] bg-transparent border-b border-white/40 dark:border-white/10 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[linear-gradient(to_right,rgba(0,0,0,0.4)_0%,rgba(255,255,255,0.6)_50%,rgba(0,0,0,0.4)_100%)] dark:after:bg-[linear-gradient(to_right,rgba(0,0,0,0.5)_0%,rgba(255,255,255,0.8)_50%,rgba(0,0,0,0.5)_100%)]"
    >
      <NavbarContent className="" justify="start">
        <Image src={arpeLogo} alt="light logo arpe" width={80} height={10} />
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-4">
          <ThemeSwitch />
          {isAuthenticated && loggedUser ? (
            <Button onPress={handleSignOut} className="bg-[#E6021D] text-white font-bold text-[12px]">SAIR</Button>
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

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        {isAuthenticated && loggedUser && (
          <Button onPress={handleSignOut}>SAIR</Button>
        )}
      </NavbarContent>
    </HeroUINavbar>
  );
};
