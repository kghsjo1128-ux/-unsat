# 운사트 (Transport Community)

Firebase Hosting 기반 PWA · Firestore · Storage.

## 문서

- **[배포·운영 체크리스트](./DEPLOY-LIST.md)** — Git에 올려 두고 배포할 때 순서대로 확인

## 빠른 배포

```bash
firebase deploy
```

프로젝트·URL·상세 절차는 `DEPLOY-LIST.md`를 참고하세요.

## GitHub에 푸시 (최초 1회)

1. [GitHub](https://github.com/new)에서 **새 저장소**를 만든다 (비어 있는 저장소, README 추가하지 않기).
2. 아래에서 `<URL>`을 본인 저장소 주소로 바꾼 뒤 터미널에서 실행한다.

```bash
cd "C:\Users\hohoh\OneDrive\바탕 화면\운사트"
git remote add origin <URL>
git push -u origin main
```

이미 `origin`이 있으면 `git remote set-url origin <URL>` 후 `git push -u origin main`.
