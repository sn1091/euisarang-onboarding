# 의사랑 EMR 신규 입사자 온보딩 프로그램

병원 EMR 시스템(의사랑)의 신규 직원을 위한 **인터랙티브 튜토리얼 기반** 온보딩 프로그램입니다.
실제 EMR 화면과 동일한 시뮬레이터에서 직접 클릭하며 학습할 수 있습니다.

---

## 문제 정의

기존 EMR 교육 방식의 한계:
- 텍스트 매뉴얼 중심 → 실무 적용 어려움
- 강사 의존적 집합 교육 → 시간·비용 비효율
- 반복 실습 불가 → 오조작 사고 위험

**이 프로그램의 해결책**: 실제 EMR 화면을 그대로 재현한 인터랙티브 시뮬레이터에서 단계별 가이드에 따라 직접 클릭하며 학습 → 언제든 반복 가능, 즉각적인 피드백 제공

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 📚 인터랙티브 튜토리얼 | 6개 업무 시나리오 단계별 클릭 학습 |
| 🖥️ EMR 시뮬레이터 | 실제 화면과 동일한 UI 재현 |
| 📝 학습 확인 퀴즈 | 8문제 객관식, 즉각 정오 피드백 |
| 🔍 FAQ 검색 | 키워드·카테고리 필터 검색 |
| 💾 진행률 저장 | localStorage 기반, 새로고침 후에도 유지 |

---

## 튜토리얼 목록

| 분류 | ID | 제목 | 단계 |
|------|-----|------|------|
| 진료실 | rx1 | 환자진료기록생성 | 6단계 |
| 진료실 | rx2 | AH200 교육기록 | 4단계 |
| 진료실 | rx3 | 비대면 비율 확인 | 3단계 |
| 접수실 | rec1 | 외래 접수 | 7단계 |
| 접수실 | rec2 | 수납 처리 | 4단계 |
| 보험청구 | cl1 | 청구 오류 점검 | 3단계 |

---

## 빠른 시작

외부 서버 불필요. 단일 HTML 파일로 동작합니다.

```bash
# 저장소 복제
git clone <repository-url>
cd 0313

# 브라우저에서 열기
open onboarding-program.html
# 또는 Windows
start onboarding-program.html
```

---

## 기술 스택

- **HTML5** — 단일 파일 구조 (`onboarding-program.html`)
- **CSS3** — CSS 변수, 반응형 그리드, 키프레임 애니메이션
- **Vanilla JavaScript** — 외부 라이브러리 없음
- **Pretendard 폰트** — CDN 로드
- **localStorage** — 진행률·프로필 영속성

---

## 프로젝트 구조

```
/
├── onboarding-program.html   # 메인 프로그램 (단일 파일)
├── PRD.md                    # 제품 요구사항 문서
├── ROADMAP.md                # 개발 로드맵
├── TEST-STRATEGY.md          # 테스트 전략
├── package.json              # 테스트 의존성 및 스크립트
├── playwright.config.js      # E2E 테스트 설정
├── tests/
│   ├── helpers/data.js       # 공유 데이터
│   ├── unit/                 # 단위 테스트 (Jest)
│   ├── integration/          # 통합 테스트 (Jest + jsdom)
│   └── e2e/                  # E2E 테스트 (Playwright)
└── CLAUDE.md                 # AI 개발 가이드
```

---

## 테스트 실행

```bash
# 의존성 설치
npm install

# 단위 + 통합 테스트
npm test

# 단위 테스트만
npm run test:unit

# 통합 테스트만
npm run test:integration

# E2E 테스트 (최초 1회 브라우저 설치 필요)
npx playwright install
npm run test:e2e
```

---

## 디자인 시스템

| 변수 | 색상 | 용도 |
|------|------|------|
| `--primary` | `#2563eb` | 주요 액션, 링크 |
| `--success` | `#10b981` | 완료, 정답 |
| `--danger` | `#ef4444` | 오류, 강조 |
| `--warning` | `#f59e0b` | 팁, 경고 |

반응형 브레이크포인트: 1024px (태블릿), 768px (모바일)

---

## 새 튜토리얼 추가 방법

1. `SCENARIOS` 객체에 데이터 추가
2. `SCENARIO_ORDER` 배열에 key 추가
3. `renderXxxScreen()` 렌더링 함수 작성
4. `showXxxStep(step)` 인터랙션 함수 작성
5. `loadScenario()` 조건문에 추가
6. 자세한 가이드: `CLAUDE.md` 참조

---

## 버전 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0.0 | 2026-03-13 | 최초 릴리즈 (rx1, rec1 인터랙티브) |
| 1.1.0 | 2026-03-16 | rx2, rx3, rec2, cl1 시뮬레이터 구현, localStorage 진행률 저장, 테스트 추가 |
