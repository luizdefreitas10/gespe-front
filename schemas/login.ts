import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Insira um e-mail válido.")
    .required("Campo e-mail é obrigatório."),
  password: yup
    .string()
    .min(4, "A senha precisa conter no mínimo 4 caracteres")
    .required("Campo senha é obrigatório."),
});

export type LoginSchema = yup.InferType<typeof loginSchema>;
