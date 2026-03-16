/**
 * @jest-environment jsdom
 */
// tests/integration/navigation.test.js
// 탭 전환 및 시나리오 네비게이션 통합 테스트

const { SCENARIOS, SCENARIO_ORDER } = require('../helpers/data');

// Tab state machine (mirrors switchTab logic)
const VALID_TABS = ['home', 'tutorial', 'quiz', 'faq'];

function createTabManager() {
  let activeTab = 'home';
  return {
    switchTab(tab) {
      if (!VALID_TABS.includes(tab)) return false;
      activeTab = tab;
      return true;
    },
    getActive() {
      return activeTab;
    }
  };
}

function createScenarioManager() {
  let current = null;
  return {
    load(key) {
      if (!SCENARIOS[key]) return false;
      current = key;
      return true;
    },
    getCurrent() {
      return current;
    },
    getIndex() {
      return current ? SCENARIO_ORDER.indexOf(current) : -1;
    }
  };
}

describe('Tab Navigation', () => {
  let tabs;
  beforeEach(() => { tabs = createTabManager(); });

  test('initial tab is home', () => {
    expect(tabs.getActive()).toBe('home');
  });

  test('switching to tutorial succeeds', () => {
    expect(tabs.switchTab('tutorial')).toBe(true);
    expect(tabs.getActive()).toBe('tutorial');
  });

  test('switching to quiz succeeds', () => {
    tabs.switchTab('quiz');
    expect(tabs.getActive()).toBe('quiz');
  });

  test('switching to faq succeeds', () => {
    tabs.switchTab('faq');
    expect(tabs.getActive()).toBe('faq');
  });

  test('switching back to home succeeds', () => {
    tabs.switchTab('tutorial');
    tabs.switchTab('home');
    expect(tabs.getActive()).toBe('home');
  });

  test('switching to invalid tab returns false', () => {
    expect(tabs.switchTab('invalid')).toBe(false);
    expect(tabs.getActive()).toBe('home'); // unchanged
  });
});

describe('Scenario Manager', () => {
  let manager;
  beforeEach(() => { manager = createScenarioManager(); });

  test('initial state has no current scenario', () => {
    expect(manager.getCurrent()).toBeNull();
  });

  test('loading rx1 sets current to rx1', () => {
    expect(manager.load('rx1')).toBe(true);
    expect(manager.getCurrent()).toBe('rx1');
  });

  test('loading invalid key returns false', () => {
    expect(manager.load('invalid')).toBe(false);
    expect(manager.getCurrent()).toBeNull();
  });

  test('getIndex returns correct position for each scenario', () => {
    SCENARIO_ORDER.forEach((key, expectedIdx) => {
      manager.load(key);
      expect(manager.getIndex()).toBe(expectedIdx);
    });
  });

  test('all 6 scenarios can be loaded', () => {
    SCENARIO_ORDER.forEach(key => {
      expect(manager.load(key)).toBe(true);
    });
  });
});

describe('Home → Tutorial Navigation Flow', () => {
  test('goToTutorial sets tab to tutorial and loads scenario', () => {
    const tabs = createTabManager();
    const scenarios = createScenarioManager();

    // Simulate goToTutorial('rx1')
    tabs.switchTab('tutorial');
    scenarios.load('rx1');

    expect(tabs.getActive()).toBe('tutorial');
    expect(scenarios.getCurrent()).toBe('rx1');
  });

  test('navigating through all scenarios in order', () => {
    const scenarios = createScenarioManager();
    for (let i = 0; i < SCENARIO_ORDER.length; i++) {
      scenarios.load(SCENARIO_ORDER[i]);
      expect(scenarios.getIndex()).toBe(i);
    }
  });
});
