# 운사트(Transport Community) — 배포·운영 체크리스트

이 파일은 **GitHub에 저장**해 두고, 배포·점검 시 순서대로 확인합니다.

## 프로젝트 정보

| 항목 | 값 |
|------|-----|
| 로컬 경로 | `C:\Users\hohoh\OneDrive\바탕 화면\app\운사트` |
| **GitHub 저장소 이름** | **`운사트`** (만들 때 Repository name에 그대로 입력) |
| GitHub 원격 예시 | [GITHUB-REPO.md](./GITHUB-REPO.md) 참고 |
| Firebase 프로젝트 ID | `transport-community-c5fc1` |
| 호스팅 URL | https://transport-community-c5fc1.web.app |
| 공개 정적 파일 | `public/` |

## 코드 반영 후 할 일 (순서)

1. **저장소 최신화**
   - `git status`로 변경 파일 확인
   - `git add` → `git commit -m "설명"` → `git push origin main`  
   - (기본 브랜치가 `master`이면 `master`로 푸시)

2. **Firebase 로그인** (세션 만료 시)
   ```bash
   firebase login --reauth
   ```

3. **Firestore 규칙 배포** (`firestore.rules` 수정 시)
   ```bash
   cd "C:\Users\hohoh\OneDrive\바탕 화면\app\운사트"
   firebase deploy --only firestore:rules
   ```

4. **Storage 규칙 배포** (`storage.rules` 수정 시)
   ```bash
   firebase deploy --only storage
   ```

5. **호스팅 배포** (`public/` 수정 시)
   ```bash
   firebase deploy --only hosting
   ```

6. **한 번에 배포** (규칙+스토리지+호스팅+functions)
   ```bash
   firebase deploy
   ```
   또는 PowerShell:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\scripts\deploy-firebase.ps1
   ```

7. **앱 캐시**  
   - `public/sw.js`의 `CACHE_NAME` 버전을 올렸는지 확인  
   - 사용자에게 필요 시 새로고침 안내

## Google Play (Android TWA)

1. **프로젝트 루트에서** `npm install` 후 `npm run play:generate` — `play-android/` Gradle 프로젝트 생성 (패키지 `com.unsat`).
2. **JDK 17** 설치. `play-android/android.keystore` 생성 (`play-android/README.txt`의 keytool 예시).
3. `npm run play:fingerprint` 로 SHA256 확인 → `public/.well-known/assetlinks.json`에 항목 추가 (빈 배열 `[]`을 교체) → `firebase deploy --only hosting`.
4. `npm run play:build` → `play-android/app-release-bundle.aab` 를 Play Console에 업로드.
5. **커스텀 도메인** `unsat.co.kr`만 쓸 경우: Hosting 연결 후 `TWA_MANIFEST_URL=https://unsat.co.kr/manifest.json` 로 `play:generate` 다시 실행하고 assetlinks도 해당 도메인 기준으로 유지.

## 보안·관리자 (2026 보안 강화 이후)

1. **관리자 권한**은 Firebase Auth **Custom Claim `{ admin: true }`** 만 인정합니다 (`firestore.rules`·`admin.html` 동일).
2. 최초(또는 신규 관리자) 부여:
   ```bash
   cd functions
   npm install
   $env:GOOGLE_APPLICATION_CREDENTIALS="서비스계정.json_전체경로"
   node grantAdmin.js 관리자@이메일.com
   ```
3. **App Check (웹)**: Firebase 콘솔 → App Check → 웹 앱에 **reCAPTCHA v3** 등록 후, `public/index.html`·`public/admin.html` 의 `window.UNSART_RECAPTCHA_SITE_KEY` 에 사이트 키 입력.  
   로컬 개발: 콘솔에 찍힌 **디버그 토큰**을 App Check에 등록하거나, enforcement 전에만 테스트.
4. **Cloud Functions** (Blaze): `firebase deploy --only functions` — `onAuthUserDelete`, `logPiiAccess`, `logResumeView`.  
   프로덕션에서 App Check 강제 시 Functions 환경변수 `REQUIRE_APP_CHECK=true` 설정(에뮬레이터는 자동 예외).
5. **Firestore 리전(asia-northeast3)**: 프로젝트 생성 시 이미 고정됩니다. 다른 리전이면 마이그레이션만 가능(콘솔에서 변경 불가).
6. **비밀번호 정책·로그인 잠금·API 비활성화**: Firebase Authentication / Google Cloud 콘솔에서 설정(클라이언트만으로는 불가).

## 아이디 찾기

- 이름으로 이메일 조회는 **보안상 제공하지 않음** (Firestore 규칙과 맞춤)
- 비밀번호 찾기(이메일 재설정 링크) 사용 안내

## GitHub 저장소 최초 연결 (참고)

로컬에만 있을 때:

```bash
cd "C:\Users\hohoh\OneDrive\바탕 화면\app\운사트"
git init
git add .
git commit -m "chore: initial commit"
git branch -M main
git remote add origin https://github.com/<본인아이디>/<저장소이름>.git
git push -u origin main
```

GitHub CLI 사용 시:

```bash
gh repo create <저장소이름> --public --source=. --remote=origin --push
```

---

*마지막 업데이트: 저장소에 커밋된 시점 기준으로 유지하세요.*
