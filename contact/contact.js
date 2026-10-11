/* 펜타곤 통합 문의 — 일반 상담 / 법인등기 / 부동산등기
   GitHub Pages용 mailto 초안 생성. 서버 접수 및 파일 전송 기능 없음.
*/
(() => {
  'use strict';
  const form=document.getElementById('ptgContactForm');
  if(!form)return;
  const $=id=>document.getElementById(id);
  const params=new URLSearchParams(window.location.search);
  const radios=Array.from(form.querySelectorAll('input[name="ptgRequestType"]'));
  const result=$('contactStatus');
  const sendButton=form.querySelector('.contact-submit');
  const fallback=$('contactMailFallback');
  const category=$('contactCategory');
  const message=$('contactMessage');
  const corpPanel=$('ptgQuoteCorporate');
  const realPanel=$('ptgQuoteRealestate');
  const generalPanel=$('ptgGeneralFields');
  const detailsArea=$('ptgQuoteFields');
  const processNote=$('ptgRequestProcessNote');
  const fmt=v=>{
    const n=Number(String(v||'').replace(/[^0-9]/g,''));
    return Number.isFinite(n)&&n>0?n.toLocaleString('ko-KR'):'';
  };
  const value=id=>($(id)?.value||'').trim();
  const mode=()=>radios.find(r=>r.checked)?.value||'general';
  const serviceName=m=>m==='corporate'?'법인등기':m==='realestate'?'부동산등기':'일반 상담';
  function update(){
    const m=mode();
    const quote=m!=='general';
    detailsArea.hidden=!quote;
    generalPanel.hidden=quote;
    corpPanel.hidden=m!=='corporate';
    realPanel.hidden=m!=='realestate';
    if(quote){
      category.value=m==='corporate'?'법인설립·등기':'부동산·재개발·재건축';
    }else if(category.value==='법인설립·등기'||category.value==='부동산·재개발·재건축'){
      // Preserve user's selection when returning to general inquiries.
    }
    message.required=!quote;
    if(processNote)processNote.textContent=quote
      ?'업무 내용을 작성하시면 확인 후 견적과 필요한 절차를 안내드립니다.'
      :'현재 상황과 필요한 내용을 남겨주시면 담당자가 확인 후 연락드립니다.';
    if(sendButton)sendButton.textContent=quote?'이메일로 견적 요청하기 →':'이메일로 문의하기 →';
    if(fallback)fallback.hidden=true;
    if(result)result.textContent='';
  }
  radios.forEach(r=>r.addEventListener('change',update));
  const requested=params.get('type')==='estimate';
  const chosen=requested?(params.get('service')==='realestate'?'realestate':'corporate'):'general';
  radios.forEach(r=>{r.checked=r.value===chosen;});
  const safe=(name,length=180)=>(params.get(name)||'').slice(0,length);
  if(safe('work'))$('contactCorpWork').value=safe('work');
  if(safe('capital'))$('contactCorpAmount').value=fmt(safe('capital'));
  if(safe('estimated'))$('contactCorpEstimate').value=fmt(safe('estimated'))+'원';
  const region=safe('region',32);
  const regionInput=$('contactCorpRegion');
  if(region&&Array.from(regionInput.options).some(o=>o.value===region))regionInput.value=region;
  if(safe('name'))$('contactName').value=safe('name',100);
  if(safe('phone'))$('contactPhone').value=safe('phone',40);
  $('contactCorpAmount').addEventListener('input',e=>{e.target.value=fmt(e.target.value);});
  update();
  if(requested&&window.location.hash==='#ptgContactFormTitle'){
    window.addEventListener('load',()=>{
      $('ptgContactFormTitle')?.scrollIntoView({behavior:'auto',block:'start'});
    },{once:true});
  }
  function validation(){
    if(mode()==='general'){
      if(!category.value)return '문의 분야를 선택해주세요.';
      if(!value('contactMessage'))return '문의 내용을 입력해주세요.';
    }
    if(mode()==='corporate'&&!value('contactCorpWork'))return '법인등기 업무를 입력해주세요.';
    if(mode()==='realestate'){
      if(!value('contactEstateType'))return '등기 종류를 선택해주세요.';
      if(!value('contactEstateAddress'))return '부동산 소재지를 입력해주세요.';
    }
    if(!value('contactName'))return '성함을 입력해주세요.';
    if(!value('contactPhone'))return '연락처를 입력해주세요.';
    const email=$('contactEmail');
    if(email.value.trim()&&!email.checkValidity())return '이메일 형식을 확인해주세요.';
    if(!$('contactConsent').checked)return '개인정보 수집·이용에 동의해주세요.';
    return '';
  }
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const error=validation();
    if(error){
      result.textContent=error;
      result.setAttribute('role','alert');
      return;
    }
    result.removeAttribute('role');
    const m=mode();
    const lines=[
      m==='general'?'[펜타곤 상담 문의]':'[펜타곤 등기 견적 요청]',
      '',
      '문의 유형: '+serviceName(m),
      '이름: '+value('contactName'),
      '연락처: '+value('contactPhone'),
      '이메일: '+(value('contactEmail')||'미입력'),
      '회사/법인명: '+(value('contactCompany')||'미입력'),
      '문의 분야: '+category.value,
      '중요 기한: '+(value('contactDeadline')||'없음')
    ];
    if(m==='corporate'){
      lines.push('','[법인등기 정보]',
        '등기 업무: '+value('contactCorpWork'),
        '자본금/증자금액: '+(value('contactCorpAmount')||'미입력'),
        '설립 지역 및 중과 조건: '+(regionInput.selectedOptions[0]?.textContent||'미선택'),
        '계산기 예상 금액: '+(value('contactCorpEstimate')||'미계산'));
    }
    if(m==='realestate'){
      lines.push('','[부동산등기 정보]',
        '등기 종류: '+value('contactEstateType'),
        '신청자 구분: '+value('contactEstateApplicant'),
        '관련 금액: '+(value('contactEstateAmount')||'미입력'),
        '부동산 소재지: '+value('contactEstateAddress'),
        '상세주소: '+(value('contactEstateAddress2')||'미입력'));
    }
    lines.push('','문의 내용:',value('contactMessage')||'없음',
      '','※ 관련 파일은 이메일 작성 창에서 직접 첨부해 주세요.',
      '※ 예상 비용은 확정 견적이 아니며 최종 금액은 담당자 검토 후 안내됩니다.');
    const subject='[펜타곤 '+(m==='general'?'상담 문의':'견적 요청')+'] '+value('contactName')+' / '+serviceName(m);
    const link='mailto:yhchae@ptglaw.co.kr?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(lines.join('\n'));
    if(fallback){fallback.href=link;fallback.hidden=false;}
    result.textContent='메일 작성 창이 열립니다. 내용을 확인한 뒤 메일에서 보내기를 눌러야 접수됩니다.';
    window.location.href=link;
  });
})();
