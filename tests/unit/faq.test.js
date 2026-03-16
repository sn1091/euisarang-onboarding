// tests/unit/faq.test.js
const { FAQ_DATA } = require('../helpers/data');

// FAQ filter logic (mirrors onboarding-program.html)
function filterFAQ(data, query, category) {
  let filtered = data;
  if (category && category !== 'all') {
    filtered = filtered.filter(f => f.category === category);
  }
  if (query && query.trim()) {
    const q = query.toLowerCase();
    filtered = filtered.filter(f =>
      f.question.toLowerCase().includes(q) ||
      f.answer.toLowerCase().includes(q)
    );
  }
  return filtered;
}

describe('FAQ Data Integrity', () => {
  test('FAQ_DATA has at least 6 entries', () => {
    expect(FAQ_DATA.length).toBeGreaterThanOrEqual(6);
  });

  test('each FAQ item has required fields', () => {
    FAQ_DATA.forEach(item => {
      expect(item).toHaveProperty('category');
      expect(item).toHaveProperty('question');
      expect(item).toHaveProperty('answer');
      expect(item).toHaveProperty('tags');
      expect(Array.isArray(item.tags)).toBe(true);
    });
  });

  test('categories are one of: 진료실, 접수실, 보험청구', () => {
    const validCategories = ['진료실', '접수실', '보험청구'];
    FAQ_DATA.forEach(item => {
      expect(validCategories).toContain(item.category);
    });
  });

  test('covers all three categories', () => {
    const categories = new Set(FAQ_DATA.map(f => f.category));
    expect(categories.has('진료실')).toBe(true);
    expect(categories.has('접수실')).toBe(true);
    expect(categories.has('보험청구')).toBe(true);
  });
});

describe('FAQ Filtering by Category', () => {
  test('no filter returns all items', () => {
    const result = filterFAQ(FAQ_DATA, '', 'all');
    expect(result).toHaveLength(FAQ_DATA.length);
  });

  test('filtering by 진료실 returns only clinic items', () => {
    const result = filterFAQ(FAQ_DATA, '', '진료실');
    expect(result.length).toBeGreaterThan(0);
    result.forEach(item => expect(item.category).toBe('진료실'));
  });

  test('filtering by 접수실 returns only reception items', () => {
    const result = filterFAQ(FAQ_DATA, '', '접수실');
    expect(result.length).toBeGreaterThan(0);
    result.forEach(item => expect(item.category).toBe('접수실'));
  });

  test('filtering by 보험청구 returns only insurance items', () => {
    const result = filterFAQ(FAQ_DATA, '', '보험청구');
    expect(result.length).toBeGreaterThan(0);
    result.forEach(item => expect(item.category).toBe('보험청구'));
  });
});

describe('FAQ Search', () => {
  test('searching "AH200" returns relevant items', () => {
    const result = filterFAQ(FAQ_DATA, 'AH200', 'all');
    expect(result.length).toBeGreaterThan(0);
  });

  test('search is case-insensitive', () => {
    const lower = filterFAQ(FAQ_DATA, 'ah200', 'all');
    const upper = filterFAQ(FAQ_DATA, 'AH200', 'all');
    expect(lower.length).toBe(upper.length);
  });

  test('searching with no match returns empty array', () => {
    const result = filterFAQ(FAQ_DATA, '존재하지않는검색어xyz123', 'all');
    expect(result).toHaveLength(0);
  });

  test('empty query returns all items', () => {
    const result = filterFAQ(FAQ_DATA, '', 'all');
    expect(result).toHaveLength(FAQ_DATA.length);
  });

  test('combined category + search filter works', () => {
    const result = filterFAQ(FAQ_DATA, 'AH200', '진료실');
    result.forEach(item => expect(item.category).toBe('진료실'));
  });
});
