import { apiRequest } from "@/lib/api";
import type {
  AnswerEvalRequest,
  AnswerEvalResponse,
  AttemptFeedbackResponse,
} from "@/types/feedback";

export const answerEvalApi = {
  // 답변 평가 생성 (POST)
  evaluateAnswer: async (
    sessionId: number,
    attemptId: number,
    data: AnswerEvalRequest
  ): Promise<AnswerEvalResponse> => {
    return apiRequest<AnswerEvalResponse>(
      `/api/answer-eval/sessions/${sessionId}?attempt_id=${attemptId}`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  // 답변 평가 조회 (GET)
  getAttemptFeedback: async (
    sessionId: number,
    attemptId: number
  ): Promise<AttemptFeedbackResponse> => {
    return apiRequest<AttemptFeedbackResponse>(
      `/api/answer-eval/sessions/${sessionId}/attempts/${attemptId}`,
      {
        method: "GET",
      }
    );
  },
};
