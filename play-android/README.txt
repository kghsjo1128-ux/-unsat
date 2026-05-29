운사트 — Google Play용 Android TWA
====================================
패키지: com.unsat
웹 매니페스트: https://transport-community-c5fc1.web.app/manifest.json

1) JDK 17 + keytool. 키스토어 없으면 이 폴더에서:
   keytool -genkeypair -v -storetype PKCS12 -keystore android.keystore -alias unsat -keyalg RSA -keysize 2048 -validity 10000 -storepass "비밀번호" -keypass "비밀번호" -dname "CN=Unsat, OU=Mobile, O=Unsat, L=Seoul, ST=Seoul, C=KR"

2) 루트에서 npm run play:fingerprint → SHA256을 public/.well-known/assetlinks.json 에 반영 후 firebase deploy (Hosting)

3) 루트에서 npm run play:build → app-release-bundle.aab 를 Play Console에 업로드

커스텀 도메인(unsat.co.kr)만 쓸 경우 Firebase에 연결 후:
  set TWA_MANIFEST_URL=https://unsat.co.kr/manifest.json
  npm run play:generate
