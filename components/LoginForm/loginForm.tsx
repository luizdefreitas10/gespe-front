"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Form } from "@heroui/form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc = mounted
    ? theme === "dark"
      ? "/arpe-form-logo.png"
      : "/arpe-logo-form-light.png"
    : "/arpe-form-logo.png";

  return (
    <Form className=" dark:bg-black/30 w-[600px] p-10 px-35 rounded-2xl backdrop-blur-md border-2 border-[#8b97ab] dark:border-[#293c61]">
      <Image
        src={logoSrc}
        alt="arpe logo form"
        width={80}
        height={80}
        quality={100}
        className="mx-auto"
      />
      <h1 className="mx-auto mt-6">Login</h1>
      <div className="w-full space-y-2">
        <Input
          variant="underlined"
          type="email"
          placeholder="Digite seu email"
          label="Email"
          className="border-b-1"
        ></Input>
        <Input
          variant="underlined"
          type="password"
          placeholder="Digite sua senha"
          label="Senha"
          className="border-b-1"
        ></Input>
      </div>

      <Button className="w-full my-5 bg-[#0d2956] text-white">Entrar</Button>
      <div className="flex space-x-2 w-full justify-end">
        <h1 className="text-[12px]">Esqueceu sua senha? clique</h1>
        <span className="cursor-pointer text-[12px] underline">aqui</span>
      </div>

      <div className="flex items-center w-full my-5">
        <div className="flex-1 h-px bg-black dark:bg-white"></div>
        <span className="px-4 text-sm text-black dark:text-white uppercase">
          OU
        </span>
        <div className="flex-1 h-px bg-black dark:bg-white"></div>
      </div>

      <Button
        variant="bordered"
        className="w-full my-5 text-black dark:text-white border-black dark:border-white border-1"
        onPress={() => router.push("/register")}
      >
        Criar conta
      </Button>
    </Form>
  );
}
