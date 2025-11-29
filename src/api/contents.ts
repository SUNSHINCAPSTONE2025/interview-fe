import { apiRequest } from "@/lib/api";
import type {
  ContentListResponse,
  CreateContentRequest,
  CreateContentResponse,
  CreateResumeRequest,
  CreateResumeResponse,
  GenerateInterviewQuestionsRequest,
  GenerateInterviewQuestionsResponse
} from "@/types/content";

export const contentsApi = {
  // Content 목록 조회
  getAll: async (): Promise<ContentListResponse> => {
    return apiRequest<ContentListResponse>("/api/contents", {
      method: "GET",
    });
  },

  // Content 생성
  create: async (data: CreateContentRequest): Promise<CreateContentResponse> => {
    return apiRequest<CreateContentResponse>("/api/interviews/contents", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Resume 생성 (자소서 Q&A 등록)
  createResume: async (data: CreateResumeRequest): Promise<CreateResumeResponse> => {
    return apiRequest<CreateResumeResponse>("/api/interviews/resumes", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // 자소서 기반 면접 질문 생성
  generateInterviewQuestions: async (data: GenerateInterviewQuestionsRequest): Promise<GenerateInterviewQuestionsResponse> => {
    return apiRequest<GenerateInterviewQuestionsResponse>("/api/interviews/question", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
