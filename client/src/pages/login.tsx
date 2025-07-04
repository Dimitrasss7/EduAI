import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import Header from "@/components/header";

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  user: any;
  token: string;
}

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: ""
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData): Promise<AuthResponse> => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      // Store token
      localStorage.setItem("authToken", data.token);
      
      toast({
        title: "Вход выполнен!",
        description: "Добро пожаловать обратно",
      });
      
      // Redirect to dashboard
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка входа",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive",
      });
      return;
    }
    
    loginMutation.mutate(formData);
  };

  const handleChange = (field: keyof LoginData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl text-center gradient-text">
                Войти в аккаунт
              </CardTitle>
              <p className="text-center text-muted-foreground">
                Продолжите обучение на нашей платформе
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="Введите email"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Пароль</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="Введите пароль"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full gradient-primary"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Вход..." : "Войти"}
                </Button>
              </form>
              
              <div className="mt-6 space-y-4">
                <div className="text-center text-sm text-muted-foreground">
                  или
                </div>
                
                <Button 
                  onClick={() => window.location.href = "/api/login"}
                  variant="outline" 
                  className="w-full"
                >
                  Войти через Replit
                </Button>
                
                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Нет аккаунта? </span>
                  <Link href="/register" className="text-primary hover:underline">
                    Зарегистрироваться
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}