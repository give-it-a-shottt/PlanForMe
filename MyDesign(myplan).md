# My Design System — Style Reference (PlanForMe Edition)

> 은은한 그린 앰비언트 라이트 배경 위에 투명하게 빛나는 글래스모피즘(Glassmorphism) 표면, 단단한 타이포그래피, 포인트 컬러(`#4CAF50`)는 꼭 필요한 곳에만.

**Theme:** Light Glassmorphism

폰트 스타일 / 컬러 & 글래스 표면 / 폰트 계층(여백) / 레이아웃 여백 / 라운드 / 브레이크포인트 6가지를 정의한 기본 문서입니다.[cite: 1] Neutral 컬러와 글래스모피즘 토큰, 그리고 브랜드 Accent 컬러(`#4CAF50`)가 확정 반영되었습니다.

## 1. 폰트 스타일

### Font Family · `--font-sans`[cite: 1]

- **기본:** Pretendard[cite: 1]
- **폴백:** `'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, 'Segoe UI', Roboto, 'Noto Sans KR', sans-serif`[cite: 1]

### Text Styles (Figma 기준 · 확정)[cite: 1]

폰트는 **Pretendard**이고, 굵기는 **Regular / Medium / SemiBold** 3가지만 정의되어 있습니다.[cite: 1] 스타일 이름은 `{KR|EN}/{카테고리}/{굵기}/{크기}` 형식입니다 (예: `KR/Title/SemiBold/20`).[cite: 1]

| 카테고리 | 크기 (px)              | 행간 | 굵기                        |
| -------- | ---------------------- | ---- | --------------------------- |
| Display  | 56 · 48 · 40 · 36 · 32 | 130% | Regular · Medium · SemiBold |
| Display  | 28                     | 140% | Regular · Medium · SemiBold |
| Headline | 32                     | 130% | Regular · Medium · SemiBold |
| Headline | 28 · 24 · 20 · 18 · 16 | 140% | Regular · Medium · SemiBold |
| Title    | 24 · 20 · 18 · 16      | 140% | Regular · Medium · SemiBold |
| Body     | 15 · 14 · 13 · 12      | 145% | Regular · Medium · SemiBold |
| Caption  | 13 · 12 · 11           | 145% | Regular · Medium · SemiBold |

**자간(Letter spacing)**: KR(한글) 스타일은 **-2.5%**, EN(영문) 스타일은 **0%**.[cite: 1] CSS에서는 한글 `-0.025em`, 영문 `0`으로 적용합니다.[cite: 1]

**행간 규칙** (위 표에서 도출): 크기 **32px 이상 → 130%**, **16~28px → 140%**, **15px 이하 → 145%**.[cite: 1]

> Figma에는 `KR/Display/Redular/56`처럼 **"Redular"(오타)** 로 된 스타일 이름이 있습니다.[cite: 1] 이 문서에서는 모두 `Regular`로 표기하며, Figma 쪽 이름도 수정하는 것을 권장합니다.[cite: 1]

### Font Weight[cite: 1]

| 이름     | 값  | 토큰                     | 용도               |
| -------- | --- | ------------------------ | ------------------ |
| Regular  | 400 | `--font-weight-regular`  | 설명 텍스트, 본문  |
| Medium   | 500 | `--font-weight-medium`   | 라벨               |
| SemiBold | 600 | `--font-weight-semibold` | 제목, 라벨 강조(D) |

### 텍스트 역할[cite: 1]

| 역할               | 기본 굵기    | 설명                             |
| ------------------ | ------------ | -------------------------------- |
| 라벨 (Label)       | Medium 500   | 카테고리, 태그, 보조 식별 텍스트 |
| 제목 (Title)       | SemiBold 600 | 카드/섹션의 핵심 문구            |
| 설명 (Description) | Regular 400  | 제목을 보충하는 본문             |

---

## 2. 컬러 & 글래스모피즘 (Glassmorphism)

### Neutral (Figma 컬러 스타일 기준 · 확정)[cite: 1]

용도 기준으로 **text / icon / line / bg** 4그룹으로 나뉩니다.[cite: 1]

