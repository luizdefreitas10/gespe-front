import { post } from "@/services/methods/post";

export default async function SessionService() {
  async function authenticate(data: ILogin) {
    const payload = JSON.stringify(data);

    return await post<IAuth, string>("/sessions", payload);
  }
  return {
    authenticate,
  };
}
