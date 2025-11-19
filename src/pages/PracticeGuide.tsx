import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Play, Target, Clock, Lightbulb } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";

export default function PracticeGuide() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [practiceType, setPracticeType] = useState("");

  // Mock session data - TODO: DB에서 가져올 것
  const session = {
    id: "1",
    title: "구글 소프트웨어 엔지니어",
    mode: "Interview" as const,
    totalQuestions: 15,
    practiceTypes: {
      "technical": { label: "기술 질문", count: 8 },
      "behavioral": { label: "소프트 질문", count: 7 }
    }
  };

  const tips = [
    "STAR 방법을 사용하여 답변 구조화 (상황, 과제, 행동, 결과)",
    "답변하는 동안 카메라와 시선을 유지하세요",
    "답변하기 전에 잠시 멈춰서 생각을 정리하세요",
    "명확하고 적절한 속도로 말하세요 - 분당 150-160단어를 목표로 하세요"
  ];

  const getSelectedTypeInfo = () => {
    if (!practiceType) return null;
    return session.practiceTypes[practiceType as keyof typeof session.practiceTypes];
  };

  const estimatedTime = getSelectedTypeInfo()?.count ? getSelectedTypeInfo()!.count * 2 : 0;

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

          {/* Practice Type Selection & Summary */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                연습 유형 선택
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup value={practiceType} onValueChange={setPracticeType}>
                {Object.entries(session.practiceTypes).map(([key, typeInfo]) => (
                  <div key={key} className="flex items-center space-x-2 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value={key} id={key} />
                    <Label htmlFor={key} className="flex-1 cursor-pointer">
                      {typeInfo.label} ({typeInfo.count}개)
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {practiceType && (
                <div className="mt-6 space-y-4">
                  {/* Tips */}
                  <Card className="bg-muted/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Lightbulb className="h-4 w-4" />
                        연습 팁
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
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

                  {/* Summary */}
                  <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-base">연습 준비 완료</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">유형</span>
                        <span className="font-medium">{getSelectedTypeInfo()?.label}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">질문 개수</span>
                        <Badge>{getSelectedTypeInfo()?.count}개</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">예상 시간</span>
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          약 {estimatedTime}분
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="flex justify-end">
                <Button 
                  onClick={() => navigate(`/practice-room/${id}`)}
                  disabled={!practiceType}
                  size="lg"
                >
                  <Play className="h-4 w-4 mr-2" />
                  연습 시작
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}