**text**[cite: 1]

| 토큰              | 값        | Figma       | 용도                            |
| ----------------- | --------- | ----------- | ------------------------------- |
| `--text-main`     | `#111111` | gray/111111 | 제목, 라벨, 금액 등 기본 텍스트 |
| `--text-sub`      | `#505050` | gray/505050 | 설명 텍스트                     |
| `--text-sub-weak` | `#767676` | gray/767676 | 날짜, 메타 등 보조 정보         |
| `--text-disabled` | `#999999` | gray/999999 | 비활성 텍스트, placeholder      |

**icon**[cite: 1]

| 토큰              | 값        | Figma        | 용도                          |
| ----------------- | --------- | ------------ | ----------------------------- |
| `--icon-main`     | `#2A2A37` | slate/2A2A37 | 기본 아이콘                   |
| `--icon-inverse`  | `#FFFFFF` | gray/FFFFFF  | 어두운/Primary 배경 위 아이콘 |
| `--icon-sub`      | `#545461` | slate/545461 | 보조 아이콘                   |
| `--icon-sub-weak` | `#81818D` | slate/81818D | 더 약한 보조 아이콘           |
| `--icon-disabled` | `#A5A5AF` | slate/A5A5AF | 비활성 아이콘                 |

**line**[cite: 1]

| 토큰             | 값        | Figma        | 용도                            |
| ---------------- | --------- | ------------ | ------------------------------- |
| `--line-light`   | `#F1F1F5` | slate/F1F1F5 | 약한 구분선                     |
| `--line-regular` | `#E5E5EC` | slate/E5E5EC | 기본 구분선, 일반 입력창 테두리 |
| `--line-black`   | `#111111` | gray/111111  | 강조 테두리                     |

**bg (베이스 배경)**[cite: 1]

| 토큰           | 값        | Figma        | 용도                                                   |
| -------------- | --------- | ------------ | ------------------------------------------------------ |
| `--bg-default` | `#FFFFFF` | gray/FFFFFF  | 순백색 기본 배경 (Primary 버튼 위 텍스트 흰색도 이 값) |
| `--bg-light`   | `#F4F7F4` | green-tint   | 글래스 효과가 잘 보이도록 살짝 톤다운된 베이스 배경    |
| `--bg-regular` | `#F1F1F5` | slate/F1F1F5 | 일반 입력창·비활성 채움, 눌림(pressed) 상태            |

### Accent (Brand Color · `#4CAF50` 확정)

| 이름          | 값                        | 토큰                    | 역할                                         |
| ------------- | ------------------------- | ----------------------- | -------------------------------------------- |
| Primary       | `#4CAF50`                 | `--color-primary`       | 메인 CTA 버튼, 활성 탭, 달성 프로그레스 바   |
| Primary Hover | `#43A047`                 | `--color-primary-hover` | 버튼 호버/눌림(Pressed) 상태                 |
| Primary Soft  | `#E8F5E9`                 | `--color-primary-soft`  | 솔리드 포인트 태그, 뱃지 배경                |
| Primary Glass | `rgba(76, 175, 80, 0.14)` | `--color-primary-glass` | 글래스 칩, 선택된 카테고리 카드, 반투명 강조 |
| Primary Glow  | `rgba(76, 175, 80, 0.28)` | `--color-primary-glow`  | Primary 버튼 그림자 및 배경 빛 번짐 포인트   |

### Glassmorphism Surface (글래스 표면 토큰)

라이트 모드 글래스모피즘의 핵심은 **배경의 은은한 그린 빛 번짐(Mesh Gradient)**을 투과시키는 **반투명 화이트 표면 + 배경 블러 + 1px 화이트 하이라이트 보더**입니다.

