"use server";

import axios from "axios";
import { handleAxiosError } from "@/services/error";
import UserService from "@/services/models/user";

export async function fetchUserById(
  id: string,
  token: string
): Promise<{ isError: boolean; error?: string; user?: IUser }> {
  try {
    const { fetchUserById } = await UserService();

    const user  = await fetchUserById(id, token);
    
    return {
      isError: false,
      user: user,
    };

  } catch (error) {
    const customError = handleAxiosError(error);
    return { isError: true, error: customError.message };
  }
}
