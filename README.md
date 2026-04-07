# 운사트 (Transport Community)

Firebase Hosting 기반 PWA · Firestore · Storage.

## 문서

- **[배포·운영 체크리스트](./DEPLOY-LIST.md)** — Git에 올려 두고 배포할 때 순서대로 확인
- **[GitHub 저장소 이름·원격 주소](./GITHUB-REPO.md)** — 저장소 이름 **`운사트`** 고정, `git remote` 예시

## 빠른 배포

```bash
firebase deploy
```

**코드 수정 후 GitHub 반영 + Firebase 재배포를 한 번에** 하려면 프로젝트 폴더에서:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\sync-and-deploy.ps1
```

커밋 메시지를 직접 쓰려면 `-Message "설명"` 을 붙이면 됩니다. 옵션은 `scripts\sync-and-deploy.ps1` 상단 주석을 참고하세요.

프로젝트·URL·상세 절차는 `DEPLOY-LIST.md`를 참고하세요.

## GitHub에 푸시 (최초 1회)

1. [GitHub → New](https://github.com/new)에서 저장소 **이름을 `운사트`** 로 만든다 (README 추가하지 않기).  
   → 자세한 칸 설명은 **[GITHUB-REPO.md](./GITHUB-REPO.md)** 참고.
2. 터미널 (본인 계정에 맞게 URL만 수정):

```bash
cd "C:\Users\hohoh\OneDrive\바탕 화면\앱개발겁나재밌음\운사트"
git remote add origin <GitHub의 Code에서 복사한 HTTPS 주소>
git push -u origin main
```

**한글 저장소 이름(`운사트`)은 주소를 직접 치지 말고**, 저장소 만든 뒤 **Code 버튼으로 복사**하세요.  
자세한 오류 대응은 [GITHUB-REPO.md](./GITHUB-REPO.md) 하단 참고.

이미 `origin`이 있으면 `git remote set-url origin <복사한주소>` 후 `git push -u origin main`.
