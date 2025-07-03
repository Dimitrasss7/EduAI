import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, GraduationCap, Star, Users, BookOpen, Target } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Heart,
      title: "Тотальная поддержка",
      description: "Мы искренне переживаем и болеем за наших учеников! Поэтому ты получишь ценную помощь по учебе, ответы на все вопросы и поддержку на каждом этапе подготовки. С нашей мотивацией у тебя не получится слиться!",
      badges: ["Забота", "Поддержка", "Наставничество"],
      gradient: "gradient-primary"
    },
    {
      icon: GraduationCap,
      title: "Учим ярко и понятно",
      description: "Вебинары - настоящие шедевры в режиме онлайн. Мы объясняем, пока не станет понятно - на реальных примерах с экзаменов, простых ассоциациях, музыкой и шутками. А еще у тебя останутся записи до дня экзамена, всегда можно вернуться и пересмотреть.",
      badges: ["Без душноты", "Интересно", "Понятно"],
      gradient: "gradient-secondary"
    },
    {
      icon: Star,
      title: "Высокие стандарты к преподавателям",
      description: "Наши преподаватели - настоящие профессионалы и лидеры предметов, каждый из них входит в ТОП-5 самых рекомендуемых преподавателей России! С ними ты влюбишься в подготовку раз и навсегда.",
      badges: ["Профессионалы", "Лидеры", "Харизматики"],
      gradient: "gradient-accent"
    }
  ];

  const achievements = [
    { icon: Users, number: "56,845", text: "выпускников сдали ЕГЭ на 80+ и ОГЭ на \"5\"" },
    { icon: BookOpen, number: "8 лет", text: "готовим к экзаменам" },
    { icon: Target, number: "167,536", text: "учеников доверили нам подготовку к экзаменам" }
  ];

  return (
    <section id="features" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        {/* Achievement Stats */}
        <div className="text-center mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div key={index} className="text-center stats-counter">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center mr-3">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold gradient-text">
                      {achievement.number}
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    {achievement.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Наши <span className="gradient-text">3 главных принципа</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Что делает нашу платформу особенной и эффективной для подготовки к экзаменам
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="glass-card text-center group hover:bg-white/10 transition-all duration-300 course-card"
              >
                <CardContent className="p-8">
                  <div className={`w-16 h-16 ${feature.gradient} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 gradient-text">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-2">
                    {feature.badges.map((badge, badgeIndex) => (
                      <Badge 
                        key={badgeIndex}
                        variant="secondary" 
                        className={`${
                          badgeIndex === 0 ? "bg-primary/20 text-primary" :
                          badgeIndex === 1 ? "bg-secondary/20 text-secondary" :
                          "bg-accent/20 text-accent"
                        }`}
                      >
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom Call to Action */}
        <div className="text-center mt-16">
          <p className="text-lg text-muted-foreground mb-6">
            Готовы присоединиться к тысячам успешных выпускников?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Индивидуальный подход</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Проверенная методика</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Гарантия результата</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
