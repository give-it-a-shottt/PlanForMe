# 트러블슈팅 기록

PlanForMe를 만들고 배포하면서 만난 문제와 해결 과정을 정리한 문서입니다.
각 항목은 **증상 → 원인 → 해결 → 배운 점** 순서로 적었습니다.

| # | 분류 | 문제 |
| --- | --- | --- |
| 1 | 보안 | 처음 설치한 Next.js 버전에 원격 코드 실행(RCE) 취약점 |
| 2 | Next.js 16 | 데이터 요청이 있는 페이지에서 build 실패 |
| 3 | Next.js 16 | `new Date()` 때문에 build 실패 |
| 4 | Next.js 16 | `useParams()` 때문에 build 실패 |
| 5 | Next.js 16 | 플랜 등록 후 다시 들어가면 이전 화면(3단계)이 그대로 보임 |
| 6 | 프론트 | 캘린더에서 날짜를 바꾸면 이전 날짜의 할 일이 잠깐 보임 |
| 7 | 프론트 | `"use client"` 파일의 상수를 서버 컴포넌트에서 가져다 씀 |
| 8 | 백엔드 | 재계산을 해도 "밀린 분량이 있어요" 배너가 사라지지 않음 |
| 9 | 백엔드 | 서버(UTC)와 한국 시간의 "오늘"이 다름 |
| 10 | 개발 환경 | 의존성 변경 시 `os error 32` (파일 사용 중) |
| 11 | 배포 | 배포용 의존성이 너무 많음 (`fastapi[standard]`) |
| 12 | 배포 | Neon 연결 후 `DATABASE_URL`이 아니라 `STORAGE_URL`이 생길 뻔함 |
| 13 | 배포 · 보안 | API 키 없이도 api가 응답함 |
| 14 | 배포 | Vercel 빌드 로그의 경고 3가지 |

---

## 1. Next.js 15.5.4에 RCE 취약점

**증상**
`create-next-app@15.5.4`로 프로젝트를 만든 직후 `npm audit`에서 취약점 8개(critical 1개)가 나왔습니다.

```
next  9.3.4-canary.0 - 16.3.0-preview.10
Severity: critical
Next.js is vulnerable to RCE in React flight protocol
```

**원인**
버전을 직접 지정하면서 보안 패치가 들어가기 전의 버전을 골랐습니다.

**해결**
최신 안정 버전 `16.4.2`로 다시 만들었고, `npm audit` 결과 0개를 확인했습니다.

**배운 점**
프로젝트를 만든 직후, 그리고 의존성을 추가할 때마다 `npm audit`을 확인합니다. 버전을 고정할 때는 최신 보안 패치가 포함된 버전인지 먼저 봅니다.

---

## 2. 데이터 요청이 있는 페이지에서 build 실패

**증상**
서버 컴포넌트에서 `fetch()`로 API 상태를 확인하는 임시 페이지가 `npm run build`에서 실패했습니다.

```
Error: Route "/": Next.js encountered uncached or runtime data during prerendering.
```

**원인**
Next.js 16은 **Cache Components**가 기본으로 켜져 있습니다. build할 때 페이지를 미리 그려 두는데(prerender), 요청할 때마다 바뀌는 데이터(`fetch`, `cookies()` 등)를 만나면 어디까지 미리 그릴지 정할 수 없어서 막습니다.

**해결**
요청 시점에 받아야 하는 부분을 `<Suspense>`로 감쌌습니다. 바깥 틀은 미리 그리고, 감싼 부분만 요청할 때 채워 넣습니다.

```tsx
<Suspense fallback="확인 중...">
  <HealthStatus />
</Suspense>
```

**배운 점**
Next 16에서는 "이 데이터는 언제 정해지는가(build 때 / 요청 때)"를 컴포넌트마다 나눠서 생각해야 합니다.

---

## 3. `new Date()` 때문에 build 실패

**증상**
캘린더와 플랜 생성 화면이 build에서 실패했습니다.

