# PlanForMe

총분량과 마감일만 입력하면 하루 할당량을 자동으로 계산해 일정에 등록해 주는 1인용 스마트 플래너.

- 책: 현재 페이지 ~ 마지막 페이지를 선택한 요일 수로 나눠 하루 분량 계산
- 동영상 강의: 총 강의 수 · 1강당 평균 길이로 하루 강의 수와 시간 계산 (하루 180분 이상이면 종료일 조정 가이드)
- 일반 루틴: 분량 없이 선택한 요일마다 같은 할 일 등록
- 밀리거나 미리 했을 때: 실제 진행량을 받아 남은 분량을 남은 유효 일수로 다시 나눔 (Re-plan)

## 기술 스택

| 영역 | 사용 기술 |
| --- | --- |
| 프론트 | Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · lucide-react |
| 백엔드 | FastAPI · SQLAlchemy 2 · Pydantic 2 |
| DB | 로컬: SQLite / 배포: Neon Postgres (Vercel Marketplace 무료 티어) |
| 배포 | Vercel 프로젝트 2개 (web, api) · Hobby 무료 |

## 폴더 구조

```
remind_planningme/
├─ api/                    FastAPI
│  ├─ main.py              앱 진입점 · CORS · API 키 검사
│  ├─ planner.py           계산 로직 (순수 함수: 유효 일수 D, 올림 분배, 과부하)
│  ├─ services.py          플랜 생성 · 진도 · 재계산 · 완료 처리
│  ├─ models.py            plans · daily_tasks 테이블
│  ├─ schemas.py           요청/응답 스키마
│  ├─ routers/             plans · tasks · insights(캘린더 · 통계 · 알림)
│  └─ tests/               pytest (계산 로직 + API 플로우)
├─ web/                    Next.js
│  └─ src/
│     ├─ app/(tabs)/       홈 · 캘린더 · 플랜 목록 · 마이 (하단 탭)
│     ├─ app/new/          플랜 생성 3단계
│     ├─ app/plan/[id]/    플랜 상세
│     ├─ app/notifications 알림 센터
│     ├─ app/api/[...path] FastAPI 프록시 (API 키는 서버에서만 붙임)
│     ├─ components/       공통 UI · 바텀시트 · 할 일 카드
│     ├─ lib/              API 클라이언트 · 날짜 포맷 · 설정
│     └─ proxy.ts          앱 비밀번호 잠금 (Basic Auth)
└─ MyDesign(myplan).md     디자인 시스템 문서
```

## 데이터 흐름

```
브라우저 ──fetch──▶ Next.js /api/* (proxy.ts로 비밀번호 확인)
                     └─ X-API-Key 헤더를 붙여 ──▶ FastAPI ──▶ DB
```

브라우저에는 API 키가 노출되지 않습니다. 1인용이라 로그인 대신 앱 전체를 비밀번호로 잠급니다.

## 로컬 실행

필요: Node.js 20+, Python 3.13, [uv](https://docs.astral.sh/uv/)

```bash
# 1) 백엔드 (http://localhost:8000, API 문서: /docs)
cd api
uv sync
uv run uvicorn main:app --reload --port 8000

# 2) 프론트 (http://localhost:3000)
cd web
cp .env.example .env.local
npm install
npm run dev
```

`DATABASE_URL`을 비워 두면 `api/planforme.db`(SQLite)가 자동으로 만들어집니다.

## 테스트

```bash
cd api
uv run pytest
```

IA의 계산 로직 예시(10일 평일 → D=10, 100p/3일 → 34/34/32, 45강/15일 → 하루 3강, 남은 215p/8일 → 27p 등)와
플랜 생성 → 진행량 입력 → 재계산 흐름을 검증합니다.

## 환경 변수

**api**

| 이름 | 설명 |
| --- | --- |
| `DATABASE_URL` | Postgres 연결 문자열. 비우면 SQLite |
| `API_KEY` | 설정하면 모든 API 요청에 `X-API-Key` 헤더가 필요 |
| `ALLOWED_ORIGINS` | CORS 허용 주소 (쉼표 구분) |

**web**

| 이름 | 설명 |
| --- | --- |
| `API_URL` | FastAPI 주소 (서버에서만 사용) |
| `API_KEY` | api와 같은 값 |
| `APP_PASSWORD` | 앱 접속 비밀번호. 비우면 잠금 없음 |
| `NEXT_PUBLIC_USER_NAME` | 마이 화면에 표시할 이름 |

## Vercel 배포 (무료)

1. GitHub 저장소를 Vercel에 연결해 **프로젝트 2개**를 만듭니다.
   - api: Root Directory = `api` (FastAPI 자동 인식, `requirements.txt` 사용)
   - web: Root Directory = `web`
2. api 프로젝트의 Storage 탭에서 **Neon Postgres**를 추가하면 `DATABASE_URL`이 자동으로 들어갑니다.
3. api 환경 변수에 `API_KEY`(임의의 긴 문자열)를 넣습니다.
4. web 환경 변수에 `API_URL`(api 배포 주소), `API_KEY`(같은 값), `APP_PASSWORD`를 넣고 재배포합니다.

> 배포 환경에서는 파일 시스템이 유지되지 않으므로 SQLite가 아니라 반드시 `DATABASE_URL`(Neon)을 설정해야 합니다.

## 주요 API

| 메서드 | 경로 | 설명 |
| --- | --- | --- |
| POST | `/plans/preview` | 저장 없이 하루 할당량 · 과부하 · 첫 주 미리보기 계산 |
| POST | `/plans` | 플랜 + 일자별 할 일 생성 |
| GET | `/plans`, `/plans/{id}` | 플랜 목록 / 상세(수행 기록 포함) |
| PATCH | `/plans/{id}` | 제목 · 종료일 · 요일 · 상태(보류/재개) 수정 → 필요하면 자동 재계산 |
| DELETE | `/plans/{id}` | 플랜 삭제 |
| GET / POST | `/plans/{id}/replan` | 재계산 제안 조회 / 적용 |
| GET | `/today` | 오늘의 할 일 · 달성률 · 밀린 분량 |
| GET | `/tasks?date=` | 특정 날짜의 할 일 |
| POST | `/tasks/{id}/complete` | 완료 (실제 진행량 입력 시 재계산 제안 반환) |
| POST | `/tasks/{id}/uncomplete` | 완료 취소 |
| GET | `/calendar`, `/stats`, `/notifications` | 캘린더 Dot · 학습 통계 · 알림 센터 |

## 트러블슈팅

개발 · 배포 중 만난 문제와 해결 과정은 [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)에 정리했습니다.

## 범위 밖 (다음 단계)

- 푸시 알림: 지금은 앱 안의 알림 센터에만 표시됩니다 (Web Push 필요)
- 도서 검색 API 연동
