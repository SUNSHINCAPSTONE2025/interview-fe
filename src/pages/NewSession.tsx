import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ArrowRight, Briefcase, Presentation, Calendar, Plus, Minus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

type SessionMode = "Interview" | "Presentation" | null;

interface QAItem {
  question: string;
  answer: string;
}

export default function NewSession() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<SessionMode>(null);
  const [formData, setFormData] = useState({
    // Interview fields
    company: "",
    role: "",
    interviewDate: "",
    jobCategory: "",
    jobDescription: "",
    companyValues: "",
    // Presentation fields
    title: "",
    duration: "",
    script: "",
    slidesUrl: "",
    audienceType: "",
  });
  const [qaItems, setQAItems] = useState<QAItem[]>([{ question: "", answer: "" }]);

  const addQAItem = () => {
    setQAItems([...qaItems, { question: "", answer: "" }]);
  };

  const removeQAItem = (index: number) => {
    if (qaItems.length > 1) {
      setQAItems(qaItems.filter((_, i) => i !== index));
    }
  };

  const updateQAItem = (index: number, field: keyof QAItem, value: string) => {
    const updated = qaItems.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setQAItems(updated);
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCreate = () => {
    // Here you would normally save the session
    console.log("Creating session:", { mode, formData, qaItems });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Create New Session</h1>
              <p className="text-muted-foreground">Step {step} of 3</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2 mb-8">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          {/* Step 1: Mode Selection */}
          {step === 1 && (
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle>Choose Your Practice Mode</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setMode("Interview")}
                    className={`p-6 rounded-lg border-2 transition-all duration-300 text-left ${
                      mode === "Interview" 
                        ? "border-primary bg-primary/5 shadow-button" 
                        : "border-border hover:border-primary/50 hover:bg-accent/50"
                    }`}
                  >
                    <Briefcase className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Interview Practice</h3>
                    <p className="text-muted-foreground text-sm">
                      Prepare for job interviews with customized questions based on your resume and job description.
                    </p>
                  </button>
                  
                  <button
                    onClick={() => setMode("Presentation")}
                    className={`p-6 rounded-lg border-2 transition-all duration-300 text-left ${
                      mode === "Presentation" 
                        ? "border-primary bg-primary/5 shadow-button" 
                        : "border-border hover:border-primary/50 hover:bg-accent/50"
                    }`}
                  >
                    <Presentation className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Presentation Practice</h3>
                    <p className="text-muted-foreground text-sm">
                      Perfect your presentations with script-based practice and delivery feedback.
                    </p>
                  </button>
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={handleNext} 
                    disabled={!mode}
                    variant="default"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Mode-specific Form */}
          {step === 2 && mode === "Interview" && (
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle>Interview Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company">Company Name *</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      placeholder="e.g., Google"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role *</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      placeholder="e.g., Senior Frontend Developer"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="interviewDate">Interview Date</Label>
                  <Input
                    id="interviewDate"
                    type="date"
                    value={formData.interviewDate}
                    onChange={(e) => setFormData({...formData, interviewDate: e.target.value})}
                  />
                </div>

                <div>
                  <Label>Job Category</Label>
                  <RadioGroup 
                    value={formData.jobCategory} 
                    onValueChange={(value) => setFormData({...formData, jobCategory: value})}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="technical" id="technical" />
                      <Label htmlFor="technical">Technical</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="product" id="product" />
                      <Label htmlFor="product">Product</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="design" id="design" />
                      <Label htmlFor="design">Design</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="business" id="business" />
                      <Label htmlFor="business">Business</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Resume Q&A *</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add questions and answers about your background and experience.
                  </p>
                  {qaItems.map((item, index) => (
                    <div key={index} className="space-y-2 p-4 border border-border rounded-lg mb-4">
                      <div className="flex justify-between items-center">
                        <Label>Question {index + 1}</Label>
                        {qaItems.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeQAItem(index)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <Input
                        placeholder="e.g., Tell me about your previous experience with React"
                        value={item.question}
                        onChange={(e) => updateQAItem(index, "question", e.target.value)}
                      />
                      <Textarea
                        placeholder="Your answer..."
                        value={item.answer}
                        onChange={(e) => updateQAItem(index, "answer", e.target.value)}
                        rows={3}
                      />
                    </div>
                  ))}
                  <Button variant="outline" onClick={addQAItem} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </div>

                <div>
                  <Label htmlFor="jobDescription">Job Description</Label>
                  <Textarea
                    id="jobDescription"
                    value={formData.jobDescription}
                    onChange={(e) => setFormData({...formData, jobDescription: e.target.value})}
                    placeholder="Paste the job description here..."
                    rows={4}
                  />
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handlePrev}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={handleNext}>
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Presentation Form */}
          {step === 2 && mode === "Presentation" && (
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle>Presentation Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title">Presentation Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., AI in Healthcare: Future Prospects"
                  />
                </div>

                <div>
                  <Label htmlFor="duration">Expected Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    placeholder="e.g., 15"
                  />
                </div>

                <div>
                  <Label htmlFor="script">Presentation Script *</Label>
                  <Textarea
                    id="script"
                    value={formData.script}
                    onChange={(e) => setFormData({...formData, script: e.target.value})}
                    placeholder="Write your presentation script here..."
                    rows={8}
                  />
                </div>

                <div>
                  <Label htmlFor="slidesUrl">Slides URL (optional)</Label>
                  <Input
                    id="slidesUrl"
                    value={formData.slidesUrl}
                    onChange={(e) => setFormData({...formData, slidesUrl: e.target.value})}
                    placeholder="https://docs.google.com/presentation/..."
                  />
                </div>

                <div>
                  <Label>Audience Type</Label>
                  <RadioGroup 
                    value={formData.audienceType} 
                    onValueChange={(value) => setFormData({...formData, audienceType: value})}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="peers" id="peers" />
                      <Label htmlFor="peers">Peers/Colleagues</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="executives" id="executives" />
                      <Label htmlFor="executives">Executives/Leadership</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="public" id="public" />
                      <Label htmlFor="public">General Public</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handlePrev}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={handleNext}>
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Summary & Create */}
          {step === 3 && (
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle>Session Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h3 className="font-semibold text-lg mb-4">
                    {mode} Practice Session
                  </h3>
                  
                  {mode === "Interview" ? (
                    <div className="space-y-2 text-sm">
                      <p><strong>Company:</strong> {formData.company}</p>
                      <p><strong>Role:</strong> {formData.role}</p>
                      {formData.interviewDate && (
                        <p><strong>Interview Date:</strong> {formData.interviewDate}</p>
                      )}
                      <p><strong>Questions:</strong> {qaItems.length} prepared</p>
                      <p><strong>Category:</strong> {formData.jobCategory || "Not specified"}</p>
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm">
                      <p><strong>Title:</strong> {formData.title}</p>
                      {formData.duration && (
                        <p><strong>Duration:</strong> {formData.duration} minutes</p>
                      )}
                      <p><strong>Script Length:</strong> {formData.script.length} characters</p>
                      <p><strong>Audience:</strong> {formData.audienceType || "Not specified"}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handlePrev}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={handleCreate} variant="success">
                    Create Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}