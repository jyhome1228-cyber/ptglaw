import {db} from '../assets/js/firebase-client.js';
import {columnSeeds} from '../assets/js/column-seeds.js';
import {getDocs,collection,query,where} from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js';
const $=s=>document.querySelector(s);
const names={'tax-audit':'세무조사','tax-ruling':'조세·판례',inheritance:'상속·증여',legal:'법률',insight:'전문가 칼럼'};
const pictures={
 '강건':'https://nineworksdatabase.planus253.workers.dev/cdn/uncategorized/20261110-005359-image-cac846d6.webp',
 '전승환':'https://nineworksdatabase.planus253.workers.dev/cdn/uncategorized/20261110-005400-image-8c615a2b.webp',
 '채용현':'https://nineworksdatabase.planus253.workers.dev/cdn/uncategorized/20261110-005400-image-341ee81f.webp'
};
const base=location.pathname.startsWith('/ptglaw/')?'/ptglaw':'';
let articles=columnSeeds.slice(),filter='all',author='all';
const isArticle=x=>x&&x.status==='published';
function picture(x){return x.image||pictures[x.author]||''}
function authorBox(x,large=false){
 const wrap=document.createElement('div');wrap.className=large?'ptg-column-writer ptg-column-writer--detail':'ptg-column-writer';
 const src=picture(x);
 if(src){const img=document.createElement('img');img.src=src;img.alt=x.author+' 프로필 사진';img.loading=large?'eager':'lazy';img.decoding='async';wrap.append(img)}
 const words=document.createElement('div');const name=document.createElement('strong');name.textContent=x.author||'펜타곤 전문가';
 const role=document.createElement('span');role.textContent=names[x.category]+' · '+(x.source||'펜타곤 법률세무회계');
 words.append(name,role);wrap.append(words);return wrap;
}
function showList(){history.pushState(null,'',base+'/columns/');render();window.scrollTo({top:0,behavior:'instant'})}
function showDetail(id,historyMode='push'){
 const x=articles.find(x=>x.id===id&&isArticle(x));if(!x){showList();return}
 $('#columnHeading').hidden=true;$('#columnListing').hidden=true;$('#columnDetail').hidden=false;
 const box=$('#columnArticle');box.replaceChildren();
 const category=document.createElement('span');category.className='ptg-column-detail-category';category.textContent=x.series||'전문가 칼럼';
 const h=document.createElement('h1');h.textContent=x.title;
 const info=document.createElement('div');info.className='ptg-column-detail-meta';info.append(authorBox(x,true));
 const date=document.createElement('span');date.textContent=x.date||'';info.append(date);
 const intro=document.createElement('p');intro.className='ptg-column-detail-summary';intro.textContent=x.summary||'';
 box.append(category,h,info);if(x.summary)box.append(intro);
 if(x.body){
  const content=document.createElement('section');content.className='ptg-column-prose';
  const parts=x.body.split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean);
  parts.forEach(part=>{const p=document.createElement('p');p.textContent=part;content.append(p)});
  box.append(content);
 }
 if(x.url&&/^https:\/\//i.test(x.url)){
  const link=document.createElement('a');link.href=x.url;link.target='_blank';link.rel='noopener noreferrer';link.className='ptg-column-original';link.textContent='언론사 원문 보기 ↗';box.append(link);
 }
 const related=document.createElement('div');related.className='ptg-column-consult';
 const cTitle=document.createElement('h2');cTitle.textContent='관련 법률·세무 상담이 필요하신가요?';
 const cCopy=document.createElement('p');cCopy.textContent='사안의 구체적인 사실관계에 따라 검토 내용이 달라질 수 있습니다. 상담 문의를 남겨주세요.';
 const cLink=document.createElement('a');cLink.href=base+'/contact/';cLink.textContent='상담 문의하기 →';
 related.append(cTitle,cCopy,cLink);box.append(related);
 if(historyMode==='push')history.pushState(null,'',base+'/columns/?article='+encodeURIComponent(x.id));
 document.title=x.title+' | 펜타곤 전문가 칼럼';window.scrollTo({top:0,behavior:'instant'});
}
function render(){
 document.title='전문가 칼럼 | 펜타곤 법률세무회계';
 $('#columnHeading').hidden=false;$('#columnListing').hidden=false;$('#columnDetail').hidden=true;
 const filters=$('#columnFilters');filters.replaceChildren();
 [['all','전체'],...Object.entries(names)].forEach(([id,name])=>{
  const b=document.createElement('button');b.type='button';b.textContent=name;b.className=id===filter?'active':'';
  b.setAttribute('aria-pressed',String(id===filter));b.onclick=()=>{filter=id;render()};filters.append(b);
 });
 const aFilter=$('#columnAuthors');if(aFilter){aFilter.replaceChildren();[['all','전체 필진'],['강건','강건 변호사'],['전승환','전승환 변호사'],['채용현','채용현 변호사']].forEach(([id,name])=>{const b=document.createElement('button');b.type='button';b.className=author===id?'active':'';b.textContent=name;b.setAttribute('aria-pressed',String(author===id));b.onclick=()=>{author=id;render()};aFilter.append(b)})}
 const grid=$('#columnGrid');grid.replaceChildren();
 const rows=articles.filter(x=>isArticle(x)&&(filter==='all'||x.category===filter)&&(author==='all'||x.author===author)).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
 if(!rows.length){const p=document.createElement('p');p.className='ptg-column-empty';p.textContent='해당 분야의 칼럼이 없습니다.';grid.append(p);return}
 rows.forEach(x=>{
  const card=document.createElement('article');card.className='ptg-column-card';
  const copy=document.createElement('div');copy.className='ptg-column-card-copy';
  const meta=document.createElement('div');meta.className='ptg-column-card-meta';
  const series=document.createElement('span');series.textContent=x.series||'전문가 칼럼';
  const date=document.createElement('time');date.textContent=x.date||'';meta.append(series,date);
  const h=document.createElement('h2');const link=document.createElement('a');link.href=base+'/columns/?article='+encodeURIComponent(x.id);link.textContent=x.title;
  link.onclick=e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();showDetail(x.id)};h.append(link);
  const summary=document.createElement('p');summary.className='ptg-column-card-summary';summary.textContent=x.summary||x.kicker||'';
  const footer=document.createElement('div');footer.className='ptg-column-card-footer';footer.append(authorBox(x));
  copy.append(meta,h,summary,footer);
  const media=document.createElement('a');media.className='ptg-column-card-photo';media.href=link.href;media.setAttribute('aria-label',x.title);
  media.onclick=link.onclick;
  if(picture(x)){const img=document.createElement('img');img.src=picture(x);img.alt=x.author+' 변호사';img.loading='lazy';img.decoding='async';media.append(img)}else{media.classList.add('is-empty');media.textContent='PENTAGON'}
  card.append(copy,media);grid.append(card);
 });
}
$('#columnBack').onclick=showList;
async function start(){
 try{
  const snap=await getDocs(query(collection(db,'columns'),where('status','==','published')));
  const stored=snap.docs.map(d=>({id:d.id,...d.data()}));
  const seedsById=new Map(columnSeeds.map(x=>[x.id,x]));
  articles=[...stored.map(x=>{
   const seed=seedsById.get(x.id);
   if(!seed)return x;
   return {...seed,...x,image:x.image||seed.image,summary:(x.summary||'').length<(seed.summary||'').length?seed.summary:x.summary,body:(x.body||'').length<(seed.body||'').length?seed.body:x.body};
  }),...columnSeeds.filter(s=>!stored.some(x=>x.id===s.id||((x.url&&s.url&&x.url===s.url)||(x.title&&s.title&&x.title.replace(/\s/g,'')===s.title.replace(/\s/g,'')))))]
 }catch(e){console.warn('전문가 칼럼 조회 실패, 기본 콘텐츠를 사용합니다.',e)}
 const id=new URLSearchParams(location.search).get('article');if(id&&articles.some(x=>x.id===id&&isArticle(x)))showDetail(id,'none');else render();
}
window.addEventListener('popstate',()=>{const id=new URLSearchParams(location.search).get('article');if(id)showDetail(id,'none');else render()});
start();
