import { Button } from "@/components/ui/button";
import { SessionCard } from "@/components/SessionCard";
import { Plus, Filter, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";

// Mock data for demonstration
const mockSessions = [
  {
    id: "1",
    title: "Google Software Engineer",
    mode: "Interview" as const,
    progress: 65,
    daysLeft: 12,
    role: "Senior Frontend Developer",
    completedSessions: 19,
    totalSessions: 30,
    lastPractice: "2 days ago"
  },
  {
    id: "2", 
    title: "AI Conference Presentation",
    mode: "Presentation" as const,
    progress: 80,
    role: undefined,
    completedSessions: 8,
    totalSessions: 10,
    lastPractice: "Yesterday"
  },
  {
    id: "3",
    title: "Meta Product Manager",
    mode: "Interview" as const, 
    progress: 30,
    daysLeft: 25,
    role: "Senior PM - AR/VR",
    completedSessions: 9,
    totalSessions: 30,
    lastPractice: "1 week ago"
  }
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Practice Sessions</h1>
            <p className="text-muted-foreground">
              Master your interviews and presentations with AI-powered feedback
            </p>
          </div>
          
          <Button asChild variant="hero">
            <Link to="/new">
              <Plus className="h-5 w-5 mr-2" />
              New Session
            </Link>
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search sessions..." 
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Sessions Grid */}
        {mockSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSessions.map((session) => (
              <SessionCard key={session.id} {...session} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">No practice sessions yet</h2>
              <p className="text-muted-foreground mb-6">
                Create your first session to start practicing interviews or presentations with AI feedback.
              </p>
              <Button asChild variant="hero">
                <Link to="/new">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Session
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {mockSessions.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-card rounded-lg shadow-card">
              <div className="text-3xl font-bold text-primary mb-2">{mockSessions.length}</div>
              <div className="text-muted-foreground">Active Sessions</div>
            </div>
            <div className="text-center p-6 bg-gradient-card rounded-lg shadow-card">
              <div className="text-3xl font-bold text-success mb-2">
                {mockSessions.reduce((acc, session) => acc + session.completedSessions, 0)}
              </div>
              <div className="text-muted-foreground">Total Practices</div>
            </div>
            <div className="text-center p-6 bg-gradient-card rounded-lg shadow-card">
              <div className="text-3xl font-bold text-warning mb-2">
                {Math.round(mockSessions.reduce((acc, session) => acc + session.progress, 0) / mockSessions.length)}%
              </div>
              <div className="text-muted-foreground">Average Progress</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}