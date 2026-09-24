import { Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';
import { logger } from '../../common/logger';

// Default master admin password for development; override in production via ADMIN_PASSWORD
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'traic_admin_2025!';

// Session lifetime: 8 hours
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

// Active sessions: token -> { createdAt, lastActiveAt, ip }
interface SessionData {
  createdAt: number;
  lastActiveAt: number;
  ip: string;
}
const activeSessions = new Map<string, SessionData>();

// Brute-force tracker: ip -> { failedAttempts, lockedUntil }
interface BruteForceEntry {
  failedAttempts: number;
  lockedUntil: number;
}
const bruteForceTracker = new Map<string, BruteForceEntry>();

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'unknown';
}

/**
 * Constant-time string equality check to defeat timing analysis attacks
 */
function timingSafeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Constant time check against dummy buffer to avoid early return timing leaks
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Check if an IP address is currently locked out due to repeated failed attempts
 */
export function checkBruteForceLock(req: Request, res: Response, next: NextFunction): void {
  const ip = getClientIp(req);
  const entry = bruteForceTracker.get(ip);

  if (entry && entry.lockedUntil > Date.now()) {
    const remainingSecs = Math.ceil((entry.lockedUntil - Date.now()) / 1000);
    logger.warn({ ip, remainingSecs }, 'Blocked brute-force login attempt on locked IP');
    res.status(429).json({
      success: false,
      error: `Security lockout: Too many failed login attempts. Please try again in ${remainingSecs} seconds.`,
      locked: true,
      remainingSecs,
    });
    return;
  }

  next();
}

/**
 * Handle admin login with brute-force protection and constant-time password check
 */
export function handleLogin(req: Request, res: Response): void {
  const ip = getClientIp(req);
  const { password } = req.body;

  if (!password || typeof password !== 'string') {
    res.status(400).json({ success: false, error: 'Password is required' });
    return;
  }

  const isValid = timingSafeCompare(password, ADMIN_PASSWORD);

  if (!isValid) {
    // Record failed attempt
    const entry = bruteForceTracker.get(ip) || { failedAttempts: 0, lockedUntil: 0 };
    entry.failedAttempts += 1;

    if (entry.failedAttempts >= MAX_FAILED_ATTEMPTS) {
      entry.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
      logger.warn({ ip, failedAttempts: entry.failedAttempts }, 'Admin IP locked out due to brute-force threshold');
    }
    bruteForceTracker.set(ip, entry);

    const attemptsLeft = Math.max(0, MAX_FAILED_ATTEMPTS - entry.failedAttempts);
    logger.warn({ ip, attemptsLeft }, 'Invalid admin login attempt');

    // Artificial 500ms delay to deter high-speed bot password spraying
    setTimeout(() => {
      res.status(401).json({
        success: false,
        error: attemptsLeft > 0 
          ? `Invalid administrator credentials. ${attemptsLeft} attempts remaining before temporary lockout.`
          : 'Security lockout activated: Maximum failed attempts exceeded. Locked for 15 minutes.',
        attemptsLeft,
      });
    }, 500);
    return;
  }

  // Reset failed attempts on successful login
  bruteForceTracker.delete(ip);

  // Generate cryptographically secure 256-bit random session token
  const token = crypto.randomBytes(32).toString('hex');
  activeSessions.set(token, {
    createdAt: Date.now(),
    lastActiveAt: Date.now(),
    ip,
  });

  logger.info({ ip }, 'Admin successfully authenticated');

  // Set HTTP-only secure cookie for same-site or subdomains
  res.cookie('traic_admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: SESSION_TTL_MS,
  });

  res.json({
    success: true,
    message: 'Authentication successful',
    token, // Return token for Authorization: Bearer <token> cross-origin use
    expiresIn: SESSION_TTL_MS / 1000,
  });
}

/**
 * Terminate active session
 */
export function handleLogout(req: Request, res: Response): void {
  const token = extractToken(req);
  if (token) {
    activeSessions.delete(token);
  }
  res.clearCookie('traic_admin_session');
  res.json({ success: true, message: 'Logged out successfully' });
}

/**
 * Verify active session validity
 */
export function handleVerify(req: Request, res: Response): void {
  const token = extractToken(req);
  if (!token || !isValidSession(token)) {
    res.status(401).json({ success: false, authenticated: false });
    return;
  }
  res.json({ success: true, authenticated: true });
}

function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  if (req.cookies && req.cookies.traic_admin_session) {
    return req.cookies.traic_admin_session;
  }
  return null;
}

function isValidSession(token: string): boolean {
  const session = activeSessions.get(token);
  if (!session) return false;

  // Check TTL expiry
  if (Date.now() - session.lastActiveAt > SESSION_TTL_MS) {
    activeSessions.delete(token);
    return false;
  }

  // Slide last active timestamp
  session.lastActiveAt = Date.now();
  return true;
}

/**
 * Enforce strict authentication on all protected /admin/* routes
 */
export function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const token = extractToken(req);

  if (!token || !isValidSession(token)) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Valid administrator session required to access this resource.',
    });
    return;
  }

  next();
}

/**
 * Rate limiter for public form submissions to block automated spam bots
 */
const publicSubmissionTracker = new Map<string, { count: number; resetAt: number }>();
export function publicFormRateLimiter(req: Request, res: Response, next: NextFunction): void {
  const ip = getClientIp(req);
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour window
  const maxSubmissions = 10;

  const entry = publicSubmissionTracker.get(ip) || { count: 0, resetAt: now + windowMs };

  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + windowMs;
  }

  entry.count += 1;
  publicSubmissionTracker.set(ip, entry);

  if (entry.count > maxSubmissions) {
    logger.warn({ ip }, 'Public form rate limit exceeded');
    res.status(429).json({
      success: false,
      error: 'Too many submissions from this connection. Please try again later.',
    });
    return;
  }

  // Honeypot check for bots: reject if hidden bot trap field is populated
  if (req.body && req.body._traic_hp_trap) {
    logger.warn({ ip }, 'Bot trap triggered: automated spam submission blocked');
    // Silently return 200 OK so bots think they succeeded without writing anything to DB
    res.status(200).json({ success: true, message: 'Received' });
    return;
  }

  next();
}
