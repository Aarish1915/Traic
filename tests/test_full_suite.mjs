// tests/test_full_suite.mjs
// Comprehensive automated integration & security test suite for TRAIC API

const BASE_URL = process.env.API_URL || 'http://localhost:4000';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'traic_admin_2025!';

let passed = 0;
let failed = 0;
const results = [];

function assert(condition, message) {
  if (condition) {
    passed++;
    results.push(`  ✅ ${message}`);
  } else {
    failed++;
    results.push(`  ❌ FAIL: ${message}`);
  }
}

async function runTests() {
  console.log(`\n🚀 Starting TRAIC API Test Suite against ${BASE_URL}...\n`);

  let adminToken = '';

  // 1. Healthcheck
  try {
    const res = await fetch(`${BASE_URL}/health`);
    assert(res.status === 200, 'GET /health returns HTTP 200');
    const data = await res.json();
    assert(data.status === 'ok', 'Health status is "ok"');
    assert(data.service === 'traic-api', 'Health service is "traic-api"');
    assert(typeof data.timestamp === 'string', 'Health timestamp is valid ISO string');
  } catch (err) {
    assert(false, `Health check failed: ${err.message}`);
  }

  // 2. Public Read Endpoints (Envelope: { success: true, data: [...] })
  const publicEndpoints = [
    '/public/projects',
    '/public/events',
    '/public/achievements',
    '/public/team',
    '/public/alumni',
    '/public/tracks',
    '/public/banners',
    '/public/gallery',
    '/public/settings',
    '/public/gear',
  ];

  for (const ep of publicEndpoints) {
    try {
      const res = await fetch(`${BASE_URL}${ep}`);
      assert(res.status === 200, `GET ${ep} returns HTTP 200`);
      const body = await res.json();
      assert(body.success === true, `GET ${ep} envelope contains success: true`);
      assert(body.data !== undefined, `GET ${ep} envelope contains data payload`);
    } catch (err) {
      assert(false, `GET ${ep} threw error: ${err.message}`);
    }
  }

  // 3. Security Headers
  try {
    const res = await fetch(`${BASE_URL}/health`);
    assert(res.headers.get('x-content-type-options') === 'nosniff', 'Header x-content-type-options is "nosniff"');
    assert(!res.headers.get('x-powered-by'), 'Header x-powered-by is stripped by Helmet');
  } catch (err) {
    assert(false, `Security headers check failed: ${err.message}`);
  }

  // 4. Admin Auth
  try {
    // Bad login
    const badRes = await fetch(`${BASE_URL}/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'wrong_password_123' }),
    });
    assert(badRes.status === 401, 'POST /admin/auth/login with invalid password returns 401');

    // Good login
    const goodRes = await fetch(`${BASE_URL}/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: ADMIN_PASSWORD }),
    });
    assert(goodRes.status === 200, 'POST /admin/auth/login with valid password returns 200');
    const authData = await goodRes.json();
    assert(authData.success === true, 'Auth response success is true');
    assert(typeof authData.token === 'string' && authData.token.length >= 32, 'Auth returns secure token');
    adminToken = authData.token;

    // Verify token
    const verifyRes = await fetch(`${BASE_URL}/admin/auth/verify`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(verifyRes.status === 200, 'GET /admin/auth/verify with token returns 200');
    const verifyData = await verifyRes.json();
    assert(verifyData.authenticated === true, 'Verify returns authenticated: true');
  } catch (err) {
    assert(false, `Admin auth check failed: ${err.message}`);
  }

  // 5. Admin Stats
  try {
    const statsRes = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(statsRes.status === 200, 'GET /admin/stats returns HTTP 200');
    const stats = await statsRes.json();
    assert(stats.success === true, 'Stats envelope contains success: true');
    assert(typeof stats.data.totalProjects === 'number', 'Stats data.totalProjects is number');
    assert(typeof stats.data.totalEvents === 'number', 'Stats data.totalEvents is number');
    assert(typeof stats.data.totalMembers === 'number', 'Stats data.totalMembers is number');
    assert(typeof stats.data.totalApplications === 'number', 'Stats data.totalApplications is number');
  } catch (err) {
    assert(false, `Admin stats check failed: ${err.message}`);
  }

  // 6. Admin CRUD Cycle
  let testProjectId = '';
  try {
    // Create Project
    const createRes = await fetch(`${BASE_URL}/admin/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: 'CI Test Rover Mk 9',
        slug: `ci-test-rover-${Date.now()}`,
        tagline: 'Autonomous test unit for CI quality verification',
        descriptionMd: 'Full telemetry and testing description here for verification.',
        category: 'HARDWARE',
        year: 2025,
        techStack: ['STM32', 'FreeRTOS'],
        status: 'DRAFT',
        featured: false,
      }),
    });
    assert(createRes.status === 201, 'POST /admin/projects returns 201 Created');
    const createdProject = await createRes.json();
    assert(createdProject.data && createdProject.data.id !== undefined, 'Created project has valid data.id');
    testProjectId = createdProject.data.id;

    // Verify draft is not in public endpoint (zero-bleed)
    const pubCheck = await fetch(`${BASE_URL}/public/projects`);
    const pubProjects = await pubCheck.json();
    const leaked = pubProjects.data.some((p) => p.id === testProjectId);
    assert(!leaked, 'Draft project does NOT leak into public endpoint (Zero-bleed verified)');

    // Toggle status to PUBLISHED via PATCH
    const patchRes = await fetch(`${BASE_URL}/admin/projects/${testProjectId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: 'PUBLISHED' }),
    });
    assert(patchRes.status === 200, 'PATCH /admin/projects/:id returns 200');
    const patchedProject = await patchRes.json();
    assert(patchedProject.data.status === 'PUBLISHED', 'Project status toggled to PUBLISHED');

    // Update via PUT
    const putRes = await fetch(`${BASE_URL}/admin/projects/${testProjectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        ...patchedProject.data,
        tagline: 'Updated tagline for verification',
      }),
    });
    assert(putRes.status === 200, 'PUT /admin/projects/:id returns 200');

    // Clean up: DELETE
    const delRes = await fetch(`${BASE_URL}/admin/projects/${testProjectId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(delRes.status === 200, 'DELETE /admin/projects/:id returns 200');
  } catch (err) {
    assert(false, `Admin CRUD cycle failed: ${err.message}`);
  }

  // 6b. Admin Lab Gear CRUD Cycle
  let testGearId = '';
  try {
    const createGearRes = await fetch(`${BASE_URL}/admin/gear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: 'Digital Storage Oscilloscope 100MHz',
        model: 'Rigol DS1054Z',
        category: 'TESTING',
        specifications: '4 Channels, 100 MHz Bandwidth, 1 GSa/s real-time sample rate',
        status: 'OPERATIONAL',
        isPublished: true,
        priority: 99,
      }),
    });
    assert(createGearRes.status === 201, 'POST /admin/gear returns 201 Created');
    const createdGear = await createGearRes.json();
    assert(createdGear.data && createdGear.data.id !== undefined, 'Created gear has valid data.id');
    testGearId = createdGear.data.id;

    // Toggle gear status
    const toggleGearRes = await fetch(`${BASE_URL}/admin/gear/${testGearId}/toggle`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(toggleGearRes.status === 200, 'PATCH /admin/gear/:id/toggle returns 200');
    const toggledGear = await toggleGearRes.json();
    assert(toggledGear.data.isPublished === false, 'Gear isPublished toggled to false');

    // Clean up: Delete gear
    const delGearRes = await fetch(`${BASE_URL}/admin/gear/${testGearId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(delGearRes.status === 200, 'DELETE /admin/gear/:id returns 200');
  } catch (err) {
    assert(false, `Admin Gear CRUD cycle failed: ${err.message}`);
  }

  // 7. Honeypot Bot Trap
  try {
    const hpRes = await fetch(`${BASE_URL}/public/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Spam Bot 3000',
        email: 'spambot@spam.com',
        phone: '+1 555 123 4567',
        studentId: 'SPAM999',
        yearOfStudy: 1,
        branch: 'Computer Science',
        interest: 'AI_MACHINE_LEARNING',
        statementOfPurpose: 'Buy crypto now at http://spam.xyz',
        _traic_hp_trap: 'I am a bot filling hidden inputs',
      }),
    });
    assert(hpRes.status === 200, 'Honeypot trap catches bot and returns HTTP 200 without saving');
  } catch (err) {
    assert(false, `Honeypot check failed: ${err.message}`);
  }

  // 8. Input Validation
  try {
    const invalidRes = await fetch(`${BASE_URL}/public/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'A',
        email: 'invalid-email-address',
      }),
    });
    assert(invalidRes.status === 400, 'POST /public/applications with invalid payload returns 400');
    const errBody = await invalidRes.json();
    assert(errBody.error && errBody.error.code === 'VALIDATION_ERROR', 'Error envelope contains code: VALIDATION_ERROR');
    assert(typeof errBody.error.message === 'string', 'Error envelope contains error message');
    assert(errBody.error.details !== undefined, 'Error envelope contains field details map');
  } catch (err) {
    assert(false, `Validation check failed: ${err.message}`);
  }

  // 9. 404 Route Handling
  try {
    const notFoundRes = await fetch(`${BASE_URL}/api/non_existent_route_${Date.now()}`);
    assert(notFoundRes.status === 404, 'Unknown route returns 404');
    const nfBody = await notFoundRes.json();
    assert(nfBody.error && nfBody.error.code === 'NOT_FOUND', '404 envelope contains code: NOT_FOUND');
  } catch (err) {
    assert(false, `404 check failed: ${err.message}`);
  }

  // 10. Payload Size Limit (> 1MB)
  try {
    const hugePayload = 'X'.repeat(1.2 * 1024 * 1024);
    const bigRes = await fetch(`${BASE_URL}/public/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: hugePayload }),
    });
    assert(bigRes.status === 413, 'Payload exceeding 1MB returns HTTP 413 Payload Too Large');
    const bigBody = await bigRes.json();
    assert(bigBody.error && bigBody.error.code === 'PAYLOAD_TOO_LARGE', '413 envelope contains code: PAYLOAD_TOO_LARGE');
  } catch (err) {
    assert(false, `Payload size test failed: ${err.message}`);
  }

  // Report results
  results.forEach((r) => console.log(r));
  console.log(`\n========================================`);
  console.log(`Summary: ${passed} passed, ${failed} failed (${passed + failed} total)`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
