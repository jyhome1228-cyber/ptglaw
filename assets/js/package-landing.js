(()=>{
  const path=location.pathname;
  const isInheritance=/\/inheritance\/?$/.test(path);
  const isCenter=/\/center\/?$/.test(path);
  if(!isInheritance&&!isCenter)return;

  document.body.classList.add('ptg-package-landing',isInheritance?'ptg-package-inheritance':'ptg-package-center');

  const insertAfter=(node,newNode)=>node?.parentNode?.insertBefore(newNode,node.nextSibling);
  const make=(html)=>{const t=document.createElement('template');t.innerHTML=html.trim();return t.content.firstElementChild};
  const addHeroMeta=(hero,items)=>{
    if(!hero||hero.querySelector('.pkg-hero-meta'))return;
    const copy=hero.querySelector('.ptg-hero-copy,.ptg-center-modern__hero-copy');
    if(!copy)return;
    const meta=make(`<div class="pkg-hero-meta">${items.map(x=>`<span>${x}</span>`).join('')}</div>`);
    copy.appendChild(meta);
  };

  if(isInheritance){
    const hero=document.querySelector('#ptg-inherit-onestop .ptg-hero');
    const h1=hero?.querySelector('h1');
    const lead=hero?.querySelector('.ptg-hero-text');
    const kicker=hero?.querySelector('.ptg-hero-kicker');
    const actions=hero?.querySelector('.ptg-hero-actions');
    if(kicker)kicker.textContent='INHERITANCE ONE-STOP';
    if(h1)h1.textContent='상속 원스탑 서비스';
    if(lead)lead.textContent='상속 협의부터 상속세 신고, 상속등기까지. 서로 연결된 절차를 하나의 담당 흐름으로 진행합니다.';
    if(actions){
      const links=actions.querySelectorAll('a');
      if(links[0]){links[0].textContent='상담하기';links[0].href='../contact/';}
      if(links[1]){links[1].textContent='서비스 범위';links[1].href='#ptg-package-scope';}
    }
    addHeroMeta(hero,['법률 검토','상속세 신고','상속등기','ONE-STOP']);

    const strip=make(`<section class="pkg-package-strip" aria-label="상속 원스탑 패키지 흐름"><div class="pkg-inner"><div class="pkg-strip-head"><strong>상속 절차를 따로 나누지 않습니다.</strong><span>협의 결과가 세금과 등기에 이어지는 만큼, 사건의 맥락을 유지한 채 순서대로 연결합니다.</span></div><div class="pkg-flow" style="--pkg-cols:3"><div class="pkg-flow-item"><b>01</b><strong>상속 협의</strong><p>상속인·재산·채무 확인과 분할 방향 정리</p></div><div class="pkg-flow-item"><b>02</b><strong>상속세 신고</strong><p>재산 평가와 공제 검토, 신고 진행</p></div><div class="pkg-flow-item"><b>03</b><strong>상속등기</strong><p>협의 결과에 맞춰 부동산 등기 마무리</p></div></div></div></section>`);
    insertAfter(hero,strip);

    const value=make(`<section class="pkg-value" id="ptg-package-scope"><div class="pkg-inner"><div class="pkg-value-head"><h2>한 사건을 하나의 흐름으로 관리합니다.</h2><p>상속 과정에서 반복되는 설명과 자료 전달을 줄이고, 법률·세무·등기 판단이 서로 어긋나지 않도록 연결합니다.</p></div><div class="pkg-value-list"><article class="pkg-value-item"><b>01</b><strong>사건정보 연결</strong><p>상속인과 재산관계, 협의내용을 분야별 담당자가 같은 맥락으로 확인합니다.</p></article><article class="pkg-value-item"><b>02</b><strong>순서까지 함께 검토</strong><p>분할 방식이 신고와 등기에 미치는 영향을 앞 단계에서부터 함께 살펴봅니다.</p></article><article class="pkg-value-item"><b>03</b><strong>완료 여부까지 확인</strong><p>협의서 작성 이후 신고와 등기가 실제로 마무리될 때까지 이어서 관리합니다.</p></article></div></div></section>`);
    insertAfter(strip,value);

    const firstHead=document.querySelector('#ptg-inherit-onestop .ptg-service .ptg-section-head');
    firstHead?.querySelector('.ptg-h2')&&(firstHead.querySelector('.ptg-h2').textContent='상속에 필요한 핵심 업무');
    firstHead?.querySelector('.ptg-lead')&&(firstHead.querySelector('.ptg-lead').textContent='상속재산분할 협의, 상속세 신고, 상속등기를 사건의 흐름에 맞춰 연결합니다.');
  }

  if(isCenter){
    const hero=document.querySelector('.ptg-center-modern__hero');
    const h1=hero?.querySelector('h1');
    const lead=hero?.querySelector('.ptg-center-modern__lead');
    const kicker=hero?.querySelector('.ptg-center-modern__eyebrow');
    const actions=hero?.querySelector('.ptg-center-modern__hero-actions');
    if(kicker)kicker.textContent='CORPORATE FORMATION CENTER';
    if(h1)h1.textContent='법인설립 지원센터';
    if(lead)lead.textContent='주주·지분·자본금·정관·세무·등기를 설립 전 단계부터 함께 검토해 운영하기 좋은 구조를 만듭니다.';
    if(actions){
      const links=actions.querySelectorAll('a');
      if(links[0]){links[0].textContent='상담하기';links[0].href='../contact/';}
      if(links[1]){links[1].textContent='지원 범위';links[1].href='#ptg-package-scope';}
    }
    addHeroMeta(hero,['구조 설계','세무 검토','설립등기','설립 후 관리']);

    const strip=make(`<section class="pkg-package-strip" aria-label="법인설립 패키지 흐름"><div class="pkg-inner"><div class="pkg-strip-head"><strong>등기 전에 구조를 먼저 정합니다.</strong><span>설립 이후의 운영과 세무를 고려해 주주·자본금·정관·등기 순서를 하나의 과정으로 설계합니다.</span></div><div class="pkg-flow" style="--pkg-cols:5"><div class="pkg-flow-item"><b>01</b><strong>구조 설계</strong><p>주주·지분·임원 구성</p></div><div class="pkg-flow-item"><b>02</b><strong>세무 검토</strong><p>자본금·투자·전환 이슈</p></div><div class="pkg-flow-item"><b>03</b><strong>정관 설계</strong><p>사업목적과 의사결정 구조</p></div><div class="pkg-flow-item"><b>04</b><strong>법인등기</strong><p>설립 서류와 등기 진행</p></div><div class="pkg-flow-item"><b>05</b><strong>설립 후 관리</strong><p>사업자등록·기장·신고 연결</p></div></div></div></section>`);
    insertAfter(hero,strip);

    const value=make(`<section class="pkg-value" id="ptg-package-scope"><div class="pkg-inner"><div class="pkg-value-head"><h2>설립 이후까지 고려한 구조를 만듭니다.</h2><p>등기 완료 자체보다 설립 후 실제 운영이 더 중요합니다. 사업 형태와 향후 계획을 기준으로 법률·세무·등기 조건을 함께 맞춥니다.</p></div><div class="pkg-value-list"><article class="pkg-value-item"><b>01</b><strong>사업에 맞는 구조</strong><p>1인 법인, 공동창업, 가족법인, 투자 예정 법인 등 사업 형태에 따라 설립 구조를 달리 검토합니다.</p></article><article class="pkg-value-item"><b>02</b><strong>법률·세무 동시 검토</strong><p>지분과 자본금, 정관 결정이 이후 세금과 운영에 미치는 영향을 설립 전에 확인합니다.</p></article><article class="pkg-value-item"><b>03</b><strong>설립 후 관리 연결</strong><p>등기 이후 사업자등록, 기장, 급여와 정기 신고 일정까지 바로 이어질 수 있도록 안내합니다.</p></article></div></div></section>`);
    insertAfter(strip,value);

    const introHead=document.querySelector('.ptg-center-modern__intro .ptg-center-modern__section-head h2');
    if(introHead)introHead.textContent='설립 전에 먼저 결정해야 할 구조';
  }
})();
