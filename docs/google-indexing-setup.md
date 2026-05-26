# 🚀 Google Indexing API 연동 설정 가이드

원장님, 아래 7단계만 따라하시면 **새 글 올릴 때마다 Google이 1시간 내 자동 크롤링**하러 옵니다.
총 소요시간 **약 5분**.

---

## 📌 사전 준비

이미 보유하고 계신 것:
- ✅ Google Search Console (GSC) — `ieumdc.kr` 사이트 등록 완료
- ✅ Google 계정 (검진넷·진료실에서 쓰시는 계정 아무거나 OK)

---

## STEP 1️⃣ Google Cloud Console 프로젝트 생성

1. https://console.cloud.google.com 접속
2. 상단 좌측 "프로젝트 선택" 클릭 → **"새 프로젝트"** 클릭
3. 프로젝트 이름: `eumdc-indexing-api` (아무 이름 OK)
4. **만들기** 클릭 (10초 소요)

---

## STEP 2️⃣ Indexing API 활성화

1. 좌측 햄버거 메뉴 (☰) → **"API 및 서비스"** → **"라이브러리"**
2. 검색창에 `Indexing API` 입력
3. **Indexing API** 클릭 → **"사용 설정"** 버튼 클릭

---

## STEP 3️⃣ 서비스 계정 생성

1. 좌측 메뉴 → **"API 및 서비스"** → **"사용자 인증 정보"**
2. 상단 **"+ 사용자 인증 정보 만들기"** → **"서비스 계정"** 선택
3. 입력:
   - **서비스 계정 이름**: `indexing-api-bot`
   - **서비스 계정 ID**: 자동입력 그대로
4. **만들고 계속하기** → 역할은 **스킵** → **완료**

---

## STEP 4️⃣ JSON 키 파일 다운로드

1. 방금 만든 서비스 계정 이름 (`indexing-api-bot@...`) 클릭
2. 상단 **"키"** 탭 클릭
3. **"키 추가"** → **"새 키 만들기"** → **JSON** 선택 → **만들기**
4. ✅ **JSON 파일이 자동 다운로드됩니다** — 이 파일을 잘 보관해주세요!

JSON 파일 내용은 이런 모양이에요:
```json
{
  "type": "service_account",
  "project_id": "eumdc-indexing-api",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhki...\n-----END PRIVATE KEY-----\n",
  "client_email": "indexing-api-bot@eumdc-indexing-api.iam.gserviceaccount.com",
  ...
}
```

⚠️ **보안 주의**: 이 파일은 Github/이메일로 절대 공유하지 마세요. Cloudflare 환경변수에만 저장합니다.

---

## STEP 5️⃣ Google Search Console에 서비스 계정 권한 부여 ⭐ 가장 중요

이 단계가 가장 자주 놓치는 부분입니다. 꼭 해주세요!

1. JSON 파일 열어서 `"client_email": "..."` 줄에 있는 **이메일 주소 복사**
   - 예: `indexing-api-bot@eumdc-indexing-api.iam.gserviceaccount.com`

2. https://search.google.com/search-console 접속
3. 좌측 상단 사이트 선택: **`ieumdc.kr`** 선택
4. 좌측 하단 **⚙️ 설정** 클릭
5. **"사용자 및 권한"** 클릭
6. 우측 상단 **"사용자 추가"** 클릭
7. 입력:
   - **이메일 주소**: STEP 5-1에서 복사한 서비스 계정 이메일
   - **권한**: **"소유자"** 선택 ⭐ (필수! 일반 사용자로는 안 됨)
8. **추가** 클릭

---

## STEP 6️⃣ Cloudflare에 환경변수 등록

JSON 파일 내용 전체를 Cloudflare Worker 환경변수로 등록합니다.

### 방법 A: Cloudflare 대시보드 (추천)

1. https://dash.cloudflare.com 접속
2. **Workers & Pages** → **eumdc** 프로젝트 클릭
3. **Settings** → **Environment variables** → **Add variable** 클릭
4. 입력:
   - **Variable name**: `GOOGLE_INDEXING_SERVICE_ACCOUNT`
   - **Value**: JSON 파일 **내용 전체**를 복사 붙여넣기 (중괄호 포함)
   - **Type**: **Secret** ⭐ (꼭 Secret으로!)
   - **Environment**: **Production** 체크
5. **Save** 클릭

### 방법 B: 터미널 (제가 원격으로 도와드릴 수 있는 방법)

원장님이 JSON 파일 내용을 채팅에 붙여넣어 주시면 제가 바로 등록해드립니다.
(보안 위험: 채팅 로그에 남으니 방법 A를 추천)

---

## STEP 7️⃣ 끝! 

이제 어드민에서 **블로그/케이스/공지를 발행**하시면:
- 🔵 Bing/Yandex (IndexNow) — 즉시 핑 → 24-48시간 내 색인
- 🔴 **Google (Indexing API) — 즉시 핑 → 1시간 내 크롤링** ⭐ NEW

토스트 알림으로 두 결과를 모두 확인할 수 있습니다.

---

## ❓ 잘 되는지 확인하는 방법

배포 후 어드민에서 새 글 하나 발행해보시면:
- 토스트에 `🚀 Google Indexing: ✅ Bing/Yandex: ✅` 표시됨

또는 https://ieumdc.kr/api/seo/test-indexing 에 접속하면 테스트 핑이 전송됩니다.

---

## 📊 Quota (할당량)

- Google Indexing API: **하루 200 URL 무료**
- 새 글 + 수정 합쳐도 하루 10개 미만이라 평생 무료 범위 안에서 사용 가능

---

## 🛟 문제 발생 시

- **"Permission denied" 에러**: STEP 5 (GSC 권한 부여) 다시 확인. "소유자" 권한이어야 함.
- **"Indexing API not enabled" 에러**: STEP 2 다시 확인.
- **JSON 파싱 에러**: STEP 6에서 환경변수 값에 JSON 전체를 복사했는지 확인 (중괄호 포함).
