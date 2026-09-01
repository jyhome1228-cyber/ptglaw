(()=>{
  const isProject=location.hostname.endsWith('github.io');
  const base=isProject?'/ptglaw':'';
  const header=document.querySelector('[data-site-header]');
  const footer=document.querySelector('[data-site-footer]');

  const style=document.createElement('style');
  style.textContent=`
    .brand-logo{display:inline-flex;align-items:center;flex:0 0 auto;line-height:0}
    .brand-logo img{display:block;width:138px;height:36px;object-fit:contain}
    .footer-logo{display:inline-block;line-height:0;margin-bottom:28px}
    .footer-logo img{display:block;width:166px;height:auto;object-fit:contain;filter:brightness(0) invert(1)}
    .footer-intro{padding-bottom:64px;border-bottom:1px solid rgba(255,255,255,.12)}
    .footer-intro-row{display:flex;align-items:flex-end;justify-content:space-between;gap:40px}
    .footer-intro-copy{margin:0;color:#fff;font-size:clamp(24px,2.2vw,32px);font-weight:470;line-height:1.35;letter-spacing:-.035em}
    .footer-intro-link{flex:0 0 auto;font-size:13px;font-weight:510;letter-spacing:.06em;color:#fff;border-bottom:1px solid rgba(255,255,255,.5);padding-bottom:5px}
    .footer-columns{display:grid;grid-template-columns:1.05fr 1.15fr 1.2fr 1.6fr;gap:clamp(40px,5vw,84px);padding:64px 0}
    .footer-columns h4{margin:0 0 22px;color:#777;font-size:12px;font-weight:600;line-height:1.4;letter-spacing:.11em}
    .footer-columns a,.footer-columns p{margin:0;color:#aaa;font-size:14px;font-weight:400;line-height:1.9;letter-spacing:-.018em}
    .footer-columns a{display:inline-block;margin-bottom:5px}
    .footer-columns a:hover{color:#fff}
    .footer-contact-cta{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:40px;align-items:end;padding:52px 0;border-top:1px solid rgba(255,255,255,.12);border-bottom:1px solid rgba(255,255,255,.12)}
    .footer-contact-cta strong{display:block;margin-bottom:8px;color:#fff;font-size:clamp(22px,2vw,30px);font-weight:470;line-height:1.35;letter-spacing:-.035em}
    .footer-contact-cta p{margin:0;color:#888;font-size:16px;line-height:1.7}
    .footer-contact-actions{display:flex;gap:24px;align-items:center;white-space:nowrap}
    .footer-contact-actions a{color:#fff;font-size:13px;font-weight:510;letter-spacing:.035em}
    .footer-contact-actions a:last-child{padding-bottom:5px;border-bottom:1px solid rgba(255,255,255,.5)}
    @media(max-width:1100px){.footer-columns{grid-template-columns:1fr 1fr}.footer-contact-cta{grid-template-columns:1fr;align-items:start}.footer-contact-actions{justify-content:flex-start}}
    @media(max-width:980px){.brand-logo img{width:124px;height:auto}.footer-logo img{width:150px}.footer-intro-row{align-items:flex-start;flex-direction:column}.footer-intro{padding-bottom:48px}.footer-columns{padding:52px 0}}
    @media(max-width:640px){.brand-logo img{width:116px}.footer-logo img{width:142px}.footer-columns{grid-template-columns:1fr;gap:38px}.footer-intro-copy{font-size:24px}.footer-contact-actions{flex-direction:column;align-items:flex-start;gap:12px}.footer-contact-cta{padding:42px 0}}
  `;
  document.head.appendChild(style);

  if(header)header.innerHTML=`<header class="site-header"><div class="wrap header-inner"><a class="brand-logo" href="${base}/" aria-label="펜타곤 법률세무회계 홈"><img src="${base}/assets/images/logo.svg" alt="펜타곤 법률세무회계"></a><nav class="nav" id="siteNav"><a href="${base}/about/">펜타곤</a><a href="${base}/professionals/">구성원</a><a href="${base}/services/">업무분야</a><a href="${base}/cases/">업무사례</a><a href="${base}/newsroom/">뉴스룸</a><a href="${base}/contact/">문의하기</a></nav><button class="menu-btn" aria-label="메뉴 열기" aria-expanded="false">MENU</button></div></header>`;

  if(footer)footer.innerHTML=`<footer class="site-footer">
    <div class="wrap footer-intro">
      <a class="footer-logo" href="${base}/" aria-label="펜타곤 법률세무회계 홈"><img src="${base}/assets/images/logo.svg" alt="펜타곤 법률세무회계"></a>
      <div class="footer-intro-row">
        <p class="footer-intro-copy">법률·세무·지식재산권·채권추심·등기를<br>하나의 해결 흐름으로 연결합니다.</p>
        <a class="footer-intro-link" href="${base}/contact/">상담하러가기 →</a>
      </div>
    </div>

    <div class="wrap footer-columns">
      <div>
        <h4>ABOUT</h4>
        <a href="${base}/about/">펜타곤 소개</a><br>
        <a href="${base}/professionals/">구성원 소개</a><br>
        <a href="${base}/newsroom/">뉴스룸</a><br>
        <a href="${base}/contact/#office">오시는 길</a>
      </div>
      <div>
        <h4>SERVICES</h4>
        <a href="${base}/services/legal/">법률 자문 및 소송</a><br>
        <a href="${base}/services/tax/">세무 기장 및 자문</a><br>
        <a href="${base}/services/ip/">IP 지식재산권</a><br>
        <a href="${base}/services/recovery/">채권 추심</a><br>
        <a href="${base}/services/registry/">등기 업무</a>
      </div>
      <div>
        <h4>CONTACT</h4>
        <p>대표 문의 02-6447-5597<br><br>FAX<br>02-6447-5598 / 02-6447-5599<br><br>MOBILE<br>010-3211-3132<br><br>E-MAIL<br>yhchae@ptglaw.co.kr</p>
      </div>
      <div id="office">
        <h4>OFFICE</h4>
        <p>서울 서초구 반포대로30길 32, 3층<br>(서초동, 트러스트힐)<br><br>광고책임변호사 : 채용현</p>
      </div>
    </div>

    <div class="wrap footer-contact-cta">
      <div>
        <strong>펜타곤에 문의를 남겨주세요.</strong>
        <p>담당 전문가가 내용을 확인한 뒤 빠르게 상담드립니다.</p>
      </div>
      <div class="footer-contact-actions">
        <a href="tel:0264475599">전화 문의 02-6447-5599</a>
        <a href="${base}/contact/">상담 신청하기 →</a>
      </div>
    </div>

    <div class="wrap footer-bottom"><span>© PENTAGON LAW TAX ACCOUNTING.</span><span><a href="${base}/privacy/">개인정보처리방침</a></span></div>
  </footer>`;

  const btn=document.querySelector('.menu-btn');
  const nav=document.querySelector('#siteNav');
  btn?.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');
    btn.setAttribute('aria-expanded',String(open));
    btn.textContent=open?'CLOSE':'MENU';
  });
})();