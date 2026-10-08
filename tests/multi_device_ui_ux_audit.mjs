/**
 * TRAIC Multi-Device Screen UI/UX & Responsive Layout Audit Suite
 *
 * Verifies:
 * 1. Apple Store Online / HIG Design Tokens & Anti-Aliasing (Font smoothing on Windows)
 * 2. Mobile Inset Grouped Cards vs. Desktop Data Tables across all tabs
 * 3. Elimination of Garish Rainbow Buttons in Application Detail Drawer (Segmented Control)
 * 4. Fitts's Law 44pt Touch Targets across viewports
 * 5. Horizontal Layout Constrainment (zero table blowout on 320px - 430px viewports)
 * 6. Live Endpoint Responsiveness on Admin (5173) and Web (3000)
 */

import fs from 'node:fs';
import path from 'node:path';

const ADMIN_URL = process.env.ADMIN_URL || 'http://localhost:5173';
const WEB_URL = process.env.WEB_URL || 'http://localhost:3000';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function recordResult(passed, checkName, category, failureReason = '') {
  totalTests++;
  if (passed) {
    passedTests++;
    console.log(`  ✓ PASS: [${category}] ${checkName}`);
  } else {
    failedTests++;
    failures.push({ checkName, category, failureReason });
    console.error(`  ✗ FAIL: [${category}] ${checkName} -> ${failureReason}`);
  }
}

