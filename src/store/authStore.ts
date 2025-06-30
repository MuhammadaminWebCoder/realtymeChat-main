import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginWithProvider, registerWithEmail, loginWithEmail } from "@/services/authService";

export const useAuth = () => {
  const queryClient = useQueryClient();

  const loginProvider = useMutation({
    mutationFn: (provider: "google"| "apple") => loginWithProvider(provider),
    onSuccess: (user) => {
      console.log("Provider login success:", user);
 queryClient.invalidateQueries({ queryKey: ["user"] });

    },
  });

  const emailRegister = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => registerWithEmail(email, password),
    onSuccess: (user) => {
      console.log("Email register success:", user);
queryClient.invalidateQueries({ queryKey: ["user"] });

    },
  });

  const emailLogin = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => loginWithEmail(email, password),
    onSuccess: (user) => {
      console.log("Email login success:", user);
 queryClient.invalidateQueries({ queryKey: ["user"] });

    },
  });

  return {
    loginProvider,
    emailRegister,
    emailLogin,
  };
};
