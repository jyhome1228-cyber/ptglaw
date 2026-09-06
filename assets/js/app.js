(()=>{
  const isProject=location.hostname.endsWith('github.io');
  const base=isProject?'/ptglaw':'';
  const header=document.querySelector('[data-site-header]');
  const footer=document.querySelector('[data-site-footer]');
  const root=document.documentElement;

  const style=document.createElement('style');
  style.textContent=`
    :root{--ptg-orange:#f58220;--ptg-notice-h:58px;--ptg-bottom-h:82px}
    body.ptg-global-ui{padding-top:var(--ptg-notice-h)!important;padding-bottom:var(--ptg-bottom-h)!important}
    body.ptg-global-ui.ptg-notice-hidden{--ptg-notice-h:0px}

    /* TOP NOTICE */
    .ptg-notice-bar{position:fixed;left:0;right:0;top:0;z-index:3000;height:var(--ptg-notice-h);background:#111;color:#fff;font-family:"Pretendard","Noto Sans KR","Apple SD Gothic Neo",Arial,sans-serif;transition:transform .25s ease,opacity .25s ease}
    .ptg-notice-bar.is-hidden{opacity:0;transform:translateY(-100%);pointer-events:none}
    .ptg-notice-bar *{box-sizing:border-box}.ptg-notice-bar a{text-decoration:none;color:inherit}
    .ptg-notice-bar__inner{width:calc(100% - 40px);max-width:1370px;height:100%;margin:0 auto;display:flex;align-items:center;gap:24px}
    .ptg-notice-bar__label{display:inline-flex;align-items:center;gap:8px;flex:0 0 auto;color:#9c9c9c;font-size:10px;font-weight:700;letter-spacing:.08em}
    .ptg-notice-bar__label::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--ptg-orange);box-shadow:0 0 0 3px rgba(245,130,32,.12)}
    .ptg-notice-bar__number{flex:0 0 auto;color:var(--ptg-orange);font-size:11px;font-weight:800}
    .ptg-notice-bar__copy{display:flex;align-items:baseline;gap:16px;min-width:0;flex:1}
    .ptg-notice-bar__copy strong{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12.5px;line-height:1.4;font-weight:700;letter-spacing:-.035em}
    .ptg-notice-bar__copy span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#777;font-size:10.5px;line-height:1.4;letter-spacing:-.02em}
    .ptg-notice-bar__actions{display:flex;align-items:center;gap:18px;flex:0 0 auto}
    .ptg-notice-bar__consult{display:inline-flex;align-items:center;gap:10px;font-size:11px;font-weight:700;white-space:nowrap}.ptg-notice-bar__consult b{color:var(--ptg-orange);font-size:15px;font-weight:400}
    .ptg-notice-bar__indicator{display:flex;align-items:center;gap:6px;padding:0 16px;border-left:1px solid #2f2f2f;border-right:1px solid #2f2f2f}.ptg-notice-bar__indicator i{display:block;width:28px;height:2px;background:#4e4e4e}.ptg-notice-bar__indicator i:first-child{background:var(--ptg-orange)}
    .ptg-notice-bar__today{appearance:none;border:0;background:none;color:#858585;font-family:inherit;font-size:10px;cursor:pointer;white-space:nowrap}.ptg-notice-bar__today:hover{color:#fff}
    .ptg-notice-bar__close{appearance:none;width:28px;height:28px;border:1px solid #4d4d4d;border-radius:50%;background:transparent;color:#aaa;font-family:inherit;font-size:17px;line-height:1;cursor:pointer}.ptg-notice-bar__close:hover{border-color:#fff;color:#fff}

    /* HEADER */
    .ptg-site-header{position:sticky;top:var(--ptg-notice-h);z-index:2000;width:100%;background:rgba(25,53,78,.94);border-bottom:1px solid rgba(255,255,255,.18);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);font-family:"Pretendard","Noto Sans KR","Apple SD Gothic Neo",Arial,sans-serif;transition:top .25s ease}
    .ptg-site-header *{box-sizing:border-box}.ptg-site-header a{text-decoration:none}
    .ptg-site-header__inner{width:calc(100% - 40px);max-width:1370px;height:92px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:32px}
    .ptg-site-header__logo{display:inline-flex;align-items:center;flex:0 0 auto;line-height:0}.ptg-site-header__logo img{display:block;width:176px;height:auto;filter:brightness(0) invert(1)}
    .ptg-site-header__nav{display:flex;align-items:stretch;justify-content:flex-end;gap:clamp(18px,1.8vw,34px);margin-left:auto;height:100%}
    .ptg-nav-item{position:relative;display:flex;align-items:center;height:100%}.ptg-nav-link{position:relative;display:inline-flex;align-items:center;height:100%;color:#fff;font-size:14px;font-weight:500;line-height:1.4;letter-spacing:-.02em;white-space:nowrap;opacity:.95;transition:opacity .2s ease,color .2s ease}
    .ptg-nav-link:hover,.ptg-nav-item:hover>.ptg-nav-link,.ptg-nav-item:focus-within>.ptg-nav-link,.ptg-nav-link.is-active{color:var(--ptg-orange);opacity:1}
    .ptg-nav-dropdown{position:absolute;left:-18px;top:calc(100% - 1px);width:164px;padding:6px 0;background:#fff;border:1px solid rgba(17,17,17,.08);box-shadow:0 10px 24px rgba(0,0,0,.12);opacity:0;visibility:hidden;transform:translateY(8px);transition:opacity .18s ease,transform .18s ease,visibility .18s ease}
    .ptg-nav-item:hover>.ptg-nav-dropdown,.ptg-nav-item:focus-within>.ptg-nav-dropdown{opacity:1;visibility:visible;transform:translateY(0)}
    .ptg-nav-dropdown a{display:block;padding:12px 18px;color:#333;font-size:13px;line-height:1.35;font-weight:500;letter-spacing:-.025em;transition:background .16s ease,color .16s ease}.ptg-nav-dropdown a:hover,.ptg-nav-dropdown a.is-active{background:#f7f7f7;color:var(--ptg-orange)}
    .ptg-site-header__menu{display:none;border:0;background:transparent;color:#fff;padding:10px 0;font-size:12px;font-weight:700;letter-spacing:.08em;cursor:pointer}

    /* BOTTOM CTA */
    .ptg-bottom-cta{position:fixed;left:0;right:0;bottom:0;z-index:2800;height:var(--ptg-bottom-h);background:var(--ptg-orange);color:#fff;font-family:"Pretendard","Noto Sans KR","Apple SD Gothic Neo",Arial,sans-serif;box-shadow:0 -8px 28px rgba(0,0,0,.08)}
    .ptg-bottom-cta *{box-sizing:border-box}.ptg-bottom-cta a{text-decoration:none;color:inherit}
    .ptg-bottom-cta__inner{width:calc(100% - 40px);max-width:1370px;height:100%;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:36px}
    .ptg-bottom-cta__lead{display:flex;align-items:center;gap:18px;min-width:0}.ptg-bottom-cta__lead img{width:40px;height:40px;object-fit:contain;filter:brightness(0) invert(1);flex:0 0 auto}.ptg-bottom-cta__lead strong{display:block;margin-bottom:5px;font-size:14px;line-height:1.25;font-weight:750;letter-spacing:-.035em}.ptg-bottom-cta__lead p{margin:0;color:rgba(255,255,255,.75);font-size:10.5px;line-height:1.5;letter-spacing:-.02em}
    .ptg-bottom-cta__actions{display:flex;align-items:center;gap:28px;flex:0 0 auto}.ptg-bottom-cta__phone span{display:block;margin-bottom:3px;color:rgba(255,255,255,.72);font-size:9px;font-weight:600}.ptg-bottom-cta__phone strong{font-size:17px;line-height:1;font-weight:800;letter-spacing:-.03em}.ptg-bottom-cta__button{display:inline-flex;align-items:center;justify-content:center;min-width:132px;height:46px;padding:0 18px;background:#fff;color:var(--ptg-orange)!important;font-size:12px;font-weight:800;letter-spacing:-.03em;transition:transform .2s ease,background .2s ease}.ptg-bottom-cta__button:hover{transform:translateY(-2px);background:#fff8f2}

    /* FOOTER */
    .ptg-site-footer{--ptg-yellow:#ffb500;--ptg-black:#111;--ptg-text:#4b4b4b;--ptg-muted:#888;--ptg-line:rgba(17,17,17,.13);--ptg-max:1370px;position:relative;width:100%!important;max-width:100%!important;margin:0!important;padding:0!important;background:#fff;color:var(--ptg-black);border-top:1px solid var(--ptg-line);font-family:"Pretendard","Noto Sans KR","Apple SD Gothic Neo",Arial,sans-serif;box-sizing:border-box}
    .ptg-site-footer *,.ptg-site-footer *::before,.ptg-site-footer *::after{box-sizing:border-box;word-break:keep-all}.ptg-site-footer a{color:inherit;text-decoration:none}
    .ptg-site-footer__inner{width:calc(100% - 40px);max-width:var(--ptg-max);margin:0 auto}.ptg-site-footer__top{display:grid;grid-template-columns:minmax(240px,1.08fr) repeat(3,minmax(130px,.62fr)) minmax(220px,.9fr);gap:30px;padding:68px 0 58px}
    .ptg-site-footer__brand{min-width:0}.ptg-site-footer__logo{display:inline-flex;align-items:center;width:238px;max-width:100%;line-height:0}.ptg-site-footer__logo img{display:block;width:100%;height:auto}
    .ptg-site-footer__brand-copy{margin:27px 0 0;color:var(--ptg-text);font-size:14px;line-height:1.8;letter-spacing:-.03em}.ptg-site-footer__inquiry{display:inline-flex;align-items:center;gap:12px;margin-top:24px;color:var(--ptg-orange)!important;font-size:13px;line-height:1.5;font-weight:700}.ptg-site-footer__inquiry span{font-size:16px;transition:transform .2s ease}.ptg-site-footer__inquiry:hover span{transform:translateX(4px)}
    .ptg-site-footer__menu,.ptg-site-footer__contact{min-width:0;padding-top:5px}.ptg-site-footer__menu-title{margin:0 0 22px;color:var(--ptg-orange);font-size:10.5px;line-height:1;font-weight:700;letter-spacing:.08em}.ptg-site-footer__menu{display:flex;flex-direction:column;align-items:flex-start}.ptg-site-footer__menu a{position:relative;display:inline-flex;margin:0 0 13px;color:#444;font-size:13px;line-height:1.45;font-weight:500;letter-spacing:-.025em;transition:color .2s ease}.ptg-site-footer__menu a:hover{color:var(--ptg-orange)}
    .ptg-site-footer__contact-main{padding-bottom:17px;border-bottom:1px solid var(--ptg-line)}.ptg-site-footer__contact-main span{display:block;margin-bottom:6px;color:var(--ptg-muted);font-size:11px;line-height:1.3}.ptg-site-footer__contact-main a{color:#111;font-size:22px;line-height:1.2;font-weight:700;letter-spacing:-.04em}.ptg-site-footer__contact dl{margin:18px 0 0}.ptg-site-footer__contact dl>div{display:grid;grid-template-columns:58px minmax(0,1fr);gap:10px;margin-top:10px}.ptg-site-footer__contact dt{color:var(--ptg-muted);font-size:9.5px;line-height:1.6;font-weight:700;letter-spacing:.04em}.ptg-site-footer__contact dd{min-width:0;margin:0;color:#555;font-size:12px;line-height:1.6;letter-spacing:-.02em;overflow-wrap:anywhere}
    .ptg-site-footer__office{display:grid;grid-template-columns:1fr auto;gap:40px;align-items:center;min-width:0;padding:22px 0;border-top:1px solid var(--ptg-line)}.ptg-site-footer__address{display:flex;align-items:center;gap:18px;min-width:0}.ptg-site-footer__address span{flex:0 0 auto;color:var(--ptg-orange);font-size:9.5px;line-height:1;font-weight:700;letter-spacing:.08em}.ptg-site-footer__address p{margin:0;color:#555;font-size:12px;line-height:1.65;letter-spacing:-.025em;overflow-wrap:anywhere}.ptg-site-footer__legal{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:9px 18px;min-width:0}.ptg-site-footer__legal p,.ptg-site-footer__legal a{margin:0;color:#777;font-size:11px;line-height:1.6;letter-spacing:-.02em}.ptg-site-footer__legal a:hover{color:var(--ptg-orange)}

    @media(max-width:1180px){.ptg-notice-bar__inner,.ptg-site-header__inner,.ptg-bottom-cta__inner,.ptg-site-footer__inner{width:calc(100% - 32px)}.ptg-site-header__nav{gap:18px}.ptg-nav-link{font-size:13px}.ptg-notice-bar__copy span{display:none}.ptg-site-footer__top{grid-template-columns:minmax(280px,1.2fr) repeat(2,minmax(160px,.7fr)) minmax(250px,.9fr)}.ptg-site-footer__menu:nth-of-type(3){display:none}}
    @media(max-width:980px){
      :root{--ptg-notice-h:52px;--ptg-bottom-h:70px}
      .ptg-notice-bar__inner{gap:12px}.ptg-notice-bar__label{display:none}.ptg-notice-bar__copy strong{font-size:11.5px}.ptg-notice-bar__indicator{display:none}.ptg-notice-bar__consult{display:none}.ptg-notice-bar__today{font-size:9.5px}
      .ptg-site-header__inner{height:78px}.ptg-site-header__logo img{width:154px}.ptg-site-header__menu{display:block}
      .ptg-site-header__nav{position:absolute;top:78px;left:0;right:0;height:auto;display:none;flex-direction:column;align-items:stretch;gap:0;margin:0;padding:12px 24px 22px;background:rgba(25,53,78,.99);border-top:1px solid rgba(255,255,255,.12)}.ptg-site-header__nav.open{display:flex}.ptg-nav-item{display:block;height:auto;border-bottom:1px solid rgba(255,255,255,.1)}.ptg-nav-link{width:100%;height:auto;padding:14px 0;font-size:14px}.ptg-nav-dropdown{position:static;width:100%;padding:0 0 10px 14px;background:transparent;border:0;box-shadow:none;opacity:1;visibility:visible;transform:none;display:none}.ptg-nav-item.open>.ptg-nav-dropdown{display:block}.ptg-nav-dropdown a{padding:10px 0;color:rgba(255,255,255,.72);font-size:13px}.ptg-nav-dropdown a:hover,.ptg-nav-dropdown a.is-active{background:transparent;color:var(--ptg-orange)}
      .ptg-bottom-cta__lead p{display:none}.ptg-bottom-cta__lead img{width:34px;height:34px}.ptg-bottom-cta__lead strong{font-size:13px;margin:0}.ptg-bottom-cta__actions{gap:14px}.ptg-bottom-cta__phone span{display:none}.ptg-bottom-cta__phone strong{font-size:15px}.ptg-bottom-cta__button{min-width:108px;height:40px;padding:0 14px}
    }
    @media(max-width:860px){.ptg-site-footer__top{grid-template-columns:1fr 1fr;gap:42px 30px;padding:54px 0 46px}.ptg-site-footer__brand{grid-column:1/-1;padding-bottom:32px;border-bottom:1px solid var(--ptg-line)}.ptg-site-footer__contact{grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;gap:22px 30px;padding-top:28px;border-top:1px solid var(--ptg-line)}.ptg-site-footer__contact .ptg-site-footer__menu-title{grid-column:1/-1;margin-bottom:0}.ptg-site-footer__contact dl{margin-top:0}.ptg-site-footer__office{grid-template-columns:1fr;gap:16px}.ptg-site-footer__legal{justify-content:flex-start}}
    @media(max-width:560px){
      :root{--ptg-notice-h:48px;--ptg-bottom-h:64px}
      .ptg-notice-bar__inner,.ptg-site-header__inner,.ptg-bottom-cta__inner,.ptg-site-footer__inner{width:calc(100% - 28px)}.ptg-notice-bar__number{display:none}.ptg-notice-bar__copy strong{font-size:10.8px}.ptg-notice-bar__today{display:none}.ptg-notice-bar__close{width:25px;height:25px;font-size:15px;flex:0 0 25px}
      .ptg-site-header__inner{height:72px}.ptg-site-header__logo img{width:142px}.ptg-site-header__nav{top:72px}
      .ptg-bottom-cta__lead{gap:10px}.ptg-bottom-cta__lead img{display:none}.ptg-bottom-cta__lead strong{font-size:12px}.ptg-bottom-cta__phone strong{font-size:13px}.ptg-bottom-cta__actions{gap:9px}.ptg-bottom-cta__button{min-width:88px;height:38px;padding:0 11px;font-size:11px}
      .ptg-site-footer__top{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:30px 22px!important;padding:40px 0 34px!important}.ptg-site-footer__brand{grid-column:1/-1!important;padding-bottom:28px!important;border-bottom:1px solid var(--ptg-line)!important}.ptg-site-footer__logo{width:205px!important}.ptg-site-footer__brand-copy{max-width:330px;margin-top:20px!important;font-size:13px!important;line-height:1.72!important}.ptg-site-footer__inquiry{margin-top:18px!important;font-size:13px!important}.ptg-site-footer__menu,.ptg-site-footer__contact{grid-column:auto!important;display:flex!important;flex-direction:column!important;min-width:0!important;padding:0 0 22px!important;border-top:0!important;border-bottom:1px solid var(--ptg-line)!important}.ptg-site-footer__menu:nth-of-type(3){display:flex!important}.ptg-site-footer__menu-title,.ptg-site-footer__contact .ptg-site-footer__menu-title{margin:0 0 16px!important;font-size:10px!important}.ptg-site-footer__menu a{margin-bottom:10px!important;font-size:12.5px!important}.ptg-site-footer__contact-main a{font-size:18px!important}.ptg-site-footer__contact dl>div{display:block!important;margin-top:9px!important}.ptg-site-footer__contact dd{font-size:10.5px!important}.ptg-site-footer__office{grid-template-columns:1fr!important;gap:14px!important;padding:18px 0!important}.ptg-site-footer__address{display:block!important}.ptg-site-footer__address span{display:block!important;margin-bottom:7px!important}.ptg-site-footer__address p{font-size:11px!important}.ptg-site-footer__legal{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;justify-content:initial!important;gap:7px 14px!important}.ptg-site-footer__legal p,.ptg-site-footer__legal a{font-size:10px!important}
    }
  `;
  document.head.appendChild(style);
  document.body.classList.add('ptg-global-ui');

  const todayKey=()=>new Date().toISOString().slice(0,10);
  const notice=document.createElement('div');
  notice.className='ptg-notice-bar';
  notice.innerHTML=`<div class="ptg-notice-bar__inner"><span class="ptg-notice-bar__label">PTG NOTICE</span><span class="ptg-notice-bar__number">01</span><div class="ptg-notice-bar__copy"><strong>변호사·세무사·변리사 자격을 갖춘 대표가 직접 소통하고 상담합니다.</strong><span>법률·세무·지식재산권 쟁점을 하나의 흐름으로 검토합니다.</span></div><div class="ptg-notice-bar__actions"><a class="ptg-notice-bar__consult" href="${base}/contact/">상담 신청 <b>→</b></a><span class="ptg-notice-bar__indicator" aria-hidden="true"><i></i><i></i></span><button type="button" class="ptg-notice-bar__today">오늘 하루 보지 않기</button><button type="button" class="ptg-notice-bar__close" aria-label="공지 닫기">×</button></div></div>`;
  document.body.prepend(notice);

  const hideNotice=(remember)=>{
    if(remember){try{localStorage.setItem('ptgNoticeHiddenDate',todayKey())}catch(e){}}
    notice.classList.add('is-hidden');
    document.body.classList.add('ptg-notice-hidden');
  };
  try{if(localStorage.getItem('ptgNoticeHiddenDate')===todayKey()) hideNotice(false)}catch(e){}
  notice.querySelector('.ptg-notice-bar__today')?.addEventListener('click',()=>hideNotice(true));
  notice.querySelector('.ptg-notice-bar__close')?.addEventListener('click',()=>hideNotice(false));

  const bottom=document.createElement('div');
  bottom.className='ptg-bottom-cta';
  bottom.innerHTML=`<div class="ptg-bottom-cta__inner"><div class="ptg-bottom-cta__lead"><img src="${base}/assets/images/logo.svg" alt=""><div><strong>펜타곤에 문의를 남겨주세요.</strong><p>담당 전문가가 내용을 확인한 뒤 빠르게 상담드립니다.</p></div></div><div class="ptg-bottom-cta__actions"><a class="ptg-bottom-cta__phone" href="tel:0264475599"><span>전화 문의</span><strong>02-6447-5599</strong></a><a class="ptg-bottom-cta__button" href="${base}/contact/">상담 신청하기&nbsp;&nbsp;→</a></div></div>`;
  document.body.appendChild(bottom);

  if(header) header.innerHTML=`
    <header class="ptg-site-header"><div class="ptg-site-header__inner">
      <a class="ptg-site-header__logo" href="${base}/" aria-label="펜타곤 메인으로 이동"><img src="${base}/assets/images/logo.svg" alt="Pentagon"></a>
      <nav class="ptg-site-header__nav" id="ptgSiteNav" aria-label="주요 메뉴">
        <div class="ptg-nav-item" data-dropdown><a class="ptg-nav-link" href="${base}/about/">펜타곤 소개</a><div class="ptg-nav-dropdown"><a href="${base}/about/">인사말·비전</a><a href="${base}/newsroom/">펜타곤 소식</a><a href="${base}/location/">오시는 길</a></div></div>
        <div class="ptg-nav-item" data-dropdown><a class="ptg-nav-link" href="${base}/services/">업무분야</a><div class="ptg-nav-dropdown"><a href="${base}/services/legal/">법률</a><a href="${base}/services/tax/">세무</a><a href="${base}/services/ip/">IP</a><a href="${base}/services/recovery/">추심</a><a href="${base}/services/registry/">등기</a></div></div>
        <div class="ptg-nav-item" data-dropdown><a class="ptg-nav-link" href="${base}/professionals/">구성원 소개</a><div class="ptg-nav-dropdown"><a href="${base}/professionals/chaeyonghyun/">채용현</a><a href="${base}/professionals/kanggeon/">강건</a><a href="${base}/professionals/kimjisoo/">김지수</a><a href="${base}/professionals/jeonseunghwan/">전승환</a></div></div>
        <div class="ptg-nav-item"><a class="ptg-nav-link" href="${base}/cases/">업무사례</a></div><div class="ptg-nav-item"><a class="ptg-nav-link" href="${base}/inheritance/">상속원스탑서비스</a></div><div class="ptg-nav-item"><a class="ptg-nav-link" href="${base}/center/">법인설립지원센터</a></div><div class="ptg-nav-item"><a class="ptg-nav-link" href="${base}/contact/">문의하기</a></div>
      </nav><button class="ptg-site-header__menu" type="button" aria-label="메뉴 열기" aria-expanded="false" aria-controls="ptgSiteNav">MENU</button>
    </div></header>`;

  if(footer) footer.innerHTML=`
    <footer class="ptg-site-footer"><div class="ptg-site-footer__inner"><div class="ptg-site-footer__top">
      <div class="ptg-site-footer__brand"><a href="${base}/" class="ptg-site-footer__logo" aria-label="펜타곤 메인으로 이동"><img src="${base}/assets/images/logo.svg" alt="Pentagon"></a><p class="ptg-site-footer__brand-copy">법률·세무·지식재산권·채권추심·등기를<br>하나의 해결 흐름으로 연결합니다.</p><a href="${base}/contact/" class="ptg-site-footer__inquiry">상담하러가기 <span aria-hidden="true">→</span></a></div>
      <nav class="ptg-site-footer__menu" aria-label="펜타곤 소개 메뉴"><p class="ptg-site-footer__menu-title">ABOUT</p><a href="${base}/about/">펜타곤 소개</a><a href="${base}/professionals/">구성원 소개</a><a href="${base}/newsroom/">뉴스룸</a><a href="${base}/location/">오시는 길</a></nav>
      <nav class="ptg-site-footer__menu" aria-label="업무분야 메뉴"><p class="ptg-site-footer__menu-title">SERVICES</p><a href="${base}/services/legal/">법률 자문 및 소송</a><a href="${base}/services/tax/">세무 기장 및 자문</a><a href="${base}/services/ip/">IP 지식재산권</a><a href="${base}/services/recovery/">채권 추심</a><a href="${base}/services/registry/">등기 업무</a></nav>
      <nav class="ptg-site-footer__menu" aria-label="바로가기 메뉴"><p class="ptg-site-footer__menu-title">QUICK LINKS</p><a href="${base}/cases/">업무사례</a><a href="${base}/review/">상담후기</a><a href="${base}/center/">법인설립지원센터</a><a href="${base}/contact/">문의하기</a></nav>
      <div class="ptg-site-footer__contact"><p class="ptg-site-footer__menu-title">CONTACT</p><div class="ptg-site-footer__contact-main"><span>대표 문의</span><a href="tel:0264475597">02-6447-5597</a></div><dl><div><dt>FAX</dt><dd>02-6447-5598 / 02-6447-5599</dd></div><div><dt>MOBILE</dt><dd><a href="tel:01032113132">010-3211-3132</a></dd></div><div><dt>E-MAIL</dt><dd><a href="mailto:yhchae@ptglaw.co.kr">yhchae@ptglaw.co.kr</a></dd></div></dl></div>
    </div><div class="ptg-site-footer__office" id="office"><div class="ptg-site-footer__address"><span>OFFICE</span><p>서울 서초구 반포대로30길 32, 3층 (서초동, 트러스트힐)</p></div><div class="ptg-site-footer__legal"><p>광고책임변호사 : 채용현</p><a href="${base}/privacy/">개인정보처리방침</a><a href="mailto:yhchae@ptglaw.co.kr">이메일무단수집거부</a></div></div></div></footer>`;

  const path=location.pathname.replace(base,'')||'/';
  document.querySelectorAll('.ptg-nav-link,.ptg-nav-dropdown a').forEach(a=>{const href=a.getAttribute('href')||'';const local=href.replace(base,'');if(local!=='/'&&path.startsWith(local)) a.classList.add('is-active')});
  if(path.startsWith('/services/')) document.querySelector('.ptg-nav-link[href$="/services/"]')?.classList.add('is-active');
  if(path.startsWith('/about/')||path.startsWith('/newsroom/')||path.startsWith('/location/')) document.querySelector('.ptg-nav-link[href$="/about/"]')?.classList.add('is-active');
  if(path.startsWith('/professionals/')) document.querySelector('.ptg-nav-link[href$="/professionals/"]')?.classList.add('is-active');

  const btn=document.querySelector('.ptg-site-header__menu');const nav=document.querySelector('#ptgSiteNav');
  btn?.addEventListener('click',()=>{const open=nav?.classList.toggle('open');btn.setAttribute('aria-expanded',String(Boolean(open)));btn.textContent=open?'CLOSE':'MENU'});
  if(matchMedia('(max-width:980px)').matches){document.querySelectorAll('[data-dropdown]>.ptg-nav-link').forEach(link=>link.addEventListener('click',e=>{const item=link.parentElement;if(!item.classList.contains('open')){e.preventDefault();document.querySelectorAll('[data-dropdown].open').forEach(x=>x!==item&&x.classList.remove('open'));item.classList.add('open')}}))}
})();