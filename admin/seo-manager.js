/* Pentagon SEO manager — direct source HTML editing; token required for saving. */
(()=>{
 'use strict';
 const scope=document.querySelector('[data-panel="seo"]');if(!scope)return;
 const $=s=>scope.querySelector(s),base=location.hostname.endsWith('github.io')?'/ptglaw':'';
 const host='https://ptglaw.co.kr';
 const pages=[
 ['index.html','메인','/'],['about/index.html','펜타곤 소개','/about/'],
 ['services/index.html','업무 분야','/services/'],
 ['services/legal/index.html','법률 자문·소송','/services/legal/'],
 ['services/tax/index.html','세무 기장·자문','/services/tax/'],
 ['services/ip/index.html','IP 지식재산권','/services/ip/'],
 ['services/recovery/index.html','채권 추심','/services/recovery/'],
 ['services/registry/index.html','등기 업무','/services/registry/'],
 ['fees/index.html','법인등기 보수·실비','/fees/'],
 ['center/index.html','법인설립지원센터','/center/'],
 ['inheritance/index.html','상속원스톱서비스','/inheritance/'],
 ['cases/index.html','업무사례','/cases/'],
 ['newsroom/index.html','펜타곤 소식','/newsroom/'],
 ['contact/index.html','문의하기','/contact/'],
 ['location/index.html','오시는 길','/location/'],
 ['professionals/index.html','구성원','/professionals/'],
 ['tools/index.html','간편 계산 서비스','/tools/'],
 ['tools/withholding/index.html','원천징수 계산기','/tools/withholding/'],
 ['tools/vat/index.html','부가세 계산기','/tools/vat/'],
 ['tools/severance/index.html','퇴직금 계산기','/tools/severance/'],
 ['tools/asset-tax/index.html','양도·증여·상속세 계산기','/tools/asset-tax/']
 ];
 const pageSelect=$('[data-seo-page]');
 const title=$('[data-seo-title]'),description=$('[data-seo-description]');
 const keywords=$('[data-seo-keywords]'),image=$('[data-seo-image]');
 const canonical=$('[data-seo-canonical]'),message=$('[data-seo-status]');
 const audit=$('[data-seo-audit]'),sitemap=$('[data-seo-sitemap-result]');
 const saveButton=$('[data-seo-save]');
 const current=()=>pages.find(p=>p[0]===pageSelect.value)||pages[0];
 const esc=x=>String(x||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const notice=(t,kind='info')=>{message.textContent=t;message.dataset.kind=kind};
 const terms=x=>x.split(',').map(s=>s.trim()).filter(Boolean).length;
 const values=()=>({title:title.value.trim(),description:description.value.trim(),keywords:keywords.value.trim(),image:image.value.trim()});
 const b64=x=>btoa(unescape(encodeURIComponent(x)));
 const unb64=x=>decodeURIComponent(escape(atob(String(x||'').replace(/\s/g,''))));
 pageSelect.innerHTML=pages.map(p=>'<option value="'+p[0]+'">'+p[1]+' · '+p[2]+'</option>').join('');
 function preview(){
  const p=current(),data=values();
  canonical.value=host+p[2];
  $('[data-seo-open]').href=base+p[2];
  $('[data-seo-length]').textContent='제목 '+data.title.length+'자 · 설명 '+data.description.length+'자 · 키워드 '+terms(data.keywords)+'개';
  $('[data-seo-preview-title]').textContent=data.title||'페이지 제목';
  $('[data-seo-preview-description]').textContent=data.description||'설명을 입력해주세요.';
  $('[data-seo-preview-url]').textContent=host+p[2];
 }
 [title,description,keywords,image].forEach(el=>el.addEventListener('input',preview));
 const meta=(doc,k,a='name')=>doc.querySelector('meta['+a+'="'+k+'"]')?.getAttribute('content')||'';
 function parse(text){
  const doc=new DOMParser().parseFromString(text,'text/html');
  return {
    title:doc.querySelector('title')?.textContent?.trim()||'',
    description:meta(doc,'description'),keywords:meta(doc,'keywords'),
    image:meta(doc,'og:image','property'),
    ogTitle:meta(doc,'og:title','property'),ogDescription:meta(doc,'og:description','property'),
    canonical:doc.querySelector('link[rel="canonical"]')?.getAttribute('href')||'',
    noindex:/\bnoindex\b/i.test(meta(doc,'robots')),main:!!doc.querySelector('main')
  };
 }
 function auditPage(data,p){
  const result=[
   ['Title',!!data.title,data.title.length+'자'],
   ['Description',!!data.description,data.description.length+'자'],
   ['Keywords',!!data.keywords,terms(data.keywords)+'개 (Google 순위 신호 아님)'],
   ['Canonical',data.canonical===host+p[2],data.canonical||'없음'],
   ['OG Title',!!data.ogTitle,!!data.ogTitle?'설정됨':'미설정'],
   ['OG Description',!!data.ogDescription,!!data.ogDescription?'설정됨':'미설정'],
   ['OG Image',!!data.image,data.image||'미설정'],
   ['Index',!data.noindex,data.noindex?'noindex':'색인 차단 없음'],
   ['본문',data.main,data.main?'main 있음':'main 없음']
  ];
  audit.innerHTML=result.map(([name,good,detail])=>'<div class="seo-check-row"><span class="seo-dot '+(good?'good':'bad')+'"></span><b>'+esc(name)+'</b><small>'+esc(detail)+'</small></div>').join('');
  return result.filter(x=>!x[1]);
 }
 async function source(p){
  const r=await fetch(base+p[2]+'?seo='+Date.now(),{cache:'no-store'});
  if(!r.ok)throw Error('HTTP '+r.status);
  return r.text();
 }
 async function load(){
  const p=current();notice('현재 배포된 HTML을 확인하고 있습니다.');audit.innerHTML='';
  try{
   const d=parse(await source(p));
   title.value=d.title;description.value=d.description;keywords.value=d.keywords;image.value=d.image;
   preview();
   const failed=auditPage(d,p);
   notice(failed.length?'점검 항목 '+failed.length+'개를 확인해주세요.':'해당 페이지의 기본 메타정보가 설정돼 있습니다.',failed.length?'warn':'good');
  }catch(err){notice('메타정보 로드 실패: '+err.message,'error')}
 }
 // This function edits HTML <head> only; page body and layout remain intact.
 function patch(html,values,p){
  const pos=html.toLowerCase().indexOf('</head>');
  if(pos<0)throw Error('HTML head 태그를 찾을 수 없습니다.');
  let head=html.slice(0,pos),body=html.slice(pos);
  if(/<title>[\s\S]*?<\/title>/i.test(head))head=head.replace(/<title>[\s\S]*?<\/title>/i,'<title>'+esc(values.title)+'</title>');
  else head+='\n<title>'+esc(values.title)+'</title>';
  function upsert(attr,key,value){
   // keys are hardcoded (description, og:title, etc.), never user-provided.
   const re=new RegExp('<meta\\b(?=[^>]*\\b'+attr+'=["\\x27]'+key+'["\\x27])[^>]*>','i');
   const tag='<meta '+attr+'="'+key+'" content="'+esc(value)+'">';
   head=re.test(head)?head.replace(re,tag):head+'\n'+tag+'\n';
  }
  upsert('name','description',values.description);
  upsert('name','keywords',values.keywords);
  upsert('property','og:title',values.title);
  upsert('property','og:description',values.description);
  upsert('property','og:image',values.image);
  upsert('name','twitter:title',values.title);
  upsert('name','twitter:description',values.description);
  upsert('name','twitter:image',values.image);
  const can='<link rel="canonical" href="'+host+p[2]+'">';
  const canRE=/<link\b(?=[^>]*rel=["']canonical["'])[^>]*>/i;
  head=canRE.test(head)?head.replace(canRE,can):head+'\n'+can+'\n';
  return head+body;
 }
 async function save(){
  const p=current(),data=values();
  if(data.title.length<10||data.title.length>95)return notice('제목은 10~95자로 입력해주세요.','error');
  if(data.description.length<35||data.description.length>240)return notice('설명은 35~240자로 입력해주세요.','error');
  if(terms(data.keywords)>12||data.keywords.length>350)return notice('키워드는 최대 12개, 350자 이내로 정리해주세요.','error');
  if(data.image&&!/^https:\/\//i.test(data.image))return notice('OG 이미지 주소는 HTTPS만 허용합니다.','error');
  const token=sessionStorage.getItem('ptgAdminToken')||'';
  const repo=sessionStorage.getItem('ptgAdminRepo')||'jyhome1228-cyber/ptglaw';
  const branch=sessionStorage.getItem('ptgAdminBranch')||'main';
  if(!token)return notice('사이트 상태에서 GitHub 토큰을 연결해주세요.','error');
  if(repo!=='jyhome1228-cyber/ptglaw'||branch!=='main')return notice('펜타곤 저장소의 main 브랜치만 편집할 수 있습니다.','error');
  saveButton.disabled=true;notice('GitHub에 저장하는 중입니다...');
  try{
    const api='https://api.github.com/repos/'+repo+'/contents/'+p[0];
    const headers={Accept:'application/vnd.github+json',Authorization:'Bearer '+token,'X-GitHub-Api-Version':'2022-11-28'};
    const read=await fetch(api+'?ref=main',{headers,cache:'no-store'});
    if(!read.ok)throw Error('파일 읽기 실패: HTTP '+read.status);
    const payload=await read.json(),old=unb64(payload.content),updated=patch(old,data,p);
    if(old===updated){notice('이미 최신 메타정보가 저장되어 있습니다.','good');return}
    const response=await fetch(api,{method:'PUT',headers:{...headers,'Content-Type':'application/json'},
      body:JSON.stringify({message:'SEO metadata: '+p[2],sha:payload.sha,branch:'main',content:b64(updated)})});
    if(!response.ok)throw Error('게시 실패 HTTP '+response.status+(response.status===409?' (다른 수정사항 반영 후 다시 시도)':''));
    notice('GitHub HTML 저장 완료. Pages 배포 후 다시 검사해 주세요.','good');
  }catch(e){notice(e.message,'error')}finally{saveButton.disabled=false}
 }
 async function sitemapCheck(){
  try{
   const r=await fetch(base+'/sitemap.xml?seo='+Date.now(),{cache:'no-store'});
   if(!r.ok)throw Error('HTTP '+r.status);
   const xml=new DOMParser().parseFromString(await r.text(),'application/xml');
   if(xml.querySelector('parsererror'))throw Error('사이트맵 XML 문법 오류');
   const urls=Array.from(xml.getElementsByTagName('loc')).map(x=>(x.textContent||'').trim());
   const missing=pages.filter(p=>!urls.includes(host+p[2]));
   const redirects=urls.filter(x=>/\/information\/|\/services\/registry\/estimate\/|\/tools\/corporate-registration\//.test(x));
   sitemap.textContent='URL '+urls.length+'개 · 주요 페이지 누락 '+missing.length+'개 · 이전 주소 '+redirects.length+'개'+
    (missing.length?' | 누락: '+missing.map(x=>x[2]).join(', '):'')+
    (redirects.length?' | 이전: '+redirects.map(x=>x.replace(host,'')).join(', '):'')+
    ' | 동적 CMS 상세 주소는 별도 등록 자동화가 필요합니다.';
  }catch(e){sitemap.textContent='사이트맵 점검 실패: '+e.message}
 }
 async function auditAll(){
  const button=$('[data-seo-all]'),root=$('[data-seo-all-result]');button.disabled=true;
  const rows=[];
  try{
   for(let i=0;i<pages.length;i+=4){
    const chunk=pages.slice(i,i+4);
    const results=await Promise.all(chunk.map(async p=>{
      try{
       const d=parse(await source(p));
       const fails=[!d.title?'Title':null,!d.description?'Description':null,!d.image?'OG Image':null,
         d.canonical!==host+p[2]?'Canonical':null,d.noindex?'noindex':null].filter(Boolean);
       return {name:p[1],detail:fails.length?fails.join(', '):'기본 설정 정상',ok:fails.length===0};
      }catch(e){return {name:p[1],detail:'읽기 실패: '+e.message,ok:false}}
    }));
    rows.push(...results);
    root.innerHTML=rows.map(x=>'<div class="seo-audit-item"><b>'+esc(x.name)+'</b><span class="'+(x.ok?'good':'bad')+'">'+esc(x.detail)+'</span></div>').join('');
   }
   const count=rows.filter(x=>!x.ok).length;
   notice(pages.length+'개 페이지 검사 완료. 확인 필요 '+count+'개. 검색엔진 실제 색인 여부와는 별개입니다.',count?'warn':'good');
  }finally{button.disabled=false}
 }
 pageSelect.addEventListener('change',load);
 $('[data-seo-load]').addEventListener('click',load);
 $('[data-seo-save]').addEventListener('click',save);
 $('[data-seo-sitemap]').addEventListener('click',sitemapCheck);
 $('[data-seo-all]').addEventListener('click',auditAll);
 preview();load();
})();