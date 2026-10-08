import { useState } from 'react';
import type { JoinApplication } from '@traic/shared';

interface ApplicationDetailDrawerProps {
  application: JoinApplication | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
  onDelete: (id: string) => void;
  onUpdateNotes?: (id: string, notes: string) => Promise<void>;
}

export function ApplicationDetailDrawer({
  application,
  onClose,
  onUpdateStatus,
  onDelete,
  onUpdateNotes,
}: ApplicationDetailDrawerProps) {
  const [updating, setUpdating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reviewNotes, setReviewNotes] = useState((application as any)?.reviewNotes || '');
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);

  if (!application) return null;

  const currentStatus = (application as any).status || 'PENDING';
  const skills: string[] = (application as any).skills || [];

  const handleStatusChange = async (newStatus: string) => {
    if (!application.id) return;
    setUpdating(true);
    try {
      await onUpdateStatus(application.id, newStatus);
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!application.id || !onUpdateNotes) return;
    setSavingNotes(true);
    try {
      await onUpdateNotes(application.id, reviewNotes);
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleCopyDetails = () => {
    const text = `TRAIC Induction Application
Candidate: ${application.fullName}
Email: ${application.email}
Phone: ${application.phone}
Student ID: ${application.studentId}
Branch: ${application.branch} (Year ${application.yearOfStudy})
Track: ${application.interest}
Skills: ${skills.length > 0 ? skills.join(', ') : 'None specified'}
Portfolio: ${application.githubOrPortfolio || 'N/A'}
Status: ${currentStatus}
Submitted: ${application.createdAt || 'N/A'}

Statement of Purpose:
${application.statementOfPurpose}

Admin Review Notes:
${reviewNotes || 'None'}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = application.createdAt
    ? new Date(application.createdAt).toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Unknown date';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return { bg: 'rgba(48, 209, 88, 0.15)', text: '#30D158', border: 'rgba(48, 209, 88, 0.35)' };
      case 'SHORTLISTED':
        return { bg: 'rgba(41, 151, 255, 0.15)', text: '#2997FF', border: 'rgba(41, 151, 255, 0.35)' };
      case 'REVIEWING':
        return { bg: 'rgba(255, 159, 10, 0.15)', text: '#FF9F0A', border: 'rgba(255, 159, 10, 0.35)' };
      case 'REJECTED':
        return { bg: 'rgba(255, 69, 58, 0.15)', text: '#FF453A', border: 'rgba(255, 69, 58, 0.35)' };
      default:
        return { bg: 'rgba(142, 142, 147, 0.15)', text: '#8E8E93', border: 'rgba(142, 142, 147, 0.35)' };
    }
  };

  const statusStyle = getStatusColor(currentStatus);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '720px',
          height: '100%',
          backgroundColor: '#161617',
          borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '-12px 0 40px rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Apple Top Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: '#1D1D1F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                backgroundColor: statusStyle.bg,
                color: statusStyle.text,
                border: `1px solid ${statusStyle.border}`,
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.04em',
              }}
            >
              {currentStatus}
            </span>
            <span style={{ fontSize: '13px', color: '#86868B', fontFamily: 'var(--font-family-mono, monospace)', fontVariantNumeric: 'tabular-nums' }}>
              REF: {application.id ? application.id.slice(0, 8).toUpperCase() : 'APP-LIVE'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={handleCopyDetails}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#F5F5F7',
                padding: '8px 16px',
                borderRadius: '980px',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                minHeight: '44px',
                display: 'inline-flex',
                alignItems: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              {copied ? '✓ Copied' : 'Copy Brief'}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: 'none',
                color: '#86868B',
                width: '44px',
                height: '44px',
                minWidth: '44px',
                minHeight: '44px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '14px',
              }}
              title="Close Inspector (Esc)"
              aria-label="Close Inspector"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable Inspector Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Candidate Primary Hero Card */}
          <div
            style={{
              backgroundColor: '#1D1D1F',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '22px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#F5F5F7', letterSpacing: '-0.02em' }}>
                  {application.fullName}
                </h2>
                <div style={{ margin: '6px 0 0 0', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <a
                    href={`mailto:${application.email}`}
                    style={{ fontSize: '13px', color: '#2997FF', textDecoration: 'none' }}
                  >
                    {application.email}
                  </a>
                  <span style={{ color: '#48484A' }}>•</span>
                  <a
                    href={`tel:${application.phone}`}
                    style={{ fontSize: '13px', color: '#86868B', textDecoration: 'none' }}
                  >
                    {application.phone}
                  </a>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  textAlign: 'right',
                }}
              >
                <div style={{ fontSize: '10px', color: '#86868B', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  Track Domain
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#2997FF', marginTop: '2px' }}>
                  {application.interest.replace(/_/g, ' ')}
                </div>
              </div>
            </div>

            {/* Academic & Metadata Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '14px',
                marginTop: '18px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', color: '#86868B', fontWeight: 500 }}>STUDENT ID / ROLL NO</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#F5F5F7', fontFamily: 'var(--font-family-mono, monospace)', fontVariantNumeric: 'tabular-nums', marginTop: '3px' }}>
                  {application.studentId}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#86868B', fontWeight: 500 }}>ACADEMIC PROGRAM</div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: '#F5F5F7', marginTop: '3px' }}>
                  Year {application.yearOfStudy} • {application.branch}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#86868B', fontWeight: 500 }}>SUBMITTED ON</div>
                <div style={{ fontSize: '12px', color: '#86868B', marginTop: '3px' }}>
                  {formattedDate}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#86868B', fontWeight: 500 }}>PORTFOLIO / GITHUB</div>
                <div style={{ marginTop: '3px' }}>
                  {application.githubOrPortfolio ? (
                    <a
                      href={application.githubOrPortfolio.startsWith('http') ? application.githubOrPortfolio : `https://${application.githubOrPortfolio}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: '#2997FF', fontSize: '12.5px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <span>{application.githubOrPortfolio.replace(/^https?:\/\//, '')}</span>
                      <span>↗</span>
                    </a>
                  ) : (
                    <span style={{ color: '#6E6E73', fontSize: '12px' }}>None provided</span>
                  )}
                </div>
              </div>
            </div>

            {/* Skills Badges */}
            {skills.length > 0 && (
              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '11px', color: '#86868B', fontWeight: 500, marginBottom: '8px' }}>
                  REPORTED SKILLS & TECHNOLOGIES
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      style={{
                        backgroundColor: 'rgba(41, 151, 255, 0.1)',
                        color: '#2997FF',
                        border: '1px solid rgba(41, 151, 255, 0.25)',
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        fontSize: '11.5px',
                        fontWeight: 500,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Statement of Purpose & Pitch */}
          <div
            style={{
              backgroundColor: '#1D1D1F',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '22px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2997FF' }} />
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#F5F5F7', letterSpacing: '-0.01em' }}>
                  Statement of Purpose & Technical Pitch
                </h3>
              </div>
              <span style={{ fontSize: '11.5px', color: '#86868B', fontFamily: 'var(--font-family-mono, monospace)', fontVariantNumeric: 'tabular-nums' }}>
                {application.statementOfPurpose.length} characters
              </span>
            </div>

            <div
              style={{
                backgroundColor: '#161617',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '10px',
                padding: '18px',
                color: '#F5F5F7',
                fontSize: '13.5px',
                lineHeight: 1.65,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                maxHeight: '320px',
                overflowY: 'auto',
              }}
            >
              {application.statementOfPurpose}
            </div>
          </div>

          {/* Admin Reviewer Notes Card */}
          <div
            style={{
              backgroundColor: '#1D1D1F',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '22px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#F5F5F7' }}>
                Internal Reviewer Evaluation Notes
              </h3>
              {notesSaved && (
                <span style={{ fontSize: '11px', color: '#30D158', fontWeight: 600 }}>
                  ✓ Notes saved
                </span>
              )}
            </div>

            <textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Record interview notes, technical rubric score, project match recommendations, or interviewer feedback..."
              rows={4}
              style={{
                width: '100%',
                backgroundColor: '#161617',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '12px',
                fontSize: '13px',
                color: '#F5F5F7',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
                lineHeight: 1.5,
                boxSizing: 'border-box',
              }}
            />

            {onUpdateNotes && (
              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  style={{
                    backgroundColor: '#0071E3',
                    border: 'none',
                    color: '#FFFFFF',
                    padding: '8px 18px',
                    borderRadius: '980px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: savingNotes ? 'default' : 'pointer',
                    minHeight: '44px',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  {savingNotes ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Bar Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: '#1D1D1F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', color: '#86868B', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Status
            </span>
            <div
              className="apple-segmented-control"
              role="radiogroup"
              aria-label="Application Status"
            >
              {[
                { value: 'REVIEWING', label: 'Reviewing' },
                { value: 'SHORTLISTED', label: 'Shortlist' },
                { value: 'ACCEPTED', label: 'Accept' },
                { value: 'REJECTED', label: 'Reject' },
              ].map((opt) => {
                const isSelected = currentStatus === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    disabled={updating || isSelected}
                    onClick={() => handleStatusChange(opt.value)}
                    className={`apple-segment-button ${isSelected ? 'active' : ''}`}
                    style={{
                      backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                      color: isSelected ? '#FFFFFF' : '#86868B',
                      border: isSelected ? '1px solid rgba(255, 255, 255, 0.14)' : '1px solid transparent',
                      minHeight: '44px',
                      borderRadius: '980px',
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            {application.id && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Are you sure you want to permanently delete application from ${application.fullName}?`)) {
                    onDelete(application.id!);
                    onClose();
                  }
                }}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255, 69, 58, 0.25)',
                  color: '#FF453A',
                  padding: '8px 18px',
                  borderRadius: '980px',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  minHeight: '44px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  transition: 'all 0.15s ease',
                }}
              >
                Delete Application
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
