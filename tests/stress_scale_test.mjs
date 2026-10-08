/**
 * TRAIC Scale & Real-World Stress Test Suite
 * Tests 1,000+ student applications, flexible event/hackathon configurations,
 * pagination latency, bulk status operations, and search performance.
 */

const API_BASE = 'http://localhost:4000';

async function runScaleTests() {
  console.log('='.repeat(70));
  console.log('  TRAIC REAL-WORLD STRESS & LARGE-SCALE TEST SUITE (1,000+ Records)');
  console.log('='.repeat(70));

  let passedTests = 0;
  let failedTests = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passedTests++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failedTests++;
    }
  }

  // 1. Authenticate Admin
  console.log('\n[Phase 1] Admin Authentication & Session Establishment...');
  const loginRes = await fetch(`${API_BASE}/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: process.env.ADMIN_PASSWORD || 'traic_admin_2025!' }),
  });
  
  const loginData = await loginRes.json();
  const cookieHeader = loginRes.headers.get('set-cookie');
  const authHeaders = {
    ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    ...(loginData.token ? { Authorization: `Bearer ${loginData.token}` } : {}),
  };
  assert(loginRes.ok && (Boolean(loginData.token) || Boolean(cookieHeader)), 'Admin login successfully established session');

  // 2. Test Flexible Event & Hackathon Creation
  console.log('\n[Phase 2] Testing Flexible Hackathon / Event Management...');
  const hackathonSlug = `annual-hackathon-${Date.now()}`;
  const testHackathon = {
    title: 'TRAIC National Hardware Hackathon 2026',
    slug: hackathonSlug,
    tagline: '36-hour physical robotics sprint with real silicon and fabrication tools',
    descriptionMd: '# Autonomous Systems Sprint\n\nTeams build physical prototypes...',
    type: 'Hackathon',
    mode: 'OFFLINE',
    venue: 'DIA Labs, Block C Maker Space',
    startsAt: new Date(Date.now() + 86400000 * 14).toISOString(),
    endsAt: new Date(Date.now() + 86400000 * 16).toISOString(),
    registerUrl: 'https://traic.coer.ac.in/register/hackathon',
    status: 'PUBLISHED',
    // Flexible fields
    prizePool: '₹2,50,000 Cash + Dev Boards',
    teamSize: '2-4 Engineers',
    capacity: 200,
    tracks: [
      'Autonomous Mobile Robotics',
      'Edge Neural Accelerators',
      'High-Speed PCB Design',
      'Assistive Bio-Mechatronics',
    ],
    schedule: [
      { time: '09:00 AM', title: 'Hardware Kit Handover', description: 'STM32 & IMU sensors distributed' },
      { time: '02:00 PM', title: 'Firmware Loop Checkpoint', description: 'Oscilloscope and CAN validation' },
      { time: '08:00 PM', title: 'Final Demonstration', description: 'Obstacle track live run' },
    ],
    customDetails: {
      'Equipment Access': 'Soldering stations, 3D printers, spectrum analyzer stations provided',
      'Eligibility': 'Open to all engineering undergrads nationwide',
    },
  };

  const createEventRes = await fetch(`${API_BASE}/admin/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders },
    body: JSON.stringify(testHackathon),
  });
  const createEventData = await createEventRes.json();
  assert(createEventRes.ok, 'Admin successfully created event with flexible details');
  assert(createEventData.data?.prizePool === testHackathon.prizePool, 'Prize pool preserved');
  assert(Array.isArray(createEventData.data?.tracks) && createEventData.data.tracks.length === 4, '4 tracks preserved');
  assert(createEventData.data?.schedule?.length === 3, '3 timeline milestones preserved');

  // Verify public retrieval of the flexible event
  const pubEventRes = await fetch(`${API_BASE}/public/events/${hackathonSlug}`);
  const pubEventData = await pubEventRes.json();
  assert(pubEventRes.ok, 'Public API retrieved created flexible event');
  assert(pubEventData.data?.tracks?.includes('High-Speed PCB Design'), 'Public event includes specialized tracks');

  // 3. Ingest 1,000 Student Applications (Scale Stress Test)
  console.log('\n[Phase 3] Generating & Ingesting 1,000 Student Applications...');
  const domains = [
    'ROBOTICS_HARDWARE',
    'EMBEDDED_IOT',
    'AI_MACHINE_LEARNING',
    'FULL_STACK_DEV',
    'DESIGN_3D',
  ];
  const branches = [
    'Computer Science & Engineering',
    'Electronics & Communication Engineering',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Information Technology',
  ];
  const sampleSkills = [
    'ROS2', 'C++', 'Python', 'PyTorch', 'FreeRTOS', 'Altium', 'CAN-FD',
    'SolidWorks', 'Linux', 'Microcontrollers', 'Computer Vision', 'React', 'Docker'
  ];

  const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Ananya', 'Diya', 'Saanvi', 'Aadhya', 'Pari', 'Anushka', 'Khushi', 'Navya', 'Pooja', 'Tanvi'];
  const lastNames = ['Sharma', 'Verma', 'Krishnan', 'Iyer', 'Patel', 'Reddy', 'Singh', 'Choudhary', 'Joshi', 'Gupta', 'Mehta', 'Nair', 'Bhat', 'Rao', 'Das'];

  const bulkApplications = [];
  for (let i = 1; i <= 1000; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
    const domain = domains[i % domains.length];
    const branch = branches[i % branches.length];
    const year = (i % 4) + 1;
    const studentId = `202${6 - year}${branch.slice(0, 3).toUpperCase()}${String(i).padStart(4, '0')}`;

    // Select 2-4 random skills
    const candidateSkills = [
      sampleSkills[(i * 3) % sampleSkills.length],
      sampleSkills[(i * 7) % sampleSkills.length],
      sampleSkills[(i * 11) % sampleSkills.length],
    ];

    bulkApplications.push({
      fullName: `${fn} ${ln} #${i}`,
      email: `candidate.${i}@student.coer.ac.in`,
      phone: `+91 ${9000000000 + i}`,
      studentId,
      yearOfStudy: year,
      branch,
      interest: domain,
      githubOrPortfolio: `https://github.com/candidate-${i}`,
      statementOfPurpose: `I am passionate about ${domain.toLowerCase().replace(/_/g, ' ')}. In my year ${year} studies in ${branch}, I have built projects using ${candidateSkills.join(', ')}. I want to join TRAIC to collaborate on production-grade systems.`,
      skills: candidateSkills,
      status: i % 10 === 0 ? 'SHORTLISTED' : i % 25 === 0 ? 'ACCEPTED' : i % 50 === 0 ? 'REJECTED' : 'PENDING',
    });
  }

  // Test single public student submission
  console.log('  Testing single student form submission via public intake API...');
  const singleStudent = {
    fullName: 'Aarav Singhal',
    email: `student.test.${Date.now()}@coer.ac.in`,
    phone: '+91 98765 01234',
    studentId: '2025ECE099',
    yearOfStudy: 1,
    branch: 'Electronics & Communication Engineering',
    interest: 'ROBOTICS_HARDWARE',
    githubOrPortfolio: 'https://github.com/aarav-singhal',
    statementOfPurpose: 'Excited to join TRAIC robotics team and build autonomous rover mobility units.',
    skills: ['C++', 'ROS2', 'KiCAD'],
  };

  const pubSubRes = await fetch(`${API_BASE}/public/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(singleStudent),
  });
  const pubSubData = await pubSubRes.json();
  assert(pubSubRes.ok, 'Public student application successfully submitted and validated');

  // Ingest full 1,000 candidates via authenticated admin bulk import
  console.log('  Ingesting 1,000 student applications via Admin Bulk Intake API...');
  const startIngest = performance.now();
  const bulkIngestRes = await fetch(`${API_BASE}/admin/applications/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders },
    body: JSON.stringify({ applications: bulkApplications }),
  });
  const bulkIngestData = await bulkIngestRes.json();
  const ingestDuration = Math.round(performance.now() - startIngest);
  assert(bulkIngestRes.ok, `Admin bulk imported 1,000 candidates in ${ingestDuration}ms`);
  assert(bulkIngestData.count === 1000, 'Bulk intake returned exactly 1,000 records added');

  // 4. Measure Query Latency Across 1,000+ Records
  console.log('\n[Phase 4] Benchmarking Query Latency Across 1,000+ Records...');

  // Test A: Unpaginated fetch of all 1,000 applications
  const t0 = performance.now();
  const allRes = await fetch(`${API_BASE}/admin/applications`, {
    headers: { ...authHeaders },
  });
  const tAll = performance.now() - t0;
  const allData = await allRes.json();
  assert(allRes.ok, `GET /admin/applications returned 200 OK (${allData.data?.length} records)`);
  assert(allData.data?.length >= 1000, 'Database contains 1,000+ active student applications');
  assert(tAll < 150, `Unpaginated 1,000-record fetch completed in ${tAll.toFixed(2)}ms (< 150ms budget)`);
  assert(allData.stats?.total >= 1000, `Live stats computed total: ${allData.stats?.total}`);

  // Test B: Windowed Pagination (Page 1, 50 rows)
  const t1 = performance.now();
  const pageRes = await fetch(`${API_BASE}/admin/applications?page=1&limit=50`, {
    headers: { ...authHeaders },
  });
  const tPage = performance.now() - t1;
  const pageData = await pageRes.json();
  assert(pageRes.ok, `GET /admin/applications?page=1&limit=50 returned 200 OK`);
  assert(pageData.data?.length === 50, 'Page size strictly bounded to 50 records');
  assert(pageData.pagination?.totalPages >= 20, `Total pages correctly calculated: ${pageData.pagination?.totalPages}`);
  assert(tPage < 30, `Windowed 50-row query completed in ${tPage.toFixed(2)}ms (< 30ms budget)`);

  // Test C: Filter by Status & Domain
  const t2 = performance.now();
  const filterRes = await fetch(
    `${API_BASE}/admin/applications?status=SHORTLISTED&domain=ROBOTICS_HARDWARE`,
    { headers: { ...authHeaders } }
  );
  const tFilter = performance.now() - t2;
  const filterData = await filterRes.json();
  assert(filterRes.ok, 'Filtered query by status & domain returned 200 OK');
  const allMatch = filterData.data?.every(
    (a) => a.interest === 'ROBOTICS_HARDWARE' && a.status === 'SHORTLISTED'
  );
  assert(allMatch, 'All filtered results strictly conform to criteria');
  assert(tFilter < 50, `Criteria filtering completed in ${tFilter.toFixed(2)}ms (< 50ms budget)`);

  // Test D: Full-text Search across 1,000 records
  const t3 = performance.now();
  const searchRes = await fetch(`${API_BASE}/admin/applications?search=Altium`, {
    headers: { ...authHeaders },
  });
  const tSearch = performance.now() - t3;
  const searchData = await searchRes.json();
  assert(searchRes.ok, 'Full-text search query returned 200 OK');
  assert(searchData.data?.length > 0, `Search found ${searchData.data?.length} candidates with 'Altium' skill`);
  assert(tSearch < 50, `Search across 1,000 records completed in ${tSearch.toFixed(2)}ms (< 50ms budget)`);

  // 5. Test Bulk Status Updates
  console.log('\n[Phase 5] Testing Bulk Candidate Operations (100 candidates batch)...');
  const candidatesToShortlist = allData.data.slice(0, 100).map((a) => a.id);
  const bulkRes = await fetch(`${API_BASE}/admin/applications/bulk-status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders },
    body: JSON.stringify({
      ids: candidatesToShortlist,
      status: 'SHORTLISTED',
    }),
  });
  const bulkData = await bulkRes.json();
  assert(bulkRes.ok, 'PATCH /admin/applications/bulk-status returned 200 OK');
  assert(bulkData.count === 100, `Successfully updated exactly 100 applications in one atomic batch`);

  // Verify updated state
  const verifyRes = await fetch(`${API_BASE}/admin/applications?status=SHORTLISTED`, {
    headers: { ...authHeaders },
  });
  const verifyData = await verifyRes.json();
  assert(verifyData.data?.length >= 100, 'Batch shortlisted candidates verified in subsequent query');

  // 6. Test Review Notes & Inspector Mutation
  console.log('\n[Phase 6] Testing Candidate Review Notes Mutation...');
  const testCandidate = allData.data[0];
  const noteContent = 'Interview conducted on test bench. Demonstrated proficient FreeRTOS task scheduling. Recommended for Rover firmware lead.';
  const notesRes = await fetch(`${API_BASE}/admin/applications/${testCandidate.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders },
    body: JSON.stringify({ reviewNotes: noteContent }),
  });
  const notesData = await notesRes.json();
  assert(notesRes.ok, 'PATCH candidate reviewNotes returned 200 OK');
  assert(notesData.data?.reviewNotes === noteContent, 'Review notes verified persisted on candidate profile');

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log(`  SCALE & STRESS AUDIT COMPLETE: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log('='.repeat(70));

  if (failedTests > 0) {
    process.exit(1);
  }
}

runScaleTests().catch((err) => {
  console.error('Fatal stress test failure:', err);
  process.exit(1);
});
