/* 펜타곤 법인등기 수수료 안내 — 제공된 '펜타곤 수수료.hwpx' 기준, 2026-10-08 */
(function () {
  'use strict';
  const W = 28000000;
  const common = '전자등기 기준 안내이며, 서류등기 시 추가 비용이 발생할 수 있습니다.';
  const groups = [
    { id:'establish', name:'법인설립', lead:'설립 형태와 자본금, 지역에 따라 비용이 달라집니다.', items:[
      { title:'주식회사 설립', kind:'formation', tax:135000, filing:20000, fee:240900, note:'자본금 2,800만원·비과밀지역 기준 예시입니다. 과밀지역은 등록면허세 등 405,000원입니다. 자본금 10억원 이상은 별도 문의가 필요합니다.' },
      { title:'유한회사 설립', fee:383900, feeOnly:true },
      { title:'유한책임회사 설립', fee:416900, feeOnly:true },
      { title:'농업회사법인 · 어업회사법인 설립', fee:526900, feeOnly:true }
    ]},
    { id:'office', name:'본점이전', lead:'관할 내·외 여부에 따라 등기신청수수료가 다릅니다.', items:[
      { title:'관할 외 본점이전', tax:135000, filing:20000, fee:218900, note:'지방에서 서울로 이전하거나 비과밀지역에서 과밀지역으로 이전하는 경우 공과금이 추가될 수 있습니다.' },
      { title:'관할 내 본점이전', tax:135000, filing:2000, fee:152900 }
    ]},
    { id:'director', name:'임원 · 대표자', lead:'임원 변경, 외국인 임원, 대표이사 주소 변경 등기입니다.', items:[
      { title:'임원 변경 (한국인)', tax:48240, filing:2000, fee:185900 },
      { title:'임원 변경 (외국인)', tax:48240, filing:5000, notary:30000, consult:true, note:'펜타곤 수수료는 상담 후 안내합니다.' },
      { title:'대표이사 자택주소 변경', tax:48240, filing:2000, fee:130900 }
    ]},
    { id:'capital', name:'주식 · 자본금 변경', lead:'증자 종류와 과밀억제권역·설립 후 경과기간에 따라 등록면허세 등이 달라집니다.', items:[
      { title:'유상증자', kind:'increase', tax:135000, filing:2000, otp:18000, fee:394900, note:'증자금액 2,800만원·비과밀지역 기준 예시입니다.' },
      { title:'무상증자', kind:'bonus', tax:135000, filing:2000, otp:18000, fee:713900, note:'증자금액 2,800만원·비과밀지역 기준 예시입니다.' },
      { title:'가수금증자', kind:'loan', tax:135000, filing:2000, otp:18000, fee:603900, note:'증자금액 2,800만원·비과밀지역 기준 예시입니다.' },
      { title:'유상감자 · 무상감자', tax:48240, filing:2000, otp:18000, fee:880000, extra:'신문공고비 별도', note:'공증료 없음. 감자 유형과 진행 조건에 따른 추가 비용은 별도 안내합니다.' },
      { title:'발행할 예정주식수 변경', tax:48240, filing:2000, otp:18000, fee:174900 }
    ]},
    { id:'incentive', name:'스톡옵션 · RSU', lead:'스톡옵션 및 성과조건부 주식 관련 등기·절차입니다.', items:[
      { title:'스톡옵션 설정 등기', tax:48240, filing:2000, otp:18000, fee:174900 },
      { title:'스톡옵션 부여 · 취소', notary:30000, fee:119900, note:'등록면허세와 등기신청수수료 없음.' },
      { title:'스톡옵션 행사에 따른 증자', kind:'exercise', tax:135000, filing:2000, otp:18000, fee:624800, note:'증자금액 2,800만원·비과밀지역 기준 예시입니다.' },
      { title:'주식양도제한 등기', tax:48240, filing:2000, otp:18000, fee:174900 },
      { title:'성과조건부 주식(RSU) 규정 신설 · 변경 · 폐지', tax:48240, filing:2000, otp:18000, fee:174900 },
      { title:'성과조건부 주식(RSU) 부여 · 취소', notary:30000, fee:220000, note:'등록면허세와 등기신청수수료 없음.' }
    ]},
    { id:'articles', name:'상호 · 목적 · 공고방법', lead:'법인등기 사항의 변경에 필요한 세금·실비·보수입니다.', items:[
      { title:'상호변경', tax:48240, filing:2000, stamp:15000, fee:222900, note:'법인인감도장 제작비용 15,000원 포함.' },
      { title:'목적변경', tax:48240, filing:2000, fee:207900 },
      { title:'공고방법 변경', tax:48240, filing:2000, fee:207900 }
    ]},
    { id:'branch', name:'지점 · 지배인', lead:'지점 설치·이전·폐지 및 지배인 변경에 관한 등기입니다.', items:[
      { title:'지점설치', tax:48240, filing:2000, fee:174900, note:'수도권 과밀억제권역에 지점을 설치하는 경우 등록면허세와 지방교육세가 중과될 수 있습니다.' },
      { title:'지점이전 · 지점폐지', tax:48240, filing:2000, fee:174900, note:'과밀억제권역 등 개별 조건에 따른 공과금 변동 여부를 확인해야 합니다.' },
      { title:'지배인 선임 · 사임', tax:48240, filing:2000, fee:174900 }
    ]},
    { id:'close', name:'법인 해산 · 청산', lead:'해산·청산의 각 단계별 수수료와 신문공고비를 안내합니다.', items:[
      { title:'법인 해산 · 청산', tax:144720, filing:6000, stampDuty:900, filingSlip:5000, dissolveFee:614900, liquidateFee:484000, extra:'신문공고비 별도', note:'해산 수수료와 청산 수수료를 모두 포함한 합산 예상액입니다.' }
    ]},
    { id:'continue', name:'회사계속', lead:'해산된 회사의 계속등기 관련 비용입니다.', items:[
      { title:'회사계속', tax:96480, filing:10000, notary:30000, fee:361900, note:'서류등기 방식으로만 진행합니다. 신규 임원 취임등기 비용을 포함하며 조건에 따라 추가 비용이 발생할 수 있습니다.' }
    ]}
  ];
  const label = { tax:'등록면허세 등', filing:'등기신청수수료', otp:'보안매체(OTP) 발급', notary:'공증료', stamp:'법인인감도장 제작', stampDuty:'인지대', filingSlip:'해산신고경유증표', dissolveFee:'펜타곤 해산 수수료', liquidateFee:'펜타곤 청산 수수료', fee:'펜타곤 수수료' };
  const keys = Object.keys(label);
  const sum = item => keys.reduce((n,k)=>n + (typeof item[k]==='number'?item[k]:0),0);
  const won = n => new Intl.NumberFormat('ko-KR').format(Math.round(n))+'원';
  const escape = value => String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const catalog = document.getElementById('feesCatalog');
  const menu = document.getElementById('feesCategories');
  const title = document.getElementById('feesGroupTitle');
  const intro = document.getElementById('feesGroupIntro');
  const count = document.getElementById('feesGroupCount');
  if (!catalog || !menu) return;
  let active = groups[0].id;

  function makeCard(item) {
    let rows = keys.filter(k=>typeof item[k]==='number' && item[k]!==0)
      .map(k=>'<div class="fee-line"><span>'+label[k]+'</span><b>'+won(item[k])+'</b></div>').join('');
    const total = sum(item);
    const cost = item.consult ? won(total)+' + 상담 후 안내' : item.feeOnly ? won(item.fee) : won(total);
    const costLabel = item.consult?'확정 전 실비 · 별도 보수':item.feeOnly?'펜타곤 수수료':'예상 총 비용';
    return '<article class="fee-card">'+
      '<div class="fee-card-head"><h3>'+escape(item.title)+'</h3>'+(item.kind?'<span class="fee-card-tag">금액별 계산 가능</span>':'')+'</div>'+
      '<div class="fee-card-price"><span>'+costLabel+'</span><strong>'+cost+'</strong></div>'+
      (item.feeOnly?'<p class="fee-only-msg">공과금 및 등기 실비는 별도 산정됩니다.</p>':'<div class="fee-lines">'+rows+'</div>')+
      (item.extra?'<p class="fee-extra">'+escape(item.extra)+'</p>':'')+
      (item.note?'<p class="fee-card-note">'+escape(item.note)+'</p>':'')+
      (item.kind?'<a class="fee-calc-link" href="#feeCalculator" data-select-calc="'+item.kind+'">내 조건으로 비용 계산하기 </a>':'<a class="fee-calc-link" href="../contact/?type=estimate&amp;service=corporate&amp;work='+encodeURIComponent(item.title)+'#ptgContactFormTitle">이 업무로 견적 문의하기 </a>')+
      '</article>';
  }
  function render() {
    const group = groups.find(g=>g.id===active) || groups[0];
    menu.innerHTML=groups.map(g=>'<button type="button" class="fee-category'+(active===g.id?' is-current':'')+'" data-fee-category="'+g.id+'" aria-pressed="'+(active===g.id)+'">'+escape(g.name)+'<span>'+String(g.items.length).padStart(2,'0')+'</span></button>').join('');
    title.textContent=group.name; intro.textContent=group.lead; count.textContent=group.items.length+'개 업무';
    catalog.innerHTML=group.items.map(makeCard).join('');
  }
  menu.addEventListener('click',event=>{
    const button=event.target.closest('[data-fee-category]');
    if(!button)return;
    active=button.dataset.feeCategory;render();
    if(window.innerWidth<900)title.scrollIntoView({behavior:'smooth',block:'start'});
  });
  render();

  const svc=document.getElementById('feesService');
  const region=document.getElementById('feesRegion');
  const capital=document.getElementById('feesCapital');
  const calcButton=document.getElementById('feesCalculate');
  const result=document.getElementById('feesResult');
  const regionHelp=document.getElementById('feesRegionHelp');
  const capitalLabel=document.getElementById('feesCapitalLabel');
  if(!svc || !region || !capital || !result) return;
  const calculatorItems=groups.flatMap(g=>g.items).filter(i=>i.kind);
  svc.innerHTML=calculatorItems.map(i=>'<option value="'+i.kind+'">'+escape(i.title)+'</option>').join('');

  function setRegions() {
    const isFormation=svc.value==='formation';
    const choices=isFormation?
      [['normal','비과밀지역'],['metro','과밀지역(3배 중과 적용 가정)']]:
      [['normal','비과밀지역'],['over5','과밀억제권역 · 설립 후 5년 경과'],['metro','과밀억제권역 · 설립 후 5년 미만(3배 중과)']];
    const selected=region.value;
    region.innerHTML=choices.map(x=>'<option value="'+x[0]+'">'+x[1]+'</option>').join('');
    region.value=choices.some(x=>x[0]===selected)?selected:'normal';
    capitalLabel.textContent=isFormation?'설립 자본금':'증자 금액';
    regionHelp.textContent=isFormation?'설립 지역에 따라 등록면허세 등 비용이 달라집니다.':'등기 대상 법인의 소재지와 설립 후 경과기간을 선택해 주세요.';
  }
  function resetCalculation(){
    result.innerHTML='<div class="fees-calc-placeholder"><span>ESTIMATED COST</span><strong>예상 비용 계산</strong><p>업무·금액·지역을 선택한 다음 <b>예상 비용 계산하기</b>를 눌러주세요.</p></div>';
  }
  function calculate() {
    const item=calculatorItems.find(i=>i.kind===svc.value);
    const amount=Number(capital.value.replace(/[^0-9]/g,''));
    if(!item || !Number.isFinite(amount) || amount<=0) {
      result.innerHTML='<p class="fee-calc-error">자본금 또는 증자 금액을 입력해 주세요.</p>';return;
    }
    const makeContactUrl=(total)=>{const p=new URLSearchParams({type:'estimate',service:'corporate',work:item.title,capital:String(amount),region:region.value});if(total!=null)p.set('estimated',String(total));return '../contact/?'+p.toString()+'#ptgContactFormTitle'};
    if(item.kind==='formation' && amount>=1000000000) {
      result.innerHTML='<span class="fee-result-eyebrow">별도 상담 대상</span><strong class="fee-result-total">상담 후 안내</strong><p class="fee-result-info">설립 자본금 10억원 이상은 개별 법인구조 및 비용을 상담 후 안내드립니다.</p><a class="fee-result-consult" href="'+makeContactUrl(null)+'">견적 상담 신청하기 </a>';return;
    }
    const multiplier=region.value==='metro'?3:1;
    // 제공 문서: 최소 135,000원(2,800만원 이하), 일반 0.48%, 중과 3배
    // 등록면허세 및 지방교육세의 합산 표시, 개별 사건에서는 세액이 달라질 수 있음.
    const tax=Math.max(135000,Math.round(amount*0.0048))*multiplier;
    const total=tax+item.filing+(item.otp||0)+item.fee;
    const rows=[
      ['등록면허세 등',tax],['등기신청수수료',item.filing],
      ...(item.otp?[['보안매체(OTP) 발급',item.otp]]:[]),
      ['펜타곤 수수료',item.fee]
    ];
    result.innerHTML='<span class="fee-result-eyebrow">예상 총 비용</span><strong class="fee-result-total">'+won(total)+'</strong>'+
      '<div class="fee-result-rows">'+rows.map(p=>'<div><span>'+p[0]+'</span><b>'+won(p[1])+'</b></div>').join('')+'</div>'+
      '<p class="fee-result-info">선택한 업무·금액·지역을 기준으로 계산한 예상 금액입니다. 전자등기 기준이며 실제 세액, 중과 예외, 추가 실비는 상담 후 확정됩니다.</p>'+
      '<a class="fee-result-consult" href="'+makeContactUrl(total)+'">이 계산 결과로 견적 신청하기 </a>';
  }
  function formatCapital() {
    const n=Number(capital.value.replace(/[^0-9]/g,''));
    capital.value=n?n.toLocaleString('ko-KR'):'';
  }
  svc.addEventListener('change',()=>{setRegions();resetCalculation()});
  region.addEventListener('change',resetCalculation);
  capital.addEventListener('input',()=>{formatCapital();resetCalculation()});
  calcButton.addEventListener('click',calculate);
  catalog.addEventListener('click',e=>{
    const a=e.target.closest('[data-select-calc]');
    if(!a)return;
    svc.value=a.dataset.selectCalc;setRegions();resetCalculation();
  });
  setRegions();formatCapital();resetCalculation();

  // Region lookup stays inside the fee calculator page.
  const areaModal=document.getElementById('feesAreaModal');
  const areaOpen=document.getElementById('feesAreaOpen');
  const areaInput=document.getElementById('feesAreaInput');
  const areaResponse=document.getElementById('feesAreaResponse');
  const areaSuggestions=document.getElementById('feesAreaSuggestions');
  let previousFocus=null;
  const closeArea=()=>{areaModal.hidden=true;document.body.style.overflow='';previousFocus?.focus()};
  areaOpen?.addEventListener('click',()=>{previousFocus=document.activeElement;areaModal.hidden=false;document.body.style.overflow='hidden';areaInput.focus()});
  areaModal?.querySelectorAll('[data-fees-area-close]').forEach(x=>x.addEventListener('click',closeArea));
  document.addEventListener('keydown',e=>{
    if(areaModal?.hidden!==false)return;
    if(e.key==='Escape')closeArea();
    if(e.key==='Tab'){
      const nodes=[...areaModal.querySelectorAll('button,input,a')].filter(el=>el.getClientRects().length);
      if(e.shiftKey&&document.activeElement===nodes[0]){e.preventDefault();nodes[nodes.length-1].focus()}
      else if(!e.shiftKey&&document.activeElement===nodes[nodes.length-1]){e.preventDefault();nodes[0].focus()}
    }
  });
  const knownAreas=['서울특별시 강남구','서울특별시 서초구','서울특별시 송파구','서울특별시 영등포구','서울특별시 마포구','서울특별시 종로구','서울특별시 중구','서울특별시 강서구','서울특별시 구로구','서울특별시 성동구','경기도 수원시','경기도 성남시','경기도 부천시','경기도 고양시','경기도 안양시','경기도 광명시','경기도 의왕시','경기도 하남시','경기도 남양주시','경기도 시흥시','경기도 안산시','경기도 화성시','인천광역시 연수구','인천광역시 남동구','인천광역시 서구','인천광역시 중구','인천광역시 부평구','인천광역시 계양구','인천광역시 미추홀구','인천광역시 강화군','인천광역시 옹진군','부산광역시 해운대구','대구광역시 수성구','대전광역시 서구','광주광역시 북구','울산광역시 남구','세종특별자치시'];
  const normalize=v=>String(v||'').replace(/\s/g,'').replace(/특별시|광역시/g,'');
  areaInput?.addEventListener('input',()=>{
    const query=normalize(areaInput.value);
    const matched=query.length>=2?knownAreas.filter(x=>normalize(x).includes(query)).slice(0,8):[];
    areaSuggestions.hidden=!matched.length;
    areaSuggestions.innerHTML=matched.map(x=>'<button type="button" data-area-name="'+x+'">'+x+'</button>').join('');
  });
  areaSuggestions?.addEventListener('click',e=>{
    const b=e.target.closest('[data-area-name]');if(!b)return;
    areaInput.value=b.dataset.areaName;areaSuggestions.hidden=true;
    document.getElementById('feesAreaForm').requestSubmit();
  });
  const classifyArea=value=>{
    const v=String(value).trim();
    if(/강화군|옹진군/.test(v))return ['비과밀지역 안내','수도권 과밀억제권역에서 제외되는 지역입니다.'];
    if(/인천|연수구|남동구|미추홀구|부평구|계양구/.test(v)){
      if(/연수구|남동구|서구|중구/.test(v))return ['상세 주소 확인 필요','인천은 과밀억제권역과 제외 구역이 혼재할 수 있습니다. 토지이음에서 상세 주소를 확인해 주세요.'];
      return ['과밀억제권역 해당 가능 지역','인천의 일부 지역은 과밀억제권역에 해당합니다. 실제 본점 주소와 중과 예외 여부를 확인해 주세요.'];
    }
    if(/남양주|시흥|안산|화성/.test(v))return ['상세 주소 확인 필요','해당 시에는 수도권 권역이 혼재할 수 있어 상세 주소를 기준으로 확인해야 합니다.'];
    if(/서울|수원|성남|안양|부천|광명|과천|의정부|구리|하남|고양|군포|의왕/.test(v))return ['과밀억제권역 해당 가능 지역','해당 지역은 과밀억제권역에 해당할 수 있습니다. 중과세 적용은 설립 형태·시점·업종 등 개별 조건에 따라 다릅니다.'];
    if(/부산|대구|광주|대전|울산|세종|강원|충북|충남|경북|경남|전북|전남|제주/.test(v))return ['비과밀지역 안내','수도권 외 지역으로 과밀억제권역에 해당하지 않습니다.'];
    return ['상세 주소 확인 필요','권역은 시·군·구 및 세부 구역에 따라 달라질 수 있습니다. 토지이음에서 본점 소재지를 확인해 주세요.'];
  };
  document.getElementById('feesAreaForm')?.addEventListener('submit',e=>{
    e.preventDefault();
    const [status,description]=classifyArea(areaInput.value);
    areaSuggestions.hidden=true;
    areaResponse.innerHTML='<strong>'+status+'</strong><p>'+description+'</p><p>아래 공식 조회 링크로 주소별 적용 여부를 최종 확인해 주세요.</p>';
  });
  areaModal?.querySelectorAll('[data-fees-example]').forEach(b=>b.addEventListener('click',()=>{areaInput.value=b.dataset.feesExample;document.getElementById('feesAreaForm').requestSubmit()}));
})();
