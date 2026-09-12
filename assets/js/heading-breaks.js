(()=>{
  const SELECTORS='main h1, main h2';
  const PUNCT=/[,，.。!?！？]/;
  const isDigit=c=>/\d/.test(c||'');

  const markExistingBreaks=el=>{
    let marked=false;
    [...el.querySelectorAll('br')].forEach(br=>{
      const range=document.createRange();
      range.selectNodeContents(el);
      range.setEndBefore(br);
      const before=range.toString().trim();
      const last=before.slice(-1);
      if(PUNCT.test(last)){
        br.classList.add('keep-break','ptg-punct-break');
        marked=true;
      }
    });
    return marked;
  };

  const findBreakIndex=text=>{
    for(let i=0;i<text.length;i+=1){
      const c=text[i];
      if(!PUNCT.test(c))continue;
      const prev=text[i-1]||'';
      const next=text[i+1]||'';
      if(c==='.'&&isDigit(prev)&&isDigit(next))continue;
      const left=text.slice(0,i+1).trim();
      const right=text.slice(i+1).trim();
      if(left.length<6||right.length<3)continue;
      return i;
    }
    return -1;
  };

  const insertBreak=(el,index)=>{
    const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
    let offset=0,node;
    while((node=walker.nextNode())){
      const value=node.nodeValue||'';
      const len=value.length;
      if(index<offset+len){
        const local=index-offset;
        const left=value.slice(0,local+1);
        const right=value.slice(local+1);
        node.nodeValue=left;
        const br=document.createElement('br');
        br.className='keep-break ptg-punct-break';
        br.setAttribute('aria-hidden','true');
        node.parentNode.insertBefore(br,node.nextSibling);
        if(right){node.parentNode.insertBefore(document.createTextNode(right.replace(/^\s+/,'')),br.nextSibling)}
        return true;
      }
      offset+=len;
    }
    return false;
  };

  const applyTo=el=>{
    if(!el||el.dataset.punctBreak==='off')return;
    if(markExistingBreaks(el)){
      el.dataset.punctBreakApplied='true';
      return;
    }
    if(el.dataset.punctBreakApplied==='true')return;
    const text=el.textContent.replace(/\u00a0/g,' ');
    const index=findBreakIndex(text);
    if(index>=0&&insertBreak(el,index))el.dataset.punctBreakApplied='true';
  };

  const apply=scope=>{
    if(scope?.matches?.(SELECTORS))applyTo(scope);
    scope?.querySelectorAll?.(SELECTORS).forEach(applyTo);
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
