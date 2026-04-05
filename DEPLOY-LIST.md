# 운사트(Transport Community) — 배포·운영 체크리스트

이 파일은 **GitHub에 저장**해 두고, 배포·점검 시 순서대로 확인합니다.

## 프로젝트 정보

| 항목 | 값 |
|------|-----|
| 로컬 경로 | `C:\Users\hohoh\OneDrive\바탕 화면\운사트` |
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
   cd "C:\Users\hohoh\OneDrive\바탕 화면\운사트"
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

6. **한 번에 배포** (규칙+스토리지+호스팅)
   ```bash
   firebase deploy
   ```

7. **앱 캐시**  
   - `public/sw.js`의 `CACHE_NAME` 버전을 올렸는지 확인  
   - 사용자에게 필요 시 새로고침 안내

## 보안·관리자 (반드시 동기화)

- **관리자 이메일**은 다음 **두 곳을 동일하게** 맞출 것:
  - `firestore.rules` → `adminEmails()` 배열
  - `public/admin.html` → `ADMIN_EMAILS` 배열
- 관리자 추가/변경 후 **`firebase deploy --only firestore:rules`** 재배포

## 아이디 찾기

- 이름으로 이메일 조회는 **보안상 제공하지 않음** (Firestore 규칙과 맞춤)
- 비밀번호 찾기(이메일 재설정 링크) 사용 안내

## GitHub 저장소 최초 연결 (참고)

로컬에만 있을 때:

```bash
cd "C:\Users\hohoh\OneDrive\바탕 화면\운사트"
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