```
Error: Route "/calendar": Next.js encountered the unstable value `new Date()` in a Client Component.
```

**원인**
클라이언트 컴포넌트도 build 때 한 번 미리 그려집니다. 이때 `new Date()`로 "오늘"을 계산하면 **build한 날짜가 HTML에 박혀 버립니다.** Next 16은 이런 값을 감지해서 막습니다.

**해결**
"오늘"을 브라우저에서만 읽는 훅을 만들었습니다. 미리 그릴 때는 `null`을 돌려주고, 브라우저에서는 실제 날짜를 돌려줍니다.

```ts
// web/src/lib/useToday.ts
export function useToday(): string | null {
  return useSyncExternalStore(noop, todayISO, () => null); // 세 번째 인자 = 서버(미리 그리기)용 값
}
```

**배운 점**
시간·난수처럼 실행할 때마다 달라지는 값은 렌더 중에 바로 쓰지 않습니다. `useSyncExternalStore`의 서버용 값으로 미리 그리는 단계와 브라우저 단계를 나눌 수 있습니다.

---

## 4. `useParams()` 때문에 build 실패

**증상**
플랜 상세(`/plan/[id]`)가 build에서 실패했습니다.

```
Error: Route "/plan/[id]": Next.js encountered URL data `useParams()` in a Client Component outside of `<Suspense>`.
```

**원인**
URL의 `id`는 사용자가 접속해야 알 수 있습니다. 미리 그릴 수 없는 값이라 2번과 같은 이유로 막힙니다.

**해결**
페이지 본문을 `<Suspense>`로 감싸고, 기다리는 동안 보여 줄 화면(fallback)을 지정했습니다.

**배운 점**
URL 파라미터, 쿼리스트링, 쿠키처럼 요청에 딸린 값은 모두 "요청 때 정해지는 데이터"입니다.

---

## 5. 플랜 등록 후 다시 들어가면 이전 화면이 그대로 보임

**증상**
플랜을 등록하면 홈으로 이동합니다. 그런데 이어서 `+`를 누르면 1단계가 아니라 **방금 등록한 플랜의 3단계(계산 결과) 화면**이 나왔고, "플랜 등록하기" 버튼은 회색(비활성)이었습니다.

**원인**
Next 16은 Cache Components가 켜져 있으면 화면을 이동할 때 이전 화면을 **지우지 않고 숨겨서 보관합니다** (React `<Activity>`, 최대 3개 화면). 그래서 `step = 3`, `saving = true` 같은 상태값이 남아 있다가 다시 보였습니다.

**해결** (Next.js 공식 가이드 *Preserving UI state* 권장 방식)
1. **등록 성공 · X로 닫기:** 이벤트 핸들러에서 직접 상태를 초기화합니다. 뒤로 가기로 잠깐 나갔다 오면 쓰던 내용은 유지됩니다.
   ```ts
   onDone={() => {
     reset();            // step = 1, 폼 비우기
     router.replace("/");
   }}
   ```
2. **바텀시트:** 화면이 숨겨질 때 실행되는 `useLayoutEffect` 정리 함수에서 닫습니다.
   ```ts
   useLayoutEffect(() => () => {
     setProgressTask(null);
     setReplan(null);
   }, []);
   ```

**배운 점**
Next 16에서는 "화면을 떠나면 상태가 사라진다"는 가정이 틀립니다. 상태마다 **유지할지(작성 중인 폼, 스크롤) / 초기화할지(완료된 폼, 열린 팝업)**를 정해야 합니다.

---

## 6. 날짜를 바꾸면 이전 날짜의 할 일이 잠깐 보임

**증상**
캘린더에서 다른 날짜를 누르면, 새 데이터가 오기 전까지 이전 날짜의 할 일 목록이 그대로 보였습니다.

**원인**
공통 데이터 훅(`useApi`)이 "어떤 요청의 결과인지"를 기억하지 않고 마지막 결과를 계속 보여 줬습니다.

