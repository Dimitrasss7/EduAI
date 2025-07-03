import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getAuthHeaders } from "@/lib/auth";
import { 
  User, 
  Mail, 
  Phone, 
  Camera, 
  Settings, 
  Award, 
  BookOpen,
  Clock,
  TrendingUp,
  Bell,
  Shield,
  Key
} from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "",
    bio: ""
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/users/${user?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error("Failed to update profile");
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Профиль обновлен",
        description: "Ваши данные успешно сохранены",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить профиль",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateProfileMutation.mutate(formData);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: "",
      bio: ""
    });
    setIsEditing(false);
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Профиль</h1>
            <p className="text-muted-foreground">
              Управляйте своей учетной записью и настройками
            </p>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Профиль</TabsTrigger>
              <TabsTrigger value="progress">Прогресс</TabsTrigger>
              <TabsTrigger value="settings">Настройки</TabsTrigger>
              <TabsTrigger value="security">Безопасность</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                  <Card className="glass-card">
                    <CardContent className="p-6 text-center">
                      <div className="relative inline-block mb-4">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={user?.profileImageUrl} />
                          <AvatarFallback className="text-2xl">
                            {getInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <Button 
                          size="sm" 
                          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                          variant="secondary"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        {user?.firstName} {user?.lastName}
                      </h3>
                      <p className="text-muted-foreground mb-4">{user?.email}</p>
                      <Badge variant="secondary" className="bg-primary/20 text-primary">
                        {user?.role === "student" ? "Студент" : 
                         user?.role === "teacher" ? "Преподаватель" : "Администратор"}
                      </Badge>
                    </CardContent>
                  </Card>
                </div>

                {/* Profile Form */}
                <div className="lg:col-span-2">
                  <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Личная информация</CardTitle>
                      {!isEditing ? (
                        <Button 
                          variant="outline" 
                          onClick={() => setIsEditing(true)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Редактировать
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            onClick={handleCancel}
                            disabled={updateProfileMutation.isPending}
                          >
                            Отмена
                          </Button>
                          <Button 
                            onClick={handleSave}
                            disabled={updateProfileMutation.isPending}
                            className="gradient-primary"
                          >
                            Сохранить
                          </Button>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Имя</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Фамилия</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Телефон</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          disabled={!isEditing}
                          placeholder="+7 (999) 123-45-67"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">О себе</Label>
                        <textarea
                          id="bio"
                          className="w-full min-h-[80px] px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                          value={formData.bio}
                          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                          disabled={!isEditing}
                          placeholder="Расскажите о себе..."
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="progress" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Завершено курсов</p>
                        <p className="text-2xl font-bold gradient-text">3</p>
                      </div>
                      <BookOpen className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Время обучения</p>
                        <p className="text-2xl font-bold gradient-text">45ч</p>
                      </div>
                      <Clock className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Получено сертификатов</p>
                        <p className="text-2xl font-bold gradient-text">2</p>
                      </div>
                      <Award className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Средний балл</p>
                        <p className="text-2xl font-bold gradient-text">87</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Достижения</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { title: "Первый курс", description: "Завершили первый курс", earned: true },
                      { title: "Отличник", description: "Средний балл выше 85", earned: true },
                      { title: "Марафонец", description: "7 дней подряд обучения", earned: false },
                      { title: "Эксперт", description: "Сдали все тесты на отлично", earned: false },
                    ].map((achievement, index) => (
                      <div 
                        key={index} 
                        className={`p-4 rounded-lg border ${
                          achievement.earned 
                            ? "border-primary bg-primary/10" 
                            : "border-muted bg-muted/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Award className={`h-6 w-6 ${
                            achievement.earned ? "text-primary" : "text-muted-foreground"
                          }`} />
                          <div>
                            <h4 className="font-semibold">{achievement.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {achievement.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="mt-8">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Уведомления
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { title: "Email уведомления", description: "Получать уведомления на почту", enabled: true },
                    { title: "Push уведомления", description: "Уведомления в браузере", enabled: false },
                    { title: "Напоминания о занятиях", description: "Напоминать о запланированных уроках", enabled: true },
                    { title: "Новости и обновления", description: "Информация о новых курсах и функциях", enabled: true },
                  ].map((setting, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div>
                        <h4 className="font-semibold">{setting.title}</h4>
                        <p className="text-sm text-muted-foreground">{setting.description}</p>
                      </div>
                      <Button 
                        variant={setting.enabled ? "default" : "outline"}
                        size="sm"
                      >
                        {setting.enabled ? "Включено" : "Выключено"}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="mt-8">
              <div className="space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      Изменить пароль
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Текущий пароль</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Новый пароль</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    <Button className="gradient-primary">
                      Обновить пароль
                    </Button>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Безопасность аккаунта
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Двухфакторная аутентификация</h4>
                        <p className="text-sm text-muted-foreground">
                          Дополнительная защита вашего аккаунта
                        </p>
                      </div>
                      <Button variant="outline">Настроить</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-red-400">Удалить аккаунт</h4>
                        <p className="text-sm text-muted-foreground">
                          Это действие нельзя отменить
                        </p>
                      </div>
                      <Button variant="destructive">Удалить</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
