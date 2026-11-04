# My Design System — Style Reference (PlanForMe Edition)

> 깔끔한 단색 배경 위에 단단한 타이포그래피, 브랜드 초록(`#4CAF50`)은 사용자가 꼭 봐야 하는 곳에만.

**Theme:** Light (기본) · Dark
**기준:** My Design System v1 (`C:\Design\My_DesignSystem_v1.md`, Figma `My Design System`) — 이 문서는 PlanForMe에 맞게 고른 값만 옮긴 프로젝트 문서입니다. 여기에 없는 규칙(컴포넌트 상세 스펙 · 모션 · 접근성)은 원본 문서를 따릅니다.
**피그마:** PlanForMe › `Design_System` 페이지(토큰 문서 + Components) · `Design` 페이지(화면). 값이 다르면 피그마가 정답이고 이 문서를 고칩니다.
**코드:** `web/src/app/globals.css` — 피그마 변수와 같은 이름 · 같은 값 (피그마 변수의 Code syntax = CSS 변수 이름).

### 이전(글래스모피즘) 버전에서 바뀐 점

| 항목 | 이전 | 지금 |
| --- | --- | --- |
| 배경 | 초록 radial-gradient 앰비언트 + `backdrop-filter` 블러 | **단색 `bg/light`** (블러 · 앰비언트 없음) |
| 카드 표면 | 흰색 68% 반투명 + 흰 테두리 + 블러 | **`bg/default` + Shadow/1** (Dark는 배경 층 + 테두리) |
| Neutral | slate 계열 (#505050 · #2A2A37 · #F1F1F5 …) | **순수 gray 11단계** (#424242 · #212121 · #F5F5F5 …) |
| 브랜드 | `#4CAF50` 하나 (버튼 글자 대비 2.8:1) | **Green 50 ~ 900 스케일** — 버튼은 600 `#2E8532` (흰 글자 4.65:1) |
| 그림자 | 초록 글로우(Primary/Glow) · 글래스 그림자 | **Shadow/1 ~ 4 + Dock** — 브랜드 색 섞지 않음 |
| 선택 표시 | 초록 반투명 칩 · 초록 요일 원 | **검정 Filled(`bg/inverse`)** — 브랜드 색 아끼기 |
| 카테고리 아이콘 | 초록 아이콘 + 초록 반투명 박스 | **`icon/sub` + `bg/regular`** (선택된 옵션만 초록) |
| 다크모드 | `.dark` 클래스 | **`<html data-theme="dark">`** (피그마 Color 컬렉션 Dark 모드) |
| 라운드 | inner 12 · card 16 · sheet 24 | **Radius Default 모드** — button · input 8 · card 16 · sheet 20 |

---

## 1. 컬러

### 1-1. Primitives — 컴포넌트에서 직접 쓰지 않음 (피그마 `Primitives` 컬렉션)

**Brand 02 · Green** — 원본 `#4CAF50`. 차분한 성취감 · 꾸준함.

| 단계 | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | dark-soft |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| HEX | `#F1F8F1` | `#E2F2E3` | `#C5E5C7` | `#A0D4A3` | `#74C078` | `#4CAF50` | `#2E8532` | `#28762C` | `#1E6123` | `#144718` | `#1F2D20` |
| 흰 글자 대비 | 1.1 | 1.2 | 1.4 | 1.7 | 2.2 | 2.8 | **4.65** | 5.5 | 7.5 | 10.8 | — |

- 500이 원본 브랜드 색 → 아이콘 · 일러스트 포인트(`primary/accent`)에만. **흰 글자를 올리는 면은 600부터.**
- Gray는 원본 문서 1-1과 같음: `gray/50 #FAFAFA` … `gray/950 #111111`, `base/white` · `base/black`.

### 1-2. Semantic — 피그마 `Color` 컬렉션 (Light · Dark)

| 토큰 | Light | Dark | 코드 |
| --- | --- | --- | --- |
| text/main · sub · sub-weak · disabled | gray/950 · 800 · 600 · 500 | `#F2F2F5` · `#BDBDC7` · `#9A9AA6` · `#666670` | `text-text-main` … |
| text/inverse · on-primary | white · white | `#111111` · white | `text-text-inverse` · `text-text-on-primary` |
| icon/main · sub · sub-weak · disabled · inverse | gray/900 · 700 · 600 · 400 · white | `#E6E6EC` · `#ADADB8` · `#8A8A96` · `#5C5C66` · `#111111` | `text-icon-*` |
| line/light · regular · strong · black | gray/200 · 300 · 400 · 950 | `#232329` · `#30303A` · `#5C5C66` · `#F2F2F5` | `border-line-*` |
| bg/default · light · regular | white · gray/50 · gray/100 | `#18181D` · `#111115` · `#26262D` | `bg-bg-*` |
| bg/hover · pressed · inverse · elevated | gray/200 · 300 · 950 · white | `#30303A` · `#3C3C47` · `#F2F2F5` · `#26262D` | |
| bg/dim-weak · dim | `#111` 40% · 60% | `#000` 50% · 70% | 바텀시트 딤 = dim-weak |
| primary/default · hover · pressed | green/600 · 700 · 800 | 같음 | `bg-primary` · `-hover` · `-pressed` |
| primary/text | green/600 | green/400 | `text-primary-text` |
| primary/soft · soft-pressed | green/50 · 100 | dark-soft · 900 | `bg-primary-soft` |
| primary/accent | green/500 | 같음 | `text-primary-accent` |
| primary/focus-halo | `#4CAF50` 40% | 같음 | `shadow-focus` |
| status/success · warning · error · info (bg · base · text) | 원본 문서 1-2 | 원본 문서 1-2 | `bg-status-warning-bg` … |
| shadow/1 ~ 4 · dock | `#212121` 6 · 8 · 10 · 12% · `#000` 4% | `#000` 32 · 36 · 40 · 48% · 32% | 그림자 색 |

### 1-3. 브랜드 색 쓰는 곳 (중요한 곳만)

| 토큰 | 쓰는 곳 |
| --- | --- |
| `primary/default` | 화면의 주 버튼 1개(다음 · 계산 결과 보기 · 플랜 등록하기) · FAB(+) · 체크 완료 · 토글 On · 진행률 막대 · 스테퍼 · 선택된 카테고리 옵션 테두리 · 캘린더 선택 날짜 |
| `primary/text` | 핵심 숫자 — 오늘 달성률 · D-12 · 하루 할당량 · 종료일 조정 값 |
| `primary/soft` | 재계산 배너 · 진행 중 배지 · 프로필 아바타 · "내일부터" 선택지 같은 연한 강조 면 |
| `bg/inverse` (검정) | 필터 칩 · 요일 선택 · 기간 탭 선택 · "지금 재계산하기" — 브랜드 색 대신 쓰는 선택 표시 |
| `icon/sub` + `bg/regular` | 카테고리 아이콘 박스(책 · 강의 · 일반) · 알림 아이콘 박스 — 완료된 할 일은 `icon/disabled` |

**Don't**
- 배경 · 큰 면적 · 그림자에 초록을 쓰지 않는다 (글로우 금지).
- 한 영역(카드 · 시트 · 하단 바)에 초록 채운 버튼은 1개. 보조 행동은 Secondary(`bg/regular`) · Ghost.
- 텍스트 링크 · "다시 시도" 같은 텍스트 버튼은 무채색(`text/main` + 밑줄).
- HEX를 직접 쓰지 않는다 — 토큰(Tailwind 클래스)만.

## 2. 타이포그래피

**Pretendard** 하나, 굵기 Regular 400 · Medium 500 · SemiBold 600. 자간 KR `-2.5%`. 행간 32px 이상 130% · 16 ~ 28px 140% · 15px 이하 145%. 스타일 이름 `KR/{카테고리}/{굵기}/{크기}`(피그마 텍스트 스타일 69개).

| 쓰는 곳 | 스타일 |
| --- | --- |
| 결과 화면 큰 숫자 (18페이지 · D-12 · 40%) | Display · 36 ~ 52 SemiBold, `primary/text` |
| 화면 제목 (오늘 할 일이 3개 남았어요) | Headline 3 · 24 SemiBold |
| 섹션 제목 (오늘의 할 일 · 수행 기록) | Headline 5 · 18 SemiBold |
| 카드 · 시트 제목 | Title 3 · 4 · 18 / 16 SemiBold |
| 버튼 · 입력값 | 16 SemiBold / 16 Regular (iOS 확대 방지로 입력은 16) |
| 본문 · 설명 | Body 14 · 13 Regular, `text/sub` |
| 메타 · 날짜 · 라벨 | Caption 12 Regular, `text/sub-weak` (회색 배경 위에서는 `text/sub`) |
| 탭바 라벨 | 11 Medium (선택 SemiBold) |

## 3. 간격 · 레이아웃

- 간격 토큰 `space/N = N × 4px` (피그마 `Spacing` 컬렉션, Tailwind `p-4 = 16px`과 같음). 6(`space/1-5`)은 텍스트 간격 전용, 2(`space/0-5`)는 시각 보정.
- 프레임 MO 375 (390 시안), 앱 최대 폭 440. 좌우 마진 20(`px-5`).
- 레이아웃 타입: **Card UI 개별 그룹** — 화면 `bg/light` + 카드 `bg/default` + Shadow/1, 카드 사이 12, 섹션 사이 32 ~ 40, 타이틀 → 콘텐츠 12 ~ 16.
- 하단 탭바(Dock Bar · Brand 강조 Overlap): 탭 56 + 안전 영역, 위쪽 그림자 Shadow/Dock, 가운데 FAB만 `primary/default`. 선택 탭은 `icon/main` + `text/main`, 나머지 `icon/sub` + `text/sub`.

## 4. 라운드 — Radius `Default` 모드

| 토큰 | 값 | 코드 | 쓰는 곳 |
| --- | --- | --- | --- |
| radius/tag | 6 | `rounded-tag` | 배지 |
| radius/button | 8 | `rounded-button` | 버튼 · 카테고리 아이콘 박스 · 작은 정보 카드 |
| radius/input | 8 | `rounded-input` | 입력창 · 날짜 선택 |
| radius/card | 16 | `rounded-card` | 카드 · 배너 |
| radius/thumbnail | 12 | `rounded-thumbnail` | 카드 안 박스 (카드 −4) |
| radius/sheet | 20 | `rounded-t-sheet` | 바텀시트 (위쪽만) |
| radius/full | 999 | `rounded-full` | 필터 칩 · 요일 원 · FAB · 토글 · 진행률 |

## 5. 그림자 — 블러 대신 (피그마 Effect style)

| 스타일 | 값 | 코드 | 쓰는 곳 |
| --- | --- | --- | --- |
| Shadow/1 | 0 1 2 `shadow/1` | `shadow-1` · `.card` | 카드 · 알림 버튼 · 선택된 탭 |
| Shadow/2 | 0 2 4 `shadow/2` | `shadow-2` | 선택된 카테고리 옵션 |
| Shadow/3 | 0 4 8 `shadow/3` | `shadow-3` | FAB · 토스트 |
| Shadow/4 | 0 6 12 `shadow/4` | `shadow-4` | 바텀시트 |
| Shadow/Dock | 0 −4 8 `shadow/dock` | `shadow-dock` | 하단 탭바 |
| Focus/Ring | 0 0 0 3 `primary/focus-halo` | `shadow-focus` · `:focus-visible` | 키보드 포커스 · 입력창 포커스 |

- 반투명 + `backdrop-filter`는 토스트(원본 13장 규칙: `#111` 70% + blur 10)에만. 화면 배경 · 카드 · 탭바 · 시트에는 쓰지 않는다.

## 6. 컴포넌트 (피그마 Design_System › Components)

| 컴포넌트 | 스펙 |
| --- | --- |
| Button | XL 56 · 16 SemiBold · `radius/button`. Primary(`primary/default`, 그림자 없음) · Secondary(`bg/regular`) · Ghost · Disabled(`bg/regular` + `text/disabled`) |
| Chip (Tag) | 36 · 13 · Pill. 기본 `bg/default` + `line/regular`, 선택 Filled `bg/inverse` + `text/inverse` |
| Checkbox | L 24 · 선 1.5 `line/strong` · 체크 `primary/default` — 누르는 영역 44 |
| Toggle | A 52 × 28 · Off `line/strong` · On `primary/default` |
| Input | XL 56 · Filled 스타일 — 기본 `bg/regular` 선 없음, 포커스 `bg/default` + `primary/default` 선 + 헤일로 |
| TaskCard | 카드 + 아이콘 박스(`bg/regular` · `icon/sub`) + 체크박스. 완료는 제목 `text/disabled` · 아이콘 `icon/disabled` |
| CategoryOption | 카드 + 라디오. 선택되면 `primary/default` 테두리 · 아이콘 박스 초록 · Shadow/2 |
| ProgressBar · Stepper | 트랙 `bg/regular` · `line/regular`, 채움 `primary/default` |
| Badge | S 24 · 12 Medium · `radius/tag`. Brand(`primary/soft` + `primary/text`) · Warning · Gray |
| BottomSheet | `bg/elevated` · `radius/sheet` · Shadow/4 · 딤 `bg/dim-weak` |

## 7. 아이콘 — Phosphor (My Design System 07 Icon 사본)

- 피그마: Design_System › Components › `Section · Icon · Phosphor` — My Design System `07 Icon`과 같은 이름(`icon/{역할}`) · 같은 Phosphor 패스, PlanForMe에는 **Regular · Fill** 두 스타일만 복사. 색은 `Glyph` 레이어에 `icon/*` 토큰.
- 코드: `@phosphor-icons/react` — 컴포넌트 이름은 Phosphor 원래 이름(아래 표). 크기는 12 · 16 · 20 · 24만, 기본 24.
- 선택 상태(탭바 현재 탭)만 `weight="fill"`, 완료 체크 · 12 ~ 16 작은 아이콘은 `weight="bold"`, 나머지는 Regular.

| 역할 (피그마) | Phosphor (코드) | 쓰는 곳 |
| --- | --- | --- |
| home · calendar · list · user · plus | House · CalendarBlank · ListBullets · User · Plus | 탭바 · FAB |
| book · video · repeat | Book · MonitorPlay · Repeat | 카테고리 (책 · 강의 · 일반) |
| back · forward · close | CaretLeft · CaretRight · X | 헤더 · 리스트 화살표 |
| check · refresh · error · time · bell · moon · target | Check · ArrowClockwise · WarningCircle · Clock · Bell · Moon · Target | 완료 · 재계산 · 경고 · 알림 · 설정 · 하루 목표 |
| edit · delete · pause · play · more-vertical | PencilSimple · Trash · Pause · Play · DotsThreeVertical | 플랜 상세 액션 |

## Quick Start

```html
<html data-theme="dark"> <!-- 속성이 없으면 Light -->
```

```tsx
<div className="card p-5">                         {/* bg/default + radius/card + Shadow/1 */}
  <p className="text-[12px] text-text-sub-weak">책 · 평일</p>
  <p className="text-[16px] font-semibold">모던 자바스크립트 Deep Dive</p>
  <p className="text-[36px] font-semibold text-primary-text">40%</p>
  <ProgressBar value={40} />                       {/* bg-bg-regular 트랙 + bg-primary */}
</div>
<Button>계산 결과 보기</Button>                     {/* 영역당 Primary 1개 */}
<Button variant="secondary">이 페이지로 기록하기</Button>
<Chip selected>전체</Chip>                          {/* bg-bg-inverse */}
```
