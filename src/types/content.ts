export interface Content {
  id: number;
  company: string;
  role: string;
  interview_date: string | null;
  total_sessions: number;
  completed_sessions: number;
}

export type ContentListResponse = Content[];

// Content 개별 조회 응답
export type ContentDetailResponse = Content;

// Content 생성 요청
export interface CreateContentRequest {
  company: string;
  role: string;
  role_category?: number | null;
  interview_date: string | null; // YYYY-MM-DD format or null
  jd_text?: string | null;
}

// Content 생성 응답
export interface CreateContentResponse {
  message: string;
  content: {
    id: number;
    user_id?: string;
    company: string;
    role: string;
    role_category: number | null;
    interview_date: string | null;
    jd_text: string | null;
    created_at: string;
    updated_at?: string | null;
  };
}

// Resume 항목
export interface ResumeItem {
  question: string;
  answer: string;
}

// Resume 생성 요청
export interface CreateResumeRequest {
  content_id: number;
  version: number;
  items: ResumeItem[];
}

// Resume 생성 응답
export interface CreateResumeResponse {
  message: string;
  created_count: number;
}

// 면접 질문 생성 요청
export interface GenerateInterviewQuestionsRequest {
  content_id: number;
  qas: Array<{ q: string; a: string }>;
  emit_confidence?: boolean;
  use_seed?: boolean;
  top_k_seed?: number;
}

// 면접 질문 생성 응답
export interface GenerateInterviewQuestionsResponse {
  message: string;
  content_id: number;
  generated_count: number;
}
