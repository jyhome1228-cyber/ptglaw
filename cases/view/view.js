/* CMS detail view — data-based cases posted through /admin/ */
(async()=>{
  const root=document.querySelector('[data-cms-case]');
  if(!root)return;
  const base=location.hostname.endsWith('github.io')?'/ptglaw':'';
  const casePath=location.pathname.match(/\/case(\d+)\/?$/);
  const id=new URLSearchParams(location.search).get('id')||(casePath?'case-'+casePath[1]:null);
  const esc=value=>String(value??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[x]));
  const out=value=>esc(value).replace(/\r?\n/g,'<br>');
  let item=null;
  try{
    const response=await fetch(base+'/content/cases.json?t='+Date.now(),{cache:'no-store'});
    if(response.ok){
      const records=await response.json();
      item=Array.isArray(records)?records.find(x=>x&&String(x.id)===String(id)&&x.status!=='draft'):null;
    }
  }catch(e){}
  if(!item){
    root.innerHTML='<header class="ptg-case-detail-hero"><h1>사례를 찾을 수 없습니다.</h1><p>삭제되었거나 아직 공개되지 않은 업무사례입니다.</p><div class="ptg-case-detail-bottom"><a class="ptg-case-detail-list-btn" href="../">업무사례 목록</a></div></header>';
    return;
  }
  document.title=(item.title||'업무사례')+' | 펜타곤 법률세무회계';
  const sections=[
    {id:'case-overview',title:'사건 개요',body:item.overview||item.summary||''},
    {id:'case-strategy',title:'대응',body:item.strategy||''},
    {id:'case-result',title:'결과',body:item.resultBody||item.result||''},
    {id:'case-point',title:'시사점',body:item.point||''}
  ].filter(section=>section.body.trim());
  const tags=Array.isArray(item.tags)?item.tags:[];
  const overview=sections.map(section=>
    '<section class="ptg-case-section" id="'+section.id+'"><h3>'+esc(section.title)+'</h3>'+
    (section.id==='case-result'?'<div class="ptg-case-result-box"><span>'+esc(item.result||'주요 결과')+'</span><p>'+out(section.body)+'</p></div>':'<p>'+out(section.body)+'</p>')+
    '</section>'
  ).join('');
  const toc=sections.length>1?'<nav class="ptg-case-toc"><p>목차</p><ol>'+sections.map(section=>
    '<li><a href="#'+section.id+'">'+esc(section.title)+'</a></li>').join('')+'</ol></nav>':'';
  root.innerHTML=
    '<header class="ptg-case-detail-hero"><div class="ptg-case-detail-hero__meta"><span>'+esc(item.meta1||'업무사례')+'</span>'+
    (item.meta2?'<i></i><span>'+esc(item.meta2)+'</span>':'')+'</div>'+
    '<h1>'+esc(item.title||'업무사례')+'</h1><p>'+esc(item.summary||'')+'</p>'+
    '<div class="ptg-case-detail-tags">'+tags.map(t=>'<span>'+esc(t)+'</span>').join('')+'</div></header>'+
    '<div class="ptg-case-detail-layout"><article class="ptg-case-detail-content">'+toc+overview+
    '<div class="ptg-case-detail-bottom"><a class="ptg-case-detail-list-btn" href="../">업무사례 목록</a></div></article>'+
    '<aside class="ptg-case-detail-side"><div class="ptg-case-side-info"><p>사건 분야</p><strong>'+esc(item.meta1||'업무사례')+'</strong></div>'+
    '<div class="ptg-case-side-info"><p>주요 결과</p><strong>'+esc(item.result||'-')+'</strong></div>'+ 
    (Array.isArray(item.experts)&&item.experts.length?'<div class="ptg-case-side-info"><p>담당 변호사</p><strong>'+esc(item.experts.join(' · '))+'</strong></div>':'')+'</aside></div>';
})();