| 이름                | 값                                       | 토큰                   | 역할                                                |
| ------------------- | ---------------------------------------- | ---------------------- | --------------------------------------------------- |
| Glass Canvas (배경) | `radial-gradient(...)` _(하단 CSS 참고)_ | `--bg-glass-canvas`    | 전체 화면 배경 (글래스 질감을 살려주는 은은한 배경) |
| Glass BG Default    | `rgba(255, 255, 255, 0.68)`              | `--glass-bg`           | 기본 글래스 카드, 바텀시트, 헤더 표면               |
| Glass BG Elevated   | `rgba(255, 255, 255, 0.84)`              | `--glass-bg-elevated`  | 모달, 드롭다운, 입력 포커스 등 더 선명한 상위 표면  |
| Glass BG Sub        | `rgba(255, 255, 255, 0.45)`              | `--glass-bg-sub`       | 비활성 카드, 보조 구획, 유리 입력창 기본 채움       |
| Glass Border        | `rgba(255, 255, 255, 0.80)`              | `--glass-border`       | 유리 모서리 빛 반사 테두리 (`1px solid`)            |
| Glass Border Green  | `rgba(76, 175, 80, 0.40)`                | `--glass-border-green` | 선택된 플랜 카드, 활성 입력창의 그린 유리 테두리    |
| Glass Shadow        | `0 8px 32px 0 rgba(17, 24, 39, 0.05)`    | `--glass-shadow`       | 글래스 카드의 부드러운 부유감(Elevation) 그림자     |
| Glass Blur          | `blur(16px) saturate(180%)`              | `--glass-blur`         | 기본 `backdrop-filter` 값 (Figma: Background Blur)  |

### 컬러 & 글래스 규칙

- **전체 화면 바닥**은 `--bg-glass-canvas`(그린 틴트가 살짝 섞인 메쉬 그라데이션) 또는 `--bg-light`를 사용하여 유리 카드가 허공에 떠 있는 입체감을 만든다.
- **카드와 패널**은 솔리드 흰색 대신 `--glass-bg` + `backdrop-filter: var(--glass-blur)` + `1px solid var(--glass-border)` 조합을 기본으로 쓴다.
- **가독성 보장**: 반투명 유리 위에서도 글자가 선명하게 읽히도록 제목·라벨은 반드시 `--text-main`(`#111111`), 설명은 `--text-sub`(`#505050`)을 유지한다.[cite: 1]
- **Primary(`#4CAF50`)**는 주요 CTA 버튼, 달성률 바, 체크박스, 활성 아이콘 등 핵심 행동 유도 요소에만 쓰고, 넓은 배경 면적에는 `--color-primary-glass`로 투명하게 깐다.

---

## 3. 폰트 계층 & 여백[cite: 1]

각 스케일은 **6단계**이며, 값은 모두 px입니다.[cite: 1]
**여백 표기 `a / b`** = 라벨↔제목 간격 / 제목↔설명 간격으로 정의합니다.[cite: 1]

### A. 기본 (Default)[cite: 1]

| 단계 | 라벨 (M) | 제목 (SB) | 설명 (R) | 여백   |
| ---- | -------- | --------- | -------- | ------ |
| 1    | 13       | 16        | 14       | 4 / 8  |
| 2    | 14       | 18        | 14       | 4 / 8  |
| 3    | 14       | 20        | 14       | 4 / 8  |
| 4    | 14       | 24        | 15       | 4 / 12 |
| 5    | 15       | 28        | 16       | 4 / 12 |
| 6    | 16       | 32        | 16       | 4 / 12 |

### B. 컴팩트 (Compact) — 작은 카드, 리스트용[cite: 1]

| 단계 | 라벨 (M) | 제목 (SB) | 설명 (R) | 여백  |
| ---- | -------- | --------- | -------- | ----- |
| 1    | 11       | 14        | 12       | 4 / 6 |
| 2    | 12       | 16        | 12       | 4 / 6 |
| 3    | 12       | 18        | 13       | 4 / 8 |
| 4    | 13       | 20        | 13       | 4 / 8 |
| 5    | 13       | 20        | 14       | 4 / 8 |
| 6    | 14       | 24        | 14       | 4 / 8 |

### C. 확장 (Expanded) — 웹 배너, 히어로 영역용[cite: 1]

