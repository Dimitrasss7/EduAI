import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Sparkles, Gift, Clock, Check } from "lucide-react";

export default function LeadForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    grade: "",
    subject: "",
    agreed: false
  });

  const submitLeadMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/leads", {
        name: data.name,
        email: data.email,
        phone: data.phone,
        grade: data.grade,
        subject: data.subject
      });
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Заявка отправлена!",
        description: "Мы свяжемся с вами в течение 15 минут",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        grade: "",
        subject: "",
        agreed: false
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку. Попробуйте еще раз.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.grade || !formData.agreed) {
      toast({
        title: "Заполните обязательные поля",
        description: "Имя, телефон, класс и согласие на обработку данных обязательны",
        variant: "destructive",
      });
      return;
    }

    submitLeadMutation.mutate(formData);
  };

  const subjects = [
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

  const grades = ["8 класс", "9 класс", "10 класс", "11 класс"];

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-primary opacity-10"></div>
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-5xl mx-auto">
          <Card className="glass-card overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left Side - Content */}
              <div className="p-8 lg:p-12 bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="mb-8">
                  <Badge className="bg-primary/20 text-primary mb-4">
                    <Gift className="h-4 w-4 mr-2" />
                    Специальное предложение
                  </Badge>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                    Займи место на курсе по{" "}
                    <span className="gradient-text">самой низкой цене</span>
                  </h2>
                  <p className="text-xl text-muted-foreground mb-8">
                    А мы подарим <span className="font-bold text-primary">2 месяца летней школы</span>
                  </p>
                </div>

                {/* Benefits */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-muted-foreground">Персональный план подготовки</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-muted-foreground">ИИ-ассистент 24/7</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-muted-foreground">Индивидуальное наставничество</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-muted-foreground">Прогноз результата ЕГЭ</span>
                  </div>
                </div>

                {/* Urgency */}
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-yellow-400 mb-2">
                    <Clock className="h-5 w-5" />
                    <span className="font-semibold">Ограниченное предложение</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Скидка действует только до конца месяца. Количество мест ограничено.
                  </p>
                </div>
              </div>

              {/* Right Side - Form */}
              <CardContent className="p-8 lg:p-12">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-2xl gradient-text">
                    Получить персональный план
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Оставьте заявку и мы свяжемся с вами в течение 15 минут
                  </p>
                </CardHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Input
                      type="text"
                      placeholder="Ваше имя *"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="h-12"
                      required
                    />
                  </div>

                  <div>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="h-12"
                    />
                  </div>

                  <div>
                    <Input
                      type="tel"
                      placeholder="Номер телефона *"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="h-12"
                      required
                    />
                  </div>

                  <div>
                    <Select 
                      value={formData.grade} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, grade: value }))}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Выберите класс *" />
                      </SelectTrigger>
                      <SelectContent>
                        {grades.map((grade) => (
                          <SelectItem key={grade} value={grade}>
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Select 
                      value={formData.subject} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Интересующий предмет (необязательно)" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="agreement"
                      checked={formData.agreed}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, agreed: checked as boolean }))
                      }
                      className="mt-1"
                    />
                    <label 
                      htmlFor="agreement" 
                      className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                    >
                      Я даю согласие на обработку моих персональных данных. 
                      Подробнее об обработке данных в{" "}
                      <a href="/privacy" className="text-primary hover:underline">
                        Политике конфиденциальности
                      </a>.
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 gradient-primary text-lg font-semibold"
                    disabled={submitLeadMutation.isPending}
                  >
                    {submitLeadMutation.isPending ? (
                      <>
                        <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                        Отправляем...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Получить персональный план
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    * Обязательные поля для заполнения
                  </p>
                </form>
              </CardContent>
            </div>
          </Card>

          {/* Image */}
          <div className="mt-8 text-center">
            <div className="inline-block relative">
              <div className="w-64 h-40 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="h-12 w-12 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Начните свой путь к высоким баллам</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
