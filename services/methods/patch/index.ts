import { AxiosRequestConfig } from "axios";
import { handleAxiosError } from "../../error";
import { api } from "../../api";

export const patch = async <Response, Body>(
  url: string,
  body?: Body,
  config?: AxiosRequestConfig,
) => {
  try {
    const { data } = await api.patch<Response>(url, body, config);
    return data;
  } catch (e) {
    throw handleAxiosError(e);
  }
};
