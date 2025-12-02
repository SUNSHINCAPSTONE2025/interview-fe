import { apiRequest } from "@/lib/api";
import type {
  ExpressionFeedbackResponse,
  PostureFeedbackResponse,
  VoiceFeedbackResponse,
  CompleteFeedbackResponse,
  StartPoseAnalysisResponse,
} from "@/types/feedback";

export const feedbackApi = {
  /**
   * 표정 피드백 조회 (동기 처리)
   * GET /api/feedback/{session_id}/expression-feedback?attempt_id={attempt_id}
   *
   * 요청 시 즉시 분석을 수행하고 결과를 feedback_summary에 저장한 후 응답 반환
   * 분석이 완료될 때까지 대기 (예상 1-5초)
   *
   * @param sessionId - Session ID
   * @param attemptId - Attempt ID (required)
   * @throws {ApiError} 500 - internal_server_error (분석 실패 시)
   *
   * 주의: 자세 분석과 달리 동기 처리됩니다. 409 에러 없음.
   */
  getExpressionFeedback: async (
    sessionId: number,
    attemptId: number
  ): Promise<ExpressionFeedbackResponse> => {
    return apiRequest<ExpressionFeedbackResponse>(
      `/api/feedback/${sessionId}/expression-feedback?attempt_id=${attemptId}`,
      { method: "GET" }
    );
  },

  /**
   * 자세 분석 시작 (비동기 처리)
   * POST /api/analysis/pose/start
   *
   * 백그라운드에서 자세 분석을 시작합니다 (예상 10-30초).
   * 즉시 202 Accepted 응답을 받고, 분석은 백그라운드에서 진행됩니다.
   * 완료 후 getPoseFeedback으로 결과를 조회해야 합니다.
   *
   * @param sessionId - Session ID
   * @param attemptId - Attempt ID (required)
   * @returns {status: "pending", message: "pose_analysis_started"}
   *
   * 주의: 표정 분석과 달리 비동기 처리됩니다.
   */
  startPoseAnalysis: async (
    sessionId: number,
    attemptId: number
  ): Promise<StartPoseAnalysisResponse> => {
    return apiRequest<StartPoseAnalysisResponse>(
      `/api/analysis/pose/start`,
      {
        method: "POST",
        body: JSON.stringify({
          session_id: sessionId,
          attempt_id: attemptId
        }),
      }
    );
  },

  /**
   * 자세 피드백 조회 (비동기 처리)
   * GET /api/feedback/{session_id}/pose-feedback?attempt_id={attempt_id}
   *
   * @param sessionId - Session ID
   * @param attemptId - Attempt ID (required)
   * @throws {ApiError} 409 - pose_analysis_not_ready (분석 미완료 시)
   * @throws {ApiError} 404 - session_not_found
   * @throws {ApiError} 403 - forbidden
   *
   * 분석이 완료되지 않은 경우 409 에러를 반환합니다.
   * 분석 완료 후 feedback_summary에 저장된 결과를 반환합니다.
   *
   * 사용법: startPoseAnalysis() 호출 후 주기적으로 polling 필요
   */
  getPoseFeedback: async (
    sessionId: number,
    attemptId: number
  ): Promise<PostureFeedbackResponse> => {
    return apiRequest<PostureFeedbackResponse>(
      `/api/feedback/${sessionId}/pose-feedback?attempt_id=${attemptId}`,
      { method: "GET" }
    );
  },

  /**
   * 목소리 피드백 조회
   * GET /api/feedback/{session_id}/voice-feedback?attempt_id={attempt_id}
   *
   * @param sessionId - Session ID
   * @param attemptId - Attempt ID (required)
   */
  getVoiceFeedback: async (
    sessionId: number,
    attemptId: number
  ): Promise<VoiceFeedbackResponse> => {
    return apiRequest<VoiceFeedbackResponse>(
      `/api/feedback/${sessionId}/voice-feedback?attempt_id=${attemptId}`,
      { method: "GET" }
    );
  },

  /**
   * 통합 피드백 조회 (선택사항)
   * GET /api/feedback/{session_id}
   *
   * feedback_summary 테이블의 전체 데이터를 반환합니다.
   * 표정, 자세, 목소리 피드백이 모두 포함됩니다.
   */
  getCompleteFeedback: async (
    sessionId: number
  ): Promise<CompleteFeedbackResponse> => {
    return apiRequest<CompleteFeedbackResponse>(
      `/api/feedback/${sessionId}`,
      { method: "GET" }
    );
  },
};
