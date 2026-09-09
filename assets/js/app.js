(()=>{
  const isProject=location.hostname.endsWith('github.io');
  const base=isProject?'/ptglaw':'';
  const header=document.querySelector('[data-site-header]');
  const footer=document.querySelector('[data-site-footer]');
  const CSS_VERSION='20260909-0955';
  const LOGO_VERSION='20260909-0955';

  /* Load the only three global layers in a deterministic order. */
  const ensureCss=(key,file)=>{
    if(document.querySelector(`link[data-${key}]`)) return;
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href=`${base}/assets/css/${file}?v=${CSS_VERSION}`;
    link.setAttribute(`data-${key}`,'true');
    document.head.appendChild(link);
  };
  ensureCss('ptg-universal','universal.css');
  ensureCss('ptg-seed-final','seed-final.css');
  ensureCss('ptg-chrome','chrome.css');

  document.body.classList.add('ptg-global-ui');

  const localDateKey=()=>{
    const d=new Date();
    const y=d.getFullYear();
    const m=String(d.getMonth()+1).padStart(2,'0');
    const day=String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${day}`;
  };

  const notice=document.createElement('div');
  notice.className='ptg-notice-bar';
  notice.innerHTML=`
    <div class="ptg-notice-bar__inner">
      <div class="ptg-notice-bar__copy">
        <strong>변호사·세무사·변리사 자격을 갖춘 대표가 직접 소통하고 상담합니다.</strong>
        <span>법률·세무·지식재산권 쟁점을 하나의 흐름으로 검토합니다.</span>
      </div>
      <div class="ptg-notice-bar__actions">
        <button type="button" class="ptg-notice-bar__today">오늘 하루 보지 않기</button>
        <button type="button" class="ptg-notice-bar__close" aria-label="공지 닫기">×</button>
      </div>
    </div>`;
  document.body.prepend(notice);

  const hideNotice=(remember=false)=>{
    if(remember){try{localStorage.setItem('ptgNoticeHiddenDate',localDateKey())}catch(e){}}
    notice.classList.add('is-hidden');
    document.body.classList.add('ptg-notice-hidden');
  };
  try{if(localStorage.getItem('ptgNoticeHiddenDate')===localDateKey())hideNotice(false)}catch(e){}
  notice.querySelector('.ptg-notice-bar__today')?.addEventListener('click',()=>hideNotice(true));
  notice.querySelector('.ptg-notice-bar__close')?.addEventListener('click',()=>hideNotice(false));

  const logoSrc=`${base}/assets/images/logo.svg?v=${LOGO_VERSION}`;

  if(header){
    header.innerHTML=`
      <header class="ptg-site-header">
        <div class="ptg-site-header__inner">
          <a class="ptg-site-header__logo" href="${base}/" aria-label="펜타곤 메인"><img src="${logoSrc}" alt="Pentagon Legal & Tax Partners"></a>
          <nav class="ptg-site-header__nav" id="ptgSiteNav" aria-label="주요 메뉴">
            <div class="ptg-nav-item" data-dropdown>
              <a class="ptg-nav-link" href="${base}/about/">펜타곤 소개</a>
              <div class="ptg-nav-dropdown"><a href="${base}/about/">인사말·비전</a><a href="${base}/newsroom/">펜타곤 소식</a><a href="${base}/location/">오시는 길</a></div>
            </div>
            <div class="ptg-nav-item" data-dropdown>
              <a class="ptg-nav-link" href="${base}/services/">업무분야</a>
              <div class="ptg-nav-dropdown ptg-nav-dropdown--services">
                <a href="${base}/services/legal/"><strong>법률 자문 및 소송</strong><span>계약·분쟁·민형사·행정 대응</span></a>
                <a href="${base}/services/tax/"><strong>세무 기장 및 자문</strong><span>기장·신고·세무조사·조세불복</span></a>
                <a href="${base}/services/ip/"><strong>IP 지식재산권</strong><span>상표·특허·디자인·침해 대응</span></a>
                <a href="${base}/services/recovery/"><strong>채권 추심</strong><span>미수금·지급명령·소송·집행</span></a>
                <a href="${base}/services/registry/"><strong>등기 업무</strong><span>법인·부동산·상속·변경등기</span></a>
              </div>
            </div>
            <div class="ptg-nav-item" data-dropdown>
              <a class="ptg-nav-link" href="${base}/professionals/">구성원 소개</a>
              <div class="ptg-nav-dropdown ptg-nav-dropdown--people">
                <a href="${base}/professionals/chaeyonghyun/">채용현 대표변호사 | 세무사</a>
                <a href="${base}/professionals/kanggeon/">강건 파트너변호사</a>
                <a href="${base}/professionals/jeonseunghwan/">전승환 파트너변호사</a>
                <a href="${base}/professionals/kimjisoo/">김지수 소속세무사</a>
              </div>
            </div>
            <div class="ptg-nav-item"><a class="ptg-nav-link" href="${base}/cases/">업무사례</a></div>
            <div class="ptg-nav-item"><a class="ptg-nav-link" href="${base}/inheritance/">상속원스탑서비스</a></div>
            <div class="ptg-nav-item"><a class="ptg-nav-link" href="${base}/center/">법인설립지원센터</a></div>
            <div class="ptg-nav-item"><a class="ptg-nav-link" href="${base}/contact/">문의하기</a></div>
          </nav>
          <button class="ptg-site-header__menu" type="button" aria-expanded="false" aria-controls="ptgSiteNav">메뉴</button>
        </div>
      </header>`;
  }

  if(footer){
    footer.innerHTML=`
      <footer class="ptg-site-footer"><div class="ptg-site-footer__inner">
        <div class="ptg-site-footer__top">
          <div class="ptg-site-footer__brand">
            <a href="${base}/" class="ptg-site-footer__logo"><img src="${logoSrc}" alt="Pentagon Legal & Tax Partners"></a>
            <p class="ptg-site-footer__brand-copy">법률·세무·지식재산권·채권추심·등기를<br>하나의 해결 흐름으로 연결합니다.</p>
          </div>
          <nav class="ptg-site-footer__menu" aria-label="펜타곤 소개"><p class="ptg-site-footer__menu-title">펜타곤</p><a href="${base}/about/">펜타곤 소개</a><a href="${base}/professionals/">구성원 소개</a><a href="${base}/newsroom/">뉴스룸</a><a href="${base}/location/">오시는 길</a></nav>
          <nav class="ptg-site-footer__menu" aria-label="업무분야"><p class="ptg-site-footer__menu-title">업무분야</p><a href="${base}/services/legal/">법률 자문 및 소송</a><a href="${base}/services/tax/">세무 기장 및 자문</a><a href="${base}/services/ip/">IP 지식재산권</a><a href="${base}/services/recovery/">채권 추심</a><a href="${base}/services/registry/">등기 업무</a></nav>
          <nav class="ptg-site-footer__menu" aria-label="바로가기"><p class="ptg-site-footer__menu-title">바로가기</p><a href="${base}/cases/">업무사례</a><a href="${base}/inheritance/">상속원스탑서비스</a><a href="${base}/center/">법인설립지원센터</a><a href="${base}/contact/">문의하기</a></nav>
          <div class="ptg-site-footer__contact"><p class="ptg-site-footer__menu-title">문의</p><div class="ptg-site-footer__contact-main"><span>대표 문의</span><a href="tel:0264475597">02-6447-5597</a></div><dl><div><dt>팩스</dt><dd>02-6447-5598 / 02-6447-5599</dd></div><div><dt>휴대전화</dt><dd><a href="tel:01032113132">010-3211-3132</a></dd></div><div><dt>이메일</dt><dd><a href="mailto:yhchae@ptglaw.co.kr">yhchae@ptglaw.co.kr</a></dd></div></dl></div>
        </div>
        <div class="ptg-site-footer__office"><div class="ptg-site-footer__address"><span>주소</span><p>서울 서초구 반포대로30길 32, 3층 (서초동, 트러스트힐)</p></div><div class="ptg-site-footer__legal"><p>광고책임변호사 : 채용현</p><a href="${base}/privacy/">개인정보처리방침</a><a href="mailto:yhchae@ptglaw.co.kr">이메일무단수집거부</a></div></div>
      </div></footer>`;
  }

  const path=location.pathname.replace(base,'')||'/';
  document.querySelectorAll('.ptg-nav-link,.ptg-nav-dropdown a').forEach(a=>{
    const href=a.getAttribute('href')||'';
    const local=href.replace(base,'');
    if(local!=='/'&&path.startsWith(local)) a.classList.add('is-active');
  });
  if(path.startsWith('/services/'))document.querySelector('.ptg-nav-link[href$="/services/"]')?.classList.add('is-active');
  if(path.startsWith('/about/')||path.startsWith('/newsroom/')||path.startsWith('/location/')||path.startsWith('/news'))document.querySelector('.ptg-nav-link[href$="/about/"]')?.classList.add('is-active');
  if(path.startsWith('/professionals/'))document.querySelector('.ptg-nav-link[href$="/professionals/"]')?.classList.add('is-active');

  const menuBtn=document.querySelector('.ptg-site-header__menu');
  const nav=document.querySelector('#ptgSiteNav');
  menuBtn?.addEventListener('click',()=>{
    const open=nav?.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded',String(Boolean(open)));
    menuBtn.textContent=open?'닫기':'메뉴';
  });

  const mobile=matchMedia('(max-width:980px)');
  const bindMobileDropdowns=()=>{
    if(!mobile.matches)return;
    document.querySelectorAll('[data-dropdown]>.ptg-nav-link').forEach(link=>{
      if(link.dataset.ptgBound)return;
      link.dataset.ptgBound='true';
      link.addEventListener('click',e=>{
        const item=link.parentElement;
        if(!item.classList.contains('open')){
          e.preventDefault();
          document.querySelectorAll('[data-dropdown].open').forEach(x=>x!==item&&x.classList.remove('open'));
          item.classList.add('open');
        }
      });
    });
  };
  bindMobileDropdowns();
  mobile.addEventListener?.('change',bindMobileDropdowns);
})();