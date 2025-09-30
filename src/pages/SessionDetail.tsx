import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Play, Calendar, TrendingUp, Award, Eye, Timer, MessageSquare } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function SessionDetail() {
  const { id } = useParams();

  // Mock session data
  const session = {
    id: "1",
    title: "Google Software Engineer",
    mode: "Interview" as const,
    role: "Senior Frontend Developer",
    progress: 65,
    daysLeft: 12,
    completedSessions: 19,
    totalSessions: 30,
    company: "Google",
    interviewDate: "2025-10-12",
    jobCategory: "Technical",
    qaItems: [
      { question: "Tell me about your experience with React", answer: "I have 5+ years..." },
      { question: "Describe a challenging technical problem", answer: "In my previous role..." }
    ],
    lastFeedback: {
      score: 78,
      improvement: "+5",
      strengths: ["Clear communication", "Good examples"],
      improvements: ["Pace control", "Eye contact"]
    },
    history: [
      { date: "2025-09-28", score: 78, type: "Technical", duration: "45 min" },
      { date: "2025-09-26", score: 73, type: "Behavioral", duration: "40 min" },
      { date: "2025-09-24", score: 70, type: "Both", duration: "60 min" }
    ]
  };

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
              <h1 className="text-3xl font-bold">{session.title}</h1>
              <Badge>{session.mode}</Badge>
            </div>
            <p className="text-muted-foreground">{session.role}</p>
          </div>
          <Button asChild variant="hero">
            <Link to={`/practice/${id}`}>
              <Play className="h-5 w-5 mr-2" />
              Start Practice
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="data">Input Data</TabsTrigger>
            <TabsTrigger value="plan">Plan</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Progress Card */}
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Overall Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{session.progress}%</div>
                  <Progress value={session.progress} className="mb-2" />
                  <p className="text-xs text-muted-foreground">
                    {session.completedSessions} of {session.totalSessions} sessions
                  </p>
                </CardContent>
              </Card>

              {/* Days Left Card */}
              {session.daysLeft && (
                <Card className="bg-gradient-card shadow-card">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Time Remaining
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">D-{session.daysLeft}</div>
                    <p className="text-xs text-muted-foreground">
                      Interview on {new Date(session.interviewDate).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Last Score Card */}
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Latest Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <div className="text-3xl font-bold">{session.lastFeedback.score}</div>
                    <Badge variant="outline" className="text-success">
                      {session.lastFeedback.improvement}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {session.history[0].date}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recommended Practice */}
            <Card className="bg-gradient-primary text-primary-foreground shadow-hover">
              <CardHeader>
                <CardTitle>Today's Recommended Practice</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Based on your progress, we recommend focusing on behavioral questions today.</p>
                <div className="flex items-center gap-4 text-sm opacity-90">
                  <span className="flex items-center gap-1">
                    <Timer className="h-4 w-4" />
                    ~35 minutes
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    7 questions
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Feedback Highlights */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle>Recent Feedback Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-3 text-success">Strengths</h4>
                    <ul className="space-y-2">
                      {session.lastFeedback.strengths.map((strength, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-success mt-2" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-3 text-warning">Areas to Improve</h4>
                    <ul className="space-y-2">
                      {session.lastFeedback.improvements.map((improvement, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-warning mt-2" />
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Input Data Tab */}
          <TabsContent value="data">
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle>Session Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Company</Label>
                    <p className="mt-1">{session.company}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Role</Label>
                    <p className="mt-1">{session.role}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Category</Label>
                    <p className="mt-1">{session.jobCategory}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Interview Date</Label>
                    <p className="mt-1">{new Date(session.interviewDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">Resume Q&A</Label>
                  <div className="space-y-4">
                    {session.qaItems.map((item, index) => (
                      <div key={index} className="p-4 bg-muted/50 rounded-lg">
                        <p className="font-medium text-sm mb-2">{item.question}</p>
                        <p className="text-sm text-muted-foreground">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Button variant="outline">Edit Information</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Plan Tab */}
          <TabsContent value="plan">
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Practice Roadmap
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Recommended schedule leading up to your interview
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={`p-4 rounded-lg border-2 ${
                      i === 0 ? "border-primary bg-primary/5" : "border-border"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Week {i + 1} Goals</p>
                          <p className="text-sm text-muted-foreground">
                            {i === 0 ? "Current week" : `${(i * 7)} days from now`}
                          </p>
                        </div>
                        <Badge variant={i === 0 ? "default" : "outline"}>
                          {i < 2 ? "In Progress" : "Upcoming"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle>Practice History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {session.history.map((record, index) => (
                    <Link 
                      key={index}
                      to={`/feedback/${id}?attempt=${index}`}
                      className="block p-4 rounded-lg border border-border hover:bg-accent/50 hover:shadow-card transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{record.type} Practice</p>
                          <p className="text-sm text-muted-foreground">{record.date} • {record.duration}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{record.score}</div>
                          <Eye className="h-4 w-4 ml-auto text-muted-foreground" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
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