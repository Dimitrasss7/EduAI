import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Award, 
  CheckCircle, 
  AlertCircle,
  BookOpen,
  Brain,
  Trophy,
  Calendar,
  Zap,
  BarChart3
} from "lucide-react";

interface ProgressTrackerProps {
  userId?: string;
  courseId?: string;
  data?: {
    overallProgress: number;
    completedLessons: number;
    totalLessons: number;
    averageScore: number;
    timeSpent: number;
    predictedScore: number;
    streak: number;
    achievements: string[];
  };
}

export default function ProgressTracker({ 
  userId, 
  courseId, 
  data = {
    overallProgress: 67,
    completedLessons: 12,
    totalLessons: 18,
    averageScore: 85,
    timeSpent: 45,
    predictedScore: 87,
    streak: 7,
    achievements: ["Первые 10 уроков", "Неделя подряд", "Средний балл 80+"]
  }
}: ProgressTrackerProps) {

  const subjects = [
    { name: "Математика", progress: 75, score: 87, color: "text-blue-400" },
    { name: "Русский язык", progress: 60, score: 82, color: "text-green-400" },
    { name: "Физика", progress: 45, score: 78, color: "text-purple-400" }
  ];

  const weeklyProgress = [
    { day: "Пн", lessons: 2, time: 120 },
    { day: "Вт", lessons: 1, time: 60 },
    { day: "Ср", lessons: 3, time: 180 },
    { day: "Чт", lessons: 2, time: 140 },
    { day: "Пт", lessons: 1, time: 80 },
    { day: "Сб", lessons: 0, time: 0 },
    { day: "Вс", lessons: 2, time: 160 }
  ];

  const upcomingDeadlines = [
    { task: "Тест по квадратным уравнениям", date: "Завтра", priority: "high" },
    { task: "Домашнее задание по литературе", date: "3 дня", priority: "medium" },
    { task: "Пробный ЕГЭ по математике", date: "1 неделя", priority: "high" }
  ];

  const recommendations = [
    "Уделите больше внимания тригонометрии",
    "Повторите правила пунктуации",
    "Практикуйте решение задач на движение"
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Общий прогресс</p>
                <p className="text-2xl font-bold gradient-text">{data.overallProgress}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <Progress value={data.overallProgress} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Уроков пройдено</p>
                <p className="text-2xl font-bold gradient-text">
                  {data.completedLessons}/{data.totalLessons}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <Progress value={(data.completedLessons / data.totalLessons) * 100} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Средний балл</p>
                <p className="text-2xl font-bold gradient-text">{data.averageScore}</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Badge className="bg-green-500/20 text-green-400">
                +5 за неделю
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Прогноз ЕГЭ</p>
                <p className="text-2xl font-bold gradient-text">{data.predictedScore}</p>
              </div>
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Badge className="bg-blue-500/20 text-blue-400">
                ИИ-анализ
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject Progress */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Прогресс по предметам
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {subjects.map((subject, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-current ${subject.color}`}></div>
                    <span className="font-medium">{subject.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      {subject.score} баллов
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {subject.progress}%
                    </span>
                  </div>
                </div>
                <Progress value={subject.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Study Streak & Achievements */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Достижения
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Streak */}
            <div className="text-center p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-orange-400" />
              <div className="text-2xl font-bold gradient-text">{data.streak}</div>
              <div className="text-sm text-muted-foreground">дней подряд</div>
            </div>

            {/* Achievements List */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Последние достижения:</h4>
              {data.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                  <Award className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm">{achievement}</span>
                </div>
              ))}
            </div>

            {/* Time Spent */}
            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Время обучения</span>
                <span className="font-semibold">{data.timeSpent}ч</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>В среднем 1.5ч в день</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Активность за неделю
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {weeklyProgress.map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">{day.day}</div>
                  <div 
                    className="h-20 bg-primary/20 rounded flex flex-col items-center justify-end p-1 relative"
                    style={{ 
                      background: day.lessons > 0 
                        ? `linear-gradient(to top, hsl(var(--primary)) ${(day.lessons / 3) * 100}%, transparent 0)` 
                        : 'rgb(var(--muted) / 0.3)' 
                    }}
                  >
                    <div className="text-xs font-semibold text-white">
                      {day.lessons || '-'}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {day.time ? `${day.time}м` : '-'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines & Recommendations */}
        <div className="space-y-6">
          {/* Deadlines */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Ближайшие дедлайны
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingDeadlines.map((deadline, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{deadline.task}</p>
                    <p className="text-xs text-muted-foreground">{deadline.date}</p>
                  </div>
                  <Badge 
                    className={
                      deadline.priority === "high" 
                        ? "bg-red-500/20 text-red-400" 
                        : "bg-yellow-500/20 text-yellow-400"
                    }
                  >
                    {deadline.priority === "high" ? "Важно" : "Обычно"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Рекомендации ИИ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{recommendation}</span>
                </div>
              ))}
              <Button className="w-full gradient-primary" size="sm">
                Получить детальный анализ
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
