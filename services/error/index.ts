import axios, { AxiosError } from "axios";

interface CustomError {
  message: string;
  statusCode?: number;
  details?: any;
}

export const handleAxiosError = (error: AxiosError | unknown): CustomError => {
  if (axios.isAxiosError(error)) {
    console.log(error);

    const responseMessage = error.response?.data?.message;
    const nestedMessage = error.response?.data?.errors?.details?.[0]?.message;
    const networkMessage = error.message || "";
    const isConnectionError =
      networkMessage.includes("ECONNREFUSED") ||
      networkMessage.includes("Network Error");

    if (isConnectionError) {
      return {
        message:
          "Nao foi possivel conectar com a API. Tente novamente em instantes.",
        statusCode: error.response?.status,
        details: error.response?.data,
      };
    }

    return {
      message: responseMessage || nestedMessage || "Um erro aconteceu",
      statusCode: error.response?.status,
      details: error.response?.data,
    };
  }

  return {
    message: (error as Error).message,
  };
};
