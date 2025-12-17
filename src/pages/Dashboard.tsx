import { Button } from "@/components/ui/button";
import { SessionCard } from "@/components/SessionCard";
import { Plus, Filter, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { contentsApi } from "@/api/contents";
import { Content } from "@/types/content";

// Content를 SessionCard props로 변환하는 함수
function contentToSessionCard(content: Content) {
  const progress = 20; // 3/15 = 20% (화면 캡처용 하드코딩)

  let daysLeft: number | undefined;
  if (content.interview_date) {
    const interviewDate = new Date(content.interview_date);
    const today = new Date();
    const diffTime = interviewDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    daysLeft = diffDays > 0 ? diffDays : undefined;
  }

  return {
    id: content.id.toString(),
    title: content.company,
    mode: "Interview" as const,
    progress,
    daysLeft,
    role: content.role,
    totalSessions: 15,  // 화면 캡처용 하드코딩
    completedSessions: 3,  // 화면 캡처용 하드코딩
  };
}

export default function Dashboard() {
  const { isAuthenticated } = useAuth();

  // 로그인한 경우에만 데이터 가져오기
  const { data: contents, isLoading } = useQuery({
    queryKey: ["contents"],
    queryFn: contentsApi.getAll,
    enabled: isAuthenticated,
  });

  // 로그인하지 않은 경우 - 랜딩 화면
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="text-center max-w-2xl mx-auto">
              <div className="mb-8">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Plus className="h-16 w-16 text-primary" />
                </div>
                <h1 className="text-4xl font-bold mb-4">
                  AI와 함께 성장하세요
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  면접과 발표 연습을 AI가 실시간으로 분석하고 피드백을 제공합니다.
                  <br />
                  체계적인 연습으로 자신감을 키우세요.
                </p>
              </div>

              <Button asChild size="lg" variant="hero" className="text-lg px-8 py-6">
                <Link to="/auth">
                  로그인하고 성장하기
                </Link>
              </Button>

              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="p-6 rounded-lg bg-card border">
                  <h3 className="font-semibold mb-2">실시간 AI 피드백</h3>
                  <p className="text-sm text-muted-foreground">
                    연습 중 실시간으로 답변을 분석하고 개선점을 제안합니다
                  </p>
                </div>
                <div className="p-6 rounded-lg bg-card border">
                  <h3 className="font-semibold mb-2">체계적인 관리</h3>
                  <p className="text-sm text-muted-foreground">
                    면접 일정과 연습 진행도를 한눈에 확인하세요
                  </p>
                </div>
                <div className="p-6 rounded-lg bg-card border">
                  <h3 className="font-semibold mb-2">맞춤형 질문</h3>
                  <p className="text-sm text-muted-foreground">
                    직무와 회사에 맞는 예상 질문으로 완벽하게 준비하세요
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 로딩 중
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">로딩 중...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 로그인했고 데이터를 가져온 경우
  const sessions = contents?.map(contentToSessionCard) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">연습 세션</h1>
            <p className="text-muted-foreground">
              AI 기반 피드백으로 면접과 발표를 마스터하세요
            </p>
          </div>

          <Button asChild variant="hero">
            <Link to="/new">
              <Plus className="h-5 w-5 mr-2" />
              새 세션 만들기
            </Link>
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="세션 검색..."
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            필터
          </Button>
        </div>

        {/* Sessions Grid */}
        {sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <SessionCard key={session.id} {...session} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">아직 연습 세션이 없습니다</h2>
              <p className="text-muted-foreground mb-6">
                AI 피드백과 함께 면접이나 발표 연습을 시작하려면 첫 세션을 만드세요.
              </p>
              <Button asChild variant="hero">
                <Link to="/new">
                  <Plus className="h-5 w-5 mr-2" />
                  첫 세션 만들기
                </Link>
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}