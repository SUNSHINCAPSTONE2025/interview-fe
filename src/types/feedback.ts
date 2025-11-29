// DB feedback_summary 테이블과 1:1 매핑
export interface FeedbackSummary {
  session_id: number;

  // 총점
  overall?: number;
  overall_face?: number;
  overall_voice?: number;
  overall_pose?: number;

  // 표정 (Expression/Face)
  gaze?: number;
  eye_blink?: number;
  mouth?: number;

  // 목소리 (Voice)
  tremor?: number;
  blank?: number;
  tone?: number;
  speed?: number;

  // 자세 (Posture/Pose)
  shoulder?: number;
  head?: number;
  hand?: number;

  // 텍스트
  speech?: string; // 발화 텍스트 (STT)
  comment?: string;
}

// 자세 문제 구간 (BE에서만 제공될 수 있음)
export interface ProblemSection {
  start_sec: number;
  end_sec: number;
  issue: string;
}

// BE API 응답 타입 - 표정 피드백
export interface ExpressionFeedbackResponse {
  session_id: number;
  overall_score: number; // overall_face
  gaze: number;
  eye_blink: number;
  mouth: number;
  comment?: string;
  // BE에서 계산된 세부 지표 (선택적)
  head_eye_gaze_rate?: number;
  blink_stability?: number;
  mouth_delta?: number;
}

// BE API 응답 타입 - 자세 피드백
export interface PostureFeedbackResponse {
  session_id: number;
  overall_score: number; // overall_pose
  shoulder: number;
  head: number;
  hand: number;
  problem_sections?: ProblemSection[]; // DB에는 없지만 BE 응답에 있을 수 있음
}

// BE API 응답 타입 - 목소리 피드백
export interface VoiceFeedbackResponse {
  session_id: number;
  overall_score: number; // overall_voice
  tremor: number;
  blank: number;
  tone: number;
  speed: number;
  speech?: string; // STT 결과
}

// 통합 피드백 응답
export interface CompleteFeedbackResponse extends FeedbackSummary {
  problem_sections?: ProblemSection[];
}

// 자세 분석 시작 요청
export interface StartPoseAnalysisRequest {
  session_id: number;
}

// 자세 분석 시작 응답
export interface StartPoseAnalysisResponse {
  message: string;
  status?: string;
}
