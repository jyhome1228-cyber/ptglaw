(async()=>{
  const root=document.querySelector('.ptg-newsroom-page');
  if(!root)return;
  const base=location.hostname.endsWith('github.io')?'/ptglaw':'';
  const BUILTIN=[
    ['2026.08.24','법조신문','[채용현 기고] AI 폭풍우 속에서 춤추는 변호사','https://news.koreanbar.or.kr/news/articleView.html?idxno=36046','https://news.koreanbar.or.kr/news/articleView.html?idxno=36046','column'],
    ['2026.08.14','머니투데이','펜타곤 법률세무회계, 서울국세청 출신 전승환 변호사 영입','https://www.mt.co.kr/society/2026/08/14/2026081416423853952','https://www.mt.co.kr/society/2026/08/14/2026081416423853952','firm'],
    ['2026.07.10','법률신문','독일의 변호사 직역 확대 및 법률서비스 시장의 외연 확장을 위한 제도적 대응방안 및 지정토론','https://www.lawtimes.co.kr/news/articleView.html?idxno=223283','https://www.lawtimes.co.kr/news/articleView.html?idxno=223283','activity'],
    ['2026.07.09','로리더','제15회 여성변호사대회 관련 – 채용현 한국법조인협회장 참석','https://www.lawleader.co.kr/news/articleView.html?idxno=19472','https://www.lawleader.co.kr/news/articleView.html?idxno=19472','activity'],
    ['2026.06.08','법조신문','[채용현 기고] 법률서비스의 적정 가격은 국가가 아니라 시장이 정한다','https://news.koreanbar.or.kr/news/articleView.html?idxno=35712','https://news.koreanbar.or.kr/news/articleView.html?idxno=35712','column'],
    ['2026.05.26','법률신문','한국법조인협회, 서울변회와 ‘2026 신입변호사 멘토링 프로그램’ 개최','../news14/','https://www.lawtimes.co.kr/news/articleView.html?idxno=221164','activity'],
    ['2026.05.10','머니투데이','변호사·세무사 따로 찾던 상속 절차, 펜타곤이 한 번에 맡는다','https://www.mt.co.kr/society/2026/05/10/2026051011091578971','https://www.mt.co.kr/society/2026/05/10/2026051011091578971','firm'],
    ['2026.05.07','한국경제','펜타곤 법률세무회계 ‘상속 원스톱 서비스’ 출범','../news13/','https://www.hankyung.com/article/202605072230i','firm'],
    ['2026.05.02','머니투데이','연휴 반려동물 호텔 사고, 배상받을 수 있을까…채용현 펜타곤 대표변호사 법률 자문','https://www.mt.co.kr/society/2026/05/02/2026042914361946364','https://www.mt.co.kr/society/2026/05/02/2026042914361946364','firm'],
    ['2026.04.21','머니투데이','‘변호사 감축’ 채용현 “로스쿨 입학 정원 줄이고 4년제로 늘리자”','../news11/','https://www.mt.co.kr/society/2026/04/21/2026042013340415758','interview'],
    ['2026.04.07','로리더','한법협 채용현 변호사 “로스쿨 정원 1500명으로 낮추고 4년제 도입”','../news10/','https://www.lawleader.co.kr/news/articleView.html?idxno=18892','interview'],
    ['2026.04.06','법조신문','채용현 “AI 시대에 막무가내식 변호사 증원… 법치주의 위협”','../news12/','https://news.koreanbar.or.kr/news/articleView.html?idxno=35405','activity'],
    ['2026.03.23','조선비즈','변호사 ‘형사 성공 보수’ 인정한 2심…대법 판례 바뀌나','https://cbiz.chosun.com/svc/bulletin/bulletin_art.html?contid=2026032302789','https://cbiz.chosun.com/svc/bulletin/bulletin_art.html?contid=2026032302789','activity'],
    ['2026.03.23','법조신문','로스쿨에서만 거꾸로 가는 사법개혁, 사법시험 부활이 웬말','../news9/','https://news.koreanbar.or.kr/news/articleView.html?idxno=35316','column'],
    ['2026.03.12','머니투데이','한국법조인협회 “사시 부활은 시대착오적 퇴행”','https://www.mt.co.kr/society/2026/03/12/2026031217213228840','https://www.mt.co.kr/society/2026/03/12/2026031217213228840','activity'],
    ['2026.02.06','법률신문','서울시립대 법조동문회 제3회 정기총회…채용현 부회장 감사패','https://www.lawtimes.co.kr/news/articleView.html?idxno=215899','https://www.lawtimes.co.kr/news/articleView.html?idxno=215899','activity'],
    ['2026.02.05','법조신문',"'로펌 압수수색 논란' 종지부… 변호사 비밀유지권이 도입되기까지",'https://news.koreanbar.or.kr/news/articleView.html?idxno=35049','https://news.koreanbar.or.kr/news/articleView.html?idxno=35049','activity'],
    ['2026.01.30','머니투데이','펜타곤 법률세무회계, 법무법인 세종 조세그룹 출신 강건 변호사 영입','https://www.mt.co.kr/society/2026/01/30/2026013010045566804','https://www.mt.co.kr/society/2026/01/30/2026013010045566804','firm'],
    ['2026.01.20','법률저널','[인터뷰] 한국법조인협회 채용현 회장 “기존 변호사단체와 다른 한법협만의 역할 할 것”','https://www.lec.co.kr/news/articleView.html?idxno=751381','https://www.lec.co.kr/news/articleView.html?idxno=751381','interview'],
    ['2026.01.08','법조신문','한법협, 제15회 변호사시험 수험생 응원행사','https://news.koreanbar.or.kr/news/articleView.html?idxno=34866','https://news.koreanbar.or.kr/news/articleView.html?idxno=34866','activity'],
    ['2026.01.01','법률신문','2026 법조단체 신년사','https://www.lawtimes.co.kr/news/articleView.html?idxno=214574','https://www.lawtimes.co.kr/news/articleView.html?idxno=214574','column'],
    ['2025.12.16','MBC 뉴스투데이','‘청년 변호사 단체’가 본 내란 재판 “김용현 변호인 막말, 징계해야”','../news8/','https://imnews.imbc.com/replay/2025/nwtoday/article/6785570_36807.html','broadcast'],
    ['2025.12.15','법조신문','채용현 변호사, 한국법조인협회 제6대 회장 선출','../news2/','https://news.koreanbar.or.kr/news/articleView.html?idxno=34755','activity'],
    ['2025.12.15','네이트뉴스 · 머니투데이','채용현 신임 한법협 회장 “로스쿨 4년제로” 주장하는 이유는','../news6/','https://news.nate.com/view/20251215n01545','interview'],
    ['2025.12.11','머니투데이','‘창립 10주년’ 한국법조인협회, 신임 회장에 채용현 변호사 선출','../news1/','https://www.mt.co.kr/society/2025/12/11/2025121110264127243','activity'],
    ['2025.12.11','법률신문','“로스쿨·청년 변호사 함께 행동하는 단체로” 한국법조인협회 창립 10주년','../news5/','https://www.lawtimes.co.kr/news/articleView.html?idxno=214042','activity'],
    ['2025.12.11','한국경제','한국법조인협회 신임 회장에 채용현 변호사','../news7/','https://www.hankyung.com/article/202512117708i','activity'],
    ['2025.12.10','법률방송뉴스','한국법조인협회 10주년… 로스쿨 안착했지만 ‘AI 시대’ 대비해야','../news3/','https://www.lawtv.kr/news/articleView.html?idxno=50115','activity'],
    ['2025.12.10','파이낸셜뉴스','한국법조인협회, 창립 10주년 맞아 신임 회장에 채용현 변호사 선출','../news4/','https://busan.fnnews.com/news/202512102116561305','activity'],
    ['2025.12.03','택스워치','심판원이 왜 쇼츠를 만들었을까?…영세납세자 위한 제도 3가지','https://www.taxwatch.co.kr/article/tax/2025/12/02/0002','https://www.taxwatch.co.kr/article/tax/2025/12/02/0002','firm'],
    ['2022.01.14','아주경제·네이트뉴스','[법조산책] 동성혼과 세금 – 채용현 변호사','https://news.nate.com/view/20220114n34325','https://news.nate.com/view/20220114n34325','column'],
    ['2020.12.07','법조신문',"[국회단상] '제대로' 일하는 국회를 소망하며 – 채용현 변호사",'https://news.koreanbar.or.kr/news/articleView.html?idxno=22538','https://news.koreanbar.or.kr/news/articleView.html?idxno=22538','column']
  ];
  const LABEL={firm:'펜타곤 소식',interview:'인터뷰',column:'기고',activity:'법조 활동',broadcast:'방송'};
  const COPY={firm:'펜타곤 법률세무회계의 주요 소식과 전문 서비스 관련 보도입니다.',interview:'인터뷰와 법조계 현안에 관한 주요 발언을 확인하세요.',column:'법률·조세·법조 제도에 관한 전문가 기고입니다.',activity:'한국법조인협회와 주요 법조계 활동을 다룬 보도입니다.',broadcast:'방송 보도와 인터뷰 내용을 확인하세요.'};
  const esc=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[x]));
  let extra=[];
  try{const res=await fetch(`${base}/content/news.json?v=${Date.now()}`,{cache:'no-store'});if(res.ok)extra=await res.json()}catch(e){}
  const cms=extra.map(x=>[x.date||'',x.source||'',x.title||'',x.url||'#',x.image||x.url||'',x.category||'firm',x.summary||'']);
  const DATA=[...cms,...BUILTIN].sort((a,b)=>String(b[0]).localeCompare(String(a[0])));
  const grid=root.querySelector('[data-news-grid]');
  const more=root.querySelector('[data-news-more]');
  const buttons=[...root.querySelectorAll('[data-news-filter]')];
  let filter='all',limit=12;
  const preview=u=>'https://api.microlink.io/?url='+encodeURIComponent(u)+'&embed=image.url';
  const cards=DATA.map((item,i)=>{
    const [date,source,title,href,visual,category,summary]=item;
    const external=/^https?:\/\//.test(href);
    const card=document.createElement('article');
    card.className='ptg-newsroom-card';card.dataset.category=category;
    const imgSrc=/^https?:\/\//.test(visual)&&/\.(png|jpe?g|webp|gif)(\?|$)/i.test(visual)?visual:preview(visual||href);
    card.innerHTML=`<a href="${esc(href)}" ${external?'target="_blank" rel="noopener noreferrer"':''}><div class="ptg-newsroom-card__visual"><div class="ptg-newsroom-card__fallback"><span>${esc(source)}</span><strong>${esc(LABEL[category]||'뉴스')}</strong></div><img src="${esc(imgSrc)}" alt="${esc(title)}" loading="${i<6?'eager':'lazy'}" decoding="async"></div><div class="ptg-newsroom-card__body"><div class="ptg-newsroom-card__meta"><span>${esc(LABEL[category]||'법조 활동')}</span><time>${esc(date)}</time></div><h2>${esc(title)}</h2><p>${esc(summary||COPY[category]||COPY.activity)}</p><span class="ptg-newsroom-card__link">${external?'기사 원문 보기 ↗':'자세히 보기 →'}</span></div></a>`;
    card.querySelector('img')?.addEventListener('error',e=>e.currentTarget.style.display='none');
    return card;
  });
  cards.forEach(x=>grid.appendChild(x));
  const draw=()=>{const shown=cards.filter(x=>filter==='all'||x.dataset.category===filter);cards.forEach(x=>x.classList.add('is-hidden'));shown.slice(0,limit).forEach(x=>x.classList.remove('is-hidden'));more.hidden=shown.length<=limit};
  buttons.forEach(btn=>btn.addEventListener('click',()=>{filter=btn.dataset.newsFilter||'all';limit=12;buttons.forEach(x=>x.classList.toggle('is-active',x===btn));draw()}));
  more.addEventListener('click',()=>{limit+=9;draw()});
  draw();
})();