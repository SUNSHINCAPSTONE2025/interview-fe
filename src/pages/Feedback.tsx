import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Download,
  Video,
  Mic,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { feedbackApi } from "@/api/feedback";
import { ApiError } from "@/lib/api";

export default function Feedback() {
  const { id } = useParams();
  const sessionId = Number(id);
  const queryClient = useQueryClient();

  // 표정 피드백 조회 (동기 처리)
  // GET 요청 시 즉시 분석 수행 후 결과 반환 (예상 1-5초)
  // 409 에러 없음 - 분석 실패 시 500 에러 발생
  const {
    data: expressionData,
    isLoading: expressionLoading,
    error: expressionError,
  } = useQuery({
    queryKey: ["expression-feedback", sessionId],
    queryFn: () => feedbackApi.getExpressionFeedback(sessionId),
    enabled: !!sessionId,
  });

  // 자세 피드백 조회 (비동기 처리)
  // 분석 시작(POST)과 결과 조회(GET)가 분리됨
  // 409 에러 발생 가능 - 분석 미완료 시 "분석 시작" 버튼 표시
  const {
    data: postureData,
    isLoading: postureLoading,
    error: postureError,
  } = useQuery({
    queryKey: ["posture-feedback", sessionId],
    queryFn: () => feedbackApi.getPoseFeedback(sessionId),
    enabled: !!sessionId,
    retry: (failureCount, error) => {
      // 409 에러(분석 미완료)는 재시도하지 않음
      if (error instanceof ApiError && error.status === 409) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // 목소리 피드백 조회 (준비 - BE 미구현이므로 비활성화)
  const {
    data: voiceData,
    isLoading: voiceLoading,
    error: voiceError,
  } = useQuery({
    queryKey: ["voice-feedback", sessionId],
    queryFn: () => feedbackApi.getVoiceFeedback(sessionId),
    enabled: false, // BE 구현 완료 시 true로 변경
  });

  // 자세 분석 시작
  const startPoseAnalysisMutation = useMutation({
    mutationFn: () => feedbackApi.startPoseAnalysis(sessionId),
    onSuccess: () => {
      // 분석 시작 후 주기적으로 결과 확인
      const interval = setInterval(() => {
        queryClient.invalidateQueries({ queryKey: ["posture-feedback", sessionId] });
      }, 3000); // 3초마다 확인

      // 30초 후 중지
      setTimeout(() => clearInterval(interval), 30000);
    },
  });

  // 로딩 상태
  const isLoading = expressionLoading || postureLoading;

  // 자세 분석 상태 확인
  const isPoseAnalyzing =
    postureError instanceof ApiError && postureError.status === 409;

  // 전체 점수 계산 (표정 + 자세 + 목소리 평균)
  const calculateOverallScore = () => {
    const scores = [
      expressionData?.overall_score,
      postureData?.overall_score,
      voiceData?.overall_score,
    ].filter((score): score is number => score !== undefined);

    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  const overallScore = calculateOverallScore();
  const previousScore = 73; // TODO: 이전 세션 점수 조회 필요
  const improvement = overallScore - previousScore;
  const improvementTrend = improvement > 0 ? "up" : "down";

  // 로딩 화면
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">피드백을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 화면
  if (expressionError && !isPoseAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
            <h2 className="text-xl font-bold">피드백을 불러올 수 없습니다</h2>
            <p className="text-muted-foreground">
              {expressionError instanceof ApiError
                ? expressionError.message
                : "알 수 없는 오류가 발생했습니다."}
            </p>
            <Button asChild>
              <Link to={`/session/${id}`}>세션으로 돌아가기</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <p className="text-muted-foreground">세션 #{sessionId}</p>
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
                <div className="text-5xl font-bold text-primary">{overallScore}</div>
                <Badge variant={improvementTrend === "up" ? "default" : "destructive"}>
                  {improvementTrend === "up" ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(improvement)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">이전: {previousScore}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Video className="h-4 w-4" />
                표정 기반
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-3">
                {expressionData?.overall_score ?? 0}점
              </div>
              <Progress value={expressionData?.overall_score ?? 0} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">시선 • 눈깜빡임 • 입꼬리</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Mic className="h-4 w-4" />
                자세 기반
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isPoseAnalyzing ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    분석 준비 중...
                  </div>
                  <Button
                    size="sm"
                    onClick={() => startPoseAnalysisMutation.mutate()}
                    disabled={startPoseAnalysisMutation.isPending}
                  >
                    {startPoseAnalysisMutation.isPending ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        분석 중...
                      </>
                    ) : (
                      "분석 시작"
                    )}
                  </Button>
                </div>
              ) : (
                <>
                  <div className="text-3xl font-bold mb-3">
                    {postureData?.overall_score ?? 0}점
                  </div>
                  <Progress value={postureData?.overall_score ?? 0} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">어깨 • 고개 • 손</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detailed Feedback */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle>세부 피드백</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="expression" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="expression">표정</TabsTrigger>
                <TabsTrigger value="posture">자세</TabsTrigger>
                <TabsTrigger value="voice" disabled={!voiceData}>
                  목소리 {!voiceData && "(준비 중)"}
                </TabsTrigger>
              </TabsList>

              {/* 표정 탭 */}
              <TabsContent value="expression">
                {expressionData ? (
                  <div className="space-y-4">
                    <Card className="bg-primary/10 border-primary/20">
                      <CardContent className="p-6">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-2">표정 총 점수</p>
                          <div className="text-5xl font-bold text-primary">
                            {expressionData.overall_score}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <h3 className="font-semibold text-lg">세부 지표</h3>

                    <Card className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">시선</span>
                          <span className="text-xl font-bold text-primary">
                            {expressionData.gaze}점
                          </span>
                        </div>
                        <Progress value={expressionData.gaze} className="h-2" />
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">눈 깜빡임</span>
                          <span className="text-xl font-bold text-primary">
                            {expressionData.eye_blink}점
                          </span>
                        </div>
                        <Progress value={expressionData.eye_blink} className="h-2" />
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">입꼬리</span>
                          <span className="text-xl font-bold text-primary">
                            {expressionData.mouth}점
                          </span>
                        </div>
                        <Progress value={expressionData.mouth} className="h-2" />
                      </CardContent>
                    </Card>

                    {expressionData.comment && (
                      <Card className="bg-muted/30">
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2">코멘트</h4>
                          <p className="text-sm text-muted-foreground">
                            {expressionData.comment}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    표정 피드백 데이터가 없습니다.
                  </div>
                )}
              </TabsContent>

              {/* 자세 탭 */}
              <TabsContent value="posture">
                {isPoseAnalyzing ? (
                  <div className="text-center py-8 space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                    <div>
                      <p className="text-muted-foreground mb-4">
                        자세 분석이 준비되지 않았습니다.
                      </p>
                      <Button
                        onClick={() => startPoseAnalysisMutation.mutate()}
                        disabled={startPoseAnalysisMutation.isPending}
                      >
                        {startPoseAnalysisMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            분석 중...
                          </>
                        ) : (
                          "자세 분석 시작"
                        )}
                      </Button>
                    </div>
                  </div>
                ) : postureData ? (
                  <div className="space-y-4">
                    <Card className="bg-primary/10 border-primary/20">
                      <CardContent className="p-6">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-2">자세 총 점수</p>
                          <div className="text-5xl font-bold text-primary">
                            {postureData.overall_score}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <h3 className="font-semibold text-lg">세부 지표</h3>

                    <Card className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">어깨 정렬</span>
                          <span className="text-xl font-bold text-primary">
                            {postureData.shoulder}점
                          </span>
                        </div>
                        <Progress value={postureData.shoulder} className="h-2" />
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">고개 수평</span>
                          <span className="text-xl font-bold text-primary">
                            {postureData.head}점
                          </span>
                        </div>
                        <Progress value={postureData.head} className="h-2" />
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">손 위치</span>
                          <span className="text-xl font-bold text-primary">
                            {postureData.hand}점
                          </span>
                        </div>
                        <Progress value={postureData.hand} className="h-2" />
                      </CardContent>
                    </Card>

                    {postureData.problem_sections &&
                      postureData.problem_sections.length > 0 && (
                        <Card className="bg-muted/30">
                          <CardContent className="p-4">
                            <h4 className="font-semibold mb-3">문제 구간</h4>
                            <div className="space-y-2">
                              {postureData.problem_sections.map((section, index) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-3 text-sm border-l-2 border-destructive pl-3"
                                >
                                  <span className="text-muted-foreground">
                                    {section.start_sec}s - {section.end_sec}s
                                  </span>
                                  <span>{section.issue}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    자세 피드백 데이터가 없습니다.
                  </div>
                )}
              </TabsContent>

              {/* 목소리 탭 (준비) */}
              <TabsContent value="voice">
                {voiceData ? (
                  <div className="space-y-4">
                    <Card className="bg-primary/10 border-primary/20">
                      <CardContent className="p-6">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-2">목소리 총 점수</p>
                          <div className="text-5xl font-bold text-primary">
                            {voiceData.overall_score}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <h3 className="font-semibold text-lg">세부 지표</h3>

                    <Card className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">떨림</span>
                          <span className="text-xl font-bold text-primary">
                            {voiceData.tremor}점
                          </span>
                        </div>
                        <Progress value={voiceData.tremor} className="h-2" />
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">공백</span>
                          <span className="text-xl font-bold text-primary">
                            {voiceData.blank}점
                          </span>
                        </div>
                        <Progress value={voiceData.blank} className="h-2" />
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">억양</span>
                          <span className="text-xl font-bold text-primary">
                            {voiceData.tone}점
                          </span>
                        </div>
                        <Progress value={voiceData.tone} className="h-2" />
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">속도</span>
                          <span className="text-xl font-bold text-primary">
                            {voiceData.speed}점
                          </span>
                        </div>
                        <Progress value={voiceData.speed} className="h-2" />
                      </CardContent>
                    </Card>

                    {voiceData.speech && (
                      <Card className="bg-muted/30">
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2">발화 텍스트 (STT)</h4>
                          <p className="text-sm text-muted-foreground">{voiceData.speech}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    목소리 피드백 기능은 준비 중입니다.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button asChild variant="outline">
            <Link to={`/session/${id}`}>세션으로 돌아가기</Link>
          </Button>
          <Button asChild variant="hero">
            <Link to={`/practice/${id}`}>다시 연습하기</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
