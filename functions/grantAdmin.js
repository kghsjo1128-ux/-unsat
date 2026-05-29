/**
 * 관리자 Custom Claim 부여 (1회성 운영 스크립트)
 *
 * 사용 전:
 *  1) Firebase 콘솔 → 프로젝트 설정 → 서비스 계정 → 새 비공개 키 JSON 저장
 *  2) PowerShell:
 *     $env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\serviceAccount.json"
 *     cd functions
 *     npm install
 *     node grantAdmin.js admin@example.com
 */
const admin = require('firebase-admin');
const email = process.argv[2];

if (!email) {
  console.error('사용법: node grantAdmin.js <관리자_이메일>');
  process.exit(1);
}

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('GOOGLE_APPLICATION_CREDENTIALS 환경변수에 서비스 계정 JSON 경로를 설정하세요.');
  process.exit(1);
}

admin.initializeApp({ credential: admin.credential.applicationDefault() });

(async () => {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log('OK — admin 클레임이 설정되었습니다:', email, 'uid=', user.uid);
    console.log('※ 사용자에게 재로그인(또는 토큰 갱신)이 필요할 수 있습니다.');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
  process.exit(0);
})();
