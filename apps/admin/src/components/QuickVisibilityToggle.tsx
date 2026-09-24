interface QuickVisibilityToggleProps {
  isPublished: boolean;
  onToggle: () => void;
  label?: string;
  disabled?: boolean;
}

export function QuickVisibilityToggle({
  isPublished,
  onToggle,
  label = isPublished ? 'PUBLISHED' : 'HIDDEN',
  disabled = false,
}: QuickVisibilityToggleProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onToggle();
      }}
      disabled={disabled}
      title={isPublished ? 'Visible on public website. Click to Hide (Draft).' : 'Hidden from public website. Click to Publish.'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 10px',
        borderRadius: '9999px',
        fontSize: '11px',
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '0.04em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s ease',
        backgroundColor: isPublished ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
        color: isPublished ? '#34D399' : '#FBBF24',
        border: `1px solid ${isPublished ? 'rgba(16, 185, 129, 0.35)' : 'rgba(245, 158, 11, 0.35)'}`,
      }}
    >
      <span
        style={{
          display: 'inline-block',
          width: '6px',
          height: '6px',
          borderRadius: '9999px',
          backgroundColor: isPublished ? '#10B981' : '#F59E0B',
          boxShadow: isPublished ? '0 0 6px #10B981' : '0 0 6px #F59E0B',
        }}
      />
      <span>{label}</span>
    </button>
  );
}
