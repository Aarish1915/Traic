import { useState, useMemo, useEffect } from 'react';
import type { JoinApplication } from '@traic/shared';
import { ApplicationDetailDrawer } from '../ApplicationDetailDrawer';

interface ApplicationsTabProps {
  applications: JoinApplication[];
  onDelete?: (id: string) => void;
  onUpdateStatus?: (id: string, status: string) => Promise<void>;
  onBulkUpdateStatus?: (ids: string[], status: string) => Promise<void>;
  onUpdateNotes?: (id: string, notes: string) => Promise<void>;
}

export function ApplicationsTab({
  applications,
  onDelete,
  onUpdateStatus,
  onBulkUpdateStatus,
  onUpdateNotes,
}: ApplicationsTabProps) {
  const [selectedApp, setSelectedApp] = useState<JoinApplication | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [domainFilter, setDomainFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<'ALL' | 'TODAY' | '7D' | '30D'>('ALL');
  const [sortOrder, setSortOrder] = useState<'NEWEST' | 'OLDEST' | 'NAME_AZ'>('NEWEST');

  // Pagination state for 1,000+ candidates
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Batch selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);

  // Debounce search input by 200ms for smooth 60fps typing even with 10k rows
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 200);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Overall KPI statistics
  const stats = useMemo(() => {
    const total = applications.length;
    let pending = 0;
    let reviewing = 0;
    let shortlisted = 0;
    let accepted = 0;
    let rejected = 0;

    for (const app of applications) {
      const st = (app as any).status || 'PENDING';
      if (st === 'PENDING') pending++;
      else if (st === 'REVIEWING') reviewing++;
      else if (st === 'SHORTLISTED') shortlisted++;
      else if (st === 'ACCEPTED') accepted++;
      else if (st === 'REJECTED') rejected++;
    }

    const acceptanceRate = total > 0 ? ((accepted / total) * 100).toFixed(1) : '0.0';

    return { total, pending, reviewing, shortlisted, accepted, rejected, acceptanceRate };
  }, [applications]);

  // Filtered & sorted applications
  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        // Status filter
        const appStatus = (app as any).status || 'PENDING';
        if (statusFilter !== 'ALL' && appStatus !== statusFilter) {
          return false;
        }

        // Domain / Track filter
        if (domainFilter !== 'ALL' && app.interest !== domainFilter) {
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

        // Debounced search query
        if (debouncedSearch.trim()) {
          const q = debouncedSearch.trim().toLowerCase();
          const skills: string[] = (app as any).skills || [];
          const match =
            app.fullName.toLowerCase().includes(q) ||
            app.email.toLowerCase().includes(q) ||
            app.studentId.toLowerCase().includes(q) ||
            app.branch.toLowerCase().includes(q) ||
            app.interest.toLowerCase().includes(q) ||
            app.statementOfPurpose.toLowerCase().includes(q) ||
            skills.some((s) => s.toLowerCase().includes(q));

          if (!match) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOrder === 'NAME_AZ') {
          return a.fullName.localeCompare(b.fullName);
        }
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return sortOrder === 'NEWEST' ? timeB - timeA : timeA - timeB;
      });
  }, [applications, statusFilter, domainFilter, dateFilter, debouncedSearch, sortOrder]);

  // Windowed pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredApplications.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * pageSize;
  const paginatedApplications = useMemo(() => {
    return filteredApplications.slice(startIndex, startIndex + pageSize);
  }, [filteredApplications, startIndex, pageSize]);

  // Selection handlers
  const handleToggleSelectAllPage = () => {
    const newSelected = new Set(selectedIds);
    const pageIds = paginatedApplications.map((a) => a.id).filter(Boolean) as string[];
    const allSelected = pageIds.every((id) => newSelected.has(id));

    if (allSelected) {
      pageIds.forEach((id) => newSelected.delete(id));
    } else {
      pageIds.forEach((id) => newSelected.add(id));
    }
    setSelectedIds(newSelected);
  };

  const handleToggleSelectItem = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  // Bulk status update
  const handleBulkStatus = async (status: string) => {
    if (selectedIds.size === 0) return;
    if (onBulkUpdateStatus) {
      setBulkBusy(true);
      try {
        await onBulkUpdateStatus(Array.from(selectedIds), status);
        setSelectedIds(new Set());
      } finally {
        setBulkBusy(false);
      }
    } else if (onUpdateStatus) {
      setBulkBusy(true);
      try {
        for (const id of Array.from(selectedIds)) {
          await onUpdateStatus(id, status);
        }
        setSelectedIds(new Set());
      } finally {
        setBulkBusy(false);
      }
    }
  };

  // CSV Export with RFC-4180 escaping and formula sanitization
  const handleExportCSV = () => {
    const sanitizeCSV = (val: any) => {
      if (val === null || val === undefined) return '""';
      let str = String(val).replace(/"/g, '""');
      // Prevent spreadsheet formula injection
      if (str.startsWith('=') || str.startsWith('+') || str.startsWith('-') || str.startsWith('@')) {
        str = `'${str}`;
      }
      return `"${str}"`;
    };

    const headers = [
      'ID',
      'Full Name',
      'Email',
      'Phone',
      'Student ID',
      'Year',
      'Branch',
      'Track Interest',
      'Skills',
      'Portfolio URL',
      'Status',
      'Review Notes',
      'Statement of Purpose',
      'Submitted At',
    ];

    const rows = filteredApplications.map((app) => [
      sanitizeCSV(app.id),
      sanitizeCSV(app.fullName),
      sanitizeCSV(app.email),
      sanitizeCSV(app.phone),
      sanitizeCSV(app.studentId),
      sanitizeCSV(app.yearOfStudy),
      sanitizeCSV(app.branch),
      sanitizeCSV(app.interest),
      sanitizeCSV(((app as any).skills || []).join('; ')),
      sanitizeCSV(app.githubOrPortfolio || ''),
      sanitizeCSV((app as any).status || 'PENDING'),
      sanitizeCSV((app as any).reviewNotes || ''),
      sanitizeCSV(app.statementOfPurpose),
      sanitizeCSV(app.createdAt || ''),
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `traic-applications-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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

  const isAllPageSelected =
    paginatedApplications.length > 0 &&
    paginatedApplications.every((a) => a.id && selectedIds.has(a.id));

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* KPI Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
          }}
        >
          <div
            style={{
              backgroundColor: '#161617',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '16px 20px',
            }}
          >
            <div style={{ fontSize: '12px', color: '#86868B', fontWeight: 500 }}>Total Applicants</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#F5F5F7', marginTop: '4px', letterSpacing: '-0.02em' }}>
              {stats.total.toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: '#86868B', marginTop: '2px' }}>All-time recorded</div>
          </div>

          <div
            style={{
              backgroundColor: '#161617',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '16px 20px',
            }}
          >
            <div style={{ fontSize: '12px', color: '#86868B', fontWeight: 500 }}>Awaiting Review</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#FF9F0A', marginTop: '4px', letterSpacing: '-0.02em' }}>
              {stats.pending.toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: '#86868B', marginTop: '2px' }}>Pending triage</div>
          </div>

          <div
            style={{
              backgroundColor: '#161617',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '16px 20px',
            }}
          >
            <div style={{ fontSize: '12px', color: '#86868B', fontWeight: 500 }}>Shortlisted</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#2997FF', marginTop: '4px', letterSpacing: '-0.02em' }}>
              {stats.shortlisted.toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: '#86868B', marginTop: '2px' }}>Interview pipeline</div>
          </div>

          <div
            style={{
              backgroundColor: '#161617',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '16px 20px',
            }}
          >
            <div style={{ fontSize: '12px', color: '#86868B', fontWeight: 500 }}>Accepted Cohort</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#30D158', marginTop: '4px', letterSpacing: '-0.02em' }}>
              {stats.accepted.toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: '#86868B', marginTop: '2px' }}>{stats.acceptanceRate}% acceptance rate</div>
          </div>
        </div>

        {/* Main Card Container */}
        <div
          style={{
            backgroundColor: '#161617',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          {/* Header Bar with Export Button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              backgroundColor: '#1D1D1F',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#F5F5F7', letterSpacing: '-0.01em' }}>
                  Candidate Admissions Intake
                </h1>
                <span
                  style={{
                    backgroundColor: 'rgba(41, 151, 255, 0.12)',
                    color: '#2997FF',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    fontSize: '11.5px',
                    fontWeight: 600,
                  }}
                >
                  {filteredApplications.length.toLocaleString()} matching
                </span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#86868B' }}>
                High-scale admissions console. Click any row to inspect technical statements and record evaluation notes.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={handleExportCSV}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#F5F5F7',
                  padding: '8px 16px',
                  borderRadius: '980px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  minHeight: '44px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>↓</span>
                <span>Export CSV ({filteredApplications.length})</span>
              </button>
            </div>
          </div>

          {/* Apple Segmented Status Filter Tabs */}
          <div
            style={{
              padding: '12px 24px',
              backgroundColor: '#161617',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              overflowX: 'auto',
            }}
          >
            {[
              { id: 'ALL', label: 'All', count: stats.total },
              { id: 'PENDING', label: 'Pending', count: stats.pending },
              { id: 'REVIEWING', label: 'Reviewing', count: stats.reviewing },
              { id: 'SHORTLISTED', label: 'Shortlisted', count: stats.shortlisted },
              { id: 'ACCEPTED', label: 'Accepted', count: stats.accepted },
              { id: 'REJECTED', label: 'Rejected', count: stats.rejected },
            ].map((tab) => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setStatusFilter(tab.id);
                    setCurrentPage(1);
                  }}
                  style={{
                    backgroundColor: isActive ? '#0071E3' : 'rgba(255, 255, 255, 0.04)',
                    color: isActive ? '#FFFFFF' : '#86868B',
                    border: 'none',
                    borderRadius: '980px',
                    padding: '8px 16px',
                    fontSize: '12.5px',
                    fontWeight: isActive ? 600 : 500,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap',
                    minHeight: '44px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{tab.label}</span>
                  <span
                    style={{
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                      color: isActive ? '#FFFFFF' : '#86868B',
                      padding: '2px 7px',
                      borderRadius: '980px',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                    }}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Secondary Filter & Search Control Strip */}
          <div
            style={{
              padding: '12px 24px',
              backgroundColor: '#1D1D1F',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            {/* Search Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 280px', maxWidth: '420px', position: 'relative' }}>
              <input
                type="text"
                placeholder="Search candidates by name, roll, email, skills..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#161617',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '980px',
                  padding: '10px 36px 10px 16px',
                  fontSize: '13px',
                  color: '#F5F5F7',
                  outline: 'none',
                  minHeight: '44px',
                  boxSizing: 'border-box',
                }}
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#86868B',
                    cursor: 'pointer',
                    fontSize: '12px',
                    minHeight: '44px',
                    minWidth: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  aria-label="Clear search query"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Dropdowns & Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {/* Domain Filter */}
              <select
                value={domainFilter}
                onChange={(e) => {
                  setDomainFilter(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  backgroundColor: '#161617',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  color: '#F5F5F7',
                  outline: 'none',
                  minHeight: '44px',
                }}
              >
                <option value="ALL">All Tracks</option>
                <option value="ROBOTICS_HARDWARE">Robotics & Hardware</option>
                <option value="EMBEDDED_IOT">Embedded & IoT</option>
                <option value="AI_MACHINE_LEARNING">AI & Machine Learning</option>
                <option value="FULL_STACK_DEV">Full Stack Dev</option>
                <option value="DESIGN_3D">3D Design & CAD</option>
              </select>

              {/* Date Filter */}
              <select
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value as any);
                  setCurrentPage(1);
                }}
                style={{
                  backgroundColor: '#161617',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  color: '#F5F5F7',
                  outline: 'none',
                  minHeight: '44px',
                }}
              >
                <option value="ALL">All Time</option>
                <option value="TODAY">Last 24 Hours</option>
                <option value="7D">Last 7 Days</option>
                <option value="30D">Last 30 Days</option>
              </select>

              {/* Sort Order */}
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                style={{
                  backgroundColor: '#161617',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  color: '#F5F5F7',
                  outline: 'none',
                  minHeight: '44px',
                }}
              >
                <option value="NEWEST">↓ Newest First</option>
                <option value="OLDEST">↑ Oldest First</option>
                <option value="NAME_AZ">Name A-Z</option>
              </select>

              {/* Page Size Selector */}
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                style={{
                  backgroundColor: '#161617',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  color: '#F5F5F7',
                  outline: 'none',
                  minHeight: '44px',
                }}
                title="Candidates per page"
              >
                <option value={25}>25 / page</option>
                <option value={50}>50 / page</option>
                <option value={100}>100 / page</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#86868B', backgroundColor: '#1D1D1F', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '12px 16px', width: '36px' }}>
                    <input
                      type="checkbox"
                      checked={isAllPageSelected}
                      onChange={handleToggleSelectAllPage}
                      style={{ cursor: 'pointer' }}
                      title="Select all on this page"
                    />
                  </th>
                  <th style={{ padding: '12px 16px' }}>Applicant</th>
                  <th style={{ padding: '12px 16px' }}>Academic</th>
                  <th style={{ padding: '12px 16px' }}>Track &amp; Skills</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px' }}>Statement Excerpt</th>
                  <th style={{ padding: '12px 16px' }}>Date</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedApplications.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '56px 24px', textAlign: 'center', color: '#86868B' }}>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: '#F5F5F7' }}>No candidate records found</div>
                      <div style={{ fontSize: '12px', marginTop: '6px', color: '#86868B' }}>
                        Try clearing search terms or resetting status and domain filters.
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedApplications.map((app) => {
                    const appStatus = (app as any).status || 'PENDING';
                    const statusBadge = getStatusColor(appStatus);
                    const isSelected = app.id ? selectedIds.has(app.id) : false;
                    const skills: string[] = (app as any).skills || [];

                    return (
                      <tr
                        key={app.id || app.email}
                        onClick={() => setSelectedApp(app)}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                          backgroundColor: isSelected ? 'rgba(0, 113, 227, 0.08)' : 'transparent',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        {/* Checkbox */}
                        <td
                          style={{ padding: '14px 16px' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => app.id && handleToggleSelectItem(app.id)}
                            style={{ cursor: 'pointer' }}
                          />
                        </td>

                        {/* Name & Contact */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 600, color: '#F5F5F7', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>{app.fullName}</span>
                            <span style={{ fontSize: '11px', color: '#2997FF', opacity: 0.8 }}>↗</span>
                          </div>
                          <div style={{ color: '#86868B', fontSize: '11.5px', marginTop: '2px' }}>{app.email}</div>
                          <div style={{ color: '#6E6E73', fontSize: '11px', fontFamily: 'var(--font-family-mono, monospace)', fontVariantNumeric: 'tabular-nums' }}>{app.phone}</div>
                        </td>

                        {/* Academic */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontFamily: 'var(--font-family-mono, monospace)', fontVariantNumeric: 'tabular-nums', color: '#2997FF', fontWeight: 600 }}>{app.studentId}</div>
                          <div style={{ fontSize: '11.5px', color: '#86868B', marginTop: '2px' }}>
                            Year {app.yearOfStudy} • {app.branch}
                          </div>
                        </td>

                        {/* Track & Skills */}
                        <td style={{ padding: '14px 16px', maxWidth: '200px' }}>
                          <span
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.06)',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              fontSize: '11px',
                              color: '#F5F5F7',
                              fontWeight: 500,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {app.interest.replace(/_/g, ' ')}
                          </span>
                          {skills.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                              {skills.slice(0, 3).map((sk) => (
                                <span
                                  key={sk}
                                  style={{
                                    fontSize: '10px',
                                    color: '#2997FF',
                                    backgroundColor: 'rgba(41, 151, 255, 0.08)',
                                    padding: '1px 6px',
                                    borderRadius: '9999px',
                                  }}
                                >
                                  {sk}
                                </span>
                              ))}
                              {skills.length > 3 && (
                                <span style={{ fontSize: '10px', color: '#86868B' }}>
                                  +{skills.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* In-Line Status Dropdown */}
                        <td
                          style={{ padding: '14px 16px' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <select
                            value={appStatus}
                            onChange={(e) => {
                              if (app.id && onUpdateStatus) {
                                onUpdateStatus(app.id, e.target.value);
                              }
                            }}
                            style={{
                              backgroundColor: statusBadge.bg,
                              color: statusBadge.text,
                              border: `1px solid ${statusBadge.border}`,
                              borderRadius: '9999px',
                              padding: '3px 8px',
                              fontSize: '11px',
                              fontWeight: 600,
                              outline: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="REVIEWING">REVIEWING</option>
                            <option value="SHORTLISTED">SHORTLISTED</option>
                            <option value="ACCEPTED">ACCEPTED</option>
                            <option value="REJECTED">REJECTED</option>
                          </select>
                        </td>

                        {/* Statement Preview */}
                        <td style={{ padding: '14px 16px', maxWidth: '240px', fontSize: '12px' }}>
                          <div
                            style={{
                              color: '#86868B',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '220px',
                            }}
                          >
                            {app.statementOfPurpose}
                          </div>
                          {(app as any).reviewNotes && (
                            <div style={{ fontSize: '11px', color: '#30D158', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <span>✎</span>
                              <span>Notes attached</span>
                            </div>
                          )}
                        </td>

                        {/* Date */}
                        <td style={{ padding: '14px 16px', color: '#86868B', fontSize: '11px', whiteSpace: 'nowrap' }}>
                          <div>{app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recent'}</div>
                          <div style={{ fontSize: '10px', color: '#6E6E73', fontFamily: 'monospace' }}>
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
                                backgroundColor: '#0071E3',
                                border: 'none',
                                color: '#FFFFFF',
                                padding: '8px 16px',
                                borderRadius: '980px',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                minHeight: '44px',
                                display: 'inline-flex',
                                alignItems: 'center',
                              }}
                            >
                              Inspect
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
                                  backgroundColor: 'rgba(255, 69, 58, 0.08)',
                                  border: '1px solid rgba(255, 69, 58, 0.25)',
                                  color: '#FF453A',
                                  padding: '8px 12px',
                                  borderRadius: '980px',
                                  fontSize: '12px',
                                  fontWeight: 500,
                                  cursor: 'pointer',
                                  minHeight: '44px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
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

          {/* Pagination Navigation Footer */}
          <div
            style={{
              padding: '14px 24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              backgroundColor: '#1D1D1F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ fontSize: '12px', color: '#86868B' }}>
              Showing{' '}
              <strong style={{ color: '#F5F5F7' }}>
                {filteredApplications.length > 0 ? startIndex + 1 : 0}
              </strong>{' '}
              to{' '}
              <strong style={{ color: '#F5F5F7' }}>
                {Math.min(startIndex + pageSize, filteredApplications.length)}
              </strong>{' '}
              of{' '}
              <strong style={{ color: '#F5F5F7' }}>
                {filteredApplications.length.toLocaleString()}
              </strong>{' '}
              candidates
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                disabled={activePage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: activePage <= 1 ? '#6E6E73' : '#F5F5F7',
                  padding: '8px 16px',
                  borderRadius: '980px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: activePage <= 1 ? 'default' : 'pointer',
                  minHeight: '44px',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                ← Prev
              </button>

              <span style={{ fontSize: '12px', color: '#86868B' }}>
                Page <strong style={{ color: '#F5F5F7' }}>{activePage}</strong> of{' '}
                <strong style={{ color: '#F5F5F7' }}>{totalPages}</strong>
              </span>

              <button
                type="button"
                disabled={activePage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: activePage >= totalPages ? '#6E6E73' : '#F5F5F7',
                  padding: '8px 16px',
                  borderRadius: '980px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: activePage >= totalPages ? 'default' : 'pointer',
                  minHeight: '44px',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Apple Batch Action Dock (When items selected) */}
      {selectedIds.size > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9000,
            backgroundColor: '#1D1D1F',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.65)',
            borderRadius: '980px',
            padding: '8px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                backgroundColor: '#0071E3',
                color: '#FFFFFF',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              ✓
            </span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#F5F5F7' }}>
              {selectedIds.size} selected
            </span>
          </div>

          <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              disabled={bulkBusy}
              onClick={() => handleBulkStatus('SHORTLISTED')}
              style={{
                backgroundColor: 'rgba(41, 151, 255, 0.15)',
                color: '#2997FF',
                border: '1px solid rgba(41, 151, 255, 0.3)',
                padding: '8px 16px',
                borderRadius: '980px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: bulkBusy ? 'default' : 'pointer',
                minHeight: '44px',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              Bulk Shortlist
            </button>
            <button
              type="button"
              disabled={bulkBusy}
              onClick={() => handleBulkStatus('ACCEPTED')}
              style={{
                backgroundColor: 'rgba(48, 209, 88, 0.15)',
                color: '#30D158',
                border: '1px solid rgba(48, 209, 88, 0.3)',
                padding: '8px 16px',
                borderRadius: '980px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: bulkBusy ? 'default' : 'pointer',
                minHeight: '44px',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              Bulk Accept
            </button>
            <button
              type="button"
              disabled={bulkBusy}
              onClick={() => handleBulkStatus('REJECTED')}
              style={{
                backgroundColor: 'rgba(255, 69, 58, 0.15)',
                color: '#FF453A',
                border: '1px solid rgba(255, 69, 58, 0.3)',
                padding: '8px 16px',
                borderRadius: '980px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: bulkBusy ? 'default' : 'pointer',
                minHeight: '44px',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              Bulk Reject
            </button>
          </div>

          <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />

          <button
            type="button"
            onClick={() => setSelectedIds(new Set())}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#86868B',
              fontSize: '12.5px',
              cursor: 'pointer',
              padding: '8px 12px',
              minHeight: '44px',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            Clear
          </button>
        </div>
      )}

      {/* Dedicated Review Drawer */}
      {selectedApp && (
        <ApplicationDetailDrawer
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onUpdateStatus={async (id, status) => {
            if (onUpdateStatus) {
              await onUpdateStatus(id, status);
              setSelectedApp((prev) => (prev ? ({ ...prev, status } as any) : null));
            }
          }}
          onUpdateNotes={onUpdateNotes}
          onDelete={(id) => {
            if (onDelete) onDelete(id);
            setSelectedApp(null);
          }}
        />
      )}
    </>
  );
}
