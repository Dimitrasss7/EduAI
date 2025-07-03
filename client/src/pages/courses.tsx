import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Header from "@/components/header";
import CourseCard from "@/components/course-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const subjects = [
  "Все предметы",
  "Математика",
  "Русский язык",
  "Физика",
  "Химия",
  "Биология",
  "История",
  "Обществознание",
  "География",
  "Информатика",
  "Английский язык",
  "Литература"
];

const levels = [
  "Все уровни",
  "Начальный",
  "Базовый",
  "Продвинутый"
];

export default function Courses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("Все предметы");
  const [selectedLevel, setSelectedLevel] = useState("Все уровни");

  const { data: courses, isLoading } = useQuery({
    queryKey: ["/api/courses"],
    queryFn: async () => {
      const response = await fetch("/api/courses");
      if (!response.ok) throw new Error("Failed to fetch courses");
      return await response.json();
    },
  });

  const filteredCourses = courses?.filter((course: any) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "Все предметы" || course.subject === selectedSubject;
    const matchesLevel = selectedLevel === "Все уровни" || course.level === selectedLevel;
    
    return matchesSearch && matchesSubject && matchesLevel;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="glass-card">
                <CardContent className="p-6">
                  <div className="skeleton h-48 w-full rounded mb-4"></div>
                  <div className="skeleton h-4 w-3/4 rounded mb-2"></div>
                  <div className="skeleton h-4 w-1/2 rounded"></div>
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
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-dark relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Каталог <span className="gradient-text">курсов</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Выберите предмет и начните подготовку к экзаменам с лучшими преподавателями
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск курсов..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Предмет" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Уровень" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => {
                setSearchQuery("");
                setSelectedSubject("Все предметы");
                setSelectedLevel("Все уровни");
              }}
            >
              <Filter className="h-4 w-4" />
              Сбросить
            </Button>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredCourses?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course: any) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold mb-4">Курсы не найдены</h3>
              <p className="text-muted-foreground mb-8">
                Попробуйте изменить параметры поиска или сбросить фильтры
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSubject("Все предметы");
                  setSelectedLevel("Все уровни");
                }}
                className="gradient-primary"
              >
                Сбросить фильтры
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
