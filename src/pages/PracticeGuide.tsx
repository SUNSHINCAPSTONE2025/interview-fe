import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Play, Target, Clock, Lightbulb, Star } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";

export default function PracticeGuide() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [practiceType, setPracticeType] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  // Mock session data
  const session = {
    id: "1",
    title: "구글 소프트웨어 엔지니어",
    mode: "Interview" as const,
    lastFeedback: "STAR 답변에서 더 구체적인 예시를 제공하는 데 집중하세요",
    totalQuestions: 15,
    practiceTypes: {
      "technical": "기술 질문 (8개)",
      "behavioral": "행동 질문 (7개)", 
      "both": "전체 면접 (15개)"
    }
  };

  const goals = [
    { id: "examples", label: "답변에 구체적인 예시 사용", time: "5분" },
    { id: "pace", label: "최적의 속도로 말하기 연습", time: "3분" },
    { id: "structure", label: "STAR 방법 구조 개선", time: "7분" },
    { id: "confidence", label: "자신감 있는 전달 구축", time: "4분" }
  ];

  const tips = [
    "STAR 방법을 사용하여 답변 구조화 (상황, 과제, 행동, 결과)",
    "답변하는 동안 카메라와 시선을 유지하세요",
    "답변하기 전에 잠시 멈춰서 생각을 정리하세요",
    "명확하고 적절한 속도로 말하세요 - 분당 150-160단어를 목표로 하세요"
  ];

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const estimatedTime = selectedGoals.length * 3 + 5; // Rough estimation

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/session/${id}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{session.title}</h1>
              <p className="text-muted-foreground">연습 가이드</p>
            </div>
          </div>

          {/* Step 1: Practice Type Selection */}
          {step === 1 && (
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  연습 유형 선택
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup value={practiceType} onValueChange={setPracticeType}>
                  {Object.entries(session.practiceTypes).map(([key, label]) => (
                    <div key={key} className="flex items-center space-x-2 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                      <RadioGroupItem value={key} id={key} />
                      <Label htmlFor={key} className="flex-1 cursor-pointer">
                        {label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="flex justify-end">
                  <Button 
                    onClick={() => setStep(2)} 
                    disabled={!practiceType}
                  >
                    계속
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Goals Selection */}
          {step === 2 && (
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  오늘의 목표
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  이번 연습 세션에서 집중할 2-3개의 구체적인 영역을 선택하세요
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {goals.map((goal) => (
                    <div
                      key={goal.id}
                      onClick={() => handleGoalToggle(goal.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                        selectedGoals.includes(goal.id)
                          ? "border-primary bg-primary/5 shadow-button"
                          : "border-border hover:border-primary/50 hover:bg-accent/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Label className="cursor-pointer">{goal.label}</Label>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {goal.time}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedGoals.length > 0 && (
                  <div className="p-4 bg-success-light rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">예상 시간:</span>
                      <Badge variant="outline">~{estimatedTime}분</Badge>
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    뒤로
                  </Button>
                  <Button 
                    onClick={() => setStep(3)} 
                    disabled={selectedGoals.length === 0}
                  >
                    계속
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Tips and Start */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Last Feedback */}
              {session.lastFeedback && (
                <Card className="bg-gradient-card shadow-card border-warning/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-warning">
                      <Lightbulb className="h-5 w-5" />
                      지난 세션의 주요 인사이트
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{session.lastFeedback}</p>
                  </CardContent>
                </Card>
              )}

              {/* Tips */}
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    연습 팁
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-medium text-primary">{index + 1}</span>
                        </div>
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Session Summary */}
              <Card className="bg-gradient-primary text-primary-foreground shadow-hover">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">연습 준비 완료!</h3>
                    <div className="space-y-2 text-sm opacity-90">
                      <p>• 유형: {session.practiceTypes[practiceType as keyof typeof session.practiceTypes]}</p>
                      <p>• 목표: {selectedGoals.length}개 선택됨</p>
                      <p>• 예상 시간: ~{estimatedTime}분</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  뒤로
                </Button>
                <Button 
                  variant="hero" 
                  onClick={() => navigate(`/practice/${id}/run`)}
                  className="shadow-hover"
                >
                  <Play className="h-5 w-5 mr-2" />
                  연습 시작
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}