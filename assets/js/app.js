(()=>{
  const isProject=location.hostname.endsWith('github.io');
  const base=isProject?'/ptglaw':'';
  const header=document.querySelector('[data-site-header]');
  const footer=document.querySelector('[data-site-footer]');

  const style=document.createElement('style');
  style.textContent=`
    :root{
      --ptg-orange:#f58220;
      --ptg-yellow:#ffb500;
      --ptg-ink:#141414;
      --ptg-muted:#747474;
      --ptg-line:#e6e6e3;
      --ptg-soft:#f7f7f5;
      --ptg-container:1440px;
      --ptg-gutter:24px;
      --ptg-header-h:104px;
      --ptg-notice-h:58px;
      --ptg-bottom-h:82px;
      --ptg-fs-display:clamp(36px,3.8vw,50px);
      --ptg-fs-h1:clamp(34px,3.5vw,46px);
      --ptg-fs-h2:clamp(26px,2.25vw,34px);
      --ptg-fs-h3:clamp(22px,1.8vw,28px);
      --ptg-body:17px;
      --ptg-body-lg:18px;
      --ptg-body-sm:16px;
      --ptg-label:14px;
    }

    html{color-scheme:light;background:#fff}
    body.ptg-global-ui{
      margin:0!important;
      padding-top:var(--ptg-notice-h)!important;
      padding-bottom:var(--ptg-bottom-h)!important;
      background:#fff!important;
      color:var(--ptg-ink)!important;
      font-family:'Pretendard',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif!important;
      font-size:var(--ptg-body)!important;
      font-weight:400!important;
      line-height:1.7!important;
      letter-spacing:-.022em!important;
      word-break:keep-all!important;
      -webkit-font-smoothing:antialiased;
    }
    body.ptg-global-ui.ptg-notice-hidden{--ptg-notice-h:0px}

    /* unified horizontal line */
    .ptg-notice-bar__inner,
    .ptg-site-header__inner,
    .ptg-bottom-cta__inner,
    .ptg-site-footer__inner,
    .wrap,
    .shell,
    .penta-business-inner,
    .penta-law-inner,
    .penta-tax-inner,
    .penta-ip-inner,
    .penta-reg-inner,
    .ptg-case-list-page__inner,
    #ptg-inherit-onestop .ptg-inner,
    .ptg-center-modern__container,
    .ptg-team-page__inner,
    .ptg-profile__inner,
    .ptg-contact__inner,
    .ptg-quick-inquiry__inner,
    .ptg-consult-helper__inner{
      width:min(calc(100% - (var(--ptg-gutter) * 2)),var(--ptg-container))!important;
      max-width:var(--ptg-container)!important;
      margin-left:auto!important;
      margin-right:auto!important;
      padding-left:0!important;
      padding-right:0!important;
    }

    /* remove double horizontal padding from page roots */
    .ptg-profile,
    .ptg-contact,
    .ptg-team-page,
    .ptg-case-list-page,
    .penta-business-page,
    .penta-law-page,
    .penta-tax-page,
    .penta-ip-page,
    .penta-reg-page,
    #ptg-inherit-onestop,
    .ptg-center-modern{
      padding-left:0!important;
      padding-right:0!important;
      margin-left:0!important;
      margin-right:0!important;
      width:100%!important;
      max-width:none!important;
      left:auto!important;
      right:auto!important;
    }

    /* typography */
    main{background:#fff;color:var(--ptg-ink)}
    main h1{font-size:var(--ptg-fs-h1)!important;font-weight:470!important;line-height:1.16!important;letter-spacing:-.045em!important}
    main h2{font-size:var(--ptg-fs-h2)!important;font-weight:510!important;line-height:1.3!important;letter-spacing:-.038em!important}
    main h3{font-size:var(--ptg-fs-h3)!important;font-weight:540!important;line-height:1.35!important;letter-spacing:-.03em!important}
    main p,main li{font-size:var(--ptg-body)!important;line-height:1.7!important;letter-spacing:-.022em!important;font-weight:400!important}
    main :is(.eyebrow,.side-label,[class*='eyebrow'],[class*='-label'],[class*='__label']){font-size:var(--ptg-label)!important;font-weight:600!important;line-height:1.4!important;letter-spacing:.11em!important}
    main :is(.hero,.page-hero,[class$='-hero'],[class*='__hero']) h1{max-width:760px!important;font-size:var(--ptg-fs-display)!important;font-weight:470!important;line-height:1.12!important;letter-spacing:-.047em!important}
    main :is(.hero,.page-hero,[class$='-hero'],[class*='__hero']) p{max-width:690px!important;font-size:var(--ptg-body-lg)!important;line-height:1.75!important}

    /* section rhythm */
    :is(.section,.penta-business-section,.penta-law-section,.penta-tax-section,.penta-ip-section,.penta-reg-section,#ptg-inherit-onestop .ptg-section,.ptg-center-modern__intro,.ptg-center-modern__consult,.ptg-center-modern__service,.ptg-center-modern__process,.ptg-center-modern__difference,.ptg-center-modern__prepare,.ptg-center-modern__faq){padding-top:112px!important;padding-bottom:112px!important}
    :is(.page-hero,.penta-business-hero,.penta-law-hero,.penta-tax-hero,.penta-ip-hero,.penta-reg-hero,#ptg-inherit-onestop .ptg-hero,.ptg-center-modern__hero){padding-top:150px!important;padding-bottom:112px!important}
    :is(.ptg-team-page,.ptg-profile,.ptg-contact,.ptg-case-list-page){padding-top:112px!important;padding-bottom:112px!important}

    /* inheritance/table alignment */
    #ptg-inherit-onestop .ptg-table-wrap{width:100%!important;margin-left:0!important;margin-right:0!important}
    #ptg-inherit-onestop .ptg-price-table{width:100%!important}
    #ptg-inherit-onestop .ptg-price-head{width:100%!important}
    #ptg-inherit-onestop .ptg-related-list,
    #ptg-inherit-onestop .ptg-process,
    #ptg-inherit-onestop .ptg-case-grid,
    #ptg-inherit-onestop .ptg-faq-list{width:100%!important}

    /* restrained surfaces */
    main :is(.info-card,.pro-card,.ptg-case-card,.penta-service-item,.penta-law-service-item,.penta-tax-service-item,.penta-ip-service-item,.penta-reg-service-item,.ptg-detail-card,.ptg-center-modern__row){border-color:rgba(17,17,17,.12)!important;box-shadow:none!important;border-radius:2px!important}
    main :is(button,.btn,[class*='button']){border-radius:0!important;box-shadow:none!important}

    /* top notice */
    .ptg-notice-bar{position:fixed;inset:0 0 auto;z-index:3000;height:var(--ptg-notice-h);background:#111;color:#fff;font-family:inherit;transition:.24s ease}
    .ptg-notice-bar.is-hidden{opacity:0;transform:translateY(-100%);pointer-events:none}
    .ptg-notice-bar__inner{height:100%;display:flex;align-items:center;gap:22px}
    .ptg-notice-bar__label{display:inline-flex;align-items:center;gap:8px;color:#9a9a9a;font-size:11px;font-weight:600;letter-spacing:.11em;white-space:nowrap}.ptg-notice-bar__label:before{content:'';width:6px;height:6px;border-radius:50%;background:var(--ptg-orange)}
    .ptg-notice-bar__number{color:var(--ptg-orange);font-size:11px;font-weight:600}.ptg-notice-bar__copy{display:flex;align-items:baseline;gap:16px;min-width:0;flex:1}.ptg-notice-bar__copy strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;font-weight:600}.ptg-notice-bar__copy span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#777;font-size:10.5px}.ptg-notice-bar__actions{display:flex;align-items:center;gap:16px}.ptg-notice-bar__consult{font-size:11px;font-weight:600}.ptg-notice-bar__consult b{margin-left:8px;color:var(--ptg-orange);font-size:15px;font-weight:400}.ptg-notice-bar__indicator{display:flex;gap:6px;padding:0 14px;border-left:1px solid #2d2d2d;border-right:1px solid #2d2d2d}.ptg-notice-bar__indicator i{display:block;width:28px;height:2px;background:#4b4b4b}.ptg-notice-bar__indicator i:first-child{background:var(--ptg-orange)}.ptg-notice-bar__today{border:0;background:none;color:#858585;font:inherit;font-size:10px;cursor:pointer}.ptg-notice-bar__close{width:28px;height:28px;border:1px solid #4d4d4d;border-radius:50%;background:none;color:#aaa;font:inherit;font-size:17px;cursor:pointer}

    /* header */
    .ptg-site-header{position:sticky;top:var(--ptg-notice-h);z-index:2000;height:var(--ptg-header-h);background:rgba(255,255,255,.98)!important;border-bottom:1px solid rgba(17,17,17,.09)!important;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);transition:top .24s ease}
    .ptg-site-header *{box-sizing:border-box}.ptg-site-header a{text-decoration:none}.ptg-site-header__inner{height:100%;display:flex;align-items:center;justify-content:space-between;gap:44px}.ptg-site-header__logo{display:inline-flex;align-items:center;line-height:0;flex:0 0 auto}.ptg-site-header__logo img{display:block;width:150px!important;height:auto!important;filter:none!important}.ptg-site-header__nav{display:flex;align-items:stretch;justify-content:flex-end;gap:clamp(22px,2.2vw,38px);height:100%;margin-left:auto}.ptg-nav-item{position:relative;display:flex;align-items:center;height:100%}.ptg-nav-link{display:inline-flex;align-items:center;height:100%;color:#171717!important;font-size:14px;font-weight:500;letter-spacing:.055em;white-space:nowrap}.ptg-nav-link:hover,.ptg-nav-link.is-active,.ptg-nav-item:hover>.ptg-nav-link{color:var(--ptg-orange)!important}.ptg-nav-dropdown{position:absolute;left:-20px;top:calc(100% - 1px);width:174px;padding:8px 0;background:#fff;border:1px solid rgba(17,17,17,.09);box-shadow:0 12px 30px rgba(17,17,17,.08);opacity:0;visibility:hidden;transform:translateY(8px);transition:.18s ease}.ptg-nav-item:hover>.ptg-nav-dropdown,.ptg-nav-item:focus-within>.ptg-nav-dropdown{opacity:1;visibility:visible;transform:none}.ptg-nav-dropdown a{display:block;padding:12px 18px;color:#333!important;font-size:13px;font-weight:500}.ptg-nav-dropdown a:hover,.ptg-nav-dropdown a.is-active{background:#fafafa;color:var(--ptg-orange)!important}.ptg-site-header__menu{display:none;border:0;background:none;color:#111;font:inherit;font-size:13px;font-weight:510;letter-spacing:.06em;cursor:pointer}

    /* footer */
    .ptg-site-footer{width:100%!important;background:#fff!important;color:#111!important;border-top:1px solid var(--ptg-line);font-family:inherit}.ptg-site-footer *{box-sizing:border-box;word-break:keep-all}.ptg-site-footer a{text-decoration:none;color:inherit}.ptg-site-footer__top{display:grid;grid-template-columns:minmax(320px,1.35fr) minmax(130px,.55fr) minmax(190px,.8fr) minmax(150px,.6fr) minmax(250px,1fr);gap:48px;padding:96px 0 72px}.ptg-site-footer__brand{min-width:0}.ptg-site-footer__logo{display:inline-flex;width:176px}.ptg-site-footer__logo img{width:100%;filter:none!important}.ptg-site-footer__brand-copy{max-width:330px;margin:28px 0 0;color:#4d4d4d;font-size:16px;line-height:1.7}.ptg-site-footer__inquiry{display:inline-flex;gap:10px;margin-top:28px;color:var(--ptg-orange)!important;font-size:14px;font-weight:510;letter-spacing:.03em}.ptg-site-footer__menu-title{margin:0 0 22px;color:#8a8a8a;font-size:12px;font-weight:600;letter-spacing:.11em}.ptg-site-footer__menu{display:flex;flex-direction:column;align-items:flex-start}.ptg-site-footer__menu a{margin:0 0 13px;color:#333;font-size:15px;line-height:1.55}.ptg-site-footer__menu a:hover{color:var(--ptg-orange)}.ptg-site-footer__contact-main{padding-bottom:20px;border-bottom:1px solid var(--ptg-line)}.ptg-site-footer__contact-main span{display:block;margin-bottom:8px;color:#888;font-size:12px}.ptg-site-footer__contact-main a{font-size:24px;font-weight:510;letter-spacing:-.03em}.ptg-site-footer__contact dl{margin:20px 0 0}.ptg-site-footer__contact dl>div{display:grid;grid-template-columns:66px 1fr;gap:12px;margin-top:11px}.ptg-site-footer__contact dt{color:#8a8a8a;font-size:11px;font-weight:600;letter-spacing:.04em}.ptg-site-footer__contact dd{margin:0;color:#4f4f4f;font-size:13px;line-height:1.6;overflow-wrap:anywhere}.ptg-site-footer__office{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:40px;align-items:center;padding:26px 0;border-top:1px solid var(--ptg-line)}.ptg-site-footer__address{display:flex;align-items:flex-start;gap:18px}.ptg-site-footer__address span{color:#888;font-size:11px;font-weight:600;letter-spacing:.11em}.ptg-site-footer__address p,.ptg-site-footer__legal p,.ptg-site-footer__legal a{margin:0;color:#6f6f6f;font-size:12px;line-height:1.65}.ptg-site-footer__legal{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:10px 18px}

    /* bottom CTA */
    .ptg-bottom-cta{position:fixed;left:0;right:0;bottom:0;z-index:2800;height:var(--ptg-bottom-h);background:var(--ptg-orange);color:#fff;border-top:1px solid rgba(17,17,17,.08)}.ptg-bottom-cta__inner{height:100%;display:flex;align-items:center;justify-content:space-between;gap:36px}.ptg-bottom-cta__lead{display:flex;align-items:center;gap:16px}.ptg-bottom-cta__lead img{width:34px;height:34px;object-fit:cover;object-position:left;filter:brightness(0) invert(1)}.ptg-bottom-cta__lead strong{display:block;margin-bottom:4px;font-size:14px;font-weight:600}.ptg-bottom-cta__lead p{margin:0;color:rgba(255,255,255,.78);font-size:11px}.ptg-bottom-cta__actions{display:flex;align-items:center;gap:28px}.ptg-bottom-cta__phone span{display:block;margin-bottom:3px;color:rgba(255,255,255,.72);font-size:10px}.ptg-bottom-cta__phone strong{font-size:17px;font-weight:600}.ptg-bottom-cta__button{display:inline-flex;align-items:center;justify-content:center;min-width:132px;height:46px;background:#fff;color:var(--ptg-orange)!important;font-size:13px;font-weight:510;letter-spacing:.05em}

    @media(max-width:1180px){
      .ptg-site-footer__top{grid-template-columns:minmax(280px,1.3fr) repeat(2,minmax(150px,.7fr));gap:40px}.ptg-site-footer__menu:nth-of-type(3){display:none}
    }
    @media(max-width:980px){
      :root{--ptg-gutter:20px;--ptg-header-h:84px;--ptg-notice-h:52px;--ptg-bottom-h:70px}
      .ptg-notice-bar__label,.ptg-notice-bar__indicator,.ptg-notice-bar__consult{display:none}.ptg-notice-bar__copy span{display:none}
      .ptg-site-header__logo img{width:144px!important}.ptg-site-header__menu{display:block}.ptg-site-header__nav{position:absolute;top:100%;left:0;right:0;height:auto;display:none;flex-direction:column;align-items:stretch;gap:0;margin:0;padding:12px 20px 22px;background:#fff;border-top:1px solid var(--ptg-line)}.ptg-site-header__nav.open{display:flex}.ptg-nav-item{display:block;height:auto;border-bottom:1px solid var(--ptg-line)}.ptg-nav-link{width:100%;height:auto;padding:14px 0}.ptg-nav-dropdown{position:static;width:100%;padding:0 0 10px 14px;background:transparent;border:0;box-shadow:none;opacity:1;visibility:visible;transform:none;display:none}.ptg-nav-item.open>.ptg-nav-dropdown{display:block}.ptg-nav-dropdown a{padding:10px 0}
      .ptg-site-footer__top{grid-template-columns:1fr 1fr;gap:42px 30px;padding:76px 0 56px}.ptg-site-footer__brand,.ptg-site-footer__contact{grid-column:1/-1}.ptg-site-footer__contact{display:grid;grid-template-columns:1fr 1fr;gap:24px 32px;padding-top:30px;border-top:1px solid var(--ptg-line)}.ptg-site-footer__contact>.ptg-site-footer__menu-title{grid-column:1/-1;margin-bottom:0}.ptg-site-footer__contact dl{margin-top:0}.ptg-site-footer__office{grid-template-columns:1fr;gap:16px}.ptg-site-footer__legal{justify-content:flex-start}
      :is(.section,.penta-business-section,.penta-law-section,.penta-tax-section,.penta-ip-section,.penta-reg-section,#ptg-inherit-onestop .ptg-section,.ptg-center-modern__intro,.ptg-center-modern__consult,.ptg-center-modern__service,.ptg-center-modern__process,.ptg-center-modern__difference,.ptg-center-modern__prepare,.ptg-center-modern__faq){padding-top:88px!important;padding-bottom:88px!important}
      :is(.page-hero,.penta-business-hero,.penta-law-hero,.penta-tax-hero,.penta-ip-hero,.penta-reg-hero,#ptg-inherit-onestop .ptg-hero,.ptg-center-modern__hero){padding-top:120px!important;padding-bottom:88px!important}
      :is(.ptg-team-page,.ptg-profile,.ptg-contact,.ptg-case-list-page){padding-top:88px!important;padding-bottom:88px!important}
    }
    @media(max-width:760px){
      :root{--ptg-gutter:16px;--ptg-header-h:76px;--ptg-notice-h:48px;--ptg-bottom-h:64px;--ptg-body:16px;--ptg-body-lg:17px;--ptg-label:13px;--ptg-fs-display:clamp(32px,9.5vw,40px);--ptg-fs-h1:clamp(30px,9vw,38px);--ptg-fs-h2:clamp(24px,7.5vw,30px);--ptg-fs-h3:clamp(21px,6vw,26px)}
      .ptg-notice-bar__today{display:none}.ptg-notice-bar__copy strong{font-size:10.8px}.ptg-notice-bar__close{width:25px;height:25px;font-size:15px}
      .ptg-bottom-cta__lead img,.ptg-bottom-cta__lead p{display:none}.ptg-bottom-cta__lead strong{font-size:12px;margin:0}.ptg-bottom-cta__phone strong{font-size:13px}.ptg-bottom-cta__actions{gap:9px}.ptg-bottom-cta__button{min-width:88px;height:38px;font-size:11px}
      .ptg-site-footer__top{grid-template-columns:1fr 1fr;gap:32px 22px;padding:64px 0 44px}.ptg-site-footer__brand{grid-column:1/-1;padding-bottom:28px;border-bottom:1px solid var(--ptg-line)}.ptg-site-footer__logo{width:164px}.ptg-site-footer__brand-copy{font-size:15px;margin-top:22px}.ptg-site-footer__menu a{font-size:14px}.ptg-site-footer__contact{grid-column:1/-1;grid-template-columns:1fr;padding-top:28px}.ptg-site-footer__contact>.ptg-site-footer__menu-title{grid-column:auto}.ptg-site-footer__office{padding:22px 0}.ptg-site-footer__address{display:block}.ptg-site-footer__address span{display:block;margin-bottom:7px}.ptg-site-footer__legal{display:grid;grid-template-columns:1fr 1fr;gap:7px 14px}
      :is(.section,.penta-business-section,.penta-law-section,.penta-tax-section,.penta-ip-section,.penta-reg-section,#ptg-inherit-onestop .ptg-section,.ptg-center-modern__intro,.ptg-center-modern__consult,.ptg-center-modern__service,.ptg-center-modern__process,.ptg-center-modern__difference,.ptg-center-modern__prepare,.ptg-center-modern__faq){padding-top:80px!important;padding-bottom:80px!important}
      :is(.page-hero,.penta-business-hero,.penta-law-hero,.penta-tax-hero,.penta-ip-hero,.penta-reg-hero,#ptg-inherit-onestop .ptg-hero,.ptg-center-modern__hero){padding-top:104px!important;padding-bottom:80px!important}
      :is(.ptg-team-page,.ptg-profile,.ptg-contact,.ptg-case-list-page){padding-top:80px!important;padding-bottom:80px!important}
    }
  `;
  document.head.appendChild(style);
  document.body.classList.add('ptg-global-ui');

  const notice=document.createElement('div');
  notice.className='ptg-notice-bar';
  notice.innerHTML=`<div class="ptg-notice-bar__inner"><span class="ptg-notice-bar__label">PTG NOTICE</span><span class="ptg-notice-bar__number">01</span><div class="ptg-notice-bar__copy"><strong>변호사·세무사·변리사 자격을 갖춘 대표가 직접 소통하고 상담합니다.</strong><span>법률·세무·지식재산권 쟁점을 하나의 흐름으로 검토합니다.</span></div><div class="ptg-notice-bar__actions"><a class="ptg-notice-bar__consult" href="${base}/contact/">상담 신청 <b>→</b></a><span class="ptg-notice-bar__indicator" aria-hidden="true"><i></i><i></i></span><button type="button" class="ptg-notice-bar__today">오늘 하루 보지 않기</button><button type="button" class="ptg-notice-bar__close" aria-label="공지 닫기">×</button></div></div>`;
  document.body.prepend(notice);

  const todayKey=()=>new Date().toISOString().slice(0,10);
  const hideNotice=(remember)=>{if(remember){try{localStorage.setItem('ptgNoticeHiddenDate',todayKey())}catch(e){}}notice.classList.add('is-hidden');document.body.classList.add('ptg-notice-hidden')};
  try{if(localStorage.getItem('ptgNoticeHiddenDate')===todayKey())hideNotice(false)}catch(e){}
  notice.querySelector('.ptg-notice-bar__today')?.addEventListener('click',()=>hideNotice(true));
  notice.querySelector('.ptg-notice-bar__close')?.addEventListener('click',()=>hideNotice(false));

  if(header)header.innerHTML=`<header class="ptg-site-header"><div class="ptg-site-header__inner"><a class="ptg-site-header__logo" href="${base}/" aria-label="펜타곤 메인"><img src="${base}/assets/images/logo.svg" alt="Pentagon"></a><nav class="ptg-site-header__nav" id="ptgSiteNav" aria-label="주요 메뉴"><div class="ptg-nav-item" data-dropdown><a class="ptg-nav-link" href="${base}/about/">펜타곤 소개</a><div class="ptg-nav-dropdown"><a href="${base}/about/">인사말·비전</a><a href="${base}/newsroom/">펜타곤 소식</a><a href="${base}/location/">오시는 길</a></div></div><div class="ptg-nav-item" data-dropdown><a class="ptg-nav-link" href="${base}/services/">업무분야</a><div class="ptg-nav-dropdown"><a href="${base}/services/legal/">법률</a><a href="${base}/services/tax/">세무</a><a href="${base}/services/ip/">IP</a><a href="${base}/services/recovery/">추심</a><a href="${base}/services/registry/">등기</a></div></div><div class="ptg-nav-item" data-dropdown><a class="ptg-nav-link" href="${base}/professionals/">구성원 소개</a><div class="ptg-nav-dropdown"><a href="${base}/professionals/chaeyonghyun/">채용현</a><a href="${base}/professionals/kanggeon/">강건</a><a href="${base}/professionals/kimjisoo/">김지수</a><a href="${base}/professionals/jeonseunghwan/">전승환</a></div></div><div class="ptg-nav-item"><a class="ptg-nav-link" href="${base}/cases/">업무사례</a></div><div class="ptg-nav-item"><a class="ptg-nav-link" href="${base}/inheritance/">상속원스탑서비스</a></div><div class="ptg-nav-item"><a class="ptg-nav-link" href="${base}/center/">법인설립지원센터</a></div><div class="ptg-nav-item"><a class="ptg-nav-link" href="${base}/contact/">문의하기</a></div></nav><button class="ptg-site-header__menu" type="button" aria-expanded="false" aria-controls="ptgSiteNav">MENU</button></div></header>`;

  if(footer)footer.innerHTML=`<footer class="ptg-site-footer"><div class="ptg-site-footer__inner"><div class="ptg-site-footer__top"><div class="ptg-site-footer__brand"><a href="${base}/" class="ptg-site-footer__logo"><img src="${base}/assets/images/logo.svg" alt="Pentagon"></a><p class="ptg-site-footer__brand-copy">법률·세무·지식재산권·채권추심·등기를<br>하나의 해결 흐름으로 연결합니다.</p><a href="${base}/contact/" class="ptg-site-footer__inquiry">상담하러가기 <span>→</span></a></div><nav class="ptg-site-footer__menu"><p class="ptg-site-footer__menu-title">ABOUT</p><a href="${base}/about/">펜타곤 소개</a><a href="${base}/professionals/">구성원 소개</a><a href="${base}/newsroom/">뉴스룸</a><a href="${base}/location/">오시는 길</a></nav><nav class="ptg-site-footer__menu"><p class="ptg-site-footer__menu-title">SERVICES</p><a href="${base}/services/legal/">법률 자문 및 소송</a><a href="${base}/services/tax/">세무 기장 및 자문</a><a href="${base}/services/ip/">IP 지식재산권</a><a href="${base}/services/recovery/">채권 추심</a><a href="${base}/services/registry/">등기 업무</a></nav><nav class="ptg-site-footer__menu"><p class="ptg-site-footer__menu-title">QUICK LINKS</p><a href="${base}/cases/">업무사례</a><a href="${base}/inheritance/">상속원스탑서비스</a><a href="${base}/center/">법인설립지원센터</a><a href="${base}/contact/">문의하기</a></nav><div class="ptg-site-footer__contact"><p class="ptg-site-footer__menu-title">CONTACT</p><div class="ptg-site-footer__contact-main"><span>대표 문의</span><a href="tel:0264475597">02-6447-5597</a></div><dl><div><dt>FAX</dt><dd>02-6447-5598 / 02-6447-5599</dd></div><div><dt>MOBILE</dt><dd><a href="tel:01032113132">010-3211-3132</a></dd></div><div><dt>E-MAIL</dt><dd><a href="mailto:yhchae@ptglaw.co.kr">yhchae@ptglaw.co.kr</a></dd></div></dl></div></div><div class="ptg-site-footer__office"><div class="ptg-site-footer__address"><span>OFFICE</span><p>서울 서초구 반포대로30길 32, 3층 (서초동, 트러스트힐)</p></div><div class="ptg-site-footer__legal"><p>광고책임변호사 : 채용현</p><a href="${base}/privacy/">개인정보처리방침</a><a href="mailto:yhchae@ptglaw.co.kr">이메일무단수집거부</a></div></div></div></footer>`;

  const bottom=document.createElement('div');
  bottom.className='ptg-bottom-cta';
  bottom.innerHTML=`<div class="ptg-bottom-cta__inner"><div class="ptg-bottom-cta__lead"><img src="${base}/assets/images/logo.svg" alt=""><div><strong>펜타곤에 문의를 남겨주세요.</strong><p>담당 전문가가 내용을 확인한 뒤 빠르게 상담드립니다.</p></div></div><div class="ptg-bottom-cta__actions"><a class="ptg-bottom-cta__phone" href="tel:0264475599"><span>전화 문의</span><strong>02-6447-5599</strong></a><a class="ptg-bottom-cta__button" href="${base}/contact/">상담 신청하기&nbsp;&nbsp;→</a></div></div>`;
  document.body.appendChild(bottom);

  const path=location.pathname.replace(base,'')||'/';
  document.querySelectorAll('.ptg-nav-link,.ptg-nav-dropdown a').forEach(a=>{const href=a.getAttribute('href')||'';const local=href.replace(base,'');if(local!=='/'&&path.startsWith(local))a.classList.add('is-active')});
  if(path.startsWith('/services/'))document.querySelector('.ptg-nav-link[href$="/services/"]')?.classList.add('is-active');
  if(path.startsWith('/about/')||path.startsWith('/newsroom/')||path.startsWith('/location/'))document.querySelector('.ptg-nav-link[href$="/about/"]')?.classList.add('is-active');
  if(path.startsWith('/professionals/'))document.querySelector('.ptg-nav-link[href$="/professionals/"]')?.classList.add('is-active');

  const menuBtn=document.querySelector('.ptg-site-header__menu');
  const nav=document.querySelector('#ptgSiteNav');
  menuBtn?.addEventListener('click',()=>{const open=nav?.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(Boolean(open)));menuBtn.textContent=open?'CLOSE':'MENU'});
  if(matchMedia('(max-width:980px)').matches){document.querySelectorAll('[data-dropdown]>.ptg-nav-link').forEach(link=>link.addEventListener('click',e=>{const item=link.parentElement;if(!item.classList.contains('open')){e.preventDefault();document.querySelectorAll('[data-dropdown].open').forEach(x=>x!==item&&x.classList.remove('open'));item.classList.add('open')}}))}
})();