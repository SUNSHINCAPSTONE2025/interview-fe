import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Play, Target, Clock, Lightbulb, Loader2 } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { sessionsApi } from "@/api/sessions";
import { useToast } from "@/hooks/use-toast";
import type { PracticeType } from "@/types/session";

export default function PracticeGuide() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [practiceType, setPracticeType] = useState<PracticeType | "">("");
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  const practiceTypes = {
    "soft": { label: "소프트 질문", count: 5 },
    "job": { label: "직무 질문", count: 5 }
  };

  const tips = [
    "STAR 방법을 사용하여 답변 구조화 (상황, 과제, 행동, 결과)",
    "답변하는 동안 카메라와 시선을 유지하세요",
    "답변하기 전에 잠시 멈춰서 생각을 정리하세요",
    "명확하고 적절한 속도로 말하세요 - 분당 150-160단어를 목표로 하세요"
  ];

  // 선택된 유형의 질문 개수와 예상 시간 계산
  const selectedTypeData = practiceType ? practiceTypes[practiceType as keyof typeof practiceTypes] : null;
  const estimatedTime = selectedTypeData ? selectedTypeData.count * 2 : 0; // 질문당 2분

  // 질문 생성 및 다음 페이지로 이동
  const handleStartPractice = async () => {
    if (!id || !practiceType) {
      toast({
        title: "오류",
        description: "연습 유형을 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingQuestions(true);

    try {
      const interviewId = parseInt(id);

      // 세션 시작 API 호출 (질문 포함)
      const response = await sessionsApi.startSession(interviewId, {
        practice_type: practiceType,
        count: 5, // 5개 고정
      });

      toast({
        title: "세션 시작",
        description: `${response.questions.length}개의 질문으로 세션이 시작되었습니다.`,
      });

      // 세션 ID와 질문을 가지고 다음 페이지로 이동
      navigate(`/practice/${id}/setup?type=${practiceType}`, {
        state: {
          sessionId: response.session_id,
          questions: response.questions,
        }
      });
    } catch (error) {
      console.error("Failed to start session:", error);
      toast({
        title: "세션 시작 실패",
        description: "세션을 시작하는 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
      setIsGeneratingQuestions(false);
    }
  };

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
              <h1 className="text-3xl font-bold">연습 가이드</h1>
              <p className="text-muted-foreground">면접 연습을 시작합니다</p>
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
                  {Object.entries(practiceTypes).map(([key, data]) => (
                    <div key={key} className="flex items-center space-x-2 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                      <RadioGroupItem value={key} id={key} />
                      <Label htmlFor={key} className="flex-1 cursor-pointer">
                        {data.label}
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

          {/* Step 2: Tips and Start */}
          {step === 2 && (
            <div className="space-y-6">
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
                      <p>• 유형: {selectedTypeData?.label}</p>
                      <p>• 질문 개수: {selectedTypeData?.count}개</p>
                      <p>• 예상 시간: 약 {estimatedTime}분</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={isGeneratingQuestions}
                >
                  뒤로
                </Button>
                <Button
                  variant="hero"
                  onClick={handleStartPractice}
                  disabled={isGeneratingQuestions}
                  className="shadow-hover"
                >
                  {isGeneratingQuestions ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      질문 생성 중...
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      연습 시작
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}