import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { BentoGridShowcase } from "@/components/ui/bento-product-features";
import {
  Settings2,
  Command,
  Plus,
} from "lucide-react";

// --- Helper Components for the Demo ---
// These components represent the content for each slot.

const IntegrationCard = () => (
  <Card className="flex h-full flex-col">
    <CardHeader>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
        <span className="text-3xl" role="img" aria-label="sparkles">
          🤖
        </span>
      </div>
      <CardTitle>AI Resume Optimization</CardTitle>
      <CardDescription>
        Unlock effortless enhancement. Let our AI completely rewrite and optimize your resume to pass ATS screeners and impress human recruiters with ease.
      </CardDescription>
    </CardHeader>
    <CardFooter className="mt-auto flex items-center justify-between">
      <Button variant="outline" size="sm">
        <Settings2 className="mr-2 h-4 w-4" />
        Configure
      </Button>
      <Switch
        className="data-[state=checked]:bg-blue-500"
        aria-label="Toggle integration"
        defaultChecked
      />
    </CardFooter>
  </Card>
);

const TrackersCard = () => (
  <Card className="h-full">
    <CardContent className="flex h-full flex-col justify-between p-6">
      <div>
        <CardTitle className="text-base font-medium">
          Job Trackers Connected
        </CardTitle>
        <CardDescription>03 Active Applications</CardDescription>
      </div>
      <div className="flex -space-x-2 overflow-hidden mt-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-background bg-blue-500 text-white text-xs font-bold">
          G
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-background bg-red-500 text-white text-xs font-bold">
          M
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-background bg-zinc-800 text-white text-xs font-bold">
          A
        </div>
      </div>
    </CardContent>
  </Card>
);

const FocusCard = () => (
  <Card className="h-full">
    <CardContent className="flex h-full flex-col justify-between p-6">
      <div className="flex items-start justify-between">
        <div>
          <CardTitle className="text-base font-medium">ATS Score</CardTitle>
          <CardDescription>Resume Matching</CardDescription>
        </div>
        <Badge variant="outline" className="border-green-300 text-green-600">
          Excellent
        </Badge>
      </div>
      <div className="mt-4">
        <span className="text-6xl font-bold text-green-500">98%</span>
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-4">
        <span>Average success rate</span>
        <span>Top 1%</span>
      </div>
    </CardContent>
  </Card>
);

const StatisticCard = () => (
  <Card className="relative h-full w-full overflow-hidden">
    {/* Dotted background */}
    <div
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
      }}
    />
    <CardContent className="relative z-10 flex h-full items-center justify-center p-6">
      <div className="flex flex-col items-center">
        <span className="text-8xl font-bold text-foreground/90">3X</span>
        <span className="text-sm text-muted-foreground mt-2 font-medium">More Interviews</span>
      </div>
    </CardContent>
  </Card>
);

const ProductivityCard = () => (
  <Card className="h-full">
    <CardContent className="flex h-full flex-col justify-end p-6">
      <CardTitle className="text-base font-medium">
        Tailored Cover Letters
      </CardTitle>
      <CardDescription className="mt-2">
        Generate customized cover letters that perfectly align your experience with the job description.
      </CardDescription>
    </CardContent>
  </Card>
);

const ShortcutsCard = () => (
  <Card className="h-full">
    <CardContent className="flex h-full flex-wrap items-center justify-between gap-4 p-6">
      <div>
        <CardTitle className="text-base font-medium">Shortcut Keys</CardTitle>
        <CardDescription>
          Generate tailored resumes instantly with shortcuts.
        </CardDescription>
      </div>
      <div className="flex items-center gap-2">
        {/* Styled div replacing Kbd */}
        <div className="flex h-7 w-7 items-center justify-center rounded-md border bg-background font-mono text-xs font-medium text-muted-foreground">
          <Command className="h-3 w-3" />
        </div>
        <Plus className="h-3 w-3 text-muted-foreground" />
        {/* Styled div replacing Kbd */}
        <div className="flex h-7 w-7 items-center justify-center rounded-md border bg-background font-mono text-xs font-medium text-muted-foreground">
          G
        </div>
      </div>
    </CardContent>
  </Card>
);

// --- The Default Demo ---
export function BentoGridShowcaseDemo() {
  return (
    <div className="w-full p-4 md:p-10">
      <div className="mb-12">
        <h1 className="text-center text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Powerful AI Features
        </h1>
        <p className="text-center text-lg text-muted-foreground max-w-2xl mx-auto">
          Organize, prioritize and track your job applications more
          efficiently in our trusted platform
        </p>
      </div>

      <BentoGridShowcase
        integration={<IntegrationCard />}
        trackers={<TrackersCard />}
        statistic={<StatisticCard />}
        focus={<FocusCard />}
        productivity={<ProductivityCard />}
        shortcuts={<ShortcutsCard />}
      />
    </div>
  );
}
