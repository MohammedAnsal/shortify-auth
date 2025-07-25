import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { googleRequest } from "../services/api/auth";
import { loginSuccess } from "../redux/slice/userSlice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export const useGoogle = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { mutate: googleLogin } = useMutation({
    mutationFn: async (credential: string) => {
      return await googleRequest(credential);
    },

    onSuccess: (response) => {
      if (response.success) {
        localStorage.setItem("access-token", response.accessToken);
        dispatch(
          loginSuccess({
            userId: response.userId,
            fullName: response.fullName,
            email: response.email,
            token: response.token,
          })
        );
        toast.success("Login successful!");
        navigate("/url/short");
      }
    },
    onError: (error: unknown) => {
      console.error("Google login failed:", error);
      toast.error("Google login failed. Please try again.");
    },
  });

  const handleGoogleSuccess = (credentialResponse: any) => {
    googleLogin(credentialResponse.credential);
  };

  const handleGoogleError = () => {
    toast.error("Google login failed. Please try again.");
  };

  return {
    handleGoogleSuccess,
    handleGoogleError,
  };
};
