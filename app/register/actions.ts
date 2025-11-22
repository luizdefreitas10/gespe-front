"use server";

import axios from "axios";
import { handleAxiosError } from "@/services/error";
import UserService from "@/services/models/user";

export async function registerUser(
  name: string,
  email: string,
  password: string,
  birthDate: string,
  position: string,
  department: string,
  registry: string
): Promise<{ isError: boolean; error?: string }> {
  try {
    const { createAccount } = await UserService();

    await createAccount(
      email,
      password,
      name,
      birthDate,
      department,
      position,
      registry
    );
    return {
      isError: false,
    };
  } catch (error) {
    const customError = handleAxiosError(error);
    return { isError: true, error: customError.message };
  }
}
