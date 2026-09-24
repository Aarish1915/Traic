import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ToastProps {
  toast: { message: string; type: 'success' | 'error' } | null;
}

export function Toast({ toast }: ToastProps) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div
      style={{
        position: 'fixed',
        top: '28px',
        right: '28px',
        zIndex: 999999,
        padding: '16px 24px',
        borderRadius: '12px',
        backgroundColor: isSuccess ? '#0d1f18' : '#2D1418',
        color: isSuccess ? '#34D399' : '#F87171',
        border: `2px solid ${isSuccess ? '#10B981' : '#EF4444'}`,
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        boxShadow: isSuccess
          ? '0 12px 32px rgba(16, 185, 129, 0.25), 0 0 0 1px rgba(16, 185, 129, 0.3)'
          : '0 12px 32px rgba(239, 68, 68, 0.25)',
        fontSize: '14px',
        fontWeight: 600,
        fontFamily: 'monospace, system-ui, sans-serif',
        animation: 'slideIn 0.25s ease-out',
        maxWidth: '450px',
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: isSuccess ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {isSuccess ? <CheckCircle2 size={22} color="#10B981" /> : <AlertCircle size={22} color="#EF4444" />}
      </div>
      <div>
        <div
          style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: isSuccess ? '#6EE7B7' : '#FCA5A5',
            marginBottom: '2px',
          }}
        >
          {isSuccess ? 'ACTION COMPLETED // VERIFIED' : 'SYSTEM ERROR'}
        </div>
        <div style={{ color: '#F8FAFC', fontSize: '13px', fontWeight: 600 }}>
          {toast.message}
        </div>
      </div>
    </div>
  );
}
