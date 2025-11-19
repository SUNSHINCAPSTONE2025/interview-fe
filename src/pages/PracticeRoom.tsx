import { useState, useEffect } from "react";
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
  Brain
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

export default function PracticeRoom() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isThinking, setIsThinking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [thinkingTime, setThinkingTime] = useState(60);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [recordingEnded, setRecordingEnded] = useState(false);

  const questions = [
    {
      id: 1,
      text: "최근에 해결한 어려운 기술 문제에 대해 말씀해주세요.",
      hints: ["STAR 방법 사용", "본인의 역할에 대해 구체적으로", "영향을 수치화"]
    },
    {
      id: 2,
      text: "최신 프론트엔드 기술을 어떻게 최신 상태로 유지하나요?",
      hints: ["구체적인 리소스 언급", "지속적인 학습 보여주기", "최근 예시 제공"]
    },
    {
      id: 3,
      text: "어려운 팀원과 협업해야 했던 경험을 설명해주세요.",
      hints: ["해결 과정에 집중", "공감 표시", "긍정적인 결과 강조"]
    }
  ];

  const totalQuestions = questions.length;

  // Thinking time countdown (60초)
  useEffect(() => {
    if (isThinking && thinkingTime > 0) {
      const timer = setTimeout(() => setThinkingTime(thinkingTime - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isThinking && thinkingTime === 0) {
      // 생각 시간 종료 -> 자동으로 녹화 시작
      setIsThinking(false);
      setIsRecording(true);
      setTimeRemaining(60);
    }
  }, [isThinking, thinkingTime]);

  // Recording time countdown (60초)
  useEffect(() => {
    if (isRecording && !recordingEnded && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isRecording && !recordingEnded && timeRemaining === 0) {
      // 녹화 시간 종료 -> 자동으로 다음 질문으로 넘어가지 않고 버튼 표시
      setIsRecording(false);
      setRecordingEnded(true);
    }
  }, [isRecording, recordingEnded, timeRemaining]);

  const handleStart = () => {
    setIsThinking(true);
    setThinkingTime(60);
    setRecordingEnded(false);
  };

  const handleEndAnswer = () => {
    // 대답 종료 버튼 클릭
    setIsRecording(false);
    setRecordingEnded(true);
  };

  const handleNext = () => {
    // 다음 질문으로 이동
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setIsThinking(false);
      setIsRecording(false);
      setRecordingEnded(false);
      setThinkingTime(60);
      setTimeRemaining(60);
    } else {
      // Practice completed
      navigate(`/feedback/${id}?attempt=new`);
    }
  };

  const handleStop = () => {
    setIsRecording(false);
    navigate(`/feedback/${id}?attempt=new`);
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
            <Button variant="destructive" onClick={handleStop}>
              <Square className="h-4 w-4 mr-2" />
              세션 종료
            </Button>
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
                  {questions[currentQuestion].text}
                </p>
              </div>

              <div className="border-t border-border pt-4">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  빠른 팁
                </h4>
                <ul className="space-y-2">
                  {questions[currentQuestion].hints.map((hint, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                      {hint}
                    </li>
                  ))}
                </ul>
              </div>

              {!isThinking && !isRecording && !recordingEnded && (
                <Button onClick={handleStart} className="w-full" variant="hero">
                  <Play className="h-4 w-4 mr-2" />
                  시작하기
                </Button>
              )}

              {isRecording && (
                <Button onClick={handleEndAnswer} className="w-full" variant="destructive">
                  <Square className="h-4 w-4 mr-2" />
                  대답 종료
                </Button>
              )}

              {recordingEnded && (
                <Button onClick={handleNext} className="w-full" variant="success">
                  다음 질문
                  <ChevronRight className="h-4 w-4 ml-2" />
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
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <Camera className="h-24 w-24 text-slate-600" />
                <div className="absolute bottom-4 left-4 text-white/60 text-sm">
                  카메라 미리보기가 여기에 표시됩니다
                </div>
              </div>
            </div>

            {/* Timer Overlay */}
            {isRecording && (
              <div className="absolute top-4 right-4 z-10">
                <Badge
                  variant={timeRemaining < 10 ? "destructive" : "default"}
                  className="text-lg px-4 py-2"
                >
                  {formatTime(timeRemaining)}
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