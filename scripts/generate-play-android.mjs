/**
 * Google Play용 Trusted Web Activity(TWA) Android 프로젝트를 play-android/에 생성합니다.
 *
 * 기본: 배포된 웹 매니페스트(Firebase Hosting)를 읽고, 패키지 이름은 com.unsat 로 고정합니다.
 *
 * 환경 변수 (선택):
 *   TWA_MANIFEST_URL  — 기본 https://transport-community-c5fc1.web.app/manifest.json
 *   TWA_PACKAGE_ID    — 기본 com.unsat
 *   TWA_KEY_ALIAS     — 기본 unsat
 *
 * 이후: JDK 17 설치 → play-android/android.keystore 생성 → npm run play:build
 */
import crypto from "node:crypto";
import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { TwaManifest, TwaGenerator, ConsoleLog } from "@bubblewrap/core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "play-android");

const MANIFEST_URL =
  process.env.TWA_MANIFEST_URL || "https://transport-community-c5fc1.web.app/manifest.json";
const PACKAGE_ID = process.env.TWA_PACKAGE_ID || "com.unsat";
const KEY_ALIAS = process.env.TWA_KEY_ALIAS || "unsat";

await fsPromises.mkdir(OUT, { recursive: true });

const twa = await TwaManifest.fromWebManifest(MANIFEST_URL);
twa.packageId = PACKAGE_ID;
twa.enableNotifications = false;
twa.signingKey = {
  path: path.join(OUT, "android.keystore"),
  alias: KEY_ALIAS,
};
twa.appVersionCode = 1;
twa.appVersionName = "1";

const err = twa.validate();
if (err) {
  console.error("twa-manifest 검증 실패:", err);
  process.exit(1);
}

const manifestPath = path.join(OUT, "twa-manifest.json");
await twa.saveToFile(manifestPath);

const log = new ConsoleLog("generate-play-android");
const gen = new TwaGenerator();
await gen.createTwaProject(OUT, twa, log);

const sum = crypto.createHash("sha1").update(await fsPromises.readFile(manifestPath)).digest("hex");
await fsPromises.writeFile(path.join(OUT, "manifest-checksum.txt"), sum);

const gradleProps = path.join(OUT, "gradle.properties");
try {
  let gp = await fsPromises.readFile(gradleProps, "utf8");
  if (!gp.includes("android.overridePathCheck")) {
    gp += "\nandroid.overridePathCheck=true\n";
    await fsPromises.writeFile(gradleProps, gp, "utf8");
  }
} catch (_) {}

const readme = `운사트 — Google Play용 Android TWA
====================================
패키지: ${PACKAGE_ID}
웹 매니페스트: ${MANIFEST_URL}

1) JDK 17 + keytool. 키스토어 없으면 이 폴더에서:
   keytool -genkeypair -v -storetype PKCS12 -keystore android.keystore -alias ${KEY_ALIAS} -keyalg RSA -keysize 2048 -validity 10000 -storepass "비밀번호" -keypass "비밀번호" -dname "CN=Unsat, OU=Mobile, O=Unsat, L=Seoul, ST=Seoul, C=KR"

2) 루트에서 npm run play:fingerprint → SHA256을 public/.well-known/assetlinks.json 에 반영 후 firebase deploy (Hosting)

3) 루트에서 npm run play:build → app-release-bundle.aab 를 Play Console에 업로드

커스텀 도메인(unsat.co.kr)만 쓸 경우 Firebase에 연결 후:
  set TWA_MANIFEST_URL=https://unsat.co.kr/manifest.json
  npm run play:generate
`;
await fsPromises.writeFile(path.join(OUT, "README.txt"), readme, "utf8");

console.log("\n생성 완료:", OUT);
console.log("다음: play-android/README.txt 참고\n");
