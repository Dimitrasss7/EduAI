import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Facebook, 
  Twitter, 
  Youtube, 
  Instagram,
  Mail,
  Phone,
  MapPin,
  Send
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const courseLinks = [
    { href: "/courses/math", label: "Математика" },
    { href: "/courses/russian", label: "Русский язык" },
    { href: "/courses/physics", label: "Физика" },
    { href: "/courses/chemistry", label: "Химия" },
    { href: "/courses/biology", label: "Биология" },
    { href: "/courses/history", label: "История" },
    { href: "/courses/social", label: "Обществознание" },
    { href: "/courses/english", label: "Английский язык" },
  ];

  const companyLinks = [
    { href: "/about", label: "О нас" },
    { href: "/teachers", label: "Преподаватели" },
    { href: "/reviews", label: "Отзывы" },
    { href: "/blog", label: "Блог" },
    { href: "/careers", label: "Карьера" },
    { href: "/press", label: "Пресса" },
    { href: "/partnerships", label: "Партнерство" },
    { href: "/contact", label: "Контакты" },
  ];

  const supportLinks = [
    { href: "/help", label: "Центр поддержки" },
    { href: "/faq", label: "Часто задаваемые вопросы" },
    { href: "/terms", label: "Условия использования" },
    { href: "/privacy", label: "Политика конфиденциальности" },
    { href: "/refund", label: "Возврат средств" },
    { href: "/accessibility", label: "Доступность" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  ];

  return (
    <footer className="bg-card/50 backdrop-blur-sm border-t border-border">
      {/* Newsletter Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="glass-card p-8 rounded-2xl mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4 gradient-text">
                Подпишитесь на новости
              </h3>
              <p className="text-muted-foreground">
                Получайте последние новости о новых курсах, функциях платформы и полезные советы по подготовке к экзаменам.
              </p>
            </div>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Ваш email адрес" 
                className="flex-1"
              />
              <Button className="gradient-primary">
                <Send className="h-4 w-4 mr-2" />
                Подписаться
              </Button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="text-2xl font-bold gradient-text mb-4">EduAI</div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Современная платформа онлайн-образования с AI-интеграцией для подготовки к экзаменам. 
              Помогаем студентам достигать высоких результатов с 2017 года.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="text-sm">info@eduai.ru</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+7 (495) 123-45-67</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Москва, ул. Тверская, 1</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <Button
                  key={label}
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0"
                  asChild
                >
                  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                    <Icon className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-semibold mb-4">Курсы</h4>
            <ul className="space-y-2">
              {courseLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Компания</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Поддержка</h4>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>© {currentYear} EduAI. Все права защищены.</span>
            <Link href="/privacy">
              <a className="hover:text-foreground transition-colors">
                Политика конфиденциальности
              </a>
            </Link>
            <Link href="/terms">
              <a className="hover:text-foreground transition-colors">
                Условия использования
              </a>
            </Link>
            <Link href="/cookies">
              <a className="hover:text-foreground transition-colors">
                Использование файлов cookie
              </a>
            </Link>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Сделано с</span>
            <span className="text-red-400">♥</span>
            <span>для образования</span>
          </div>
        </div>
      </div>

      {/* Achievement Badge */}
      <div className="container mx-auto px-4 pb-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">
              Более 50,000 студентов сдали экзамены на высокие баллы
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
