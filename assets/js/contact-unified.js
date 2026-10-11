/* 펜타곤 문의/견적 통합 접수 — GitHub Pages 이메일 작성 방식 */
(function () {
  'use strict';
  const form = document.getElementById('ptgContactForm');
  if (!form) return;
  const $ = id => document.getElementById(id);
  const params = new URLSearchParams(window.location.search);
  const modeInputs = Array.from(form.querySelectorAll('input[name="ptgRequestType"]'));
  const quoteArea = $('ptgQuoteFields');
  const corpArea = $('ptgQuoteCorporate');
  const estateArea = $('ptgQuoteRealestate');
  const quoteKind = $('ptgQuoteKind');
  const status = $('contactStatus');
  const category = $('contactCategory');
  const message = $('contactMessage');
  const title = $('ptgContactFormTitle');
  const submit = form.querySelector('.ptg-submit');
  const mailFallback = $('contactMailFallback');
  const processNote = $('ptgRequestProcessNote');
  const quoteWork = $('contactCorpWork');
  const quoteCapital = $('contactCorpAmount');
  const quoteRegion = $('contactCorpRegion');
  const quoteEstimate = $('contactCorpEstimate');
  const format = value => {
    const n = Number(String(value || '').replace(/[^0-9]/g,''));
    return Number.isFinite(n) && n > 0 ? n.toLocaleString('ko-KR') : '';
  };
  const get = id => ($(id)?.value || '').trim();
  function readMode() { return modeInputs.find(el => el.checked)?.value || 'general'; }
  function updateMode() {
    const mode = readMode();
    const isEstimate = mode === 'estimate';
    const realEstate = isEstimate && quoteKind.value === 'realestate';
    quoteArea.hidden = !isEstimate;
    corpArea.hidden = !isEstimate || realEstate;
    estateArea.hidden = !realEstate;
    message.required = !isEstimate;
    if (isEstimate) {
      category.value = realEstate ? '부동산·재개발·재건축' : '법인설립·등기';
    }
    if (title) title.textContent = isEstimate ? '등기 견적 신청' : '상담 요청';
    if (submit) submit.textContent = isEstimate ? '메일 앱에서 견적 신청하기 →' : '메일 앱에서 상담 문의하기 →';
    if (processNote) processNote.textContent = isEstimate
      ? '견적 정보를 작성하면 하나의 문의 창구로 연결됩니다. 메일 앱에서 전송을 완료해야 신청됩니다.'
      : '상담 내용과 연락처를 남겨주세요. 메일 앱에서 전송을 완료해야 접수됩니다.';
    if (status) status.textContent = '';
    if (mailFallback) mailFallback.hidden = true;
  }
  modeInputs.forEach(el => el.addEventListener('change', updateMode));
  quoteKind.addEventListener('change', updateMode);
  function fillFromQuery() {
    const isEstimate = params.get('type') === 'estimate';
    if (isEstimate) {
      const mode = modeInputs.find(i => i.value === 'estimate');
      if (mode) mode.checked = true;
      if (params.get('service') === 'realestate') quoteKind.value = 'realestate';
      else quoteKind.value = 'corporate';
    }
    const safeValue = (name, maxLength = 250) => (params.get(name) || '').slice(0,maxLength);
    if (safeValue('work')) quoteWork.value = safeValue('work');
    if (safeValue('capital')) quoteCapital.value = format(safeValue('capital'));
    const region = safeValue('region',50);
    if (region && Array.from(quoteRegion.options).some(option => option.value === region)) quoteRegion.value = region;
    if (safeValue('estimated')) quoteEstimate.value = format(safeValue('estimated')) + '원';
    if (safeValue('name')) $('contactName').value = safeValue('name',100);
    if (safeValue('phone')) $('contactPhone').value = safeValue('phone',40);
    updateMode();
  }
  quoteCapital.addEventListener('input', () => { quoteCapital.value = format(quoteCapital.value); });
  const estimateLink = $('ptgQuoteBackLink');
  if (estimateLink) estimateLink.href = '../fees/#feeCalculator';
  fillFromQuery();
  if (params.get('type') === 'estimate' && window.location.hash === '#ptgContactFormTitle') {
    window.addEventListener('load', function () {
      const heading = $('ptgContactFormTitle');
      if (heading) heading.scrollIntoView({behavior:'auto',block:'start'});
    }, {once:true});
  }

  // 서비스별 안내와 입력 필드는 전환 즉시 갱신됩니다.
  const quoteService = () => quoteKind.value === 'realestate' ? '부동산등기' : '법인등기';
  const errors = () => {
    if (!get('contactName')) return '이름을 입력해주세요.';
    if (!get('contactPhone')) return '연락처를 입력해주세요.';
    const email = $('contactEmail');
    if (email.value.trim() && !email.checkValidity()) return '이메일 주소를 확인해주세요.';
    if (readMode() === 'general') {
      if (!category.value) return '문의 분야를 선택해주세요.';
      if (!get('contactMessage')) return '문의 내용을 입력해주세요.';
    } else if (quoteKind.value === 'corporate') {
      if (!get('contactCorpWork')) return '법인등기 업무를 입력해주세요.';
    } else {
      if (!get('contactEstateType')) return '등기 종류를 선택해주세요.';
      if (!get('contactEstateAddress')) return '부동산 소재지 주소를 입력해주세요.';
    }
    if (!$('contactConsent').checked) return '개인정보 수집·이용 동의를 확인해주세요.';
    return '';
  };

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const error = errors();
    if (error) { status.textContent = error; status.setAttribute('role','alert'); return; }
    status.removeAttribute('role');
    const isQuote = readMode() === 'estimate';
    const service = isQuote ? quoteService() : category.value;
    const lines = [
      isQuote ? '[펜타곤 등기 견적 신청]' : '[펜타곤 일반 상담 문의]',
      '', '이름: ' + get('contactName'),
      '연락처: ' + get('contactPhone'),
      '이메일: ' + (get('contactEmail') || '미입력'),
      '회사명: ' + (get('contactCompany') || '미입력'),
      '접수 유형: ' + (isQuote ? '견적 신청' : '일반 상담'),
      '문의 분야: ' + (category.value || '미선택'),
      '중요 기한: ' + (get('contactDeadline') || '없음')
    ];
    if (isQuote && quoteKind.value === 'corporate') {
      lines.push('', '[법인등기 견적 정보]',
        '등기 업무: ' + get('contactCorpWork'),
        '자본금 또는 증자금액: ' + (get('contactCorpAmount') || '미입력'),
        '설립 지역 및 중과 조건: ' + ($('contactCorpRegion').selectedOptions[0]?.textContent || '미선택'),
        '계산기 예상 금액: ' + (get('contactCorpEstimate') || '미계산'));
    }
    if (isQuote && quoteKind.value === 'realestate') {
      lines.push('', '[부동산등기 견적 정보]',
        '등기 종류: ' + get('contactEstateType'),
        '신청자 구분: ' + get('contactEstateApplicant'),
        '관련 금액: ' + (get('contactEstateAmount') || '미입력'),
        '부동산 소재지: ' + get('contactEstateAddress'),
        '상세주소: ' + (get('contactEstateAddress2') || '미입력'));
    }
    const chosenFiles = Array.from($('contactFiles').files).map(file => file.name);
    lines.push('', '첨부 예정 파일: ' + (chosenFiles.join(', ') || '없음'),
      '', '추가 문의 내용:', get('contactMessage') || '없음',
      '', '※ 선택한 파일은 자동 전송되지 않습니다. 메일 앱에서 직접 첨부해 주세요.',
      '※ 계산기 예상 비용은 확정 견적이 아닙니다.');
    const subject = '[펜타곤 ' + (isQuote ? '견적신청' : '상담문의') + '] ' + get('contactName') + ' / ' + service;
    const link = 'mailto:yhchae@ptglaw.co.kr?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
    if (mailFallback) { mailFallback.href = link; mailFallback.hidden = false; }
    status.textContent = '메일 작성 창이 열리면 내용을 확인하고 전송해주세요. 파일은 메일 앱에서 직접 첨부해야 합니다. 메일 앱이 열리지 않으면 아래 링크를 눌러주세요.';
    window.location.href = link;
  });
})();