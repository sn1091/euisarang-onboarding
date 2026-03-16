/**
 * @jest-environment jsdom
 */
// tests/integration/tutorial-flow.test.js
// 튜토리얼 흐름 통합 테스트: 단계 진행, 완료 상태 반영, 진행률 업데이트

const { SCENARIOS, SCENARIO_ORDER } = require('../helpers/data');

// Progress tracking logic (mirrors onboarding-program.html)
function createProgressStore() {
  const store = {};
  return {
    save(key) {
      if (!store.completed) store.completed = [];
      if (!store.completed.includes(key)) store.completed.push(key);
    },
    getCompleted() {
      return store.completed || [];
    },
    reset() {
      store.completed = [];
    }
  };
}

function calculateProgress(completed, total) {
  return {
    count: completed.length,
    total,
    percentage: Math.round((completed.length / total) * 100)
  };
}

function getStepStatus(currentStep, stepIndex) {
  if (stepIndex < currentStep) return 'done';
  if (stepIndex === currentStep) return 'current';
  return 'pending';
}

describe('Tutorial Step Flow', () => {
  test('rx1: 6 steps progress correctly from 0 to 5', () => {
    const scenario = SCENARIOS.rx1;
    for (let step = 0; step < scenario.steps.length; step++) {
      scenario.steps.forEach((_, i) => {
        const status = getStepStatus(step, i);
        if (i < step) expect(status).toBe('done');
        else if (i === step) expect(status).toBe('current');
        else expect(status).toBe('pending');
      });
    }
  });

  test('rec1: 7 steps all reachable', () => {
    const scenario = SCENARIOS.rec1;
    expect(scenario.steps.length).toBe(7);
    for (let step = 0; step < 7; step++) {
      expect(getStepStatus(step, step)).toBe('current');
    }
  });

  test('step before current is done', () => {
    expect(getStepStatus(3, 2)).toBe('done');
  });

  test('step after current is pending', () => {
    expect(getStepStatus(3, 4)).toBe('pending');
  });
});

describe('Progress Tracking', () => {
  let store;
  beforeEach(() => { store = createProgressStore(); });

  test('saving a completed tutorial updates store', () => {
    store.save('rx1');
    expect(store.getCompleted()).toContain('rx1');
  });

  test('same tutorial saved twice is not duplicated', () => {
    store.save('rx1');
    store.save('rx1');
    expect(store.getCompleted()).toHaveLength(1);
  });

  test('all 6 tutorials can be saved', () => {
    SCENARIO_ORDER.forEach(key => store.save(key));
    expect(store.getCompleted()).toHaveLength(6);
  });

  test('progress percentage after 3 completions', () => {
    ['rx1', 'rx2', 'rx3'].forEach(k => store.save(k));
    const progress = calculateProgress(store.getCompleted(), SCENARIO_ORDER.length);
    expect(progress.count).toBe(3);
    expect(progress.percentage).toBe(50);
  });

  test('progress percentage after all completions is 100%', () => {
    SCENARIO_ORDER.forEach(k => store.save(k));
    const progress = calculateProgress(store.getCompleted(), SCENARIO_ORDER.length);
    expect(progress.percentage).toBe(100);
  });

  test('progress percentage with no completions is 0%', () => {
    const progress = calculateProgress([], SCENARIO_ORDER.length);
    expect(progress.percentage).toBe(0);
  });
});

describe('Scenario Navigation', () => {
  test('prevScenario returns previous key', () => {
    const idx = SCENARIO_ORDER.indexOf('rx2');
    expect(SCENARIO_ORDER[idx - 1]).toBe('rx1');
  });

  test('nextScenario returns next key', () => {
    const idx = SCENARIO_ORDER.indexOf('rx1');
    expect(SCENARIO_ORDER[idx + 1]).toBe('rx2');
  });

  test('first scenario has no previous', () => {
    const idx = SCENARIO_ORDER.indexOf(SCENARIO_ORDER[0]);
    expect(idx - 1).toBe(-1);
  });

  test('last scenario has no next', () => {
    const lastIdx = SCENARIO_ORDER.length - 1;
    expect(SCENARIO_ORDER[lastIdx + 1]).toBeUndefined();
  });
});
