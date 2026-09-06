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
      --ptg-ink:#161616;
      --ptg-muted:#6f6f6f;
      --ptg-line:#e5e5e2;
      --ptg-soft:#f7f7f5;
      --ptg-container:1440px;
      --ptg-gutter:24px;
      --ptg-header-h:96px;
      --ptg-notice-h:52px;
      --ptg-bottom-h:78px;
      --ptg-fs-display:clamp(32px,3vw,42px);
      --ptg-fs-h1:clamp(30px,2.8vw,40px);
      --ptg-fs-h2:clamp(24px,2vw,31px);
      --ptg-fs-h3:clamp(20px,1.55vw,25px);
      --ptg-body:16px;
      --ptg-body-lg:17px;
      --ptg-label:12px;
    }

    html{color-scheme:light;background:#fff;scroll-behavior:smooth}
    body.ptg-global-ui{margin:0!important;padding-top:var(--ptg-notice-h)!important;padding-bottom:var(--ptg-bottom-h)!important;background:#fff!important;color:var(--ptg-ink)!important;font-family:'Pretendard',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif!important;font-size:var(--ptg-body)!important;font-weight:400!important;line-height:1.72!important;letter-spacing:-.022em!important;word-break:keep-all!important;-webkit-font-smoothing:antialiased}
    body.ptg-global-ui.ptg-notice-hidden{--ptg-notice-h:0px}

    /* ONE HORIZONTAL GRID FOR THE WHOLE SITE */
    .ptg-notice-bar__inner,.ptg-site-header__inner,.ptg-bottom-cta__inner,.ptg-site-footer__inner,
    .wrap,.shell,.home-shell,.ptg-container,.ptg-v5 .ptg-container,
    .penta-business-inner,.penta-law-inner,.penta-tax-inner,.penta-ip-inner,.penta-reg-inner,
    .ptg-case-list-page__inner,#ptg-inherit-onestop .ptg-inner,.ptg-center-modern__container,
    .ptg-team-page__inner,.ptg-profile__inner,.ptg-contact__inner,.ptg-quick-inquiry__inner,.ptg-consult-helper__inner,
    .ptg-newsroom-clean__inner{
      width:min(calc(100% - (var(--ptg-gutter) * 2)),var(--ptg-container))!important;
      max-width:var(--ptg-container)!important;
      margin-left:auto!important;margin-right:auto!important;
      padding-left:0!important;padding-right:0!important;
    }

    /* REMOVE OLD DOUBLE MARGINS / FULL-VIEWPORT HACKS */
    .ptg-profile,.ptg-contact,.ptg-team-page,.ptg-case-list-page,.penta-business-page,.penta-law-page,.penta-tax-page,.penta-ip-page,.penta-reg-page,#ptg-inherit-onestop,.ptg-center-modern,.ptg-v5,.ptg-newsroom-clean{
      padding-left:0!important;padding-right:0!important;margin-left:0!important;margin-right:0!important;width:100%!important;max-width:none!important;left:auto!important;right:auto!important;
    }
    .ptg-newsroom-clean{margin-inline:0!important}

    /* GLOBAL TYPOGRAPHY — SMALLER, QUIETER */
    main{background:#fff;color:var(--ptg-ink)}
    main h1{font-family:inherit!important;font-size:var(--ptg-fs-h1)!important;font-weight:480!important;line-height:1.18!important;letter-spacing:-.045em!important}
    main h2{font-family:inherit!important;font-size:var(--ptg-fs-h2)!important;font-weight:510!important;line-height:1.32!important;letter-spacing:-.038em!important}
    main h3{font-family:inherit!important;font-size:var(--ptg-fs-h3)!important;font-weight:530!important;line-height:1.38!important;letter-spacing:-.03em!important}
    main p,main li{font-family:inherit;word-break:keep-all}
    main :is(.eyebrow,.side-label,[class*='eyebrow'],[class*='-label'],[class*='__label'],.ptg-kicker){font-size:var(--ptg-label)!important;font-weight:600!important;line-height:1.4!important;letter-spacing:.1em!important}
    main :is(.hero,.page-hero,[class$='-hero'],[class*='__hero']) h1{max-width:720px!important;font-size:var(--ptg-fs-display)!important;font-weight:480!important;line-height:1.16!important;letter-spacing:-.045em!important}
    main :is(.hero,.page-hero,[class$='-hero'],[class*='__hero']) p{max-width:660px;font-size:var(--ptg-body-lg)!important;line-height:1.72!important}

    /* NO BLACK CONTENT SECTIONS */
    main .section-dark,.ptg-promise{background:#fff!important;color:var(--ptg-ink)!important;border-top:1px solid var(--ptg-line)!important;border-bottom:1px solid var(--ptg-line)!important}
    main .section-dark :is(h1,h2,h3,p,a,.eyebrow,.side-label),.ptg-promise :is(h1,h2,h3,p,a,.ptg-kicker){color:inherit!important}
    .ptg-promise-grid{border-color:var(--ptg-line)!important}
    .ptg-promise-item{background:#fff!important;border-color:var(--ptg-line)!important;color:var(--ptg-ink)!important}
    .ptg-field-strip{background:#fafaf8!important;color:#777!important;border-block:1px solid var(--ptg-line)!important}
    .ptg-news-card__visual--broadcast{background:#f4f4f1!important}
    .ptg-news-card__visual--broadcast :is(strong,em,time){color:#111!important}

    /* SECTION RHYTHM */
    :is(.section,.penta-business-section,.penta-law-section,.penta-tax-section,.penta-ip-section,.penta-reg-section,#ptg-inherit-onestop .ptg-section,.ptg-center-modern__intro,.ptg-center-modern__consult,.ptg-center-modern__service,.ptg-center-modern__process,.ptg-center-modern__difference,.ptg-center-modern__prepare,.ptg-center-modern__faq){padding-top:96px!important;padding-bottom:96px!important}
    :is(.page-hero,.penta-business-hero,.penta-law-hero,.penta-tax-hero,.penta-ip-hero,.penta-reg-hero,#ptg-inherit-onestop .ptg-hero,.ptg-center-modern__hero){padding-top:120px!important;padding-bottom:88px!important}
    :is(.ptg-team-page,.ptg-profile,.ptg-contact,.ptg-case-list-page){padding-top:96px!important;padding-bottom:96px!important}

    /* TABLES / WIDE MODULES STAY ON SAME GRID */
    #ptg-inherit-onestop :is(.ptg-table-wrap,.ptg-price-table,.ptg-price-head,.ptg-related-list,.ptg-process,.ptg-case-grid,.ptg-faq-list){width:100%!important;margin-left:0!important;margin-right:0!important}

    /* RESTRAIN DECORATIVE SURFACES */
    main :is(.info-card,.pro-card,.ptg-case-card,.penta-service-item,.penta-law-service-item,.penta-tax-service-item,.penta-ip-service-item,.penta-reg-service-item,.ptg-detail-card,.ptg-center-modern__row){border-color:rgba(17,17,17,.11)!important;box-shadow:none!important;border-radius:2px!important}
    main :is(button,.btn,[class*='button']){border-radius:0!important;box-shadow:none!important}

    /* TOP NOTICE */
    .ptg-notice-bar{position:fixed;inset:0 0 auto;z-index:3000;height:var(--ptg-notice-h);background:#111;color:#fff;font-family:inherit;transition:.22s ease}
    .ptg-notice-bar.is-hidden{opacity:0;transform:translateY(-100%);pointer-events:none}
    .ptg-notice-bar__inner{height:100%;display:flex;align-items:center;gap:20px}
    .ptg-notice-bar__label{display:inline-flex;align-items:center;gap:7px;color:#9a9a9a;font-size:10px;font-weight:600;letter-spacing:.1em;white-space:nowrap}.ptg-notice-bar__label:before{content:'';width:6px;height:6px;border-radius:50%;background:var(--ptg-orange)}
    .ptg-notice-bar__number{color:var(--ptg-orange);font-size:10px;font-weight:600}.ptg-notice-bar__copy{display:flex;align-items:baseline;gap:14px;min-width:0;flex:1}.ptg-notice-bar__copy strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;font-weight:600}.ptg-notice-bar__copy span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#777;font-size:10px}.ptg-notice-bar__actions{display:flex;align-items:center;gap:14px}.ptg-notice-bar__consult{font-size:10px;font-weight:600}.ptg-notice-bar__consult b{margin-left:7px;color:var(--ptg-orange);font-size:14px;font-weight:400}.ptg-notice-bar__indicator{display:flex;gap:5px;padding:0 12px;border-inline:1px solid #2d2d2d}.ptg-notice-bar__indicator i{display:block;width:24px;height:2px;background:#4b4b4b}.ptg-notice-bar__indicator i:first-child{background:var(--ptg-orange)}.ptg-notice-bar__today{border:0;background:none;color:#858585;font:inherit;font-size:9px;cursor:pointer}.ptg-notice-bar__close{width:26px;height:26px;border:1px solid #4d4d4d;border-radius:50%;background:none;color:#aaa;font:inherit;font-size:16px;cursor:pointer}

    /* HEADER */
    .ptg-site-header{position:sticky;top:var(--ptg-notice-h);z-index:2000;height:var(--ptg-header-h);background:rgba(255,255,255,.98)!important;border-bottom:1px solid rgba(17,17,17,.09)!important;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);transition:top .22s ease}
    .ptg-site-header *{box-sizing:border-box}.ptg-site-header a{text-decoration:none}.ptg-site-header__inner{height:100%;display:flex;align-items:center;justify-content:space-between;gap:42px}.ptg-site-header__logo{display:inline-flex;align-items:center;line-height:0;flex:0 0 auto}.ptg-site-header__logo img{display:block;width:146px!important;height:auto!important;filter:none!important}.ptg-site-header__nav{display:flex;align-items:stretch;justify-content:flex-end;gap:clamp(20px,2vw,34px);height:100%;margin-left:auto}.ptg-nav-item{position:relative;display:flex;align-items:center;height:100%}.ptg-nav-link{display:inline-flex;align-items:center;height:100%;color:#171717!important;font-size:13px;font-weight:500;letter-spacing:.035em;white-space:nowrap}.ptg-nav-link:hover,.ptg-nav-link.is-active,.ptg-nav-item:hover>.ptg-nav-link{color:var(--ptg-orange)!important}.ptg-nav-dropdown{position:absolute;left:-18px;top:calc(100% - 1px);width:170px;padding:7px 0;background:#fff;border:1px solid rgba(17,17,17,.09);box-shadow:0 12px 30px rgba(17,17,17,.07);opacity:0;visibility:hidden;transform:translateY(8px);transition:.18s ease}.ptg-nav-item:hover>.ptg-nav-dropdown,.ptg-nav-item:focus-within>.ptg-nav-dropdown{opacity:1;visibility:visible;transform:none}.ptg-nav-dropdown a{display:block;padding:11px 17px;color:#333!important;font-size:12px;font-weight:500}.ptg-nav-dropdown a:hover,.ptg-nav-dropdown a.is-active{background:#fafafa;color:var(--ptg-orange)!important}.ptg-site-header__menu{display:none;border:0;background:none;color:#111;font:inherit;font-size:12px;font-weight:510;letter-spacing:.06em;cursor:pointer}

    /* FOOTER */
    .ptg-site-footer{width:100%!important;background:#fff!important;color:#111!important;border-top:1px solid var(--ptg-line);font-family:inherit}.ptg-site-footer *{box-sizing:border-box;word-break:keep-all}.ptg-site-footer a{text-decoration:none;color:inherit}.ptg-site-footer__top{display:grid;grid-template-columns:minmax(300px,1.35fr) minmax(120px,.55fr) minmax(180px,.8fr) minmax(145px,.6fr) minmax(240px,1fr);gap:44px;padding:82px 0 60px}.ptg-site-footer__logo{display:inline-flex;width:168px}.ptg-site-footer__logo img{width:100%;filter:none!important}.ptg-site-footer__brand-copy{max-width:320px;margin:24px 0 0;color:#555;font-size:14px;line-height:1.7}.ptg-site-footer__inquiry{display:inline-flex;gap:9px;margin-top:24px;color:var(--ptg-orange)!important;font-size:13px;font-weight:510}.ptg-site-footer__menu-title{margin:0 0 20px;color:#8a8a8a;font-size:10px;font-weight:600;letter-spacing:.11em}.ptg-site-footer__menu{display:flex;flex-direction:column;align-items:flex-start}.ptg-site-footer__menu a{margin:0 0 11px;color:#333;font-size:13px;line-height:1.55}.ptg-site-footer__menu a:hover{color:var(--ptg-orange)}.ptg-site-footer__contact-main{padding-bottom:18px;border-bottom:1px solid var(--ptg-line)}.ptg-site-footer__contact-main span{display:block;margin-bottom:7px;color:#888;font-size:10px}.ptg-site-footer__contact-main a{font-size:20px;font-weight:510;letter-spacing:-.03em}.ptg-site-footer__contact dl{margin:18px 0 0}.ptg-site-footer__contact dl>div{display:grid;grid-template-columns:60px 1fr;gap:10px;margin-top:9px}.ptg-site-footer__contact dt{color:#8a8a8a;font-size:10px;font-weight:600}.ptg-site-footer__contact dd{margin:0;color:#555;font-size:12px;line-height:1.6;overflow-wrap:anywhere}.ptg-site-footer__office{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:38px;align-items:center;padding:23px 0;border-top:1px solid var(--ptg-line)}.ptg-site-footer__address{display:flex;align-items:flex-start;gap:16px}.ptg-site-footer__address span{color:#888;font-size:10px;font-weight:600;letter-spacing:.11em}.ptg-site-footer__address p,.ptg-site-footer__legal p,.ptg-site-footer__legal a{margin:0;color:#727272;font-size:11px;line-height:1.65}.ptg-site-footer__legal{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:9px 16px}

    /* BOTTOM CTA */
    .ptg-bottom-cta{position:fixed;left:0;right:0;bottom:0;z-index:2800;height:var(--ptg-bottom-h);background:var(--ptg-orange);color:#fff;border-top:1px solid rgba(17,17,17,.08)}.ptg-bottom-cta__inner{height:100%;display:flex;align-items:center;justify-content:space-between;gap:32px}.ptg-bottom-cta__lead{display:flex;align-items:center;gap:14px}.ptg-bottom-cta__lead img{width:32px;height:32px;object-fit:cover;object-position:left;filter:brightness(0) invert(1)}.ptg-bottom-cta__lead strong{display:block;margin-bottom:3px;font-size:13px;font-weight:600}.ptg-bottom-cta__lead p{margin:0;color:rgba(255,255,255,.78);font-size:10px}.ptg-bottom-cta__actions{display:flex;align-items:center;gap:24px}.ptg-bottom-cta__phone span{display:block;margin-bottom:2px;color:rgba(255,255,255,.72);font-size:9px}.ptg-bottom-cta__phone strong{font-size:15px;font-weight:600}.ptg-bottom-cta__button{display:inline-flex;align-items:center;justify-content:center;min-width:122px;height:42px;background:#fff;color:var(--ptg-orange)!important;font-size:12px;font-weight:510;letter-spacing:.04em}

    @media(max-width:1180px){.ptg-site-footer__top{grid-template-columns:minmax(260px,1.2fr) repeat(2,minmax(150px,.7fr));gap:36px}.ptg-site-footer__menu:nth-of-type(3){display:none}}
    @media(max-width:980px){
      :root{--ptg-gutter:20px;--ptg-header-h:82px;--ptg-notice-h:48px;--ptg-bottom-h:68px}
      .ptg-notice-bar__label,.ptg-notice-bar__indicator,.ptg-notice-bar__consult{display:none}.ptg-notice-bar__copy span{display:none}
      .ptg-site-header__logo img{width:140px!important}.ptg-site-header__menu{display:block}.ptg-site-header__nav{position:absolute;top:100%;left:0;right:0;height:auto;display:none;flex-direction:column;align-items:stretch;gap:0;margin:0;padding:12px 20px 22px;background:#fff;border-top:1px solid var(--ptg-line)}.ptg-site-header__nav.open{display:flex}.ptg-nav-item{display:block;height:auto;border-bottom:1px solid var(--ptg-line)}.ptg-nav-link{width:100%;height:auto;padding:14px 0}.ptg-nav-dropdown{position:static;width:100%;padding:0 0 10px 14px;background:transparent;border:0;box-shadow:none;opacity:1;visibility:visible;transform:none;display:none}.ptg-nav-item.open>.ptg-nav-dropdown{display:block}.ptg-nav-dropdown a{padding:9px 0}
      .ptg-site-footer__top{grid-template-columns:1fr 1fr;gap:38px 28px;padding:68px 0 50px}.ptg-site-footer__brand,.ptg-site-footer__contact{grid-column:1/-1}.ptg-site-footer__contact{display:grid;grid-template-columns:1fr 1fr;gap:22px 30px;padding-top:28px;border-top:1px solid var(--ptg-line)}.ptg-site-footer__contact>.ptg-site-footer__menu-title{grid-column:1/-1;margin-bottom:0}.ptg-site-footer__contact dl{margin-top:0}.ptg-site-footer__office{grid-template-columns:1fr;gap:14px}.ptg-site-footer__legal{justify-content:flex-start}
      :is(.section,.penta-business-section,.penta-law-section,.penta-tax-section,.penta-ip-section,.penta-reg-section,#ptg-inherit-onestop .ptg-section,.ptg-center-modern__intro,.ptg-center-modern__consult,.ptg-center-modern__service,.ptg-center-modern__process,.ptg-center-modern__difference,.ptg-center-modern__prepare,.ptg-center-modern__faq){padding-top:82px!important;padding-bottom:82px!important}
      :is(.page-hero,.penta-business-hero,.penta-law-hero,.penta-tax-hero,.penta-ip-hero,.penta-reg-hero,#ptg-inherit-onestop .ptg-hero,.ptg-center-modern__hero){padding-top:104px!important;padding-bottom:80px!important}
      :is(.ptg-team-page,.ptg-profile,.ptg-contact,.ptg-case-list-page){padding-top:82px!important;padding-bottom:82px!important}
    }
    @media(max-width:760px){
      :root{--ptg-gutter:16px;--ptg-header-h:74px;--ptg-notice-h:46px;--ptg-bottom-h:62px;--ptg-body:16px;--ptg-body-lg:16px;--ptg-label:11px;--ptg-fs-display:clamp(28px,8.5vw,36px);--ptg-fs-h1:clamp(28px,8vw,35px);--ptg-fs-h2:clamp(23px,6.8vw,29px);--ptg-fs-h3:clamp(20px,5.5vw,24px)}
      .ptg-notice-bar__today{display:none}.ptg-notice-bar__copy strong{font-size:10px}.ptg-notice-bar__close{width:24px;height:24px;font-size:14px}
      .ptg-bottom-cta__lead img,.ptg-bottom-cta__lead p{display:none}.ptg-bottom-cta__lead strong{font-size:11px;margin:0}.ptg-bottom-cta__phone strong{font-size:12px}.ptg-bottom-cta__actions{gap:8px}.ptg-bottom-cta__button{min-width:84px;height:36px;font-size:10px}
      .ptg-site-footer__top{grid-template-columns:1fr 1fr;gap:28px 20px;padding:58px 0 40px}.ptg-site-footer__brand{grid-column:1/-1;padding-bottom:24px;border-bottom:1px solid var(--ptg-line)}.ptg-site-footer__logo{width:154px}.ptg-site-footer__brand-copy{font-size:13px;margin-top:20px}.ptg-site-footer__menu a{font-size:12px}.ptg-site-footer__contact{grid-column:1/-1;grid-template-columns:1fr;padding-top:24px}.ptg-site-footer__contact>.ptg-site-footer__menu-title{grid-column:auto}.ptg-site-footer__office{padding:20px 0}.ptg-site-footer__address{display:block}.ptg-site-footer__address span{display:block;margin-bottom:6px}.ptg-site-footer__legal{display:grid;grid-template-columns:1fr 1fr;gap:6px 12px}
      :is(.section,.penta-business-section,.penta-law-section,.penta-tax-section,.penta-ip-section,.penta-reg-section,#ptg-inherit-onestop .ptg-section,.ptg-center-modern__intro,.ptg-center-modern__consult,.ptg-center-modern__service,.ptg-center-modern__process,.ptg-center-modern__difference,.ptg-center-modern__prepare,.ptg-center-modern__faq){padding-top:72px!important;padding-bottom:72px!important}
      :is(.page-hero,.penta-business-hero,.penta-law-hero,.penta-tax-hero,.penta-ip-hero,.penta-reg-hero,#ptg-inherit-onestop .ptg-hero,.ptg-center-modern__hero){padding-top:88px!important;padding-bottom:68px!important}
      :is(.ptg-team-page,.ptg-profile,.ptg-contact,.ptg-case-list-page){padding-top:72px!important;padding-bottom:72px!important}
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