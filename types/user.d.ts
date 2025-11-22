enum RoleEnum {
  ADMIN = "ADMIN",
  GESTOR = "GESTOR",
  USER = "USER",
}

declare interface ICreateAccount {
  email: string;
  password: string;
  fullName: string;
  birthDate: Date;
  department: string;
  position: string;
  registry: string;
  role?: RoleEnum;
}

declare interface IGetUsers {
  id: string;
  fullName: string;
  email: string;
}
