import { useState } from 'react';
import type { JoinApplication } from '@traic/shared';

interface ApplicationDetailDrawerProps {
  application: JoinApplication | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
  onDelete: (id: string) => void;
}

export function ApplicationDetailDrawer({
  application,
  onClose,
  onUpdateStatus,
  onDelete,
}: ApplicationDetailDrawerProps) {
  const [updating, setUpdating] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!application) return null;

  const currentStatus = (application as any).status || 'PENDING';

  const handleStatusChange = async (newStatus: string) => {
    if (!application.id) return;
    setUpdating(true);
    try {
      await onUpdateStatus(application.id, newStatus);
    } finally {
      setUpdating(false);
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
Portfolio: ${application.githubOrPortfolio || 'N/A'}
Status: ${currentStatus}
Submitted: ${application.createdAt || 'N/A'}

Statement of Purpose:
${application.statementOfPurpose}`;

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

  const relativeTime = application.createdAt
    ? getRelativeTimeString(new Date(application.createdAt))
    : '';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: '#34D399', border: 'rgba(16, 185, 129, 0.4)' };
      case 'SHORTLISTED':
        return { bg: 'rgba(56, 189, 248, 0.15)', text: '#38BDF8', border: 'rgba(56, 189, 248, 0.4)' };
      case 'REVIEWING':
        return { bg: 'rgba(255, 159, 28, 0.15)', text: '#FF9F1C', border: 'rgba(255, 159, 28, 0.4)' };
      case 'REJECTED':
        return { bg: 'rgba(239, 68, 68, 0.15)', text: '#F87171', border: 'rgba(239, 68, 68, 0.4)' };
      default:
        return { bg: 'rgba(148, 163, 184, 0.15)', text: '#94A3B8', border: 'rgba(148, 163, 184, 0.4)' };
    }
  };

  const statusStyle = getStatusColor(currentStatus);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(4, 5, 8, 0.85)',
        backdropFilter: 'blur(8px)',
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
          backgroundColor: '#0C0F17',
          borderLeft: '1px solid #232C3D',
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #1E2638',
            backgroundColor: '#090C12',
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
                borderRadius: '6px',
                fontSize: '11px',
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '0.05em',
              }}
            >
              {currentStatus}
            </span>
            <span style={{ fontSize: '13px', color: '#94A3B8', fontFamily: 'monospace' }}>
              REF: {application.id ? application.id.slice(0, 8).toUpperCase() : 'APP-LIVE'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={handleCopyDetails}
              style={{
                backgroundColor: '#151C2C',
                border: '1px solid #28344D',
                color: '#CBD5E1',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer',
                fontFamily: 'monospace',
              }}
            >
              {copied ? '✓ COPIED' : '📋 COPY BRIEF'}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#94A3B8',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '4px 8px',
                lineHeight: 1,
              }}
              title="Close Review Pane (Esc)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {/* Candidate Hero Card */}
          <div
            style={{
              backgroundColor: '#121724',
              border: '1px solid #232C3D',
              borderRadius: '10px',
              padding: '20px',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#F1F5F9' }}>
                  {application.fullName}
                </h2>
                <div style={{ margin: '6px 0 0 0', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '13px', color: '#38BDF8', fontFamily: 'monospace' }}>
                    {application.email}
                  </span>
                  <span style={{ color: '#475569' }}>•</span>
                  <span style={{ fontSize: '13px', color: '#94A3B8', fontFamily: 'monospace' }}>
                    {application.phone}
                  </span>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#0A0E17',
                  border: '1px solid #1E273A',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  textAlign: 'right',
                }}
              >
                <div style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  TRACK PREFERENCE
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#FF9F1C', fontFamily: 'monospace', marginTop: '2px' }}>
                  {application.interest}
                </div>
              </div>
            </div>

            {/* Academic & Timestamp Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px',
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid #1E2638',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>STUDENT ROLL NO</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#F1F5F9', fontFamily: 'monospace', marginTop: '2px' }}>
                  {application.studentId}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>BRANCH & YEAR</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#F1F5F9', marginTop: '2px' }}>
                  Year {application.yearOfStudy} • {application.branch}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>SUBMISSION TIMESTAMP</div>
                <div style={{ fontSize: '12px', color: '#CBD5E1', fontFamily: 'monospace', marginTop: '2px' }}>
                  {formattedDate} {relativeTime ? `(${relativeTime})` : ''}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>PORTFOLIO / GITHUB</div>
                <div style={{ marginTop: '2px' }}>
                  {application.githubOrPortfolio ? (
                    <a
                      href={application.githubOrPortfolio.startsWith('http') ? application.githubOrPortfolio : `https://${application.githubOrPortfolio}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: '#38BDF8', fontSize: '12px', fontFamily: 'monospace', textDecoration: 'underline' }}
                    >
                      {application.githubOrPortfolio} ↗
                    </a>
                  ) : (
                    <span style={{ color: '#64748B', fontSize: '12px' }}>None provided</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Statement of Purpose Reader Pane */}
          <div
            style={{
              backgroundColor: '#0F1420',
              border: '1px solid #1E2638',
              borderRadius: '10px',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: '#38BDF8' }} />
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#F1F5F9', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Statement of Purpose & Project Pitch
                </h3>
              </div>
              <span style={{ fontSize: '11px', color: '#64748B', fontFamily: 'monospace' }}>
                {application.statementOfPurpose.length} characters
              </span>
            </div>

            <div
              style={{
                backgroundColor: '#070A10',
                border: '1px solid #19202F',
                borderRadius: '8px',
                padding: '20px',
                color: '#E2E8F0',
                fontSize: '14px',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                maxHeight: '400px',
                overflowY: 'auto',
              }}
            >
              {application.statementOfPurpose}
            </div>
          </div>
        </div>

        {/* Action Bar Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #1E2638',
            backgroundColor: '#090C12',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              CHANGE STATUS:
            </span>
            <button
              type="button"
              disabled={updating || currentStatus === 'REVIEWING'}
              onClick={() => handleStatusChange('REVIEWING')}
              style={{
                backgroundColor: currentStatus === 'REVIEWING' ? '#FF9F1C' : '#151C2C',
                color: currentStatus === 'REVIEWING' ? '#080A0F' : '#FF9F1C',
                border: '1px solid #FF9F1C',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: updating || currentStatus === 'REVIEWING' ? 'default' : 'pointer',
              }}
            >
              Reviewing
            </button>
            <button
              type="button"
              disabled={updating || currentStatus === 'SHORTLISTED'}
              onClick={() => handleStatusChange('SHORTLISTED')}
              style={{
                backgroundColor: currentStatus === 'SHORTLISTED' ? '#38BDF8' : '#151C2C',
                color: currentStatus === 'SHORTLISTED' ? '#080A0F' : '#38BDF8',
                border: '1px solid #38BDF8',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: updating || currentStatus === 'SHORTLISTED' ? 'default' : 'pointer',
              }}
            >
              Shortlist
            </button>
            <button
              type="button"
              disabled={updating || currentStatus === 'ACCEPTED'}
              onClick={() => handleStatusChange('ACCEPTED')}
              style={{
                backgroundColor: currentStatus === 'ACCEPTED' ? '#10B981' : '#151C2C',
                color: currentStatus === 'ACCEPTED' ? '#080A0F' : '#34D399',
                border: '1px solid #10B981',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: updating || currentStatus === 'ACCEPTED' ? 'default' : 'pointer',
              }}
            >
              Accept
            </button>
            <button
              type="button"
              disabled={updating || currentStatus === 'REJECTED'}
              onClick={() => handleStatusChange('REJECTED')}
              style={{
                backgroundColor: currentStatus === 'REJECTED' ? '#EF4444' : '#151C2C',
                color: currentStatus === 'REJECTED' ? '#FFFFFF' : '#F87171',
                border: '1px solid #EF4444',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: updating || currentStatus === 'REJECTED' ? 'default' : 'pointer',
              }}
            >
              Reject
            </button>
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
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#EF4444',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
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

function getRelativeTimeString(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 30) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}
