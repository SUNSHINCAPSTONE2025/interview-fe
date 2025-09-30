import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Timer,
  Volume2,
  Heart,
  MessageSquare,
  RotateCcw,
  Download
} from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";

export default function Feedback() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const attemptId = searchParams.get("attempt");

  const feedbackData = {
    overallScore: 78,
    previousScore: 73,
    improvement: 5,
    date: "2025-09-28",
    duration: "45 min",
    contentScore: 80,
    behaviorScore: 76,
    questions: [
      {
        id: 1,
        prompt: "Tell me about a challenging technical problem you've solved recently.",
        transcript: "In my previous role at TechCorp, I encountered a significant performance issue with our React application that was causing slow load times...",
        contentFeedback: {
          logic: 85,
          expression: 80,
          relevance: 90,
          feedback: "Excellent use of the STAR method. Your explanation was clear and well-structured. The specific metrics you provided (40% performance improvement) made your answer very compelling.",
          sampleAnswer: "Consider also mentioning the broader impact on user engagement and team collaboration during the solution implementation."
        },
        behaviorFeedback: {
          eyeContact: 75,
          speed: 160,
          speedScore: 85,
          tone: 80,
          positivity: 90,
          fillerWords: 12
        }
      }
    ],
    strengths: [
      "Clear and structured answers using STAR method",
      "Good use of specific examples and metrics",
      "Positive and confident tone",
      "Strong technical vocabulary"
    ],
    improvements: [
      "Maintain more consistent eye contact with the camera",
      "Reduce speaking pace slightly (current: 160 WPM, target: 150 WPM)",
      "Minimize filler words ('um', 'uh') - appeared 12 times",
      "Take brief pauses between key points for emphasis"
    ]
  };

  const improvementTrend = feedbackData.improvement > 0 ? "up" : "down";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/session/${id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1">Practice Feedback</h1>
            <p className="text-muted-foreground">
              {feedbackData.date} • {feedbackData.duration}
            </p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Overall Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Overall Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-3">
                <div className="text-5xl font-bold text-primary">
                  {feedbackData.overallScore}
                </div>
                <Badge variant={improvementTrend === "up" ? "default" : "destructive"}>
                  {improvementTrend === "up" ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(feedbackData.improvement)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Previous: {feedbackData.previousScore}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-3">{feedbackData.contentScore}%</div>
              <Progress value={feedbackData.contentScore} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Logic • Expression • Relevance
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Behavior</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-3">{feedbackData.behaviorScore}%</div>
              <Progress value={feedbackData.behaviorScore} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Gaze • Speed • Tone • Positivity
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Key Insights */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-success-light border-success/20">
            <CardHeader>
              <CardTitle className="text-success">Strengths</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {feedbackData.strengths.map((strength, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-success mt-2 flex-shrink-0" />
                    {strength}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-warning-light border-warning/20">
            <CardHeader>
              <CardTitle className="text-warning">Areas to Improve</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {feedbackData.improvements.map((improvement, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-warning mt-2 flex-shrink-0" />
                    {improvement}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Feedback per Question */}
        <div className="space-y-6">
          {feedbackData.questions.map((question, index) => (
            <Card key={question.id} className="bg-gradient-card shadow-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-3">Question {index + 1}</Badge>
                    <CardTitle className="text-lg">{question.prompt}</CardTitle>
                  </div>
                  <Button variant="outline" size="sm">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="transcript" className="space-y-6">
                  <TabsList>
                    <TabsTrigger value="transcript">Transcript</TabsTrigger>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="behavior">Behavior</TabsTrigger>
                  </TabsList>

                  <TabsContent value="transcript">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm leading-relaxed">{question.transcript}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="content" className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-primary mb-1">
                          {question.contentFeedback.logic}
                        </div>
                        <div className="text-xs text-muted-foreground">Logic</div>
                      </div>
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-primary mb-1">
                          {question.contentFeedback.expression}
                        </div>
                        <div className="text-xs text-muted-foreground">Expression</div>
                      </div>
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-primary mb-1">
                          {question.contentFeedback.relevance}
                        </div>
                        <div className="text-xs text-muted-foreground">Relevance</div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <h4 className="font-semibold mb-2">Feedback</h4>
                      <p className="text-sm mb-4">{question.contentFeedback.feedback}</p>
                      
                      <div className="pt-4 border-t border-border">
                        <h5 className="text-sm font-medium mb-2">Suggested Enhancement</h5>
                        <p className="text-sm text-muted-foreground italic">
                          {question.contentFeedback.sampleAnswer}
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="behavior" className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{question.behaviorFeedback.eyeContact}%</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Eye Contact</div>
                        <Progress value={question.behaviorFeedback.eyeContact} className="h-1.5 mt-2" />
                      </div>

                      <div className="p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Timer className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{question.behaviorFeedback.speed} WPM</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Speaking Speed</div>
                        <Progress value={question.behaviorFeedback.speedScore} className="h-1.5 mt-2" />
                      </div>

                      <div className="p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Volume2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{question.behaviorFeedback.tone}%</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Tone Stability</div>
                        <Progress value={question.behaviorFeedback.tone} className="h-1.5 mt-2" />
                      </div>

                      <div className="p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Heart className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{question.behaviorFeedback.positivity}%</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Positivity</div>
                        <Progress value={question.behaviorFeedback.positivity} className="h-1.5 mt-2" />
                      </div>

                      <div className="p-4 bg-muted/30 rounded-lg md:col-span-2">
                        <div className="flex items-center justify-between mb-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{question.behaviorFeedback.fillerWords}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Filler Words Count</div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Target: {"<10"} per minute
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button asChild variant="outline">
            <Link to={`/session/${id}`}>
              Back to Session
            </Link>
          </Button>
          <Button asChild variant="hero">
            <Link to={`/practice/${id}`}>
              Practice Again
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}