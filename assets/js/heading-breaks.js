(()=>{
  const SELECTORS='main h1, main h2, main h3, main h4';
  const PERIODS=new Set(['.','。']);
  const isDigit=c=>/\d/.test(c||'');

  const hasMeaningfulTextAfter=(el,node,offset)=>{
    const range=document.createRange();
    range.setStart(node,offset);
    range.setEndAfter(el.lastChild||el);
    return range.toString().trim().length>=2;
  };

  const markExistingBreaks=el=>{
    [...el.querySelectorAll('br')].forEach(br=>{
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
      const text=textNode.nodeValue||'';
      const points=[];
      for(let i=0;i<text.length;i+=1){
        const c=text[i];
        if(!PERIODS.has(c))continue;
        if(c==='.'&&isDigit(text[i-1])&&isDigit(text[i+1]))continue;
        if(!hasMeaningfulTextAfter(el,textNode,i+1))continue;
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
      mutations.forEach(m=>m.addedNodes.forEach(node=>{if(node.nodeType===1)apply(node)}));
    });
    observer.observe(document.body,{childList:true,subtree:true});
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
