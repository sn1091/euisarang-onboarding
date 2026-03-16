# .claude.md - AI 개발 가이드

## 📋 프로젝트 개요

### 프로젝트명
의사랑 EMR 신규 입사자 온보딩 프로그램

### 설명
병원 EMR 시스템(의사랑)의 신규 사용자를 위한 인터랙티브 튜토리얼 기반 온보딩 프로그램입니다. 사용자가 실제 EMR 화면과 동일한 시뮬레이터에서 직접 클릭하며 학습할 수 있습니다.

### 기술 스택
- HTML5 (단일 파일)
- CSS3 (반응형, CSS 변수)
- Vanilla JavaScript (외부 라이브러리 없음)
- Pretendard 폰트 (CDN)

---

## 📁 파일 구조

```
/
├── onboarding-program.html    # 메인 프로그램 (단일 HTML 파일)
├── PRD.md                     # 제품 요구사항 문서
├── ROADMAP.md                 # 개발 로드맵
└── .claude.md                 # AI 개발 가이드 (현재 파일)
```

---

## 🎨 디자인 시스템

### 색상 변수
```css
--bg: #f0f4f8           /* 배경색 */
--border: #e2e8f0       /* 테두리 */
--primary: #2563eb      /* 주요 색상 (파란색) */
--primary-dark: #1d4ed8 /* 주요 색상 어두운 */
--primary-light: #dbeafe /* 주요 색상 밝은 */
--text: #1e293b         /* 텍스트 */
--muted: #64748b        /* 보조 텍스트 */
--success: #10b981      /* 성공/완료 (초록색) */
--success-light: #d1fae5
--warning: #f59e0b      /* 경고/팁 (노란색) */
--danger: #ef4444       /* 오류/강조 (빨간색) */
--radius: 12px          /* 기본 border-radius */
```

### 카테고리 배지 색상
```css
.cat-clinic    /* 진료실: 파란색 배경 */
.cat-receipt   /* 접수실: 분홍색 배경 */
.cat-insurance /* 보험청구: 노란색 배경 */
```

### 반응형 브레이크포인트
```css
@media (max-width: 1024px) { /* 태블릿 */ }
@media (max-width: 768px)  { /* 모바일 */ }
```

---

## 🏗️ 아키텍처

### 탭 구조
```
홈 (tab-home)
├── 웰컴 배너
├── 정보 그리드 (프로필, 진행률, 공지사항)
├── 튜토리얼 그리드 (6개 카드)
└── 하단 카드 (퀴즈, 질문검색)

튜토리얼 (tab-tutorial)
├── 사이드바 (학습 목차)
└── 메인 영역
    ├── 시나리오 패널 (단계 목록)
    └── 시뮬레이터 패널 (EMR 화면)

퀴즈 (tab-quiz)
└── 퀴즈 컨테이너

질문검색 (tab-faq)
├── 검색 박스
├── 카테고리 필터
└── FAQ 목록
```

### 핵심 함수

#### 탭 전환
```javascript
switchTab(tabName)      // 탭 전환
goToTutorial(scenario)  // 홈에서 튜토리얼로 이동
```

#### 튜토리얼 관리
```javascript
loadScenario(key)       // 시나리오 로드 (rx1, rx2, rec1, etc.)
renderClinicScreen()    // 진료실 화면 렌더링
renderReceptionScreen() // 접수실 화면 렌더링
renderPlaceholder(sc)   // 플레이스홀더 화면
showClinicStep(step)    // 진료실 튜토리얼 단계 표시
showReceptionStep(step) // 접수실 튜토리얼 단계 표시
showComplete()          // 튜토리얼 완료 화면
```

#### UI 헬퍼
```javascript
addBadge(el, num)           // 단계 배지 추가
showCallout(el, text, dir)  // 말풍선 표시
removeCallout()             // 말풍선 제거
toggleModule(hd)            // 사이드바 아코디언 토글
```

#### 퀴즈
```javascript
initQuiz()          // 퀴즈 초기화
renderQuiz()        // 퀴즈 문제 렌더링
selectAnswer(idx)   // 답변 선택
nextQuestion()      // 다음 문제
renderQuizResult()  // 결과 화면
```

#### FAQ
```javascript
renderFAQ(data)           // FAQ 목록 렌더링
toggleFAQ(idx)            // FAQ 아코디언 토글
filterFAQ()               // 검색 필터
filterByCategory(cat,btn) // 카테고리 필터
```

---

## 📊 데이터 구조

### 시나리오 (SCENARIOS)
```javascript
const SCENARIOS = {
  rx1: {
    badge: '진료실',           // 카테고리 배지
    title: '환자진료기록생성',  // 튜토리얼 제목
    desc: '...',               // 설명
    steps: ['단계1', '단계2'], // 단계 목록
    tip: '...'                 // 팁 (HTML 지원)
  }
};

const SCENARIO_ORDER = ['rx1', 'rx2', 'rx3', 'rec1', 'rec2', 'cl1'];
```

