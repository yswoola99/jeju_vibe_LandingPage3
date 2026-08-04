// Google Apps Script 웹 앱 배포 후 발급되는 URL로 교체하세요.
// 설정 방법: google-apps-script/README.md 참고
const APPLY_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxfleayIqRg6re7zyXh3BDo6xDkwelvq8Bna5pzoC8QL5f_jUG9ULM3hRtNoDF9WfyR/exec';

document.addEventListener('DOMContentLoaded', () => {
  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach((item) => {
    const question = item.querySelector('.faq-q');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach((openItem) => {
        if (openItem !== item) openItem.classList.remove('open');
      });
      item.classList.toggle('open', !isOpen);
    });
  });

  // Apply form submit -> Google Apps Script backend
  const form = document.getElementById('applyForm');
  const success = document.getElementById('applySuccess');
  const submitBtn = form.querySelector('button[type="submit"]');
  const submitBtnDefaultText = submitBtn.textContent;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = '신청 중...';

    try {
      // Apps Script는 CORS 응답 헤더를 제공하지 않으므로 no-cors 모드로 전송합니다.
      // 이 모드에서는 응답 내용을 읽을 수 없어, 네트워크 요청이 성공적으로
      // 전달되었는지(서버 응답이 아닌) 여부만으로 성공을 판단합니다.
      await fetch(APPLY_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        body: new FormData(form),
      });

      form.hidden = true;
      success.hidden = false;
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      alert('신청 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = submitBtnDefaultText;
    }
  });

  // Header shadow on scroll
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 8 ? '0 4px 16px rgba(0,0,0,0.06)' : 'none';
  });
});
