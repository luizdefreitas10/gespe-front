"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function BackgroundImage() {
  const { theme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const imageSrc = mounted
    ? theme === "dark"
      ? "/background-wave.png"
      : "/background-waves-light.png"
    : "/background-wave.png";

  return (
    <Image
      src={imageSrc}
      alt={"background image"}
      width={1000}
      height={1000}
      quality={100}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 w-full"
    />
  );
}
