import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  RotateCcw,
  Download,
  Video,
  Mic
} from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";

export default function Feedback() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const attemptId = searchParams.get("attempt");

  const feedbackData = {
    overallScore: 78,
    previousScore: 73,
    improvement: 5,
    date: "2025-09-28",
    duration: "45분",
    videoScore: 72,
    audioScore: 84,
    questions: [
      {
        id: 1,
        prompt: "최근에 해결한 어려운 기술 문제에 대해 말씀해주세요.",
        transcript: "이전 회사 TechCorp에서 React 애플리케이션의 성능 문제로 로딩 시간이 느려지는 심각한 문제가 있었습니다...",
        videoFeedback: {
          // 자세
          shoulderTilt: {
            score: 85,
            feedback: "어깨의 균형이 잘 유지되고 있습니다. 약간의 긴장이 보이지만 전반적으로 안정적인 자세입니다."
          },
          // 표정
          gaze: {
            score: 75,
            feedback: "카메라와의 시선 접촉이 양호하나, 가끔 시선이 아래로 향하는 경향이 있습니다."
          },
          blink: {
            score: 80,
            rate: 18,
            feedback: "자연스러운 눈 깜빡임 빈도입니다. (분당 18회)"
          },
          smile: {
            score: 70,
            feedback: "입꼬리가 자연스럽지만 좀 더 긍정적인 표정을 유지하면 좋겠습니다."
          },
          // 목소리
          voiceShake: {
            score: 82,
            feedback: "목소리 떨림이 거의 없이 안정적입니다."
          },
          silence: {
            score: 88,
            totalSeconds: 3.2,
            feedback: "불필요한 침묵이 거의 없습니다. (총 3.2초)"
          },
          speed: {
            score: 85,
            wpm: 160,
            feedback: "적절한 말하기 속도를 유지하고 있습니다. (분당 160단어)"
          }
        },
        audioFeedback: {
          stutter: {
            score: 78,
            count: 8,
            feedback: "약간의 말 더듬이 관찰되었습니다. (8회) 더 자연스럽게 말하기 위해 충분히 호흡하세요."
          },
          repeatWords: {
            score: 82,
            words: ["그", "저기", "음"],
            count: 12,
            feedback: "반복 단어가 일부 나타났습니다. '그', '저기', '음'과 같은 불필요한 단어를 줄이세요."
          }
        }
      }
    ],
    strengths: [
      "STAR 방법을 사용한 명확하고 체계적인 답변",
      "구체적인 예시와 수치 제시",
      "안정적인 목소리 톤",
      "자연스러운 말하기 속도 유지"
    ],
    improvements: [
      "카메라와 시선 접촉을 더 일관되게 유지하세요",
      "긍정적인 표정을 더 자주 지으세요",
      "말 더듬을 줄이기 위해 천천히 말하세요",
      "불필요한 반복 단어('그', '음', '저기')를 최소화하세요"
    ]
  };

  const improvementTrend = feedbackData.improvement > 0 ? "up" : "down";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/session/${id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1">연습 피드백</h1>
            <p className="text-muted-foreground">
              {feedbackData.date} • {feedbackData.duration}
            </p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            내보내기
          </Button>
        </div>

        {/* Overall Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">전체 점수</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-3">
                <div className="text-5xl font-bold text-primary">
                  {feedbackData.overallScore}
                </div>
                <Badge variant={improvementTrend === "up" ? "default" : "destructive"}>
                  {improvementTrend === "up" ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(feedbackData.improvement)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                이전: {feedbackData.previousScore}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Video className="h-4 w-4" />
                영상 기반
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-3">{feedbackData.videoScore}점</div>
              <Progress value={feedbackData.videoScore} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                자세 • 표정 • 목소리
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Mic className="h-4 w-4" />
                음성 기반
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-3">{feedbackData.audioScore}점</div>
              <Progress value={feedbackData.audioScore} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                말 더듬 • 반복 단어
              </p>
            </CardContent>
          </Card>
        </div>


        {/* Detailed Feedback per Question */}
        <div className="space-y-6">
          {feedbackData.questions.map((question, index) => (
            <Card key={question.id} className="bg-gradient-card shadow-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-3">질문 {index + 1}</Badge>
                    <CardTitle className="text-lg">{question.prompt}</CardTitle>
                  </div>
                  <Button variant="outline" size="sm">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    다시 시도
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="transcript" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="transcript">답변</TabsTrigger>
                    <TabsTrigger value="expression">표정</TabsTrigger>
                    <TabsTrigger value="voice">목소리</TabsTrigger>
                    <TabsTrigger value="posture">자세</TabsTrigger>
                  </TabsList>

                  <TabsContent value="transcript">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-3">음성-텍스트 변환</h4>
                      <p className="text-sm leading-relaxed">{question.transcript}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="expression">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* 좌측: 동영상 */}
                      <div className="bg-muted/30 rounded-lg aspect-video flex items-center justify-center">
                        <Video className="h-12 w-12 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground ml-2">동영상 플레이어</p>
                      </div>
                      
                      {/* 우측: 점수 */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg mb-4">표정 분석</h3>
                        
                        <Card className="bg-muted/30">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">시선</span>
                              <span className="text-2xl font-bold text-primary">
                                {question.videoFeedback.gaze.score}
                              </span>
                            </div>
                            <Progress value={question.videoFeedback.gaze.score} className="h-2 mb-3" />
                            <p className="text-sm text-muted-foreground">
                              {question.videoFeedback.gaze.feedback}
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="bg-muted/30">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">눈 깜빡임</span>
                              <span className="text-2xl font-bold text-primary">
                                {question.videoFeedback.blink.score}
                              </span>
                            </div>
                            <Progress value={question.videoFeedback.blink.score} className="h-2 mb-3" />
                            <p className="text-sm text-muted-foreground">
                              {question.videoFeedback.blink.feedback}
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="bg-muted/30">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">입꼬리</span>
                              <span className="text-2xl font-bold text-primary">
                                {question.videoFeedback.smile.score}
                              </span>
                            </div>
                            <Progress value={question.videoFeedback.smile.score} className="h-2 mb-3" />
                            <p className="text-sm text-muted-foreground">
                              {question.videoFeedback.smile.feedback}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="voice">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* 좌측: 동영상 */}
                      <div className="bg-muted/30 rounded-lg aspect-video flex items-center justify-center">
                        <Video className="h-12 w-12 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground ml-2">동영상 플레이어</p>
                      </div>
                      
                      {/* 우측: 점수 */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg mb-4">목소리 분석</h3>
                        
                        <Card className="bg-muted/30">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">목소리 떨림</span>
                              <span className="text-2xl font-bold text-primary">
                                {question.videoFeedback.voiceShake.score}
                              </span>
                            </div>
                            <Progress value={question.videoFeedback.voiceShake.score} className="h-2 mb-3" />
                            <p className="text-sm text-muted-foreground">
                              {question.videoFeedback.voiceShake.feedback}
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="bg-muted/30">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">공백</span>
                              <span className="text-2xl font-bold text-primary">
                                {question.videoFeedback.silence.score}
                              </span>
                            </div>
                            <Progress value={question.videoFeedback.silence.score} className="h-2 mb-3" />
                            <p className="text-sm text-muted-foreground">
                              {question.videoFeedback.silence.feedback}
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="bg-muted/30">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">말하기 속도</span>
                              <span className="text-2xl font-bold text-primary">
                                {question.videoFeedback.speed.wpm}
                              </span>
                            </div>
                            <Progress value={question.videoFeedback.speed.score} className="h-2 mb-3" />
                            <p className="text-sm text-muted-foreground">
                              {question.videoFeedback.speed.feedback}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="posture">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* 좌측: 동영상 */}
                      <div className="bg-muted/30 rounded-lg aspect-video flex items-center justify-center">
                        <Video className="h-12 w-12 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground ml-2">동영상 플레이어</p>
                      </div>
                      
                      {/* 우측: 점수 */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg mb-4">자세 분석</h3>
                        
                        <Card className="bg-muted/30">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">어깨 기울기</span>
                              <span className="text-2xl font-bold text-primary">
                                {question.videoFeedback.shoulderTilt.score}
                              </span>
                            </div>
                            <Progress value={question.videoFeedback.shoulderTilt.score} className="h-2 mb-3" />
                            <p className="text-sm text-muted-foreground">
                              {question.videoFeedback.shoulderTilt.feedback}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button asChild variant="outline">
            <Link to={`/session/${id}`}>
              세션으로 돌아가기
            </Link>
          </Button>
          <Button asChild variant="hero">
            <Link to={`/practice/${id}`}>
              다시 연습하기
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