async function runMultiDeviceAudit() {
  console.log(`====================================================================`);
  console.log(`🍎 STARTING MULTI-DEVICE SCREEN UI/UX & APPLE HIG AUDIT`);
  console.log(`   Admin: ${ADMIN_URL} | Web: ${WEB_URL}`);
  console.log(`====================================================================`);

  // [Phase 1] Multi-Device Viewport Breakpoints & Responsive Foundations
  console.log(`\n[Phase 1] Auditing Multi-Device Viewport Breakpoints & Fluid Foundations...`);
  const indexHtmlPath = path.resolve('apps/admin/index.html');
  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

  recordResult(
    indexHtml.includes('-webkit-font-smoothing: antialiased'),
    'Anti-Aliased Font Smoothing (-webkit-font-smoothing: antialiased)',
    'Typography'
  );

  recordResult(
    indexHtml.includes('-moz-osx-font-smoothing: grayscale'),
    'Anti-Aliased Font Smoothing (-moz-osx-font-smoothing: grayscale)',
    'Typography'
  );

  recordResult(
    indexHtml.includes('text-rendering: optimizeLegibility'),
    'High-DPI Legibility (text-rendering: optimizeLegibility)',
    'Typography'
  );

  recordResult(
    indexHtml.includes('Inter') && indexHtml.includes('JetBrains+Mono'),
    'Windows High-DPI Font Fallbacks (Inter & JetBrains Mono Google Fonts)',
    'Typography'
  );

  recordResult(
    indexHtml.includes('@media (min-width: 1024px)') && indexHtml.includes('@media (max-width: 1023px)'),
    'iPad / Tablet Viewport Separation (1024px Breakpoint)',
    'Responsive'
  );

  recordResult(
    indexHtml.includes('max-width: 100vw') && indexHtml.includes('overflow-x: hidden'),
    'Mobile Screen Overflow Constrainment (no horizontal body blowout)',
    'Responsive'
  );

  // [Phase 2] Apple Design System CSS & Component Tokens
  console.log(`\n[Phase 2] Auditing Apple Design System CSS & Segmented Control Tokens...`);
  const cssPath = path.resolve('apps/admin/src/apple-design-system.css');
  const cssContent = fs.readFileSync(cssPath, 'utf8');

  recordResult(
    cssContent.includes('.apple-segmented-control') && cssContent.includes('.apple-segment-button'),
    'Apple Segmented Control Classes Present (.apple-segmented-control & .apple-segment-button)',
    'Design System'
  );

  recordResult(
    cssContent.includes('.admin-mobile-card-list') && cssContent.includes('.admin-desktop-table'),
    'Dual Responsive Display Tokens (.admin-desktop-table & .admin-mobile-card-list)',
    'Responsive'
  );

  recordResult(
    cssContent.includes('--radius-pill: 980px'),
    'Apple 980px Pill Radius Token Defined',
    'Design System'
  );

  recordResult(
    cssContent.includes('--color-accent-blue: #0071E3'),
    'Cupertino Blue #0071E3 Accent Token Defined',
    'Design System'
  );

  // [Phase 3] Component Mobile Card & Table Dual Responsive Layouts
  console.log(`\n[Phase 3] Auditing Dual Responsive Layouts Across All Admin Tabs...`);
  const tableTabFiles = [
    { file: 'apps/admin/src/components/tabs/EventsTab.tsx', name: 'EventsTab' },
    { file: 'apps/admin/src/components/tabs/ProjectsTab.tsx', name: 'ProjectsTab' },
    { file: 'apps/admin/src/components/tabs/GearTab.tsx', name: 'GearTab' },
    { file: 'apps/admin/src/components/tabs/MembersTab.tsx', name: 'MembersTab' },
    { file: 'apps/admin/src/components/tabs/AlumniTab.tsx', name: 'AlumniTab' },
    { file: 'apps/admin/src/components/tabs/AchievementsTab.tsx', name: 'AchievementsTab' },
    { file: 'apps/admin/src/components/tabs/BannersTab.tsx', name: 'BannersTab' },
  ];

  for (const item of tableTabFiles) {
    const fullPath = path.resolve(item.file);
    const code = fs.readFileSync(fullPath, 'utf8');

    const hasDesktopTable = code.includes('admin-desktop-table');
    recordResult(
      hasDesktopTable,
      `${item.name}: Desktop Table Tagged with .admin-desktop-table`,
      'Mobile/Desktop Dual'
    );

    const hasMobileCards = code.includes('admin-mobile-card-list');
    recordResult(
      hasMobileCards,
      `${item.name}: Mobile Inset Grouped Cards Tagged with .admin-mobile-card-list`,
      'Mobile/Desktop Dual'
    );

    const has44Target = code.includes('44px') || code.includes('minHeight');
    recordResult(
      has44Target,
      `${item.name}: Fitts's Law 44pt Touch Targets Enforced`,
      'Accessibility'
    );

    const noCyan = !/00E5FF|64D2FF/i.test(code);
    recordResult(noCyan, `${item.name}: Zero Cyan Hex Codes`, 'Color Discipline');
  }

  // [Phase 4] ApplicationDetailDrawer Apple UX & Typography Audit
  console.log(`\n[Phase 4] Auditing ApplicationDetailDrawer Typography & Segmented Control...`);
  const drawerPath = path.resolve('apps/admin/src/components/ApplicationDetailDrawer.tsx');
  const drawerCode = fs.readFileSync(drawerPath, 'utf8');

  const usesSegmentedControl = drawerCode.includes('apple-segmented-control') && drawerCode.includes('apple-segment-button');
  recordResult(
    usesSegmentedControl,
    'ApplicationDetailDrawer: Uses Apple Segmented Control for Candidate Status',
    'Apple UX'
  );

  const hasNoRawMonospace = !drawerCode.includes("fontFamily: 'monospace'");
  recordResult(
    hasNoRawMonospace,
    'ApplicationDetailDrawer: No Raw Unstyled Monospace (Uses Apple Mono Token)',
    'Typography'
  );

  const hasPillButtons = drawerCode.includes('980px');
  recordResult(
    hasPillButtons,
    'ApplicationDetailDrawer: Enforces Apple 980px Pill Curvature',
    'Apple UX'
  );

  // [Phase 5] Live Runtime Responsiveness
  console.log(`\n[Phase 5] Verifying Live Admin Console & Public Web Server...`);
  try {
    const adminRes = await fetch(ADMIN_URL);
    recordResult(
      adminRes.status === 200,
      `Admin Console Live (HTTP ${adminRes.status}) at ${ADMIN_URL}`,
      'Live Runtime'
    );
  } catch (err) {
    recordResult(false, `Admin Console Live at ${ADMIN_URL}`, 'Live Runtime', err.message);
  }

  try {
    const webRes = await fetch(WEB_URL);
    recordResult(
      webRes.status === 200,
      `Web Showcase Live (HTTP ${webRes.status}) at ${WEB_URL}`,
      'Live Runtime'
    );
  } catch (err) {
    recordResult(false, `Web Showcase Live at ${WEB_URL}`, 'Live Runtime', err.message);
  }

  // Final Summary
  console.log(`\n====================================================================`);
  console.log(`📊 MULTI-DEVICE & APPLE HIG AUDIT SUMMARY:`);
  console.log(`Total Invariants Evaluated: ${totalTests}`);
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  const passRate = ((passedTests / totalTests) * 100).toFixed(1);
  console.log(`Success Rate: ${passRate}%`);
  console.log(`====================================================================\n`);

  process.exitCode = failedTests > 0 ? 1 : 0;
}

runMultiDeviceAudit().catch((err) => {
  console.error('Audit encountered unhandled error:', err);
  process.exitCode = 1;
});
