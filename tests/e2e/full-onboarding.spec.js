// tests/e2e/full-onboarding.spec.js
// E2E 테스트: Playwright를 사용한 전체 온보딩 사용자 시나리오
const { test, expect } = require('@playwright/test');
const path = require('path');

const FILE_URL = `file://${path.resolve(__dirname, '../../onboarding-program.html')}`;

test.describe('홈 탭', () => {
  test('페이지 타이틀 확인', async ({ page }) => {
    await page.goto(FILE_URL);
    await expect(page).toHaveTitle(/의사랑 온보딩/);
  });

  test('홈 탭이 기본으로 활성화', async ({ page }) => {
    await page.goto(FILE_URL);
    const homeTab = page.locator('.tab[data-tab="home"]');
    await expect(homeTab).toHaveClass(/active/);
  });

  test('튜토리얼 카드 6개 표시', async ({ page }) => {
    await page.goto(FILE_URL);
    const cards = page.locator('.tutorial-card');
    await expect(cards).toHaveCount(6);
  });

  test('퀴즈 문제 수가 8문제로 표시', async ({ page }) => {
    await page.goto(FILE_URL);
    await expect(page.locator('.bottom-card-left p').first()).toContainText('8문제');
  });

  test('날짜가 현재 연도 포함', async ({ page }) => {
    await page.goto(FILE_URL);
    const year = new Date().getFullYear().toString();
    await expect(page.locator('#welcome-date')).toContainText(year);
  });
});

test.describe('탭 전환', () => {
  test('튜토리얼 탭으로 전환', async ({ page }) => {
    await page.goto(FILE_URL);
    await page.click('.tab[data-tab="tutorial"]');
    await expect(page.locator('#tab-tutorial')).toHaveClass(/active/);
  });

  test('퀴즈 탭으로 전환', async ({ page }) => {
    await page.goto(FILE_URL);
    await page.click('.tab[data-tab="quiz"]');
    await expect(page.locator('#tab-quiz')).toHaveClass(/active/);
  });

  test('FAQ 탭으로 전환', async ({ page }) => {
    await page.goto(FILE_URL);
    await page.click('.tab[data-tab="faq"]');
    await expect(page.locator('#tab-faq')).toHaveClass(/active/);
  });
});

test.describe('rx1 진료실 시뮬레이터 - 전체 6단계', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(FILE_URL);
    await page.click('.tab[data-tab="tutorial"]');
    await page.waitForSelector('#sim-body', { state: 'visible' });
  });

  test('step 0: 대기 환자 선택', async ({ page }) => {
    await expect(page.locator('#queue-row-1')).toBeVisible();
    await page.click('#queue-row-1');
    // step 1 시작 대기 (상병 입력 패널 하이라이트)
    await expect(page.locator('#panel-disease')).toBeVisible();
  });

  test('step 1→2: 상병 입력 후 처방 입력', async ({ page }) => {
    await page.click('#queue-row-1');
    await page.waitForTimeout(400);
    await page.click('#disease-input');
    await page.waitForTimeout(400);
    await expect(page.locator('#panel-prescription')).toBeVisible();
  });

  test('step 2→3: 처방 입력 후 계산 버튼', async ({ page }) => {
    await page.click('#queue-row-1');
    await page.waitForTimeout(400);
    await page.click('#disease-input');
    await page.waitForTimeout(400);
    await page.click('#prescription-input');
    await page.waitForTimeout(400);
    await expect(page.locator('#btn-calc')).toBeVisible();
  });

  test('step 3→4: 계산 후 본인부담금 팝업', async ({ page }) => {
    await page.click('#queue-row-1');
    await page.waitForTimeout(400);
    await page.click('#disease-input');
    await page.waitForTimeout(400);
    await page.click('#prescription-input');
    await page.waitForTimeout(400);
    await page.click('#btn-calc');
    await page.waitForTimeout(400);
    await expect(page.locator('#cost-popup')).toHaveClass(/show/);
  });

  test('full flow: 전체 6단계 완료', async ({ page }) => {
    await page.click('#queue-row-1');
    await page.waitForTimeout(400);
    await page.click('#disease-input');
    await page.waitForTimeout(400);
    await page.click('#prescription-input');
    await page.waitForTimeout(400);
    await page.click('#btn-calc');
    await page.waitForTimeout(400);
    await page.click('#cost-row-patient');
    await page.waitForTimeout(400);
    await page.click('#btn-cost-save');
    await page.waitForTimeout(400);
    // 완료 오버레이 확인
    await expect(page.locator('#sim-body')).toContainText('축하합니다');
  });
});

test.describe('퀴즈 전체 플로우', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(FILE_URL);
    await page.click('.tab[data-tab="quiz"]');
    await page.waitForSelector('#quiz-container', { state: 'visible' });
  });

  test('퀴즈 컨테이너 표시', async ({ page }) => {
    await expect(page.locator('#quiz-container')).toBeVisible();
  });

  test('퀴즈 질문 표시', async ({ page }) => {
    await expect(page.locator('.quiz-question')).toBeVisible();
  });

  test('옵션 선택 시 selected 클래스 추가', async ({ page }) => {
    await page.click('.quiz-option:first-child');
    await expect(page.locator('.quiz-option').first()).toHaveClass(/selected|correct|wrong/);
  });

  test('답 선택 후 다음 버튼 활성화', async ({ page }) => {
    await page.click('.quiz-option:first-child');
    await expect(page.locator('#next-btn')).not.toBeDisabled();
  });

  test('8문제 완료 후 결과 화면 표시', async ({ page }) => {
    for (let i = 0; i < 8; i++) {
      await page.click('.quiz-option:first-child');
      await page.waitForTimeout(100);
      const nextBtn = page.locator('#next-btn');
      if (await nextBtn.isVisible()) {
        await nextBtn.click();
        await page.waitForTimeout(100);
      }
    }
    await expect(page.locator('.quiz-score')).toBeVisible();
  });
});

test.describe('FAQ 검색 및 필터', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(FILE_URL);
    await page.click('.tab[data-tab="faq"]');
    await page.waitForSelector('#faq-list', { state: 'visible' });
  });

  test('FAQ 목록 표시', async ({ page }) => {
    await expect(page.locator('.faq-item').first()).toBeVisible();
  });

  test('AH200 검색 결과 표시', async ({ page }) => {
    await page.fill('#faq-search', 'AH200');
    await page.click('.faq-search-btn');
    const items = page.locator('.faq-item');
    await expect(items.first()).toBeVisible();
  });

  test('카테고리 필터: 진료실', async ({ page }) => {
    await page.click('.faq-cat-btn:nth-child(2)');
    const items = page.locator('.faq-item');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
  });

  test('FAQ 아코디언 펼치기', async ({ page }) => {
    await page.click('.faq-question:first-child');
    await expect(page.locator('.faq-item').first()).toHaveClass(/open/);
  });
});
