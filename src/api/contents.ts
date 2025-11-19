import { apiRequest } from "@/lib/api";
import type { ContentListResponse } from "@/types/content";

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
  getAll: async (): Promise<ContentListResponse> => {

    return apiRequest<ContentListResponse>("/api/contents", {
      method: "GET",
    });
  
  },
};
