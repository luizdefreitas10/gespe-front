import { get } from "@/services/methods/get";
import { post } from "@/services/methods/post";

export default async function UserService() {
  async function createAccount(
    email: string,
    password: string,
    fullName: string,
    birthDate: string,
    department: string,
    position: string,
    registry: string,
    role?: RoleEnum
  ): Promise<void> {
    const birthDateObj = new Date(birthDate);

    if (isNaN(birthDateObj.getTime())) {
      throw new Error("Data de nascimento inválida");
    }

    const birthDateISO = birthDateObj.toISOString();

    const payload = JSON.stringify({
      email: email.trim(),
      password,
      fullName,
      birthDate,
      department,
      position,
      registry,
      role,
    });

    await post<void, typeof payload>(`/accounts`, payload);
  }

  async function fetchUsers(token: string): Promise<IGetUsers[]> {
    const response = await get<IGetUsers[]>(`/accounts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }

  return {
    createAccount,
    fetchUsers,
  };
}