| 단계 | 라벨 (M) | 제목 (SB) | 설명 (R) | 여백    |
| ---- | -------- | --------- | -------- | ------- |
| 1    | 14       | 24        | 16       | 8 / 12  |
| 2    | 14       | 28        | 16       | 8 / 12  |
| 3    | 16       | 32        | 18       | 8 / 16  |
| 4    | 16       | 40        | 18       | 8 / 16  |
| 5    | 18       | 48        | 20       | 12 / 20 |
| 6    | 18       | 56        | 20       | 12 / 20 |

### D. 강조 (Emphasis) — 굵기만 다른 버전[cite: 1]

A와 **크기·여백·제목 굵기가 동일**하고 라벨 굵기만 올린 버전.[cite: 1] 프로모션, 일일 할당량 계산 결과 프리뷰처럼 강조가 더 필요한 화면에 사용.

| 역할 | A 굵기       | D 굵기                  |
| ---- | ------------ | ----------------------- |
| 라벨 | Medium 500   | SemiBold 600            |
| 제목 | SemiBold 600 | SemiBold 600 (A와 동일) |
| 설명 | Regular 400  | Regular 400 (유지)      |

### 스케일 선택 가이드[cite: 1]

| 상황                           | 스케일                     |
| ------------------------------ | -------------------------- |
| 일반 화면, 기본 글래스 카드    | A                          |
| 작은 카드, 할 일 리스트 아이템 | B                          |
| 웹 배너, 히어로                | C                          |
| 할당량 프리뷰 등 강조 필요     | D (A 크기 + 라벨 SemiBold) |

### Do[cite: 1]

- 한 화면(한 컴포넌트) 안에서는 **스케일을 섞지 않고 하나만** 쓴다.[cite: 1]
- 같은 컴포넌트 안에서는 라벨·제목·설명을 **같은 단계 번호**로 맞춘다.[cite: 1]
- 텍스트 간 여백은 스케일 표의 값만 사용한다 (4 / 6 / 8 / 12 / 16 / 20).[cite: 1] 컴팩트의 `6`은 **텍스트 간격 전용 예외**이며, 레이아웃 여백은 4배수 규칙(4장)을 따른다.[cite: 1]

### Don't[cite: 1]

- 표에 없는 폰트 크기를 임의로 쓰지 않는다.[cite: 1]
- 설명 텍스트를 Medium 이상으로 굵게 만들지 않는다 (D에서도 Regular 유지).[cite: 1]
- 라벨과 제목 크기 순서를 뒤집지 않는다 (제목은 항상 라벨보다 크다).[cite: 1]

---

## 4. 레이아웃 여백[cite: 1]

### 기본 단위[cite: 1]

레이아웃에 쓰는 모든 값(마진, 패딩, 간격, 크기)은 **4의 배수**를 사용합니다. (0, 4, 8, 12, 16, 20, 24, 28, 32 … 104)[cite: 1]

> **예외**: 라벨·제목·설명 사이의 텍스트 간격은 3장 스케일 표를 따르며, 컴팩트의 `6px`처럼 4배수가 아닌 값을 허용합니다.[cite: 1]

### 화면 좌우 마진[cite: 1]

모바일 기준 화면 너비는 **390px**입니다 (360에서도 깨지지 않게 확인).[cite: 1] 아래 마진은 모바일 기준이며, 태블릿·PC 마진은 6장 브레이크포인트를 따릅니다.[cite: 1]

| 마진 | 토큰               | 비고                  |
| ---- | ------------------ | --------------------- |
| 16   | `--page-margin-sm` | 정보 밀도가 높은 화면 |
| 20   | `--page-margin-md` | **기본값**            |
| 24   | `--page-margin-lg` | 여유 있는 화면        |

### 레이아웃 타입 (글래스모피즘 최적화)

글래스모피즘 테마에서는 **Card UI 그룹(전체/개별)**을 주력으로 사용할 때 시각적 매력이 가장 극대화됩니다.

