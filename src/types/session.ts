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
  session_max: number; // 최대 생성 가능 세션 갯수
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

// Start session request
export interface StartSessionRequest {
  practice_type: PracticeType;
  count: number; // 1-10 범위
}

// Start session response
export interface StartSessionResponse {
  message: string;
  session_id: number;
  interview_id: number;
  status: SessionStatus;
  questions: SessionQuestion[]; // Questions returned from backend
}

// Upload recording response
export interface UploadRecordingResponse {
  success: boolean;
  session_id: number;
  question_index: number;
  attempt_id: number; // Attempt ID returned by backend
  video_url: string;
  audio_url: string;
  duration?: number;
  video_size?: number;
  audio_size?: number;
  message?: string;
}

// Update session status request
export interface UpdateSessionStatusRequest {
  status: SessionStatus;
  started_at?: string; // ISO 8601 timestamp
  ended_at?: string; // ISO 8601 timestamp
}

// Update session status response
export interface UpdateSessionStatusResponse {
  success: boolean;
  session_id: number;
  status: SessionStatus;
  started_at: string | null;
  ended_at: string | null;
}

// Attempt status enum
export type AttemptStatus = "ok" | "aborted";

// Attempt entity (DB model)
export interface Attempt {
  id: number;
  session_id: number;
  session_question_id: number;
  started_at: string;
  ended_at: string | null;
  duration_sec: number | null;
  status: AttemptStatus;
  stt_text: string | null;
  created_at: string;
}

// Media asset kind enum
export type MediaAssetKind = "video" | "audio";

// Media asset entity (DB model)
export interface MediaAsset {
  id: number;
  attempt_id: number;
  session_question_id: number;
  kind: MediaAssetKind;
  storage_uri: string;
  duration_sec: number | null;
  created_at: string;
}

// Create attempt request (영상 업로드 시 attempt 생성)
export interface CreateAttemptRequest {
  session_question_id: number;
  started_at: string; // ISO 8601 timestamp
  ended_at: string; // ISO 8601 timestamp
  duration_sec: number;
  status: AttemptStatus;
}

// Create attempt response
export interface CreateAttemptResponse {
  success: boolean;
  attempt_id: number;
  session_id: number;
  session_question_id: number;
  video_url: string; // media_asset (kind: video) storage_uri
  audio_url: string; // media_asset (kind: audio) storage_uri
  status: AttemptStatus;
  duration_sec: number;
}
