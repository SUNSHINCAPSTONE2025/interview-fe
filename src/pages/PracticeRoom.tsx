import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Play,
  Square,
  ChevronRight,
  AlertCircle,
  Brain,
  MessageSquare,
  Loader2
} from "lucide-react";
import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { sessionsApi } from "@/api/sessions";
import { SessionQuestion } from "@/types/session";

export default function PracticeRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // Get data from location state
  const questions = (location.state?.questions as SessionQuestion[]) || [];
  const sessionId = searchParams.get("session_id");

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // States
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isThinking, setIsThinking] = useState(true); // 자동 시작
  const [isRecording, setIsRecording] = useState(false);
  const [thinkingTime, setThinkingTime] = useState(60);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingEnded, setRecordingEnded] = useState(false);
  const [recordedBlobs, setRecordedBlobs] = useState<Blob[]>([]);
  const [attemptIds, setAttemptIds] = useState<number[]>([]); // Store attempt IDs from uploads
  const [isUploading, setIsUploading] = useState(false);
  const [recordingStartTime, setRecordingStartTime] = useState<string | null>(null); // Track recording start time

  const totalQuestions = questions.length;
  const maxRecordingTime = 60; // 1분 (60초)

  // 세션 시작 (status: running으로 변경)
  useEffect(() => {
    const startSession = async () => {
      if (!sessionId) return;

      try {
        await sessionsApi.updateSessionStatus(parseInt(sessionId), {
          status: "running",
          started_at: new Date().toISOString(),
        });
        console.log(`Session ${sessionId} started`);
      } catch (error) {
        console.error("Failed to start session:", error);
        toast({
          title: "세션 시작 실패",
          description: "세션을 시작할 수 없습니다.",
          variant: "destructive",
        });
      }
    };

    startSession();
  }, [sessionId, toast]);

  // 카메라/마이크 시작 (practiceSetup에서 이미 권한을 받았으므로 바로 시작)
  useEffect(() => {
    const startMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: true
        });
        setStream(mediaStream);
      } catch (error) {
        console.error("Failed to start media:", error);
        toast({
          title: "카메라/마이크 오류",
          description: "카메라 또는 마이크에 접근할 수 없습니다. 이전 화면에서 권한을 허용해주세요.",
          variant: "destructive",
        });
      }
    };

    startMedia();

    // Cleanup
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  // stream이 설정되면 video 요소에 연결
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      // 명시적으로 재생 시작 (일부 브라우저에서 필요)
      videoRef.current.play().catch((error) => {
        console.error("Failed to play video:", error);
      });
    }
  }, [stream]);

  // 페이지 이탈 감지 (세션 canceled 처리)
  useEffect(() => {
    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      // 녹화 중이면 경고 표시
      if (isRecording) {
        e.preventDefault();
        e.returnValue = "녹화 중입니다. 정말 나가시겠습니까?";
      }

      // 세션을 canceled로 변경 (MVP: 동기 처리)
      if (sessionId) {
        try {
          // sendBeacon을 사용하여 페이지 이탈 시에도 요청 전송
          const data = JSON.stringify({
            status: "canceled",
            ended_at: new Date().toISOString(),
          });

          navigator.sendBeacon(
            `/api/sessions/${sessionId}/status`,
            new Blob([data], { type: "application/json" })
          );
        } catch (error) {
          console.error("Failed to cancel session:", error);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [sessionId, isRecording]);

  // 질문 변경 시 자동으로 생각 시간 시작
  useEffect(() => {
    setIsThinking(true);
    setThinkingTime(60);
    setRecordingTime(0);
    setRecordingEnded(false);
    setRecordingStartTime(null);
  }, [currentQuestion]);

  // Thinking time countdown (60초)
  useEffect(() => {
    if (isThinking && thinkingTime > 0) {
      const timer = setTimeout(() => setThinkingTime(thinkingTime - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isThinking && thinkingTime === 0) {
      // 생각 시간 종료 -> 자동으로 녹화 시작
      setIsThinking(false);
      setIsRecording(true);
      setRecordingTime(0);
      setRecordingStartTime(new Date().toISOString());

      // 녹화 시작
      if (stream && !mediaRecorderRef.current) {
        try {
          const mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp9,opus'
          });

          const chunks: Blob[] = [];

          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              chunks.push(event.data);
            }
          };

          mediaRecorder.onstop = () => {
            const videoBlob = new Blob(chunks, { type: 'video/webm' });
            setRecordedBlobs(prev => [...prev, videoBlob]);
            console.log(`Recording saved:`, videoBlob.size, 'bytes');
          };

          mediaRecorder.start();
          mediaRecorderRef.current = mediaRecorder;
        } catch (error) {
          console.error("Failed to start recording:", error);
        }
      }
    }
  }, [isThinking, thinkingTime, stream]);

  // Recording time countdown
  useEffect(() => {
    if (isRecording && !recordingEnded) {
      const timer = setTimeout(() => {
        const newTime = recordingTime + 1;
        setRecordingTime(newTime);

        if (newTime >= maxRecordingTime) {
          // 최대 녹화 시간 도달
          setIsRecording(false);
          setRecordingEnded(true);

          // 녹화 종료
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current = null;
          }
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isRecording, recordingEnded, recordingTime, maxRecordingTime]);

  // "대답하기" 버튼 클릭 (생각 시간 중)
  const handleStartAnswer = () => {
    if (!stream) {
      toast({
        title: "녹화 오류",
        description: "카메라/마이크가 준비되지 않았습니다.",
        variant: "destructive",
      });
      return;
    }

    setIsThinking(false);
    setIsRecording(true);
    setRecordingTime(0);
    setRecordingStartTime(new Date().toISOString());

    // 녹화 시작
    try {
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9,opus'
      });

      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: 'video/webm' });
        setRecordedBlobs(prev => [...prev, videoBlob]);
        console.log(`Recording saved:`, videoBlob.size, 'bytes');
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
    } catch (error) {
      console.error("Failed to start recording:", error);
      toast({
        title: "녹화 시작 실패",
        description: "녹화를 시작할 수 없습니다.",
        variant: "destructive",
      });
    }
  };

  // "대답 종료" 버튼 클릭 (녹화 중)
  const handleEndAnswer = () => {
    setIsRecording(false);
    setRecordingEnded(true);

    // 녹화 종료
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
  };

  // 녹화 파일 업로드
  const uploadRecording = async (questionIndex: number, blob: Blob) => {
    if (!sessionId) {
      console.error("Session ID not found");
      return false;
    }

    try {
      setIsUploading(true);

      const response = await sessionsApi.uploadRecording(
        parseInt(sessionId),
        questionIndex,
        blob
      );

      console.log(`Upload success for Q${questionIndex}:`, response);

      // Store attempt_id for feedback
      if (response.attempt_id) {
        setAttemptIds(prev => {
          const newIds = [...prev];
          newIds[questionIndex] = response.attempt_id;
          return newIds;
        });
      }

      toast({
        title: "녹화 저장 완료",
        description: `질문 ${questionIndex + 1}의 답변이 저장되었습니다.`,
      });

      return true;
    } catch (error) {
      console.error(`Upload failed for Q${questionIndex}:`, error);

      toast({
        title: "저장 실패",
        description: "답변 저장에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });

      return false;
    } finally {
      setIsUploading(false);
    }
  };

  const handleNext = async () => {
    // 현재 질문의 녹화 업로드
    if (recordedBlobs[currentQuestion]) {
      const uploadSuccess = await uploadRecording(
        currentQuestion,
        recordedBlobs[currentQuestion]
      );

      if (!uploadSuccess) {
        // 업로드 실패 시 사용자에게 재시도 옵션 제공
        const retry = window.confirm(
          "답변 저장에 실패했습니다. 다시 시도하시겠습니까?"
        );

        if (retry) {
          await uploadRecording(currentQuestion, recordedBlobs[currentQuestion]);
        }
      }
    }

    // 다음 질문으로 이동
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 마지막 질문 완료 - 세션을 done으로 변경
      if (sessionId) {
        try {
          await sessionsApi.updateSessionStatus(parseInt(sessionId), {
            status: "done",
            ended_at: new Date().toISOString(),
          });
          console.log(`Session ${sessionId} completed successfully`);
        } catch (error) {
          console.error("Failed to complete session:", error);
        }
      }

      console.log(`Total recordings uploaded: ${recordedBlobs.length}`);

      // Pass attempt_ids to feedback page
      const attemptIdsParam = attemptIds.filter(id => id).join(',');
      navigate(`/feedback/${id}?session_id=${sessionId}&attempt_ids=${attemptIdsParam}`);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Top Bar */}
      <div className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="outline">
              질문 {currentQuestion + 1}/{totalQuestions}
            </Badge>
            <Progress value={((currentQuestion + 1) / totalQuestions) * 100} className="w-32" />
          </div>
          
          <div className="flex items-center gap-3">
            {isThinking && (
              <Badge variant="secondary" className="animate-pulse">
                <Brain className="h-3 w-3 mr-2" />
                생각 시간
              </Badge>
            )}
            {isRecording && (
              <Badge variant="destructive" className="animate-pulse">
                <div className="w-2 h-2 rounded-full bg-white mr-2" />
                녹화 중
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Prompt */}
          <Card className="lg:col-span-1 bg-gradient-card shadow-card p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">현재 질문</h3>
                <p className="text-lg font-semibold leading-relaxed">
                  {questions[currentQuestion]?.text || "질문을 불러오는 중..."}
                </p>
              </div>

              <div className="border-t border-border pt-4">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  빠른 팁
                </h4>
                <ul className="space-y-2">
                  <li className="text-sm text-muted-foreground flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    STAR 방법 사용 (상황, 과제, 행동, 결과)
                  </li>
                  <li className="text-sm text-muted-foreground flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    구체적인 예시와 수치 제시
                  </li>
                  <li className="text-sm text-muted-foreground flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    카메라를 보며 명확하게 답변
                  </li>
                </ul>
              </div>

              {isThinking && (
                <Button onClick={handleStartAnswer} className="w-full" variant="hero">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  대답하기
                </Button>
              )}

              {isRecording && (
                <Button onClick={handleEndAnswer} className="w-full" variant="destructive">
                  <Square className="h-4 w-4 mr-2" />
                  대답 종료
                </Button>
              )}

              {recordingEnded && (
                <Button
                  onClick={handleNext}
                  className="w-full"
                  variant="default"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      저장 중...
                    </>
                  ) : (
                    <>
                      {currentQuestion < totalQuestions - 1 ? "다음 질문" : "인터뷰 완료"}
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </Card>

          {/* Right Panel - Video */}
          <Card className="lg:col-span-2 bg-black shadow-hover overflow-hidden relative aspect-video">
            {/* Thinking Time Overlay */}
            {isThinking && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
                <div className="text-center">
                  <Brain className="h-24 w-24 text-blue-400 mx-auto mb-6 animate-pulse" />
                  <div className="text-6xl font-bold text-white mb-4">
                    {formatTime(thinkingTime)}
                  </div>
                  <p className="text-white text-xl mb-2">생각 시간</p>
                  <p className="text-white/60 text-sm">답변을 준비하세요</p>
                </div>
              </div>
            )}

            {/* Camera Preview */}
            <div className="absolute inset-0">
              {stream ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <Camera className="h-24 w-24 text-slate-600" />
                  <div className="absolute bottom-4 left-4 text-white/60 text-sm">
                    카메라를 시작하는 중...
                  </div>
                </div>
              )}
            </div>

            {/* Timer Overlay */}
            {isRecording && (
              <div className="absolute top-4 right-4 z-10">
                <Badge
                  variant={recordingTime > maxRecordingTime - 10 ? "destructive" : "default"}
                  className="text-lg px-4 py-2"
                >
                  {formatTime(recordingTime)} / {formatTime(maxRecordingTime)}
                </Badge>
              </div>
            )}

            {/* Recording Ended Message */}
            {recordingEnded && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="text-white text-2xl font-semibold mb-2">
                    답변이 완료되었습니다
                  </div>
                  <p className="text-white/60">다음 질문으로 이동하세요</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}