**해결**
결과를 요청 key(예: `tasks-2026-10-17`)와 함께 저장하고, 지금 key와 다르면 데이터를 `null`로 취급해 로딩 스켈레톤을 보여 줍니다. 같은 key로 새로 고칠 때(`reload`)는 기존 데이터를 유지합니다.

```ts
const fresh = result.key === key;
const data = fresh ? result.data : null;
```

**배운 점**
비동기 데이터는 **"무엇에 대한 결과인가"**까지 같이 저장해야 오래된 응답이 섞이지 않습니다.

---

## 7. `"use client"` 파일의 상수를 서버 컴포넌트에서 가져다 씀

**증상** (build 전에 발견)
다크모드를 첫 화면부터 적용하는 스크립트 문자열을 `"use client"` 파일(`settings.ts`)에 두고, 서버 컴포넌트인 `layout.tsx`에서 가져다 쓰려고 했습니다.

**원인**
`"use client"` 파일에서 내보낸 것은 서버 쪽에서 실제 값이 아니라 **"클라이언트에 있는 무언가"를 가리키는 참조**로 바뀝니다. 그래서 문자열이 제대로 들어가지 않습니다.

**해결**
서버와 클라이언트가 함께 쓰는 상수는 지시어가 없는 파일(`lib/theme.ts`)로 분리했습니다.

**배운 점**
`"use client"`는 "이 파일부터 아래는 브라우저 코드"라는 경계 선언입니다. 공유할 상수나 타입은 경계 밖에 둡니다.

---

## 8. 재계산을 해도 "밀린 분량" 배너가 남음

**증상**
진행량을 적게 입력하고 "네, 다시 계산해 주세요"를 눌렀는데도, 홈에 같은 플랜의 "밀린 분량이 있어요" 배너가 계속 떴습니다.

**원인**
"밀림"을 **오늘 이전 + 미완료인 할 일**로 판단했습니다. 재계산은 남은 분량을 내일부터 다시 나누고, 과거 기록은 그대로 둡니다(기획 의도). 그래서 재계산 이전의 미완료 기록이 영원히 "밀림"으로 남았습니다.

**해결**
플랜에 마지막 재계산 시작일(`rebased_on`)을 저장하고, 그 날짜 이후의 미완료만 "밀림"으로 셉니다. 과거 기록은 지우지 않으므로 플랜 상세의 수행 기록에는 "미완료"로 그대로 남습니다.

```python
or_(Plan.rebased_on.is_(None), DailyTask.date >= Plan.rebased_on)
```

재계산 후 배너가 사라지는지 확인하는 테스트(`test_overdue_cleared_after_replan`)도 추가했습니다.

**배운 점**
"기록은 남긴다"와 "그 기록을 문제로 보지 않는다"는 별개입니다. 상태를 지우는 대신, **기준 시점**을 저장하는 방법이 있습니다.

---

## 9. 서버(UTC)와 한국 시간의 "오늘"이 다름 (예방)

**문제**
Vercel 서버는 UTC로 동작합니다. `date.today()`를 그대로 쓰면 한국 시간 오전 0시~9시에는 "오늘"이 하루 전 날짜가 됩니다.

**해결**
백엔드는 모든 "오늘"을 `Asia/Seoul` 기준으로 계산합니다 (`api/timeutil.py`). Windows에서는 시간대 데이터가 없어서 `tzdata` 패키지를 함께 설치했습니다. 프론트도 `Intl.DateTimeFormat(..., { timeZone: "Asia/Seoul" })`로 맞췄습니다.

**배운 점**
날짜를 다루는 기능은 "어느 시간대 기준인가"를 처음부터 정해 둡니다.

---

## 10. 의존성 변경 시 `os error 32`

**증상**
`uv remove`를 실행하자 다음 에러가 났습니다.

```
failed to remove file `.venv\...\Scripts\uvicorn.exe`: 다른 프로세스가 파일을 사용 중 (os error 32)
```

