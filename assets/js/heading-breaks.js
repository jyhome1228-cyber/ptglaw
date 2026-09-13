(()=>{
  /*
   * Punctuation line-break helper.
   * Scope is intentionally limited to headings and heading/section lead copy.
   * Card/body paragraphs are not touched.
   */
  const SELECTORS=[
    'main h1','main h2','main h3','main h4',
    '.svc-heading > p',
    '.svc-hero-copy > p',
    '.about-section__head > p',
    '.about-hero__content > p',
    '.penta-business-head > p',
    '.penta-business-desc',
    '.penta-case-head > p',
    '.home-section__head .home-intro',
    '.home-hero__content > p:not(.home-label)',
    '.ptg-center-modern__section-head > p',
    '.ptg-center-modern__lead',
    '#ptg-inherit-onestop .ptg-section-head > p',
    '#ptg-inherit-onestop .ptg-lead',
    '.section-heading > p',
    '.split-heading > p',
    '.page-hero .wrap > p:not(.eyebrow)',
    '.ptg-team-head__text > p:last-child',
    '.ptg-profile__summary'
  ].join(',');

  const PERIODS=new Set(['.','。']);
  const isDigit=c=>/\d/.test(c||'');

  const getTextAfterPoint=(el,node,offset)=>{
    const range=document.createRange();
    range.setStart(node,offset);
    range.setEndAfter(el.lastChild||el);
    return range.toString().trim();
  };

  const markExistingBreaks=el=>{
    el.querySelectorAll('br').forEach(br=>{
      br.classList.add('keep-break','ptg-punct-break');
    });
  };

  const insertPeriodBreaks=el=>{
    if(!el||el.dataset.punctBreak==='off'||el.dataset.punctBreakApplied==='true')return;
    markExistingBreaks(el);

    const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
    const nodes=[];
    let node;
    while((node=walker.nextNode()))nodes.push(node);

    nodes.forEach(textNode=>{
      const original=textNode.nodeValue||'';
      const points=[];

      for(let i=0;i<original.length;i+=1){
        const c=original[i];
        if(!PERIODS.has(c))continue;
        if(c==='.'&&isDigit(original[i-1])&&isDigit(original[i+1]))continue;
        if(getTextAfterPoint(el,textNode,i+1).length<2)continue;
        points.push(i+1);
      }

      for(let i=points.length-1;i>=0;i-=1){
        const at=points[i];
        const right=textNode.splitText(at);
        right.nodeValue=right.nodeValue.replace(/^\s+/, '');
        const br=document.createElement('br');
        br.className='keep-break ptg-punct-break';
        br.setAttribute('aria-hidden','true');
        textNode.parentNode.insertBefore(br,right);
      }
    });

    el.dataset.punctBreakApplied='true';
  };

  const apply=scope=>{
    if(scope?.matches?.(SELECTORS))insertPeriodBreaks(scope);
    scope?.querySelectorAll?.(SELECTORS).forEach(insertPeriodBreaks);
  };

  const start=()=>{
    apply(document);
    const observer=new MutationObserver(mutations=>{
      mutations.forEach(m=>m.addedNodes.forEach(node=>{
        if(node.nodeType===1)apply(node);
      }));
    });
    observer.observe(document.body,{childList:true,subtree:true});
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