| 타입                   | 구분 방식                                  | 섹션 상단 → 타이틀 | 타이틀 → 콘텐츠 | 콘텐츠 → 다음 섹션             | 배경                                        |
| ---------------------- | ------------------------------------------ | ------------------ | --------------- | ------------------------------ | ------------------------------------------- |
| Full UI 단 끊는 타입   | **12px 반투명 구분 띠** (`--glass-bg-sub`) | 24 (띠 아래)       | 16              | 32 (띠 위)                     | `--bg-glass-canvas`                         |
| Full UI 여백 활용 타입 | 여백만 사용 (띠 없음)                      | 32 (배너 아래)     | 16              | 48                             | `--bg-glass-canvas`                         |
| **Card UI 전체 그룹**  | 섹션 전체를 **글래스 카드 1개**로 묶음     | 24 (카드 안)       | 16              | 32 (카드 안 하단) + 카드 간 16 | 화면 `--bg-glass-canvas`, 카드 `--glass-bg` |
| **Card UI 개별 그룹**  | 콘텐츠마다 **개별 글래스 카드**            | 40 (섹션 간)       | 16              | 40                             | 화면 `--bg-glass-canvas`, 카드 `--glass-bg` |

- 글래스 카드 구분은 `--glass-border`(`1px solid rgba(255,255,255,0.8)`)와 `--glass-shadow`를 함께 적용해 유리판의 두께감을 표현합니다.
- 카드가 중첩될 때(예: 글래스 카드 안의 작은 아이템 박스)는 안쪽 요소에 `backdrop-filter`를 중복 적용하지 않고(성능 저하 방지), `--glass-bg-sub` 또는 `--color-primary-glass` 배경색만 입힙니다.

### 여백 밀도[cite: 1]

| 항목                           | 촘촘 | 기본 | 여유 | 매우 여유 |
| ------------------------------ | ---- | ---- | ---- | --------- |
| 타이틀 → 콘텐츠                | 16   | 20   | 24   | —         |
| 페이지 상단 (헤더 → 첫 타이틀) | 24   | 32   | 40   | —         |
| 섹션 / 블록 간격               | 32   | 40   | 48   | 60        |

### Do[cite: 1]

- 한 화면에서는 **레이아웃 타입을 하나만** 쓴다.[cite: 1]
- 좌우 마진은 한 화면 안에서 통일한다.[cite: 1]

### Don't[cite: 1]

- 4배수가 아닌 값을 레이아웃 여백에 쓰지 않는다 (텍스트 간격 예외 제외).[cite: 1]
- 한 화면에 `backdrop-filter: blur()`가 적용된 레이어를 3겹 이상 겹치지 않는다 (모바일 렌더링 프레임 드랍 방지).

---

## 5. 라운드[cite: 1]

### 카드 안 썸네일/내부 박스 라운드[cite: 1]

글래스 카드 안에 들어가는 썸네일이나 내부 입력 박스의 라운드는 **카드 라운드 −2 또는 −4**로 잡습니다.[cite: 1]

| 카드 라운드 | 내부 요소 라운드 | 판정 |
| ----------- | ---------------- | ---- |
| 16          | 12 ~ 14          | O    |
| 16          | 16               | X    |
| 16          | 20               | X    |

> 내부 라운드 14는 4배수 예외로 허용합니다 (−2 규칙).[cite: 1]

### 카드 텍스트 마진[cite: 1]

| 썸네일 배치        | 썸네일 안쪽 여백 | 텍스트 패딩  |
| ------------------ | ---------------- | ------------ |
| 꽉 참 (Full bleed) | 0                | 12 ~ 24 자유 |
| 안쪽 배치 (Inset)  | 4 ~ 16           | 20           |
| 안쪽 배치 (Inset)  | 20               | 24           |

### 카드 없는 썸네일 라운드[cite: 1]

| 썸네일 라운드 | 텍스트 들여쓰기 |
| ------------- | --------------- |
| 0 · 4 · 8     | 0               |
| 12            | 2               |
| 16            | 4               |
| 20 이상       | 6 (고정)        |

---

## 6. 브레이크포인트 (Breakpoints)[cite: 1]

화면 너비에 따라 레이아웃이 바뀌는 기준점입니다.[cite: 1] CSS는 **모바일 퍼스트**(`min-width`)로 작성합니다.[cite: 1]

### 피그마 시안 대지 (최우선 3개)[cite: 1]

