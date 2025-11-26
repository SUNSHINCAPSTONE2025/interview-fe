// Session status enum (DB values)
export type SessionStatus = "draft" | "running" | "done" | "canceled";

// Question type enum
export type QuestionType = "BASIC" | "GENERATED";

// Practice type for UI (soft/job questions)
export type PracticeType = "soft" | "job";

// Session detail response
export interface Session {
  id: number;
  user_id: string;
  content_id: number;
  status: SessionStatus;
  started_at: string | null;
  ended_at: string | null;
  question_count: number;
  company_snapshot?: string;
  role_snapshot?: string;
  created_at: string;
  updated_at: string | null;
}

// Session with question details
export interface SessionWithQuestions extends Session {
  questions: SessionQuestion[];
}

// Session question
export interface SessionQuestion {
  id: number;
  session_id: number;
  question_type: QuestionType;
  question_id: number;
  order_no: number;
  text?: string; // Question text (joined from basic_question or generated_question)
}

// Create session request
export interface CreateSessionRequest {
  question_type: PracticeType; // "soft" or "job"
  question_count: number; // 5개 고정
}

// Create session response
export interface CreateSessionResponse {
  session_id: number;
  status: SessionStatus;
  question_count: number;
  questions: SessionQuestion[];
}

// Question plan request
export interface QuestionPlanRequest {
  mode: PracticeType;
  count: number; // 1-10 범위
}

// Question plan (goal and tips)
export interface QuestionPlan {
  mode: PracticeType;
  goal_id: string;
  tip_ids: string[];
}

// Question plan response
export interface QuestionPlanResponse {
  message: string;
  plan: PracticeType;
  generated_questions: string[];
}

// Start session response
export interface StartSessionResponse {
  message: string;
  session_id: number;
  interview_id: number;
  status: SessionStatus;
}

// Upload recording response
export interface UploadRecordingResponse {
  success: boolean;
  session_id: number;
  question_index: number;
  video_url: string;
  audio_url: string;
  duration?: number;
  video_size?: number;
  audio_size?: number;
}