**원인**
Windows는 실행 중인 파일을 지우거나 바꿀 수 없습니다. 개발 서버(uvicorn)가 켜져 있었습니다.

**해결**
8000번 포트의 서버를 끄고 다시 실행했습니다.

---

## 11. 배포용 의존성이 너무 많음

**증상**
`requirements.txt`를 뽑아 보니 196줄이었습니다.

**원인**
`fastapi[standard]`는 개발 서버, CLI, 클라우드 도구까지 함께 설치합니다. 배포된 함수에는 필요 없는 것들입니다.

**해결**
런타임 의존성은 `fastapi`만 남기고, `uvicorn`과 `httpx`(테스트용)는 개발 의존성으로 옮겼습니다. 런타임 패키지가 15개로 줄었습니다.

---

## 12. Neon 연결 시 변수 이름이 `STORAGE_URL`로 생길 뻔함

**증상**
Vercel의 Neon 연결 화면에서 **Custom Environment Variable Prefix** 칸이 `STORAGE`로 되어 있었습니다.

**원인**
이 칸 값 뒤에 `_URL`이 붙어 변수 이름이 됩니다. 그대로 두면 `STORAGE_URL`이 만들어지는데, 코드는 `DATABASE_URL`을 읽습니다. 그러면 DB를 못 찾고 SQLite로 동작하려다 실패합니다 (배포 환경은 파일을 저장할 수 없음).

**해결**
Prefix를 `DATABASE`로 바꿔 `DATABASE_URL`이 만들어지게 했습니다.

**배운 점**
코드가 읽는 환경 변수 이름과 플랫폼이 만들어 주는 이름이 같은지 꼭 확인합니다.

---

## 13. API 키 없이도 api가 응답함

**증상**
`https://(api 주소)/today`를 브라우저에서 열었더니 키 없이도 데이터가 나왔습니다.

```json
{"date":"2026-10-17","tasks":[],"done_count":0,"total_count":0,"overdue":[]}
```

**원인**
코드는 `API_KEY` 환경 변수가 **없으면 검사를 건너뜁니다** (로컬 개발 편의). 배포된 api가 `API_KEY`를 읽지 못하고 있었습니다. 확인할 지점은 다음과 같습니다.
- 변수 이름 오타 (대문자, 밑줄, 앞뒤 공백)
- 적용 환경에 **Production**이 빠짐
- 변수를 추가한 뒤 **Redeploy**를 하지 않음
- `Environments`(환경 목록) 화면과 `Environment Variables`(환경 변수) 화면을 혼동함

**해결 방법**
Settings → Environment Variables에서 `API_KEY`를 Production · Preview · Development에 모두 적용하고 Redeploy합니다.

**확인 방법**
- `/today` → `{"detail":"API 키가 올바르지 않아요"}`
- `/health` → `{"status":"ok"}` (일부러 잠그지 않은 주소)

**배운 점**
"설정이 없으면 통과"하는 코드는 배포할 때 설정이 빠져도 조용히 열려 버립니다. 배포 직후 **막혀야 하는 요청이 실제로 막히는지**를 확인 절차에 넣어야 합니다.

---

## 14. Vercel 빌드 로그의 경고 3가지

빌드는 성공했고, 세 경고 모두 동작에는 영향이 없습니다.

| 경고 | 원인 | 조치 |
| --- | --- | --- |
| `install-scripts ... unrs-resolver` | 최신 npm이 설치 스크립트를 허락받은 패키지만 실행하도록 바뀜. ESLint가 내부에서 쓰는 패키지 | 없음 (원하면 `npm install-scripts approve unrs-resolver`) |
| `Unknown env config "cache-dir"` | Vercel 빌드 서버가 넣은 npm 설정을 최신 npm이 모름 | 없음 (플랫폼 쪽 문제) |
| `Next.js now collects ... telemetry` | 익명 사용 통계 수집 안내문 | 원하면 `NEXT_TELEMETRY_DISABLED=1` |
