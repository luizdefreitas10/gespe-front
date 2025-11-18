"use client";

import { Button, ButtonGroup } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";

// SCHEMA
const schema = yup
  .object()
  .shape({
    nome: yup
      .string()
      .required("O nome completo é obrigatório")
      .min(3, "Nome muito curto"),
    email: yup
      .string()
      .email("Formato de email inválido")
      .required("Email é obrigatório"),
    senha: yup
      .string()
      .required("A senha é obrigatória")
      .min(6, "Mínimo de 6 caracteres"),
    matricula: yup.string().required("A matrícula é obrigatória."),
    nascimento: yup.string().required("Data de nascimento é obrigatória"),
    cargo: yup.string().required("Cargo é obrigatório"),
    departamento: yup.string().required("Departamento é obrigatório"),
  })
  .noUnknown(true);

type FormValues = yup.InferType<typeof schema>;

export default function RegisterForm() {
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

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onSubmit",
    shouldFocusError: false,
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      nascimento: "",
      cargo: "",
      departamento: "",
      matricula: "",
    },
  });

  const onSubmitForm = (data: FormValues, event?: React.BaseSyntheticEvent) => {
    // event?.preventDefault();
    console.log("Dados enviados:", data);
    reset();
  };

  return (
    <Form
      className="flex flex-col gap-4 dark:bg-black/30 w-[600px] p-10 px-35 rounded-2xl backdrop-blur-md border-2 border-[#8b97ab] dark:border-[#293c61] mb-16"
      onSubmit={handleSubmit(onSubmitForm)}
    >
      <Image
        src={logoSrc}
        alt="arpe logo form"
        width={80}
        height={80}
        quality={100}
        className="mx-auto"
      />
      <h1 className="mx-auto mt-6">Registro</h1>
      <Input
        className="border-b-1"
        size="sm"
        label="Nome Completo"
        variant="underlined"
        placeholder="Digite seu nome"
        {...register("nome")}
        isInvalid={!!errors.nome}
        errorMessage={errors.nome?.message}
      />

      <Input
        className="border-b-1"
        label="Email"
        variant="underlined"
        placeholder="Digite seu email"
        {...register("email")}
        isInvalid={!!errors.email}
        errorMessage={errors.email?.message}
      />

      <Input
        className="border-b-1"
        label="Senha"
        variant="underlined"
        placeholder="Digite sua senha"
        type="password"
        {...register("senha")}
        isInvalid={!!errors.senha}
        errorMessage={errors.senha?.message}
      />

      <Input
        className="border-b-1"
        label="Matrícula"
        variant="underlined"
        placeholder="Digite seu matrícula"
        {...register("matricula")}
        isInvalid={!!errors.matricula}
        errorMessage={errors.matricula?.message}
      />

      <Input
        className="border-b-1"
        label="Data de Nascimento"
        variant="underlined"
        placeholder="Digite sua data de nascimento"
        type="date"
        {...register("nascimento")}
        isInvalid={!!errors.nascimento}
        errorMessage={errors.nascimento?.message}
      />

      <Input
        className="border-b-1"
        label="Cargo"
        variant="underlined"
        placeholder="Digite seu cargo"
        {...register("cargo")}
        isInvalid={!!errors.cargo}
        errorMessage={errors.cargo?.message}
      />

      <Input
        className="border-b-1"
        label="Departamento"
        variant="underlined"
        placeholder="Digite seu departamento"
        {...register("departamento")}
        isInvalid={!!errors.departamento}
        errorMessage={errors.departamento?.message}
      />

      <Button
        type="submit"
        color="success"
        radius="md"
        className="w-full text-white bg-[#0d2956] mt-4"
        isLoading={isSubmitting}
      >
        Registrar
      </Button>

      <div className="flex items-center w-full my-5">
        <div className="flex-1 h-px bg-black dark:bg-white"></div>
        <span className="px-4 text-sm text-black dark:text-white uppercase">
          OU
        </span>
        <div className="flex-1 h-px bg-black dark:bg-white"></div>
      </div>

      <Button
        variant="bordered"
        radius="md"
        className="w-full ext-black dark:text-white border-black dark:border-white border-1"
        isLoading={isSubmitting}
        onPress={() => router.push("/")}
      >
        Entrar agora
      </Button>
    </Form>
  );
}
