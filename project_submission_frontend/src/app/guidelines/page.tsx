import Container from "@/utils/Container";
import Link from "next/link";
import {
  CheckCircle2,
  FileCode2,
  Globe,
  ShieldAlert,
  ArrowRight,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Submission Guidelines | ProjectHub",
  description:
    "Official guidelines, repository requirements, and review rubrics for academic project submissions on ProjectHub.",
};

export const dynamic = "force-static";

export default function GuidelinesPage() {
  const requirements = [
    {
      icon: FileCode2,
      title: "Clean Git Repository & Commits",
      desc: "Ensure your GitHub repository has a descriptive README.md, clear commit history, .gitignore file, and no committed secrets or node_modules.",
    },
    {
      icon: Globe,
      title: "Active Live Deployment",
      desc: "Provide a working live deployment (e.g., Vercel, Netlify, Render, Railway). Ensure CORS is configured properly and APIs are accessible without errors.",
    },
    {
      icon: CheckCircle2,
      title: "Complete Core Requirements",
      desc: "All functional requirements outlined in your assignment brief must be implemented before requesting mentor evaluation.",
    },
    {
      icon: ShieldAlert,
      title: "Academic Integrity",
      desc: "All submitted code must be your original work or properly cited where third-party libraries or open-source packages are used.",
    },
  ];

  const faqs = [
    {
      q: "How long does mentor review usually take?",
      a: "Mentors typically review submissions within 24 to 48 business hours after assignment hand-in.",
    },
    {
      q: "What should I do if my submission is rejected?",
      a: "Carefully review the rejection feedback provided by your mentor, fix the highlighted issues in your codebase or live deployment, and submit again.",
    },
    {
      q: "Can I update my repository after submitting?",
      a: "Yes, you can push commits to your repository; however, we recommend notifying your mentor or resubmitting if major architectural changes were made.",
    },
  ];

  return (
    <main className="min-h-screen py-10 bg-slate-50/50">
      <Container>
        {/* Header Hero */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Submission Handbook</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Project Submission Guidelines
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Review these standards before submitting your academic milestone to ensure seamless mentor evaluation and approval.
          </p>
        </div>

        {/* Requirements Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {requirements.map((req, idx) => {
            const Icon = req.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1.5">
                  {req.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {req.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Evaluation Rubric Section */}
        <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Mentor Evaluation Rubric
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-2">Criterion</th>
                  <th className="py-3 px-2">Weight</th>
                  <th className="py-3 px-2">Expectation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3 px-2 font-semibold text-slate-900">Functionality & Features</td>
                  <td className="py-3 px-2">40%</td>
                  <td className="py-3 px-2">App meets all specified assignment criteria with zero fatal runtime crashes.</td>
                </tr>
                <tr>
                  <td className="py-3 px-2 font-semibold text-slate-900">Code Quality & Architecture</td>
                  <td className="py-3 px-2">30%</td>
                  <td className="py-3 px-2">Clean folder structure, meaningful variable names, and modular components.</td>
                </tr>
                <tr>
                  <td className="py-3 px-2 font-semibold text-slate-900">UI / UX Polish</td>
                  <td className="py-3 px-2">20%</td>
                  <td className="py-3 px-2">Responsive mobile/desktop layouts, clear states (loading, empty, errors).</td>
                </tr>
                <tr>
                  <td className="py-3 px-2 font-semibold text-slate-900">Documentation & Setup</td>
                  <td className="py-3 px-2">10%</td>
                  <td className="py-3 px-2">README with tech stack, installation steps, and environment variables.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto space-y-4 mb-12">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm"
              >
                <h3 className="font-semibold text-sm text-slate-900 mb-1">
                  {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="max-w-2xl mx-auto text-center bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 rounded-2xl border border-primary/20">
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            Ready to submit your project?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mb-5">
            Head over to your student dashboard to submit your GitHub repository and live deployment link.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition shadow-sm"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Container>
    </main>
  );
}
