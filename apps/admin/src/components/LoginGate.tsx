import { useState, FormEvent } from 'react';
import { Lock, Eye, EyeOff, KeyRound, AlertTriangle } from 'lucide-react';

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
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.attemptsLeft !== undefined) {
          setAttemptsLeft(data.attemptsLeft);
        }
        throw new Error(data.error || 'Authentication failed');
      }

      if (data.success) {
        onSuccess('cookie-session');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error. Please verify API connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: 'var(--font-family-primary)',
        position: 'relative',
      }}
    >
      {/* Apple Store Online Sign-In Card */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#1D1D1F',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '18px',
          padding: '36px',
          boxShadow: '0 20px 48px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.04)',
        }}
      >
        {/* Apple Brand Lockup */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              margin: '0 auto 16px',
              borderRadius: '12px',
              backgroundColor: 'rgba(0, 113, 227, 0.12)',
              border: '1px solid rgba(0, 113, 227, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
            }}
          >
            <img src="/traic-logo.png" alt="TRAIC" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <h1
            style={{
              margin: '0 0 6px 0',
              fontSize: '21px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#F5F5F7',
              lineHeight: 1.2,
            }}
          >
            TRAIC Admin Console
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: '13px',
              color: '#86868B',
              lineHeight: 1.4,
            }}
          >
            Sign in with your master key to manage robotics projects, laboratory gear, and admissions.
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div
            role="alert"
            style={{
              backgroundColor: 'rgba(255, 69, 58, 0.12)',
              border: '1px solid rgba(255, 69, 58, 0.3)',
              borderRadius: '10px',
              padding: '12px 14px',
              marginBottom: '20px',
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              color: '#FF453A',
              fontSize: '12.5px',
            }}
          >
            <AlertTriangle size={16} color="#FF453A" style={{ flexShrink: 0 }} />
            <div>{error}</div>
          </div>
        )}

        {/* Sign-In Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="admin-master-password"
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: '#A1A1A6',
                marginBottom: '8px',
                letterSpacing: '-0.01em',
              }}
            >
              Master Security Key
            </label>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '14px',
                  color: '#86868B',
                  pointerEvents: 'none',
                }}
              >
                <KeyRound size={16} />
              </div>
              <input
                id="admin-master-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter administrator key..."
                autoFocus
                disabled={loading}
                aria-required="true"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  minHeight: '44px',
                  padding: '12px 48px 12px 40px',
                  backgroundColor: '#121214',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  color: '#F5F5F7',
                  fontSize: '13px',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0071E3';
                  e.target.style.boxShadow = '0 0 0 2px rgba(0, 113, 227, 0.25)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '6px',
                  top: '2px',
                  background: 'none',
                  border: 'none',
                  color: '#86868B',
                  cursor: 'pointer',
                  padding: '10px',
                  minHeight: '44px',
                  minWidth: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                }}
                aria-label={showPassword ? 'Hide master key' : 'Show master key'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {attemptsLeft !== null && attemptsLeft > 0 && (
              <div style={{ fontSize: '11.5px', color: '#FF9F0A', marginTop: '6px' }}>
                Notice: {attemptsLeft} attempts remaining before temporary rate-limit.
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              minHeight: '44px',
              padding: '12px 20px',
              backgroundColor: '#0071E3',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '980px',
              fontWeight: 600,
              fontSize: '13px',
              letterSpacing: '-0.01em',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background-color 0.2s, transform 0.1s',
              opacity: loading ? 0.7 : 1,
            }}
            onMouseOver={(e) => !loading && ((e.currentTarget.style.backgroundColor = '#0077ED'))}
            onMouseOut={(e) => !loading && ((e.currentTarget.style.backgroundColor = '#0071E3'))}
            onMouseDown={(e) => !loading && ((e.currentTarget.style.transform = 'scale(0.985)'))}
            onMouseUp={(e) => !loading && ((e.currentTarget.style.transform = 'scale(1)'))}
          >
            <Lock size={15} />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Apple Footer Note */}
        <div
          style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            textAlign: 'center',
            fontSize: '11px',
            color: '#6E6E73',
            lineHeight: 1.4,
          }}
        >
          Protected under statutory IT & DPDP safeguards. Encrypted cryptographic session.
        </div>
      </div>
    </div>
  );
}
