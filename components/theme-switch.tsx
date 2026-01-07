"use client";

import { FC } from "react";
import { useTheme } from "next-themes";
import { useIsSSR } from "@react-aria/ssr";
import type { SwitchProps } from "@heroui/switch";

import ThemeSwitchComponent from "./ThemeSwitchComponent/themeSwitchComponent";

export interface ThemeSwitchProps {
  className?: string;
  classNames?: SwitchProps["classNames"];
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({
  className,
  classNames,
}) => {
  const { theme, setTheme } = useTheme();
  const isSSR = useIsSSR();

  const isSelected = !isSSR && theme === "dark";

  const handleChange = () => {
    setTheme(isSelected ? "light" : "dark");
  };

  return (
    <ThemeSwitchComponent
      isSelected={isSelected}
      onChange={handleChange}
      className={className}
      classNames={classNames}
      ariaLabel={`Switch to ${isSelected ? "light" : "dark"} mode`}
    />
  );
};
