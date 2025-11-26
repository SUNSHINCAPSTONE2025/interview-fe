import { apiRequest } from "@/lib/api";
import type {
  Session,
  SessionWithQuestions,
  QuestionPlanRequest,
  QuestionPlanResponse,
  StartSessionResponse,
} from "@/types/session";

export const sessionsApi = {
  // Start a new session (기본 세션 시작)
  startSession: async (interviewId: number): Promise<StartSessionResponse> => {
    return apiRequest<StartSessionResponse>(
      `/api/interviews/${interviewId}/sessions/start`,
      {
        method: "POST",
      }
    );
  },

  // Get session by ID with questions
  getById: async (sessionId: number): Promise<SessionWithQuestions> => {
    return apiRequest<SessionWithQuestions>(`/api/sessions/${sessionId}`, {
      method: "GET",
    });
  },

  // Get all sessions for a content
  getByContentId: async (contentId: number): Promise<Session[]> => {
    return apiRequest<Session[]>(`/api/sessions?content_id=${contentId}`, {
      method: "GET",
    });
  },

  // Generate question plan (질문 생성)
  generateQuestionPlan: async (
    interviewId: number,
    data: QuestionPlanRequest
  ): Promise<QuestionPlanResponse> => {
    return apiRequest<QuestionPlanResponse>(
      `/api/interviews/${interviewId}/question-plan`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },
};
