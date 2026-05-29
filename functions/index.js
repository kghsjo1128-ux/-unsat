/**
 * 운사트 Cloud Functions — 인증·App Check·감사 로그
 * 배포: firebase deploy --only functions (Blaze 요금제 필요)
 */
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const REQUIRE_APP_CHECK = process.env.REQUIRE_APP_CHECK === 'true';

function assertAppCheck(context) {
  if (process.env.FUNCTIONS_EMULATOR === 'true') return;
  if (!REQUIRE_APP_CHECK) return;
  if (!context.app) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'App Check 토큰이 필요합니다. 앱을 최신으로 업데이트하고 콘솔에서 App Check를 확인하세요.'
    );
  }
}

/** Auth 사용자 삭제 시 Firestore 잔여 데이터 정리 (users 문서는 클라이언트가 먼저 지울 수 있음) */
exports.onAuthUserDelete = functions.auth.user().onDelete(async (user) => {
  const uid = user.uid;
  const db = admin.firestore();
  const batchLimit = 400;
  let batch = db.batch();
  let n = 0;

  async function commitIfNeeded(force) {
    if (n === 0 && !force) return;
    if (n >= batchLimit || force) {
      await batch.commit();
      batch = db.batch();
      n = 0;
    }
  }

  try {
    const privSnap = await db.collection('users').doc(uid).collection('private').get();
    privSnap.docs.forEach((d) => {
      batch.delete(d.ref);
      n++;
    });
    await commitIfNeeded(false);

    const consentSnap = await db.collection('consentLog').where('uid', '==', uid).get();
    consentSnap.docs.forEach((d) => {
      batch.delete(d.ref);
      n++;
    });
    await commitIfNeeded(false);

    const resumeSnap = await db.collection('resumes').where('ownerUid', '==', uid).get();
    resumeSnap.docs.forEach((d) => {
      batch.delete(d.ref);
      n++;
    });
    await commitIfNeeded(false);

    const viewsSnap = await db.collection('resumeViewLog').where('viewerUid', '==', uid).get();
    viewsSnap.docs.forEach((d) => {
      batch.delete(d.ref);
      n++;
    });
    await commitIfNeeded(true);

    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();
    if (userDoc.exists) {
      await userRef.delete();
    }
  } catch (e) {
    console.error('onAuthUserDelete cleanup error', uid, e);
  }
});

/** 개인정보 필드 접근 기록 (클라이언트에서 호출) */
exports.logPiiAccess = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', '로그인이 필요합니다.');
  }
  assertAppCheck(context);

  const field = (data && data.field) || '';
  const action = (data && data.action) || 'read';
  const targetUid = (data && data.targetUid) || null;
  if (!field || typeof field !== 'string' || field.length > 120) {
    throw new functions.https.HttpsError('invalid-argument', 'field 가 올바르지 않습니다.');
  }

  await admin.firestore().collection('piiAccessLog').add({
    actorUid: context.auth.uid,
    action: String(action).slice(0, 64),
    field: field.slice(0, 120),
    targetUid: targetUid && typeof targetUid === 'string' ? targetUid.slice(0, 128) : null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return { ok: true };
});

/** 이력서 열람 기록 */
exports.logResumeView = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', '로그인이 필요합니다.');
  }
  assertAppCheck(context);

  const resumeId = data && data.resumeId;
  const resumeOwnerUid = data && data.resumeOwnerUid;
  if (!resumeId || !resumeOwnerUid || typeof resumeId !== 'string' || typeof resumeOwnerUid !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'resumeId, resumeOwnerUid 가 필요합니다.');
  }
  if (resumeOwnerUid === context.auth.uid) {
    return { ok: true, skipped: true };
  }

  await admin.firestore().collection('resumeViewLog').add({
    viewerUid: context.auth.uid,
    resumeId: resumeId.slice(0, 200),
    resumeOwnerUid: resumeOwnerUid.slice(0, 128),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return { ok: true };
});
