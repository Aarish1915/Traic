// tests/real_world_e2e_sync_test.mjs
// Comprehensive Real-World Synchronization, Edge-Case & Security Verification Suite

import assert from 'node:assert';

const API_BASE = 'http://localhost:4000';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'traic_admin_2025!';

let cookieHeader = '';
let adminToken = '';
let passed = 0;
let failed = 0;

function logPass(msg) {
  passed++;
  console.log(`  \x1b[32m✔\x1b[0m ${msg}`);
}

function logFail(msg, err) {
  failed++;
  console.error(`  \x1b[31m✖\x1b[0m ${msg}`);
  if (err) console.error(`    ${err.message || err}`);
}

async function runTest(name, fn) {
  try {
    await fn();
    logPass(name);
  } catch (err) {
    logFail(name, err);
  }
}

async function main() {
  console.log('\n\x1b[1m\x1b[36m=== TRAIC v2.0.0 Real-World E2E Synchronization & Edge-Case Suite ===\x1b[0m\n');

  // ---------------------------------------------------------
  // 1. Admin Auth & Security Gate
  // ---------------------------------------------------------
  console.log('\x1b[33m[1/6] Admin Security & Session Auth\x1b[0m');

  await runTest('Brute-force protection: Invalid admin login returns 401 with remaining attempts', async () => {
    const res = await fetch(`${API_BASE}/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'wrong-password-attack' }),
    });
    assert.strictEqual(res.status, 401);
    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.ok(typeof json.attemptsLeft === 'number');
  });

  await runTest('Valid admin login issues secure session cookie and bearer token', async () => {
    const res = await fetch(`${API_BASE}/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: ADMIN_PASSWORD }),
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.token, 'Expected bearer token in login response');
    adminToken = json.token;

    const rawCookie = res.headers.get('set-cookie');
    assert.ok(rawCookie, 'Expected Set-Cookie header');
    assert.ok(rawCookie.includes('traic_admin_session='), 'Cookie should contain traic_admin_session');
    cookieHeader = rawCookie.split(';')[0];
  });

  await runTest('Session verification endpoint verifies active admin token', async () => {
    const res = await fetch(`${API_BASE}/admin/auth/verify`, {
      headers: {
        Cookie: cookieHeader,
        Authorization: `Bearer ${adminToken}`,
      },
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.authenticated, true);
  });

  // ---------------------------------------------------------
  // 2. Dynamic Settings & Copy -> Public Site Ingestion
  // ---------------------------------------------------------
  console.log('\n\x1b[33m[2/6] Dynamic Settings & Website Copy Synchronization\x1b[0m');

  let originalSettings = null;

  await runTest('Fetch current site settings snapshot', async () => {
    const res = await fetch(`${API_BASE}/public/settings`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    originalSettings = json.data;
  });

  await runTest('Admin updates motto, club name, lab location, and contact email', async () => {
    const updatedPayload = {
      ...originalSettings,
      clubName: 'TRAIC Pro Studio',
      mottoText: 'INNOVATION • DISCIPLINE • IMPACT',
      labLocation: 'DIA Labs 4.0, Block C-302, COER University Campus',
      contactEmail: 'director.dialabs@coer.ac.in',
    };

    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(updatedPayload),
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.data.clubName, 'TRAIC Pro Studio');
    assert.strictEqual(json.data.mottoText, 'INNOVATION • DISCIPLINE • IMPACT');
  });

  await runTest('Public settings endpoint reflects updated copy dynamically', async () => {
    const res = await fetch(`${API_BASE}/public/settings`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.data.clubName, 'TRAIC Pro Studio');
    assert.strictEqual(json.data.mottoText, 'INNOVATION • DISCIPLINE • IMPACT');
    assert.strictEqual(json.data.contactEmail, 'director.dialabs@coer.ac.in');
  });

  await runTest('Revert site settings back to official production baseline', async () => {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(originalSettings),
    });
    assert.strictEqual(res.status, 200);
  });

  // ---------------------------------------------------------
  // 3. Lab Gear / Instruments Synchronization
  // ---------------------------------------------------------
  console.log('\n\x1b[33m[3/6] Lab Gear / Equipment Synchronization\x1b[0m');

  let testGearId = null;

  await runTest('Admin creates a high-precision lab instrument', async () => {
    const newGear = {
      name: 'Rohde & Schwarz FPC1500 Spectrum Analyzer',
      model: '1GHz to 3GHz RF Analyzer with Tracking Gen',
      category: 'TESTING',
      specifications: 'DANL -165 dBm, 1Hz resolution bandwidth, integrated VSWR bridge and Smith chart.',
      status: 'OPERATIONAL',
      priority: 99,
      isPublished: true,
    };

    const res = await fetch(`${API_BASE}/admin/gear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(newGear),
    });
    assert.strictEqual(res.status, 201);
    const json = await res.json();
    assert.ok(json.data.id);
    testGearId = json.data.id;
    assert.strictEqual(json.data.name, newGear.name);
  });

  await runTest('Public /public/gear returns the newly created instrument', async () => {
    const res = await fetch(`${API_BASE}/public/gear`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    const item = json.data.find((g) => g.id === testGearId);
    assert.ok(item, 'Expected test gear item to be present in published list');
    assert.strictEqual(item.status, 'OPERATIONAL');
  });

  await runTest('Admin toggles gear visibility -> Hidden from public site', async () => {
    const toggleRes = await fetch(`${API_BASE}/admin/gear/${testGearId}/toggle`, {
      method: 'PATCH',
      headers: {
        Cookie: cookieHeader,
        Authorization: `Bearer ${adminToken}`,
      },
    });
    assert.strictEqual(toggleRes.status, 200);

    const publicRes = await fetch(`${API_BASE}/public/gear`);
    const json = await publicRes.json();
    const item = json.data.find((g) => g.id === testGearId);
    assert.strictEqual(item, undefined, 'Unpublished gear should be hidden from public feed');
  });

  await runTest('Admin deletes temporary test gear', async () => {
    const res = await fetch(`${API_BASE}/admin/gear/${testGearId}`, {
      method: 'DELETE',
      headers: {
        Cookie: cookieHeader,
        Authorization: `Bearer ${adminToken}`,
      },
    });
    assert.strictEqual(res.status, 200);
  });

  // ---------------------------------------------------------
  // 4. Hackathons & Dynamic Events Synchronization
  // ---------------------------------------------------------
  console.log('\n\x1b[33m[4/6] Hackathons & Events Management\x1b[0m');

  let testEventId = null;
  const testSlug = `drone-hackathon-${Date.now()}`;

  await runTest('Admin creates a hackathon with prize pool, team size, tracks, and schedule', async () => {
    const eventPayload = {
      title: 'TRAIC Autonomous Aerial Grand Prix 2026',
      slug: testSlug,
      tagline: 'High-speed autonomous navigation, obstacle evasion, and precision LiDAR mapping',
      descriptionMd: 'Full-weekend collegiate aerial robotics tournament hosted at COER University indoor flight arena.',
      type: 'HACKATHON',
      mode: 'OFFLINE',
      venue: 'DIA Labs Indoor Aerodrome (Block C)',
      startsAt: new Date(Date.now() + 86400000).toISOString(),
      endsAt: new Date(Date.now() + 172800000).toISOString(),
      status: 'PUBLISHED',
      prizePool: '₹2,50,000 Cash Pool',
      teamSize: '3-4 Pilots',
      capacity: 32,
      tracks: ['Sub-100ms Optical Flow', 'PX4 Autonomous Trajectory', '3D LiDAR SLAM'],
      schedule: [
        { time: '09:00 AM', title: 'Transponder Verification & Scrutineering' },
        { time: '11:30 AM', title: 'Preliminary Autonomous Lap Trials' },
        { time: '04:00 PM', title: 'Grand Finale Heat & Award Ceremony' },
      ],
    };

    const res = await fetch(`${API_BASE}/admin/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(eventPayload),
    });
    assert.strictEqual(res.status, 201);
    const json = await res.json();
    assert.ok(json.data.id);
    testEventId = json.data.id;
    assert.strictEqual(json.data.prizePool, '₹2,50,000 Cash Pool');
  });

  await runTest('Public event slug endpoint returns all custom hackathon tracks & schedule', async () => {
    const res = await fetch(`${API_BASE}/public/events/${testSlug}`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.data.slug, testSlug);
    assert.strictEqual(json.data.prizePool, '₹2,50,000 Cash Pool');
    assert.strictEqual(json.data.teamSize, '3-4 Pilots');
    assert.strictEqual(json.data.capacity, 32);
    assert.strictEqual(json.data.tracks.length, 3);
    assert.strictEqual(json.data.schedule.length, 3);
  });

  await runTest('Admin cleans up test hackathon event', async () => {
    const res = await fetch(`${API_BASE}/admin/events/${testEventId}`, {
      method: 'DELETE',
      headers: {
        Cookie: cookieHeader,
        Authorization: `Bearer ${adminToken}`,
      },
    });
    assert.strictEqual(res.status, 200);
  });

  // ---------------------------------------------------------
  // 5. Admissions Pipeline & CSV Formula Injection Defense
  // ---------------------------------------------------------
  console.log('\n\x1b[33m[5/6] Student Admissions & RFC-4180 CSV Security\x1b[0m');

  let testAppId = null;
  const testStudentEmail = `audit.applicant.${Date.now()}@coer.ac.in`;

  await runTest('Student submits an application from /join form', async () => {
    const application = {
      fullName: 'Vikramaditya Sharma',
      email: testStudentEmail,
      phone: '+91 9876543210',
      studentId: 'COER2024ECE082',
      yearOfStudy: 2,
      branch: 'Electronics and Communication Engineering',
      interest: 'ROBOTICS_HARDWARE',
      skills: ['STM32', 'FreeRTOS', 'KiCad', 'ROS2'],
      statementOfPurpose: 'Passionate about high-speed CAN-FD differential bus transceivers and RTOS drivers.',
      githubOrPortfolio: 'https://github.com/vikram-robotics',
    };

    const res = await fetch(`${API_BASE}/public/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(application),
    });
    assert.strictEqual(res.status, 201);
    const json = await res.json();
    assert.ok(json.data.id);
    testAppId = json.data.id;
  });

  await runTest('Admin finds application and updates status to SHORTLISTED with interview notes', async () => {
    const res = await fetch(`${API_BASE}/admin/applications/${testAppId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        status: 'SHORTLISTED',
        reviewNotes: 'Strong understanding of STM32 DMA ring buffers. Interview scheduled for Tuesday.',
      }),
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.data.status, 'SHORTLISTED');
    assert.ok(json.data.reviewNotes.includes('STM32 DMA ring buffers'));
  });

  await runTest('Admin CSV export defends against formula injection attacks', async () => {
    // Inject a candidate with dangerous Excel formula prefix
    const maliciousApp = {
      fullName: "=CMD|' /C calc'!A1",
      email: `malicious.${Date.now()}@coer.ac.in`,
      phone: '+91 9123456780',
      studentId: 'INJECT001',
      yearOfStudy: 3,
      branch: 'Computer Science',
      interest: 'AI_MACHINE_LEARNING',
      skills: ['Python'],
      statementOfPurpose: '+1234567890 danger formula test',
    };

    const submitRes = await fetch(`${API_BASE}/public/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(maliciousApp),
    });
    assert.strictEqual(submitRes.status, 201);
    const injectedJson = await submitRes.json();
    const maliciousId = injectedJson.data.id;

    // Fetch CSV
    const csvRes = await fetch(`${API_BASE}/admin/applications/export`, {
      headers: {
        Cookie: cookieHeader,
        Authorization: `Bearer ${adminToken}`,
      },
    });
    assert.strictEqual(csvRes.status, 200);
    const csvText = await csvRes.text();

    // Verify formula characters are safely escaped with single quote (OWASP CSV Injection defense)
    assert.ok(csvText.includes("'=CMD") || csvText.includes("`=CMD"), 'Excel formula prefix must be neutralized');

    // Clean up
    await fetch(`${API_BASE}/admin/applications/${maliciousId}`, {
      method: 'DELETE',
      headers: {
        Cookie: cookieHeader,
        Authorization: `Bearer ${adminToken}`,
      },
    });
    await fetch(`${API_BASE}/admin/applications/${testAppId}`, {
      method: 'DELETE',
      headers: {
        Cookie: cookieHeader,
        Authorization: `Bearer ${adminToken}`,
      },
    });
  });

  // ---------------------------------------------------------
  // 6. Security Hardening & Edge-Case Payload Defenses
  // ---------------------------------------------------------
  console.log('\n\x1b[33m[6/6] Security Hardening & Injection Attacks Resistance\x1b[0m');

  await runTest('Honeypot trap catches automated bot submissions and returns false success', async () => {
    const spamSubmission = {
      fullName: 'Automated Bot Spammer',
      email: 'bot@spam.com',
      phone: '+1 555 123 4567',
      studentId: 'SPAM999',
      yearOfStudy: 1,
      branch: 'Computer Science',
      interest: 'AI_MACHINE_LEARNING',
      statementOfPurpose: 'Buy cheap components now!',
      _traic_hp_trap: 'http://malicious-link.ru',
    };

    const res = await fetch(`${API_BASE}/public/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(spamSubmission),
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.message, 'Application received');
  });

  await runTest('Oversized payload rejected with 413 or 400', async () => {
    const hugeMessage = 'A'.repeat(1.5 * 1024 * 1024); // 1.5MB
    const res = await fetch(`${API_BASE}/public/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Huge Payload Test',
        email: 'huge@test.com',
        subject: 'Stress Test',
        message: hugeMessage,
      }),
    });
    assert.ok(res.status === 413 || res.status === 400, `Expected 413 or 400, got ${res.status}`);
  });

  await runTest('Unauthenticated request to protected admin route receives 401', async () => {
    const res = await fetch(`${API_BASE}/admin/projects`);
    assert.strictEqual(res.status, 401);
  });

  console.log(`\n\x1b[1m=== Results: \x1b[32m${passed} PASSED\x1b[0m, \x1b[31m${failed} FAILED\x1b[0m ===\x1b[0m\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
