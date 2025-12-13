import { apiRequest } from "@/lib/api";
import type { STTRequest, STTResponse } from "@/types/feedback";

export const sttApi = {
  // STT 처리 (음성 → 텍스트 변환)
  processSpeechToText: async (
    sessionId: number,
    data: STTRequest
  ): Promise<STTResponse> => {
    return apiRequest<STTResponse>(`/api/stt/sessions/${sessionId}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
