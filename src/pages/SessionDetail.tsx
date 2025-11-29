import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Play, Calendar, TrendingUp, Award, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { contentsApi } from "@/api/contents";
import { sessionsApi } from "@/api/sessions";
import type { Content } from "@/types/content";
import type { Session } from "@/types/session";

export default function SessionDetail() {
  const { id } = useParams();
  const [content, setContent] = useState<Content | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const contentId = parseInt(id);

        // Fetch content details
        const allContents = await contentsApi.getAll();
        const foundContent = allContents.find(c => c.id === contentId);

        if (foundContent) {
          setContent(foundContent);

          // Fetch sessions for this content
          const contentSessions = await sessionsApi.getByContentId(contentId);
          setSessions(contentSessions);
        }
      } catch (error) {
        console.error("Failed to fetch content details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">콘텐츠를 찾을 수 없습니다</h2>
          <Button asChild>
            <Link to="/">홈으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    );
  }

  const progress = content.total_sessions > 0
    ? Math.round((content.completed_sessions / content.total_sessions) * 100)
    : 0;

  const daysLeft = content.interview_date
    ? Math.max(0, Math.ceil((new Date(content.interview_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{content.company} - {content.role}</h1>
              <Badge>Interview</Badge>
            </div>
            <p className="text-muted-foreground">{content.role}</p>
          </div>
          <Button asChild variant="hero">
            <Link to={`/practice/${id}`}>
              <Play className="h-5 w-5 mr-2" />
              연습 시작
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="history" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto">
            <TabsTrigger value="history">기록</TabsTrigger>
            <TabsTrigger value="info">면접정보</TabsTrigger>
          </TabsList>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Progress Card */}
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    전체 진행률
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{progress}%</div>
                  <Progress value={progress} className="mb-2" />
                  <p className="text-xs text-muted-foreground">
                    {content.completed_sessions} / {content.total_sessions} 세션
                  </p>
                </CardContent>
              </Card>

              {/* Days Left Card */}
              {daysLeft !== null && (
                <Card className="bg-gradient-card shadow-card">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      남은 시간
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">D-{daysLeft}</div>
                    <p className="text-xs text-muted-foreground">
                      면접: {content.interview_date ? new Date(content.interview_date).toLocaleDateString('ko-KR') : '미정'}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Last Score Card - TODO: 백엔드 피드백 API 필요 */}
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    완료한 세션
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{sessions.filter(s => s.status === 'done').length}</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    전체 {sessions.length}개 세션
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Practice History */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle>연습 기록</CardTitle>
              </CardHeader>
              <CardContent>
                {sessions.length > 0 ? (
                  <div className="space-y-3">
                    {sessions.map((session) => (
                      <Link
                        key={session.id}
                        to={`/feedback/${session.id}`}
                        className="block p-4 rounded-lg border border-border hover:bg-accent/50 hover:shadow-card transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">세션 #{session.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {session.created_at ? new Date(session.created_at).toLocaleDateString('ko-KR') : '날짜 미상'}
                              {' • '}
                              {session.question_count}개 질문
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant={session.status === 'done' ? 'default' : 'outline'}>
                              {session.status === 'done' ? '완료' : session.status === 'running' ? '진행중' : '초안'}
                            </Badge>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    아직 연습 기록이 없습니다. 첫 연습을 시작해보세요!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Interview Info Tab */}
          <TabsContent value="info">
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle>세션 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">회사</Label>
                    <p className="mt-1">{content.company}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">직무</Label>
                    <p className="mt-1">{content.role}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">면접 날짜</Label>
                    <p className="mt-1">
                      {content.interview_date
                        ? new Date(content.interview_date).toLocaleDateString('ko-KR')
                        : '미정'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">총 세션 수</Label>
                    <p className="mt-1">{content.total_sessions}개</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">자기소개서</Label>
                  <p className="text-sm text-muted-foreground">
                    자기소개서 정보는 백엔드 API에서 가져올 예정입니다.
                  </p>
                </div>

                <Button variant="outline">정보 수정</Button>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-muted-foreground ${className}`}>{children}</div>;
}