import type { JoinApplication } from '@traic/shared';

interface ApplicationsTabProps {
  applications: JoinApplication[];
  onDelete?: (id: string) => void;
}

export function ApplicationsTab({ applications, onDelete }: ApplicationsTabProps) {
  return (
    <div style={{ backgroundColor: '#141821', border: '1px solid #232838', borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', padding: '16px 20px', borderBottom: '1px solid #232838', backgroundColor: '#0D0F14' }}>
        <div>
          <span style={{ fontSize: '14px', fontWeight: 800, color: '#E8EAF0' }}>
            Candidate Induction Submissions ({applications.length})
          </span>
          <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#9AA3B5' }}>
            Live applications submitted through the public website /join form.
          </p>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #232838', color: '#9AA3B5', backgroundColor: '#0D0F14' }}>
              <th style={{ padding: '14px 16px' }}>Applicant</th>
              <th style={{ padding: '14px 16px' }}>Contact</th>
              <th style={{ padding: '14px 16px' }}>Roll / Branch</th>
              <th style={{ padding: '14px 16px' }}>Track Interest</th>
              <th style={{ padding: '14px 16px' }}>Statement & Pitch</th>
              <th style={{ padding: '14px 16px' }}>Portfolio</th>
              <th style={{ padding: '14px 16px' }}>Date</th>
              <th style={{ padding: '14px 16px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '36px', textAlign: 'center', color: '#9AA3B5' }}>
                  No membership applications received yet. Submit an application from the /join page to test live!
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id || app.email} style={{ borderBottom: '1px solid rgba(35, 40, 56, 0.5)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 700 }}>{app.fullName}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ color: '#E8EAF0' }}>{app.email}</div>
                    <div style={{ fontSize: '11px', color: '#9AA3B5' }}>{app.phone}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontFamily: 'monospace', color: '#FF9F1C', fontWeight: 700 }}>{app.studentId}</div>
                    <div style={{ fontSize: '11px', color: '#9AA3B5' }}>Year {app.yearOfStudy} • {app.branch}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ backgroundColor: '#07080B', border: '1px solid #232838', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', color: '#38BDF8', fontFamily: 'monospace' }}>
                      {app.interest}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#E8EAF0', maxWidth: '300px', fontSize: '12px', lineHeight: 1.4 }}>
                    {app.statementOfPurpose}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '12px' }}>
                    {app.githubOrPortfolio ? (
                      <a
                        href={app.githubOrPortfolio.startsWith('http') ? app.githubOrPortfolio : `https://${app.githubOrPortfolio}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#38BDF8', textDecoration: 'underline', fontSize: '11px', fontFamily: 'monospace' }}
                      >
                        View Link ↗
                      </a>
                    ) : (
                      <span style={{ color: '#64748B', fontSize: '11px' }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#9AA3B5', fontSize: '11px' }}>
                    {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recent'}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    {onDelete && app.id && (
                      <button
                        type="button"
                        onClick={() => onDelete(app.id!)}
                        style={{
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#EF4444',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
