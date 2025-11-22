"use server";

import { handleAxiosError } from "@/services/error";
import SessionService from "@/services/models/session";

export async function authenticateUser(data: ILogin) {
  try {
    const { authenticate } = await SessionService();
    const { access_token } = await authenticate(data);

    return {
      isError: false,
      access_token: access_token,
    };
  } catch (error) {
    console.log(error);
    const customError = handleAxiosError(error);
    return { isError: true, error: customError.message };
  }
}
