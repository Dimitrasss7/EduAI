import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useState } from "react";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { getAuthHeaders } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { 
  Clock, 
  Users, 
  BookOpen, 
  Star, 
  Play, 
  CheckCircle,
  DollarSign,
  Calendar,
  Award,
  Target
} from "lucide-react";

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: course, isLoading } = useQuery({
    queryKey: ["/api/courses", id],
    queryFn: async () => {
      const response = await fetch(`/api/courses/${id}`);
      if (!response.ok) throw new Error("Failed to fetch course");
      return await response.json();
    },
  });

  const { data: lessons } = useQuery({
    queryKey: ["/api/courses", id, "lessons"],
    queryFn: async () => {
      const response = await fetch(`/api/courses/${id}/lessons`);
      if (!response.ok) throw new Error("Failed to fetch lessons");
      return await response.json();
    },
    enabled: !!id,
  });

  const { data: enrollment } = useQuery({
    queryKey: ["/api/my-enrollments", id],
    queryFn: async () => {
      const response = await fetch("/api/my-enrollments", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch enrollments");
      const enrollments = await response.json();
      return enrollments.find((e: any) => e.courseId === id);
    },
    enabled: !!user && !!id,
  });

  const enrollMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ courseId: id }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Успешно!",
        description: "Вы записались на курс. Можете начинать обучение!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/my-enrollments"] });
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось записаться на курс",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="skeleton h-64 w-full rounded mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="skeleton h-96 w-full rounded"></div>
            </div>
            <div className="skeleton h-96 w-full rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="glass-card">
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Курс не найден</h1>
              <p className="text-muted-foreground mb-6">
                Возможно, курс был удален или вы перешли по неверной ссылке
              </p>
              <Button onClick={() => setLocation("/courses")}>
                Вернуться к каталогу
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isEnrolled = !!enrollment;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-dark relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  {course.subject}
                </Badge>
                <Badge variant="outline">
                  {course.level}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {course.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                {course.description}
              </p>
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-5 w-5" />
                  <span>{course.duration}ч</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="h-5 w-5" />
                  <span>{lessons?.length || 0} уроков</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-5 w-5" />
                  <span>156 студентов</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span>4.9 (89 отзывов)</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                    <Play className="h-16 w-16 text-primary" />
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-3xl font-bold gradient-text">
                        {course.price}₽
                      </span>
                      <span className="text-sm text-muted-foreground">/месяц</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                      Скидка 30%
                    </Badge>
                  </div>
                  
                  {isAuthenticated ? (
                    isEnrolled ? (
                      <div className="space-y-4">
                        <Button 
                          className="w-full gradient-primary"
                          onClick={() => setLocation("/dashboard")}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Перейти к обучению
                        </Button>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">
                            Прогресс: {enrollment.progress}%
                          </p>
                        </div>
                      </div>
                    ) : (
                      <Button 
                        className="w-full gradient-primary"
                        onClick={() => enrollMutation.mutate()}
                        disabled={enrollMutation.isPending}
                      >
                        {enrollMutation.isPending ? "Записываем..." : "Записаться на курс"}
                      </Button>
                    )
                  ) : (
                    <Button 
                      className="w-full gradient-primary"
                      onClick={() => setLocation("/auth/login")}
                    >
                      Войти для записи
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Course Details */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Обзор</TabsTrigger>
              <TabsTrigger value="curriculum">Программа</TabsTrigger>
              <TabsTrigger value="instructor">Преподаватель</TabsTrigger>
              <TabsTrigger value="reviews">Отзывы</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Что вы изучите</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                          <span className="text-sm">Основы предмета от А до Я</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                          <span className="text-sm">Разбор сложных заданий</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                          <span className="text-sm">Практические тесты</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                          <span className="text-sm">Стратегии сдачи экзамена</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Результаты
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold gradient-text mb-2">80+</div>
                          <p className="text-sm text-muted-foreground">Средний балл выпускников</p>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold gradient-text mb-2">95%</div>
                          <p className="text-sm text-muted-foreground">Успешно сдают экзамен</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Преимущества
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• Сертификат о прохождении</li>
                        <li>• Пожизненный доступ</li>
                        <li>• Материалы для скачивания</li>
                        <li>• Поддержка ИИ-ассистента</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="curriculum" className="mt-8">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Программа курса</CardTitle>
                </CardHeader>
                <CardContent>
                  {lessons?.length > 0 ? (
                    <div className="space-y-4">
                      {lessons.map((lesson: any, index: number) => (
                        <div key={lesson.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-semibold">
                                {index + 1}
                              </div>
                              <div>
                                <h4 className="font-semibold">{lesson.title}</h4>
                                <p className="text-sm text-muted-foreground">{lesson.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm">{lesson.duration}мин</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground">
                      Уроки будут добавлены в ближайшее время
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="instructor" className="mt-8">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Преподаватель</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback>ПР</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Преподаватель курса</h3>
                      <p className="text-muted-foreground mb-4">
                        Опытный специалист с 7+ лет преподавания. Помог сотням студентов достичь высоких результатов.
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>1,200+ студентов</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span>4.9 рейтинг</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>12 курсов</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-8">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Отзывы студентов</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      {
                        name: "Алексей К.",
                        rating: 5,
                        comment: "Отличный курс! Преподаватель объясняет сложные темы простым языком.",
                        result: "Математика: 92 балла"
                      },
                      {
                        name: "Мария С.",
                        rating: 5,
                        comment: "Благодаря этому курсу смогла значительно повысить свои знания и получить высокий балл.",
                        result: "Русский: 89 баллов"
                      },
                      {
                        name: "Дмитрий П.",
                        rating: 4,
                        comment: "Хорошая подача материала, много практических заданий.",
                        result: "Физика: 85 баллов"
                      }
                    ].map((review, index) => (
                      <div key={index} className="border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{review.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="font-semibold">{review.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-muted-foreground'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                        <Badge variant="secondary" className="text-xs">
                          {review.result}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
