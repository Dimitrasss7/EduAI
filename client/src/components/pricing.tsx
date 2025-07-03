import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { 
  Check, 
  Star, 
  Crown, 
  Zap, 
  Gift,
  Users,
  BookOpen,
  Brain,
  MessageCircle,
  Trophy,
  Heart,
  Shield
} from "lucide-react";

export default function Pricing() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  const plans = [
    {
      name: "2 предмета",
      subtitle: "База. Всё нужное — без фанатизма",
      description: "Просто, понятно, стабильно. Как чай с булочкой на перемене",
      monthlyPrice: 8390,
      originalPrice: 10980,
      annualPrice: 75510, // 9 months price
      discount: 27,
      color: "border-muted",
      buttonStyle: "variant-outline",
      icon: BookOpen,
      popular: false,
      features: [
        "8-10 уроков в месяц в записи",
        "2-3 домашки в неделю с проверкой от наставника",
        "Учебные материалы (Скрипты и библиотека файлов)",
        "Личный наставник с мотивацией",
        "Индивидуальный план подготовки на 80+ баллов",
        "Онлайн платформа с аналитикой и трекингом",
        "Система повторения материала и зачеты",
        "Онлайн-тренажеры для отработки заданий",
        "Пробники с проверкой и обратной связью",
        "Доступ к закрытым спец. курсам",
        "Клан с единомышленниками со всей России"
      ],
      bonuses: [
        "Доступ к сервису «EL — Дай списать»",
        "Курс по профориентации",
        "ИИ-ассистент 24/7"
      ]
    },
    {
      name: "3 предмета",
      subtitle: "Прокачанная версия.",
      description: "Когда хочется немного больше уверенности",
      monthlyPrice: 11590,
      originalPrice: 16470,
      annualPrice: 104310, // 9 months price
      discount: 33,
      color: "border-primary",
      buttonStyle: "gradient-primary",
      icon: Brain,
      popular: true,
      features: [
        "Всё что есть в тарифе «2 предмета»",
        "Курс по Итоговому сочинению",
        "Поддержка психолога в борьбе с тревогой и стрессом",
        "Помощь с апелляционной комиссией после экзамена",
        "Курс по поступлению в ВУЗ",
        "Приоритетная поддержка",
        "Дополнительные мастер-классы"
      ],
      bonuses: [
        "Все бонусы тарифа «2 предмета»",
        "Персональные консультации с психологом",
        "Индивидуальная работа с куратором"
      ]
    },
    {
      name: "4 предмета",
      subtitle: "Всё, что можно.",
      description: "И ещё сверху. Как бизнес-класс, только в образовании",
      monthlyPrice: 14790,
      originalPrice: 21960,
      annualPrice: 133110, // 9 months price
      discount: 36,
      color: "border-accent",
      buttonStyle: "gradient-accent",
      icon: Crown,
      popular: false,
      features: [
        "Всё что есть в тарифе «3 предмета»",
        "Индивидуальные консультации с преподавателями",
        "VIP-поддержка в приоритетном порядке",
        "Персональные разборы ошибок",
        "Доступ к эксклюзивным материалам",
        "Личный успех-менеджер",
        "Guaranteed результат или возврат средств"
      ],
      bonuses: [
        "Все бонусы предыдущих тарифов",
        "Персональный коучинг",
        "Премиум доступ ко всем функциям платформы"
      ]
    }
  ];

  const commonFeatures = [
    "Уроки, материалы, скрипты",
    "Умную платформу с прогрессом", 
    "Поддержку и комьюнити"
  ];

  const handleSelectPlan = (planName: string) => {
    if (!isAuthenticated) {
      setLocation("/auth/register");
      return;
    }
    // Redirect to course selection or payment
    setLocation("/courses");
  };

  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Выбери тариф <span className="gradient-text">подготовки</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Все тарифы включают основные функции для эффективной подготовки к экзаменам
          </p>

          {/* Common Features */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-full">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm">Уроки и материалы</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-full">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-sm">ИИ-платформа</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-full">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm">Сообщество</span>
            </div>
          </div>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-muted/30 rounded-full p-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === "monthly" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Помесячно
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === "annual" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Годовой курс
              <Badge className="ml-2 bg-green-500/20 text-green-400 text-xs">
                Экономия 25%
              </Badge>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const currentPrice = billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice;
            const originalPrice = billingCycle === "monthly" ? plan.originalPrice : plan.originalPrice * 12;
            
            return (
              <Card 
                key={index} 
                className={`glass-card hover:bg-white/10 transition-all duration-300 course-card relative ${
                  plan.popular ? "ring-2 ring-primary" : ""
                } ${plan.color}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1 font-bold">
                      <Star className="h-3 w-3 mr-1" />
                      Рекомендуем
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <p className="text-muted-foreground mb-4">{plan.subtitle}</p>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-sm text-muted-foreground line-through">
                        {originalPrice.toLocaleString("ru-RU")} ₽
                      </span>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                        -{plan.discount}%
                      </Badge>
                    </div>
                    <div className="text-4xl font-bold gradient-text">
                      {currentPrice.toLocaleString("ru-RU")}₽
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {billingCycle === "monthly" ? "в месяц" : "за весь курс"}
                    </p>
                  </div>
                  
                  <p className="text-sm text-muted-foreground italic">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Bonuses */}
                  {plan.bonuses.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Gift className="h-4 w-4 text-primary" />
                        Бонусы:
                      </h4>
                      <ul className="space-y-2">
                        {plan.bonuses.map((bonus, bonusIndex) => (
                          <li key={bonusIndex} className="flex items-start gap-2 text-sm">
                            <div className="w-4 h-4 bg-primary/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                              <Gift className="h-2.5 w-2.5 text-primary" />
                            </div>
                            <span className="text-muted-foreground">{bonus}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Features */}
                  <div>
                    <h4 className="font-semibold mb-3">Включено:</h4>
                    <ul className="space-y-2">
                      {plan.features.slice(0, 5).map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                      {plan.features.length > 5 && (
                        <details className="group">
                          <summary className="cursor-pointer text-sm text-primary hover:underline">
                            Показать еще ({plan.features.length - 5})
                          </summary>
                          <ul className="space-y-2 mt-2">
                            {plan.features.slice(5).map((feature, featureIndex) => (
                              <li key={featureIndex + 5} className="flex items-start gap-2 text-sm">
                                <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                                <span className="text-muted-foreground">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </details>
                      )}
                    </ul>
                  </div>

                  <Button
                    onClick={() => handleSelectPlan(plan.name)}
                    className={`w-full h-12 text-lg font-semibold ${
                      plan.buttonStyle === "gradient-primary" ? "gradient-primary" :
                      plan.buttonStyle === "gradient-accent" ? "gradient-accent" :
                      ""
                    }`}
                    variant={plan.buttonStyle === "variant-outline" ? "outline" : "default"}
                  >
                    {isAuthenticated ? "Выбрать тариф" : "Купить курс"}
                  </Button>

                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      {billingCycle === "monthly" ? "Можно отменить в любое время" : "Фиксированная цена на весь курс"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="text-center mb-16">
          <Card className="glass-card max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6">
                Летняя школа <span className="gradient-text">включена в стоимость!</span>
              </h3>
              <p className="text-xl text-muted-foreground mb-6">
                7-10 уроков, за которые не нужно доплачивать
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Heart className="h-12 w-12 mx-auto mb-3 text-red-400" />
                  <h4 className="font-semibold mb-2">Забота о результате</h4>
                  <p className="text-sm text-muted-foreground">
                    Мы заботимся о каждом студенте как о собственном ребенке
                  </p>
                </div>
                <div className="text-center">
                  <Shield className="h-12 w-12 mx-auto mb-3 text-blue-400" />
                  <h4 className="font-semibold mb-2">Гарантия качества</h4>
                  <p className="text-sm text-muted-foreground">
                    Возврат средств, если результат не соответствует ожиданиям
                  </p>
                </div>
                <div className="text-center">
                  <Trophy className="h-12 w-12 mx-auto mb-3 text-yellow-400" />
                  <h4 className="font-semibold mb-2">Проверенная методика</h4>
                  <p className="text-sm text-muted-foreground">
                    8 лет опыта и 56,845 выпускников на высокие баллы
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-6">Часто задаваемые вопросы</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="glass-card text-left">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">Можно ли сменить тариф?</h4>
                <p className="text-sm text-muted-foreground">
                  Да, вы можете перейти на более высокий тариф в любое время. 
                  Доплата рассчитывается пропорционально.
                </p>
              </CardContent>
            </Card>
            <Card className="glass-card text-left">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">Есть ли возврат средств?</h4>
                <p className="text-sm text-muted-foreground">
                  Да, мы предоставляем полный возврат в течение 14 дней 
                  после начала обучения без каких-либо вопросов.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
