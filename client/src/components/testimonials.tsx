import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, Quote, TrendingUp, Award, Users, MessageCircle } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Алексей Краснов",
      avatar: "/api/placeholder/80/80",
      initials: "АК",
      subject: "Математика",
      score: 92,
      grade: "11 класс",
      university: "МГУ им. Ломоносова",
      review: "Благодаря ИИ-ассистенту смог разобраться с самыми сложными темами! Платформа прогнозировала мой результат очень точно. Преподаватели объясняют сложные вещи простым языком.",
      rating: 5,
      beforeScore: 67,
      improvement: "+25 баллов",
      studyTime: "6 месяцев"
    },
    {
      name: "Мария Соколова",
      avatar: "/api/placeholder/80/80",
      initials: "МС",
      subject: "Русский язык",
      score: 96,
      grade: "11 класс",
      university: "СПбГУ",
      review: "Система повторения просто волшебная! Никогда не думала, что подготовка может быть такой интересной и эффективной. ИИ помогал с сочинениями и анализом текстов.",
      rating: 5,
      beforeScore: 78,
      improvement: "+18 баллов",
      studyTime: "8 месяцев"
    },
    {
      name: "Дмитрий Петров",
      avatar: "/api/placeholder/80/80",
      initials: "ДП",
      subject: "Информатика",
      score: 89,
      grade: "11 класс",
      university: "МФТИ",
      review: "Геймификация мотивировала заниматься каждый день. Соревнование с друзьями сделало подготовку увлекательной игрой! Практические задания были супер полезными.",
      rating: 5,
      beforeScore: 71,
      improvement: "+18 баллов",
      studyTime: "7 месяцев"
    },
    {
      name: "Анна Васильева",
      avatar: "/api/placeholder/80/80",
      initials: "АВ",
      subject: "Химия",
      score: 84,
      grade: "11 класс",
      university: "МГУ им. Ломоносова",
      review: "Персональный план обучения и ИИ-аналитика помогли выявить слабые места и эффективно их проработать. Преподаватель всегда был на связи.",
      rating: 4,
      beforeScore: 58,
      improvement: "+26 баллов",
      studyTime: "9 месяцев"
    },
    {
      name: "Иван Смирнов",
      avatar: "/api/placeholder/80/80",
      initials: "ИС",
      subject: "Физика",
      score: 91,
      grade: "11 класс",
      university: "МИФИ",
      review: "Отличная подача материала, много практических заданий. ИИ-ассистент помогал разбираться с задачами в любое время суток. Рекомендую всем!",
      rating: 5,
      beforeScore: 69,
      improvement: "+22 балла",
      studyTime: "10 месяцев"
    },
    {
      name: "Елена Козлова",
      avatar: "/api/placeholder/80/80",
      initials: "ЕК",
      subject: "Биология",
      score: 88,
      grade: "11 класс",
      university: "Первый МГМУ",
      review: "Структурированная подача материала и постоянная поддержка наставника. Платформа действительно помогла систематизировать знания и повысить уверенность.",
      rating: 5,
      beforeScore: 64,
      improvement: "+24 балла",
      studyTime: "8 месяцев"
    }
  ];

  const stats = [
    { number: "20,000+", label: "Отзывов от учеников", icon: MessageCircle },
    { number: "4.9", label: "Средняя оценка", icon: Star },
    { number: "95%", label: "Рекомендуют друзьям", icon: Users },
    { number: "87", label: "Средний балл ЕГЭ", icon: TrendingUp }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Более <span className="gradient-text">20,000 отзывов</span> от учеников
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Наши выпускники успешно сдают ЕГЭ и ОГЭ, поступают на бюджет и делятся своими достижениями
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="glass-card hover:bg-white/10 transition-all duration-300 course-card">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback className="gradient-primary text-white">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.grade}</p>
                    </div>
                  </div>
                  <Quote className="h-6 w-6 text-primary/50" />
                </div>

                {/* Score Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-primary/20 text-primary">
                    {testimonial.subject}: {testimonial.score} баллов
                  </Badge>
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    {testimonial.improvement}
                  </Badge>
                </div>

                {/* Review */}
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  "{testimonial.review}"
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${
                        i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>

                {/* Footer Info */}
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Поступил в:</span>
                    <span className="font-semibold">{testimonial.university}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Время подготовки:</span>
                    <span>{testimonial.studyTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Было → Стало:</span>
                    <span>{testimonial.beforeScore} → {testimonial.score}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Success Stories Section */}
        <div className="mb-16">
          <Card className="glass-card overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Left side - Stories */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-6">
                    Истории <span className="gradient-text">успеха</span>
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <Award className="h-6 w-6 text-yellow-400 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">100 баллов по русскому языку</h4>
                        <p className="text-sm text-muted-foreground">
                          Екатерина С. стала одной из 500 стобалльников России по русскому языку, 
                          подготовившись за 8 месяцев на нашей платформе.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <TrendingUp className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Рост на 40+ баллов</h4>
                        <p className="text-sm text-muted-foreground">
                          Александр П. повысил результат по математике с 45 до 89 баллов 
                          благодаря персональному плану и ИИ-ассистенту.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Users className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Поступление мечты</h4>
                        <p className="text-sm text-muted-foreground">
                          Мария К. поступила на бюджет в МГУ на факультет международных отношений, 
                          набрав 270+ баллов за три предмета.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Stats */}
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 flex items-center">
                  <div className="text-center w-full">
                    <div className="text-6xl font-bold gradient-text mb-4">87%</div>
                    <h4 className="text-xl font-semibold mb-2">учеников поступают на бюджет</h4>
                    <p className="text-muted-foreground mb-6">
                      Это в 3 раза выше среднего показателя по России
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold gradient-text">80+</div>
                        <div className="text-xs text-muted-foreground">средний балл</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold gradient-text">95%</div>
                        <div className="text-xs text-muted-foreground">довольны результатом</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="glass-card">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Присоединяйтесь к успешным выпускникам
              </h3>
              <p className="text-muted-foreground mb-6">
                Начните свою подготовку сегодня и станьте частью нашей большой семьи успешных студентов
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="gradient-primary">
                  Смотреть все отзывы
                </Button>
                <Button variant="outline">
                  Начать обучение
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
