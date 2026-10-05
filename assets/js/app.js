(()=>{
  const isProject=location.hostname.endsWith('github.io');
  const base=isProject?'/ptglaw':'';
  // Prevent first-paint flashes while shared header/footer and CSS are being initialized.
  const bootStyle=document.createElement('style');
  bootStyle.id='ptg-boot-style';
  bootStyle.textContent=`
    [data-site-header]:empty{height:var(--header-height,88px);background:#fff}
    [data-site-footer]:empty{min-height:1px}
    body:not(.ptg-ui-ready) main,body:not(.ptg-ui-ready) [data-site-header],body:not(.ptg-ui-ready) [data-site-footer]{visibility:hidden}
    body.ptg-ui-ready main,body.ptg-ui-ready [data-site-header],body.ptg-ui-ready [data-site-footer]{visibility:visible}
  `;
  document.head.appendChild(bootStyle);
  const header=document.querySelector('[data-site-header]');
  const footer=document.querySelector('[data-site-footer]');
  const CSS_VERSION='20261005-2039';
  const LOGO_VERSION='20261005-2039';
  const SERVICE_ASSET_VERSION='20261005-2039';
  const ensureCss=(key,file)=>new Promise(resolve=>{
    const existing=document.querySelector(`link[data-${key}]`);
    if(existing){
      if(existing.sheet){resolve();return}
      existing.addEventListener('load',resolve,{once:true});
      existing.addEventListener('error',resolve,{once:true});
      setTimeout(resolve,1200);
      return;
    }
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href=`${base}/assets/css/${file}?v=${CSS_VERSION}`;
    link.setAttribute(`data-${key}`,'true');
    link.addEventListener('load',resolve,{once:true});
    link.addEventListener('error',resolve,{once:true});
    document.head.appendChild(link);
    setTimeout(resolve,1200);
  });
  const sharedCssReady=Promise.all(['universal.css','seed-final.css','chrome.css','structural-foundation.css','service-hero-clean.css','completion-polish.css','package-landing.css'].map((file,i)=>ensureCss(['ptg-universal','ptg-seed-final','ptg-chrome','ptg-structural-foundation','ptg-service-hero-clean','ptg-completion-polish','ptg-package-landing'][i],file)));
  document.body.classList.add('ptg-global-ui','ptg-notice-hidden');
  document.documentElement.style.setProperty('--notice-height','0px');
  document.body.style.setProperty('--notice-height','0px');

  // Pre-launch: top notice banner removed.


  const logoSrc=`${base}/assets/images/logo.svg?v=${LOGO_VERSION}`;
  if(header)header.innerHTML=`<header class="ptg-site-header"><div class="ptg-site-header__inner"><a class="ptg-site-header__logo" href="${base}/" aria-label="펜타곤 메인"><img src="${logoSrc}" alt="Pentagon Legal & Tax Partners"></a><nav class="ptg-site-header__nav" id="ptgSiteNav" aria-label="주요 메뉴">
    <div class="ptg-nav-item" data-dropdown><a class="ptg-nav-link" href="${base}/about/">펜타곤 소개</a><div class="ptg-nav-dropdown"><a href="${base}/about/">인사말·비전</a><a href="${base}/newsroom/">펜타곤 소식</a><a href="${base}/professionals/">구성원 소개</a><a href="${base}/location/">오시는 길</a></div></div>
    <div class="ptg-nav-item" data-dropdown><a class="ptg-nav-link" href="${base}/services/">업무 안내</a><div class="ptg-nav-dropdown ptg-nav-dropdown--business">
      <div class="ptg-business-group"><div class="ptg-business-group__head"><strong>업무 분야</strong><a href="${base}/services/">전체보기 →</a></div><div class="ptg-business-links"><a href="${base}/services/legal/">법률 자문 및 소송</a><a href="${base}/services/tax/">세무 기장 및 자문</a><a href="${base}/services/ip/">IP 지식재산권</a><a href="${base}/services/recovery/">채권 추심</a><a href="${base}/services/registry/">등기 업무</a></div></div>
      <div class="ptg-business-group ptg-business-group--cases"><div class="ptg-business-group__head"><strong>업무 사례</strong><a href="${base}/cases/">전체보기 →</a></div><a class="ptg-business-case-card" href="${base}/cases/"><strong>주요 업무 사례</strong><span>법률 · 세무 · 기업 · 부동산 · 지식재산 분야의 실제 업무 사례를 확인하세요.</span><b>사례 보러가기 →</b></a></div>
    </div></div>
    <div class="ptg-nav-item"><a class="ptg-nav-link" href="${base}/inheritance/">상속원스톱서비스</a></div>
    <div class="ptg-nav-item"><a class="ptg-nav-link" href="${base}/center/">법인설립지원센터</a></div>
    <div class="ptg-nav-item" data-dropdown><a class="ptg-nav-link" href="${base}/information/">정보센터</a><div class="ptg-nav-dropdown"><a href="${base}/information/notice/">공지사항</a><a href="${base}/information/legal-support/">통합법률지원센터</a><a href="${base}/information/qna/">Q&amp;A</a><a href="${base}/tools/">간편 계산 서비스</a></div></div>
    <div class="ptg-nav-item" data-dropdown><a class="ptg-nav-link" href="${base}/contact/">문의하기</a><div class="ptg-nav-dropdown ptg-nav-dropdown--contact"><a href="${base}/contact/"><strong>일반 상담 문의</strong><span>법률·세무·IP·추심·등기 관련 상담</span></a><a href="${base}/tools/corporate-registration/"><strong>법인등기 비용 계산기</strong><span>자본금과 지역 기준 예상 세금 계산</span></a><a href="${base}/services/registry/estimate/"><strong>부동산등기 간편 견적</strong><span>부동산 정보와 자료를 남기고 견적 요청</span></a></div></div>
  </nav><button class="ptg-site-header__menu" type="button" aria-expanded="false" aria-controls="ptgSiteNav" aria-label="메뉴 열기">☰</button></div></header>`;

  if(footer)footer.innerHTML=`<footer class="ptg-site-footer"><div class="ptg-site-footer__inner"><div class="ptg-site-footer__top"><div class="ptg-site-footer__brand"><a href="${base}/" class="ptg-site-footer__logo"><img src="${logoSrc}" alt="Pentagon Legal & Tax Partners"></a><p class="ptg-site-footer__brand-copy">법률·세무·지식재산권·채권추심·등기를<br>하나의 해결 흐름으로 연결합니다.</p></div><nav class="ptg-site-footer__menu"><p class="ptg-site-footer__menu-title">펜타곤 소개</p><a href="${base}/about/">인사말·비전</a><a href="${base}/newsroom/">펜타곤 소식</a><a href="${base}/professionals/">구성원 소개</a><a href="${base}/location/">오시는 길</a></nav><nav class="ptg-site-footer__menu"><p class="ptg-site-footer__menu-title">업무 안내</p><a href="${base}/services/">업무 분야</a><a href="${base}/cases/">업무 사례</a><p class="ptg-site-footer__menu-title" style="margin-top:18px">전문 서비스</p><a href="${base}/inheritance/">상속원스톱서비스</a><a href="${base}/center/">법인설립지원센터</a></nav><nav class="ptg-site-footer__menu"><p class="ptg-site-footer__menu-title">정보센터</p><a href="${base}/information/notice/">공지사항</a><a href="${base}/information/legal-support/">통합법률지원센터</a><a href="${base}/information/qna/">Q&amp;A</a><a href="${base}/tools/">간편 계산 서비스</a></nav><div class="ptg-site-footer__contact"><p class="ptg-site-footer__menu-title">문의하기</p><div class="ptg-site-footer__contact-main"><span>대표 문의</span><a href="tel:0264475599">02-6447-5599</a></div><dl><div><dt>팩스</dt><dd>02-6447-5598</dd></div><div><dt>휴대전화</dt><dd><a href="tel:01032113132">010-3211-3132</a></dd></div><div><dt>이메일</dt><dd><a href="mailto:yhchae@ptglaw.co.kr">yhchae@ptglaw.co.kr</a></dd></div></dl></div></div><div class="ptg-site-footer__office"><div class="ptg-site-footer__address"><span>주소</span><p>서울 서초구 반포대로30길 32, 3층 (서초동, 트러스트힐)</p></div><div class="ptg-site-footer__legal"><p>광고책임변호사 : 채용현</p><a href="${base}/privacy/">개인정보처리방침</a><a href="mailto:yhchae@ptglaw.co.kr">이메일무단수집거부</a></div></div></div></footer>`;

  const path=location.pathname.replace(base,'')||'/';
  document.querySelectorAll('.ptg-nav-link,.ptg-nav-dropdown a').forEach(a=>{const href=a.getAttribute('href')||'',local=href.replace(base,'');if(local!=='/'&&path.startsWith(local))a.classList.add('is-active')});
  if(path.startsWith('/services/'))document.querySelector('.ptg-nav-link[href$="/services/"]')?.classList.add('is-active');
  if(path.startsWith('/about/')||path.startsWith('/newsroom/')||path.startsWith('/location/')||path.startsWith('/news'))document.querySelector('.ptg-nav-link[href$="/about/"]')?.classList.add('is-active');
  if(path.startsWith('/professionals/'))document.querySelector('.ptg-nav-link[href$="/about/"]')?.classList.add('is-active');
  if(path.startsWith('/cases/'))document.querySelector('.ptg-nav-link[href$="/services/"]')?.classList.add('is-active');
  if(path.startsWith('/information/'))document.querySelector('.ptg-nav-link[href$="/information/"]')?.classList.add('is-active');
  if(path.startsWith('/tools/'))document.querySelector('.ptg-nav-link[href$="/information/"]')?.classList.add('is-active');
  const isInquiryService=path.startsWith('/services/registry/estimate/')||path.startsWith('/tools/corporate-registration/');
  if(isInquiryService){
    document.querySelector('.ptg-nav-link[href$="/services/"]')?.classList.remove('is-active');
    document.querySelector('.ptg-nav-link[href$="/information/"]')?.classList.remove('is-active');
    document.querySelector('.ptg-nav-link[href$="/contact/"]')?.classList.add('is-active');
  }

  document.querySelectorAll('link[rel="icon"],link[rel="shortcut icon"]').forEach(link=>{
    link.href=`${base}/assets/images/favicon.svg?v=${SERVICE_ASSET_VERSION}`;
    link.type='image/svg+xml';
  });

  const serviceHeroAssets={
    '/services/legal/':{src:'https://nineworksdatabase.planus253.workers.dev/cdn/uncategorized/20260915-004128-image-84cfea92.webp',alt:'법률 자문 및 소송 대표 이미지'},
    '/services/tax/':{src:'https://nineworksdatabase.planus253.workers.dev/cdn/uncategorized/20260915-004128-image-2a796425.webp',alt:'세무 기장 및 자문 대표 이미지'},
    '/services/ip/':{src:'https://nineworksdatabase.planus253.workers.dev/cdn/uncategorized/20260915-004130-ip-0c820e7c.webp',alt:'IP 지식재산권 대표 이미지'},
    '/services/recovery/':{src:'https://nineworksdatabase.planus253.workers.dev/cdn/uncategorized/20260915-004129-image-f775d8ba.webp',alt:'채권 추심 대표 이미지'},
    '/services/registry/':{src:'https://nineworksdatabase.planus253.workers.dev/cdn/uncategorized/20260915-004127-image-022c459b.webp',alt:'등기 업무 대표 이미지'}
  };
  const serviceAsset=Object.entries(serviceHeroAssets).find(([prefix])=>path.startsWith(prefix))?.[1];
  if(serviceAsset){
    if(!document.querySelector('link[data-ptg-service-hero-images]')){
      const link=document.createElement('link');
      link.rel='stylesheet';
      link.href=`${base}/assets/css/service-hero-images.css?v=${SERVICE_ASSET_VERSION}`;
      link.dataset.ptgServiceHeroImages='true';
      document.head.appendChild(link);
    }
    const grid=document.querySelector('.svc-hero-grid');
    const points=grid?.querySelector('.svc-hero-points');
    if(grid&&!grid.querySelector('.svc-hero-media')){
      const figure=document.createElement('figure');
      figure.className='svc-hero-media';
      const img=document.createElement('img');
      img.src=serviceAsset.src;
      img.alt=serviceAsset.alt;
      img.loading='eager';
      img.decoding='async';
      figure.appendChild(img);
      if(points)grid.insertBefore(figure,points);else grid.appendChild(figure);
    }
  }

  const isServicesLanding=path==='/services/'||path==='/services';
  if(isServicesLanding){
    if(!document.querySelector('link[data-ptg-services-landing-visual]')){
      const link=document.createElement('link');
      link.rel='stylesheet';
      link.href=`${base}/assets/css/services-landing-visual.css?v=${SERVICE_ASSET_VERSION}`;
      link.dataset.ptgServicesLandingVisual='true';
      document.head.appendChild(link);
    }
    const grid=document.querySelector('.penta-business-hero-grid');
    const index=grid?.querySelector('.penta-hero-index');
    if(grid&&!grid.querySelector('.penta-business-team-visual')){
      const figure=document.createElement('figure');
      figure.className='penta-business-team-visual';
      const img=document.createElement('img');
      img.src='https://nineworksdatabase.planus253.workers.dev/cdn/uncategorized/20260915-004130-2-d818192f.webp';
      img.alt='펜타곤의 다섯 전문 영역을 상징하는 협업 이미지';
      img.loading='eager';
      img.decoding='async';
      figure.appendChild(img);
      if(index)grid.insertBefore(figure,index);else grid.appendChild(figure);
    }
  }

  if(path.startsWith('/about/')){
    const aboutPhoto=document.querySelector('.about-photo img');
    if(aboutPhoto){
      aboutPhoto.src='https://nineworksdatabase.planus253.workers.dev/cdn/uncategorized/20260915-004130-2-d818192f.webp';
      aboutPhoto.alt='펜타곤의 다섯 전문 영역과 협업을 상징하는 이미지';
      aboutPhoto.decoding='async';
    }
  }

  if(header&&!document.getElementById('ptg-nav-enhance-style')){const style=document.createElement('style');style.id='ptg-nav-enhance-style';style.textContent=`
    .ptg-nav-dropdown--business{left:50%!important;width:590px!important;padding:14px!important;display:grid!important;grid-template-columns:1fr 1fr!important;gap:14px!important;transform:translate(-50%,8px)!important}
    .ptg-nav-item:hover>.ptg-nav-dropdown--business,.ptg-nav-item:focus-within>.ptg-nav-dropdown--business{transform:translate(-50%,0)!important}
    .ptg-business-group{min-width:0!important;padding:6px!important}
    .ptg-business-group+.ptg-business-group{border-left:1px solid #eceef1!important;padding-left:20px!important}
    .ptg-business-group__head{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:14px!important;margin-bottom:8px!important;padding:4px 6px 10px!important;border-bottom:1px solid #eceef1!important}
    .ptg-business-group__head strong{font-size:13px!important;line-height:18px!important;font-weight:700!important;color:#181818!important}
    .ptg-business-group__head>a{display:inline!important;padding:0!important;background:none!important;font-size:11px!important;line-height:16px!important;font-weight:600!important;color:#8a8f96!important}
    .ptg-business-links{display:grid!important;gap:1px!important}
    .ptg-business-links a{padding:10px 8px!important;color:#4e5358!important}
    .ptg-business-case-card{display:flex!important;min-height:190px!important;flex-direction:column!important;align-items:flex-start!important;justify-content:flex-start!important;padding:16px!important;border-radius:10px!important;background:#f7f8fa!important}
    .ptg-business-case-card strong{margin-bottom:8px!important;font-size:15px!important;line-height:22px!important;color:#181818!important}
    .ptg-business-case-card span{font-size:12px!important;line-height:19px!important;color:#6f757c!important}
    .ptg-business-case-card b{margin-top:auto!important;padding-top:18px!important;font-size:12px!important;line-height:18px!important;color:#f58220!important}
    .ptg-nav-dropdown--contact{width:300px!important;padding:10px!important}
    .ptg-nav-dropdown--contact a{display:grid!important;gap:4px!important;padding:12px 14px!important}
    .ptg-nav-dropdown--contact a strong{font-size:14px!important;line-height:19px!important;color:inherit!important}
    .ptg-nav-dropdown--contact a span{font-size:11px!important;line-height:17px!important;color:#858a90!important}
    @media(max-width:980px){
      .ptg-nav-dropdown--business{left:auto!important;width:100%!important;padding:0 0 12px 16px!important;display:block!important;transform:none!important}
      .ptg-nav-item:hover>.ptg-nav-dropdown--business,.ptg-nav-item:focus-within>.ptg-nav-dropdown--business{transform:none!important}
      .ptg-business-group{padding:0!important}
      .ptg-business-group+.ptg-business-group{margin-top:12px!important;padding:12px 0 0!important;border-left:0!important;border-top:1px solid #eceef1!important}
      .ptg-business-group__head{padding:0 0 8px!important}
      .ptg-business-case-card{min-height:0!important;padding:12px 0!important;background:transparent!important}
      .ptg-nav-dropdown--contact{width:100%!important;padding:0 0 12px 16px!important}
      .ptg-nav-dropdown--contact a{padding:11px 0!important}
      .ptg-nav-item[data-dropdown]>.ptg-nav-link{position:relative!important;padding-right:42px!important}
      .ptg-nav-item[data-dropdown]>.ptg-nav-link:before,.ptg-nav-item[data-dropdown]>.ptg-nav-link:after{content:''!important;display:block!important;position:absolute!important;right:8px!important;top:50%!important;width:12px!important;height:1.5px!important;background:currentColor!important;transition:transform .18s ease!important}
      .ptg-nav-item[data-dropdown]>.ptg-nav-link:after{transform:rotate(90deg)!important}
      .ptg-nav-item[data-dropdown].open>.ptg-nav-link:after{transform:rotate(0)!important}
      .ptg-site-header__nav.open{max-height:calc(100svh - var(--header-height))!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch!important}
    }`;document.head.appendChild(style)}
  const menuBtn=document.querySelector('.ptg-site-header__menu'),nav=document.querySelector('#ptgSiteNav');
  menuBtn?.addEventListener('click',()=>{const open=nav?.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(Boolean(open)));menuBtn.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');menuBtn.textContent=open?'×':'☰'});
  const mobile=matchMedia('(max-width:980px)');
  const bindMobileDropdowns=()=>{if(!mobile.matches)return;document.querySelectorAll('[data-dropdown]>.ptg-nav-link').forEach(link=>{if(link.dataset.ptgBound)return;link.dataset.ptgBound='true';link.addEventListener('click',e=>{if(!mobile.matches)return;const item=link.parentElement;if(!item.classList.contains('open')){e.preventDefault();document.querySelectorAll('[data-dropdown].open').forEach(x=>x!==item&&x.classList.remove('open'));item.classList.add('open')}})})};
  bindMobileDropdowns();mobile.addEventListener?.('change',()=>{bindMobileDropdowns();if(!mobile.matches){nav?.classList.remove('open');menuBtn?.setAttribute('aria-expanded','false');menuBtn?.setAttribute('aria-label','메뉴 열기');menuBtn.textContent='☰';document.querySelectorAll('[data-dropdown].open').forEach(x=>x.classList.remove('open'));}});

  sharedCssReady.finally(()=>requestAnimationFrame(()=>document.body.classList.add('ptg-ui-ready')));

  if(!document.querySelector('script[data-ptg-analytics]')){const s=document.createElement('script');s.src=`${base}/assets/js/analytics.js?v=20260912-1328`;s.defer=true;s.dataset.ptgAnalytics='true';document.body.appendChild(s)}
  if(!document.querySelector('script[data-ptg-heading-breaks]')){const s=document.createElement('script');s.src=`${base}/assets/js/heading-breaks.js?v=20260915-1426`;s.defer=true;s.dataset.ptgHeadingBreaks='true';document.body.appendChild(s)}
  if((path.startsWith('/inheritance/')||path.startsWith('/center/'))&&!document.querySelector('script[data-ptg-package-landing]')){const s=document.createElement('script');s.src=`${base}/assets/js/package-landing.js?v=20260915-1240`;s.defer=true;s.dataset.ptgPackageLanding='true';document.body.appendChild(s)}
})();