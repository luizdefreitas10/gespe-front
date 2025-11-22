import * as yup from "yup";

enum RoleEnum {
  ADMIN = "ADMIN",
  GESTOR = "GESTOR",
  USER = "USER",
}

export const createUserSchema = yup.object({
  email: yup.string().email().required("Campo e-mail é obrigatório"),
  password: yup.string().required("Campo senha é obrigatório."),
  fullName: yup.string().required("Campo nome completo é orbigatório."),
  birthDate: yup.date().required("Campo data de nascimento é obrigatório."),
  department: yup.string().required("Departamento é um campo obrigatório."),
  position: yup.string().required("Campo cargo é obrigatório."),
  registry: yup.string().required("Campo matrícula é obrigatório."),
  role: yup.string().optional(),
});

export const registerFormSchema = yup
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

export type FormValues = yup.InferType<typeof registerFormSchema>;
