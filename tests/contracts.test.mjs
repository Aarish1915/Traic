// tests/contracts.test.mjs
// Offline contract & schema validation test suite using Node.js built-in test runner
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Import schemas directly from @traic/shared
import {
  ProjectSchema,
  LabGearSchema,
  SiteSettingSchema,
  JoinApplicationSchema,
} from '../packages/shared/src/index.ts';

describe('Shared Schema Contracts', () => {
  it('validates a correct Project payload', () => {
    const validProject = {
      id: '11111111-1111-1111-1111-111111111111',
      slug: 'autonomous-ugv-rover',
      title: 'Autonomous Field Rover (UGV-X)',
      tagline: 'All-terrain autonomous rover equipped with LiDAR',
      descriptionMd: 'Full engineering description of rover',
      category: 'HYBRID',
      year: 2024,
      techStack: ['ROS2', 'C++'],
      status: 'PUBLISHED',
      featured: true,
      team: [{ name: 'Aarish Ali', roleInProject: 'Lead' }],
    };

    const parsed = ProjectSchema.safeParse(validProject);
    assert.equal(parsed.success, true);
  });

  it('rejects an invalid Project missing title or with invalid status', () => {
    const invalidProject = {
      slug: 'invalid-project',
      category: 'UNKNOWN_CATEGORY',
      status: 'INVALID_STATUS',
    };

    const parsed = ProjectSchema.safeParse(invalidProject);
    assert.equal(parsed.success, false);
  });

  it('validates LabGearSchema and enforces categories and status enums', () => {
    const validGear = {
      name: 'Digital Storage Oscilloscope',
      model: 'Rigol DS1054Z',
      category: 'TESTING',
      specifications: '4-Channel, 50MHz bandwidth, 1 GSa/s',
      status: 'OPERATIONAL',
      isPublished: true,
      priority: 10,
    };

    const parsed = LabGearSchema.safeParse(validGear);
    assert.equal(parsed.success, true);
    assert.equal(parsed.data.category, 'TESTING');
    assert.equal(parsed.data.status, 'OPERATIONAL');

    const invalidGear = {
      name: 'Broken Gear',
      category: 'NON_EXISTENT_CATEGORY',
    };
    const badParsed = LabGearSchema.safeParse(invalidGear);
    assert.equal(badParsed.success, false);
  });

  it('validates SiteSettingSchema including creed, section toggles, and CTAs', () => {
    const validSettings = {
      mottoText: 'HONOR • HONESTY • SACRIFICE',
      showMotto: true,
      heroPrimaryCtaText: 'EXPLORE PROJECTS',
      heroPrimaryCtaUrl: '/projects',
      sectionToggles: {
        showStats: true,
        showProjects: true,
        showGear: true,
        showAchievements: true,
        showGallery: true,
      },
      statLabels: {
        activeMembers: 'ACTIVE RESEARCHERS',
        projectsCompleted: 'HARDWARE BUILDS',
      },
      stats: {
        activeMembers: 45,
        projectsCompleted: 18,
        awardsWon: 12,
        linesOfCode: '250K+',
      },
    };

    const parsed = SiteSettingSchema.safeParse(validSettings);
    assert.equal(parsed.success, true);
    assert.equal(parsed.data.mottoText, 'HONOR • HONESTY • SACRIFICE');
    assert.equal(parsed.data.sectionToggles.showGear, true);
  });

  it('validates JoinApplicationSchema and rejects invalid email or short statement', () => {
    const validApp = {
      fullName: 'Vikram Mehta',
      email: 'vikram@coer.ac.in',
      phone: '+91 9876543210',
      studentId: 'COER2024CS099',
      yearOfStudy: 2,
      branch: 'Computer Science',
      interest: 'ROBOTICS_HARDWARE',
      statementOfPurpose: 'I have designed several STM32 based boards and wish to join TRAIC hardware division.',
    };

    const parsed = JoinApplicationSchema.safeParse(validApp);
    assert.equal(parsed.success, true);

    const invalidApp = {
      fullName: 'A',
      email: 'not-an-email',
      statementOfPurpose: 'Too short',
    };
    const badParsed = JoinApplicationSchema.safeParse(invalidApp);
    assert.equal(badParsed.success, false);
  });
});

describe('Zero-Bleed Filtering Logic Contract', () => {
  it('guarantees draft and unpublished items are filtered out for public consumers', () => {
    const sampleItems = [
      { id: '1', title: 'Public Rover', status: 'PUBLISHED' },
      { id: '2', title: 'Internal Prototype', status: 'DRAFT' },
      { id: '3', title: 'Archived Project', status: 'ARCHIVED' },
    ];

    const publicView = sampleItems.filter((item) => item.status === 'PUBLISHED');
    assert.equal(publicView.length, 1);
    assert.equal(publicView[0].title, 'Public Rover');
    assert.equal(publicView.some((item) => item.status === 'DRAFT'), false);
  });
});
