import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ClipboardList, ArrowRight, RotateCcw, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface CourseQuizData {
  courseId: string;
  title: string;
  questions: QuizQuestion[];
}

interface CourseQuizProps {
  quiz: CourseQuizData;
  courseIcon: string;
  onComplete?: (score: number, total: number) => void;
}

const CourseQuiz = ({ quiz, courseIcon, onComplete }: CourseQuizProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  const handleAnswerSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    setIsAnswered(true);
    if (selectedAnswer === question.correctAnswer) {
      setCorrectAnswers((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizComplete(true);
      onComplete?.(correctAnswers + (selectedAnswer === question.correctAnswer ? 1 : 0), quiz.questions.length);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCorrectAnswers(0);
    setQuizComplete(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset quiz when closing
      handleRestartQuiz();
    }
  };

  const getScoreMessage = () => {
    const finalScore = correctAnswers;
    const percentage = (finalScore / quiz.questions.length) * 100;
    
    if (percentage === 100) return { message: "Perfect Score! 🌟", color: "text-green-600" };
    if (percentage >= 80) return { message: "Excellent Work! 🎉", color: "text-green-600" };
    if (percentage >= 60) return { message: "Good Job! 👍", color: "text-yellow-600" };
    return { message: "Keep Learning! 📚", color: "text-orange-600" };
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <ClipboardList className="w-4 h-4" />
          Take Quiz
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{courseIcon}</span>
            {quiz.title}
          </DialogTitle>
        </DialogHeader>

        {!quizComplete ? (
          <div className="space-y-6">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Question */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium leading-relaxed">
                  {question.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {question.options.map((option, index) => {
                  const isCorrect = index === question.correctAnswer;
                  const isSelected = selectedAnswer === index;
                  
                  let optionStyle = "border-border hover:border-primary/50 hover:bg-primary/5";
                  
                  if (isAnswered) {
                    if (isCorrect) {
                      optionStyle = "border-green-500 bg-green-50 dark:bg-green-950/30";
                    } else if (isSelected && !isCorrect) {
                      optionStyle = "border-red-500 bg-red-50 dark:bg-red-950/30";
                    } else {
                      optionStyle = "border-border opacity-50";
                    }
                  } else if (isSelected) {
                    optionStyle = "border-primary bg-primary/10";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={isAnswered}
                      className={cn(
                        "w-full p-4 rounded-lg border-2 text-left transition-all flex items-center gap-3",
                        optionStyle
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0",
                        isAnswered && isCorrect ? "bg-green-500 text-white" :
                        isAnswered && isSelected && !isCorrect ? "bg-red-500 text-white" :
                        isSelected ? "bg-primary text-primary-foreground" :
                        "bg-muted"
                      )}>
                        {isAnswered && isCorrect ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : isAnswered && isSelected && !isCorrect ? (
                          <XCircle className="w-5 h-5" />
                        ) : (
                          String.fromCharCode(65 + index)
                        )}
                      </div>
                      <span className="flex-1">{option}</span>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Explanation (shown after answering) */}
            {isAnswered && (
              <div className={cn(
                "p-4 rounded-lg animate-fade-in",
                selectedAnswer === question.correctAnswer 
                  ? "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800"
                  : "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800"
              )}>
                <p className="text-sm font-medium mb-1">
                  {selectedAnswer === question.correctAnswer ? "✓ Correct!" : "✗ Not quite right"}
                </p>
                <p className="text-sm text-muted-foreground">{question.explanation}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3">
              {!isAnswered ? (
                <Button 
                  onClick={handleSubmitAnswer} 
                  disabled={selectedAnswer === null}
                >
                  Submit Answer
                </Button>
              ) : (
                <Button onClick={handleNextQuestion} className="gap-2">
                  {currentQuestion < quiz.questions.length - 1 ? (
                    <>
                      Next Question
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    "See Results"
                  )}
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* Quiz Complete Screen */
          <div className="text-center py-8 space-y-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center mx-auto">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            
            <div>
              <h3 className={cn("text-2xl font-bold mb-2", getScoreMessage().color)}>
                {getScoreMessage().message}
              </h3>
              <p className="text-muted-foreground">
                You scored {correctAnswers} out of {quiz.questions.length}
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <Badge variant="outline" className="text-lg py-2 px-4">
                {Math.round((correctAnswers / quiz.questions.length) * 100)}%
              </Badge>
            </div>

            <div className="flex justify-center gap-3 pt-4">
              <Button variant="outline" onClick={handleRestartQuiz} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Retake Quiz
              </Button>
              <Button onClick={() => setIsOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CourseQuiz;
