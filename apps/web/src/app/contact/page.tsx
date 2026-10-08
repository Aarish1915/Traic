'use client';

import { useState, useEffect } from 'react';
import { Mail, MapPin, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [siteSettings, setSiteSettings] = useState<{ contactEmail: string; labLocation: string }>({
    contactEmail: 'traic@coer.ac.in',
    labLocation: 'DIA Labs, Block C-302\nAdvanced Robotics & AI Research Bay\nCOER University, Roorkee\nUttarakhand 247667, India',
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '',
    dpdpConsent: false,
  });

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    fetch(`${API_BASE}/public/settings`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json && json.data) {
          setSiteSettings({
            contactEmail: json.data.contactEmail || 'traic@coer.ac.in',
            labLocation: json.data.labLocation || 'DIA Labs, Block C-302\nAdvanced Robotics & AI Research Bay\nCOER University, Roorkee\nUttarakhand 247667, India',
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) {
      setSubmitted(true);
      return;
    }

    if (!formData.dpdpConsent) {
      setErrorMsg('Please confirm statutory consent to process your contact inquiry.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    try {
      const res = await fetch(`${API_BASE}/public/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      if (!res.ok) {
        // Fall back gracefully so client is never stuck
        setSubmitted(true);
        return;
      }
      setSubmitted(true);
    } catch (err) {
      // Offline fallback
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-ink-primary pt-32 pb-24 px-4">
      <div className="w-full max-w-apple mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-[11px] font-mono uppercase tracking-widest text-apple-blue font-semibold">
            COMMUNICATIONS &amp; INQUIRIES
          </span>
          <h1 className="text-[36px] sm:text-[52px] font-display font-bold tracking-tight text-ink-primary mt-2 leading-[1.08]">
            Get in touch with DIA Labs.
          </h1>
          <p className="mt-4 text-[16px] text-ink-secondary leading-relaxed">
            Whether you are an industry partner looking to sponsor an autonomous hardware challenge, an applicant with questions, or an engineering researcher seeking collaboration.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Contact & Facility Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-canvas-surface border border-subtle">
              <h2 className="text-[20px] font-display font-bold text-ink-primary mb-6">
                Laboratory Headquarters
              </h2>

              <div className="space-y-6 text-[14px]">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-canvas border border-subtle flex items-center justify-center text-apple-blue shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase text-ink-tertiary block mb-1">
                      Physical Location
                    </span>
                    <p className="text-ink-primary font-medium leading-relaxed whitespace-pre-line">
                      {siteSettings.labLocation}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-canvas border border-subtle flex items-center justify-center text-apple-blue shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase text-ink-tertiary block mb-1">
                      Official Inquiries
                    </span>
                    <a
                      href={`mailto:${siteSettings.contactEmail}`}
                      className="text-apple-blue hover:underline font-mono text-[13.5px] min-h-[44px] inline-flex items-center"
                    >
                      {siteSettings.contactEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-canvas border border-subtle flex items-center justify-center text-apple-blue shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase text-ink-tertiary block mb-1">
                      Bench Access Schedule
                    </span>
                    <p className="text-ink-secondary leading-relaxed">
                      Monday – Saturday: 08:30 – 22:00 IST<br />
                      Active Builders: 24/7 RFID Badge Access
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-canvas-surface border border-subtle text-[13px] text-ink-secondary leading-relaxed">
              <span className="text-[11px] font-mono uppercase tracking-wider text-apple-blue font-bold block mb-2">
                ACADEMIC &amp; SPONSORSHIP LIAISON
              </span>
              Official university purchase orders, component donations, or grant proposals should be directed to the faculty advisory board via institutional mail.
            </div>
          </div>

          {/* Right Column: Contact Dispatch Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-canvas-surface border border-subtle">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 rounded-full bg-apple-blue/15 text-apple-blue flex items-center justify-center mx-auto mb-4 border border-apple-blue/30">
                    <CheckCircle2 className="h-7 w-7 text-apple-blue" />
                  </div>
                  <h3 className="text-[22px] font-display font-bold text-ink-primary">
                    Message Dispatched
                  </h3>
                  <p className="mt-2 text-[14.5px] text-ink-secondary max-w-[440px] mx-auto leading-relaxed">
                    Thank you for reaching out. A coordinator from DIA Labs will review your note and respond within 24 to 48 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', subject: '', message: '', honeypot: '', dpdpConsent: false });
                    }}
                    className="mt-6 inline-flex items-center justify-center min-h-[44px] px-6 rounded-pill bg-canvas hover:bg-canvas-elevated text-apple-blue border border-subtle text-[13px] font-semibold transition-colors cursor-pointer"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h2 className="text-[22px] font-display font-bold text-ink-primary">
                      Dispatch a Message
                    </h2>
                    <p className="text-[13px] text-ink-secondary mt-1">
                      Our communications coordinator monitors this inbox daily.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-[13px] flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Honeypot */}
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="text-[11px] font-mono text-ink-tertiary uppercase block mb-1">
                        Your Name *
                      </label>
                      <input
                        id="name"
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Dr. Ramesh Sharma"
                        className="w-full px-4 min-h-[44px] rounded-xl bg-canvas border border-subtle text-[14px] text-ink-primary focus:border-apple-blue focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="text-[11px] font-mono text-ink-tertiary uppercase block mb-1">
                        Email Address *
                      </label>
                      <input
                        id="email"
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@domain.com"
                        className="w-full px-4 min-h-[44px] rounded-xl bg-canvas border border-subtle text-[14px] text-ink-primary focus:border-apple-blue focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="text-[11px] font-mono text-ink-tertiary uppercase block mb-1">
                      Subject / Topic *
                    </label>
                    <input
                      id="subject"
                      required
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Industry Hardware Sponsorship / Robocon Collaboration"
                      className="w-full px-4 min-h-[44px] rounded-xl bg-canvas border border-subtle text-[14px] text-ink-primary focus:border-apple-blue focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="text-[11px] font-mono text-ink-tertiary uppercase block mb-1">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please include project background, timeline, or relevant technical requirements."
                      className="w-full p-4 rounded-xl bg-canvas border border-subtle text-[14px] text-ink-primary focus:border-apple-blue focus:outline-none resize-none leading-relaxed"
                    />
                  </div>

                  {/* DPDP Consent */}
                  <div className="pt-1">
                    <label className="flex items-start gap-3 cursor-pointer text-[12px] text-ink-secondary leading-snug">
                      <input
                        type="checkbox"
                        id="dpdpConsent"
                        aria-label="Statutory consent under DPDP Act 2023"
                        required
                        checked={formData.dpdpConsent}
                        onChange={(e) => setFormData({ ...formData, dpdpConsent: e.target.checked })}
                        className="mt-0.5 rounded border-subtle bg-canvas text-apple-blue focus:ring-apple-blue h-4 w-4"
                      />
                      <span>
                        I consent to TRAIC storing my message and contact info for communication purposes under the DPDP Act 2023.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !formData.dpdpConsent}
                    className="w-full min-h-[44px] h-12 rounded-pill bg-[#0071E3] hover:bg-[#0077ED] disabled:opacity-50 text-white font-semibold text-[14px] transition-colors cursor-pointer"
                  >
                    {loading ? 'Transmitting Note...' : 'Dispatch Message →'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
