import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Award, Users, BookOpen, TrendingUp } from "lucide-react";

export default function Teachers() {
  const [selectedTeacher, setSelectedTeacher] = useState(0);

  const subjects = [
    { name: "Математика", avatar: "М", color: "bg-blue-500" },
    { name: "Русский язык", avatar: "Р", color: "bg-green-500" },
    { name: "Информатика", avatar: "И", color: "bg-purple-500" },
    { name: "Английский", avatar: "А", color: "bg-yellow-500" },
    { name: "Физика", avatar: "Ф", color: "bg-red-500" },
    { name: "Биология", avatar: "Б", color: "bg-emerald-500" },
    { name: "Химия", avatar: "Х", color: "bg-orange-500" },
    { name: "История", avatar: "И", color: "bg-indigo-500" },
    { name: "Литература", avatar: "Л", color: "bg-pink-500" },
    { name: "Обществознание", avatar: "О", color: "bg-cyan-500" },
    { name: "География", avatar: "Г", color: "bg-teal-500" },
    { name: "Испанский", avatar: "Е", color: "bg-amber-500" },
  ];

  const featuredTeachers = [
    {
      name: "Александра Петрова",
      subject: "Обществознание",
      education: "МГУ им. Ломоносова, кандидат юридических наук",
      experience: "7 лет в преподавании",
      degree: "Магистр права",
      successRate: "КАЖДЫЙ 2-й",
      successText: "ученик сдает на 80+ баллов",
      avatar: "/api/placeholder/300/300",
      stats: {
        students: "1,200+",
        rating: "4.9",
        courses: "12"
      },
      description: "Преподаватель с двумя высшими образованиями, эксперт ЕГЭ по обществознанию. Помогла сотням студентов поступить в престижные вузы.",
      achievements: [
        "ТОП-3 преподаватель России по обществознанию",
        "Автор методики быстрого запоминания терминов",
        "Эксперт ЕГЭ с 2018 года"
      ]
    },
    {
      name: "Дмитрий Волков",
      subject: "Математика",
      education: "МФТИ, кандидат физико-математических наук",
      experience: "9 лет в преподавании",
      degree: "Кандидат наук",
      successRate: "КАЖДЫЙ 3-й",
      successText: "ученик сдает на 90+ баллов",
      avatar: "/api/placeholder/300/300",
      stats: {
        students: "2,100+",
        rating: "4.8",
        courses: "15"
      },
      description: "Выпускник МФТИ, олимпиадник международного уровня. Специализируется на подготовке к профильной математике.",
      achievements: [
        "Призер международных математических олимпиад",
        "Автор курса 'Математика без страха'",
        "Научный сотрудник МФТИ"
      ]
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Выбери <span className="gradient-text">своего преподавателя</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Каждый преподаватель - эксперт в своей области с многолетним опытом подготовки к экзаменам
          </p>
        </div>

        {/* Subject Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-16">
          {subjects.map((subject, index) => (
            <Card 
              key={index} 
              className="glass-card hover:bg-white/10 transition-all duration-300 cursor-pointer course-card"
            >
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 ${subject.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <span className="text-white font-bold">{subject.avatar}</span>
                </div>
                <h4 className="font-semibold text-sm gradient-text">
                  {subject.name}
                </h4>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Teachers */}
        <div className="space-y-8">
          {featuredTeachers.map((teacher, index) => (
            <Card key={index} className="glass-card overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Teacher Image */}
                  <div className="relative h-80 md:h-auto">
                    <div className="absolute inset-0 gradient-primary opacity-20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Avatar className="w-48 h-48">
                        <AvatarImage src={teacher.avatar} alt={teacher.name} />
                        <AvatarFallback className="text-4xl gradient-primary text-white">
                          {teacher.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    {/* Floating Stats */}
                    <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-white text-sm">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span className="font-semibold">{teacher.stats.rating}</span>
                        </div>
                        <div className="text-xs opacity-80">рейтинг</div>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-white text-sm">
                        <div className="font-semibold">{teacher.stats.students}</div>
                        <div className="text-xs opacity-80">студентов</div>
                      </div>
                    </div>
                  </div>

                  {/* Teacher Info */}
                  <div className="p-8">
                    <div className="mb-4">
                      <Badge variant="secondary" className="bg-primary/20 text-primary mb-2">
                        {teacher.subject}
                      </Badge>
                      <h3 className="text-3xl font-bold mb-2 gradient-text">
                        {teacher.name}
                      </h3>
                      <p className="text-muted-foreground mb-2">
                        {teacher.education}
                      </p>
                      <p className="text-muted-foreground">
                        {teacher.experience}
                      </p>
                    </div>

                    <div className="mb-6">
                      <Badge variant="outline" className="mb-2">
                        {teacher.degree}
                      </Badge>
                      <div className="mb-2">
                        <div className="text-2xl font-bold gradient-text">
                          {teacher.successRate}
                        </div>
                        <div className="text-muted-foreground">
                          {teacher.successText}
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-6">
                      {teacher.description}
                    </p>

                    {/* Teacher Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
                        <div className="font-semibold">{teacher.stats.students}</div>
                        <div className="text-xs text-muted-foreground">студентов</div>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <Star className="h-5 w-5 mx-auto mb-1 text-yellow-400" />
                        <div className="font-semibold">{teacher.stats.rating}</div>
                        <div className="text-xs text-muted-foreground">рейтинг</div>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <BookOpen className="h-5 w-5 mx-auto mb-1 text-primary" />
                        <div className="font-semibold">{teacher.stats.courses}</div>
                        <div className="text-xs text-muted-foreground">курсов</div>
                      </div>
                    </div>

                    {/* Achievements */}
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        Достижения
                      </h4>
                      <ul className="space-y-2">
                        {teacher.achievements.map((achievement, achievementIndex) => (
                          <li key={achievementIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                            <TrendingUp className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button className="w-full gradient-primary">
                      Подробности обучения
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className="glass-card">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Хотите познакомиться с преподавателем?
              </h3>
              <p className="text-muted-foreground mb-6">
                Запишитесь на бесплатное пробное занятие и убедитесь в качестве обучения
              </p>
              <Button className="gradient-primary">
                Записаться на пробное занятие
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
