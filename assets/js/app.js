(()=>{
  const isProject=location.hostname.endsWith('github.io');
  const base=isProject?'/ptglaw':'';
  const header=document.querySelector('[data-site-header]');
  const footer=document.querySelector('[data-site-footer]');

  const style=document.createElement('style');
  style.textContent=`
    .brand-logo{display:inline-flex;align-items:center;flex:0 0 auto;line-height:0}
    .brand-logo img{display:block;width:138px;height:36px;object-fit:contain}
    .footer-logo{display:inline-block;line-height:0;margin-bottom:22px}
    .footer-logo img{display:block;width:166px;height:auto;object-fit:contain;filter:brightness(0) invert(1)}
    @media(max-width:980px){.brand-logo img{width:124px;height:auto}.footer-logo img{width:150px}}
    @media(max-width:640px){.brand-logo img{width:116px}.footer-logo img{width:142px}}
  `;
  document.head.appendChild(style);

  if(header)header.innerHTML=`<header class="site-header"><div class="wrap header-inner"><a class="brand-logo" href="${base}/" aria-label="펜타곤 법률세무회계 홈"><img src="${base}/assets/images/logo.svg" alt="펜타곤 법률세무회계"></a><nav class="nav" id="siteNav"><a href="${base}/about/">펜타곤</a><a href="${base}/professionals/">구성원</a><a href="${base}/services/">업무분야</a><a href="${base}/cases/">업무사례</a><a href="${base}/newsroom/">뉴스룸</a><a href="${base}/contact/">문의하기</a></nav><button class="menu-btn" aria-label="메뉴 열기" aria-expanded="false">MENU</button></div></header>`;

  if(footer)footer.innerHTML=`<footer class="site-footer"><div class="wrap footer-grid"><div><a class="footer-logo" href="${base}/" aria-label="펜타곤 법률세무회계 홈"><img src="${base}/assets/images/logo.svg" alt="펜타곤 법률세무회계"></a><p>법률·세무·지식재산권·채권추심·등기를<br>하나의 해결 흐름으로 연결합니다.</p></div><div><h4>ABOUT</h4><a href="${base}/about/">펜타곤 소개</a><br><a href="${base}/professionals/">구성원 소개</a><br><a href="${base}/newsroom/">뉴스룸</a><br><a href="${base}/contact/">상담 문의</a></div><div><h4>CONTACT</h4><p>대표 문의 02-6447-5597<br>FAX 02-6447-5598 / 02-6447-5599<br>MOBILE 010-3211-3132<br>E-MAIL yhchae@ptglaw.co.kr<br><br>서울 서초구 반포대로30길 32, 3층<br>(서초동, 트러스트힐)<br><br>광고책임변호사 : 채용현</p></div></div><div class="wrap footer-bottom"><span>© PENTAGON LAW TAX ACCOUNTING.</span><span><a href="${base}/privacy/">개인정보처리방침</a></span></div></footer>`;

  const btn=document.querySelector('.menu-btn');
  const nav=document.querySelector('#siteNav');
  btn?.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');
    btn.setAttribute('aria-expanded',String(open));
    btn.textContent=open?'CLOSE':'MENU';
  });
})();