import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Bot, 
  TrendingUp, 
  Brain, 
  Bug, 
  Gamepad2, 
  Users, 
  BarChart3,
  Target,
  Repeat,
  Zap,
  Trophy,
  MessageCircle
} from "lucide-react";

export default function PlatformFeatures() {
  const features = [
    {
      icon: Bot,
      title: "ИИ-Ассистент",
      description: "Персональный помощник на базе GEMINI API отвечает на вопросы 24/7, помогает с домашними заданиями и объясняет сложные темы",
      color: "gradient-primary",
      demo: (
        <div className="bg-background/50 rounded-xl p-4 space-y-3">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center">
              <Bot className="h-3 w-3 text-white" />
            </div>
            <div className="bg-muted/80 rounded-lg p-2 text-xs">
              Объясни производную функции
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">У</AvatarFallback>
            </Avatar>
            <div className="bg-primary/20 rounded-lg p-2 text-xs">
              Производная показывает скорость изменения функции...
            </div>
          </div>
        </div>
      )
    },
    {
      icon: BarChart3,
      title: "Прогноз среднего балла",
      description: "Платформа анализирует ваши ответы, ДЗ, тесты и прогнозирует средний балл, создавая персональный план подготовки",
      color: "gradient-secondary",
      demo: (
        <div className="bg-background/50 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted-foreground">Прогноз ЕГЭ</span>
            <span className="text-2xl font-bold gradient-text">87</span>
          </div>
          <Progress value={87} className="h-2 mb-2" />
          <div className="text-xs text-green-400">+5 баллов за месяц</div>
        </div>
      )
    },
    {
      icon: Brain,
      title: "Система повторения",
      description: "Алгоритм запоминания построен на научных исследованиях. Система автоматически подбирает материал для повторения",
      color: "gradient-accent",
      demo: (
        <div className="bg-background/50 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span>Квадратные уравнения</span>
            <Badge variant="secondary" className="text-xs">Повторить</Badge>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span>Тригонометрия</span>
            <Badge variant="secondary" className="text-xs bg-green-500/20">Изучено</Badge>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span>Производные</span>
            <Badge variant="secondary" className="text-xs bg-yellow-500/20">Завтра</Badge>
          </div>
        </div>
      )
    },
    {
      icon: Bug,
      title: "Отработка ошибок",
      description: "Платформа анализирует все ошибки и составляет персональные тесты для их отработки",
      color: "gradient-primary",
      demo: (
        <div className="bg-background/50 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs p-2 bg-red-500/10 rounded">
            <span>Квадратные уравнения</span>
            <span className="text-red-400">3 ошибки</span>
          </div>
          <div className="flex items-center justify-between text-xs p-2 bg-yellow-500/10 rounded">
            <span>Тригонометрия</span>
            <span className="text-yellow-400">1 ошибка</span>
          </div>
          <div className="flex items-center justify-between text-xs p-2 bg-green-500/10 rounded">
            <span>Логарифмы</span>
            <span className="text-green-400">0 ошибок</span>
          </div>
        </div>
      )
    },
    {
      icon: Gamepad2,
      title: "Геймификация",
      description: "Создай своего персонажа, зарабатывай очки, соревнуйся с друзьями и получай достижения за прогресс",
      color: "gradient-secondary",
      demo: (
        <div className="bg-background/50 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 gradient-accent rounded-full flex items-center justify-center">
              <Trophy className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold">Уровень 15</div>
              <div className="text-xs text-muted-foreground">2,450 XP</div>
            </div>
          </div>
          <Progress value={65} className="h-2" />
        </div>
      )
    },
    {
      icon: Users,
      title: "Сообщество",
      description: "Общайся с единомышленниками, создавай команды, участвуй в челленджах и получай поддержку",
      color: "gradient-accent",
      demo: (
        <div className="bg-background/50 rounded-xl p-4">
          <div className="flex -space-x-2 mb-2">
            {[1, 2, 3].map((i) => (
              <Avatar key={i} className="h-6 w-6 border-2 border-background">
                <AvatarFallback className="text-xs">{i}</AvatarFallback>
              </Avatar>
            ))}
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs text-white font-bold">
              +47
            </div>
          </div>
          <div className="text-xs text-muted-foreground">Участников онлайн</div>
        </div>
      )
    }
  ];

  const additionalFeatures = [
    {
      icon: Target,
      title: "Все на одной платформе",
      description: "На платформе ты можешь изучать теорию, проходить тесты, общаться с друзьями"
    },
    {
      icon: Repeat,
      title: "Отслеживание прогресса",
      description: "На платформе ты сможешь следить за своим прогрессом, как быстро ты движешься к цели"
    },
    {
      icon: Zap,
      title: "Персонализация",
      description: "ИИ анализирует ваш стиль обучения и адаптирует материал под ваши потребности"
    }
  ];

  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Платформа, которая сделает <span className="gradient-text">подготовку эффективной</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Современные технологии ИИ для персонализированного обучения и быстрого достижения результатов
          </p>
        </div>

        {/* Platform Preview */}
        <div className="mb-16">
          <Card className="glass-card overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                {/* Browser-like interface */}
                <div className="bg-muted/50 px-4 py-3 flex items-center gap-2 border-b border-border">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex-1 text-center text-sm text-muted-foreground">
                    eduai.ru - Интеллектуальная платформа обучения
                  </div>
                </div>
                
                {/* Platform interface mockup */}
                <div className="p-8 bg-gradient-to-br from-background via-background to-muted/30">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Dashboard */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="bg-muted/30 rounded-lg p-4">
                        <h3 className="font-semibold mb-2">Ваш прогресс сегодня</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-2xl font-bold gradient-text">3</div>
                            <div className="text-xs text-muted-foreground">урока пройдено</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold gradient-text">87%</div>
                            <div className="text-xs text-muted-foreground">средний результат</div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/30 rounded-lg p-3">
                          <div className="text-sm font-medium mb-1">Математика</div>
                          <Progress value={75} className="h-1" />
                        </div>
                        <div className="bg-muted/30 rounded-lg p-3">
                          <div className="text-sm font-medium mb-1">Физика</div>
                          <Progress value={60} className="h-1" />
                        </div>
                      </div>
                    </div>
                    
                    {/* AI Chat */}
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Bot className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">ИИ-Ассистент</span>
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="bg-primary/20 rounded p-2">
                          Есть вопрос по производным?
                        </div>
                        <div className="bg-muted rounded p-2 text-right">
                          Да, как найти производную сложной функции?
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="glass-card course-card">
                <CardHeader>
                  <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="gradient-text">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {feature.description}
                  </p>
                  {feature.demo}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Features */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-8">
            И это <span className="gradient-text">еще не все возможности</span>
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="glass-card text-center">
                  <CardContent className="p-6">
                    <Icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h4 className="font-semibold mb-2 gradient-text">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="text-center">
          <Card className="glass-card">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6">
                Результаты говорят сами за себя
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-3xl font-bold gradient-text mb-2">98%</div>
                  <div className="text-sm text-muted-foreground">Точность ИИ-прогнозов</div>
                </div>
                <div>
                  <div className="text-3xl font-bold gradient-text mb-2">45мин</div>
                  <div className="text-sm text-muted-foreground">Среднее время ответа ИИ</div>
                </div>
                <div>
                  <div className="text-3xl font-bold gradient-text mb-2">24/7</div>
                  <div className="text-sm text-muted-foreground">Доступность поддержки</div>
                </div>
                <div>
                  <div className="text-3xl font-bold gradient-text mb-2">15сек</div>
                  <div className="text-sm text-muted-foreground">Время загрузки</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
