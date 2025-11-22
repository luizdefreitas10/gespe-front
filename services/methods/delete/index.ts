import { AxiosRequestConfig } from "axios";

import { handleAxiosError } from "../../error";
import { api } from "../../api";

export const del = async <Response>(
  url: string,
  config?: AxiosRequestConfig,
) => {
  try {
    const { data } = await api.delete<Response>(url, config);
    return data;
  } catch (e) {
    throw handleAxiosError(e);
  }
};
