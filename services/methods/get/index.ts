import { AxiosRequestConfig } from "axios";
import { handleAxiosError } from "../../error";
import { api } from "../../api";

export const get = async <Response>(
  url: string,
  config?: AxiosRequestConfig,
) => {
  try {
    const { data } = await api.get<Response>(url, config);
    return data;
  } catch (e) {
    throw handleAxiosError(e);
  }
};
