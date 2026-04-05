# 운사트 (Transport Community)

Firebase Hosting 기반 PWA · Firestore · Storage.

## 문서

- **[배포·운영 체크리스트](./DEPLOY-LIST.md)** — Git에 올려 두고 배포할 때 순서대로 확인
- **[GitHub 저장소 이름·원격 주소](./GITHUB-REPO.md)** — 저장소 이름 **`운사트`** 고정, `git remote` 예시

## 빠른 배포

```bash
firebase deploy
```

프로젝트·URL·상세 절차는 `DEPLOY-LIST.md`를 참고하세요.

## GitHub에 푸시 (최초 1회)

1. [GitHub → New](https://github.com/new)에서 저장소 **이름을 `운사트`** 로 만든다 (README 추가하지 않기).  
   → 자세한 칸 설명은 **[GITHUB-REPO.md](./GITHUB-REPO.md)** 참고.
2. 터미널 (본인 계정에 맞게 URL만 수정):

```bash
cd "C:\Users\hohoh\OneDrive\바탕 화면\운사트"
git remote add origin https://github.com/kghsjo1128-ux/운사트.git
git push -u origin main
```

이미 `origin`이 있으면 `git remote set-url origin https://github.com/kghsjo1128-ux/운사트.git` 후 `git push -u origin main`.  
**`kghsjo1128-ux`가 본인 깃허브와 다르면** 해당 부분만 바꾸면 된다.
