import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    queryFn: async () => {
      const token = localStorage.getItem("authToken");
      
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch("/api/auth/user", {
        headers,
        credentials: "include",
      });
      
      if (!response.ok) {
        // Clear invalid token
        if (token) {
          localStorage.removeItem("authToken");
        }
        throw new Error("Not authenticated");
      }
      
      return await response.json();
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout: () => {
      localStorage.removeItem("authToken");
      window.location.href = "/";
    },
  };
}