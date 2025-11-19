import { apiRequest } from "@/lib/api";
import type {
  Session,
  SessionWithQuestions,
  CreateSessionRequest,
  CreateSessionResponse,
} from "@/types/session";

export const sessionsApi = {
  // Create a new session for interview
  create: async (
    contentId: number,
    data: CreateSessionRequest
  ): Promise<CreateSessionResponse> => {
    return apiRequest<CreateSessionResponse>(
      `/api/interviews/${contentId}/sessions`,
      {
        method: "POST",
        body: JSON.stringify(data),
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
};
