(async()=>{
  const root=document.querySelector('.ptg-cases-page');
  if(!root)return;

  const base=location.hostname.endsWith('github.io')?'/ptglaw':'';
  const grid=root.querySelector('[data-cases-grid]');
  const buttons=[...root.querySelectorAll('[data-case-filter]')];
  const esc=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[x]));

  let data=[];
  try{
    const res=await fetch(`${base}/content/cases.json?v=${Date.now()}`,{cache:'no-store'});
    if(!res.ok)throw new Error('업무사례 데이터를 불러오지 못했습니다.');
    const json=await res.json();
    data=Array.isArray(json)?json:[];
  }catch(e){
    grid.innerHTML='<div class="ptg-cases-empty">업무사례를 불러오지 못했습니다.</div>';
    return;
  }

  const getHref=item=>{
    if(item.href)return item.href;
    return `${base}/cases/view/?id=${encodeURIComponent(item.id||'')}`;
  };

  const cards=data.map((item,index)=>{
    const categories=Array.isArray(item.categories)&&item.categories.length?item.categories:['corporate'];
    const tags=Array.isArray(item.tags)?item.tags:[];
    const article=document.createElement('article');
    article.className='ptg-case-card';
    article.dataset.categories=categories.join(' ');
    const href=getHref(item);
    const indexLabel=String(index+1).padStart(2,'0');
    article.innerHTML=`<div class="ptg-case-card__top"><div class="ptg-case-card__meta-wrap"><span class="ptg-case-card__index">${esc(indexLabel)}</span><div class="ptg-case-card__meta"><span>${esc(item.meta1||'업무사례')}</span>${item.meta2?`<i></i><span>${esc(item.meta2)}</span>`:''}</div></div><span class="ptg-case-card__result">${esc(item.result||'')}</span></div><a class="ptg-case-card__title" href="${esc(href)}">${esc(item.title||'')}</a><p class="ptg-case-card__summary">${esc(item.summary||'')}</p><div class="ptg-case-card__tags">${tags.map(v=>`<span>${esc(v)}</span>`).join('')}</div><a class="ptg-case-card__more" href="${esc(href)}">사례 자세히 보기 →</a>`;
    return article;
  });

  if(cards.length){
    cards.forEach(card=>grid.appendChild(card));
  }else{
    grid.innerHTML='<div class="ptg-cases-empty">등록된 업무사례가 없습니다.</div>';
  }

  const empty=document.createElement('div');
  empty.className='ptg-cases-empty';
  empty.textContent='해당 분류의 업무사례가 없습니다.';
  empty.hidden=true;
  grid.insertAdjacentElement('afterend',empty);

  const applyFilter=filter=>{
    let visible=0;
    cards.forEach(card=>{
      const show=filter==='all'||card.dataset.categories.split(' ').includes(filter);
      card.classList.toggle('is-hidden',!show);
      card.hidden=!show;
      card.setAttribute('aria-hidden',String(!show));
      if(show)visible+=1;
    });
    empty.hidden=visible!==0;
  };

  buttons.forEach(button=>{
    button.setAttribute('aria-pressed',String(button.classList.contains('is-active')));
    button.addEventListener('click',()=>{
      buttons.forEach(x=>{
        const active=x===button;
        x.classList.toggle('is-active',active);
        x.setAttribute('aria-pressed',String(active));
      });
      applyFilter(button.dataset.caseFilter||'all');
    });
  });

  applyFilter('all');
})();
