import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Play, 
  ArrowDown, 
  Star, 
  Users, 
  Trophy, 
  TrendingUp,
  Sparkles,
  Zap
} from "lucide-react";

export default function Hero() {
  const [, setLocation] = useLocation();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const stats = [
    { value: "56,845", label: "Выпускников на 80+", icon: Trophy },
    { value: "8", label: "Лет опыта", icon: Star },
    { value: "167,536", label: "Учеников всего", icon: Users },
    { value: "24/7", label: "ИИ-поддержка", icon: Zap },
  ];

  const scrollToNextSection = () => {
    const nextSection = document.querySelector('#features');
    nextSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-dark overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-secondary/20 rounded-full blur-2xl floating-animation" style={{ animationDelay: "2s" }}></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-accent/10 rounded-full blur-3xl floating-animation" style={{ animationDelay: "4s" }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Announcement Badge */}
          <div className="text-center mb-8">
            <Badge variant="secondary" className="bg-primary/20 text-primary px-6 py-2 text-sm font-medium">
              <Sparkles className="h-4 w-4 mr-2" />
              🚀 Платформа с ИИ-ассистентом
            </Badge>
          </div>

          {/* Main Content */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">
              Онлайн образование{" "}
              <span className="block gradient-text">на высокие баллы</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Современная платформа с AI-интеграцией для персонализированного обучения. 
              Готовим к экзаменам с 8 по 11 класс
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              className="gradient-primary text-lg px-8 py-4 h-auto"
              onClick={() => setLocation("/register")}
            >
              Начать обучение бесплатно
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="glass-card text-lg px-8 py-4 h-auto border-white/20 hover:bg-white/10"
              onClick={() => setIsVideoPlaying(true)}
            >
              <Play className="h-5 w-5 mr-2" />
              Смотреть демо
            </Button>
          </div>

          {/* Auth Options */}
          <div className="text-center mb-16">
            <p className="text-muted-foreground mb-4">
              Уже есть аккаунт?{" "}
              <button 
                onClick={() => setLocation("/login")}
                className="text-primary hover:underline"
              >
                Войти
              </button>
              {" "}или{" "}
              <button 
                onClick={() => window.location.href = "/api/login"}
                className="text-primary hover:underline"
              >
                войти через Replit
              </button>
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="glass-card border-white/10 stats-counter">
                  <CardContent className="p-6 text-center">
                    <Icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                    <div className="text-2xl md:text-3xl font-bold gradient-text mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Demo Video Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <Card className="glass-card border-white/10 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-muted/20 flex items-center justify-center">
                  {!isVideoPlaying ? (
                    <Button
                      size="lg"
                      className="gradient-primary h-16 w-16 rounded-full p-0"
                      onClick={() => setIsVideoPlaying(true)}
                    >
                      <Play className="h-8 w-8 ml-1" />
                    </Button>
                  ) : (
                    <div className="w-full h-full bg-black/80 flex items-center justify-center text-white">
                      <p>Здесь будет демо-видео платформы</p>
                    </div>
                  )}
                  
                  {/* Floating Elements on Video */}
                  <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center gap-2 text-white text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>ИИ-ассистент активен</span>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-white text-sm">
                      <div className="font-semibold">Прогноз ЕГЭ</div>
                      <div className="text-2xl font-bold gradient-text">87 баллов</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trust Indicators */}
          <div className="text-center mb-8">
            <p className="text-muted-foreground mb-6">
              Нам доверяют студенты из лучших школ России
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {["Школа №1", "Лицей №2", "Гимназия №3", "Физмат школа", "IT-лицей"].map((school, index) => (
                <div key={index} className="text-lg font-semibold text-muted-foreground">
                  {school}
                </div>
              ))}
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={scrollToNextSection}
              className="animate-bounce"
            >
              <ArrowDown className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Video Modal would go here */}
      {isVideoPlaying && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setIsVideoPlaying(false)}
        >
          <div className="relative max-w-4xl w-full aspect-video bg-black rounded-lg">
            <Button
              variant="ghost"
              className="absolute top-4 right-4 text-white z-10"
              onClick={() => setIsVideoPlaying(false)}
            >
              ✕
            </Button>
            <div className="w-full h-full flex items-center justify-center text-white">
              <p>Демо-видео платформы</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
