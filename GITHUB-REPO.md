# GitHub 저장소 이름 (프로젝트에 고정)

GitHub에서 **New repository** 를 만들 때 아래와 같이 맞춥니다.

| 항목 | 값 |
|------|-----|
| **Repository name** | `운사트` |
| 설명(Description) | 원하시는 한 줄 (선택) |
| Public / Private | 본인 선택 |
| Add a README | **체크하지 않기** (로컬에 이미 있음) |

## 원격 주소 예시

깃허브 사용자(조직) 이름이 **`kghsjo1128-ux`** 인 경우 (다르면 본인 아이디로 바꿀 것):

```
https://github.com/kghsjo1128-ux/운사트.git
```

## 로컬에서 연결·푸시

```bash
cd "C:\Users\hohoh\OneDrive\바탕 화면\앱개발겁나재밌음\운사트"
git remote add origin https://github.com/kghsjo1128-ux/운사트.git
git push -u origin main
```

이미 `origin`이 있으면:

```bash
git remote set-url origin https://github.com/kghsjo1128-ux/운사트.git
git push -u origin main
```

### 한글 이름이 안 될 때

GitHub가 저장소 이름에 한글을 허용하지 않으면 영문 슬러그로 만든 뒤, 이 파일의 URL만 그 이름에 맞게 수정하세요. (예: `unsat`, `transport-unsat`)

### `Repository not found` / 푸시가 안 될 때

1. **웹에서 빈 저장소를 먼저 만들었는지** 확인 (이름 `운사트`, README 없음).
2. 저장소 페이지 **초록 Code → HTTPS** 주소를 **그대로 복사**해 `git remote set-url origin <복사한주소>` 에 넣기.  
   (PowerShell에서 한글 URL을 손으로 치면 깨질 수 있음 → **반드시 복사**)
3. GitHub 로그인: 처음 푸시 시 브라우저로 로그인하라는 창이 뜨는지 확인.
4. 자동 스크립트: 프로젝트 루트에서 `scripts\push-github.ps1` 안의 `$RepoUrl` 을 Code에서 복사한 주소로 바꾼 뒤 실행.

**원격 주소(참고, 저장소 생성 후에만 동작):**

```
https://github.com/kghsjo1128-ux/%EC%9A%B4%EC%82%AC%ED%8A%B8.git
```

위는 `운사트` 저장소의 퍼센트 인코딩 URL입니다. 웹에서 복사한 주소와 같아야 합니다.
