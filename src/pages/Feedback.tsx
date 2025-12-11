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
  MessageSquare,
} from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { feedbackApi } from "@/api/feedback";
import { answerEvalApi } from "@/api/answerEval";
import { sessionsApi } from "@/api/sessions";
import { ApiError } from "@/lib/api";
import type {
  ExpressionFeedbackResponse,
  PostureFeedbackResponse,
  VoiceFeedbackResponse,
  AttemptFeedbackResponse,
} from "@/types/feedback";

// 평가 등급에 따라 Badge 스타일 반환
function getRatingBadgeStyle(rating: string | undefined) {
  if (!rating) return { variant: "secondary" as const, className: "" };

  const ratingLower = rating.toLowerCase();

  // 양호/우수 → 파랑색
  if (ratingLower.includes("양호") || ratingLower.includes("우수") ||
      ratingLower.includes("good") || ratingLower.includes("excellent")) {
    return { variant: "default" as const, className: "bg-blue-500 hover:bg-blue-600" };
  }

  // 미흡/개선 필요 → 빨강색
  if (ratingLower.includes("미흡") || ratingLower.includes("개선") ||
      ratingLower.includes("poor") || ratingLower.includes("needs improvement")) {
    return { variant: "destructive" as const, className: "" };
  }

  // 보통/중간 → 노랑색
  if (ratingLower.includes("보통") || ratingLower.includes("중간") ||
      ratingLower.includes("average") || ratingLower.includes("normal")) {
    return { variant: "secondary" as const, className: "bg-yellow-500 hover:bg-yellow-600 text-white" };
  }

  // 기본값
  return { variant: "secondary" as const, className: "" };
}

