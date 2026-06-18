import axios, { AxiosError } from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message =
      (error.response?.data as { message?: string })?.message ??
      error.message ??
      "An unexpected error occurred";

    console.error("[API Error]", message);
    return Promise.reject(error);
  },
);

export { apiClient };
