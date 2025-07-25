import { userAxiosInstance } from "../axiosInstance/userInstance";

const api = userAxiosInstance;

const handleResponse = (response: any, message: string) => {
  if (!response) console.error(message);
  return response;
};

const handleError = (error: any) => {
  console.error(error);
  throw error;
};

export const short_Url = async (originalUrl: string) => {
  try {
    const response = await api.post("/url/shortUrl", { originalUrl });
    console.log(response);

    return handleResponse(response.data, "Error in short url request");
  } catch (error) {
    handleError(error);
  }
};

export const userLogout = async () => {
  try {
    const response = await api.post("/auth/logout");
    console.log(response.data)
    return handleResponse(response.data, "Error in logout request");
  } catch (error) {
    handleError(error);
  }
};
