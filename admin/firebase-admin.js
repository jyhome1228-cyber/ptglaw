import {auth,db} from '../assets/js/firebase-client.js';
import {getStorage,ref as storageRef,uploadBytes,getDownloadURL} from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-storage.js';
import {onSnapshot} from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js';
import {signInWithEmailAndPassword,signOut,onAuthStateChanged,setPersistence,browserSessionPersistence} from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js';
import {doc,getDoc,collection,getDocs,query,setDoc,updateDoc,deleteField,deleteDoc,serverTimestamp} from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const state={view:'news',items:[],editing:null,authorized:false,inquiryFilter:null};
let stopInquiryWatch=null;
let imageUploading=false;
const msg=t=>{$('#status').textContent=t;};
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const categories={criminal:'형사',tax:'조세·세무',civil:'민사',family:'가사·상속',corporate:'기업',realestate:'부동산·건설',ip:'지식재산'};
const form=kind=>$('#'+kind+'Form');
function clearForm(kind){const f=form(kind);f.reset();if(kind==='news')f.elements.date.value=new Date().toLocaleDateString('sv-SE');state.editing=null;$('#'+kind+'FormTitle').textContent=kind==='news'?'뉴스 등록':'업무사례 등록';}
function setView(kind){state.view=kind;state.editing=null;$document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===kind));$('#newsSection').hidden=kind!=='news';$('#casesSection').hidden=kind!=='cases';$('#opsSection').hidden=kind==='news'||kind==='cases';$('#contentListPanel').hidden=kind!=='news'&&kind!=='cases';if(kind==='news'||kind==='cases'){$('#listTitle').textContent=kind==='news'?'데이터베이스 뉴스':'데이터베이스 업무사례';clearForm(kind);load()}else renderOps(kind)}
$document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
$document.querySelectorAll('[data-reset]').forEach(b=>b.addEventListener('click',()=>clearForm(b.dataset.reset)));
$('#reload').addEventListener('click',()=>load());
const emailInput=$('#loginForm input[name="email"]');
const rememberBox=$('#rememberAdminEmail');
const passwordInput=$('#adminPassword');
const togglePassword=$('#togglePassword');
const storedEmail=localStorage.getItem('ptgAdminRememberedEmail');
if(storedEmail){emailInput.value=storedEmail;rememberBox.checked=true;}
rememberBox.addEventListener('change',()=>{
 if(rememberBox.checked){const email=emailInput.value.trim();if(email)localStorage.setItem('ptgAdminRememberedEmail',email);}
 else localStorage.removeItem('ptgAdminRememberedEmail');
});
emailInput.addEventListener('input',()=>{if(rememberBox.checked)localStorage.setItem('ptgAdminRememberedEmail',emailInput.value.trim());});
togglePassword.addEventListener('click',()=>{
 const visible=passwordInput.type==='password';
 passwordInput.type=visible?'text':'password';
 togglePassword.setAttribute('aria-pressed',String(visible));
 togglePassword.setAttribute('aria-label',visible?'비밀번호 숨기기':'비밀번호 표시');
 $('#eyeOpen').hidden=visible;$('#eyeClosed').hidden=!visible;
});
$('#loginForm').addEventListener('submit',async e=>{e.preventDefault();msg('로그인 확인 중입니다.');const f=e.currentTarget;if(rememberBox.checked)localStorage.setItem('ptgAdminRememberedEmail',emailInput.value.trim());else localStorage.removeItem('ptgAdminRememberedEmail');try{await signInWithEmailAndPassword(auth,f.elements.email.value.trim(),f.elements.password.value);f.elements.password.value='';}catch(err){msg('로그인 실패: '+err.message)}});
$('#logout').addEventListener('click',()=>signOut(auth));
async function startAdminSession(){
 // Preserve the authenticated session across reloads, but not after the browser session ends.
 try{await setPersistence(auth,browserSessionPersistence);}catch(err){msg('로그인 세션 설정 실패: '+err.message);return;}
 onAuthStateChanged(auth,async user=>{
 if(stopInquiryWatch){stopInquiryWatch();stopInquiryWatch=null;}const existingOverlay=$('#ptgInquiryOverlay');if(existingOverlay)existingOverlay.hidden=true;state.authorized=false;$('#manager').hidden=true;$('#adminApp').hidden=true;$('#loginShell').hidden=false;document.body.classList.add('admin-login-mode');
 if(!user){$('#connection').textContent='로그인 필요';$('#authName').textContent='로그인 필요';$('#logout').hidden=true;return;}
 try{const adm=await getDoc(doc(db,'admins',user.uid));if(!adm.exists()||adm.data().role!=='admin')throw Error('관리자 권한이 등록되지 않은 계정입니다.');
 state.authorized=true;$('#connection').textContent='데이터베이스 연결됨';$('#authName').textContent=user.email;$('#logout').hidden=false;
 $('#loginShell').hidden=true;$('#adminApp').hidden=false;$('#manager').hidden=false;document.body.classList.remove('admin-login-mode');msg('');setView('dashboard');startInquiryWatch();
 }catch(err){$('#connection').textContent='관리자 권한 없음';$('#authName').textContent=user.email;$('#logout').hidden=false;msg(err.message);}
});
}
startAdminSession();
async function load(){
 if(!state.authorized||!['news','cases'].includes(state.view))return;
 $('#list').textContent='불러오는 중...';
 try{const snap=await getDocs(collection(db,state.view));state.items=snap.docs.map(d=>({id:d.id,...d.data()}));state.items.sort((a,b)=>String(b.date||b.createdAt?.seconds||'').localeCompare(String(a.date||a.createdAt?.seconds||'')));render();}
 catch(err){$('#list').textContent='조회 실패: '+err.message;msg('데이터베이스 접근 권한과 로그인 상태를 확인해주세요.');}
}
function kindLabel(item){if(state.view==='cases'){const raw=Array.isArray(item.categories)&&item.categories.length?item.categories:[item.category||item.meta1||''];return raw.map(x=>categories[x]||x).filter(Boolean).join(' · ')||'분야 미설정';}return item.date||item.source||'';}
function render(){
 const root=$('#list');root.innerHTML='';
 if(!state.items.length){root.textContent='데이터베이스에 등록된 글이 없습니다. 기존 게시물은 홈페이지에 유지됩니다.';return;}
 state.items.forEach(item=>{const row=document.createElement('div');row.className='cms-item';row.innerHTML='<div><strong>'+esc(item.title)+'</strong><small>'+esc(item.status==='published'?'공개':'임시저장')+' · '+esc(kindLabel(item))+'</small></div><div class="cms-item-actions"><button type="button" data-edit>수정</button><button type="button" data-toggle>'+(item.status==='published'?'비공개':'공개')+'</button><button type="button" data-delete>삭제</button></div>';row.querySelector('[data-edit]').onclick=()=>edit(item);row.querySelector('[data-toggle]').onclick=()=>updateStatus(item);row.querySelector('[data-delete]').onclick=()=>remove(item);root.appendChild(row)});
}
function edit(item){
 const kind=state.view;state.editing=item.id;const f=form(kind);
 for(const key of ['title','summary','date','source','category','url','image','status','overview','strategy','resultBody','result','point'])if(f.elements[key])f.elements[key].value=item[key]||'';
 if(kind==='news'&&item.date)f.elements.date.value=item.date.replace(/\./g,'-');
 if(kind==='news')updateNewsImagePreview();
 if(kind==='cases'){const storedCategory=item.category||item.categories?.[0]||Object.keys(categories).find(k=>categories[k]===item.meta1)||'corporate';f.elements.category.value=categories[storedCategory]?storedCategory:'corporate';f.elements.tags.value=(item.tags||[]).join(', ');$document.querySelectorAll('input[name="experts"]').forEach(i=>{i.checked=(item.experts||[]).includes(i.value)})}
 $('#'+kind+'FormTitle').textContent='게시물 수정';window.scrollTo({top:0,behavior:'smooth'});
}
async function updateStatus(item){try{await setDoc(doc(db,state.view,item.id),{status:item.status==='published'?'draft':'published',updatedAt:serverTimestamp()},{merge:true});msg('공개 상태 변경 완료');await load()}catch(err){msg('변경 실패: '+err.message)}}
async function remove(item){if(!confirm('이 게시물을 삭제할까요? 복구하려면 다시 등록해야 합니다.'))return;try{await deleteDoc(doc(db,state.view,item.id));clearForm(state.view);msg('삭제 완료');await load()}catch(err){msg('삭제 실패: '+err.message)}}

