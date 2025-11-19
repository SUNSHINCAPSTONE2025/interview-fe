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

// 🚧 개발용 Mock 데이터 (백엔드 연결 전 임시)
const mockContents: ContentListResponse = [
  {
    id: 1,
    company: "카카오",
    role: "백엔드 개발자",
    interview_date: "2025-03-15",
    total_sessions: 30,
    completed_sessions: 18,
  },
  {
    id: 2,
    company: "네이버",
    role: "프론트엔드 개발자",
    interview_date: "2025-04-20",
    total_sessions: 25,
    completed_sessions: 10,
  },
  {
    id: 3,
    company: "토스",
    role: "풀스택 개발자",
    interview_date: null, // 면접일 미정
    total_sessions: 40,
    completed_sessions: 5,
  },
  {
    id: 4,
    company: "라인",
    role: "데이터 엔지니어",
    interview_date: "2025-02-28",
    total_sessions: 20,
    completed_sessions: 15,
  },
];

export const contentsApi = {
  // Content 목록 조회
  getAll: async (): Promise<ContentListResponse> => {

    // 🚧 개발용: Mock 데이터 반환
    // TODO: 백엔드 연결되면 아래 주석 해제하고 Mock 데이터 삭제
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockContents);
      }, 500); // 0.5초 딜레이로 로딩 상태 시뮬레이션
    });

    /*
    return apiRequest<ContentListResponse>("/api/contents", {
      method: "GET",
    });
    */

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
