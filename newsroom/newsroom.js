(async()=>{
  const root=document.querySelector('.ptg-newsroom-page');
  if(!root)return;
  const base=location.hostname.endsWith('github.io')?'/ptglaw':'';
  const LABEL={firm:'펜타곤 소식',interview:'인터뷰',column:'기고',activity:'법조 활동',broadcast:'방송'};
  const COPY={firm:'펜타곤 법률세무회계의 주요 소식과 전문 서비스 관련 보도입니다.',interview:'인터뷰와 법조계 현안에 관한 주요 발언을 확인하세요.',column:'법률·조세·법조 제도에 관한 전문가 기고입니다.',activity:'한국법조인협회와 주요 법조계 활동을 다룬 보도입니다.',broadcast:'방송 보도와 인터뷰 내용을 확인하세요.'};
  const esc=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#039;'}[x]));
  let extra=[];
  try{const res=await fetch(`${base}/content/news.json?v=${Date.now()}`,{cache:'no-store'});if(res.ok)extra=await res.json()}catch(e){}
  // Merge published Firestore items while preserving existing GitHub JSON articles.
  try{const module=await import('../assets/js/firebase-content.js');const items=await module.publicEntries('news');if(items?.length){const ids=new Set(extra.map(x=>x.id));extra=[...items.filter(x=>!ids.has(x.id)),...extra]}}catch(err){console.warn('Firebase news fallback',err)}
  // All editorial articles now come from one CMS source; drafts are never rendered publicly.
  const records=Array.isArray(extra)?extra:[];
  const DATA=records.filter(x=>x&&x.status!=='draft').map(x=>[
    x.date||'',x.source||'',x.title||'',x.href||x.url||'#',
    x.image||x.url||'',x.category||'firm',x.summary||''
  ]).sort((a,b)=>String(b[0]).localeCompare(String(a[0])));
  const grid=root.querySelector('[data-news-grid]');
  const more=root.querySelector('[data-news-more]');
  const buttons=[...root.querySelectorAll('[data-news-filter]')];
  let filter='all',limit=12;
  const preview=u=>'https://api.microlink.io/?url='+encodeURIComponent(u)+'&screenshot=true&embed=screenshot.url&viewport.width=1280&viewport.height=800';
  const cards=DATA.map((item,i)=>{
    const [date,source,title,href,visual,category,summary]=item;
    const external=/^https?:\/\//.test(href);
    const card=document.createElement('article');
    card.className='ptg-newsroom-card';card.dataset.category=category;
    const imgSrc=/^https?:\/\//.test(visual)&&/\.(png|jpe?g|webp|gif)(\?|$)/i.test(visual)?visual:preview(visual||href);
    card.innerHTML=`<a href="${esc(href)}" ${external?'target="_blank" rel="noopener noreferrer"':''}><div class="ptg-newsroom-card__visual"><div class="ptg-newsroom-card__fallback"><span>${esc(source)}</span><strong>${esc(LABEL[category]||'뉴스')}</strong></div><img src="${esc(imgSrc)}" alt="${esc(title)}" loading="${i<6?'eager':'lazy'}" decoding="async"></div><div class="ptg-newsroom-card__body"><div class="ptg-newsroom-card__meta"><span>${esc(LABEL[category]||'법조 활동')}</span><time>${esc(date)}</time></div><h2>${esc(title)}</h2><p>${esc(summary||COPY[category]||COPY.activity)}</p><span class="ptg-newsroom-card__link">${external?'기사 원문 보기 ':'자세히 보기 →'}</span></div></a>`;
    const img=card.querySelector('img');
    img?.addEventListener('load',()=>img.classList.add('is-loaded'));
    img?.addEventListener('error',()=>img.remove());
    return card;
  });
  cards.forEach(x=>grid.appendChild(x));
  if(!cards.length)grid.innerHTML='<p class="ptg-newsroom-empty">등록된 기사가 없습니다.</p>';
  const draw=()=>{const shown=cards.filter(x=>filter==='all'||x.dataset.category===filter);cards.forEach(x=>x.classList.add('is-hidden'));shown.slice(0,limit).forEach(x=>x.classList.remove('is-hidden'));more.hidden=shown.length<=limit};
  buttons.forEach(btn=>btn.addEventListener('click',()=>{filter=btn.dataset.newsFilter||'all';limit=12;buttons.forEach(x=>x.classList.toggle('is-active',x===btn));draw()}));
  more.addEventListener('click',()=>{limit+=9;draw()});
  draw();
})();