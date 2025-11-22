import axios, { AxiosError } from "axios";

interface CustomError {
  message: string;
  statusCode?: number;
  details?: any;
}

export const handleAxiosError = (error: AxiosError | unknown): CustomError => {
  if (axios.isAxiosError(error)) {
    console.log(error);
    return {
      message:
        error.response?.data?.message ||
        error.response?.data.errors.details[0].message ||
        "An error occurred",
      statusCode: error.response?.status,
      details: error.response?.data,
    };
  }

  return {
    message: (error as Error).message,
  };
};
