import Container from "@/utils/Container";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  Github,
  Trophy,
  Sparkles,
  ArrowRight,
  Code2,
} from "lucide-react";
import type { Metadata } from "next";
import { SubmissionItem } from "@/types";

export const metadata: Metadata = {
  title: "Student Project Showcase | ProjectHub",
  description:
    "Explore outstanding student projects and milestone submissions approved by academic mentors.",
};

// ISR: Incremental Static Regeneration every 60 seconds
export const revalidate = 60;

// Curated fallbacks for build-time safety and visual excellence
const fallbackProjects: SubmissionItem[] = [
  {
    id: "sample-1",
    projectName: "FlowBoard - Agile Task Orchestrator",
    repositoryUrl: "https://github.com",
    liveUrl: "https://vercel.com",
    description:
      "A real-time Kanban and milestone management workspace built with Next.js 15, React 19, and Tailwind CSS. Features drag-and-drop workflows and mentor review queues.",
    status: "Approved",
    createdAt: new Date().toISOString(),
    reviewedAt: new Date().toISOString(),
    rejectionReason: null,
  },
  {
    id: "sample-2",
    projectName: "EduPulse - Learning Analytics Platform",
    repositoryUrl: "https://github.com",
    liveUrl: "https://vercel.com",
    description:
      "Interactive analytics dashboard tracking student assignment progression, engagement metrics, and automated feedback loops with visual charts.",
    status: "Approved",
    createdAt: new Date().toISOString(),
    reviewedAt: new Date().toISOString(),
    rejectionReason: null,
  },
  {
    id: "sample-3",
    projectName: "CodeReviewer AI - Automated Lint & Feedback",
    repositoryUrl: "https://github.com",
    liveUrl: "https://vercel.com",
    description:
      "A developer productivity tool that analyzes pull requests against academic rubric standards and offers real-time suggestions before mentor sign-off.",
    status: "Approved",
    createdAt: new Date().toISOString(),
    reviewedAt: new Date().toISOString(),
    rejectionReason: null,
  },
];

async function getShowcaseProjects(): Promise<SubmissionItem[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:4097/api/v1";

  try {
    const res = await fetch(`${baseUrl}/submission/all?status=Approved&limit=9`, {
      next: { revalidate: 60, tags: ["showcase"] },
    });

    if (!res.ok) {
      return fallbackProjects;
    }

    const data = await res.json();
    const fetched = data.result?.submissions || data.data?.submissions || [];

    return fetched.length > 0 ? fetched : fallbackProjects;
  } catch (err) {
    console.warn("ISR fetch warning (using fallback projects):", err);
    return fallbackProjects;
  }
}

export default async function ShowcasePage() {
  const projects = await getShowcaseProjects();

  return (
    <main className="min-h-screen py-10 bg-slate-50/50">
      <Container>
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>Hall of Fame • ISR Powered</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Student Project Showcase
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Discover outstanding projects built by students, reviewed by industry mentors, and approved for academic excellence.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <Badge variant="approved">Approved</Badge>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-slate-900 tracking-tight">
                    {proj.projectName}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 mt-1.5 leading-relaxed">
                    {proj.description}
                  </p>
                </div>
              </div>

              {/* Action Links */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {proj.repositoryUrl && (
                    <a
                      href={proj.repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-slate-700 hover:text-primary transition font-medium px-2 py-1 rounded-md bg-slate-100"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </a>
                  )}

                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline font-medium px-2 py-1 rounded-md bg-primary/10"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <Link
                  href={`/submission/${proj.id}`}
                  className="text-slate-500 hover:text-slate-900 font-medium inline-flex items-center gap-0.5"
                >
                  <span>Review</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="max-w-2xl mx-auto text-center p-8 bg-white border border-slate-200/90 rounded-2xl shadow-sm">
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Want your project featured here?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mb-5 max-w-md mx-auto">
            Submit your assignment on ProjectHub. Once your mentor reviews and marks it approved, it will be automatically indexed in the showcase.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition shadow-sm"
          >
            <span>Submit Assignment</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Container>
    </main>
  );
}
