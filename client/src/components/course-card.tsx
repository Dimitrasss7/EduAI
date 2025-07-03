import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { 
  Clock, 
  Users, 
  BookOpen, 
  Star, 
  Play, 
  Award,
  TrendingUp,
  Heart,
  Target
} from "lucide-react";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description?: string;
    subject: string;
    level: string;
    price: string;
    duration?: number;
    thumbnailUrl?: string;
    teacherId?: string;
    isActive: boolean;
  };
}

export default function CourseCard({ course }: CourseCardProps) {
  const { isAuthenticated } = useAuth();

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "начальный":
      case "beginner":
        return "bg-green-500/20 text-green-400";
      case "базовый":
      case "intermediate":
        return "bg-yellow-500/20 text-yellow-400";
      case "продвинутый":
      case "advanced":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getSubjectIcon = (subject: string) => {
    const subjectLower = subject.toLowerCase();
    if (subjectLower.includes("математика")) return "📐";
    if (subjectLower.includes("русский")) return "📝";
    if (subjectLower.includes("физика")) return "⚛️";
    if (subjectLower.includes("химия")) return "🧪";
    if (subjectLower.includes("биология")) return "🧬";
    if (subjectLower.includes("история")) return "📚";
    if (subjectLower.includes("обществознание")) return "⚖️";
    if (subjectLower.includes("география")) return "🌍";
    if (subjectLower.includes("информатика")) return "💻";
    if (subjectLower.includes("английский")) return "🇬🇧";
    if (subjectLower.includes("литература")) return "📖";
    return "📋";
  };

  // Mock data for demonstration
  const mockStats = {
    students: Math.floor(Math.random() * 500) + 100,
    rating: (4.5 + Math.random() * 0.5).toFixed(1),
    lessons: Math.floor(Math.random() * 20) + 15,
    reviews: Math.floor(Math.random() * 50) + 20
  };

  return (
    <Card className="glass-card hover:bg-white/10 transition-all duration-300 course-card group overflow-hidden">
      {/* Course Image/Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
        {course.thumbnailUrl ? (
          <img 
            src={course.thumbnailUrl} 
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl opacity-50">
              {getSubjectIcon(course.subject)}
            </div>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300"></div>
        
        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
            <Play className="h-8 w-8 text-white ml-1" />
          </div>
        </div>

        {/* Level Badge */}
        <div className="absolute top-4 left-4">
          <Badge className={getLevelColor(course.level)}>
            {course.level}
          </Badge>
        </div>

        {/* Price Badge */}
        <div className="absolute top-4 right-4">
          <Badge className="bg-black/50 text-white backdrop-blur-sm">
            ₽{course.price}
          </Badge>
        </div>

        {/* Subject Badge */}
        <div className="absolute bottom-4 left-4">
          <Badge variant="secondary" className="bg-white/10 text-white backdrop-blur-sm">
            {course.subject}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          <Heart className="h-5 w-5 text-muted-foreground hover:text-red-400 cursor-pointer transition-colors flex-shrink-0" />
        </div>
        
        {course.description && (
          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{course.duration || 40}ч</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>{mockStats.lessons} уроков</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{mockStats.students} студентов</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Star className="h-4 w-4 text-yellow-400" />
            <span>{mockStats.rating} ({mockStats.reviews})</span>
          </div>
        </div>

        {/* Teacher Info */}
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/api/placeholder/32/32" />
            <AvatarFallback className="gradient-primary text-white text-xs">
              П
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Преподаватель курса</p>
            <p className="text-xs text-muted-foreground">Эксперт ЕГЭ</p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Target className="h-3 w-3 text-green-400" />
            <span>Средний балл выпускников: 85+</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Award className="h-3 w-3 text-yellow-400" />
            <span>ИИ-ассистент в комплекте</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3 text-blue-400" />
            <span>Персональный трекинг прогресса</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Link href={`/courses/${course.id}`} className="flex-1">
            <Button 
              variant="outline" 
              className="w-full hover:bg-primary/10 hover:border-primary/50"
            >
              Подробнее
            </Button>
          </Link>
          <Link href={isAuthenticated ? `/courses/${course.id}` : "/auth/register"} className="flex-1">
            <Button className="w-full gradient-primary">
              {isAuthenticated ? "Начать" : "Записаться"}
            </Button>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="text-center pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Пробный урок бесплатно • Возврат в течение 14 дней
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
