'use client';

import { useState } from 'react';
import { generateQuiz, AIQuizGeneratorOutput } from '@/ai/flows/quiz-generator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Brain, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

export default function QuizGeneratorPage() {
  const { toast } = useToast();
  
  const [topic, setTopic] = useState('');
  const [material, setMaterial] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [quiz, setQuiz] = useState<AIQuizGeneratorOutput | null>(null);
  
  // Quiz Player State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const handleGenerate = async () => {
    if (!topic) {
      toast({ title: 'Missing Topic', description: 'Please enter a topic for the quiz.', variant: 'destructive' });
      return;
    }

    setIsGenerating(true);
    try {
      const generatedQuiz = await generateQuiz({ topic, material, numQuestions });
      setQuiz(generatedQuiz);
      
      // Reset player state
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setShowExplanation(false);
      setScore(0);
      setQuizComplete(false);
      
      toast({ title: 'Quiz Generated!', description: 'Your custom quiz is ready.' });
    } catch (error: any) {
      toast({ title: 'Generation Failed', description: error.message || 'An error occurred.', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (showExplanation) return; // Prevent changing answer after submission
    setSelectedOption(optionIndex);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || !quiz) return;
    
    const currentQuestion = quiz.questions[currentQuestionIndex];
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (!quiz) return;
    
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handleReset = () => {
    setQuiz(null);
    setTopic('');
    setMaterial('');
  };

  if (quizComplete && quiz) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-6">
        <Card className="w-full max-w-lg text-center border-border/60 shadow-lg">
          <CardHeader>
            <div className="mx-auto bg-primary/10 w-16 h-16 flex items-center justify-center rounded-full mb-4">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl">Quiz Complete!</CardTitle>
            <CardDescription>{quiz.title}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-5xl font-bold text-primary">
              {score} / {quiz.questions.length}
            </div>
            <p className="text-muted-foreground">
              {score === quiz.questions.length ? "Perfect score! You've mastered this topic." : "Great effort! Review the material to improve your score next time."}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center pb-8">
            <Button onClick={handleReset} variant="outline" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Generate Another Quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (quiz) {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    return (
      <div className="max-w-3xl mx-auto py-12 px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-headline text-2xl font-bold">{quiz.title}</h1>
            <p className="text-muted-foreground text-sm">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
          </div>
          <div className="text-primary font-bold text-xl">
            Score: {score}
          </div>
        </div>

        <Card className="border-border/60 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl leading-relaxed">{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={showExplanation}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    selectedOption === idx && !showExplanation
                      ? 'border-primary bg-primary/5'
                      : showExplanation && idx === currentQuestion.correctAnswer
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                      : showExplanation && selectedOption === idx && idx !== currentQuestion.correctAnswer
                      ? 'border-destructive bg-destructive/10 text-destructive'
                      : 'border-transparent bg-muted/50 hover:bg-muted/80'
                  }`}
                >
                  <span className="font-medium">{option}</span>
                  {showExplanation && idx === currentQuestion.correctAnswer && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                  {showExplanation && selectedOption === idx && idx !== currentQuestion.correctAnswer && <XCircle className="w-5 h-5 text-destructive" />}
                </button>
              ))}
            </div>

            {showExplanation && (
              <div className={`mt-6 p-4 rounded-xl border ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-destructive/5 border-destructive/20'}`}>
                <h4 className={`font-semibold mb-1 ${isCorrect ? 'text-emerald-800' : 'text-destructive'}`}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </h4>
                <p className="text-sm text-foreground/80">{currentQuestion.explanation}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-muted/20 border-t pt-6 flex justify-end">
            {!showExplanation ? (
              <Button onClick={handleCheckAnswer} disabled={selectedOption === null} size="lg">
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNextQuestion} size="lg" className="gap-2">
                {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'View Results'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-6">
      <Card className="w-full max-w-xl border-border/60 shadow-lg">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto bg-primary/10 w-16 h-16 flex items-center justify-center rounded-full mb-4">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">AI Quiz Generator</CardTitle>
          <CardDescription>Instantly generate interactive quizzes from any topic or study material.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic (Required)</Label>
            <Input 
              id="topic" 
              placeholder="e.g., Photosynthesis, World War II, React Hooks" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isGenerating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="numQuestions">Number of Questions: {numQuestions}</Label>
            <input 
              type="range" 
              id="numQuestions"
              min="1" 
              max="20" 
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              disabled={isGenerating}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="material">Source Material (Optional)</Label>
            <Textarea 
              id="material" 
              placeholder="Paste text from your notes, articles, or books here to base the quiz on specific content..." 
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              disabled={isGenerating}
              className="min-h-[120px]"
            />
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !topic} 
            className="w-full h-12 text-base gap-2"
          >
            {isGenerating ? (
              'Generating Magic...'
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Quiz
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
