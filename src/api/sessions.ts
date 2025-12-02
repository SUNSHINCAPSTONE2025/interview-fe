import { apiRequest } from "@/lib/api";
import type {
  Session,
  SessionWithQuestions,
  QuestionPlanRequest,
  QuestionPlanResponse,
  StartSessionResponse,
  UploadRecordingResponse,
  UpdateSessionStatusRequest,
  UpdateSessionStatusResponse,
  CreateAttemptRequest,
  CreateAttemptResponse,
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

  // Generate question plan (직무 / 소프트)
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

  // Update session status (세션 상태 업데이트)
  updateSessionStatus: async (
    sessionId: number,
    data: UpdateSessionStatusRequest
  ): Promise<UpdateSessionStatusResponse> => {
    return apiRequest<UpdateSessionStatusResponse>(
      `/api/sessions/${sessionId}/status`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
  },

  // Create attempt with recording (attempt 생성 + 영상 업로드)
  createAttemptWithRecording: async (
    sessionId: number,
    blob: Blob,
    attemptData: CreateAttemptRequest
  ): Promise<CreateAttemptResponse> => {
    const formData = new FormData();

    // 영상 파일
    formData.append('file', blob, `session_${sessionId}_question_${attemptData.session_question_id}.webm`);

    // Attempt 메타데이터
    formData.append('session_question_id', attemptData.session_question_id.toString());
    formData.append('started_at', attemptData.started_at);
    formData.append('ended_at', attemptData.ended_at);
    formData.append('duration_sec', attemptData.duration_sec.toString());
    formData.append('status', attemptData.status);

    const response = await fetch(
      `/api/sessions/${sessionId}/attempts`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Create attempt failed: ${response.statusText}`);
    }

    return response.json();
  },

  // Upload recording (녹화 파일 업로드) - 기존 API (하위 호환성 유지)
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
