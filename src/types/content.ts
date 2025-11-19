export interface Content {
  id: number;
  company: string;
  role: string;
  interview_date: string | null;
  total_sessions: number;
  completed_sessions: number;
}

export interface ContentListResponse extends Array<Content> {}
