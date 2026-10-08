// tests/admin_ui_ux_apple_audit.mjs
// Automated UI/UX, Apple Store Online Design System, Apple HIG & WCAG 2.2 Audit Suite for TRAIC Admin Portal

import fs from 'node:fs';
import path from 'node:path';

const ADMIN_URL = process.env.ADMIN_URL || 'http://localhost:5173';
const API_URL = process.env.API_URL || 'http://localhost:4000';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];
const successes = [];

function recordResult(passed, testName, area, details = '') {
  totalTests++;
  if (passed) {
    passedTests++;
    successes.push(`[PASS] [${area}] ${testName}`);
  } else {
    failedTests++;
    failures.push({ area, testName, details });
    console.error(`  ❌ FAIL: [${area}] ${testName} - ${details}`);
  }
}

async function runAdminAudit() {
  console.log(`\n====================================================================`);
  console.log(`🍎 STARTING COMPREHENSIVE APPLE STORE ONLINE & HIG UI/UX AUDIT FOR ADMIN PANEL`);
  console.log(`   Target: ${ADMIN_URL}`);
  console.log(`====================================================================\n`);

  // [Phase 1] Admin HTML & Server Availability
  console.log(`[Phase 1] Auditing Admin Server Entrypoint & Document Foundations...`);
  let indexHtml = '';
  try {
    const res = await fetch(ADMIN_URL);
    recordResult(res.ok, 'HTTP 200 Admin Server Availability', 'Server');
    indexHtml = await res.text();
  } catch (err) {
    recordResult(false, 'HTTP 200 Admin Server Availability', 'Server', err.message);
  }

  // 1. Skip Link for WCAG 2.2 AA Keyboard Accessibility
  const hasSkipLink = indexHtml.includes('admin-skip-link') && indexHtml.includes('#admin-main-content');
  recordResult(hasSkipLink, 'WCAG 2.2 AA Skip Link to #admin-main-content', 'Accessibility', 'Missing skip link');

  // 2. Title conforms to Apple Product Standard
  const hasAppleTitle = indexHtml.includes('<title>TRAIC Admin Console</title>');
  recordResult(hasAppleTitle, 'Apple Store Product Title ("TRAIC Admin Console")', 'Branding', 'Incorrect title format');

  // 3. Apple Font Family in Body
  const hasAppleFont = indexHtml.includes('SF Pro Text') || indexHtml.includes('-apple-system');
  recordResult(hasAppleFont, 'Apple Typography Foundation: SF Pro Text / -apple-system', 'Typography', 'Missing SF Pro typography');

  // 4. Multi-device Breakpoints (Tablet < 1024px, Mobile < 640px)
  const hasTabletBreakpoint = indexHtml.includes('max-width: 1023px') || indexHtml.includes('max-width: 1024px');
  recordResult(hasTabletBreakpoint, 'Multi-Device Responsive Breakpoint: Tablet (< 1024px)', 'Responsive', 'Missing 1024px tablet breakpoint');

  const hasMobileTableWrap = indexHtml.includes('-webkit-overflow-scrolling: touch');
  recordResult(hasMobileTableWrap, 'Mobile Touch Scrolling Momentum: -webkit-overflow-scrolling: touch', 'Responsive', 'Missing touch momentum');

  // [Phase 2] Source Code Audit: CSS Tokens & Design System
  console.log(`\n[Phase 2] Auditing Apple Store Online Design Tokens (CSS Foundations)...`);
  const cssPath = path.resolve('apps/admin/src/apple-design-system.css');
  let cssContent = '';
  if (fs.existsSync(cssPath)) {
    cssContent = fs.readFileSync(cssPath, 'utf8');
    recordResult(true, 'Apple Store Online Tokens File Exists (apple-design-system.css)', 'Tokens');
  } else {
    recordResult(false, 'Apple Store Online Tokens File Exists (apple-design-system.css)', 'Tokens', 'File not found');
  }

  // Check required Apple Store Online tokens
  const requiredTokens = [
    { name: '--font-family-primary', desc: 'SF Pro Text Stack' },
    { name: '--font-size-xs: 12px', desc: 'Typography Scale xs=12px' },
    { name: '--font-size-sm: 14px', desc: 'Typography Scale sm=14px' },
    { name: '--font-size-3xl: 24px', desc: 'Typography Scale 3xl=24px' },
    { name: '--color-surface-base: #000000', desc: 'Surface Base #000000 (Pristine Black)' },
    { name: '--color-surface-card: #1D1D1F', desc: 'Surface Card #1D1D1F (Apple Store Dark)' },
    { name: '--color-surface-subcard: #161617', desc: 'Surface Subcard #161617' },
    { name: '--color-text-primary: #F5F5F7', desc: 'Text Primary #F5F5F7 (High Contrast)' },
    { name: '--color-text-secondary: #86868B', desc: 'Text Secondary #86868B' },
    { name: '--color-text-tertiary: #6E6E73', desc: 'Text Tertiary #6E6E73' },
    { name: '--color-accent-blue: #0071E3', desc: 'Accent Cupertino Blue #0071E3' },
    { name: '--color-accent-success: #30D158', desc: 'Accent Success Apple Green #30D158' },
    { name: '--color-accent-warning: #FF9F0A', desc: 'Accent Warning Apple Orange #FF9F0A' },
    { name: '--color-accent-destructive: #FF453A', desc: 'Accent Destructive Apple Red #FF453A' },
    { name: '--space-1: 5.62px', desc: 'Apple Spacing Token space.1=5.62px' },
    { name: '--space-2: 8px', desc: 'Apple Spacing Token space.2=8px' },
    { name: '--space-4: 15px', desc: 'Apple Spacing Token space.4=15px' },
    { name: '--radius-pill: 980px', desc: 'Apple Radius Token radius.xs=980px (Pill)' },
    { name: '--motion-duration-instant: 320ms', desc: 'Motion Token instant=320ms' },
    { name: ':focus-visible', desc: 'Keyboard-First Focus-Visible Rules' },
    { name: 'prefers-reduced-motion', desc: 'Accessibility: prefers-reduced-motion support' },
  ];

  for (const token of requiredTokens) {
    const present = cssContent.includes(token.name);
    recordResult(present, `Design Token: ${token.desc}`, 'Tokens', `Missing ${token.name}`);
  }

  // [Phase 3] Component Files Audit: No Prohibited Styling & Apple HIG Adherence
  console.log(`\n[Phase 3] Auditing Admin Components for Apple HIG & Strict Prohibitions...`);

  const componentFiles = [
    'apps/admin/src/App.tsx',
    'apps/admin/src/components/LoginGate.tsx',
    'apps/admin/src/components/Sidebar.tsx',
    'apps/admin/src/components/Header.tsx',
    'apps/admin/src/components/ApplicationDetailDrawer.tsx',
    'apps/admin/src/components/EditModal.tsx',
    'apps/admin/src/components/tabs/ProjectsTab.tsx',
    'apps/admin/src/components/tabs/GearTab.tsx',
    'apps/admin/src/components/tabs/EventsTab.tsx',
    'apps/admin/src/components/tabs/AchievementsTab.tsx',
    'apps/admin/src/components/tabs/MembersTab.tsx',
    'apps/admin/src/components/tabs/AlumniTab.tsx',
    'apps/admin/src/components/tabs/GalleryTab.tsx',
    'apps/admin/src/components/tabs/BannersTab.tsx',
    'apps/admin/src/components/tabs/SettingsTab.tsx',
    'apps/admin/src/components/tabs/ApplicationsTab.tsx',
  ];

  for (const fileRel of componentFiles) {
    const filePath = path.resolve(fileRel);
    if (!fs.existsSync(filePath)) {
      recordResult(false, `Component Exists: ${fileRel}`, 'Components', 'File not found');
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const baseName = path.basename(filePath);

    // Rule: NO Cyan `#00E5FF` or `#64D2FF`
    const hasCyanHex = /00E5FF|64D2FF/i.test(content);
    recordResult(!hasCyanHex, `Color Discipline: No Cyan Hex in ${baseName}`, baseName, 'Found prohibited cyan hex code');

    // Rule: NO "Cyan" in labels or text strings
    const hasCyanText = /\bCyan\b/i.test(content);
    recordResult(!hasCyanText, `Label Discipline: No "Cyan" text in ${baseName}`, baseName, 'Found word "Cyan"');

    // Rule: NO Space Grotesk
    const hasSpaceGrotesk = /Space_Grotesk|Space Grotesk/i.test(content);
    recordResult(!hasSpaceGrotesk, `Typography Discipline: No Space Grotesk in ${baseName}`, baseName, 'Found Space Grotesk');

    // Rule: NO Old Blue Navy Backgrounds (`#07080B`, `#232838`, `#0F1219`)
    const hasNavyHex = /07080B|232838|0F1219/i.test(content);
    recordResult(!hasNavyHex, `Obsidian Discipline: No Old Navy/Slate Hex in ${baseName}`, baseName, 'Found obsolete navy hex');

    // Rule: Touch Targets min-height: 44px
    if (content.includes('<button') || content.includes('<input')) {
      const has44Target = content.includes('44px') || content.includes('apple-button') || content.includes('minHeight');
      recordResult(has44Target, `Fitts's Law: 44pt Touch Targets Referenced in ${baseName}`, baseName, 'No 44pt dimension token');
    }
  }

  // [Phase 4] LoginGate Specific Audit
  console.log(`\n[Phase 4] Auditing LoginGate UI/UX & Form Accessibility...`);
  const loginGateContent = fs.readFileSync(path.resolve('apps/admin/src/components/LoginGate.tsx'), 'utf8');

  // Check accessible label association (htmlFor matching id)
  const hasLabelAssociation = loginGateContent.includes('htmlFor="admin-master-password"') && loginGateContent.includes('id="admin-master-password"');
  recordResult(hasLabelAssociation, 'WCAG 2.2 AA: Explicit Label htmlFor & id Association', 'LoginGate', 'Missing htmlFor/id association');

  // Check no cyber grid or sci-fi patterns
  const hasCyberGrid = loginGateContent.includes('linear-gradient(to right, rgba(0, 229, 255') || loginGateContent.includes('backgroundSize: \'36px 36px\'');
  recordResult(!hasCyberGrid, 'Apple Aesthetics: No Sci-Fi Cyber Grid in LoginGate', 'LoginGate', 'Cyber grid detected');

  // Check Apple Pill curvature on Submit Button
  const hasPillSubmit = loginGateContent.includes('980px') || loginGateContent.includes('9999px') || loginGateContent.includes('var(--radius-pill)');
  recordResult(hasPillSubmit, 'Apple HIG: 980px Pill Curvature on Primary Button', 'LoginGate', 'Missing pill radius');

  // Check password toggle accessibility
  const hasToggleAria = loginGateContent.includes('aria-label=');
  recordResult(hasToggleAria, 'WCAG 2.2 AA: Password Visibility Toggle aria-label', 'LoginGate', 'Missing aria-label on toggle');

  // [Phase 5] ApplicationsTab & Batch Actions Audit
  console.log(`\n[Phase 5] Auditing Applications Tab (Scale, RFC-4180 CSV, Formula Defense)...`);
  const appTabContent = fs.readFileSync(path.resolve('apps/admin/src/components/tabs/ApplicationsTab.tsx'), 'utf8');

  // Check windowed pagination (25, 50, 100)
  const hasWindowedPagination = appTabContent.includes('pageSize') && appTabContent.includes('totalPages');
  recordResult(hasWindowedPagination, 'High-Scale Performance: Windowed Pagination Controls', 'ApplicationsTab', 'Missing pagination');

  // Check RFC-4180 CSV export with formula injection defense
  const hasFormulaDefense = appTabContent.includes("str.startsWith('=')") || appTabContent.includes("/^[=\\+\\-\\@]/.test");
  recordResult(hasFormulaDefense, 'Security Hardening: CSV Formula Injection Defense', 'ApplicationsTab', 'Missing formula injection neutralization');

  // Check Apple Batch Dock
  const hasBatchDock = appTabContent.includes('selectedIds.size > 0') && appTabContent.includes('Bulk Shortlist');
  recordResult(hasBatchDock, 'Apple Interaction Design: Floating Batch Actions Dock', 'ApplicationsTab', 'Missing batch dock');

  // [Phase 6] Live API Authentication & Verification
  console.log(`\n[Phase 6] Verifying Live Admin Authentication & API Contracts...`);
  try {
    const authRes = await fetch(`${API_URL}/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'traic_admin_2025!' }),
    });

    recordResult(authRes.ok, 'Admin Authentication Handshake (POST /admin/auth/login)', 'Auth');
    const authData = await authRes.json();
    recordResult(authData.success === true && !!authData.token, 'Token & Session Established', 'Auth');

    // Test session verify
    const verifyRes = await fetch(`${API_URL}/admin/auth/verify`, {
      headers: { Authorization: `Bearer ${authData.token}` },
    });
    recordResult(verifyRes.ok, 'Bearer Session Verification (GET /admin/auth/verify)', 'Auth');
  } catch (err) {
    recordResult(false, 'Admin Authentication Handshake', 'Auth', err.message);
  }

  // Summary
  console.log(`\n====================================================================`);
  console.log(`📊 ADMIN AUDIT RESULTS SUMMARY:`);
  console.log(`Total Invariants Evaluated: ${totalTests}`);
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  console.log(`====================================================================\n`);

  if (failures.length > 0) {
    console.log(`Detailed Failure Report:`);
    failures.forEach((f, i) => {
      console.log(`${i + 1}. [${f.area}] ${f.testName} -> ${f.details}`);
    });
    process.exit(1);
  }

  return { totalTests, passedTests, failedTests, failures };
}

runAdminAudit().catch((err) => {
  console.error('Audit crashed with error:', err);
  process.exit(1);
});
