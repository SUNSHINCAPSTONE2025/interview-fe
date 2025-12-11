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
  message: string;
  session_id: number;
  attempt_id: number; // Attempt ID
  overall_score: number; // overall_face
  expression_analysis: {
    head_eye_gaze_rate: {
      value: number;
      rating: string;
    };
    blink_stability: {
      value: number;
      rating: string;
    };
    mouth_delta: {
      value: number;
      rating: string;
    };
    fixation_metrics: {
      MAE: number | null;
      BCEA: number | null;
    };
  };
  feedback_summary: string;
  // Legacy fields for backward compatibility (derived from expression_analysis)
  gaze?: number;
  eye_blink?: number;
  mouth?: number;
  comment?: string;
}

// BE API 응답 타입 - 자세 피드백
export interface PoseScore {
  value: number;
  rating: string;
}

export interface PostureFeedbackResponse {
  message: string;
  session_id: number;
  attempt_id: number;
  overall_score: number; // overall_pose (편의 필드)
  pose_analysis?: {
    overall: PoseScore;
    shoulder: PoseScore;
    head_tilt: PoseScore;
    hand: PoseScore;
  };
  status?: string; // pending 등
  problem_sections?: ProblemSection[]; // DB에는 없지만 BE 응답에 있을 수 있음
}

// 목소리 피드백 - 개별 지표
export interface VoiceMetric {
  id: string;
  label: string;
  score: string | number; // 실제로는 string으로 옴 ("55.00")
  level?: string; // optional - 실제로는 없음
  value?: number | string | null;
  unit?: string | null;
  description?: string;
  details?: Record<string, any>;
}

// BE API 응답 타입 - 목소리 피드백
export interface VoiceFeedbackResponse {
  session_id: number;
  attempt_id: number;
  total_score: number;
  summary: string;
  metrics: VoiceMetric[];
  grouped?: {
    tremor_events: any[];
    speed_fast: any[];
    speed_slow: any[];
    pause_low: any[];
    pause_high: any[];
  };
  // 하위 호환성을 위한 기존 필드들 (옵션)
  overall_score?: number;
  tremor?: number;
  blank?: number;
  tone?: number;
  speed?: number;
  speech?: string;
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

// STT API 요청
export interface STTRequest {
  attempt_id: number;
}

// STT API 응답
export interface STTResponse {
  session_id: number;
  attempt_id: number;
  transcript: string;
}

// 답변 평가 API 요청
export interface AnswerEvalRequest {
  answer_text: string;
}

// 답변 평가 API 응답
export interface AnswerEvalResponse {
  session_id: number;
  attempt_id: number;
  result: {
    overall_summary: string;
    // 추가 필드가 있을 수 있음
  };
}

// 답변 평가 조회 API 응답 (GET)
export interface AttemptFeedbackResponse {
  attempt_id: number;
  question_text: string | null;
  stt_text: string | null;
  evaluation_comment: string | null;
  scores: {
    overall_voice: number | null;
    overall_face: number | null;
    overall_pose: number | null;
  };
}
