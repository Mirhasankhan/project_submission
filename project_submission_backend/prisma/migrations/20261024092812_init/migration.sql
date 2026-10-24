-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Student', 'Mentor');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('Pending', 'Rejected', 'Approved');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'Student',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "projectName" VARCHAR(50) NOT NULL,
    "repositoryUrl" VARCHAR(100) NOT NULL,
    "normalizedRepo" VARCHAR(100) NOT NULL,
    "liveUrl" VARCHAR(100) NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'Pending',
    "studentId" TEXT NOT NULL,
    "reviewedAt" TIMESTAMP(3),
    "rejectionReason" VARCHAR(1000),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "Submission_status_createdAt_idx" ON "Submission"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Submission_studentId_createdAt_idx" ON "Submission"("studentId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_studentId_projectName_key" ON "Submission"("studentId", "projectName");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_studentId_normalizedRepo_key" ON "Submission"("studentId", "normalizedRepo");

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
