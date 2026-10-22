import RegisterForm from "@/components/auth/RegisterForm";
import { FolderGit2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Student Account | ProjectHub",
  description: "Register for ProjectHub to submit and track academic projects and milestone reviews.",
};

export const dynamic = "force-static";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Static SSG Shell: Prerendered at build time */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
            <FolderGit2 className="w-6 h-6 text-primary" />
          </div>
        </div>
        <h1 className="mt-4 text-center text-2xl font-bold tracking-tight text-gray-900">
          Create Student Account
        </h1>
        <p className="mt-1 text-center text-sm text-gray-500">
          Submit and track your academic project milestones
        </p>
      </div>

      {/* Client Island for Interactive Registration */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <RegisterForm />
      </div>
    </div>
  );
}
