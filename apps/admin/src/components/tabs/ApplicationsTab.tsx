import type { JoinApplication } from '@traic/shared';

interface ApplicationsTabProps {
  applications: JoinApplication[];
}

export function ApplicationsTab({ applications }: ApplicationsTabProps) {
  return (
    <div style={{ backgroundColor: '#141821', border: '1px solid #232838', borderRadius: '12px', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #232838', color: '#9AA3B5', backgroundColor: '#0D0F14' }}>
            <th style={{ padding: '14px 16px' }}>Applicant</th>
            <th style={{ padding: '14px 16px' }}>Contact</th>
            <th style={{ padding: '14px 16px' }}>Roll / Branch</th>
            <th style={{ padding: '14px 16px' }}>Track Interest</th>
            <th style={{ padding: '14px 16px' }}>Statement & Pitch</th>
            <th style={{ padding: '14px 16px' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {applications.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: '#9AA3B5' }}>
                No membership applications received yet. Submit an application from the /join page to test!
              </td>
            </tr>
          ) : (
            applications.map((app) => (
              <tr key={app.id || app.email} style={{ borderBottom: '1px solid rgba(35, 40, 56, 0.5)' }}>
                <td style={{ padding: '14px 16px', fontWeight: 700 }}>{app.fullName}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div>{app.email}</div>
                  <div style={{ fontSize: '11px', color: '#9AA3B5' }}>{app.phone}</div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontFamily: 'monospace' }}>{app.studentId}</div>
                  <div style={{ fontSize: '11px', color: '#9AA3B5' }}>Year {app.yearOfStudy} • {app.branch}</div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ backgroundColor: '#07080B', border: '1px solid #232838', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', color: '#38BDF8', fontFamily: 'monospace' }}>
                    {app.interest}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', color: '#9AA3B5', maxWidth: '320px', fontSize: '12px' }}>
                  {app.statementOfPurpose}
                </td>
                <td style={{ padding: '14px 16px', color: '#9AA3B5', fontSize: '11px' }}>
                  {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recent'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
