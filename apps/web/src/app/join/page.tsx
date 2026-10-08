'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, AlertCircle, FileCheck } from 'lucide-react';
import { SpotlightCard } from '@/components/SpotlightCard';
import type { TrackInterest } from '@traic/shared';

export default function JoinPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [receiptCode, setReceiptCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    email: '',
    phone: '',
    branch: 'Electronics & Communication Engineering',
    yearOfStudy: 1,
    interest: 'ROBOTICS_HARDWARE' as TrackInterest,
    skills: [] as string[],
    customSkill: '',
    githubOrPortfolio: '',
    statementOfPurpose: '',
    honeypot: '',
    dpdpConsent: false,
  });

  const trackOptions: { id: TrackInterest; label: string; desc: string }[] = [
    { id: 'ROBOTICS_HARDWARE', label: 'Robotics & Hardware', desc: 'Custom PCBs, differential rovers, BLDC motor control' },
    { id: 'EMBEDDED_IOT', label: 'Embedded Systems & IoT', desc: 'STM32, FreeRTOS, CAN-FD, edge microcontrollers' },
    { id: 'AI_MACHINE_LEARNING', label: 'AI & Machine Learning', desc: 'YOLOv8, Hailo-8, quantized neural inference on silicon' },
    { id: 'FULL_STACK_DEV', label: 'Full Stack & Infrastructure', desc: 'Next.js, Node.js, Linux sovereignty, self-hosted clusters' },
    { id: 'DESIGN_3D', label: '3D CAD & Mechanical Design', desc: 'SolidWorks, CNC milling, chassis dynamics, additive mfg' },
  ];

  const popularSkills = [
    'ROS2',
    'C++',
    'FreeRTOS',
    'Python',
    'PyTorch',
    'Altium',
    'KiCAD',
    'SolidWorks',
    'Linux / Bash',
    'React / Next.js',
    'STM32',
    'CAN-FD',
  ];

  const toggleSkill = (skill: string) => {
    if (formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skill) });
    } else {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
  };

  const handleAddCustomSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && formData.customSkill.trim()) {
      e.preventDefault();
      const s = formData.customSkill.trim();
      if (!formData.skills.includes(s)) {
        setFormData({ ...formData, skills: [...formData.skills, s], customSkill: '' });
      } else {
        setFormData({ ...formData, customSkill: '' });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) {
      // Bot detected: silently simulate success
      setReceiptCode('TRAIC-2026-0000');
      setSubmitted(true);
      return;
    }

    if (!formData.dpdpConsent) {
      setErrorMsg('You must provide statutory consent under the DPDP Act 2023 to proceed.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    try {
      const res = await fetch(`${API_BASE}/public/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          studentId: formData.studentId.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          branch: formData.branch,
          yearOfStudy: Number(formData.yearOfStudy),
          interest: formData.interest,
          skills: formData.skills,
          githubOrPortfolio: formData.githubOrPortfolio.trim() || undefined,
          statementOfPurpose: formData.statementOfPurpose.trim(),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        const errorDetail = json.errors
          ? Object.entries(json.errors)
              .map(([f, msgs]) => `${f}: ${(msgs as string[]).join(', ')}`)
              .join(' | ')
          : json.message || 'Validation error submitting application.';
        setErrorMsg(errorDetail);
        return;
      }

      const code = json.data?.id
        ? `TRAIC-2026-${json.data.id.slice(0, 4).toUpperCase()}`
        : `TRAIC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setReceiptCode(code);
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg('Network error connecting to the DIA Labs admissions server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { title: 'Full DIA Labs Bench Clearance', desc: 'Direct access to 1GHz oscilloscopes, Hakko hot-air rework, and 3D printing equipment in Block C-302.' },
    { title: 'Bare-Metal Cloud Compute', desc: 'Personal Linux shell account, LXC container namespace, and private GPU inference on our rack.' },
    { title: 'National Competition Sponsorship', desc: 'Fully funded travel, parts, and logistics for Smart India Hackathon and Robocon.' },
    { title: 'Elite Alumni Referral Network', desc: 'Direct mock interviews and resume referrals from graduates at TI, Qualcomm, Bosch, and ISRO.' },
  ];

  const phases = [
    { phase: '01', title: 'Written Dossier', desc: 'Review of technical background, past builds, grit, and genuine engineering motivation.' },
    { phase: '02', title: 'Practical Task', desc: '48-hour hardware/software take-home challenge: schematic debugging, firmware loop, or algorithm design.' },
    { phase: '03', title: 'In-Lab Interview', desc: 'Technical conversation with domain leads at DIA Labs bench testing your problem-solving depth.' },
  ];

  return (
    <div className="min-h-screen bg-canvas text-ink-primary pt-32 pb-24 px-4 selection:bg-neutral-700 selection:text-white">
      <div className="w-full max-w-apple mx-auto">
        {/* Header Hero */}
        <div className="text-center max-w-[800px] mx-auto mb-16">
          <span className="inline-block px-3.5 py-1.5 rounded-pill bg-canvas-surface border border-subtle text-ink-secondary text-[11px] font-mono font-bold tracking-wide uppercase mb-4 shadow-sm">
            COHORT 2026 ADMISSIONS DOSSIER
          </span>
          <h1 className="text-[38px] sm:text-[54px] font-display font-extrabold tracking-[-0.035em] text-ink-primary leading-[1.08]">
            Build Hardware. Ship Silicon. <br />
            Join the TRAIC Collective.
          </h1>
          <p className="mt-5 text-[17px] sm:text-[19px] text-ink-secondary leading-relaxed max-w-[640px] mx-auto">
            We do not evaluate grades or pedigree. We evaluate what you have soldered, coded, or designed with your own hands.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="mb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((b, bIdx) => (
              <SpotlightCard key={`${b.title}-${bIdx}`} className="p-6 rounded-3xl flex flex-col justify-between">
                <div>
                  <h3 className="text-[16px] font-display font-bold text-ink-primary">{b.title}</h3>
                  <p className="mt-2 text-[13.5px] text-ink-secondary leading-relaxed">{b.desc}</p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>

        {/* 3-Phase Selection Roadmap */}
        <div className="mb-20">
          <div className="mb-8">
            <span className="text-[11px] font-mono uppercase tracking-widest text-ink-tertiary font-bold">
              SELECTION PROTOCOL
            </span>
            <h2 className="text-[28px] font-display font-bold text-ink-primary mt-1 tracking-tight">
              Three-Phase Induction
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {phases.map((p, pIdx) => (
              <SpotlightCard key={`${p.phase}-${pIdx}`} className="p-6 rounded-3xl flex flex-col justify-between">
                <div>
                  <span className="text-[20px] font-mono font-bold text-ink-primary">PHASE {p.phase}</span>
                  <h3 className="text-[18px] font-display font-bold text-ink-primary mt-1">{p.title}</h3>
                  <p className="mt-2.5 text-[14px] text-ink-secondary leading-relaxed">{p.desc}</p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>

        {/* Application Form */}
        <SpotlightCard className="max-w-[780px] mx-auto p-8 sm:p-12 rounded-3xl">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-canvas border border-subtle text-ink-primary flex items-center justify-center mx-auto mb-6 shadow-sm">
                <FileCheck className="h-8 w-8 text-ink-primary" />
              </div>
              <h2 className="text-[28px] sm:text-[34px] font-display font-bold text-ink-primary tracking-tight">
                Application Registered Live
              </h2>
              <p className="mt-3 text-[15.5px] text-ink-secondary max-w-[500px] mx-auto leading-relaxed">
                Your dossier has entered the DIA Labs recruitment queue. Save your statutory reference code below for tracking.
              </p>

              <div className="my-8 p-6 rounded-2xl bg-canvas border border-subtle inline-block">
                <span className="text-[11px] font-mono text-ink-tertiary uppercase block mb-1">
                  OFFICIAL ADMISSION RECEIPT
                </span>
                <span className="text-[24px] font-mono font-bold text-ink-primary tracking-wider">
                  {receiptCode}
                </span>
              </div>

              <p className="text-[13px] text-ink-tertiary max-w-[440px] mx-auto">
                Next steps and the Phase 02 take-home brief will be dispatched to your institutional email. Check your inbox within 5 business days.
              </p>

              <div className="mt-8">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center min-h-[48px] px-8 rounded-pill bg-ink-primary text-canvas hover:opacity-90 font-semibold text-[14.5px] transition-all active:scale-95 shadow-md"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2 text-ink-primary">
                  <ShieldCheck className="h-5 w-5 text-ink-primary" />
                  <span className="text-[11px] font-mono uppercase tracking-wider font-bold">
                    OFFICIAL COHORT ADMISSIONS PORTAL
                  </span>
                </div>
                <h2 className="text-[26px] sm:text-[30px] font-display font-bold text-ink-primary tracking-tight">
                  Candidate Dossier
                </h2>
                <p className="text-[13.5px] text-ink-secondary mt-1">
                  All fields marked with an asterisk (*) are strictly required. Data is directly reviewed by TRAIC leads.
                </p>
              </div>

              {errorMsg && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-[13px] flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Bot Trap Honeypot */}
              <input
                type="text"
                id="_traic_hp_trap"
                name="_traic_hp_trap"
                aria-label="Bot trap - leave empty"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                tabIndex={-1}
                aria-hidden="true"
              />

              {/* Name & Student Roll */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="text-[11px] font-mono text-ink-tertiary uppercase block mb-1.5 font-bold">
                    Full Legal Name *
                  </label>
                  <input
                    id="name"
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Aarish Ali"
                    className="w-full px-4 min-h-[46px] rounded-xl bg-canvas border border-subtle text-[14px] text-ink-primary focus:border-ink-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="rollNumber" className="text-[11px] font-mono text-ink-tertiary uppercase block mb-1.5 font-bold">
                    University Roll Number / Student ID *
                  </label>
                  <input
                    id="rollNumber"
                    required
                    type="text"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    placeholder="e.g. 2025ECE044"
                    className="w-full px-4 min-h-[46px] rounded-xl bg-canvas border border-subtle text-[14px] text-ink-primary focus:border-ink-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Contact Information (Email & Phone) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="text-[11px] font-mono text-ink-tertiary uppercase block mb-1.5 font-bold">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@coer.ac.in"
                    className="w-full px-4 min-h-[46px] rounded-xl bg-canvas border border-subtle text-[14px] text-ink-primary focus:border-ink-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="text-[11px] font-mono text-ink-tertiary uppercase block mb-1.5 font-bold">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    id="phone"
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 min-h-[46px] rounded-xl bg-canvas border border-subtle text-[14px] text-ink-primary focus:border-ink-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Academic Branch & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="branch" className="text-[11px] font-mono text-ink-tertiary uppercase block mb-1.5 font-bold">
                    Academic Branch / Major *
                  </label>
                  <select
                    id="branch"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full px-4 min-h-[46px] rounded-xl bg-canvas border border-subtle text-[14px] text-ink-primary focus:border-ink-primary focus:outline-none"
                  >
                    <option value="Electronics & Communication Engineering">Electronics & Communication (ECE)</option>
                    <option value="Computer Science & Engineering">Computer Science & Engineering (CSE)</option>
                    <option value="Mechanical Engineering">Mechanical Engineering (ME)</option>
                    <option value="Electrical Engineering">Electrical Engineering (EE)</option>
                    <option value="Information Technology">Information Technology (IT)</option>
                    <option value="Other Engineering">Other Engineering Specialization</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="year" className="text-[11px] font-mono text-ink-tertiary uppercase block mb-1.5 font-bold">
                    Current Year of Study *
                  </label>
                  <select
                    id="year"
                    value={formData.yearOfStudy}
                    onChange={(e) => setFormData({ ...formData, yearOfStudy: Number(e.target.value) })}
                    className="w-full px-4 min-h-[46px] rounded-xl bg-canvas border border-subtle text-[14px] text-ink-primary focus:border-ink-primary focus:outline-none"
                  >
                    <option value={1}>1st Year (Freshman)</option>
                    <option value={2}>2nd Year (Sophomore)</option>
                    <option value={3}>3rd Year (Junior)</option>
                    <option value={4}>4th Year (Senior)</option>
                  </select>
                </div>
              </div>

              {/* Primary Track Selection */}
              <div>
                <span className="text-[11px] font-mono text-ink-tertiary uppercase block mb-2 font-bold">
                  Primary Specialization Track *
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {trackOptions.map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setFormData({ ...formData, interest: t.id })}
                      className={`min-h-[46px] p-3.5 rounded-xl border text-left transition-all active:scale-[0.98] cursor-pointer ${
                        formData.interest === t.id
                          ? 'bg-ink-primary text-canvas border-transparent shadow-sm'
                          : 'bg-canvas border-subtle text-ink-secondary hover:text-ink-primary'
                      }`}
                    >
                      <div className="font-semibold text-[13.5px]">{t.label}</div>
                      <div className="text-[11.5px] opacity-80 mt-0.5">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Skills Multi-Selector */}
              <div>
                <label className="text-[11px] font-mono text-ink-tertiary uppercase block mb-1.5 font-bold">
                  Skills &amp; Technologies You Have Worked With (Click to toggle)
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {popularSkills.map((skill) => {
                    const isSelected = formData.skills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`min-h-[44px] px-4 py-2 rounded-pill text-[12px] font-medium transition-all active:scale-95 cursor-pointer border ${
                          isSelected
                            ? 'bg-ink-primary text-canvas border-transparent shadow-sm font-semibold'
                            : 'bg-canvas border-subtle text-ink-secondary hover:text-ink-primary'
                        }`}
                      >
                        {skill} {isSelected ? '✓' : '+'}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="text"
                  id="customSkill"
                  aria-label="Add custom skill or technology"
                  value={formData.customSkill}
                  onChange={(e) => setFormData({ ...formData, customSkill: e.target.value })}
                  onKeyDown={handleAddCustomSkill}
                  placeholder="Type other skill and press Enter to add (e.g. OpenCV, Docker)..."
                  className="w-full px-4 min-h-[46px] rounded-xl bg-canvas border border-subtle text-[13.5px] text-ink-primary focus:border-ink-primary focus:outline-none"
                />
              </div>

              {/* Portfolio / GitHub */}
              <div>
                <label htmlFor="githubOrPortfolio" className="text-[11px] font-mono text-ink-tertiary uppercase block mb-1.5 font-bold">
                  GitHub Profile, Portfolio, or Hardware Repository (Optional)
                </label>
                <input
                  id="githubOrPortfolio"
                  type="url"
                  value={formData.githubOrPortfolio}
                  onChange={(e) => setFormData({ ...formData, githubOrPortfolio: e.target.value })}
                  placeholder="https://github.com/your-handle"
                  className="w-full px-4 min-h-[46px] rounded-xl bg-canvas border border-subtle text-[14px] text-ink-primary focus:border-ink-primary focus:outline-none"
                />
              </div>

              {/* Statement of Purpose */}
              <div>
                <label htmlFor="problemStatement" className="text-[11px] font-mono text-ink-tertiary uppercase block mb-1.5 font-bold">
                  Statement of Purpose: What Have You Built or What Do You Want to Build? *
                </label>
                <textarea
                  id="problemStatement"
                  required
                  rows={4}
                  value={formData.statementOfPurpose}
                  onChange={(e) => setFormData({ ...formData, statementOfPurpose: e.target.value })}
                  placeholder="Describe your technical projects, hardware hacks, or the hardest engineering problem you have diagnosed. Share what you want to achieve at TRAIC."
                  className="w-full p-4 rounded-xl bg-canvas border border-subtle text-[13.5px] text-ink-primary focus:border-ink-primary focus:outline-none resize-none leading-relaxed"
                />
                <span className="text-[11px] font-mono text-ink-tertiary text-right block mt-1">
                  {formData.statementOfPurpose.length} characters
                </span>
              </div>

              {/* DPDP Act 2023 Statutory Consent */}
              <div className="p-4 rounded-2xl bg-canvas border border-subtle">
                <label className="flex items-start gap-3 cursor-pointer text-[12.5px] text-ink-secondary leading-relaxed">
                  <input
                    type="checkbox"
                    id="dpdpConsent"
                    aria-label="Statutory consent under DPDP Act 2023"
                    required
                    checked={formData.dpdpConsent}
                    onChange={(e) => setFormData({ ...formData, dpdpConsent: e.target.checked })}
                    className="mt-1 rounded border-subtle bg-canvas text-ink-primary focus:ring-ink-primary h-4 w-4 shrink-0"
                  />
                  <span>
                    <strong>Statutory DPDP Consent:</strong> I give TRAIC explicit consent to collect, process, and retain my application data for cohort admissions under the Digital Personal Data Protection Act 2023. My data will be kept secure and never sold or transferred to external commercial entities.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !formData.dpdpConsent}
                className="w-full min-h-[48px] h-12 rounded-pill bg-ink-primary text-canvas hover:opacity-90 disabled:opacity-50 font-semibold text-[15px] transition-all active:scale-95 shadow-md cursor-pointer"
              >
                {loading ? 'Registering Dossier...' : 'Submit Application to DIA Labs →'}
              </button>
            </form>
          )}
        </SpotlightCard>
      </div>
    </div>
  );
}
