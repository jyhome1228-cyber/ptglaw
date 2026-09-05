(()=>{
  const team=document.querySelector('.ptg-team-page');
  if(team){
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
      if(box) box.innerHTML=`<strong>${button.dataset.title||button.textContent.trim()}</strong><p>${button.dataset.desc||''}</p>`;
    }));
  }
})();
