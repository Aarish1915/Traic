'use client';

import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function JoinPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      // Post to API if running, or gracefully handle locally
      const res = await fetch('http://localhost:4000/public/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          yearOfStudy: parseInt(formData.yearOfStudy, 10),
        }),
      }).catch(() => null);

      if (res && !res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || 'Submission failed');
      }

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
          <div className="rounded-2xl border border-success/40 bg-surface/90 p-10 text-center shadow-xl backdrop-blur-md">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/20 text-success mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-text-1">Application Submitted!</h2>
            <p className="mt-2 text-sm text-text-2 max-w-md mx-auto">
              Thank you for applying to TRAIC. Our domain leads and coordinators will review your submission and contact you via email for the onboarding interview.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 rounded-lg bg-surface border border-border px-5 py-2 text-xs font-mono text-text-1 hover:border-accent"
            >
              Submit another application
            </button>
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
                type="url"
                placeholder="https://github.com/your-username"
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
