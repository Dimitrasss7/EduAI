import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getAuthHeaders } from "@/lib/auth";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Trophy, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ["/api/my-enrollments"],
    queryFn: async () => {
      const response = await fetch("/api/my-enrollments", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch enrollments");
      return await response.json();
    },
  });

  const { data: progressAnalysis } = useQuery({
    queryKey: ["/api/ai/analyze-progress"],
    queryFn: async () => {
      if (!enrollments?.length) return null;
      
      const response = await fetch("/api/ai/analyze-progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          completedLessons: 12,
          totalLessons: 20,
          quizScores: [85, 92, 78, 90],
          timeSpent: 45,
        }),
      });
      
      if (!response.ok) throw new Error("Failed to analyze progress");
      return await response.json();
    },
    enabled: !!enrollments?.length,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="glass-card">
                <CardContent className="p-6">
                  <div className="skeleton h-16 w-full rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Добро пожаловать, {user?.firstName || user?.email}!
          </h1>
          <p className="text-muted-foreground">
            Продолжайте свой путь к высоким баллам
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Активных курсов</p>
                  <p className="text-2xl font-bold gradient-text">
                    {enrollments?.length || 0}
                  </p>
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
                  <p className="text-sm text-muted-foreground">Средний балл</p>
                  <p className="text-2xl font-bold gradient-text">86</p>
                </div>
                <Trophy className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Прогноз ЕГЭ</p>
                  <p className="text-2xl font-bold gradient-text">
                    {progressAnalysis?.predictedScore || 87}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Course Progress */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Прогресс по курсам</CardTitle>
            </CardHeader>
            <CardContent>
              {enrollments?.length > 0 ? (
                <div className="space-y-4">
                  {enrollments.map((enrollment: any) => (
                    <div key={enrollment.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Курс #{enrollment.courseId.slice(-6)}</span>
                        <span>{enrollment.progress}%</span>
                      </div>
                      <Progress value={enrollment.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    У вас пока нет активных курсов
                  </p>
                  <Button asChild className="gradient-primary">
                    <Link href="/courses">Выбрать курс</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Analysis */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Анализ ИИ</CardTitle>
            </CardHeader>
            <CardContent>
              {progressAnalysis ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Анализ прогресса</h4>
                    <p className="text-sm text-muted-foreground">
                      {progressAnalysis.progressAnalysis}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Рекомендации</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {progressAnalysis.recommendations.map((rec: string, index: number) => (
                        <li key={index}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Начните обучение, чтобы получить персональные рекомендации ИИ
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
