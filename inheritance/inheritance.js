/* Inheritance service picker — aligned to corporate center 4-card selector */
(()=>{
  'use strict';
  const root=document.querySelector('.pi-inheritance');
  if(!root)return;
  const $=sel=>root.querySelector(sel);
  const tabs=Array.from(root.querySelectorAll('[data-inherit-service]'));
  const panel=$('#piServiceDetail');
  const title=$('#piDetailTitle'),intro=$('#piDetailIntro');
  const tags=$('#piDetailTags'),checks=$('#piDetailChecks');
  const docs=$('#piDetailDocs'),note=$('#piDetailNote');
  const step=$('#piDetailStep');
  if(!panel||!title||!intro||!tags||!checks||!docs||!note||!step||tabs.length!==4)return;

  const services={
    division:{
      title:'상속재산분할협의',
      intro:'상속인과 상속재산을 확인하고 각 상속인의 협의 내용을 정리합니다.',
      tags:['상속인 확인','재산·채무 파악','상속재산분할협의서','협의 내용 정리'],
      checks:['상속인과 법정상속분 확인','부동산·금융재산·채무 등 재산 범위 검토','분할 방식 협의 및 조율','협의서 작성과 날인 서류 점검'],
      docs:['가족관계증명서·기본증명서 등 관계 자료','확인된 상속재산 및 채무 목록','기존 협의 내용과 관련 서류'],
      note:'상속인이 여러 명이거나 협의가 진행 중인 경우에도 현재 확인된 내용부터 상담할 수 있습니다.',
      step:'INHERITANCE AGREEMENT'
    },
    tax:{
      title:'상속세 신고대행',
      intro:'상속재산 구성과 신고 대상 여부를 검토하고 필요한 자료를 정리합니다.',
      tags:['상속재산 평가','공제 사항 검토','신고자료 준비','상속세 신고'],
      checks:['상속재산·채무와 증여 내역 등 사실관계 파악','공제 및 재산 평가 항목 검토','신고 대상 자료 정리','상속세 신고 절차 안내와 진행'],
      docs:['부동산·금융재산 등 재산 관련 자료','채무 및 지출 등 관련 증빙','상속인·피상속인 기본 자료'],
      note:'세금의 실제 계산과 신고 필요 여부는 재산 구성·상속인 관계·법령 적용 등에 따라 달라질 수 있습니다.',
      step:'INHERITANCE TAX'
    },
    registration:{
      title:'부동산 상속등기',
      intro:'상속관계 및 분할협의 내용을 검토해 필요한 부동산 등기를 진행합니다.',
      tags:['등기 대상 확인','권리관계 확인','등기서류 준비','상속등기 신청'],
      checks:['상속 대상 부동산과 소유권 현황 확인','분할협의에 따른 등기 방식 검토','필요한 증명서와 등기 서류 준비','상속등기 신청 및 완료 사항 확인'],
      docs:['대상 부동산 등기·소재지 자료','상속인 관계 및 분할협의서 등 해당 서류','인감 관련 서류 등 필요 자료'],
      note:'상속등기는 일반 부동산등기 간편견적이 아니라 펜타곤 상속원스톱서비스에서 별도로 상담합니다.',
      step:'INHERITANCE REGISTRATION'
    },
    debt:{
      title:'상속포기·한정승인 등',
      intro:'상속재산보다 채무가 많거나 뒤늦게 채무를 확인한 경우 별도 절차를 검토합니다.',
      tags:['상속포기','한정승인','특별한정승인','상속재산파산'],
      checks:['상속개시 시점 및 상속인 관계 확인','재산·채무 내역 검토','상속포기·한정승인 등 해당 절차 판단','필요한 신청·공고·변제 절차 안내'],
      docs:['상속인 및 피상속인 관계 자료','재산·채무 목록과 채권자 통지 자료','상속개시 사실을 알게 된 시점 등 관련 자료'],
      note:'상속포기·한정승인 관련 신청 기간과 예외 요건 등은 사건별로 검토해야 합니다. 아래 기타 상속 절차 비용도 참고하세요.',
      step:'DEBT & OTHER PROCEDURES'
    }
  };
  const esc=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  let active='division';
  function setService(key,moveFocus=false){
    const service=services[key];if(!service)return;
    active=key;
    tabs.forEach(tab=>{
      const selected=tab.dataset.inheritService===key;
      tab.classList.toggle('is-selected',selected);
      tab.setAttribute('aria-selected',String(selected));
      tab.tabIndex=selected?0:-1;
      if(selected&&moveFocus)tab.focus();
    });
    panel.setAttribute('aria-labelledby',tabs.find(tab=>tab.dataset.inheritService===key)?.id||'');
    title.textContent=service.title;
    intro.textContent=service.intro;
    step.textContent=service.step;
    tags.innerHTML=service.tags.map(t=>'<span>'+esc(t)+'</span>').join('');
    checks.innerHTML=service.checks.map(t=>'<li>'+esc(t)+'</li>').join('');
    docs.innerHTML=service.docs.map(t=>'<li>'+esc(t)+'</li>').join('');
    note.textContent=service.note;
    const link=$('#piDetailFeesLink');
    if(link)link.href=key==='debt'?'#pi-other-services':'#ptg-price';
  }
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>setService(tab.dataset.inheritService));
    tab.addEventListener('keydown',e=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
      e.preventDefault();
      const next=e.key==='Home'?0:e.key==='End'?tabs.length-1:
       (index+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
      setService(tabs[next].dataset.inheritService,true);
    });
  });
  const route=new URLSearchParams(location.search).get('service');
  setService(services[route]?route:'division');
})();