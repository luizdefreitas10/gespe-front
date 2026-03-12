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
  department?: string;
  status?: string;
}

declare interface IGetUserById {
  user: {
    id: string;
    email: string;
    fullName: string;
    birthDate: Date;
    registry: string;
    position: string;
    department: string;
    role: RoleEnum;
    totalVacationDays: number;
    totalTreDays: number;
    vacation: any[];
    tre: any[];
    createdAt: Date;
    updatedAt: Date;
  };
}

declare interface IUser {
  id: string;
  email: string;
  fullName: string;
  birthDate: Date;
  registry: string;
  position: string;
  department: string;
  role: RoleEnum;
  totalVacationDays: number;
  totalTreDays: number;
  vacation: any[];
  tre: any[];
  createdAt: Date;
  updatedAt: Date;
}