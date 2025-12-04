import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Mic,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Play,
  Loader2,
  RefreshCw
} from "lucide-react";
import { Link, useParams, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { sessionsApi } from "@/api/sessions";
import { useToast } from "@/hooks/use-toast";
import type { PracticeType } from "@/types/session";

export default function PracticeSetup() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [cameraPermission, setCameraPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [micPermission, setMicPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [acknowledged, setAcknowledged] = useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  // Get practice type from URL params
  const practiceType = searchParams.get("type") as PracticeType;

  // Get session data from location state (passed from PracticeGuide)
  const sessionId = location.state?.sessionId as number | undefined;
  const questions = location.state?.questions;
  const plan = location.state?.plan;

  const checkCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraPermission('granted');
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      setCameraPermission('denied');
    }
  };

  const checkMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermission('granted');
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      setMicPermission('denied');
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const allChecksComplete =
    cameraPermission === 'granted' &&
    micPermission === 'granted' &&
    acknowledged;

  // Handle interview start - navigate to practice room
  const handleStartInterview = async () => {
    if (!id || !practiceType || !questions || !sessionId) {
      toast({
        title: "오류",
        description: "세션 정보가 올바르지 않습니다.",
        variant: "destructive",
      });
      return;
    }

    // PracticeGuide에서 이미 세션이 생성되었으므로 바로 면접 실행 페이지로 이동
    toast({
      title: "면접 시작",
      description: `${questions.length}개의 질문으로 면접을 시작합니다.`,
    });

    navigate(`/practice/${id}/run?session_id=${sessionId}`, {
      state: {
        questions,
        plan
      }
    });
  };

  const notices = [
    {
      icon: AlertCircle,
      title: "뒤로가기 버튼 사용 금지",
      description: "면접 중 브라우저의 뒤로가기 버튼을 누르면 진행 상황이 손실됩니다. 반드시 화면의 버튼을 사용하세요."
    },
    {
      icon: AlertCircle,
      title: "탭 전환 금지",
      description: "면접 중 다른 탭으로 이동하거나 창을 최소화하지 마세요. 집중을 유지하는 것이 중요합니다."
    },
    {
      icon: AlertCircle,
      title: "안정적인 환경 준비",
      description: "조용한 장소에서 진행하고, 인터넷 연결이 안정적인지 확인하세요."
    },
    {
      icon: AlertCircle,
      title: "카메라 위치 확인",
      description: "카메라가 얼굴을 잘 비추는지 확인하고, 조명이 적절한지 체크하세요."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/practice/${id}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">면접 준비 체크</h1>
              <p className="text-muted-foreground">면접 시작 전 권한 및 환경을 확인하세요</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Permission Checks */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle>권한 확인</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Camera Permission */}
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      cameraPermission === 'granted' ? 'bg-success/10' : 
                      cameraPermission === 'denied' ? 'bg-destructive/10' : 
                      'bg-muted'
                    }`}>
                      <Camera className={`h-5 w-5 ${
                        cameraPermission === 'granted' ? 'text-success' : 
                        cameraPermission === 'denied' ? 'text-destructive' : 
                        'text-muted-foreground'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">카메라 권한</p>
                      <p className="text-sm text-muted-foreground">
                        {cameraPermission === 'pending' && '권한을 확인해주세요'}
                        {cameraPermission === 'granted' && '권한이 허용되었습니다'}
                        {cameraPermission === 'denied' && '브라우저 주소창의 🔒 아이콘을 클릭하여 카메라 권한을 허용한 후 새로고침하세요'}
                      </p>
                    </div>
                  </div>
                  {cameraPermission === 'pending' && (
                    <Button onClick={checkCameraPermission} size="sm">
                      확인
                    </Button>
                  )}
                  {cameraPermission === 'denied' && (
                    <Button onClick={handleRefresh} size="sm" variant="outline">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      새로고침
                    </Button>
                  )}
                  {cameraPermission === 'granted' && (
                    <CheckCircle2 className="h-6 w-6 text-success" />
                  )}
                </div>

                {/* Microphone Permission */}
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      micPermission === 'granted' ? 'bg-success/10' : 
                      micPermission === 'denied' ? 'bg-destructive/10' : 
                      'bg-muted'
                    }`}>
                      <Mic className={`h-5 w-5 ${
                        micPermission === 'granted' ? 'text-success' : 
                        micPermission === 'denied' ? 'text-destructive' : 
                        'text-muted-foreground'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">마이크 권한</p>
                      <p className="text-sm text-muted-foreground">
                        {micPermission === 'pending' && '권한을 확인해주세요'}
                        {micPermission === 'granted' && '권한이 허용되었습니다'}
                        {micPermission === 'denied' && '브라우저 주소창의 🔒 아이콘을 클릭하여 마이크 권한을 허용한 후 새로고침하세요'}
                      </p>
                    </div>
                  </div>
                  {micPermission === 'pending' && (
                    <Button onClick={checkMicPermission} size="sm">
                      확인
                    </Button>
                  )}
                  {micPermission === 'denied' && (
                    <Button onClick={handleRefresh} size="sm" variant="outline">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      새로고침
                    </Button>
                  )}
                  {micPermission === 'granted' && (
                    <CheckCircle2 className="h-6 w-6 text-success" />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Important Notices */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-warning" />
                  중요 안내사항
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {notices.map((notice, index) => (
                  <Alert key={index}>
                    <notice.icon className="h-4 w-4" />
                    <AlertTitle>{notice.title}</AlertTitle>
                    <AlertDescription>{notice.description}</AlertDescription>
                  </Alert>
                ))}

                <div 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                    acknowledged 
                      ? 'border-primary bg-primary/5 shadow-button' 
                      : 'border-border hover:border-primary/50 hover:bg-accent/50'
                  }`}
                  onClick={() => setAcknowledged(!acknowledged)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      acknowledged ? 'border-primary bg-primary' : 'border-border'
                    }`}>
                      {acknowledged && <CheckCircle2 className="h-4 w-4 text-primary-foreground" />}
                    </div>
                    <p className="font-medium">위 내용을 모두 확인했으며, 준수하겠습니다</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Start Button */}
            <div className="flex justify-between items-center">
              <Button variant="outline" asChild>
                <Link to={`/practice/${id}`}>
                  뒤로
                </Link>
              </Button>
              
              <div className="flex items-center gap-4">
                {!allChecksComplete && (
                  <Badge variant="outline" className="text-muted-foreground">
                    모든 항목을 확인해주세요
                  </Badge>
                )}
                <Button
                  variant="hero"
                  size="lg"
                  disabled={!allChecksComplete || isCreatingSession}
                  onClick={handleStartInterview}
                  className="shadow-hover"
                >
                  {isCreatingSession ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      세션 생성 중...
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      면접 시작
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}