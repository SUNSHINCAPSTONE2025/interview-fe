import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Play, Target, Clock, Lightbulb, Star } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";

export default function PracticeGuide() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [practiceType, setPracticeType] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  // Mock session data
  const session = {
    id: "1",
    title: "Google Software Engineer",
    mode: "Interview" as const,
    lastFeedback: "Focus on providing more specific examples in your STAR responses",
    totalQuestions: 15,
    practiceTypes: {
      "technical": "Technical Skills (8 questions)",
      "behavioral": "Behavioral Questions (7 questions)", 
      "both": "Complete Interview (15 questions)"
    }
  };

  const goals = [
    { id: "examples", label: "Use specific examples in answers", time: "5 min" },
    { id: "pace", label: "Practice speaking at optimal pace", time: "3 min" },
    { id: "structure", label: "Improve STAR method structure", time: "7 min" },
    { id: "confidence", label: "Build confident delivery", time: "4 min" }
  ];

  const tips = [
    "Structure answers using STAR method (Situation, Task, Action, Result)",
    "Maintain eye contact with the camera throughout your response",
    "Take a brief pause before answering to collect your thoughts",
    "Speak clearly and at a moderate pace - aim for 150-160 words per minute"
  ];

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const estimatedTime = selectedGoals.length * 3 + 5; // Rough estimation

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/session/${id}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{session.title}</h1>
              <p className="text-muted-foreground">Practice Guide</p>
            </div>
          </div>

          {/* Step 1: Practice Type Selection */}
          {step === 1 && (
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Select Practice Type
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup value={practiceType} onValueChange={setPracticeType}>
                  {Object.entries(session.practiceTypes).map(([key, label]) => (
                    <div key={key} className="flex items-center space-x-2 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                      <RadioGroupItem value={key} id={key} />
                      <Label htmlFor={key} className="flex-1 cursor-pointer">
                        {label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="flex justify-end">
                  <Button 
                    onClick={() => setStep(2)} 
                    disabled={!practiceType}
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Goals Selection */}
          {step === 2 && (
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Today's Focus Goals
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Choose 2-3 specific areas to focus on during this practice session
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {goals.map((goal) => (
                    <div
                      key={goal.id}
                      onClick={() => handleGoalToggle(goal.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                        selectedGoals.includes(goal.id)
                          ? "border-primary bg-primary/5 shadow-button"
                          : "border-border hover:border-primary/50 hover:bg-accent/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Label className="cursor-pointer">{goal.label}</Label>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {goal.time}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedGoals.length > 0 && (
                  <div className="p-4 bg-success-light rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Estimated Time:</span>
                      <Badge variant="outline">~{estimatedTime} minutes</Badge>
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button 
                    onClick={() => setStep(3)} 
                    disabled={selectedGoals.length === 0}
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Tips and Start */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Last Feedback */}
              {session.lastFeedback && (
                <Card className="bg-gradient-card shadow-card border-warning/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-warning">
                      <Lightbulb className="h-5 w-5" />
                      Key Insight from Last Session
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{session.lastFeedback}</p>
                  </CardContent>
                </Card>
              )}

              {/* Tips */}
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Practice Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-medium text-primary">{index + 1}</span>
                        </div>
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Session Summary */}
              <Card className="bg-gradient-primary text-primary-foreground shadow-hover">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Ready to Practice!</h3>
                    <div className="space-y-2 text-sm opacity-90">
                      <p>• Type: {session.practiceTypes[practiceType as keyof typeof session.practiceTypes]}</p>
                      <p>• Goals: {selectedGoals.length} selected</p>
                      <p>• Estimated time: ~{estimatedTime} minutes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button 
                  variant="hero" 
                  onClick={() => navigate(`/practice/${id}/run`)}
                  className="shadow-hover"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Practice
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}