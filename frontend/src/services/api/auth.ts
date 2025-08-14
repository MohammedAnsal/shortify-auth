import { publicAxiosInstance } from "../axiosInstance/userInstance";

const publicApi = publicAxiosInstance;

const handleResponse = (response: any, message: string) => {
  if (!response) console.error(message);
  return response;
};

const handleError = (error: any) => {
  console.error(error);
  throw error;
};

export const signUp = async (formData: object) => {
  try {
    const response = await publicApi.post("/auth/signUp", formData);

    return handleResponse(response, "Error in sign-up request");
  } catch (error) {
    handleError(error);
  }
};

export const signIn = async (formData: object) => {
  try {
    const response = await publicApi.post("/auth/signIn", formData);

    return handleResponse(response.data, "Error in sign-in request");
  } catch (error) {
    handleError(error);
  }
};

export const googleRequest = async (token: string) => {
  try {
    const response = await publicApi.post(
      "/auth/google-signIn",
      { token },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const verifyEmail = async (email: string, token: string) => {
  try {
    const response = await publicApi.get(`/auth/verify-email?email=${email}&token=${token}`);
    return handleResponse(response.data, "Error in email verification");
  } catch (error) {
    handleError(error);
  }
};

