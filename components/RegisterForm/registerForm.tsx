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
import { get } from "@/services/methods/get";
import { FormValues, registerFormSchema } from "@/schemas/user";
import { registerUser } from "@/app/register/actions";
import { Bounce, toast } from "react-toastify";

export default function RegisterForm() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRegisterUser = async (
    name: string,
    email: string,
    password: string,
    birthDate: string,
    position: string,
    department: string,
    registry: string
  ) => {
    const response = await registerUser(
      name,
      email,
      password,
      birthDate,
      position,
      department,
      registry
    );
    return response;
  };

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
    resolver: yupResolver(registerFormSchema),
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

  const onSubmitForm = async (
    data: FormValues,
    event?: React.BaseSyntheticEvent
  ) => {
    // event?.preventDefault();
    try {
      console.log(data);
      const response = await handleRegisterUser(
        data.nome,
        data.email,
        data.senha,
        data.nascimento,
        data.cargo,
        data.departamento,
        data.matricula
      );
      console.log(response.isError);

      if (response.isError === false) {
        console.log("Dados enviados:", data);
        reset();
        toast.success("Usuário registrado com sucesso.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: theme === "light" ? "light" : "dark",
          transition: Bounce,
        });
      } else {
        toast.error(`Erro ao registrar o usuário. ${response.error}`);
      }
    } catch (error) {
      console.log(error);
    }
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
