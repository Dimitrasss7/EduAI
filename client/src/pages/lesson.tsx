import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useState } from "react";
import Header from "@/components/header";
import VideoPlayer from "@/components/video-player";
import QuizComponent from "@/components/quiz-component";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAuthHeaders } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  Download, 
  PlayCircle,
  BookOpen,
  MessageCircle
} from "lucide-react";

export default function Lesson() {
  const { id } = useParams<{ id: string }>();
  const [watchTime, setWatchTime] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: lesson, isLoading } = useQuery({
    queryKey: ["/api/lessons", id],
    queryFn: async () => {
      const response = await fetch(`/api/lessons/${id}`);
      if (!response.ok) throw new Error("Failed to fetch lesson");
      return await response.json();
    },
  });

  const { data: quizzes } = useQuery({
    queryKey: ["/api/lessons", id, "quizzes"],
    queryFn: async () => {
      const response = await fetch(`/api/lessons/${id}/quizzes`);
      if (!response.ok) throw new Error("Failed to fetch quizzes");
      return await response.json();
    },
    enabled: !!id,
  });

  const updateProgressMutation = useMutation({
    mutationFn: async (data: { watchTime: number; isCompleted: boolean }) => {
      const response = await fetch(`/api/lessons/${id}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error("Failed to update progress");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/my-enrollments"] });
    },
  });

  const handleVideoProgress = (currentTime: number, duration: number) => {
    setWatchTime(currentTime);
    
    // Auto-save progress every 30 seconds
    if (Math.floor(currentTime) % 30 === 0) {
      updateProgressMutation.mutate({
        watchTime: Math.floor(currentTime),
        isCompleted: currentTime / duration > 0.9, // 90% completion
      });
    }
  };

  const handleCompleteLesson = () => {
    updateProgressMutation.mutate({
      watchTime: Math.floor(watchTime),
      isCompleted: true,
    });
    
    toast({
      title: "Урок завершен!",
      description: "Ваш прогресс сохранен. Переходите к следующему уроку.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="skeleton h-96 w-full rounded mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="skeleton h-64 w-full rounded"></div>
            </div>
            <div className="skeleton h-64 w-full rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="glass-card">
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Урок не найден</h1>
              <p className="text-muted-foreground mb-6">
                Возможно, урок был удален или вы перешли по неверной ссылке
              </p>
              <Button onClick={() => window.history.back()}>
                Вернуться назад
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Lesson Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              Урок {lesson.order}
            </Badge>
            <Badge variant="outline">
              {lesson.duration} мин
            </Badge>
          </div>
          <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>
          <p className="text-muted-foreground text-lg">{lesson.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="video" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="video" className="flex items-center gap-2">
                  <PlayCircle className="h-4 w-4" />
                  Видео
                </TabsTrigger>
                <TabsTrigger value="materials" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Материалы
                </TabsTrigger>
                <TabsTrigger value="quiz" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Тест
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="video" className="mt-6">
                <Card className="glass-card">
                  <CardContent className="p-6">
                    <VideoPlayer
                      src={lesson.videoUrl || "/placeholder-video.mp4"}
                      onProgress={handleVideoProgress}
                      onEnded={() => handleCompleteLesson()}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="materials" className="mt-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Материалы урока
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {lesson.content ? (
                      <div className="prose prose-invert max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        Дополнительные материалы для этого урока пока недоступны.
                      </p>
                    )}
                    
                    <div className="mt-6 space-y-3">
                      <h4 className="font-semibold">Файлы для скачивания:</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">Конспект урока</p>
                              <p className="text-sm text-muted-foreground">PDF, 2.5 MB</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Скачать
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">Дополнительные задания</p>
                              <p className="text-sm text-muted-foreground">PDF, 1.8 MB</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Скачать
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="quiz" className="mt-6">
                {quizzes && quizzes.length > 0 ? (
                  <QuizComponent quizzes={quizzes} />
                ) : (
                  <Card className="glass-card">
                    <CardContent className="p-8 text-center">
                      <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-semibold mb-2">Тест не найден</h3>
                      <p className="text-muted-foreground">
                        Тест для этого урока пока не создан. Вернитесь позже.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Прогресс
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Просмотрено</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      Время просмотра: {Math.floor(watchTime / 60)}:{(watchTime % 60).toString().padStart(2, '0')}
                    </p>
                    <Button 
                      onClick={handleCompleteLesson}
                      className="w-full gradient-primary"
                      disabled={updateProgressMutation.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Завершить урок
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes Card */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Заметки
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  className="w-full h-32 p-3 bg-muted/30 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Записывайте важные моменты..."
                />
                <Button size="sm" className="mt-3 w-full">
                  Сохранить заметки
                </Button>
              </CardContent>
            </Card>

            {/* Next Lesson Card */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Следующий урок</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-semibold">Урок {lesson.order + 1}</h4>
                  <p className="text-sm text-muted-foreground">
                    Продолжение изучения темы
                  </p>
                  <Button className="w-full mt-4" variant="outline">
                    Перейти к уроку
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
