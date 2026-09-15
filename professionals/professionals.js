(()=>{
  const order=['chaeyonghyun','kanggeon','jeonseunghwan','kimjisoo'];
  const team=document.querySelector('.ptg-team-page');
  if(team){
    const grid=team.querySelector('.ptg-team-grid');
    if(grid){
      const cards=[...grid.querySelectorAll('.ptg-person-card')];
      order.forEach(slug=>{
        const card=cards.find(item=>(item.getAttribute('href')||'').includes(`/${slug}/`));
        if(card)grid.appendChild(card);
      });
    }

    const buttons=[...team.querySelectorAll('[data-filter]')];
    const cards=[...team.querySelectorAll('.ptg-person-card')];
    buttons.forEach(button=>button.addEventListener('click',()=>{
      const filter=button.dataset.filter||'all';
      buttons.forEach(btn=>{const active=btn===button;btn.classList.toggle('is-active',active);btn.setAttribute('aria-pressed',String(active));});
      cards.forEach(card=>{const categories=(card.dataset.category||'').split(' ');card.style.display=filter==='all'||categories.includes(filter)?'':'none';});
    }));
    const reveal=[...team.querySelectorAll('[data-reveal]')];
    if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
      team.classList.add('js-ready');
      reveal.forEach((el,i)=>el.style.setProperty('--delay',Math.min(i*.035,.22)+'s'));
      const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-in');io.unobserve(entry.target);}}),{threshold:.14,rootMargin:'0px 0px -8% 0px'});
      reveal.forEach(el=>io.observe(el));
    }else reveal.forEach(el=>el.classList.add('is-in'));
  }

  const profile=document.querySelector('.ptg-profile');
  if(profile){
    const buttons=[...profile.querySelectorAll('.ptg-field-list button')];
    const box=profile.querySelector('.ptg-field-desc');
    buttons.forEach(button=>button.addEventListener('click',()=>{
      buttons.forEach(btn=>btn.classList.remove('is-active'));
      button.classList.add('is-active');
      if(box)box.innerHTML=`<strong>${button.dataset.title||button.textContent.trim()}</strong><p>${button.dataset.desc||''}</p>`;
    }));

    const path=location.pathname;
    const slug=order.find(name=>path.includes(`/professionals/${name}/`));
    const labels={
      chaeyonghyun:'채용현',
      kanggeon:'강건',
      jeonseunghwan:'전승환',
      kimjisoo:'김지수'
    };

    if(slug==='jeonseunghwan'){
      profile.querySelectorAll('.ptg-profile__contact .ptg-contact-line').forEach(line=>{
        const label=line.querySelector('span')?.textContent?.trim()||'';
        if(label==='Direct.'||label==='Mobile.')line.remove();
      });
    }

    if(slug){
      const current=order.indexOf(slug);
      let nav=profile.querySelector('.ptg-profile__bottom-nav');
      if(!nav){
        nav=document.createElement('div');
        nav.className='ptg-profile__bottom-nav';
        profile.querySelector('.ptg-profile__inner')?.appendChild(nav);
      }
      if(nav){
        const prev=order[current-1];
        const next=order[current+1];
        nav.innerHTML=`${prev?`<a href="../${prev}/">이전 구성원: ${labels[prev]}</a>`:''}${next?`<a href="../${next}/">다음 구성원: ${labels[next]}</a>`:''}`;
      }
    }
  }
})();
