import { get } from "@/services/methods/get";
import { post } from "@/services/methods/post";
import { patch } from "@/services/methods/patch";

export default async function UserService() {
  interface UpdateUserPayload {
    fullName?: string;
    email?: string;
    birthDate?: string;
    department?: string;
    position?: string;
    registry?: string;
    role?: RoleEnum;
    status?: string;
  }

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
    const PAGE_SIZE = 20;
    const MAX_PAGES = 200;
    const allUsers: IGetUsers[] = [];

    for (let page = 1; page <= MAX_PAGES; page++) {
      const response = await get<
        IGetUsers[] | { data?: IGetUsers[]; users?: IGetUsers[] }
      >(`/accounts?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let pageUsers: IGetUsers[] = [];

      if (Array.isArray(response)) {
        pageUsers = response;
      } else if (response && typeof response === "object") {
        if ("data" in response && Array.isArray(response.data)) {
          pageUsers = response.data;
        } else if ("users" in response && Array.isArray(response.users)) {
          pageUsers = response.users;
        }
      }

      if (pageUsers.length === 0) {
        break;
      }

      allUsers.push(...pageUsers);

      if (pageUsers.length < PAGE_SIZE) {
        break;
      }
    }

    const uniqueUsers = allUsers.filter(
      (user, index, arr) => arr.findIndex((u) => u.id === user.id) === index
    );

    return uniqueUsers;
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

  async function updateUserById(
    id: string,
    token: string,
    payload: UpdateUserPayload
  ): Promise<IUser> {
    const response = await patch<IGetUserById | IUser, UpdateUserPayload>(
      `/accounts/id/${id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response && typeof response === "object" && "user" in response) {
      return response.user;
    }

    return response as IUser;
  }

  return {
    createAccount,
    fetchUsers,
    fetchUserById,
    updateUserById,
  };
}