const imageField=$('#newsForm input[name="image"]');
const uploadInput=$('#newsImageFile');
const uploadStatus=$('#newsUploadStatus');
uploadInput?.addEventListener('change',async()=>{
 const file=uploadInput.files?.[0];if(!file)return;
 if(!state.authorized){uploadStatus.textContent='관리자 로그인 후 업로드할 수 있습니다.';return;}
 if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024){uploadStatus.textContent='JPG·PNG·WebP 형식의 5MB 이하 파일만 등록할 수 있습니다.';uploadInput.value='';return;}
 imageUploading=true;const submit=$('#newsForm button[type="submit"]');submit.disabled=true;uploadStatus.textContent='이미지를 업로드 중입니다...';
 try{
  const ext=({ 'image/jpeg':'jpg','image/png':'png','image/webp':'webp' })[file.type];
  const objectPath='news/'+Date.now()+'-'+crypto.randomUUID()+'.'+ext;
  const result=await uploadBytes(storageRef(getStorage(auth.app),objectPath),file,{contentType:file.type,cacheControl:'public,max-age=86400'});
  imageField.value=await getDownloadURL(result.ref);updateNewsImagePreview();
  uploadStatus.textContent='이미지 업로드 완료. 뉴스 저장하기를 눌러 게시해주세요.';
 }catch(err){uploadStatus.textContent='이미지 업로드 실패: '+(err.code||err.message)+' · Storage 활성화 및 규칙을 확인해주세요.';}
 finally{imageUploading=false;submit.disabled=false;uploadInput.value='';}
});
const imagePreview=$('#newsImagePreview');
const directImageUrl=value=>!value||/^https:\/\/[^\s<>"']+$/i.test(value);
function updateNewsImagePreview(){
 if(!imagePreview||!imageField)return;
 const value=imageField.value.trim();
 imagePreview.classList.remove('is-error');
 if(!value){imagePreview.textContent='등록된 이미지가 없습니다. 뉴스룸에는 기본 카드가 표시됩니다.';return;}
 if(!directImageUrl(value)){imagePreview.textContent='HTTPS 이미지 주소를 입력해주세요.';imagePreview.classList.add('is-error');return;}
 const img=document.createElement('img');img.alt='대표 이미지 미리보기';
 img.addEventListener('error',()=>{imagePreview.textContent='이미지를 불러오지 못했습니다. 주소 또는 외부 사이트의 이미지 차단 여부를 확인해주세요.';imagePreview.classList.add('is-error')});
 img.src=value;imagePreview.replaceChildren(img);
}
imageField?.addEventListener('change',updateNewsImagePreview);
imageField?.addEventListener('input',updateNewsImagePreview);

function getValues(f){return Object.fromEntries(new FormData(f).entries())}
for(const kind of ['news','cases'])form(kind).addEventListener('submit',async e=>{
 e.preventDefault();if(!state.authorized)return msg('관리자 권한이 필요합니다.');if(kind==='news'&&imageUploading)return msg('이미지 업로드가 완료된 후 저장해주세요.');
 const f=e.currentTarget,v=getValues(f);if(!v.title?.trim())return msg('제목을 입력해주세요.');
 if(kind==='news'&&!directImageUrl((v.image||'').trim()))return msg('대표 이미지에는 기사 주소가 아닌 JPG·PNG·WebP 등 실제 이미지 주소를 입력하세요. 이미지가 없으면 비워두세요.');
 const id=state.editing||kind.slice(0,-1)+'-'+Date.now().toString(36);
 const record=kind==='news'?{title:v.title.trim(),date:v.date.replace(/-/g,'.'),source:v.source||'',category:v.category||'firm',url:v.url||'',image:v.image||'',summary:v.summary||'',status:v.status||'draft'}:
 {title:v.title.trim(),summary:v.summary||'',category:v.category||'corporate',categories:[v.category||'corporate'],meta1:categories[v.category]||'업무사례',meta2:'',result:v.result||'',overview:v.overview||'',strategy:v.strategy||'',resultBody:v.resultBody||'',point:v.point||'',tags:(v.tags||'').split(',').map(x=>x.trim()).filter(Boolean),experts:$$('input[name="experts"]:checked').map(x=>x.value),status:v.status||'draft'};
 try{const old=state.items.find(i=>i.id===id);await setDoc(doc(db,kind,id),{...record,createdAt:old?.createdAt||serverTimestamp(),updatedAt:serverTimestamp()},{merge:true});clearForm(kind);msg('데이터베이스 저장 완료 · 공개 설정에 따라 홈페이지에 반영됩니다.');await load();}
 catch(err){msg('저장 실패: '+err.message)}
});

const operationalPages=[
 ['메인','/index.html'],['펜타곤 소개','/about/'],['업무 분야','/services/'],['뉴스룸','/newsroom/'],['업무사례','/cases/'],['상속 서비스','/inheritance/'],['법인설립센터','/center/'],['문의하기','/contact/']
];
const calcPages=[['3.3% 원천징수','/tools/withholding/'],['부가가치세','/tools/vat/'],['법인등기 비용','/fees/'],['퇴직금','/tools/severance/'],['양도·증여·상속세','/tools/asset-tax/']];
const base=location.hostname.endsWith('github.io')?'/ptglaw':'';
const siteUrl=p=>base+p;
function panel(title,body){return '<div class="panel"><h2>'+title+'</h2>'+body+'</div>'}
async function setupVisitorPeriods(selector,target){
 const wrap=$(selector),area=$(target);if(!wrap||!area)return;
 const labels={day:'오늘',week:'최근 7일',month:'최근 20일',all:'전체 기간'};
 let period='day',visits=[],ready=false,unsubscribe=null;
 const update=()=>{
   if(!wrap.isConnected||!area.isConnected){if(unsubscribe)unsubscribe();return;}
   const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
   const values=Object.fromEntries(parts.map(x=>[x.type,x.value]));
   const today=Date.UTC(Number(values.year),Number(values.month)-1,Number(values.day));
   const dayCount=period==='week'?7:period==='month'?20:period==='all'?30:1;
   const cutoff=period==='all'?0:today-(dayCount-1)*86400000;
   const selected=visits.filter(x=>/^\d{4}-\d{2}-\d{2}$/.test(x.date||'')&&Date.parse(x.date+'T00:00:00Z')>=cutoff);
   const unique=new Set(selected.map(x=>x.date+':'+x.visitorId)).size;
   const buckets=[];
   const hourFormatter=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Seoul',hour:'2-digit',hourCycle:'h23'});
   if(period==='day'){
     for(let hour=0;hour<24;hour++)buckets.push({key:String(hour),label:String(hour).padStart(2,'0')+'시',value:0});
     selected.forEach(x=>{
       const timestamp=x.createdAt?.toDate?.();
       if(!timestamp)return;
       const hour=Number(hourFormatter.format(timestamp));
       if(hour>=0&&hour<24)buckets[hour].value++;
     });
   }else{
     for(let offset=dayCount-1;offset>=0;offset--){
       const dt=new Date(today-offset*86400000);
       const key=dt.toISOString().slice(0,10);
       buckets.push({key,label:(dt.getUTCMonth()+1)+'/'+dt.getUTCDate(),value:0});
     }
     const byDate=new Map(buckets.map(x=>[x.key,x]));
     selected.forEach(x=>{const bucket=byDate.get(x.date);if(bucket)bucket.value++});
   }
   const max=Math.max(1,...buckets.map(x=>x.value));
   const chart='<section class="ptg-visit-chart" aria-label="'+(period==='day'?'오늘 시간별 방문 기록':period==='week'?'최근 7일 방문 추이':period==='month'?'최근 20일 방문 추이':'최근 30일 방문 추이')+'">'+
     '<div class="ptg-visit-chart-head"><strong>'+(period==='day'?'시간별 방문 기록':period==='week'?'최근 7일 방문 추이':period==='month'?'최근 20일 방문 추이':'최근 30일 방문 추이')+'</strong><span>한국시간 · 브라우저별 하루 1회</span></div>'+
     '<div class="ptg-visit-chart-bars '+(period==='day'?'is-hourly':'')+'" role="img" aria-label="방문 추이 막대그래프">'+buckets.map((x,i)=>
       '<div class="ptg-visit-chart-slot" title="'+esc(x.label+': '+x.value+'명')+'"><span class="ptg-visit-chart-value">'+(x.value?x.value:'')+'</span><span class="ptg-visit-chart-track"><span class="ptg-visit-chart-bar" style="height:'+(x.value?Math.max(5,Math.round(x.value/max*100)):0)+'%"></span></span><span class="ptg-visit-chart-label">'+((period==='day'&&i%3!==0)?'':esc(x.label))+'</span></div>').join('')+'</div></section>';
   area.innerHTML='<div class="ops-visitor-cards"><div><small>'+labels[period]+' 방문자</small><strong>'+unique.toLocaleString()+'</strong><span>브라우저별 하루 1회</span></div><div><small>방문 기록</small><strong>'+selected.length.toLocaleString()+'</strong><span>하루 기준 등록 건수</span></div><div><small>일평균 방문</small><strong>'+(selected.length/(period==='day'?1:period==='week'?7:period==='month'?20:period==='all'?30:1)).toFixed(1)+'</strong><span>선택 기간 기준</span></div></div>'+chart;
 };
 wrap.querySelectorAll('[data-period]').forEach(button=>button.addEventListener('click',()=>{
   period=button.dataset.period;
   wrap.querySelectorAll('[data-period]').forEach(item=>{item.classList.toggle('active',item.dataset.period===period);item.setAttribute('aria-pressed',String(item.dataset.period===period))});
   if(ready)update();
 }));
 wrap.querySelector('[data-period="day"]')?.classList.add('active');
 area.innerHTML='<p class="muted">실시간 방문 기록을 연결하는 중입니다.</p>';
 unsubscribe=onSnapshot(collection(db,'visits'),snapshot=>{
   visits=snapshot.docs.map(doc=>doc.data());ready=true;update();
 },err=>{area.innerHTML='<p class="muted">실시간 방문 기록 연결 실패: '+esc(err.code||err.message)+'. Firestore Rules의 visits 읽기 권한과 저장 데이터를 확인해주세요.</p>'});
 const observer=new MutationObserver(()=>{if(!wrap.isConnected){unsubscribe?.();observer.disconnect()}});
 observer.observe(document.querySelector('#opsSection')||document.body,{childList:true,subtree:true});
}
async function renderOps(kind){
 const root=$('#opsSection');root.hidden=false;
 if(!state.authorized)return;
 if(kind==='dashboard'){
  root.innerHTML=panel('방문자 현황','<div class="ops-periods" id="dashboardPeriods"><button type="button" data-period="day">일일</button><button type="button" data-period="week">주간</button><button type="button" data-period="month">월간</button><button type="button" data-period="all">전체</button></div><div class="ops-visitor-summary" id="dashboardVisitors"></div>')+
    panel('문의 및 콘텐츠 현황','<div id="opSummary">현황을 불러오는 중...</div><div class="ops-dashboard-links"><button type="button" id="goInquiries">문의 관리 열기 →</button><button type="button" id="goVisitors">방문자 상세 보기 →</button></div>');
  setupVisitorPeriods('#dashboardPeriods','#dashboardVisitors');
  $('#goInquiries').onclick=()=>setView('inquiries');
  $('#goVisitors').onclick=()=>setView('visitors');
  try{
    const [news,cases,inquiries]=await Promise.all(['news','cases','inquiries'].map(k=>getDocs(collection(db,k))));
    if(state.view!=='dashboard')return;
    const all=inquiries.docs.map(d=>({id:d.id,...d.data()}));
    const active=all.filter(d=>d.status!=='trashed');
    const quick=active.filter(d=>d.type==='quick'),general=active.filter(d=>d.type!=='quick');
    const pending=active.filter(d=>d.status==='new');
    const quickNew=quick.filter(d=>d.status==='new').length,generalNew=general.filter(d=>d.status==='new').length;
    const statCard=(label,total,sub,icon,kind)=>'<button type="button" class="ptg-overview-card '+(kind?'is-action':'is-static')+'" '+(kind?'data-open-inquiry="'+kind+'"':'disabled')+'><span class="ptg-overview-card-top"><span class="ptg-overview-label">'+label+'</span><span class="ptg-overview-icon" aria-hidden="true">'+icon+'</span></span><strong>'+total+'</strong><span class="ptg-overview-bottom">'+sub+(kind?'<span class="ptg-overview-arrow" aria-hidden="true">→</span>':'')+'</span></button>';
    $('#opSummary').innerHTML='<div class="ptg-overview-head"><p>접수된 문의와 등록 콘텐츠를 확인할 수 있습니다.</p>'+(pending.length?'<span class="ptg-overview-alert"><span class="ptg-alert-dot"></span> 미확인 문의 '+pending.length+'건</span>':'<span class="ptg-overview-clear">모든 문의를 확인했습니다</span>')+'</div>'+
    '<div class="ptg-overview-grid">'+
    statCard('빠른 문의',quick.length,quickNew?'미확인 '+quickNew+'건':'모두 확인됨','✉','quick')+
    statCard('일반 문의',general.length,generalNew?'미확인 '+generalNew+'건':'모두 확인됨','▤','general')+
    statCard('뉴스',news.size,'등록된 소식','▧',null)+
    statCard('업무사례',cases.size,'등록된 사례','◫',null)+
    '</div>';
    document.querySelectorAll('#opSummary [data-open-inquiry]').forEach(button=>button.onclick=()=>{state.inquiryFilter=button.dataset.openInquiry;setView('inquiries')});
  }catch(e){if($('#opSummary'))$('#opSummary').textContent='현황 조회 실패: '+e.message}
 }else if(kind==='visitors'){
  root.innerHTML=panel('방문자 현황','<div class="ops-periods" id="visitorPeriods"><button data-period="day">일일</button><button data-period="week">7일</button><button data-period="month">30일</button><button data-period="all">전체</button></div><div class="ops-visitor-summary" id="visitorSummary"></div><p class="muted">방문자 수는 동일 브라우저의 세션별로 집계합니다. 실제 개인의 고유 인원 수와 차이가 있을 수 있습니다.</p>');
  setupVisitorPeriods('#visitorPeriods','#visitorSummary');
 }else if(kind==='seo'){
  root.innerHTML=panel('SEO · 메타정보 점검','<p class="muted">각 공개 페이지 HTML에 설정된 제목·설명·키워드를 확인합니다. 검색엔진의 실제 노출 순위나 색인 상태를 의미하지 않습니다.</p><div id="seoStatus">메타정보 검사 중...</div>');
  const result=await Promise.all(operationalPages.map(async ([name,path])=>{try{const res=await fetch(siteUrl(path),{cache:'no-store'});if(!res.ok)throw Error('HTTP '+res.status);const html=await res.text(),doc=new DOMParser().parseFromString(html,'text/html');return {name,path,title:doc.title,description:doc.querySelector('meta[name="description"]')?.content||'',keywords:doc.querySelector('meta[name="keywords"]')?.content||''}}catch(e){return {name,path,error:e.message}}}));
  $('#seoStatus').innerHTML=result.map(x=>'<div class="ops-row"><strong>'+esc(x.name)+'</strong><span>'+esc(x.error||x.title||'제목 미설정')+'</span><small>'+esc(x.error||('설명 '+(x.description?'설정':'없음')+' · 키워드 '+(x.keywords?'설정':'없음')))+'</small><a href="'+siteUrl(x.path)+'" target="_blank" rel="noopener">페이지 열기 ↗</a></div>').join('');
 }else if(kind==='calculators'){
  root.innerHTML=panel('계산기 운영 현황','<p class="muted">현재 등록된 계산기 5종의 이동 링크입니다. 계산 횟수는 분석 이벤트 수집·보고가 연결되지 않아 표시하지 않습니다.</p>'+calcPages.map(([name,path])=>'<div class="ops-row"><strong>'+name+'</strong><a href="'+siteUrl(path)+'" target="_blank" rel="noopener">계산기 열기 ↗</a><small>운영 페이지</small></div>').join(''));
 }else if(kind==='inquiries'){
  root.innerHTML=panel('문의 관리',
    '<div class="inquiry-intro"><div><p class="muted">문의하기 페이지와 빠른 문의가 같은 데이터베이스로 들어옵니다. 최신 접수순으로 확인하고 바로 전화·이메일 응대를 할 수 있습니다.</p><small>온라인 접수 실패 후 이메일로만 전달된 문의는 이 목록에 자동 기록되지 않습니다.</small></div><button type="button" id="reloadInquiries">새로고침</button></div>'+
    '<div class="ptg-trash-tabs"><button type="button" class="active" data-trash-view="active">받은 문의</button><button type="button" data-trash-view="trash">휴지통</button></div><div id="inquiryOverview" class="inquiry-overview"></div>'+
    '<div class="inquiry-toolbar"><label class="inquiry-search"><span>문의 검색</span><input id="inquirySearch" type="search" placeholder="이름, 연락처, 이메일, 문의내용 검색"></label>'+
    '<div><span class="inquiry-toolbar-label">유형</span><div class="ops-filters"><button data-inquiry-kind="all">전체</button><button data-inquiry-kind="quick">빠른 문의</button><button data-inquiry-kind="general">문의하기</button></div></div>'+
    '<div><span class="inquiry-toolbar-label">상태</span><div class="ops-filters"><button data-inquiry-status="all">전체</button><button data-inquiry-status="new">미확인</button><button data-inquiry-status="reviewed">확인 완료</button></div></div></div>'+
    '<div id="inquiryList" class="inquiry-list">문의 조회 중...</div>');
  let docs=[];
  try{
    const snap=await getDocs(collection(db,'inquiries'));
    docs=snap.docs.map(d=>({id:d.id,...d.data()}));
    docs.sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
  }catch(e){$('#inquiryList').textContent='문의 조회 실패: '+e.message;return}

  const filter={type:state.inquiryFilter||'all',status:'all',term:'',trash:'active'};
  state.inquiryFilter=null;
  const normalize=v=>String(v||'').toLowerCase().replace(/\\s+/g,'');
  const phoneHref=v=>'tel:'+String(v||'').replace(/[^0-9+]/g,'');
  const categoryLabel=x=>x.category||((x.type==='quick')?'빠른 문의':'일반 상담');

  function overview(){
    const visible=docs.filter(x=>x.status!=='trashed');
    const total=visible.length;
    const fresh=visible.filter(x=>x.status==='new').length;
    const quick=visible.filter(x=>x.type==='quick').length;
    const general=visible.filter(x=>x.type!=='quick').length;
    $('#inquiryOverview').innerHTML=
      '<div><small>전체 문의</small><strong>'+total+'</strong><span>누적 접수</span></div>'+
      '<div class="is-alert"><small>미확인</small><strong>'+fresh+'</strong><span>확인 필요</span></div>'+
      '<div><small>빠른 문의</small><strong>'+quick+'</strong><span>간편 문의</span></div>'+
      '<div><small>문의하기</small><strong>'+general+'</strong><span>상세 문의·견적</span></div>';
  }

  function syncFilters(){
    root.querySelectorAll('[data-trash-view]').forEach(b=>b.classList.toggle('active',b.dataset.trashView===filter.trash));
    root.querySelectorAll('[data-inquiry-kind]').forEach(b=>b.classList.toggle('active',b.dataset.inquiryKind===filter.type));
    root.querySelectorAll('[data-inquiry-status]').forEach(b=>b.classList.toggle('active',b.dataset.inquiryStatus===filter.status));
  }

  function draw(){
    const term=normalize(filter.term);
    const items=docs.filter(x=>{
      if((x.status==='trashed')!==(filter.trash==='trash'))return false;
      if(filter.trash==='trash')return !term||normalize([x.name,x.phone,x.email,x.message].join(' ')).includes(term);
      if(filter.type!=='all'&&x.type!==filter.type)return false;
      if(filter.status!=='all'&&x.status!==filter.status)return false;
      if(!term)return true;
      return normalize([x.name,x.phone,x.email,x.message,x.category,x.details].join(' ')).includes(term);
    });
    const list=$('#inquiryList');
    if(!items.length){
      list.innerHTML='<div class="inquiry-empty"><strong>조건에 맞는 문의가 없습니다.</strong><p>필터를 바꾸거나 검색어를 지워주세요.</p></div>';
      syncFilters();
      return;
    }
    list.innerHTML=items.map(x=>{
      const date=x.createdAt?.toDate?.()?.toLocaleString('ko-KR')||'접수일 확인 중';
      const inTrash=x.status==='trashed';
      const pending=x.status==='new';
      const typeLabel=x.type==='quick'?'빠른 문의':'문의하기';
      const name=x.name||'이름 미입력';
      const phone=x.phone||'';
      const email=x.email||'';
      const detailText=String(x.details||'').trim();
      const formattedDetails=detailText
        .replace(/\\n/g,'\n')
        .replace(/\s+(?=(?:문의 유형|이름|연락처|이메일|회사|문의 분야|주요 기한|등기 종류|신청자 구분|관련 금액|부동산 소재지|상세주소|문의 내용|관련 파일|예상 비용)\s*[:：])/g,'\n')
        .split('\n').map(line=>line.trim()).filter(Boolean)
        .map(line=>{const match=line.match(/^([^:：]{1,24})[:：]\s*(.*)$/);return match?'<div class="ptg-detail-row"><dt>'+esc(match[1])+'</dt><dd>'+esc(match[2])+'</dd></div>':'<p class="ptg-detail-extra">'+esc(line)+'</p>';}).join('');
      const details=detailText?'<details class="inquiry-details"><summary>추가 접수 정보 펼쳐보기</summary><div class="ptg-detail-content">'+formattedDetails+'</div></details>':'';
      const phoneAction=phone?'<a class="inquiry-action" href="'+esc(phoneHref(phone))+'">전화하기</a>':'';
      const mailAction=email?'<a class="inquiry-action" href="mailto:'+esc(email)+'">이메일 보내기</a>':'';
      const category=categoryLabel(x);
      const showCategory=category&&category!==typeLabel&&category!=='빠른 문의'&&category!=='일반 상담';
      return '<article class="inquiry-card '+(pending?'is-new':'is-reviewed')+'">'+
        '<div class="inquiry-card-head"><div class="inquiry-badges"><span class="inquiry-badge '+(pending?'is-status-new':'is-status-reviewed')+'">'+(pending?'미확인':'확인 완료')+'</span><span class="ptg-inquiry-type">'+esc(typeLabel)+'</span>'+(showCategory?'<span class="ptg-inquiry-separator">·</span><span class="ptg-inquiry-type">'+esc(category)+'</span>':'')+'</div><time>'+esc(date)+'</time></div>'+
        '<div class="inquiry-card-body"><div class="ptg-contact-block"><div class="ptg-contact-heading"><strong>'+esc(name)+'</strong><span>님의 문의</span></div><div class="ptg-contact-info">'+(phone?'<span>전화 <b>'+esc(phone)+'</b></span>':'')+(email?'<span>이메일 <b>'+esc(email)+'</b></span>':'')+'</div></div>'+
        '<div class="ptg-message-block"><div class="ptg-section-label">문의 내용</div><p>'+esc(x.message||'문의 내용 없음').replace(/\\n/g,'<br>')+'</p></div>'+details+'</div>'+
        '<div class="inquiry-card-actions"><div class="ptg-response-actions">'+(inTrash?'':phoneAction+mailAction)+'</div>'+
        (inTrash?'<div class="ptg-trash-actions"><button type="button" class="inquiry-action" data-restore-id="'+esc(x.id)+'">복원</button><button type="button" class="inquiry-action ptg-danger-action" data-erase-id="'+esc(x.id)+'">영구 삭제</button></div>':'<div class="ptg-trash-actions"><button type="button" class="inquiry-action" data-trash-id="'+esc(x.id)+'">휴지통으로 이동</button><button type="button" class="inquiry-action '+(pending?'is-primary':'')+'" data-status-id="'+esc(x.id)+'" data-next-status="'+(pending?'reviewed':'new')+'">'+(pending?'확인 완료 처리':'미확인으로 되돌리기')+'</button></div>')+'</div>'+
        '</article>';
    }).join('');
    syncFilters();
    document.querySelectorAll('[data-trash-id]').forEach(button=>button.onclick=async()=>{
      const id=button.dataset.trashId,entry=docs.find(x=>x.id===id);
      if(!entry||!confirm('이 문의를 휴지통으로 이동시키겠습니까?\n휴지통에서 다시 복원할 수 있습니다.'))return;
      button.disabled=true;
      try{
        await updateDoc(doc(db,'inquiries',id),{status:'trashed',previousStatus:entry.status,deletedAt:serverTimestamp(),updatedAt:serverTimestamp()});
        entry.previousStatus=entry.status;entry.status='trashed';overview();draw();msg('휴지통으로 이동했습니다.');
      }catch(e){button.disabled=false;msg('휴지통 이동 실패: '+e.message)}
    });
    document.querySelectorAll('[data-restore-id]').forEach(button=>button.onclick=async()=>{
      const id=button.dataset.restoreId,entry=docs.find(x=>x.id===id);if(!entry||!confirm('이 문의를 복원시키겠습니까?'))return;
      button.disabled=true;
      try{
        await updateDoc(doc(db,'inquiries',id),{status:entry.previousStatus==='reviewed'?'reviewed':'new',previousStatus:deleteField(),deletedAt:deleteField(),updatedAt:serverTimestamp()});
        entry.status=entry.previousStatus==='reviewed'?'reviewed':'new';delete entry.previousStatus;delete entry.deletedAt;
        overview();draw();msg('문의가 복원되었습니다.');
      }catch(e){button.disabled=false;msg('복원 실패: '+e.message)}
    });
    document.querySelectorAll('[data-erase-id]').forEach(button=>button.onclick=async()=>{
      const id=button.dataset.eraseId;
      if(!confirm('영구 삭제하면 복원할 수 없습니다. 이 문의를 완전히 삭제할까요?'))return;
      button.disabled=true;
      try{await deleteDoc(doc(db,'inquiries',id));docs=docs.filter(x=>x.id!==id);overview();draw();msg('문의가 영구 삭제되었습니다.')}
      catch(e){button.disabled=false;msg('영구 삭제 실패: '+e.message)}
    });
    document.querySelectorAll('[data-status-id]').forEach(button=>button.onclick=async()=>{
      button.disabled=true;
      const next=button.dataset.nextStatus;
      try{
        await setDoc(doc(db,'inquiries',button.dataset.statusId),{status:next,updatedAt:serverTimestamp()},{merge:true});
        const item=docs.find(x=>x.id===button.dataset.statusId);
        if(item)item.status=next;
        overview();
        draw();
        msg(next==='reviewed'?'문의 확인 처리 완료':'미확인 상태로 변경 완료');
      }catch(e){button.disabled=false;msg('처리 실패: '+e.message)}
    });
  }

  overview();
  root.querySelectorAll('[data-trash-view]').forEach(b=>b.onclick=()=>{filter.trash=b.dataset.trashView;filter.type='all';filter.status='all';draw()});
  $('#inquirySearch').addEventListener('input',e=>{filter.term=e.target.value;draw()});
  root.querySelectorAll('[data-inquiry-kind]').forEach(b=>b.onclick=()=>{filter.type=b.dataset.inquiryKind;draw()});
  root.querySelectorAll('[data-inquiry-status]').forEach(b=>b.onclick=()=>{filter.status=b.dataset.inquiryStatus;draw()});
  $('#reloadInquiries').onclick=()=>renderOps('inquiries');
  draw();
 }
}
clearForm('news');

function startInquiryWatch(){
 if(stopInquiryWatch)stopInquiryWatch();
 const nav=$('[data-view="inquiries"]');
 let badge=nav.querySelector('.ptg-inquiry-count');
 if(!badge){badge=document.createElement('span');badge.className='ptg-inquiry-count';badge.hidden=true;nav.appendChild(badge);}
 let overlay=$('#ptgInquiryOverlay');
 if(!overlay){
  const style=document.createElement('style');
  style.textContent=`
   .ptg-inquiry-overlay[hidden]{display:none!important}
   .ptg-inquiry-overlay{position:fixed;inset:0;z-index:12000;background:rgba(17,20,25,.62);display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;backdrop-filter:blur(3px)}
   .ptg-inquiry-modal{width:min(440px,100%);box-sizing:border-box;background:#fff;border-radius:20px;padding:34px;box-shadow:0 26px 84px rgba(0,0,0,.24);text-align:center;color:#222}
   .ptg-inquiry-modal-icon{width:56px;height:56px;border-radius:17px;background:#fff2e8;color:#e87820;display:grid;place-items:center;margin:0 auto 19px}
   .ptg-inquiry-modal h2{font-size:22px;line-height:1.4;margin:0 0 10px;color:#1e1e1e}
   .ptg-inquiry-modal p{font-size:15px;line-height:1.7;color:#656565;margin:0 0 26px;word-break:keep-all}
   .ptg-inquiry-modal-actions{display:flex;gap:10px}
   .ptg-inquiry-modal-actions button{border:1px solid #e3e3e3;border-radius:11px;min-height:47px;cursor:pointer;font-size:14px;font-weight:600;padding:12px 14px;background:#fff;color:#333;flex:1}
   .ptg-inquiry-modal-actions button[data-open]{background:#e97920;color:#fff;border-color:#e97920;flex:1.6}
   @media(max-width:480px){.ptg-inquiry-modal{padding:26px 20px}.ptg-inquiry-modal h2{font-size:20px}.ptg-inquiry-overlay{padding:16px}}
  `;
  document.head.appendChild(style);
  overlay=document.createElement('div');overlay.id='ptgInquiryOverlay';overlay.className='ptg-inquiry-overlay';overlay.hidden=true;
  overlay.innerHTML='<div class="ptg-inquiry-modal" role="alertdialog" aria-modal="true" aria-labelledby="ptgInquiryTitle" aria-describedby="ptgInquiryDescription"><div class="ptg-inquiry-modal-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 12.5 3 8.5 8.5 0 0 1 21 11.5Z"/></svg></div><h2 id="ptgInquiryTitle">새로운 문의가 도착했어요!</h2><p id="ptgInquiryDescription">고객님이 새로운 상담 문의를 남겼습니다.</p><div class="ptg-inquiry-modal-actions"><button type="button" data-dismiss>나중에 확인</button><button type="button" data-open>문의 확인하러 가기 →</button></div></div>';
  document.body.appendChild(overlay);
  overlay.querySelector('[data-dismiss]').addEventListener('click',()=>{overlay.hidden=true;});
  overlay.querySelector('[data-open]').addEventListener('click',()=>{overlay.hidden=true;state.inquiryFilter=null;setView('inquiries');});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden){overlay.hidden=true;}});
 }
 overlay.hidden=true;
 let initialized=false,known=new Set();
 stopInquiryWatch=onSnapshot(collection(db,'inquiries'),snapshot=>{
  if(!state.authorized)return;
  const fresh=snapshot.docs.filter(x=>x.data().status==='new');
  badge.textContent=String(fresh.length);badge.hidden=fresh.length===0;
  const ids=new Set(snapshot.docs.map(x=>x.id));
  const arriving=initialized?snapshot.docs.filter(x=>!known.has(x.id)&&x.data().status==='new'):[];
  const needsNotice=!initialized?fresh:arriving;
  if(needsNotice.length){
    const count=needsNotice.length;
    const first=needsNotice[0].data();
    const kind=first.type==='quick'?'빠른 문의':'일반 문의';
    overlay.querySelector('#ptgInquiryDescription').textContent=count===1
      ?(first.name?first.name+'님의 '+kind+'가 접수되었습니다. 확인 후 응대해 주세요.':'새로운 '+kind+'가 접수되었습니다. 확인 후 응대해 주세요.')
      :(initialized?'새로운 문의 ':'미확인 문의 ')+count+'건이 있습니다. 문의 관리에서 확인해 주세요.';
    overlay.hidden=false;
    overlay.querySelector('[data-open]').focus();
   if(arriving.length&&(state.view==='inquiries'||state.view==='dashboard'))renderOps(state.view);
  }
  known=ids;initialized=true;
  if(!fresh.length)overlay.hidden=true;
 },err=>{console.warn('문의 실시간 연결 실패',err);msg('실시간 문의 알림 연결 실패: '+(err.code||err.message));});
}
