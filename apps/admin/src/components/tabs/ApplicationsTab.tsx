import { useState, useMemo } from 'react';
import type { JoinApplication } from '@traic/shared';
import { ApplicationDetailDrawer } from '../ApplicationDetailDrawer';

interface ApplicationsTabProps {
  applications: JoinApplication[];
  onDelete?: (id: string) => void;
  onUpdateStatus?: (id: string, status: string) => Promise<void>;
}

export function ApplicationsTab({ applications, onDelete, onUpdateStatus }: ApplicationsTabProps) {
  const [selectedApp, setSelectedApp] = useState<JoinApplication | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'ALL' | 'TODAY' | '7D' | '30D'>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'NEWEST' | 'OLDEST'>('NEWEST');

  // Filtered & sorted applications
  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            app.fullName.toLowerCase().includes(q) ||
            app.email.toLowerCase().includes(q) ||
            app.studentId.toLowerCase().includes(q) ||
            app.branch.toLowerCase().includes(q) ||
            app.interest.toLowerCase().includes(q) ||
            app.statementOfPurpose.toLowerCase().includes(q);
          if (!match) return false;
        }

        // Status filter
        const appStatus = (app as any).status || 'PENDING';
        if (statusFilter !== 'ALL' && appStatus !== statusFilter) {
          return false;
        }

        // Date filter
        if (dateFilter !== 'ALL' && app.createdAt) {
          const created = new Date(app.createdAt).getTime();
          const now = Date.now();
          const diffHours = (now - created) / (1000 * 3600);

          if (dateFilter === 'TODAY' && diffHours > 24) return false;
          if (dateFilter === '7D' && diffHours > 24 * 7) return false;
          if (dateFilter === '30D' && diffHours > 24 * 30) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return sortOrder === 'NEWEST' ? timeB - timeA : timeA - timeB;
      });
  }, [applications, searchQuery, dateFilter, statusFilter, sortOrder]);

  const handleUpdateStatusWrapper = async (id: string, status: string) => {
    if (onUpdateStatus) {
      await onUpdateStatus(id, status);
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp({ ...selectedApp, status } as any);
      }
    }
  };

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

  return (
    <>
      <div style={{ backgroundColor: '#141821', border: '1px solid #232838', borderRadius: '12px', overflow: 'hidden' }}>
        {/* Header bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #232838', backgroundColor: '#0D0F14', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#E8EAF0' }}>
                Candidate Induction Applications
              </span>
              <span style={{ backgroundColor: '#1E2536', color: '#38BDF8', padding: '2px 8px', borderRadius: '9999px', fontSize: '11px', fontFamily: 'monospace', fontWeight: 700 }}>
                {filteredApplications.length} of {applications.length}
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#9AA3B5' }}>
              Click any application to open the dedicated full-screen review pane with Statement of Purpose reader.
            </p>
          </div>
        </div>

        {/* Timestamp & Filter Control Bar */}
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: '#0F131D',
            borderBottom: '1px solid #232838',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          {/* Search Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 240px', maxWidth: '360px' }}>
            <input
              type="text"
              placeholder="Search by name, email, roll, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#07090E',
                border: '1px solid #283248',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                color: '#E8EAF0',
                outline: 'none',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ backgroundColor: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '12px' }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Date Range Presets */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', color: '#64748B', fontFamily: 'monospace', marginRight: '2px' }}>
              DATE:
            </span>
            {(['ALL', 'TODAY', '7D', '30D'] as const).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setDateFilter(preset)}
                style={{
                  backgroundColor: dateFilter === preset ? '#FF9F1C' : '#151A26',
                  color: dateFilter === preset ? '#080A0F' : '#94A3B8',
                  border: `1px solid ${dateFilter === preset ? '#FF9F1C' : '#232C3D'}`,
                  borderRadius: '4px',
                  padding: '3px 8px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {preset === '7D' ? '7 DAYS' : preset === '30D' ? '30 DAYS' : preset}
              </button>
            ))}
          </div>

          {/* Status Dropdown & Sort Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                backgroundColor: '#07090E',
                border: '1px solid #283248',
                borderRadius: '6px',
                padding: '5px 10px',
                fontSize: '11px',
                color: '#E8EAF0',
                fontFamily: 'monospace',
                outline: 'none',
              }}
            >
              <option value="ALL">ALL STATUSES</option>
              <option value="PENDING">PENDING</option>
              <option value="REVIEWING">REVIEWING</option>
              <option value="SHORTLISTED">SHORTLISTED</option>
              <option value="ACCEPTED">ACCEPTED</option>
              <option value="REJECTED">REJECTED</option>
            </select>

            <button
              type="button"
              onClick={() => setSortOrder(sortOrder === 'NEWEST' ? 'OLDEST' : 'NEWEST')}
              style={{
                backgroundColor: '#151A26',
                border: '1px solid #283248',
                borderRadius: '6px',
                padding: '5px 10px',
                fontSize: '11px',
                color: '#38BDF8',
                fontFamily: 'monospace',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              title="Click to toggle sorting order"
            >
              {sortOrder === 'NEWEST' ? '↓ NEWEST' : '↑ OLDEST'}
            </button>
          </div>
        </div>

        {/* Applications Data Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #232838', color: '#9AA3B5', backgroundColor: '#0D0F14' }}>
                <th style={{ padding: '12px 16px' }}>Applicant</th>
                <th style={{ padding: '12px 16px' }}>Contact</th>
                <th style={{ padding: '12px 16px' }}>Academic</th>
                <th style={{ padding: '12px 16px' }}>Track</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px' }}>Pitch Excerpt</th>
                <th style={{ padding: '12px 16px' }}>Timestamp</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '48px 24px', textAlign: 'center', color: '#9AA3B5' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#CBD5E1' }}>No matching applications found</div>
                    <div style={{ fontSize: '12px', marginTop: '4px', color: '#64748B' }}>
                      Try adjusting your search query, date filter, or status filter.
                    </div>
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => {
                  const appStatus = (app as any).status || 'PENDING';
                  const statusBadge = getStatusColor(appStatus);

                  return (
                    <tr
                      key={app.id || app.email}
                      onClick={() => setSelectedApp(app)}
                      style={{
                        borderBottom: '1px solid rgba(35, 40, 56, 0.5)',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(30, 41, 59, 0.35)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                      }}
                    >
                      {/* Name */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700, color: '#F1F5F9', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>{app.fullName}</span>
                          <span style={{ fontSize: '10px', color: '#38BDF8', opacity: 0.8 }}>↗</span>
                        </div>
                      </td>

                      {/* Contact */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ color: '#E8EAF0', fontSize: '12px' }}>{app.email}</div>
                        <div style={{ fontSize: '11px', color: '#9AA3B5', fontFamily: 'monospace' }}>{app.phone}</div>
                      </td>

                      {/* Academic */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontFamily: 'monospace', color: '#FF9F1C', fontWeight: 700 }}>{app.studentId}</div>
                        <div style={{ fontSize: '11px', color: '#9AA3B5' }}>Year {app.yearOfStudy} • {app.branch}</div>
                      </td>

                      {/* Track */}
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            backgroundColor: '#07080B',
                            border: '1px solid #232838',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            color: '#38BDF8',
                            fontFamily: 'monospace',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {app.interest}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            backgroundColor: statusBadge.bg,
                            color: statusBadge.text,
                            border: `1px solid ${statusBadge.border}`,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontFamily: 'monospace',
                            fontWeight: 700,
                          }}
                        >
                          {appStatus}
                        </span>
                      </td>

                      {/* Statement Preview with Read Full button */}
                      <td style={{ padding: '14px 16px', maxWidth: '240px', fontSize: '12px' }}>
                        <div style={{ color: '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {app.statementOfPurpose}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedApp(app);
                          }}
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#38BDF8',
                            padding: 0,
                            marginTop: '2px',
                            fontSize: '11px',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                          }}
                        >
                          Read Full Review ↗
                        </button>
                      </td>

                      {/* Timestamp */}
                      <td style={{ padding: '14px 16px', color: '#9AA3B5', fontSize: '11px', whiteSpace: 'nowrap' }}>
                        <div>{app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}</div>
                        <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'monospace' }}>
                          {app.createdAt ? new Date(app.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ''}
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedApp(app);
                            }}
                            style={{
                              backgroundColor: '#151C2C',
                              border: '1px solid #28344D',
                              color: '#38BDF8',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            Review ↗
                          </button>
                          {onDelete && app.id && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Delete application from ${app.fullName}?`)) {
                                  onDelete(app.id!);
                                }
                              }}
                              style={{
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                color: '#EF4444',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dedicated Review Drawer */}
      {selectedApp && (
        <ApplicationDetailDrawer
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onUpdateStatus={handleUpdateStatusWrapper}
          onDelete={(id) => {
            if (onDelete) onDelete(id);
            setSelectedApp(null);
          }}
        />
      )}
    </>
  );
}
