import { AxiosRequestConfig } from "axios";
import { handleAxiosError } from "../../error";
import { api } from "../../api";

export const post = async <Response, Body>(
  url: string,
  body: Body,
  config?: AxiosRequestConfig,
) => {
  try {
    const { data } = await api.post<Response>(url, body, config);
    return data;
  } catch (e) {
    throw handleAxiosError(e);
  }
};

export const postFormData = async <TResponse>(
  url: string,
  data: FormData,
): Promise<TResponse> => {
  try {
    const response = await api.post<TResponse>(url, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (e) {
    throw handleAxiosError(e);
  }
};
