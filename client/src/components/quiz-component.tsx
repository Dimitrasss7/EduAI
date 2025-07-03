import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { getAuthHeaders } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Brain, 
  Target, 
  Award,
  RotateCcw,
  TrendingUp,
  AlertCircle
} from "lucide-react";

interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  timeLimit?: number;
  passingScore: number;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

interface QuizComponentProps {
  quizzes: Quiz[];
}

export default function QuizComponent({ quizzes }: QuizComponentProps) {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitAttemptMutation = useMutation({
    mutationFn: async (data: { answers: Record<string, number>; score: number; isPassed: boolean }) => {
      const response = await fetch(`/api/quizzes/${selectedQuiz?.id}/attempts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error("Failed to submit quiz attempt");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/my-enrollments"] });
    },
  });

  // Timer effect
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || showResults) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, showResults]);

  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setQuizStarted(true);
    
    if (quiz.timeLimit) {
      setTimeLeft(quiz.timeLimit * 60); // Convert minutes to seconds
    }
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const nextQuestion = () => {
    if (selectedQuiz && currentQuestion < selectedQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    if (!selectedQuiz) return 0;
    
    let correct = 0;
    selectedQuiz.questions.forEach(question => {
      if (answers[question.id] === question.correct) {
        correct++;
      }
    });
    
    return Math.round((correct / selectedQuiz.questions.length) * 100);
  };

  const handleSubmitQuiz = () => {
    if (!selectedQuiz) return;

    const score = calculateScore();
    const isPassed = score >= selectedQuiz.passingScore;
    
    submitAttemptMutation.mutate({
      answers,
      score,
      isPassed
    });

    setShowResults(true);
    setTimeLeft(null);

    toast({
      title: isPassed ? "Тест пройден!" : "Тест не пройден",
      description: `Ваш результат: ${score}%. Проходной балл: ${selectedQuiz.passingScore}%`,
      variant: isPassed ? "default" : "destructive",
    });
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setQuizStarted(false);
    setTimeLeft(null);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Quiz Selection Screen
  if (!selectedQuiz) {
    return (
      <div className="space-y-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Доступные тесты
            </CardTitle>
          </CardHeader>
          <CardContent>
            {quizzes.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Тесты не найдены</h3>
                <p className="text-muted-foreground">
                  Тесты для этого урока пока не созданы. Вернитесь позже.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {quizzes.map((quiz) => (
                  <Card key={quiz.id} className="border border-border hover:border-primary/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{quiz.title}</h3>
                        <Badge className="bg-primary/20 text-primary">
                          {quiz.questions.length} вопросов
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{quiz.timeLimit ? `${quiz.timeLimit} мин` : "Без ограничений"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          <span>Проходной: {quiz.passingScore}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          <span>Можно пересдать</span>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => startQuiz(quiz)}
                        className="w-full gradient-primary"
                      >
                        Начать тест
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Results Screen
  if (showResults) {
    const score = calculateScore();
    const isPassed = score >= selectedQuiz.passingScore;
    const correctAnswers = selectedQuiz.questions.filter(q => answers[q.id] === q.correct).length;

    return (
      <div className="space-y-6">
        <Card className="glass-card">
          <CardHeader className="text-center">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              isPassed ? "bg-green-500/20" : "bg-red-500/20"
            }`}>
              {isPassed ? (
                <CheckCircle className="h-8 w-8 text-green-400" />
              ) : (
                <XCircle className="h-8 w-8 text-red-400" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {isPassed ? "Тест пройден!" : "Тест не пройден"}
            </CardTitle>
            <p className="text-muted-foreground">
              Ваш результат: <span className="font-bold gradient-text">{score}%</span>
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold gradient-text">{score}%</div>
                <div className="text-sm text-muted-foreground">Итоговый балл</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold gradient-text">{correctAnswers}</div>
                <div className="text-sm text-muted-foreground">Правильных ответов</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold gradient-text">{selectedQuiz.questions.length - correctAnswers}</div>
                <div className="text-sm text-muted-foreground">Ошибок</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold gradient-text">{selectedQuiz.passingScore}%</div>
                <div className="text-sm text-muted-foreground">Проходной балл</div>
              </div>
            </div>

            {/* Questions Review */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Разбор вопросов</h3>
              {selectedQuiz.questions.map((question, index) => {
                const userAnswer = answers[question.id];
                const isCorrect = userAnswer === question.correct;
                
                return (
                  <Card key={question.id} className="border border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCorrect ? "bg-green-500/20" : "bg-red-500/20"
                        }`}>
                          {isCorrect ? (
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-2">
                            {index + 1}. {question.question}
                          </h4>
                          <div className="space-y-1 text-sm">
                            {question.options.map((option, optionIndex) => (
                              <div 
                                key={optionIndex} 
                                className={`p-2 rounded ${
                                  optionIndex === question.correct 
                                    ? "bg-green-500/20 text-green-400" 
                                    : optionIndex === userAnswer 
                                    ? "bg-red-500/20 text-red-400" 
                                    : "bg-muted/30"
                                }`}
                              >
                                {String.fromCharCode(65 + optionIndex)}. {option}
                                {optionIndex === question.correct && " ✓"}
                                {optionIndex === userAnswer && optionIndex !== question.correct && " ✗"}
                              </div>
                            ))}
                          </div>
                          {question.explanation && (
                            <div className="mt-3 p-3 bg-blue-500/10 rounded border-l-4 border-blue-500">
                              <p className="text-sm">{question.explanation}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button 
                onClick={resetQuiz}
                variant="outline"
                className="flex-1"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Пройти другой тест
              </Button>
              <Button 
                onClick={() => startQuiz(selectedQuiz)}
                className="flex-1 gradient-primary"
              >
                Пройти еще раз
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz Taking Screen
  const currentQ = selectedQuiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / selectedQuiz.questions.length) * 100;
  const allAnswered = selectedQuiz.questions.every(q => q.id in answers);

  return (
    <div className="space-y-6">
      {/* Quiz Header */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{selectedQuiz.title}</h2>
            <div className="flex items-center gap-4">
              {timeLeft !== null && (
                <Badge className={`${
                  timeLeft < 300 ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"
                }`}>
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTime(timeLeft)}
                </Badge>
              )}
              <Badge variant="outline">
                {currentQuestion + 1} из {selectedQuiz.questions.length}
              </Badge>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Current Question */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">
            Вопрос {currentQuestion + 1}: {currentQ.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={answers[currentQ.id]?.toString()}
            onValueChange={(value) => handleAnswerSelect(currentQ.id, parseInt(value))}
          >
            {currentQ.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  <span className="font-medium mr-2">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <Button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              variant="outline"
            >
              Назад
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Отвечено: {Object.keys(answers).length} из {selectedQuiz.questions.length}
              </span>
            </div>

            <div className="flex gap-2">
              {currentQuestion === selectedQuiz.questions.length - 1 ? (
                <Button
                  onClick={handleSubmitQuiz}
                  disabled={!allAnswered || submitAttemptMutation.isPending}
                  className="gradient-primary"
                >
                  {submitAttemptMutation.isPending ? "Отправка..." : "Завершить тест"}
                </Button>
              ) : (
                <Button
                  onClick={nextQuestion}
                  disabled={currentQuestion === selectedQuiz.questions.length - 1}
                >
                  Далее
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Navigation */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-sm">Навигация по вопросам</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {selectedQuiz.questions.map((_, index) => (
              <Button
                key={index}
                variant={currentQuestion === index ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentQuestion(index)}
                className={`h-8 w-8 p-0 ${
                  answers[selectedQuiz.questions[index].id] !== undefined
                    ? "bg-green-500/20 border-green-500"
                    : ""
                }`}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
