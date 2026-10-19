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
  // Keep shared navigation visible while scrolling throughout the site.
  const fixedHeaderStyle=document.createElement('style');
  fixedHeaderStyle.id='ptg-fixed-site-header';
  fixedHeaderStyle.textContent=`
    body.ptg-global-ui [data-site-header]{
      position:fixed!important;
      top:0!important;left:0!important;right:0!important;
      width:100%!important;
      z-index:9000!important;
      isolation:isolate;
    }
    body.ptg-global-ui:not(.ptg-home-page){padding-top:var(--header-height,88px)!important}
    body.ptg-global-ui [data-site-header] .ptg-site-header{position:relative!important;top:auto!important;width:100%!important}
    html{scroll-padding-top:calc(var(--header-height,88px) + 18px)}
    @media(max-width:980px){body.ptg-global-ui [data-site-header]{z-index:9500!important}}
  `;
  document.head.appendChild(fixedHeaderStyle);
  const header=document.querySelector('[data-site-header]');
  const footer=document.querySelector('[data-site-footer]');
  const CSS_VERSION='20261019-mobileqa1';
  const LOGO_VERSION='20261005-2149';
  const SERVICE_ASSET_VERSION='20261014-1115';
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
  const sharedCssReady=Promise.all(['universal.css','seed-final.css','chrome.css','structural-foundation.css','service-hero-clean.css','completion-polish.css','package-landing.css','alignment.css','rounded-system.css','mobile-qa.css'].map((file,i)=>ensureCss(['ptg-universal','ptg-seed-final','ptg-chrome','ptg-structural-foundation','ptg-service-hero-clean','ptg-completion-polish','ptg-package-landing','ptg-alignment','ptg-rounded-system','ptg-mobile-qa'][i],file)));
  document.body.classList.add('ptg-global-ui','ptg-notice-hidden');
  document.documentElement.style.setProperty('--notice-height','0px');
  document.body.style.setProperty('--notice-height','0px');

  // Pre-launch: top notice banner removed.


  const logoSrc=`${base}/assets/images/logo.svg?v=${LOGO_VERSION}`;
  if(header)header.innerHTML=`<header class="ptg-site-header"><div class="ptg-site-header__inner"><a class="ptg-site-header__logo" href="${base}/" aria-label="펜타곤 메인"><img src="${logoSrc}" alt="Pentagon Legal & Tax Partners"></a><nav class="ptg-site-header__nav" id="ptgSiteNav" aria-label="주요 메뉴">
    <div class="ptg-nav-item" data-dropdown><a class="ptg-nav-link" href="${base}/about/">펜타곤 소개</a><div class="ptg-nav-dropdown"><a href="${base}/about/">인사말·비전</a><a href="${base}/newsroom/">펜타곤 소식</a><a href="${base}/location/">오시는 길</a></div></div>
    <div class="ptg-nav-item" data-dropdown><a class="ptg-nav-link" href="${base}/professionals/">구성원 소개</a><div class="ptg-nav-dropdown ptg-nav-dropdown--people"><a href="${base}/professionals/chaeyonghyun/">채용현 대표변호사 · 세무사</a><a href="${base}/professionals/kanggeon/">강건 파트너변호사</a><a href="${base}/professionals/jeonseunghwan/">전승환 파트너변호사 · 세무사</a><a href="${base}/professionals/kimjisoo/">김지수 세무사</a></div></div>
    <div class="ptg-nav-item" data-dropdown><a class="ptg-nav-link" href="${base}/services/">업무 분야</a><div class="ptg-nav-dropdown ptg-nav-dropdown--services-clean"><a href="${base}/services/legal/">법률 자문 및 소송</a><a href="${base}/services/tax/">세무 기장 및 자문</a><a href="${base}/services/ip/">IP 지식재산권</a><a href="${base}/services/recovery/">채권 추심</a><a href="${base}/services/registry/">등기 업무</a></div></div>
    <div class="ptg-nav-item"><a class="ptg-nav-link" href="${base}/cases/">업무 사례</a></div>
    <div class="ptg-nav-item"><a class="ptg-nav-link" href="${base}/inheritance/">상속원스톱서비스</a></div>
    <div class="ptg-nav-item"><a class="ptg-nav-link" href="${base}/center/">법인설립지원센터</a></div>
    <div class="ptg-nav-item" data-dropdown><a class="ptg-nav-link" href="${base}/tools/">간편 계산</a><div class="ptg-nav-dropdown ptg-nav-dropdown--tools"><a href="${base}/tools/withholding/">3.3% 원천징수</a><a href="${base}/tools/vat/">부가세 계산</a><a href="${base}/fees/#feeCalculator">법인등기 비용</a><a href="${base}/tools/severance/">퇴직금 계산</a><a href="${base}/tools/asset-tax/">양도·증여·상속세</a></div></div>
    <div class="ptg-nav-item"><a class="ptg-nav-link" href="${base}/contact/">문의하기</a></div>
  </nav><button class="ptg-site-header__menu" type="button" aria-expanded="false" aria-controls="ptgSiteNav" aria-label="메뉴 열기">☰</button></div></header>`;

  if(footer)footer.innerHTML=`<footer class="ptg-site-footer"><div class="ptg-site-footer__inner"><div class="ptg-site-footer__top"><div class="ptg-site-footer__brand"><a href="${base}/" class="ptg-site-footer__logo"><img src="${logoSrc}" alt="Pentagon Legal & Tax Partners"></a><p class="ptg-site-footer__brand-copy">법률·세무·지식재산권·채권추심·등기를<br>하나의 해결 흐름으로 연결합니다.</p></div><nav class="ptg-site-footer__menu"><p class="ptg-site-footer__menu-title">펜타곤 소개</p><a href="${base}/about/">인사말·비전</a><a href="${base}/newsroom/">펜타곤 소식</a><a href="${base}/professionals/">구성원 소개</a><a href="${base}/location/">오시는 길</a></nav><nav class="ptg-site-footer__menu"><p class="ptg-site-footer__menu-title">업무</p><a href="${base}/services/">업무 분야</a><a href="${base}/cases/">업무 사례</a><p class="ptg-site-footer__menu-title" style="margin-top:18px">전문 서비스</p><a href="${base}/inheritance/">상속원스톱서비스</a><a href="${base}/center/">법인설립지원센터</a><a href="${base}/fees/">법인등기 비용 안내</a><a href="${base}/tools/">간편 계산 서비스</a></nav><div class="ptg-site-footer__contact"><p class="ptg-site-footer__menu-title">문의하기</p><div class="ptg-site-footer__contact-main"><span>대표 문의</span><a href="tel:0264475599">02-6447-5599</a></div><dl><div><dt>팩스</dt><dd>02-6447-5598</dd></div><div><dt>휴대전화</dt><dd><a href="tel:01032113132">010-3211-3132</a></dd></div><div><dt>이메일</dt><dd><a href="mailto:yhchae@ptglaw.co.kr">yhchae@ptglaw.co.kr</a></dd></div></dl></div></div><div class="ptg-site-footer__office"><div class="ptg-site-footer__address"><span>주소</span><p>서울 서초구 반포대로30길 32, 3층 (서초동, 트러스트힐)</p></div><div class="ptg-site-footer__legal"><p>광고책임변호사 : 채용현</p><a href="${base}/privacy/">개인정보처리방침</a><a href="mailto:yhchae@ptglaw.co.kr">이메일무단수집거부</a></div></div></div></footer>`;

  const path=location.pathname.replace(base,'')||'/';
  document.querySelectorAll('.ptg-nav-link,.ptg-nav-dropdown a').forEach(a=>{
    const href=a.getAttribute('href')||'',local=href.replace(base,'');
    if(local!=='/'&&path.startsWith(local))a.classList.add('is-active');
  });
  if(path.startsWith('/about/')||path.startsWith('/newsroom/')||path.startsWith('/location/')||path.startsWith('/news'))document.querySelector('.ptg-nav-link[href$="/about/"]')?.classList.add('is-active');
  if(path.startsWith('/professionals/')){
    document.querySelector('.ptg-nav-link[href$="/professionals/"]')?.classList.add('is-active');
    const personSlug=path.split('/').filter(Boolean)[1];
    if(personSlug)document.querySelector('.ptg-nav-dropdown--people a[href$="/professionals/'+personSlug+'/"]')?.classList.add('is-active');
  }
  if(path.startsWith('/services/'))document.querySelector('.ptg-nav-link[href$="/services/"]')?.classList.add('is-active');
  if(path.startsWith('/cases/'))document.querySelector('.ptg-nav-link[href$="/cases/"]')?.classList.add('is-active');
  if(path.startsWith('/tools/')||path.startsWith('/fees/')){
    document.querySelector('.ptg-nav-link[href$="/tools/"]')?.classList.add('is-active');
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
    .ptg-site-header__nav{gap:clamp(14px,1.45vw,24px)!important}
    .ptg-nav-link{font-size:15px!important}
    .ptg-nav-dropdown--services-clean{width:260px!important;padding:10px!important}
    .ptg-nav-dropdown--services-clean .ptg-nav-overview{margin-bottom:4px!important;padding-bottom:12px!important;border-bottom:1px solid #eceef1!important;font-weight:700!important;color:#181818!important}
    .ptg-nav-dropdown--services-clean a:not(.ptg-nav-overview){padding-left:12px!important;color:#50555b!important}
    .ptg-nav-dropdown--tools{width:240px!important}
    .ptg-nav-dropdown--tools a{font-size:14px!important}
    .ptg-nav-dropdown--people{width:278px!important;padding:9px!important}
    .ptg-nav-dropdown--people a{font-size:13px!important;line-height:1.5!important;white-space:nowrap!important}
    @media(max-width:1180px) and (min-width:981px){
      .ptg-site-header__logo img{width:142px!important}
      .ptg-site-header__nav{gap:10px!important}
      .ptg-nav-link{font-size:13px!important}
    }
    @media(max-width:980px){
      .ptg-nav-dropdown--services-clean{width:100%!important;padding:0 0 12px 16px!important}
      .ptg-nav-dropdown--tools{width:100%!important;padding:0 0 12px 16px!important}
      .ptg-nav-dropdown--people{width:100%!important;padding:0 0 12px 16px!important}
      .ptg-nav-dropdown--people a{white-space:normal!important;min-height:44px!important}
      .ptg-nav-dropdown--services-clean .ptg-nav-overview{margin:0!important;padding:12px 0!important}
      .ptg-nav-dropdown--services-clean a:not(.ptg-nav-overview){padding:12px 0!important}
      .ptg-nav-item[data-dropdown]>.ptg-nav-link{position:relative!important;padding-right:42px!important}
      .ptg-nav-item[data-dropdown]>.ptg-nav-link:before,.ptg-nav-item[data-dropdown]>.ptg-nav-link:after{content:''!important;display:block!important;position:absolute!important;right:8px!important;top:50%!important;width:12px!important;height:1.5px!important;background:currentColor!important;transition:transform .18s ease!important}
      .ptg-nav-item[data-dropdown]>.ptg-nav-link:after{transform:rotate(90deg)!important}
      .ptg-nav-item[data-dropdown].open>.ptg-nav-link:after{transform:rotate(0)!important}
      .ptg-site-header__nav.open{max-height:calc(100svh - var(--header-height))!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch!important}
    }`;document.head.appendChild(style)}
  const menuBtn=document.querySelector('.ptg-site-header__menu'),nav=document.querySelector('#ptgSiteNav');
  const closeMobileNav=()=>{nav?.classList.remove('open');document.body.classList.remove('ptg-menu-open');menuBtn?.setAttribute('aria-expanded','false');menuBtn?.setAttribute('aria-label','메뉴 열기');if(menuBtn)menuBtn.textContent='☰';document.querySelectorAll('[data-dropdown].open').forEach(x=>x.classList.remove('open'))};\n  menuBtn?.addEventListener('click',()=>{const open=nav?.classList.toggle('open');document.body.classList.toggle('ptg-menu-open',Boolean(open));menuBtn.setAttribute('aria-expanded',String(Boolean(open)));menuBtn.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');menuBtn.textContent=open?'×':'☰'});
  const mobile=matchMedia('(max-width:980px)');
  const bindMobileDropdowns=()=>{if(!mobile.matches)return;document.querySelectorAll('[data-dropdown]>.ptg-nav-link').forEach(link=>{if(link.dataset.ptgBound)return;link.dataset.ptgBound='true';link.addEventListener('click',e=>{if(!mobile.matches)return;const item=link.parentElement;if(!item.classList.contains('open')){e.preventDefault();document.querySelectorAll('[data-dropdown].open').forEach(x=>x!==item&&x.classList.remove('open'));item.classList.add('open')}})})};
  bindMobileDropdowns();\n  nav?.addEventListener('click',e=>{if(!mobile.matches)return;const link=e.target.closest('a');if(!link)return;if(link.closest('.ptg-nav-dropdown')||!link.parentElement?.hasAttribute('data-dropdown'))closeMobileNav()});\n  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open'))closeMobileNav()});\n  mobile.addEventListener?.('change',()=>{bindMobileDropdowns();if(!mobile.matches)closeMobileNav()});

  sharedCssReady.finally(()=>requestAnimationFrame(()=>document.body.classList.add('ptg-ui-ready')));

  if(!document.querySelector('script[data-ptg-analytics]')){const s=document.createElement('script');s.src=`${base}/assets/js/analytics.js?v=20260912-1328`;s.defer=true;s.dataset.ptgAnalytics='true';document.body.appendChild(s)}
  if(!document.querySelector('script[data-ptg-heading-breaks]')){const s=document.createElement('script');s.src=`${base}/assets/js/heading-breaks.js?v=20260915-1426`;s.defer=true;s.dataset.ptgHeadingBreaks='true';document.body.appendChild(s)}
  if((path.startsWith('/inheritance/')||path.startsWith('/center/'))&&!document.querySelector('script[data-ptg-package-landing]')){const s=document.createElement('script');s.src=`${base}/assets/js/package-landing.js?v=20261014-1115`;s.defer=true;s.dataset.ptgPackageLanding='true';document.body.appendChild(s)}

  // Compact quick inquiry: GitHub Pages cannot submit server-side; opens user's mail app.
  (() => {
    const enabled=/^\/(?:ptglaw\/)?(?:center|fees|contact|tools)(?:\/|$)/.test(location.pathname);
    if(!enabled)return;
    const root=document.createElement('div');
    root.className='ptg-quick-inquiry';
    root.innerHTML=`<button type="button" class="ptg-quick-launch" aria-haspopup="dialog" aria-controls="ptgQuickDialog">빠른 간편문의 </button>
      <div class="ptg-quick-overlay" id="ptgQuickOverlay" hidden>
        <div class="ptg-quick-dim" data-quick-close></div>
        <section class="ptg-quick-dialog" id="ptgQuickDialog" role="dialog" aria-modal="true" aria-labelledby="ptgQuickTitle">
          <div class="ptg-quick-heading"><div><span>QUICK CONTACT</span><h2 id="ptgQuickTitle">빠른 간편문의</h2><p>필요한 업무를 간단히 남겨주세요.</p></div><button type="button" data-quick-close aria-label="닫기">×</button></div>
          <form id="ptgQuickForm">
            <label>연락처 <b>*</b><input type="tel" name="phone" autocomplete="tel" placeholder="010-0000-0000" required maxlength="30"></label>
            <label>이메일 <b>*</b><input type="email" name="email" autocomplete="email" placeholder="name@example.com" required maxlength="150"></label>
            <label>문의내용 <b>*</b><textarea name="message" placeholder="어떤 업무가 필요하신가요?" required rows="5" maxlength="3000"></textarea></label>
            <label class="ptg-quick-agree"><input type="checkbox" name="agree" required><span>상담을 위한 개인정보 수집·이용에 동의합니다. <a href="${base}/privacy/" target="_blank" rel="noopener">개인정보처리방침 </a></span></label>
            <button type="submit" class="ptg-quick-send">이메일로 문의하기 </button>
            
            <p id="ptgQuickStatus" role="status" aria-live="polite"></p>
            <a id="ptgQuickFallback" hidden>메일 작성 창 다시 열기 </a>
          </form>
        </section>
      </div>`;
    const css=document.createElement('style');
    css.textContent=`
      .ptg-quick-inquiry{font-family:Pretendard,"Apple SD Gothic Neo",sans-serif;letter-spacing:-.025em}
      .ptg-quick-launch{position:fixed;bottom:24px;right:24px;z-index:8990;background:#f58220;color:#fff;border:0;border-radius:50px;padding:15px 20px;font:700 14px Pretendard,sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.18);cursor:pointer}
      .ptg-quick-launch span{margin-left:8px}
      .ptg-quick-overlay[hidden]{display:none!important}
      .ptg-quick-overlay{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px}
      .ptg-quick-dim{position:absolute;inset:0;background:rgba(10,13,18,.66)}
      .ptg-quick-dialog{position:relative;width:min(100%,480px);max-height:92dvh;overflow-y:auto;background:#fff;padding:30px;border-radius:16px;box-shadow:0 28px 70px rgba(0,0,0,.2);color:#17191d}
      .ptg-quick-heading{display:flex;justify-content:space-between;gap:16px;margin-bottom:24px}.ptg-quick-heading span{font-size:11px;font-weight:700;color:#f58220;letter-spacing:.08em}
      .ptg-quick-heading h2{font-size:26px!important;color:#17191d!important;margin:9px 0!important;line-height:1.3!important}.ptg-quick-heading p{font-size:14px!important;color:#767a80!important;margin:0!important}
      .ptg-quick-heading button{align-self:flex-start;border:0;background:#f4f4f4;border-radius:8px;width:36px;height:36px;font-size:24px;cursor:pointer}
      .ptg-quick-dialog form>label{display:block;margin-bottom:16px;font-size:13px;font-weight:700}.ptg-quick-dialog label b{color:#ed751b}
      .ptg-quick-dialog input:not([type=checkbox]),.ptg-quick-dialog textarea{display:block;width:100%;box-sizing:border-box;margin-top:7px;background:#fff;border:1px solid #dddfe3;border-radius:8px;padding:12px;font:400 15px Pretendard,sans-serif;color:#222;outline-offset:2px}
      .ptg-quick-dialog textarea{resize:vertical;min-height:116px}
      .ptg-quick-dialog .ptg-quick-agree{display:flex;align-items:flex-start;gap:10px;font-size:12px;font-weight:400;line-height:1.6;color:#646970}.ptg-quick-agree input{margin-top:3px;accent-color:#f58220}.ptg-quick-agree a{color:#c75d0c;text-decoration:underline}
      .ptg-quick-send{width:100%;height:49px;border:0;border-radius:8px;background:#f58220;color:#fff;font:700 14px Pretendard,sans-serif;cursor:pointer}
      .ptg-quick-hint,#ptgQuickStatus{font-size:12px!important;color:#777!important;line-height:1.6!important;margin:12px 0 0!important}
      #ptgQuickFallback{display:inline-block;font-size:13px;color:#b55a15;margin-top:10px}#ptgQuickFallback[hidden]{display:none}
      @media(max-width:640px){.ptg-quick-launch{right:14px;bottom:16px;padding:13px 16px}.ptg-quick-dialog{padding:22px;border-radius:14px}}
    `;
    document.head.appendChild(css);document.body.appendChild(root);
    const overlay=root.querySelector('#ptgQuickOverlay'),open=root.querySelector('.ptg-quick-launch'),form=root.querySelector('#ptgQuickForm'),status=root.querySelector('#ptgQuickStatus'),fallback=root.querySelector('#ptgQuickFallback');
    let focus=null;
    function close(){overlay.hidden=true;document.body.style.overflow='';focus?.focus()}
    open.addEventListener('click',()=>{focus=document.activeElement;overlay.hidden=false;document.body.style.overflow='hidden';const selected=document.querySelector('#pcWork option:checked');const selectedService=document.querySelector('.pc-select-grid .is-selected h3');const work=selected?.textContent||selectedService?.textContent||'';if(work&&!form.elements.message.value)form.elements.message.value='문의 업무: '+work+'\\n';form.elements.phone.focus()});
    overlay.querySelectorAll('[data-quick-close]').forEach(node=>node.addEventListener('click',close));
    document.addEventListener('keydown',e=>{if(overlay.hidden)return;if(e.key==='Escape')close();if(e.key==='Tab'){const items=[...overlay.querySelectorAll('button,input,textarea,a')].filter(el=>el.getClientRects().length);const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
    form.addEventListener('submit',async e=>{
      e.preventDefault();if(!form.reportValidity())return;
      const phone=form.elements.phone.value.trim(),email=form.elements.email.value.trim(),message=form.elements.message.value.trim();
      const button=form.querySelector('[type="submit"]');button.disabled=true;status.textContent='문의 접수 중입니다.';
      try{const module=await import(base+'/assets/js/firebase-inquiries.js');await module.submitInquiry({type:'quick',phone,email,message,consent:form.elements.agree.checked});
        status.textContent='문의가 접수되었습니다. 담당자가 내용을 확인하겠습니다.';fallback.hidden=true;form.reset();
      }catch(err){status.textContent='온라인 접수가 완료되지 않았습니다. 이메일로 문의하거나 잠시 후 다시 시도해주세요.';console.warn('문의 접수 오류',err.code||err.message);
        const url='mailto:yhchae@ptglaw.co.kr?subject='+encodeURIComponent('[펜타곤 빠른 문의]')+'&body='+encodeURIComponent(['연락처: '+phone,'이메일: '+email,'','문의내용:',message].join('\n'));
        fallback.href=url;fallback.textContent='이메일로 대신 문의하기 →';fallback.hidden=false;
      }finally{button.disabled=false}
    });
  })();
})();