| 대지   | 너비     | 용도                                                |
| ------ | -------- | --------------------------------------------------- |
| PC     | **1440** | 데스크톱 메인 기준. 시안 1순위                      |
| 태블릿 | **768**  | 모바일 ↔ PC 레이아웃 전환점 (아이패드 세로)         |
| 모바일 | **390**  | 모바일 메인 기준. **360**에서도 안 깨지는지 꼭 확인 |

### 코드 기준점[cite: 1]

| 토큰  | 최소 너비 | 대표 화면                 | 레이아웃 변화                                     |
| ----- | --------- | ------------------------- | ------------------------------------------------- |
| —     | 0         | 일반 스마트폰 (360 ~ 440) | 1단, 하단 글래스 탭바                             |
| `sm`  | 640       | 폴더블 펼침, 폰 가로 모드 | 글래스 카드 2단 가능                              |
| `md`  | 768       | 태블릿 세로 ★ 핵심 분기점 | 하단 탭바 → 좌측/상단 글래스 네비게이션, 카드 2단 |
| `lg`  | 1024      | 태블릿 가로, 소형 노트북  | 카드 3단                                          |
| `xl`  | 1280      | 13인치 노트북             | **PC 레이아웃 최소 너비**, 대시보드 다단 그리드   |
| `2xl` | 1440      | 데스크톱 메인             | 콘텐츠 너비 고정, 남는 공간은 좌우 여백           |

### 구간별 레이아웃[cite: 1]

| 구간        | 좌우 마진 | 컬럼 | 거터 | 콘텐츠 너비                |
| ----------- | --------- | ---- | ---- | -------------------------- |
| 0 ~ 639     | 20 (기본) | 4    | 16   | 화면 − 40                  |
| 640 ~ 767   | 24        | 4    | 16   | 화면 − 48                  |
| 768 ~ 1023  | 32        | 8    | 24   | 화면 − 64                  |
| 1024 ~ 1279 | 40        | 12   | 24   | 화면 − 80                  |
| 1280 ~      | 40 (최소) | 12   | 24   | **최대 1200, 가운데 정렬** |

---

## Quick Start (CSS Variables & Glass Utilities)

