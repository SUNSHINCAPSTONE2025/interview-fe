import { apiRequest } from "@/lib/api";
import type {
  Session,
  SessionWithQuestions,
  QuestionPlanRequest,
  QuestionPlanResponse,
  StartSessionResponse,
  UploadRecordingResponse,
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

  // Upload recording (녹화 파일 업로드)
  uploadRecording: async (
    sessionId: number,
    questionIndex: number,
    blob: Blob
  ): Promise<UploadRecordingResponse> => {
    const formData = new FormData();
    formData.append('file', blob, `q${questionIndex}.webm`);

    const response = await fetch(
      `/api/sessions/${sessionId}/recordings/${questionIndex}`,
      {
        method: "POST",
        body: formData,
        // FormData는 Content-Type을 자동으로 설정하므로 headers 불필요
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  },
};