### 퀴즈 (QUIZ_DATA)
```javascript
const QUIZ_DATA = [
  {
    q: '질문 텍스트',
    options: ['선택1', '선택2', '선택3', '선택4'],
    answer: 1  // 0부터 시작하는 정답 인덱스
  }
];
```

### FAQ (FAQ_DATA)
```javascript
const FAQ_DATA = [
  {
    category: '진료실',        // 카테고리
    question: '질문',
    answer: '답변 (HTML 지원)',
    highlight: '강조 메시지',  // 선택사항
    tags: ['태그1', '태그2']
  }
];
```

---

## 🎯 튜토리얼 개발 가이드

### 새 튜토리얼 추가 방법

#### 1. SCENARIOS에 데이터 추가
```javascript
newTut: {
  badge: '카테고리',
  title: '튜토리얼 제목',
  desc: '설명',
  steps: ['단계1', '단계2', '단계3'],
  tip: '팁 메시지'
}
```

#### 2. SCENARIO_ORDER에 추가
```javascript
const SCENARIO_ORDER = [..., 'newTut'];
```

#### 3. 렌더링 함수 작성
```javascript
function renderNewTutScreen() {
  document.getElementById('sim-body').innerHTML = `
    <!-- EMR 화면 HTML -->
  `;
  setTimeout(() => showNewTutStep(0), 300);
}
```

#### 4. 단계별 인터랙션 함수 작성
```javascript
function showNewTutStep(step) {
  // 공통 초기화
  tutStep = step;
  removeCallout();
  document.querySelectorAll('.hl').forEach(el => el.classList.remove('hl'));
  // ... 단계별 로직
}
```

#### 5. loadScenario에 조건 추가
```javascript
if(key === 'newTut') renderNewTutScreen();
```

### 인터랙티브 요소 패턴

#### 클릭 대기 (행 선택)
```javascript
const row = document.getElementById('row-id');
row.classList.add('hl');
addBadge(row, stepNum);
showCallout(row, '안내 메시지', 'bottom');
row.style.cursor = 'pointer';
row.onclick = () => {
  row.classList.remove('hl');
  // 다음 단계로
  setTimeout(() => showStep(nextStep), 300);
};
```

#### 입력 필드 클릭
```javascript
const input = document.getElementById('input-id');
input.onclick = () => {
  // 데이터 자동 입력
  // 다음 단계로
};
```

#### 버튼 클릭
```javascript
const btn = document.getElementById('btn-id');
btn.classList.add('hl');
addBadge(btn, stepNum);
showCallout(btn, '안내 메시지', 'top');
btn.onclick = () => {
  btn.classList.remove('hl');
  // 액션 수행
};
```

#### 빨간 박스 강조
```javascript
element.classList.add('red-box');
// 클릭 후 제거
element.classList.remove('red-box');
```

---

## 🐛 알려진 이슈 및 주의사항

### 1. 이벤트 핸들러 정리
각 단계 전환 시 이전 이벤트 핸들러를 정리해야 합니다.
```javascript
function clearClinicEvents() {
  ['el1', 'el2', 'el3'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.onclick = null;
  });
}
```

### 2. 말풍선 위치 계산
말풍선은 sim-body 기준으로 위치가 계산됩니다.
```javascript
const bodyRect = body.getBoundingClientRect();
const targetRect = targetEl.getBoundingClientRect();
let left = targetRect.left - bodyRect.left;
```

### 3. 팝업 사이즈
팝업 크기가 변하면 애니메이션 효과가 어색할 수 있습니다.
고정 width 사용을 권장합니다.
```css
.emr-popup { width: 280px; }
```

---

## 📝 코딩 컨벤션

### HTML
- 단일 파일 구조 유지
- 인라인 스타일은 동적 요소에만 사용
- ID는 기능별 prefix 사용 (panel-, btn-, inp-)

### CSS
- CSS 변수 활용
- 클래스명은 kebab-case
- EMR 스타일은 emr- prefix

### JavaScript
- 전역 변수 최소화
- 함수명은 camelCase
- 이벤트 핸들러는 반드시 정리

---

## 🔄 업데이트 체크리스트

새 기능 추가 시:
- [ ] SCENARIOS 데이터 추가
- [ ] 렌더링 함수 작성
- [ ] 단계별 인터랙션 함수 작성
- [ ] loadScenario 조건 추가
- [ ] 이벤트 정리 함수 업데이트
- [ ] 홈 탭 튜토리얼 카드 추가
- [ ] 사이드바 메뉴 추가
- [ ] PRD 문서 업데이트
- [ ] ROADMAP 문서 업데이트

---

## 📞 문의

프로젝트 관련 문의사항은 개발팀에 연락해주세요.
