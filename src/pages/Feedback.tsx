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
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { feedbackApi } from "@/api/feedback";
import { ApiError } from "@/lib/api";
import type { ExpressionFeedbackResponse, PostureFeedbackResponse, VoiceFeedbackResponse } from "@/types/feedback";

export default function Feedback() {
  const { id } = useParams();
  const sessionId = Number(id);
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // Get attempt_ids from URL
  const attemptIdsParam = searchParams.get("attempt_ids");
  const attemptIds = attemptIdsParam
    ? attemptIdsParam.split(",").map(Number).filter(Boolean)
    : [];

  // 표정 피드백 조회 (동기 처리) - 모든 attempts에 대해 병렬 조회
  // GET 요청 시 즉시 분석 수행 후 결과 반환 (예상 1-5초)
  const {
    data: expressionDataList,
    isLoading: expressionLoading,
    error: expressionError,
  } = useQuery({
    queryKey: ["expression-feedback", sessionId, attemptIds],
    queryFn: async (): Promise<ExpressionFeedbackResponse[]> => {
      if (attemptIds.length === 0) return [];

      // 모든 attempts에 대해 병렬 조회
      const promises = attemptIds.map(attemptId =>
        feedbackApi.getExpressionFeedback(sessionId, attemptId)
      );
      return Promise.all(promises);
    },
    enabled: !!sessionId && attemptIds.length > 0,
  });

  // 표정 피드백 평균 계산
  const expressionData = expressionDataList && expressionDataList.length > 0
    ? {
        overall_score: Math.round(
          expressionDataList.reduce((sum, fb) => sum + fb.overall_score, 0) / expressionDataList.length
        ),
        gaze: Math.round(
          expressionDataList.reduce((sum, fb) => sum + (fb.expression_analysis?.head_eye_gaze_rate?.value || 0), 0) / expressionDataList.length
        ),
        eye_blink: Math.round(
          expressionDataList.reduce((sum, fb) => sum + (fb.expression_analysis?.blink_stability?.value || 0), 0) / expressionDataList.length
        ),
        mouth: Math.round(
          expressionDataList.reduce((sum, fb) => sum + (fb.expression_analysis?.mouth_delta?.value || 0), 0) / expressionDataList.length
        ),
        comment: expressionDataList[0]?.feedback_summary,
      }
    : null;

  // 자세 피드백 조회 (비동기 처리) - 모든 attempts에 대해 병렬 조회
  // 분석 시작(POST)과 결과 조회(GET)가 분리됨
  const {
    data: postureDataList,
    isLoading: postureLoading,
    error: postureError,
  } = useQuery({
    queryKey: ["posture-feedback", sessionId, attemptIds],
    queryFn: async (): Promise<PostureFeedbackResponse[]> => {
      if (attemptIds.length === 0) return [];

      // 폴링으로 완료 대기하는 헬퍼 함수
      const waitForPoseAnalysis = async (attemptId: number): Promise<PostureFeedbackResponse> => {
        const maxAttempts = 20; // 최대 1분 대기 (3초 × 20)
        const pollInterval = 3000;

        for (let i = 0; i < maxAttempts; i++) {
          try {
            const feedback = await feedbackApi.getPoseFeedback(sessionId, attemptId);
            return feedback;
          } catch (error: any) {
            if (error instanceof ApiError && error.status === 409) {
              // 아직 분석 중 - 대기 후 재시도
              await new Promise(resolve => setTimeout(resolve, pollInterval));
            } else {
              throw error;
            }
          }
        }
        throw new Error(`Pose analysis timeout for attempt ${attemptId}`);
      };

      // 모든 attempts의 피드백 조회 (병렬)
      const promises = attemptIds.map(attemptId => waitForPoseAnalysis(attemptId));
      return Promise.all(promises);
    },
    enabled: !!sessionId && attemptIds.length > 0,
    retry: false, // 자체적으로 재시도 로직이 있으므로 비활성화
  });

  // 자세 피드백 평균 계산
  const postureData = postureDataList && postureDataList.length > 0
    ? {
        overall_score: Math.round(
          postureDataList.reduce((sum, fb) => sum + fb.overall_score, 0) / postureDataList.length
        ),
        shoulder: Math.round(
          postureDataList.reduce((sum, fb) => sum + fb.shoulder, 0) / postureDataList.length
        ),
        head: Math.round(
          postureDataList.reduce((sum, fb) => sum + fb.head, 0) / postureDataList.length
        ),
        hand: Math.round(
          postureDataList.reduce((sum, fb) => sum + fb.hand, 0) / postureDataList.length
        ),
        problem_sections: postureDataList[0]?.problem_sections,
      }
    : null;

  // 목소리 피드백 조회 - 모든 attempts에 대해 병렬 조회
  const {
    data: voiceDataList,
  } = useQuery({
    queryKey: ["voice-feedback", sessionId, attemptIds],
    queryFn: async (): Promise<VoiceFeedbackResponse[]> => {
      if (attemptIds.length === 0) return [];

      // 모든 attempts에 대해 병렬 조회
      const promises = attemptIds.map(attemptId =>
        feedbackApi.getVoiceFeedback(sessionId, attemptId)
      );
      return Promise.all(promises);
    },
    enabled: false, // BE 구현 완료 시 !!sessionId && attemptIds.length > 0으로 변경
  });

  // 목소리 피드백 평균 계산
  const voiceData = voiceDataList && voiceDataList.length > 0
    ? {
        overall_score: Math.round(
          voiceDataList.reduce((sum, fb) => sum + fb.overall_score, 0) / voiceDataList.length
        ),
        tremor: Math.round(
          voiceDataList.reduce((sum, fb) => sum + fb.tremor, 0) / voiceDataList.length
        ),
        blank: Math.round(
          voiceDataList.reduce((sum, fb) => sum + fb.blank, 0) / voiceDataList.length
        ),
        tone: Math.round(
          voiceDataList.reduce((sum, fb) => sum + fb.tone, 0) / voiceDataList.length
        ),
        speed: Math.round(
          voiceDataList.reduce((sum, fb) => sum + fb.speed, 0) / voiceDataList.length
        ),
        speech: voiceDataList[0]?.speech,
      }
    : null;

  // 자세 분석 시작 (모든 attempts에 대해 병렬 시작)
  const startPoseAnalysisMutation = useMutation({
    mutationFn: async () => {
      if (attemptIds.length === 0) {
        throw new Error("No attempt IDs found");
      }

      // 모든 attempts의 자세 분석을 병렬로 시작
      const promises = attemptIds.map(attemptId =>
        feedbackApi.startPoseAnalysis(sessionId, attemptId)
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      // 분석 시작 후 피드백 쿼리 다시 실행 (폴링 시작)
      queryClient.invalidateQueries({ queryKey: ["posture-feedback", sessionId, attemptIds] });
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
