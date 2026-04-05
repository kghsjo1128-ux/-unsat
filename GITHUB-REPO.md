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
cd "C:\Users\hohoh\OneDrive\바탕 화면\운사트"
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
