(()=>{
  const isProject=location.hostname.endsWith('github.io');
  const base=isProject?'/ptglaw':'';
  const header=document.querySelector('[data-site-header]');
  const footer=document.querySelector('[data-site-footer]');

  const style=document.createElement('style');
  style.textContent=`
    .ptg-site-header{--ptg-orange:#f58220;position:sticky;top:0;z-index:1000;width:100%;background:rgba(25,53,78,.94);border-bottom:1px solid rgba(255,255,255,.18);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);font-family:"Pretendard","Noto Sans KR","Apple SD Gothic Neo",Arial,sans-serif}
    .ptg-site-header *{box-sizing:border-box}
    .ptg-site-header__inner{width:calc(100% - 40px);max-width:1370px;height:92px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:32px}
    .ptg-site-header__logo{display:inline-flex;align-items:center;flex:0 0 auto;line-height:0}
    .ptg-site-header__logo img{display:block;width:176px;height:auto;filter:brightness(0) invert(1)}
    .ptg-site-header__nav{display:flex;align-items:center;justify-content:flex-end;gap:clamp(22px,2.2vw,38px);margin-left:auto}
    .ptg-site-header__nav a{position:relative;color:#fff;font-size:14px;font-weight:500;line-height:1.4;letter-spacing:-.02em;white-space:nowrap;opacity:.95;transition:opacity .2s ease,color .2s ease}
    .ptg-site-header__nav a:hover{color:#fff;opacity:.58}
    .ptg-site-header__nav a::after{content:"";position:absolute;left:0;bottom:-10px;width:0;height:1px;background:#fff;transition:width .2s ease}
    .ptg-site-header__nav a:hover::after{width:100%}
    .ptg-site-header__menu{display:none;border:0;background:transparent;color:#fff;padding:10px 0;font-size:12px;font-weight:700;letter-spacing:.08em;cursor:pointer}

    .ptg-site-footer{--ptg-orange:#f58220;--ptg-yellow:#ffb500;--ptg-black:#111;--ptg-text:#4b4b4b;--ptg-muted:#888;--ptg-line:rgba(17,17,17,.13);--ptg-max:1370px;position:relative;width:100%!important;max-width:100%!important;margin:0!important;padding:0!important;background:#fff;color:var(--ptg-black);border-top:1px solid var(--ptg-line);font-family:"Pretendard","Noto Sans KR","Apple SD Gothic Neo",Arial,sans-serif;box-sizing:border-box}
    .ptg-site-footer *,.ptg-site-footer *::before,.ptg-site-footer *::after{box-sizing:border-box;word-break:keep-all}
    .ptg-site-footer a{color:inherit;text-decoration:none}
    .ptg-site-footer__inner{width:calc(100% - 40px);max-width:var(--ptg-max);margin:0 auto}
    .ptg-site-footer__top{display:grid;grid-template-columns:minmax(240px,1.08fr) repeat(3,minmax(130px,.62fr)) minmax(220px,.9fr);gap:30px;padding:68px 0 58px}
    .ptg-site-footer__brand{min-width:0}
    .ptg-site-footer__logo{display:inline-flex;align-items:center;width:238px;max-width:100%;line-height:0}
    .ptg-site-footer__logo img{display:block;width:100%;height:auto}
    .ptg-site-footer__brand-copy{margin:27px 0 0;color:var(--ptg-text);font-size:14px;line-height:1.8;letter-spacing:-.03em}
    .ptg-site-footer__inquiry{display:inline-flex;align-items:center;gap:12px;margin-top:24px;color:var(--ptg-orange)!important;font-size:13px;line-height:1.5;font-weight:700}
    .ptg-site-footer__inquiry span{font-size:16px;transition:transform .2s ease}
    .ptg-site-footer__inquiry:hover span{transform:translateX(4px)}
    .ptg-site-footer__menu,.ptg-site-footer__contact{min-width:0;padding-top:5px}
    .ptg-site-footer__menu-title{margin:0 0 22px;color:var(--ptg-orange);font-size:10.5px;line-height:1;font-weight:700;letter-spacing:.08em}
    .ptg-site-footer__menu{display:flex;flex-direction:column;align-items:flex-start}
    .ptg-site-footer__menu a{position:relative;display:inline-flex;margin:0 0 13px;color:#444;font-size:13px;line-height:1.45;font-weight:500;letter-spacing:-.025em;transition:color .2s ease}
    .ptg-site-footer__menu a::after{content:"";position:absolute;left:0;bottom:-3px;width:0;height:1px;background:var(--ptg-orange);transition:width .22s ease}
    .ptg-site-footer__menu a:hover{color:var(--ptg-orange)}
    .ptg-site-footer__menu a:hover::after{width:100%}
    .ptg-site-footer__contact-main{padding-bottom:17px;border-bottom:1px solid var(--ptg-line)}
    .ptg-site-footer__contact-main span{display:block;margin-bottom:6px;color:var(--ptg-muted);font-size:11px;line-height:1.3}
    .ptg-site-footer__contact-main a{color:#111;font-size:22px;line-height:1.2;font-weight:700;letter-spacing:-.04em}
    .ptg-site-footer__contact dl{margin:18px 0 0}
    .ptg-site-footer__contact dl>div{display:grid;grid-template-columns:58px minmax(0,1fr);gap:10px;margin-top:10px}
    .ptg-site-footer__contact dt{color:var(--ptg-muted);font-size:9.5px;line-height:1.6;font-weight:700;letter-spacing:.04em}
    .ptg-site-footer__contact dd{min-width:0;margin:0;color:#555;font-size:12px;line-height:1.6;letter-spacing:-.02em;overflow-wrap:anywhere}
    .ptg-site-footer__office{display:grid;grid-template-columns:1fr auto;gap:40px;align-items:center;min-width:0;padding:22px 0;border-top:1px solid var(--ptg-line)}
    .ptg-site-footer__address{display:flex;align-items:center;gap:18px;min-width:0}
    .ptg-site-footer__address span{flex:0 0 auto;color:var(--ptg-orange);font-size:9.5px;line-height:1;font-weight:700;letter-spacing:.08em}
    .ptg-site-footer__address p{margin:0;color:#555;font-size:12px;line-height:1.65;letter-spacing:-.025em;overflow-wrap:anywhere}
    .ptg-site-footer__legal{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:9px 18px;min-width:0}
    .ptg-site-footer__legal p,.ptg-site-footer__legal a{margin:0;color:#777;font-size:11px;line-height:1.6;letter-spacing:-.02em}
    .ptg-site-footer__legal a{overflow-wrap:anywhere}
    .ptg-site-footer__legal a:hover{color:var(--ptg-orange)}

    @media(max-width:1180px){
      .ptg-site-header__inner{width:calc(100% - 32px)}
      .ptg-site-header__nav{gap:20px}.ptg-site-header__nav a{font-size:13px}
      .ptg-site-footer__inner{width:calc(100% - 32px)}
      .ptg-site-footer__top{grid-template-columns:minmax(280px,1.2fr) repeat(2,minmax(160px,.7fr)) minmax(250px,.9fr)}
      .ptg-site-footer__menu:nth-of-type(3){display:none}
    }
    @media(max-width:980px){
      .ptg-site-header__inner{height:78px}
      .ptg-site-header__logo img{width:154px}
      .ptg-site-header__menu{display:block}
      .ptg-site-header__nav{position:absolute;top:78px;left:0;right:0;display:none;flex-direction:column;align-items:flex-start;gap:0;margin:0;padding:20px 24px 24px;background:rgba(25,53,78,.98);border-top:1px solid rgba(255,255,255,.12)}
      .ptg-site-header__nav.open{display:flex}
      .ptg-site-header__nav a{width:100%;padding:13px 0;font-size:14px;border-bottom:1px solid rgba(255,255,255,.1)}
      .ptg-site-header__nav a::after{display:none}
    }
    @media(max-width:860px){
      .ptg-site-footer__top{grid-template-columns:1fr 1fr;gap:42px 30px;padding:54px 0 46px}
      .ptg-site-footer__brand{grid-column:1/-1;padding-bottom:32px;border-bottom:1px solid var(--ptg-line)}
      .ptg-site-footer__contact{grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;gap:22px 30px;padding-top:28px;border-top:1px solid var(--ptg-line)}
      .ptg-site-footer__contact .ptg-site-footer__menu-title{grid-column:1/-1;margin-bottom:0}
      .ptg-site-footer__contact dl{margin-top:0}
      .ptg-site-footer__office{grid-template-columns:1fr;gap:16px}
      .ptg-site-footer__legal{justify-content:flex-start}
    }
    @media(max-width:560px){
      .ptg-site-header__inner{width:calc(100% - 32px);height:72px}
      .ptg-site-header__logo img{width:142px}
      .ptg-site-header__nav{top:72px}
      .ptg-site-footer__inner{width:calc(100% - 32px)}
      .ptg-site-footer__top{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:30px 22px!important;padding:40px 0 34px!important}
      .ptg-site-footer__brand{grid-column:1/-1!important;padding-bottom:28px!important;border-bottom:1px solid var(--ptg-line)!important}
      .ptg-site-footer__logo{width:205px!important}
      .ptg-site-footer__brand-copy{max-width:330px;margin-top:20px!important;font-size:13px!important;line-height:1.72!important}
      .ptg-site-footer__inquiry{margin-top:18px!important;font-size:13px!important}
      .ptg-site-footer__menu,.ptg-site-footer__contact{grid-column:auto!important;display:flex!important;flex-direction:column!important;min-width:0!important;padding:0 0 22px!important;border-top:0!important;border-bottom:1px solid var(--ptg-line)!important}
      .ptg-site-footer__menu:nth-of-type(3){display:flex!important}
      .ptg-site-footer__menu-title,.ptg-site-footer__contact .ptg-site-footer__menu-title{grid-column:auto!important;margin:0 0 16px!important;font-size:10px!important}
      .ptg-site-footer__menu a{margin-bottom:10px!important;font-size:12.5px!important;line-height:1.48!important}
      .ptg-site-footer__contact-main{width:100%;padding-bottom:13px!important}
      .ptg-site-footer__contact-main span{margin-bottom:5px!important;font-size:10px!important}
      .ptg-site-footer__contact-main a{font-size:18px!important;white-space:nowrap!important}
      .ptg-site-footer__contact dl{width:100%;margin:13px 0 0!important}
      .ptg-site-footer__contact dl>div{display:block!important;margin-top:9px!important}
      .ptg-site-footer__contact dt{margin-bottom:2px!important;font-size:8.5px!important}
      .ptg-site-footer__contact dd{font-size:10.5px!important;line-height:1.52!important;overflow-wrap:anywhere!important}
      .ptg-site-footer__office{display:grid!important;grid-template-columns:1fr!important;gap:14px!important;padding:18px 0!important}
      .ptg-site-footer__address{display:block!important}
      .ptg-site-footer__address span{display:block!important;margin-bottom:7px!important}
      .ptg-site-footer__address p{font-size:11px!important;line-height:1.6!important}
      .ptg-site-footer__legal{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;justify-content:initial!important;gap:7px 14px!important}
      .ptg-site-footer__legal p,.ptg-site-footer__legal a{font-size:10px!important;line-height:1.5!important}
    }
    @media(max-width:390px){
      .ptg-site-footer__top{gap:26px 16px!important}
      .ptg-site-footer__menu a{font-size:12px!important}
      .ptg-site-footer__contact-main a{font-size:17px!important}
      .ptg-site-footer__contact dd{font-size:10px!important}
    }
  `;
  document.head.appendChild(style);

  if(header)header.innerHTML=`
    <header class="ptg-site-header">
      <div class="ptg-site-header__inner">
        <a class="ptg-site-header__logo" href="${base}/" aria-label="펜타곤 메인으로 이동">
          <img src="${base}/assets/images/logo.svg" alt="Pentagon">
        </a>
        <nav class="ptg-site-header__nav" id="ptgSiteNav" aria-label="주요 메뉴">
          <a href="${base}/about/">펜타곤 소개</a>
          <a href="${base}/services/">업무분야</a>
          <a href="${base}/professionals/">구성원 소개</a>
          <a href="${base}/cases/">업무사례</a>
          <a href="${base}/inheritance/">상속원스탑서비스</a>
          <a href="${base}/center/">법인설립지원센터</a>
          <a href="${base}/contact/">문의하기</a>
        </nav>
        <button class="ptg-site-header__menu" type="button" aria-label="메뉴 열기" aria-expanded="false" aria-controls="ptgSiteNav">MENU</button>
      </div>
    </header>`;

  if(footer)footer.innerHTML=`
    <footer class="ptg-site-footer">
      <div class="ptg-site-footer__inner">
        <div class="ptg-site-footer__top">
          <div class="ptg-site-footer__brand">
            <a href="${base}/" class="ptg-site-footer__logo" aria-label="펜타곤 메인으로 이동">
              <img src="${base}/assets/images/logo.svg" alt="Pentagon">
            </a>
            <p class="ptg-site-footer__brand-copy">법률·세무·지식재산권·채권추심·등기를<br>하나의 해결 흐름으로 연결합니다.</p>
            <a href="${base}/contact/" class="ptg-site-footer__inquiry">상담하러가기 <span aria-hidden="true">→</span></a>
          </div>

          <nav class="ptg-site-footer__menu" aria-label="펜타곤 소개 메뉴">
            <p class="ptg-site-footer__menu-title">ABOUT</p>
            <a href="${base}/about/">펜타곤 소개</a>
            <a href="${base}/professionals/">구성원 소개</a>
            <a href="${base}/newsroom/">뉴스룸</a>
            <a href="${base}/contact/#office">오시는 길</a>
          </nav>

          <nav class="ptg-site-footer__menu" aria-label="업무분야 메뉴">
            <p class="ptg-site-footer__menu-title">SERVICES</p>
            <a href="${base}/services/legal/">법률 자문 및 소송</a>
            <a href="${base}/services/tax/">세무 기장 및 자문</a>
            <a href="${base}/services/ip/">IP 지식재산권</a>
            <a href="${base}/services/recovery/">채권 추심</a>
            <a href="${base}/services/registry/">등기 업무</a>
          </nav>

          <nav class="ptg-site-footer__menu" aria-label="바로가기 메뉴">
            <p class="ptg-site-footer__menu-title">QUICK LINKS</p>
            <a href="${base}/cases/">업무사례</a>
            <a href="${base}/review/">상담후기</a>
            <a href="${base}/center/">법인설립지원센터</a>
            <a href="${base}/contact/">문의하기</a>
          </nav>

          <div class="ptg-site-footer__contact">
            <p class="ptg-site-footer__menu-title">CONTACT</p>
            <div class="ptg-site-footer__contact-main">
              <span>대표 문의</span>
              <a href="tel:0264475597">02-6447-5597</a>
            </div>
            <dl>
              <div><dt>FAX</dt><dd>02-6447-5598 / 02-6447-5599</dd></div>
              <div><dt>MOBILE</dt><dd><a href="tel:01032113132">010-3211-3132</a></dd></div>
              <div><dt>E-MAIL</dt><dd><a href="mailto:yhchae@ptglaw.co.kr">yhchae@ptglaw.co.kr</a></dd></div>
            </dl>
          </div>
        </div>

        <div class="ptg-site-footer__office" id="office">
          <div class="ptg-site-footer__address">
            <span>OFFICE</span>
            <p>서울 서초구 반포대로30길 32, 3층 (서초동, 트러스트힐)</p>
          </div>
          <div class="ptg-site-footer__legal">
            <p>광고책임변호사 : 채용현</p>
            <a href="${base}/privacy/">개인정보처리방침</a>
            <a href="mailto:yhchae@ptglaw.co.kr">이메일무단수집거부</a>
          </div>
        </div>
      </div>
    </footer>`;

  const btn=document.querySelector('.ptg-site-header__menu');
  const nav=document.querySelector('#ptgSiteNav');
  btn?.addEventListener('click',()=>{
    const open=nav?.classList.toggle('open');
    btn.setAttribute('aria-expanded',String(Boolean(open)));
    btn.textContent=open?'CLOSE':'MENU';
  });
})();