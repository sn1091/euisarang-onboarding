// tests/unit/quiz.test.js
const { QUIZ_DATA } = require('../helpers/data');

// Quiz logic functions (mirrors onboarding-program.html)
function checkAnswer(questionIndex, selectedIndex) {
  if (questionIndex < 0 || questionIndex >= QUIZ_DATA.length) return null;
  return selectedIndex === QUIZ_DATA[questionIndex].answer;
}

function calculateScore(answers) {
  if (!Array.isArray(answers) || answers.length !== QUIZ_DATA.length) return null;
  return answers.reduce((score, answer, i) => score + (answer === QUIZ_DATA[i].answer ? 1 : 0), 0);
}

function calculatePercentage(score, total) {
  if (total === 0) return 0;
  return Math.round((score / total) * 100);
}

function getResultMessage(percentage) {
  if (percentage >= 80) return '훌륭합니다!';
  if (percentage >= 60) return '잘했어요!';
  return '다시 도전!';
}

function getResultEmoji(percentage) {
  if (percentage >= 80) return '🎉';
  if (percentage >= 60) return '👍';
  return '💪';
}

describe('Quiz Data Integrity', () => {
  test('QUIZ_DATA should have exactly 8 questions', () => {
    expect(QUIZ_DATA).toHaveLength(8);
  });

  test('each question has required fields (q, options, answer)', () => {
    QUIZ_DATA.forEach((q, i) => {
      expect(q).toHaveProperty('q');
      expect(q).toHaveProperty('options');
      expect(q).toHaveProperty('answer');
      expect(typeof q.q).toBe('string');
      expect(Array.isArray(q.options)).toBe(true);
      expect(typeof q.answer).toBe('number');
    });
  });

  test('each question has exactly 4 options', () => {
    QUIZ_DATA.forEach(q => {
      expect(q.options).toHaveLength(4);
    });
  });

  test('answer index is valid (0–3)', () => {
    QUIZ_DATA.forEach(q => {
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThanOrEqual(3);
    });
  });
});

describe('Answer Checking', () => {
  test('returns true for correct answer on every question', () => {
    QUIZ_DATA.forEach((q, i) => {
      expect(checkAnswer(i, q.answer)).toBe(true);
    });
  });

  test('returns false for wrong answer', () => {
    const wrongIndex = QUIZ_DATA[0].answer === 0 ? 1 : 0;
    expect(checkAnswer(0, wrongIndex)).toBe(false);
  });

  test('returns null for out-of-range question index', () => {
    expect(checkAnswer(-1, 0)).toBeNull();
    expect(checkAnswer(QUIZ_DATA.length, 0)).toBeNull();
  });
});

describe('Score Calculation', () => {
  test('all correct answers returns full score', () => {
    const allCorrect = QUIZ_DATA.map(q => q.answer);
    expect(calculateScore(allCorrect)).toBe(QUIZ_DATA.length);
  });

  test('all wrong answers returns 0', () => {
    const allWrong = QUIZ_DATA.map(q => (q.answer + 1) % 4);
    expect(calculateScore(allWrong)).toBe(0);
  });

  test('returns null for invalid input (null or wrong length)', () => {
    expect(calculateScore(null)).toBeNull();
    expect(calculateScore([1, 2])).toBeNull();
  });
});

describe('Percentage & Result Messages', () => {
  test('100% score on 8 questions', () => {
    expect(calculatePercentage(8, 8)).toBe(100);
  });

  test('0% score', () => {
    expect(calculatePercentage(0, 8)).toBe(0);
  });

  test('division by zero returns 0', () => {
    expect(calculatePercentage(0, 0)).toBe(0);
  });

  test('rounding: 5/8 = 63%', () => {
    expect(calculatePercentage(5, 8)).toBe(63);
  });

  test('result message thresholds', () => {
    expect(getResultMessage(100)).toBe('훌륭합니다!');
    expect(getResultMessage(80)).toBe('훌륭합니다!');
    expect(getResultMessage(79)).toBe('잘했어요!');
    expect(getResultMessage(60)).toBe('잘했어요!');
    expect(getResultMessage(59)).toBe('다시 도전!');
    expect(getResultMessage(0)).toBe('다시 도전!');
  });

  test('result emoji thresholds', () => {
    expect(getResultEmoji(80)).toBe('🎉');
    expect(getResultEmoji(60)).toBe('👍');
    expect(getResultEmoji(59)).toBe('💪');
  });
});
