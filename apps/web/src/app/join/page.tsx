'use client';

import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function JoinPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appRefId, setAppRefId] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    studentId: '',
    yearOfStudy: '1',
    branch: '',
    interest: 'ROBOTICS_HARDWARE',
    githubOrPortfolio: '',
    statementOfPurpose: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const cleanPortfolio = formData.githubOrPortfolio.trim();
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        studentId: formData.studentId.trim(),
        yearOfStudy: parseInt(formData.yearOfStudy, 10) || 1,
        branch: formData.branch.trim(),
        interest: formData.interest,
        githubOrPortfolio: cleanPortfolio.length > 0
          ? (cleanPortfolio.startsWith('http://') || cleanPortfolio.startsWith('https://') ? cleanPortfolio : `https://${cleanPortfolio}`)
          : '',
        statementOfPurpose: formData.statementOfPurpose.trim(),
      };

      const res = await fetch(`${API_BASE}/public/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => null);

      if (!res) {
        throw new Error('Network error. Unable to reach TRAIC API backend. Please check your internet connection.');
      }

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        if (data?.error?.details && typeof data.error.details === 'object') {
          const detailMessages = Object.entries(data.error.details)
            .map(([field, errs]: [string, any]) => `${field}: ${Array.isArray(errs) ? errs.join(', ') : errs}`)
            .join(' • ');
          throw new Error(detailMessages || data?.error?.message || 'Submission failed');
        }
        throw new Error(data?.error?.message || 'Application submission failed. Please verify your details.');
      }

      const resData = await res.json().catch(() => null);
      setAppRefId(resData?.data?.id ? `TRAIC-${resData.data.id.slice(0, 8).toUpperCase()}` : `TRAIC-2025-${Math.floor(1000 + Math.random() * 9000)}`);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-0 py-16 circuit-pattern">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-mono text-accent mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>COHORT 2025 // MEMBERSHIP</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-text-1">
            Join the TRAIC Collective
          </h1>
          <p className="mt-3 text-sm sm:text-base text-text-2 max-w-xl mx-auto leading-relaxed">
            We are looking for students who are curious, persistent, and eager to get their hands dirty with soldering irons, code compilers, and autonomous hardware.
          </p>
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-success/40 bg-surface/95 p-8 sm:p-10 shadow-2xl backdrop-blur-md">
            <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-border/80 pb-6 mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success/20 text-success border border-success/30 flex-shrink-0">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="text-center sm:text-left">
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-success uppercase">
                  <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                  Application Verified & Logged
                </span>
                <h2 className="text-2xl font-black text-text-1">Welcome to the Pipeline!</h2>
              </div>
            </div>

            {/* Reference ID & Track Box */}
            <div className="rounded-xl border border-border bg-bg-1/80 p-5 mb-6 font-mono text-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                <span className="text-text-2">OFFICIAL APPLICATION ID:</span>
                <span className="text-accent font-bold text-sm bg-accent/10 px-2.5 py-0.5 rounded border border-accent/30">
                  {appRefId}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                <span className="text-text-2">APPLICANT NAME:</span>
                <span className="text-text-1 font-bold">{formData.fullName}</span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                <span className="text-text-2">REGISTERED TRACK:</span>
                <span className="text-accent-2 font-bold">{formData.interest.replace('_', ' ')}</span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-text-2">PRIMARY CONTACT EMAIL:</span>
                <span className="text-text-1">{formData.email}</span>
              </div>
            </div>

            {/* Next Steps Guidance */}
            <div className="mb-8 space-y-2 text-left">
              <div className="text-xs font-mono font-bold text-text-1 uppercase tracking-wider mb-3">
                Next Steps in the Induction Process:
              </div>
              <div className="flex items-start gap-3 text-xs text-text-2">
                <span className="font-mono text-accent font-bold">01.</span>
                <span>An orientation confirmation has been dispatched to your email with interview dates.</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-text-2">
                <span className="font-mono text-accent-2 font-bold">02.</span>
                <span>Shortlisted applicants will complete a 48-hour hands-on starter challenge in the Maker Space (Lab 401).</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-text-2">
                <span className="font-mono text-success font-bold">03.</span>
                <span>Final cohort admits receive 24/7 RFID lab access, personal hardware benches, and hackathon sponsorship.</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="/projects"
                className="rounded-xl bg-accent px-6 py-2.5 text-xs font-mono font-bold text-bg-0 hover:bg-accent-hover transition-all"
              >
                Explore Current Projects →
              </a>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    studentId: '',
                    yearOfStudy: '1',
                    branch: '',
                    interest: 'ROBOTICS_HARDWARE',
                    githubOrPortfolio: '',
                    statementOfPurpose: '',
                  });
                }}
                className="rounded-xl bg-surface border border-border px-5 py-2.5 text-xs font-mono text-text-2 hover:text-text-1 hover:border-accent-2 transition-all"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border bg-surface/80 p-8 sm:p-10 shadow-xl backdrop-blur-md space-y-6"
          >
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/10 p-3 text-xs text-danger">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono text-text-1 mb-2">FULL NAME *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Alex Sharma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full rounded-lg border border-border bg-bg-1 px-4 py-2.5 text-sm text-text-1 focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-1 mb-2">COLLEGE EMAIL *</label>
                <input
                  required
                  type="email"
                  placeholder="alex.sharma@college.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-lg border border-border bg-bg-1 px-4 py-2.5 text-sm text-text-1 focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-1 mb-2">PHONE NUMBER *</label>
                <input
                  required
                  type="tel"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-lg border border-border bg-bg-1 px-4 py-2.5 text-sm text-text-1 focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-1 mb-2">STUDENT ID / ROLL NO *</label>
                <input
                  required
                  type="text"
                  placeholder="23BCE1042"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full rounded-lg border border-border bg-bg-1 px-4 py-2.5 text-sm text-text-1 focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-1 mb-2">YEAR OF STUDY</label>
                <select
                  value={formData.yearOfStudy}
                  onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                  className="w-full rounded-lg border border-border bg-bg-1 px-4 py-2.5 text-sm text-text-1 focus:border-accent focus:outline-none"
                >
                  <option value="1">1st Year (Freshman)</option>
                  <option value="2">2nd Year (Sophomore)</option>
                  <option value="3">3rd Year (Junior)</option>
                  <option value="4">4th Year (Senior)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-text-1 mb-2">BRANCH / MAJOR *</label>
                <input
                  required
                  type="text"
                  placeholder="ECE, CSE, Mechatronics, Mechanical..."
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full rounded-lg border border-border bg-bg-1 px-4 py-2.5 text-sm text-text-1 focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-text-1 mb-2">PRIMARY INTEREST TRACK *</label>
              <select
                value={formData.interest}
                onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                className="w-full rounded-lg border border-border bg-bg-1 px-4 py-2.5 text-sm text-text-1 focus:border-accent focus:outline-none"
              >
                <option value="ROBOTICS_HARDWARE">Robotics & PCB Hardware Engineering</option>
                <option value="EMBEDDED_IOT">Embedded Systems, RTOS & IoT</option>
                <option value="AI_MACHINE_LEARNING">ROS2, Computer Vision & Edge AI</option>
                <option value="FULL_STACK_DEV">Telemetry Systems & Full-Stack Development</option>
                <option value="DESIGN_3D">3D CAD, Fabrication & Mechanical Design</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-text-1 mb-2">GITHUB / PORTFOLIO / LINKEDIN (OPTIONAL)</label>
              <input
                type="text"
                placeholder="github.com/username or https://..."
                value={formData.githubOrPortfolio}
                onChange={(e) => setFormData({ ...formData, githubOrPortfolio: e.target.value })}
                className="w-full rounded-lg border border-border bg-bg-1 px-4 py-2.5 text-sm text-text-1 focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-text-1 mb-2">
                WHAT HAVE YOU BUILT OR WHAT ARE YOU PASSIONATE TO LEARN? *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Tell us about a project you've tinkered with, or which technology (e.g. ROS2, KiCad, STM32) excites you most..."
                value={formData.statementOfPurpose}
                onChange={(e) => setFormData({ ...formData, statementOfPurpose: e.target.value })}
                className="w-full rounded-lg border border-border bg-bg-1 px-4 py-2.5 text-sm text-text-1 focus:border-accent focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-bg-0 hover:bg-accent-hover hover:glow-accent transition-all disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span>{loading ? 'Submitting Application...' : 'Submit Application'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
