(()=>{
  /*
   * Global punctuation line-break helper.
   * Long-form copy across the site should start a new visual line after a full stop.
   * Decimal numbers, domains/abbreviations and code-like content are excluded.
   */
  const SELECTORS=[
    'main h1','main h2','main h3','main h4',
    'main p'
  ].join(',');

  const EXCLUDE='nav,table,pre,code,kbd,samp,[contenteditable="true"],[data-punct-break="off"]';
  const PERIODS=new Set(['.','。']);
  const isDigit=c=>/\d/.test(c||'');
  const isAsciiLetter=c=>/[A-Za-z]/.test(c||'');

  const getTextAfterPoint=(el,node,offset)=>{
    const range=document.createRange();
    range.setStart(node,offset);
    range.setEndAfter(el.lastChild||el);
    return range.toString().trim();
  };

  const shouldSkipPoint=(text,index)=>{
    const prev=text[index-1]||'';
    const next=text[index+1]||'';

    // 3.3 / 1.25 같은 소수점
    if(isDigit(prev)&&isDigit(next))return true;

    // ptglaw.co.kr / e.g. / A.B 같은 영문 도메인·약어 내부
    if(isAsciiLetter(prev)&&isAsciiLetter(next))return true;

    // 말줄임표·연속 온점
    if(PERIODS.has(prev)||PERIODS.has(next))return true;

    return false;
  };

  const markExistingBreaks=el=>{
    el.querySelectorAll('br').forEach(br=>{
      br.classList.add('keep-break','ptg-punct-break');
    });
  };

  const insertPeriodBreaks=el=>{
    if(!el||el.dataset.punctBreak==='off'||el.dataset.punctBreakApplied==='true')return;
    if(el.closest(EXCLUDE))return;

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
        if(shouldSkipPoint(original,i))continue;

        // 문장 끝 뒤에 실제 다음 문장이 있을 때만 줄바꿈
        if(getTextAfterPoint(el,textNode,i+1).length<1)continue;
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
