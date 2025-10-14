import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ArrowRight, Briefcase, Presentation, Calendar, Plus, Minus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

type SessionMode = "Interview" | "Presentation" | null;

interface QAItem {
  question: string;
  answer: string;
}

export default function NewSession() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<SessionMode>(null);
  const [formData, setFormData] = useState({
    // Interview fields
    company: "",
    role: "",
    interviewDate: "",
    jobCategory: "",
    jobDescription: "",
    companyValues: "",
    // Presentation fields
    title: "",
    duration: "",
    script: "",
    slidesUrl: "",
    audienceType: "",
  });
  const [qaItems, setQAItems] = useState<QAItem[]>([{ question: "", answer: "" }]);

  const addQAItem = () => {
    setQAItems([...qaItems, { question: "", answer: "" }]);
  };

  const removeQAItem = (index: number) => {
    if (qaItems.length > 1) {
      setQAItems(qaItems.filter((_, i) => i !== index));
    }
  };

  const updateQAItem = (index: number, field: keyof QAItem, value: string) => {
    const updated = qaItems.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setQAItems(updated);
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCreate = () => {
    // Here you would normally save the session
    console.log("Creating session:", { mode, formData, qaItems });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">새 세션 만들기</h1>
              <p className="text-muted-foreground">{step} / 3 단계</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2 mb-8">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          {/* Step 1: Mode Selection */}
          {step === 1 && (
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle>연습 모드 선택</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setMode("Interview")}
                    className={`p-6 rounded-lg border-2 transition-all duration-300 text-left ${
                      mode === "Interview" 
                        ? "border-primary bg-primary/5 shadow-button" 
                        : "border-border hover:border-primary/50 hover:bg-accent/50"
                    }`}
                  >
                    <Briefcase className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-semibold text-lg mb-2">면접 연습</h3>
                    <p className="text-muted-foreground text-sm">
                      이력서와 직무 설명을 기반으로 맞춤형 질문으로 면접을 준비하세요.
                    </p>
                  </button>
                  
                  <button
                    onClick={() => setMode("Presentation")}
                    className={`p-6 rounded-lg border-2 transition-all duration-300 text-left ${
                      mode === "Presentation" 
                        ? "border-primary bg-primary/5 shadow-button" 
                        : "border-border hover:border-primary/50 hover:bg-accent/50"
                    }`}
                  >
                    <Presentation className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-semibold text-lg mb-2">발표 연습</h3>
                    <p className="text-muted-foreground text-sm">
                      스크립트 기반 연습과 전달 피드백으로 발표를 완벽하게 만드세요.
                    </p>
                  </button>
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={handleNext} 
                    disabled={!mode}
                    variant="default"
                  >
                    계속
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Mode-specific Form */}
          {step === 2 && mode === "Interview" && (
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle>면접 상세 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company">회사명 *</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      placeholder="예: 구글"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">직무 *</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      placeholder="예: 시니어 프론트엔드 개발자"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="interviewDate">면접 날짜</Label>
                  <Input
                    id="interviewDate"
                    type="date"
                    value={formData.interviewDate}
                    onChange={(e) => setFormData({...formData, interviewDate: e.target.value})}
                  />
                </div>

                <div>
                  <Label>직무 카테고리</Label>
                  <RadioGroup 
                    value={formData.jobCategory} 
                    onValueChange={(value) => setFormData({...formData, jobCategory: value})}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="technical" id="technical" />
                      <Label htmlFor="technical">기술직</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="product" id="product" />
                      <Label htmlFor="product">제품</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="design" id="design" />
                      <Label htmlFor="design">디자인</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="business" id="business" />
                      <Label htmlFor="business">비즈니스</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>이력서 Q&A *</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    본인의 배경과 경험에 대한 질문과 답변을 추가하세요.
                  </p>
                  {qaItems.map((item, index) => (
                    <div key={index} className="space-y-2 p-4 border border-border rounded-lg mb-4">
                      <div className="flex justify-between items-center">
                        <Label>질문 {index + 1}</Label>
                        {qaItems.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeQAItem(index)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <Input
                        placeholder="예: React를 사용한 이전 경험에 대해 말씀해주세요"
                        value={item.question}
                        onChange={(e) => updateQAItem(index, "question", e.target.value)}
                      />
                      <Textarea
                        placeholder="답변을 입력하세요..."
                        value={item.answer}
                        onChange={(e) => updateQAItem(index, "answer", e.target.value)}
                        rows={3}
                      />
                    </div>
                  ))}
                  <Button variant="outline" onClick={addQAItem} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    질문 추가
                  </Button>
                </div>

                <div>
                  <Label htmlFor="jobDescription">직무 설명</Label>
                  <Textarea
                    id="jobDescription"
                    value={formData.jobDescription}
                    onChange={(e) => setFormData({...formData, jobDescription: e.target.value})}
                    placeholder="직무 설명을 여기에 붙여넣으세요..."
                    rows={4}
                  />
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handlePrev}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    뒤로
                  </Button>
                  <Button onClick={handleNext}>
                    계속
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Presentation Form */}
          {step === 2 && mode === "Presentation" && (
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle>발표 상세 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title">발표 제목 *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="예: 헬스케어의 AI: 미래 전망"
                  />
                </div>

                <div>
                  <Label htmlFor="duration">예상 시간 (분)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    placeholder="예: 15"
                  />
                </div>

                <div>
                  <Label htmlFor="script">발표 스크립트 *</Label>
                  <Textarea
                    id="script"
                    value={formData.script}
                    onChange={(e) => setFormData({...formData, script: e.target.value})}
                    placeholder="발표 스크립트를 여기에 작성하세요..."
                    rows={8}
                  />
                </div>

                <div>
                  <Label htmlFor="slidesUrl">슬라이드 URL (선택사항)</Label>
                  <Input
                    id="slidesUrl"
                    value={formData.slidesUrl}
                    onChange={(e) => setFormData({...formData, slidesUrl: e.target.value})}
                    placeholder="https://docs.google.com/presentation/..."
                  />
                </div>

                <div>
                  <Label>청중 유형</Label>
                  <RadioGroup 
                    value={formData.audienceType} 
                    onValueChange={(value) => setFormData({...formData, audienceType: value})}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="peers" id="peers" />
                      <Label htmlFor="peers">동료/직장 동료</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="executives" id="executives" />
                      <Label htmlFor="executives">경영진/리더십</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="public" id="public" />
                      <Label htmlFor="public">일반 대중</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handlePrev}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    뒤로
                  </Button>
                  <Button onClick={handleNext}>
                    계속
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Summary & Create */}
          {step === 3 && (
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle>세션 요약</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h3 className="font-semibold text-lg mb-4">
                    {mode === "Interview" ? "면접" : "발표"} 연습 세션
                  </h3>
                  
                  {mode === "Interview" ? (
                    <div className="space-y-2 text-sm">
                      <p><strong>회사:</strong> {formData.company}</p>
                      <p><strong>직무:</strong> {formData.role}</p>
                      {formData.interviewDate && (
                        <p><strong>면접 날짜:</strong> {formData.interviewDate}</p>
                      )}
                      <p><strong>질문:</strong> {qaItems.length}개 준비됨</p>
                      <p><strong>카테고리:</strong> {formData.jobCategory || "지정되지 않음"}</p>
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm">
                      <p><strong>제목:</strong> {formData.title}</p>
                      {formData.duration && (
                        <p><strong>시간:</strong> {formData.duration}분</p>
                      )}
                      <p><strong>스크립트 길이:</strong> {formData.script.length}자</p>
                      <p><strong>청중:</strong> {formData.audienceType || "지정되지 않음"}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handlePrev}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    뒤로
                  </Button>
                  <Button onClick={handleCreate} variant="success">
                    세션 만들기
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}