```css
:root {
  /* 1. 폰트 */
  --font-sans:
    "Pretendard", -apple-system, BlinkMacSystemFont, system-ui, "Segoe UI",
    Roboto, "Noto Sans KR", sans-serif;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --ls: -0.025em; /* 한글 -2.5% (Figma) */

  /* 2. 컬러 — Neutral */
  --text-main: #111111;
  --text-sub: #505050;
  --text-sub-weak: #767676;
  --text-disabled: #999999;

  --icon-main: #2a2a37;
  --icon-inverse: #ffffff;
  --icon-sub: #545461;
  --icon-sub-weak: #81818d;
  --icon-disabled: #a5a5af;

  --line-light: #f1f1f5;
  --line-regular: #e5e5ec;
  --line-black: #111111;

  --bg-default: #ffffff;
  --bg-light: #f4f7f4;
  --bg-regular: #f1f1f5;

  /* 2. 컬러 — Brand Accent (#4CAF50) */
  --color-primary: #4caf50;
  --color-primary-hover: #43a047;
  --color-primary-soft: #e8f5e9;
  --color-primary-glass: rgba(76, 175, 80, 0.14);
  --color-primary-glow: rgba(76, 175, 80, 0.28);

  /* 2. 글래스모피즘 (Glassmorphism Tokens) */
  --bg-glass-canvas:
    radial-gradient(at 15% 15%, rgba(76, 175, 80, 0.12) 0px, transparent 50%),
    radial-gradient(at 85% 80%, rgba(76, 175, 80, 0.08) 0px, transparent 50%),
    #f4f7f4;
  --glass-bg: rgba(255, 255, 255, 0.68);
  --glass-bg-elevated: rgba(255, 255, 255, 0.84);
  --glass-bg-sub: rgba(255, 255, 255, 0.45);
  --glass-border: rgba(255, 255, 255, 0.8);
  --glass-border-green: rgba(76, 175, 80, 0.4);
  --glass-shadow: 0 8px 32px 0 rgba(17, 24, 39, 0.05);
  --glass-blur: blur(16px) saturate(180%);

  /* 3. 기본 굵기 (A/B/C) */
  --label-weight: var(--font-weight-medium);
  --title-weight: var(--font-weight-semibold);
  --desc-weight: var(--font-weight-regular);

  /* 4. 레이아웃 (4배수) */
  --page-margin-sm: 16px;
  --page-margin-md: 20px; /* 기본 */
  --page-margin-lg: 24px;
  --section-divider: 12px;
  --title-to-content: 16px;
  --page-top: 32px;
  --section-gap: 40px;
  --card-gap: 16px;

  /* 5. 라운드 */
  --radius-card: 16px;
  --radius-thumb-in-card: 12px;
}

/* 베이스 바디 배경 (글래스 효과 극대화) */
body {
  background: var(--bg-glass-canvas);
  background-attachment: fixed;
  color: var(--text-main);
  font-family: var(--font-sans);
}

/* 글래스모피즘 공통 유틸리티 클래스 */
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  border-radius: var(--radius-card);
}

.glass-card-active {
  background: var(--glass-bg-elevated);
  border: 1px solid var(--glass-border-green);
  box-shadow: 0 8px 24px 0 var(--color-primary-glow);
}

.btn-primary-glass {
  background: var(--color-primary);
  color: var(--bg-default);
  border-radius: var(--radius-thumb-in-card);
  box-shadow: 0 4px 16px 0 var(--color-primary-glow);
  transition:
    background-color 0.2s ease,
    transform 0.1s ease;
}
.btn-primary-glass:hover {
  background: var(--color-primary-hover);
}

/* 영문 텍스트는 자간 0 */
[lang="en"] {
  --ls: 0;
}

/* D. 강조: 굵기만 교체 */
[data-emphasis] {
  --label-weight: var(--font-weight-semibold);
}

/* A. 기본 (기본값) — 단계는 data-step="1~6"로 선택 */
[data-scale="default"][data-step="1"] {
  --label: 13px;
  --title: 16px;
  --desc: 14px;
  --label-lh: 1.45;
  --title-lh: 1.4;
  --desc-lh: 1.45;
  --gap-1: 4px;
  --gap-2: 8px;
}
[data-scale="default"][data-step="2"] {
  --label: 14px;
  --title: 18px;
  --desc: 14px;
  --label-lh: 1.45;
  --title-lh: 1.4;
  --desc-lh: 1.45;
  --gap-1: 4px;
  --gap-2: 8px;
}
[data-scale="default"][data-step="3"] {
  --label: 14px;
  --title: 20px;
  --desc: 14px;
  --label-lh: 1.45;
  --title-lh: 1.4;
  --desc-lh: 1.45;
  --gap-1: 4px;
  --gap-2: 8px;
}
[data-scale="default"][data-step="4"] {
  --label: 14px;
  --title: 24px;
  --desc: 15px;
  --label-lh: 1.45;
  --title-lh: 1.4;
  --desc-lh: 1.45;
  --gap-1: 4px;
  --gap-2: 12px;
}
[data-scale="default"][data-step="5"] {
  --label: 15px;
  --title: 28px;
  --desc: 16px;
  --label-lh: 1.45;
  --title-lh: 1.4;
  --desc-lh: 1.4;
  --gap-1: 4px;
  --gap-2: 12px;
}
[data-scale="default"][data-step="6"] {
  --label: 16px;
  --title: 32px;
  --desc: 16px;
  --label-lh: 1.4;
  --title-lh: 1.3;
  --desc-lh: 1.4;
  --gap-1: 4px;
  --gap-2: 12px;
}

/* B. 컴팩트 */
[data-scale="compact"][data-step="1"] {
  --label: 11px;
  --title: 14px;
  --desc: 12px;
  --label-lh: 1.45;
  --title-lh: 1.45;
  --desc-lh: 1.45;
  --gap-1: 4px;
  --gap-2: 6px;
}
[data-scale="compact"][data-step="2"] {
  --label: 12px;
  --title: 16px;
  --desc: 12px;
  --label-lh: 1.45;
  --title-lh: 1.4;
  --desc-lh: 1.45;
  --gap-1: 4px;
  --gap-2: 6px;
}
[data-scale="compact"][data-step="3"] {
  --label: 12px;
  --title: 18px;
  --desc: 13px;
  --label-lh: 1.45;
  --title-lh: 1.4;
  --desc-lh: 1.45;
  --gap-1: 4px;
  --gap-2: 8px;
}
[data-scale="compact"][data-step="4"] {
  --label: 13px;
  --title: 20px;
  --desc: 13px;
  --label-lh: 1.45;
  --title-lh: 1.4;
  --desc-lh: 1.45;
  --gap-1: 4px;
  --gap-2: 8px;
}
[data-scale="compact"][data-step="5"] {
  --label: 13px;
  --title: 20px;
  --desc: 14px;
  --label-lh: 1.45;
  --title-lh: 1.4;
  --desc-lh: 1.45;
  --gap-1: 4px;
  --gap-2: 8px;
}
[data-scale="compact"][data-step="6"] {
  --label: 14px;
  --title: 24px;
  --desc: 14px;
  --label-lh: 1.45;
  --title-lh: 1.4;
  --desc-lh: 1.45;
  --gap-1: 4px;
  --gap-2: 8px;
}

/* C. 확장 */
[data-scale="expanded"][data-step="1"] {
  --label: 14px;
  --title: 24px;
  --desc: 16px;
  --label-lh: 1.45;
  --title-lh: 1.4;
  --desc-lh: 1.4;
  --gap-1: 8px;
  --gap-2: 12px;
}
[data-scale="expanded"][data-step="2"] {
  --label: 14px;
  --title: 28px;
  --desc: 16px;
  --label-lh: 1.45;
  --title-lh: 1.4;
  --desc-lh: 1.4;
  --gap-1: 8px;
  --gap-2: 12px;
}
[data-scale="expanded"][data-step="3"] {
  --label: 16px;
  --title: 32px;
  --desc: 18px;
  --label-lh: 1.4;
  --title-lh: 1.3;
  --desc-lh: 1.4;
  --gap-1: 8px;
  --gap-2: 16px;
}
[data-scale="expanded"][data-step="4"] {
  --label: 16px;
  --title: 40px;
  --desc: 18px;
  --label-lh: 1.4;
  --title-lh: 1.3;
  --desc-lh: 1.4;
  --gap-1: 8px;
  --gap-2: 16px;
}
[data-scale="expanded"][data-step="5"] {
  --label: 18px;
  --title: 48px;
  --desc: 20px;
  --label-lh: 1.4;
  --title-lh: 1.3;
  --desc-lh: 1.4;
  --gap-1: 12px;
  --gap-2: 20px;
}
[data-scale="expanded"][data-step="6"] {
  --label: 18px;
  --title: 56px;
  --desc: 20px;
  --label-lh: 1.4;
  --title-lh: 1.3;
  --desc-lh: 1.4;
  --gap-1: 12px;
  --gap-2: 20px;
}

.label {
  font: var(--label-weight) var(--label)/var(--label-lh) var(--font-sans);
  letter-spacing: var(--ls);
  color: var(--text-main);
  margin-bottom: var(--gap-1);
}
.title {
  font: var(--title-weight) var(--title)/var(--title-lh) var(--font-sans);
  letter-spacing: var(--ls);
  color: var(--text-main);
  margin-bottom: var(--gap-2);
}
.desc {
  font: var(--desc-weight) var(--desc)/var(--desc-lh) var(--font-sans);
  letter-spacing: var(--ls);
  color: var(--text-sub);
}

/* 6. 브레이크포인트 */
:root {
  --container-pad: 20px;
  --container-max: 1200px;
}
@media (min-width: 640px) {
  :root {
    --container-pad: 24px;
  }
}
@media (min-width: 768px) {
  :root {
    --container-pad: 32px;
  }
}
@media (min-width: 1024px) {
  :root {
    --container-pad: 40px;
  }
}

.container {
  box-sizing: content-box;
  max-width: var(--container-max);
  margin-inline: auto;
  padding-inline: var(--container-pad);
}
```
