(()=>{
  const path=location.pathname;
  const isInheritance=/\/inheritance\/?$/.test(path);
  const isCenter=/\/center\/?$/.test(path);
  if(!isInheritance&&!isCenter)return;

  document.body.classList.add('ptg-package-landing',isInheritance?'ptg-package-inheritance':'ptg-package-center');

  const insertAfter=(node,newNode)=>node?.parentNode?.insertBefore(newNode,node.nextSibling);
  const make=(html)=>{const t=document.createElement('template');t.innerHTML=html.trim();return t.content.firstElementChild};

  if(isInheritance){
    const hero=document.querySelector('#ptg-inherit-onestop .ptg-hero');
    const h1=hero?.querySelector('h1');
    const lead=hero?.querySelector('.ptg-hero-text');
    const kicker=hero?.querySelector('.ptg-hero-kicker');
    const actions=hero?.querySelector('.ptg-hero-actions');
    if(kicker)kicker.textContent='PENTAGON PACKAGE · INHERITANCE ONE-STOP';
    if(h1)h1.innerHTML='상속 때문에<br><span>여러 곳을 찾지 마세요.</span>';
    if(lead)lead.textContent='상속 협의부터 상속세 신고, 상속등기까지. 법률·세무·등기를 하나의 담당 흐름으로 연결합니다.';
    if(actions){
      const links=actions.querySelectorAll('a');
      if(links[0]){links[0].textContent='원스탑 상담하기';links[0].href='../contact/';}
      if(links[1]){links[1].textContent='패키지 범위 보기';links[1].href='#ptg-package-scope';}
    }

    const strip=make(`<section class="pkg-package-strip" aria-label="상속 원스탑 패키지 흐름"><div class="pkg-inner"><div class="pkg-strip-head"><strong>한 번의 상담, 하나의 사건, 끝까지 연결</strong><span>상속 과정에서 따로 움직이던 절차를 하나의 패키지로 묶었습니다.</span></div><div class="pkg-flow" style="--pkg-cols:3"><div class="pkg-flow-item"><b>01</b><strong>상속 협의</strong><p>상속인·재산·채무 확인과 분할 방향 정리</p></div><div class="pkg-flow-item"><b>02</b><strong>상속세 신고</strong><p>재산 평가와 공제 검토, 신고까지 연결</p></div><div class="pkg-flow-item"><b>03</b><strong>상속등기</strong><p>협의 내용에 맞춰 부동산 등기까지 마무리</p></div></div></div></section>`);
    insertAfter(hero,strip);

    const value=make(`<section class="pkg-value" id="ptg-package-scope"><div class="pkg-inner"><div class="pkg-value-head"><h2>상속을 ‘업무 세 개’가 아니라<br>‘하나의 해결 과정’으로 봅니다.</h2><p>상속은 협의, 세금, 등기가 서로 영향을 주는 일입니다. 담당자가 나뉘면 설명과 판단이 반복되지만, 하나의 흐름으로 보면 의사결정이 빨라지고 누락 가능성도 줄어듭니다.</p></div><div class="pkg-value-list"><article class="pkg-value-item"><b>01</b><strong>반복 설명을 줄입니다</strong><p>같은 상속관계를 변호사·세무사·등기 담당자에게 반복해서 설명하지 않도록 사건 정보를 연결합니다.</p></article><article class="pkg-value-item"><b>02</b><strong>절차 순서를 함께 봅니다</strong><p>분할 방식이 세금과 등기에 미치는 영향을 함께 검토해 뒤늦은 수정 가능성을 줄입니다.</p></article><article class="pkg-value-item"><b>03</b><strong>완료까지 한 흐름으로 갑니다</strong><p>협의서 작성에서 끝나지 않고 신고와 등기 완료 여부까지 이어서 확인합니다.</p></article></div></div></section>`);
    insertAfter(strip,value);

    const firstHead=document.querySelector('#ptg-inherit-onestop .ptg-service .ptg-section-head');
    firstHead?.querySelector('.ptg-h2')&&(firstHead.querySelector('.ptg-h2').innerHTML='따로 맡길 일을,<br>하나의 패키지로 진행합니다');
    firstHead?.querySelector('.ptg-lead')&&(firstHead.querySelector('.ptg-lead').textContent='상속재산분할 협의, 상속세 신고, 상속등기를 사건의 앞뒤 맥락이 끊기지 않도록 연결합니다.');
  }

  if(isCenter){
    const hero=document.querySelector('.ptg-center-modern__hero');
    const h1=hero?.querySelector('h1');
    const lead=hero?.querySelector('.ptg-center-modern__lead');
    const kicker=hero?.querySelector('.ptg-center-modern__eyebrow');
    const actions=hero?.querySelector('.ptg-center-modern__hero-actions');
    if(kicker)kicker.textContent='PENTAGON PACKAGE · CORPORATE FORMATION';
    if(h1)h1.innerHTML='법인설립,<br><span>등기보다 먼저 구조를 봅니다.</span>';
    if(lead)lead.textContent='주주·지분·자본금·정관·세무·등기까지. 설립 이후의 운영을 고려해 시작 단계부터 구조를 함께 설계합니다.';
    if(actions){
      const links=actions.querySelectorAll('a');
      if(links[0]){links[0].textContent='법인설립 상담하기';links[0].href='../contact/';}
      if(links[1]){links[1].textContent='패키지 범위 보기';links[1].href='#ptg-package-scope';}
    }

    const strip=make(`<section class="pkg-package-strip" aria-label="법인설립 패키지 흐름"><div class="pkg-inner"><div class="pkg-strip-head"><strong>설립등기 한 번보다, 처음 구조가 더 중요합니다.</strong><span>법인 설립 전 결정이 설립 후 세무와 운영에 그대로 이어집니다.</span></div><div class="pkg-flow" style="--pkg-cols:5"><div class="pkg-flow-item"><b>01</b><strong>구조 설계</strong><p>주주·지분·임원 구성</p></div><div class="pkg-flow-item"><b>02</b><strong>세무 검토</strong><p>자본금·투자·전환 이슈</p></div><div class="pkg-flow-item"><b>03</b><strong>정관 설계</strong><p>사업목적과 의사결정 구조</p></div><div class="pkg-flow-item"><b>04</b><strong>법인등기</strong><p>설립 서류와 등기 진행</p></div><div class="pkg-flow-item"><b>05</b><strong>설립 후 관리</strong><p>사업자등록·기장·신고 연결</p></div></div></div></section>`);
    insertAfter(hero,strip);

    const value=make(`<section class="pkg-value" id="ptg-package-scope"><div class="pkg-inner"><div class="pkg-value-head"><h2>회사를 만드는 절차보다,<br>운영하기 좋은 구조를 만듭니다.</h2><p>법인은 설립한 뒤 바로 사업을 시작해야 합니다. 그래서 등기서류만 맞추는 것보다 주주관계, 자금계획, 세무관리, 향후 투자 가능성까지 먼저 보는 것이 중요합니다.</p></div><div class="pkg-value-list"><article class="pkg-value-item"><b>01</b><strong>처음부터 구조를 맞춥니다</strong><p>1인 법인, 공동창업, 가족법인, 투자 예정 법인 등 실제 사업 형태에 따라 설립 구조를 달리 봅니다.</p></article><article class="pkg-value-item"><b>02</b><strong>법률과 세무를 함께 봅니다</strong><p>지분·자본금·정관 결정이 세금과 운영에 미치는 영향을 설립 전에 함께 검토합니다.</p></article><article class="pkg-value-item"><b>03</b><strong>설립 후까지 연결합니다</strong><p>등기 완료 이후 사업자등록, 기장, 급여, 신고 일정까지 바로 운영할 수 있도록 이어갑니다.</p></article></div></div></section>`);
    insertAfter(strip,value);

    const introHead=document.querySelector('.ptg-center-modern__intro .ptg-center-modern__section-head h2');
    if(introHead)introHead.textContent='설립 이후를 생각하면, 시작 전에 정해야 할 것이 있습니다.';
  }
})();
