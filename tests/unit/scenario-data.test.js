// tests/unit/scenario-data.test.js
const { SCENARIOS, SCENARIO_ORDER } = require('../helpers/data');

describe('Scenario Data Integrity', () => {
  test('SCENARIO_ORDER has exactly 6 scenarios', () => {
    expect(SCENARIO_ORDER).toHaveLength(6);
  });

  test('SCENARIO_ORDER contains expected keys', () => {
    expect(SCENARIO_ORDER).toEqual(['rx1', 'rx2', 'rx3', 'rec1', 'rec2', 'cl1']);
  });

  test('every key in SCENARIO_ORDER exists in SCENARIOS', () => {
    SCENARIO_ORDER.forEach(key => {
      expect(SCENARIOS).toHaveProperty(key);
    });
  });

  test('each scenario has required fields', () => {
    SCENARIO_ORDER.forEach(key => {
      const sc = SCENARIOS[key];
      expect(sc).toHaveProperty('badge');
      expect(sc).toHaveProperty('title');
      expect(sc).toHaveProperty('desc');
      expect(sc).toHaveProperty('steps');
      expect(sc).toHaveProperty('tip');
      expect(Array.isArray(sc.steps)).toBe(true);
      expect(sc.steps.length).toBeGreaterThan(0);
    });
  });

  test('scenario badges are valid categories', () => {
    const validBadges = ['진료실', '접수실', '보험청구'];
    SCENARIO_ORDER.forEach(key => {
      expect(validBadges).toContain(SCENARIOS[key].badge);
    });
  });

  test('rx1 has 6 steps', () => {
    expect(SCENARIOS.rx1.steps).toHaveLength(6);
  });

  test('rx2 has 4 steps', () => {
    expect(SCENARIOS.rx2.steps).toHaveLength(4);
  });

  test('rx3 has 3 steps', () => {
    expect(SCENARIOS.rx3.steps).toHaveLength(3);
  });

  test('rec1 has 7 steps', () => {
    expect(SCENARIOS.rec1.steps).toHaveLength(7);
  });

  test('rec2 has 4 steps', () => {
    expect(SCENARIOS.rec2.steps).toHaveLength(4);
  });

  test('cl1 has 3 steps', () => {
    expect(SCENARIOS.cl1.steps).toHaveLength(3);
  });

  test('no duplicate scenario keys in SCENARIO_ORDER', () => {
    const unique = new Set(SCENARIO_ORDER);
    expect(unique.size).toBe(SCENARIO_ORDER.length);
  });

  test('진료실 scenarios grouped at start', () => {
    const clinicScenarios = SCENARIO_ORDER.filter(k => SCENARIOS[k].badge === '진료실');
    expect(clinicScenarios).toEqual(['rx1', 'rx2', 'rx3']);
  });
});
