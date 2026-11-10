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
 const role=document.createElement('span');const authorRoles={'전승환':'파트너변호사 · 세무사','강건':'파트너변호사','채용현':'대표변호사 · 세무사 · 변리사'};role.textContent=authorRoles[x.author]||(x.source||'펜타곤 법률세무회계');
 words.append(name,role);wrap.append(words);return wrap;
}
function showList(){history.pushState(null,'',base+'/columns/');render();window.scrollTo({top:0,behavior:'instant'})}
function showDetail(id,historyMode='push'){
 const x=articles.find(x=>x.id===id&&isArticle(x));if(!x){showList();return}
 $('#columnHeading').hidden=true;$('#columnListing').hidden=true;$('#columnDetail').hidden=false;
 const box=$('#columnArticle');box.replaceChildren();
 const header=document.createElement('header');header.className='ptg-editorial-hero';
 const eyebrow=document.createElement('div');eyebrow.className='ptg-editorial-eyebrow';
 const series=document.createElement('span');series.textContent=x.series||'PENTAGON INSIGHTS';
 const category=document.createElement('span');category.textContent=names[x.category]||'전문가 칼럼';eyebrow.append(series,category);
 const h=document.createElement('h1');h.textContent=x.title;
 header.append(eyebrow,h);
 if(x.kicker){const lead=document.createElement('p');lead.className='ptg-editorial-deck';lead.textContent=x.kicker;header.append(lead)}
 const byline=document.createElement('div');byline.className='ptg-editorial-byline';byline.append(authorBox(x,true));
 const date=document.createElement('div');date.className='ptg-editorial-date';
 const dateText=document.createElement('time');dateText.textContent=x.date||'';if(x.date)dateText.dateTime=x.date;
 date.append(dateText);
 if(x.source){const publication=document.createElement('span');publication.textContent=x.source;date.append(publication)}
 byline.append(date);header.append(byline);box.append(header);
 const layout=document.createElement('div');layout.className='ptg-editorial-content';box.append(layout);
 if(x.summary){const summary=document.createElement('div');summary.className='ptg-editorial-lead';const small=document.createElement('span');small.textContent='핵심 내용';const p=document.createElement('p');p.textContent=x.summary;summary.append(small,p);layout.append(summary)}
 if(x.body){
  const content=document.createElement('section');content.className='ptg-column-prose';
  const parts=String(x.body).split(/\n\s*\n/).map(v=>v.trim()).filter(Boolean);
  parts.forEach((part,i)=>{const lines=part.split(/\n/);if(lines[0].startsWith('## ')){const heading=document.createElement('h2');heading.textContent=lines.shift().slice(3);content.append(heading);if(lines.join('').trim()){const p=document.createElement('p');p.textContent=lines.join('\n');content.append(p)}}else{const p=document.createElement('p');if(i===0)p.className='is-first';if(part.startsWith('※ '))p.className='ptg-editorial-reference';p.textContent=part;content.append(p)}});
  layout.append(content);
 }
 if(x.url&&/^https:\/\//i.test(x.url)){
  const source=document.createElement('div');source.className='ptg-editorial-source';
  const text=document.createElement('div');const small=document.createElement('span');small.textContent='ORIGINAL ARTICLE';const title=document.createElement('strong');title.textContent=(x.source||'언론사')+' 게재 원문';
  text.append(small,title);
  const link=document.createElement('a');link.href=x.url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='원문 보기 ↗';source.append(text,link);layout.append(source);
 }
 const authorCard=document.createElement('section');authorCard.className='ptg-editorial-author-card';
 const label=document.createElement('span');label.textContent='ABOUT THE AUTHOR';authorCard.append(label);
 const authorRow=document.createElement('div');authorRow.className='ptg-editorial-author-row';authorRow.append(authorBox(x,true));
 const slugs={'전승환':'jeonseunghwan','강건':'kanggeon','채용현':'chaeyonghyun'};
 if(slugs[x.author]){const profile=document.createElement('a');profile.href=base+'/professionals/'+slugs[x.author]+'/';profile.textContent='전문가 소개 보기 ↗';authorRow.append(profile)}
 authorCard.append(authorRow);layout.append(authorCard);
 const consult=document.createElement('aside');consult.className='ptg-editorial-consult';
 const consultTop=document.createElement('div');consultTop.className='ptg-editorial-consult-copy';
 const micro=document.createElement('span');micro.textContent='PENTAGON CONSULTATION';
 const consultTitle=document.createElement('h2');consultTitle.textContent='관련 법률·세무 문제를 상담해 보세요.';
 const consultCopy=document.createElement('p');consultCopy.textContent='상황에 따라 적용되는 법률과 대응 방법이 다를 수 있습니다. 현재 겪고 계신 문제를 남겨주시면 상담 절차를 안내해 드립니다.';
 consultTop.append(micro,consultTitle,consultCopy);
 const consultLink=document.createElement('a');consultLink.href=base+'/contact/?content=column&article='+encodeURIComponent(x.id);consultLink.textContent='상담 문의하기 ↗';
 consult.append(consultTop,consultLink);layout.append(consult);
 const similar=articles.filter(item=>isArticle(item)&&item.id!==x.id).sort((a,b)=>(Number(a.category===x.category)-Number(b.category===x.category))*-1||(b.date||'').localeCompare(a.date||'')).slice(0,3);
 if(similar.length){
  const more=document.createElement('section');more.className='ptg-editorial-related';
  const top=document.createElement('div');top.className='ptg-editorial-related-head';
  const title=document.createElement('h2');title.textContent='함께 읽어볼 칼럼';
  const all=document.createElement('button');all.type='button';all.textContent='전체 칼럼 보기 →';all.onclick=showList;top.append(title,all);more.append(top);
  for(const item of similar){const link=document.createElement('a');link.href=base+'/columns/?article='+encodeURIComponent(item.id);link.className='ptg-editorial-related-item';
   const col=document.createElement('div');const category=document.createElement('span');category.textContent=names[item.category]||'전문가 칼럼';const h=document.createElement('strong');h.textContent=item.title;
   const by=document.createElement('small');by.textContent=[item.author,item.date].filter(Boolean).join(' · ');col.append(category,h,by);link.append(col);
   const arrow=document.createElement('span');arrow.setAttribute('aria-hidden','true');arrow.textContent='↗';link.append(arrow);
   link.onclick=e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();showDetail(item.id)};more.append(link)}
  box.append(more);
 }
 if(historyMode==='push')history.pushState(null,'',base+'/columns/?article='+encodeURIComponent(x.id));
 document.title=x.title+' | 펜타곤 전문가 칼럼';window.scrollTo(0,0);requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo(0,0)));
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
  // Bundled columns are public published articles; Firestore is for new and edited posts.
  // A public Firestore get cannot test a missing document under published-only rules.
  // Do not accidentally hide bundled posts after a permission-denied read.
  articles=[...stored.map(x=>{
   const seed=seedsById.get(x.id);
   if(!seed)return x;
   const manuscriptIds=new Set(['taxnote-20261022-7days','taxnote-20260916-audit','taxnote-20261007-housing','taxnote-20260909-estate','migrated-news-import-003']);const original=manuscriptIds.has(x.id)&&x.editorUpdated!==true;return {...seed,...x,image:x.image||seed.image,summary:original?seed.summary:(x.summary||seed.summary),body:original?seed.body:(x.body||seed.body),kicker:original?seed.kicker:(x.kicker||seed.kicker)};
  }),...columnSeeds.filter(s=>!stored.some(x=>x.id===s.id||((x.url&&s.url&&x.url===s.url)||(x.title&&s.title&&x.title.replace(/\s/g,'')===s.title.replace(/\s/g,'')))))]
 }catch(e){console.warn('전문가 칼럼 조회 실패, 기본 콘텐츠를 사용합니다.',e)}
 const id=new URLSearchParams(location.search).get('article');if(id&&articles.some(x=>x.id===id&&isArticle(x)))showDetail(id,'none');else render();
}
window.addEventListener('popstate',()=>{const id=new URLSearchParams(location.search).get('article');if(id)showDetail(id,'none');else render()});
start();
