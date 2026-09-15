(()=>{
  const path=location.pathname;
  const isInheritance=/\/inheritance\/?$/.test(path);
  const isCenter=/\/center\/?$/.test(path);
  if(!isInheritance&&!isCenter)return;

  const base=location.hostname.endsWith('github.io')?'/ptglaw':'';
  if(!document.querySelector('link[data-ptg-package-premium]')){
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href=`${base}/assets/css/package-premium.css?v=20260914-0950`;
    link.dataset.ptgPackagePremium='true';
    document.head.appendChild(link);
  }
  if(!document.querySelector('link[data-ptg-package-hero-media]')){
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href=`${base}/assets/css/package-hero-media.css?v=20260915-1238`;
    link.dataset.ptgPackageHeroMedia='true';
    document.head.appendChild(link);
  }

  document.body.classList.add('ptg-package-landing',isInheritance?'ptg-package-inheritance':'ptg-package-center');

  const insertAfter=(node,newNode)=>node?.parentNode?.insertBefore(newNode,node.nextSibling);
  const make=(html)=>{const t=document.createElement('template');t.innerHTML=html.trim();return t.content.firstElementChild};

  if(isInheritance){
    const hero=document.querySelector('#ptg-inherit-onestop .ptg-hero');
    const h1=hero?.querySelector('h1');
    const lead=hero?.querySelector('.ptg-hero-text');
    const kicker=hero?.querySelector('.ptg-hero-kicker');
    const actions=hero?.querySelector('.ptg-hero-actions');
    const visual=hero?.querySelector('.ptg-hero-visual');

    if(kicker)kicker.textContent='SPECIALIZED PACKAGE · INHERITANCE';
    if(h1)h1.textContent='상속 원스탑 서비스';
    if(lead)lead.textContent='상속재산분할 협의부터 상속세 신고, 상속등기까지 필요한 절차를 하나의 사건 흐름으로 연결합니다.';
    if(actions){
      const links=actions.querySelectorAll('a');
      if(links[0]){links[0].textContent='상담하기';links[0].href='../contact/';}
      if(links[1]){links[1].textContent='서비스 범위';links[1].href='#ptg-package-overview';}
    }
    if(visual)visual.innerHTML='<img src="https://nineworksdatabase.planus253.workers.dev/cdn/uncategorized/20260915-025514-dc9cce09-8304-44bb-9c70-b5d176016a84-3b6b2621.webp" alt="상속 원스탑 서비스 대표 이미지" loading="eager" decoding="async">';

    const oldOverview=document.querySelector('#ptg-package-overview');
    if(oldOverview)oldOverview.remove();
    const overview=make(`<section class="pkg-overview" id="ptg-package-overview"><div class="pkg-inner"><div class="pkg-overview-grid"><div class="pkg-problem"><div class="pkg-section-label">WHY ONE-STOP</div><h2>상속 업무가 복잡해지는 이유</h2><div class="pkg-problem-list"><article><b>01</b><div><strong>전문가가 나뉩니다.</strong><p>법률, 세무, 등기 업무를 각각 따로 맡겨야 하는 경우가 많습니다.</p></div></article><article><b>02</b><div><strong>같은 설명을 반복합니다.</strong><p>상속관계와 재산정보를 담당자마다 다시 전달하게 됩니다.</p></div></article><article><b>03</b><div><strong>절차가 서로 영향을 줍니다.</strong><p>분할 방식에 따라 세금과 등기 방식이 함께 달라질 수 있습니다.</p></div></article></div></div><div class="pkg-solution"><div class="pkg-section-label">PENTAGON ONE-STOP</div><h2>한 번 상담하고, 하나의 사건으로 관리합니다.</h2><p class="pkg-solution-lead">앞 단계의 판단이 다음 절차에 그대로 이어지도록 사건정보와 진행 순서를 연결합니다.</p><div class="pkg-flow-list"><div><span>01</span><strong>상속 협의</strong><em>상속인·재산·채무 확인</em></div><div><span>02</span><strong>상속세 신고</strong><em>재산 검토·공제·신고</em></div><div><span>03</span><strong>상속등기</strong><em>협의 내용 반영·등기 완료</em></div></div></div></div></div></section>`);
    insertAfter(hero,overview);

    const firstHead=document.querySelector('#ptg-inherit-onestop .ptg-service .ptg-section-head');
    if(firstHead){
      const title=firstHead.querySelector('.ptg-h2');
      const desc=firstHead.querySelector('.ptg-lead');
      if(title)title.textContent='상속 과정에서 필요한 핵심 업무';
      if(desc)desc.textContent='각 업무를 별도로 설명하기보다 실제 진행 순서에 맞춰 필요한 범위를 확인합니다.';
    }
  }

  if(isCenter){
    const hero=document.querySelector('.ptg-center-modern__hero');
    const h1=hero?.querySelector('h1');
    const lead=hero?.querySelector('.ptg-center-modern__lead');
    const kicker=hero?.querySelector('.ptg-center-modern__eyebrow');
    const actions=hero?.querySelector('.ptg-center-modern__hero-actions');
    const visual=hero?.querySelector('.ptg-center-modern__hero-image');

    if(kicker)kicker.textContent='SPECIALIZED PACKAGE · CORPORATE FORMATION';
    if(h1)h1.textContent='법인설립 지원센터';
    if(lead)lead.textContent='주주·지분·자본금·정관·세무·등기를 설립 전 단계부터 함께 검토해 운영하기 좋은 구조로 연결합니다.';
    if(actions){
      const links=actions.querySelectorAll('a');
      if(links[0]){links[0].textContent='상담하기';links[0].href='../contact/';}
      if(links[1]){links[1].textContent='서비스 범위';links[1].href='#ptg-package-overview';}
    }
    if(visual)visual.innerHTML='<img src="https://nineworksdatabase.planus253.workers.dev/cdn/uncategorized/20260915-025515-e1fd3d31-1119-4947-81e9-39a10a8a8a45-23f6ccd4.webp" alt="법인설립 지원센터 대표 이미지" loading="eager" decoding="async">';

    const oldOverview=document.querySelector('#ptg-package-overview');
    if(oldOverview)oldOverview.remove();
    const overview=make(`<section class="pkg-overview" id="ptg-package-overview"><div class="pkg-inner"><div class="pkg-overview-grid"><div class="pkg-problem"><div class="pkg-section-label">BEFORE INCORPORATION</div><h2>등기 전에 먼저 결정해야 할 것</h2><div class="pkg-problem-list"><article><b>01</b><div><strong>누가 어떤 지분을 갖는지</strong><p>주주구성과 의결권 구조는 이후 투자와 경영권에 영향을 줍니다.</p></div></article><article><b>02</b><div><strong>자본금과 정관을 어떻게 설계할지</strong><p>업종과 사업계획에 따라 초기 구조가 달라질 수 있습니다.</p></div></article><article><b>03</b><div><strong>설립 이후 세무를 어떻게 이어갈지</strong><p>사업자등록, 급여, 기장과 신고 일정까지 미리 연결해야 합니다.</p></div></article></div></div><div class="pkg-solution"><div class="pkg-section-label">PENTAGON FORMATION</div><h2>설립 절차보다 운영 구조를 먼저 봅니다.</h2><p class="pkg-solution-lead">법률·세무·등기를 각각 나누지 않고 사업형태와 향후 계획을 기준으로 하나의 설립 구조를 만듭니다.</p><div class="pkg-flow-list pkg-flow-list--five"><div><span>01</span><strong>구조 설계</strong><em>주주·지분·임원</em></div><div><span>02</span><strong>세무 검토</strong><em>자본금·투자·전환</em></div><div><span>03</span><strong>정관 설계</strong><em>사업목적·운영기준</em></div><div><span>04</span><strong>법인등기</strong><em>서류·등기 진행</em></div><div><span>05</span><strong>설립 후 관리</strong><em>등록·기장·신고</em></div></div></div></div></div></section>`);
    insertAfter(hero,overview);

    const introHead=document.querySelector('.ptg-center-modern__intro .ptg-center-modern__section-head h2');
    if(introHead)introHead.textContent='법인설립 전 검토해야 할 핵심 항목';
  }
})();
