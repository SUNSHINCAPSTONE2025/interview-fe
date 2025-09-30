import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Play, MoreHorizontal, Briefcase, Presentation } from "lucide-react";
import { Link } from "react-router-dom";

interface SessionCardProps {
  id: string;
  title: string;
  mode: "Interview" | "Presentation";
  progress: number;
  daysLeft?: number;
  role?: string;
  totalSessions?: number;
  completedSessions?: number;
  lastPractice?: string;
}

export function SessionCard({
  id,
  title,
  mode,
  progress,
  daysLeft,
  role,
  totalSessions = 30,
  completedSessions = 0,
  lastPractice
}: SessionCardProps) {
  const ModeIcon = mode === "Interview" ? Briefcase : Presentation;
  
  return (
    <Card className="group bg-gradient-card hover:shadow-hover transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ModeIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {title}
              </CardTitle>
              {role && (
                <p className="text-sm text-muted-foreground mt-1">{role}</p>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 mt-3">
          <Badge variant={mode === "Interview" ? "default" : "secondary"} className="text-xs">
            {mode}
          </Badge>
          {daysLeft !== undefined && (
            <Badge variant="outline" className="text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              D-{daysLeft}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{completedSessions}/{totalSessions} sessions</span>
            {lastPractice && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {lastPractice}
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t border-border/50">
        <div className="flex gap-2 w-full">
          <Button asChild className="flex-1" variant="default">
            <Link to={`/practice/${id}`}>
              <Play className="h-4 w-4 mr-2" />
              Start Practice
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to={`/session/${id}`}>
              Details
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}