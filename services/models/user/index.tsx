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
    const response = await get<IGetUsers[] | { data?: IGetUsers[]; users?: IGetUsers[] }>(`/accounts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Garante que retorna um array
    if (Array.isArray(response)) {
      return response;
    }
    
    // Se for um objeto, tenta extrair o array
    if (response && typeof response === 'object') {
      if ('data' in response && Array.isArray(response.data)) {
        return response.data;
      }
      if ('users' in response && Array.isArray(response.users)) {
        return response.users;
      }
    }
    
    // Se não conseguir extrair, retorna array vazio
    console.warn("Formato de resposta inesperado:", response);
    return [];
  }

  async function fetchUserById(
    id: string,
    token: string
  ): Promise<IUser> {
    console.log(id);
    console.log(token);
    const response = await get<IGetUserById>(`/accounts/id/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.user;
  }

  return {
    createAccount,
    fetchUsers,
    fetchUserById,
  };
}
