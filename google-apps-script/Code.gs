// ============================================================
// 제주 AI 바이브코딩 - 무료 체험 신청 백엔드 (Google Apps Script)
//
// 이 스크립트는 신청 폼이 제출되면
//   1) Google Sheet에 신청 내역을 저장하고
//   2) 관리자(NOTIFY_EMAIL)에게 알림 메일을 보내고
//   3) 신청자에게 "접수되었습니다" 자동회신 메일을 보냅니다.
//
// 설정 방법은 이 파일과 같은 폴더의 README.md를 참고하세요.
// ============================================================

const NOTIFY_EMAIL = 'yswoola99@gmail.com'; // 신청 알림을 받을 이메일
const SHEET_NAME = '신청내역';               // 데이터를 저장할 시트 이름

function doPost(e) {
  try {
    const params = e.parameter;
    const name = (params.name || '').trim();
    const phone = (params.phone || '').trim();
    const email = (params.email || '').trim();
    const job = jobLabel(params.job);
    const message = (params.message || '').trim();
    const timestamp = new Date();

    if (!name || !phone || !email) {
      throw new Error('필수 항목이 누락되었습니다.');
    }

    saveToSheet(timestamp, name, phone, email, job, message);
    notifyAdmin(name, phone, email, job, message);
    sendAutoReply(name, email);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput('제주 AI 바이브코딩 신청 접수 엔드포인트가 정상 동작 중입니다.');
}

function jobLabel(value) {
  const map = { office: '직장인', business: '자영업자', etc: '기타' };
  return map[value] || value || '';
}

function saveToSheet(timestamp, name, phone, email, job, message) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['신청일시', '이름', '연락처', '이메일', '현재상태', '메시지']);
    sheet.setFrozenRows(1);
  }
  sheet.appendRow([timestamp, name, phone, email, job, message]);
}

function notifyAdmin(name, phone, email, job, message) {
  const subject = `[제주AI바이브코딩] 새 무료 체험 신청 - ${name}`;
  const body =
    '새로운 무료 체험 신청이 접수되었습니다.\n\n' +
    `이름: ${name}\n` +
    `연락처: ${phone}\n` +
    `이메일: ${email}\n` +
    `현재 상태: ${job}\n` +
    `남긴 메시지: ${message || '(없음)'}\n`;
  MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}

function sendAutoReply(name, email) {
  const subject = '[제주AI바이브코딩] 무료 체험 신청이 접수되었습니다';
  const body =
    `${name}님, 안녕하세요.\n\n` +
    '제주 AI 바이브코딩 무료 체험 클래스 신청이 정상적으로 접수되었습니다.\n' +
    '담당자가 남겨주신 연락처로 1~2일 내에 안내드리겠습니다.\n\n' +
    '감사합니다.\n제주 AI 바이브코딩 드림';
  MailApp.sendEmail(email, subject, body);
}
