import { useState, FormEvent } from 'react';
import { ShieldAlert, Lock, Eye, EyeOff, KeyRound, AlertTriangle, Terminal } from 'lucide-react';

interface LoginGateProps {
  apiBase: string;
  onSuccess: (token: string) => void;
}

export function LoginGate({ apiBase, onSuccess }: LoginGateProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Master security key is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${apiBase}/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.attemptsLeft !== undefined) {
          setAttemptsLeft(data.attemptsLeft);
        }
        throw new Error(data.error || 'Authentication failed');
      }

      // Success
      if (data.token) {
        sessionStorage.setItem('traic_admin_token', data.token);
        onSuccess(data.token);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error. Please verify API connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#07080B',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'monospace, system-ui, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Cyber Grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(to right, rgba(234, 88, 12, 0.04) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(234, 88, 12, 0.04) 1px, transparent 1px)
        `,
        backgroundSize: '36px 36px',
        pointerEvents: 'none',
      }} />

      {/* Security Terminal Card */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '460px',
        backgroundColor: '#0F1219',
        border: '1px solid #232838',
        borderRadius: '16px',
        padding: '36px',
        boxShadow: '0 24px 64px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)',
      }}>
        {/* Terminal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', borderBottom: '1px solid #1E2330', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'rgba(234, 88, 12, 0.15)',
              border: '1px solid rgba(234, 88, 12, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <ShieldAlert size={20} color="#EA580C" />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#F8FAFC', letterSpacing: '0.05em' }}>
                TRAIC // AUTH GATEWAY
              </div>
              <div style={{ fontSize: '10px', color: '#94A3B8' }}>
                RESTRICTED COORDINATOR ACCESS
              </div>
            </div>
          </div>
          <span style={{
            fontSize: '9px',
            padding: '3px 8px',
            borderRadius: '4px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34D399',
            fontWeight: 700,
          }}>
            SHIELD ACTIVE
          </span>
        </div>

        {/* Security Notification Banner */}
        <div style={{
          backgroundColor: '#161B26',
          border: '1px solid #252D3D',
          borderRadius: '8px',
          padding: '12px 14px',
          marginBottom: '24px',
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-start',
        }}>
          <Terminal size={16} color="#38BDF8" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div style={{ fontSize: '11px', color: '#CBD5E1', lineHeight: '1.5' }}>
            All administrative queries and mutations require authorized cryptographic session tokens. Brute-force bot attacks are actively monitored and rate-limited.
          </div>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div style={{
            backgroundColor: '#2D1418',
            border: '1px solid #EF4444',
            borderRadius: '8px',
            padding: '12px 14px',
            marginBottom: '20px',
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            color: '#F87171',
            fontSize: '12px',
          }}>
            <AlertTriangle size={18} color="#EF4444" style={{ flexShrink: 0 }} />
            <div>{error}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#CBD5E1', marginBottom: '8px', letterSpacing: '0.04em' }}>
              MASTER SECURITY KEY / PASSWORD:
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748B' }}>
                <KeyRound size={16} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password..."
                autoFocus
                disabled={loading}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '12px 42px 12px 38px',
                  backgroundColor: '#07080B',
                  border: '1px solid #2D3748',
                  borderRadius: '8px',
                  color: '#F8FAFC',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#EA580C')}
                onBlur={(e) => (e.target.style.borderColor = '#2D3748')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '12px',
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: 0,
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {attemptsLeft !== null && attemptsLeft > 0 && (
              <div style={{ fontSize: '10px', color: '#F59E0B', marginTop: '6px' }}>
                Warning: {attemptsLeft} attempts remaining before temporary 15-minute IP lockout.
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px 20px',
              backgroundColor: '#EA580C',
              color: '#07080B',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '13px',
              letterSpacing: '0.04em',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background-color 0.2s, transform 0.1s',
              opacity: loading ? 0.7 : 1,
            }}
            onMouseOver={(e) => !loading && ((e.currentTarget.style.backgroundColor = '#F97316'))}
            onMouseOut={(e) => !loading && ((e.currentTarget.style.backgroundColor = '#EA580C'))}
          >
            <Lock size={15} />
            <span>{loading ? 'VERIFYING CREDENTIALS...' : 'AUTHENTICATE & UNLOCK'}</span>
          </button>
        </form>

        {/* Footer Security Badges */}
        <div style={{ marginTop: '28px', paddingTop: '18px', borderTop: '1px solid #1E2330', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px', color: '#64748B' }}>
          <span>RATE-LIMITED VIA IP</span>
          <span>TIMING-SAFE EQUAL</span>
          <span>SHA-256 SESSION</span>
        </div>
      </div>
    </div>
  );
}
