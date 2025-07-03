import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getAuthHeaders } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  DollarSign,
  Plus,
  Edit,
  Trash,
  Eye,
  Download,
  Filter,
  Search
} from "lucide-react";

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
    queryFn: async () => {
      const response = await fetch("/api/admin/stats", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch stats");
      return await response.json();
    },
  });

  const { data: leads } = useQuery({
    queryKey: ["/api/leads"],
    queryFn: async () => {
      const response = await fetch("/api/leads", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch leads");
      return await response.json();
    },
  });

  const { data: courses } = useQuery({
    queryKey: ["/api/courses"],
    queryFn: async () => {
      const response = await fetch("/api/courses", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch courses");
      return await response.json();
    },
  });

  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update lead");
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Лид обновлен",
        description: "Статус лида успешно изменен",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
    },
  });

  const generateQuizMutation = useMutation({
    mutationFn: async ({ topic, difficulty, questionCount }: { topic: string; difficulty: string; questionCount: number }) => {
      const response = await fetch("/api/ai/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ topic, difficulty, questionCount }),
      });
      if (!response.ok) throw new Error("Failed to generate quiz");
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Тест создан",
        description: "ИИ успешно сгенерировал новый тест",
      });
    },
  });

  const filteredLeads = leads?.filter((lead: any) => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-500/20 text-blue-400";
      case "contacted": return "bg-yellow-500/20 text-yellow-400";
      case "converted": return "bg-green-500/20 text-green-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Панель администратора</h1>
          <p className="text-muted-foreground">
            Управление платформой и мониторинг ключевых метрик
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Всего пользователей</p>
                  <p className="text-2xl font-bold gradient-text">1,247</p>
                  <p className="text-xs text-green-400">+12% за месяц</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Активных курсов</p>
                  <p className="text-2xl font-bold gradient-text">{courses?.length || 0}</p>
                  <p className="text-xs text-green-400">+3 новых</p>
                </div>
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Доход за месяц</p>
                  <p className="text-2xl font-bold gradient-text">₽2,847,000</p>
                  <p className="text-xs text-green-400">+18% за месяц</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Конверсия лидов</p>
                  <p className="text-2xl font-bold gradient-text">24.3%</p>
                  <p className="text-xs text-red-400">-2.1% за неделю</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="leads" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="leads">Лиды</TabsTrigger>
            <TabsTrigger value="courses">Курсы</TabsTrigger>
            <TabsTrigger value="users">Пользователи</TabsTrigger>
            <TabsTrigger value="analytics">Аналитика</TabsTrigger>
            <TabsTrigger value="ai-tools">ИИ Инструменты</TabsTrigger>
          </TabsList>
          
          <TabsContent value="leads" className="mt-8">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Управление лидами</CardTitle>
                  <Button className="gradient-primary">
                    <Download className="h-4 w-4 mr-2" />
                    Экспорт
                  </Button>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Поиск лидов..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Статус" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все статусы</SelectItem>
                      <SelectItem value="new">Новые</SelectItem>
                      <SelectItem value="contacted">Связались</SelectItem>
                      <SelectItem value="converted">Конвертированы</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Имя</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Телефон</TableHead>
                      <TableHead>Класс</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Дата</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads?.map((lead: any) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.name}</TableCell>
                        <TableCell>{lead.email}</TableCell>
                        <TableCell>{lead.phone}</TableCell>
                        <TableCell>{lead.grade}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(lead.status)}>
                            {lead.status === "new" ? "Новый" :
                             lead.status === "contacted" ? "Связались" :
                             lead.status === "converted" ? "Конвертирован" : lead.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(lead.createdAt).toLocaleDateString("ru-RU")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Select
                              value={lead.status}
                              onValueChange={(status) => updateLeadMutation.mutate({ id: lead.id, status })}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">Новый</SelectItem>
                                <SelectItem value="contacted">Связались</SelectItem>
                                <SelectItem value="converted">Конвертирован</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="courses" className="mt-8">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Управление курсами</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="gradient-primary">
                        <Plus className="h-4 w-4 mr-2" />
                        Создать курс
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Создание нового курса</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input placeholder="Название курса" />
                        <Input placeholder="Описание" />
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Предмет" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="math">Математика</SelectItem>
                            <SelectItem value="russian">Русский язык</SelectItem>
                            <SelectItem value="physics">Физика</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input placeholder="Цена (₽)" type="number" />
                        <Button className="w-full gradient-primary">
                          Создать курс
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Название</TableHead>
                      <TableHead>Предмет</TableHead>
                      <TableHead>Преподаватель</TableHead>
                      <TableHead>Студентов</TableHead>
                      <TableHead>Цена</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses?.map((course: any) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.title}</TableCell>
                        <TableCell>{course.subject}</TableCell>
                        <TableCell>Преподаватель</TableCell>
                        <TableCell>156</TableCell>
                        <TableCell>₽{course.price}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500/20 text-green-400">
                            Активный
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="mt-8">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Управление пользователями</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Здесь будет список всех пользователей платформы
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Активность пользователей</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
                    <p className="text-muted-foreground">График активности</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Доходы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
                    <p className="text-muted-foreground">График доходов</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="ai-tools" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Генерация тестов ИИ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="Тема теста" />
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Уровень сложности" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Легкий</SelectItem>
                      <SelectItem value="medium">Средний</SelectItem>
                      <SelectItem value="hard">Сложный</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Количество вопросов" type="number" defaultValue="5" />
                  <Button 
                    className="w-full gradient-primary"
                    onClick={() => generateQuizMutation.mutate({
                      topic: "Математика",
                      difficulty: "medium",
                      questionCount: 5
                    })}
                    disabled={generateQuizMutation.isPending}
                  >
                    {generateQuizMutation.isPending ? "Генерация..." : "Создать тест"}
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Аналитика ИИ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-semibold mb-2">Использование ИИ-ассистента</h4>
                      <p className="text-sm text-muted-foreground">
                        За последние 30 дней: 2,847 запросов
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-semibold mb-2">Точность прогнозов</h4>
                      <p className="text-sm text-muted-foreground">
                        Средняя точность: 87.3%
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-semibold mb-2">Популярные темы</h4>
                      <p className="text-sm text-muted-foreground">
                        1. Квадратные уравнения<br />
                        2. Тригонометрия<br />
                        3. Производные
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
