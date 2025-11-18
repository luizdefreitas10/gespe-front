"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";

import { ThemeSwitch } from "@/components/theme-switch";
import Image from "next/image";
import arpeLogo from "../../public/arpe-light-logo.svg";
import { useTheme } from "next-themes";

export const Navbar = () => {
  const { theme } = useTheme();
  // console.log(theme);
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
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
      </NavbarContent>
    </HeroUINavbar>
  );
};