export default function Feedback() {
  const { id } = useParams(); // content_id or session_id (depends on caller)
  const [searchParams] = useSearchParams();

  // Get session_id from query parameter (priority) or URL path (fallback)
  const sessionIdParam = searchParams.get("session_id");
  const sessionId = sessionIdParam ? Number(sessionIdParam) : Number(id);

  // Get attempt_ids from URL
  const attemptIdsParam = searchParams.get("attempt_ids");
  const attemptIds = attemptIdsParam
    ? attemptIdsParam.split(",").map(Number).filter(Boolean)
    : [];

  // 중복 refetch를 방지하기 위한 공통 옵션 (포커스/재연결 시 재요청 끔, 5분 캐싱)
  const queryBaseOptions = {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000, // 5분
  };

  // 세션 정보 조회 (질문 목록 포함)
  const { data: sessionData } = useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => sessionsApi.getById(sessionId),
    enabled: !!sessionId,
    ...queryBaseOptions,
  });

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
    ...queryBaseOptions,
  });

  // 표정 피드백 평균 계산
  const expressionData = expressionDataList && expressionDataList.length > 0
    ? {
        overall_score: Math.round(
          expressionDataList.reduce((sum, fb) => sum + fb.overall_score, 0) / expressionDataList.length
        ),
        gaze_rating: expressionDataList[0]?.expression_analysis?.head_eye_gaze_rate?.rating || "-",
        eye_blink_rating: expressionDataList[0]?.expression_analysis?.blink_stability?.rating || "-",
        mouth_rating: expressionDataList[0]?.expression_analysis?.mouth_delta?.rating || "-",
        comment: expressionDataList[0]?.feedback_summary,
      }
    : null;

  // 자세 피드백 조회 (동기 처리) - 모든 attempts에 대해 병렬 조회
  // GET 요청 시 즉시 분석 수행 후 결과 반환 (표정과 동일)
  const {
    data: postureDataList,
    isLoading: postureLoading,
    error: postureError,
  } = useQuery({
    queryKey: ["posture-feedback", sessionId, attemptIds],
    queryFn: async (): Promise<PostureFeedbackResponse[]> => {
      if (attemptIds.length === 0) return [];

      // 모든 attempts에 대해 병렬 조회
      const promises = attemptIds.map(attemptId =>
        feedbackApi.getPoseFeedback(sessionId, attemptId)
      );
      return Promise.all(promises);
    },
    enabled: !!sessionId && attemptIds.length > 0,
    // 분석 대기(202) 응답이 있으면 완료될 때까지 3초 간격으로 폴링
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data || !Array.isArray(data) || data.length === 0) return false;
      const hasPending = data.some(
        (fb: PostureFeedbackResponse) => !fb.pose_analysis || fb.message === "pose_analysis_started" || fb.status === "pending"
      );
      return hasPending ? 3000 : false;
    },
    ...queryBaseOptions,
  });

  // 자세 피드백 평균 계산
  const postureData = postureDataList && postureDataList.length > 0
    ? (() => {
        const completed = postureDataList.filter(fb => fb.pose_analysis);
        if (completed.length === 0) return null;

        const sum = completed.reduce(
          (acc, fb) => {
            const pose = fb.pose_analysis!;
            acc.overall += pose.overall.value;
            acc.shoulder += pose.shoulder.value;
            acc.head += pose.head_tilt.value;
            acc.hand += pose.hand.value;
            return acc;
          },
          { overall: 0, shoulder: 0, head: 0, hand: 0 }
        );

        return {
          overall_score: Math.round(sum.overall / completed.length),
          shoulder: Math.round(sum.shoulder / completed.length),
          head: Math.round(sum.head / completed.length),
          hand: Math.round(sum.hand / completed.length),
          problem_sections: completed[0]?.problem_sections,
        };
      })()
    : null;

  // 목소리 피드백 조회 (동기 처리) - 모든 attempts에 대해 병렬 조회
  // GET 요청 시 즉시 분석 수행 후 결과 반환
  const {
    data: voiceDataList,
    isLoading: voiceLoading,
    error: voiceError,
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
    enabled: !!sessionId && attemptIds.length > 0, // 활성화
    ...queryBaseOptions,
  });

  // 목소리 피드백 평균 계산
  const voiceData = voiceDataList && voiceDataList.length > 0
    ? {
        overall_score: Math.round(
          voiceDataList.reduce((sum, fb) => sum + fb.total_score, 0) / voiceDataList.length
        ),
      }
    : null;

  // 답변 평가 조회 (텍스트 탭용) - 모든 attempts에 대해 병렬 조회
  const {
    data: textFeedbackList,
    isLoading: textLoading,
    error: textError,
  } = useQuery({
    queryKey: ["text-feedback", sessionId, attemptIds],
    queryFn: async (): Promise<AttemptFeedbackResponse[]> => {
      if (attemptIds.length === 0) return [];

      // 모든 attempts에 대해 병렬 조회
      const promises = attemptIds.map(attemptId =>
        answerEvalApi.getAttemptFeedback(sessionId, attemptId)
      );
      return Promise.all(promises);
    },
    enabled: !!sessionId && attemptIds.length > 0,
    ...queryBaseOptions,
  });

  // 로딩 상태
  const isLoading = expressionLoading || postureLoading || voiceLoading || textLoading;

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
  const previousScore = 0; // TODO: 이전 세션 점수 조회 필요
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
  if (expressionError || postureError || voiceError || textError) {
    const error = expressionError || postureError || voiceError || textError;
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
            <h2 className="text-xl font-bold">피드백을 불러올 수 없습니다</h2>
            <p className="text-muted-foreground">
              {error instanceof ApiError
                ? error.message
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                표정
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
                목소리
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-3">
                {voiceData?.overall_score ?? 0}점
              </div>
              <Progress value={voiceData?.overall_score ?? 0} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">떨림 • 공백 • 톤 • 속도</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Video className="h-4 w-4" />
                자세
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-3">
                {postureData?.overall_score ?? 0}점
              </div>
              <Progress value={postureData?.overall_score ?? 0} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">어깨 • 고개 • 손</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Feedback */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle>세부 피드백</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="text" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="text">텍스트</TabsTrigger>
                <TabsTrigger value="expression">표정</TabsTrigger>
                <TabsTrigger value="posture">자세</TabsTrigger>
                <TabsTrigger value="voice">목소리</TabsTrigger>
              </TabsList>

              {/* 텍스트 탭 */}
              <TabsContent value="text">
                {textFeedbackList && textFeedbackList.length > 0 ? (
                  <div className="space-y-6">
                    {textFeedbackList.map((feedback, index) => {
                      // 세션 질문 데이터에서 해당 질문 찾기 (순서 기반)
                      const questionText = feedback.question_text ||
                        sessionData?.questions?.[index]?.text ||
                        "질문을 불러올 수 없습니다";

                      return (
                        <Card key={feedback.attempt_id} className="bg-muted/30 overflow-hidden">
                          <CardHeader className="bg-primary/5 border-b">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline">질문 {index + 1}</Badge>
                                </div>
                                <p className="text-lg font-semibold leading-relaxed">
                                  {questionText}
                                </p>
                              </div>
                            </div>
                          </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                          {/* STT 텍스트 */}
                          <div>
                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                              <Mic className="h-4 w-4 text-primary" />
                              답변 내용 (음성 인식)
                            </h4>
                            <div className="bg-background/50 rounded-lg p-4 border border-border">
                              {feedback.stt_text ? (
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                  {feedback.stt_text}
                                </p>
                              ) : (
                                <p className="text-sm text-muted-foreground italic">
                                  음성 인식 결과가 없습니다
                                </p>
                              )}
                            </div>
                          </div>

                          {/* 답변 평가 */}
                          <div>
                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                              <MessageSquare className="h-4 w-4 text-primary" />
                              답변 평가
                            </h4>
                            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
                              {feedback.evaluation_comment ? (
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                  {feedback.evaluation_comment}
                                </p>
                              ) : (
                                <p className="text-sm text-muted-foreground italic">
                                  평가 결과가 아직 생성되지 않았습니다
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    텍스트 피드백 데이터가 없습니다.
                  </div>
                )}
              </TabsContent>

              {/* 표정 탭 */}
              <TabsContent value="expression">
                {expressionDataList && expressionDataList.length > 0 ? (
                  <div className="space-y-6">
                    {expressionDataList.map((feedback, index) => {
                      const questionText = sessionData?.questions?.[index]?.text || `질문 ${index + 1}`;

                      return (
                        <Card key={feedback.attempt_id} className="bg-muted/30 overflow-hidden">
                          <CardHeader className="bg-primary/5 border-b">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline">질문 {index + 1}</Badge>
                                  <Badge variant="secondary">
                                    총점: {Math.round(feedback.overall_score)}
                                  </Badge>
                                </div>
                                <p className="text-lg font-semibold leading-relaxed">
                                  {questionText}
                                </p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-6 space-y-4">
                            {/* 세부 지표 */}
                            <div>
                              <h4 className="text-sm font-semibold mb-3">세부 지표</h4>
                              <div className="space-y-2">
                                <Card className="bg-background/50">
                                  <CardContent className="p-3">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium">시선</span>
                                      {(() => {
                                        const rating = feedback.expression_analysis?.head_eye_gaze_rate?.rating;
                                        const style = getRatingBadgeStyle(rating);
                                        return (
                                          <Badge variant={style.variant} className={style.className}>
                                            {rating || "-"}
                                          </Badge>
                                        );
                                      })()}
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card className="bg-background/50">
                                  <CardContent className="p-3">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium">눈 깜빡임</span>
                                      {(() => {
                                        const rating = feedback.expression_analysis?.blink_stability?.rating;
                                        const style = getRatingBadgeStyle(rating);
                                        return (
                                          <Badge variant={style.variant} className={style.className}>
                                            {rating || "-"}
                                          </Badge>
                                        );
                                      })()}
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card className="bg-background/50">
                                  <CardContent className="p-3">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium">입꼬리</span>
                                      {(() => {
                                        const rating = feedback.expression_analysis?.mouth_delta?.rating;
                                        const style = getRatingBadgeStyle(rating);
                                        return (
                                          <Badge variant={style.variant} className={style.className}>
                                            {rating || "-"}
                                          </Badge>
                                        );
                                      })()}
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </div>

                            {/* 코멘트 */}
                            {feedback.feedback_summary && (
                              <div>
                                <h4 className="text-sm font-semibold mb-3">코멘트</h4>
                                <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
                                  <p className="text-sm leading-relaxed">
                                    {feedback.feedback_summary}
                                  </p>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    표정 피드백 데이터가 없습니다.
                  </div>
                )}
              </TabsContent>

              {/* 자세 탭 */}
              <TabsContent value="posture">
                {postureDataList && postureDataList.length > 0 ? (
                  <div className="space-y-6">
                    {postureDataList.map((feedback, index) => {
                      const questionText = sessionData?.questions?.[index]?.text || `질문 ${index + 1}`;
                      const pose = feedback.pose_analysis;

                      return (
                        <Card key={feedback.session_id} className="bg-muted/30 overflow-hidden">
                          <CardHeader className="bg-primary/5 border-b">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline">질문 {index + 1}</Badge>
                                  {pose ? (
                                    <Badge variant="secondary">
                                      총점: {Math.round(pose.overall.value)} ({pose.overall.rating})
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline">분석 대기</Badge>
                                  )}
                                </div>
                                <p className="text-lg font-semibold leading-relaxed">
                                  {questionText}
                                </p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-6 space-y-4">
                            {/* 세부 지표 */}
                            <div>
                              <h4 className="text-sm font-semibold mb-3">세부 지표</h4>
                              <div className="space-y-2">
                                {[
                                  { label: "어깨 정렬", value: pose?.shoulder.value, rating: pose?.shoulder.rating },
                                  { label: "고개 수평", value: pose?.head_tilt.value, rating: pose?.head_tilt.rating },
                                  { label: "손 위치", value: pose?.hand.value, rating: pose?.hand.rating },
                                ].map((item, idx) => {
                                  const style = getRatingBadgeStyle(item.rating);
                                  return (
                                    <Card key={idx} className="bg-background/50">
                                      <CardContent className="p-3">
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <span className="text-sm font-medium">{item.label}</span>
                                            {item.rating && (
                                              <Badge className={`ml-2 ${style.className}`} variant={style.variant}>
                                                {item.rating}
                                              </Badge>
                                            )}
                                          </div>
                                          <span className="text-xl font-bold text-primary">
                                            {item.value !== undefined ? Math.round(item.value) : "-"}
                                          </span>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  );
                                })}
                              </div>
                            </div>

                            {/* 문제 구간 */}
                            {feedback.problem_sections && feedback.problem_sections.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold mb-3">문제 구간</h4>
                                <div className="bg-gradient-to-br from-destructive/5 to-destructive/10 rounded-lg p-4 border border-destructive/20">
                                  <div className="space-y-2">
                                    {feedback.problem_sections.map((section, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-start gap-3 text-sm"
                                      >
                                        <span className="text-muted-foreground whitespace-nowrap">
                                          {section.start_sec}s - {section.end_sec}s
                                        </span>
                                        <span>{section.issue}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    자세 피드백 데이터가 없습니다.
                  </div>
                )}
              </TabsContent>

              {/* 목소리 탭 */}
              <TabsContent value="voice">
                {voiceDataList && voiceDataList.length > 0 ? (
                  <div className="space-y-6">
                    {voiceDataList.map((feedback, index) => {
                      const questionText = sessionData?.questions?.[index]?.text || `질문 ${index + 1}`;

                      return (
                        <Card key={feedback.attempt_id} className="bg-muted/30 overflow-hidden">
                          <CardHeader className="bg-primary/5 border-b">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline">질문 {index + 1}</Badge>
                                  <Badge variant="secondary">
                                    총점: {feedback.total_score}
                                  </Badge>
                                </div>
                                <p className="text-lg font-semibold leading-relaxed">
                                  {questionText}
                                </p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-6 space-y-4">
                            {/* 세부 지표 */}
                            <div>
                              <h4 className="text-sm font-semibold mb-3">세부 지표</h4>
                              <div className="space-y-2">
                                {feedback.metrics.map((metric) => {
                                  const style = getRatingBadgeStyle(metric.level);
                                  return (
                                    <Card key={metric.id} className="bg-background/50">
                                      <CardContent className="p-3">
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm font-medium">{metric.label}</span>
                                          <div className="flex items-center gap-2">
                                            <span className="text-xl font-bold text-primary">
                                              {typeof metric.score === 'string'
                                                ? parseFloat(metric.score).toFixed(0)
                                                : Math.round(metric.score)}
                                            </span>
                                            {metric.level && (
                                              <Badge variant={style.variant} className={style.className}>
                                                {metric.level}
                                              </Badge>
                                            )}
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  );
                                })}
                              </div>
                            </div>

                            {/* 요약 코멘트 */}
                            {feedback.summary && (
                              <div>
                                <h4 className="text-sm font-semibold mb-3">코멘트</h4>
                                <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
                                  <p className="text-sm leading-relaxed">
                                    {feedback.summary}
                                  </p>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    목소리 피드백 데이터가 없습니다.
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
