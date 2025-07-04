import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  User, 
  LogOut, 
  Settings, 
  BookOpen, 
  BarChart3,
  Users,
  GraduationCap
} from "lucide-react";

export default function Header() {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { href: "/courses", label: "Курсы", icon: BookOpen },
    { href: "/teachers", label: "Преподаватели", icon: Users },
    { href: "/platform", label: "Платформа", icon: GraduationCap },
    { href: "/reviews", label: "Отзывы", icon: BarChart3 },
  ];

  const userNavigationItems = isAuthenticated ? [
    { href: "/", label: "Главная", icon: BookOpen },
    { href: "/courses", label: "Курсы", icon: BookOpen },
    { href: "/profile", label: "Профиль", icon: User },
    ...(user?.role === "admin" ? [{ href: "/admin", label: "Админ", icon: Settings }] : []),
  ] : navigationItems;

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="text-2xl font-bold gradient-text cursor-pointer">
              EduAI
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {userNavigationItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === item.href ? "text-primary" : "text-muted-foreground"
                }`}>
                  {item.label}
                </a>
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.profileImageUrl} alt={user?.email} />
                      <AvatarFallback className="gradient-primary text-white">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    {user?.role === "admin" && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-primary">
                        A
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user?.firstName && user?.lastName && (
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                      )}
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Профиль</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      <span>Дашборд</span>
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Админ панель</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Выйти</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button className="gradient-primary" onClick={() => window.location.href = "/api/login"}>
                  Начать обучение
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-background/95 backdrop-blur-lg">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <div className="text-lg font-bold gradient-text">EduAI</div>
                  </div>

                  {/* User Info */}
                  {isAuthenticated && (
                    <div className="py-4 border-b border-border">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user?.profileImageUrl} />
                          <AvatarFallback className="gradient-primary text-white">
                            {getInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">{user?.email}</p>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {user?.role === "student" ? "Студент" : 
                             user?.role === "teacher" ? "Преподаватель" : "Администратор"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <nav className="flex-1 py-4">
                    <div className="space-y-2">
                      {userNavigationItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link key={item.href} href={item.href}>
                            <a
                              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                location === item.href 
                                  ? "bg-primary/20 text-primary" 
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                              }`}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <Icon className="h-5 w-5" />
                              {item.label}
                            </a>
                          </Link>
                        );
                      })}
                    </div>
                  </nav>

                  {/* Actions */}
                  <div className="pt-4 border-t border-border">
                    {isAuthenticated ? (
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Выйти
                      </Button>
                    ) : (
                      <Button 
                        className="w-full gradient-primary"
                        onClick={() => {
                          setLocation("/auth/register");
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Начать обучение
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
