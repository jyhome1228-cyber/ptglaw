(()=>{
  const SELECTORS=[
    'main h1',
    '.home-section__head h2',
    '.about-section__head h2',
    '.penta-business-title',
    '.penta-case-head h2',
    '.svc-heading h2',
    '.svc-prepare h2',
    '#ptg-inherit-onestop .ptg-h2',
    '.ptg-center-modern__section-head h2',
    '.ptg-case-detail-hero h2',
    '.ptg-article h1',
    '.article-hero h1'
  ].join(',');

  const isDigit=c=>/\d/.test(c||'');
  const findBreakIndex=text=>{
    for(let i=0;i<text.length;i+=1){
      const c=text[i];
      if(!',.，。'.includes(c))continue;
      const prev=text[i-1]||'';
      const next=text[i+1]||'';
      if(isDigit(prev)&&isDigit(next))continue;
      const left=text.slice(0,i+1).trim();
      const right=text.slice(i+1).trim();
      if(left.length<8||right.length<4)continue;
      return i;
    }
    return -1;
  };

  const insertBreak=(el,index)=>{
    const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
    let offset=0,node;
    while((node=walker.nextNode())){
      const len=node.nodeValue.length;
      if(index<offset+len){
        const local=index-offset;
        const value=node.nodeValue;
        const left=value.slice(0,local+1);
        const right=value.slice(local+1).replace(/^\s+/, '');
        node.nodeValue=left;
        const br=document.createElement('br');
        br.className='keep-break ptg-punct-break';
        br.setAttribute('aria-hidden','true');
        node.parentNode.insertBefore(br,node.nextSibling);
        if(right){
          node.parentNode.insertBefore(document.createTextNode(right),br.nextSibling);
        }
        return true;
      }
      offset+=len;
    }
    return false;
  };

  const apply=scope=>{
    const targets=[];
    if(scope?.matches?.(SELECTORS))targets.push(scope);
    scope?.querySelectorAll?.(SELECTORS).forEach(el=>targets.push(el));
    targets.forEach(el=>{
      if(el.dataset.punctBreakApplied==='true'||el.dataset.punctBreak==='off')return;
      const text=el.textContent.replace(/\u00a0/g,' ');
      const index=findBreakIndex(text);
      if(index<0)return;
      if(insertBreak(el,index))el.dataset.punctBreakApplied='true';
    });
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
