import {auth,db} from '../assets/js/firebase-client.js';
import {signInWithEmailAndPassword,signOut,onAuthStateChanged,setPersistence,inMemoryPersistence} from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js';
import {doc,getDoc,collection,getDocs,query,setDoc,deleteDoc,serverTimestamp} from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const state={view:'news',items:[],editing:null,authorized:false};
const msg=t=>{$('#status').textContent=t;};
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const categories={criminal:'형사',tax:'조세·세무',civil:'민사',family:'가사·상속',corporate:'기업',realestate:'부동산·건설',ip:'지식재산'};
const form=kind=>$('#'+kind+'Form');
function clearForm(kind){const f=form(kind);f.reset();if(kind==='news')f.elements.date.value=new Date().toLocaleDateString('sv-SE');state.editing=null;$('#'+kind+'FormTitle').textContent=kind==='news'?'뉴스 등록':'업무사례 등록';}
function setView(kind){state.view=kind;state.editing=null;$$('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===kind));$('#newsSection').hidden=kind!=='news';$('#casesSection').hidden=kind!=='cases';$('#opsSection').hidden=kind==='news'||kind==='cases';$('#contentListPanel').hidden=kind!=='news'&&kind!=='cases';if(kind==='news'||kind==='cases'){$('#listTitle').textContent=kind==='news'?'데이터베이스 뉴스':'데이터베이스 업무사례';clearForm(kind);load()}else renderOps(kind)}
$$('[data-view]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
$$('[data-reset]').forEach(b=>b.addEventListener('click',()=>clearForm(b.dataset.reset)));
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
 // Each new admin page entry requires explicit sign-in; no restored credentials.
 try{await signOut(auth);await setPersistence(auth,inMemoryPersistence);}catch(err){msg('로그인 초기화 실패: '+err.message);return;}
 onAuthStateChanged(auth,async user=>{
 state.authorized=false;$('#manager').hidden=true;$('#adminApp').hidden=true;$('#loginShell').hidden=false;document.body.classList.add('admin-login-mode');
 if(!user){$('#connection').textContent='로그인 필요';$('#authName').textContent='로그인 필요';$('#logout').hidden=true;return;}
 try{const adm=await getDoc(doc(db,'admins',user.uid));if(!adm.exists()||adm.data().role!=='admin')throw Error('관리자 권한이 등록되지 않은 계정입니다.');
 state.authorized=true;$('#connection').textContent='데이터베이스 연결됨';$('#authName').textContent=user.email;$('#logout').hidden=false;
 $('#loginShell').hidden=true;$('#adminApp').hidden=false;$('#manager').hidden=false;document.body.classList.remove('admin-login-mode');msg('');setView('dashboard');
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
function render(){
 const root=$('#list');root.innerHTML='';
 if(!state.items.length){root.textContent='데이터베이스에 등록된 글이 없습니다. 기존 게시물은 홈페이지에 유지됩니다.';return;}
 state.items.forEach(item=>{const row=document.createElement('div');row.className='cms-item';row.innerHTML='<div><strong>'+esc(item.title)+'</strong><small>'+esc(item.status==='published'?'공개':'임시저장')+' · '+esc(item.date||item.source||item.meta1||'')+'</small></div><div class="cms-item-actions"><button type="button" data-edit>수정</button><button type="button" data-toggle>'+(item.status==='published'?'비공개':'공개')+'</button><button type="button" data-delete>삭제</button></div>';row.querySelector('[data-edit]').onclick=()=>edit(item);row.querySelector('[data-toggle]').onclick=()=>updateStatus(item);row.querySelector('[data-delete]').onclick=()=>remove(item);root.appendChild(row)});
}
function edit(item){
 const kind=state.view;state.editing=item.id;const f=form(kind);
 for(const key of ['title','summary','date','source','category','url','image','status','overview','strategy','resultBody','result','point'])if(f.elements[key])f.elements[key].value=item[key]||'';
 if(kind==='news'&&item.date)f.elements.date.value=item.date.replace(/\./g,'-');
 if(kind==='cases'){f.elements.tags.value=(item.tags||[]).join(', ');$$('input[name="experts"]').forEach(i=>{i.checked=(item.experts||[]).includes(i.value)})}
 $('#'+kind+'FormTitle').textContent='게시물 수정';window.scrollTo({top:0,behavior:'smooth'});
}
async function updateStatus(item){try{await setDoc(doc(db,state.view,item.id),{status:item.status==='published'?'draft':'published',updatedAt:serverTimestamp()},{merge:true});msg('공개 상태 변경 완료');await load()}catch(err){msg('변경 실패: '+err.message)}}
async function remove(item){if(!confirm('이 게시물을 삭제할까요? 복구하려면 다시 등록해야 합니다.'))return;try{await deleteDoc(doc(db,state.view,item.id));clearForm(state.view);msg('삭제 완료');await load()}catch(err){msg('삭제 실패: '+err.message)}}
function getValues(f){return Object.fromEntries(new FormData(f).entries())}
for(const kind of ['news','cases'])form(kind).addEventListener('submit',async e=>{
 e.preventDefault();if(!state.authorized)return msg('관리자 권한이 필요합니다.');
 const f=e.currentTarget,v=getValues(f);if(!v.title?.trim())return msg('제목을 입력해주세요.');
 const id=state.editing||kind.slice(0,-1)+'-'+Date.now().toString(36);
 const record=kind==='news'?{title:v.title.trim(),date:v.date.replace(/-/g,'.'),source:v.source||'',category:v.category||'firm',url:v.url||'',image:v.image||'',summary:v.summary||'',status:v.status||'draft'}:
 {title:v.title.trim(),summary:v.summary||'',categories:[v.category||'corporate'],meta1:categories[v.category]||'업무사례',meta2:'',result:v.result||'',overview:v.overview||'',strategy:v.strategy||'',resultBody:v.resultBody||'',point:v.point||'',tags:(v.tags||'').split(',').map(x=>x.trim()).filter(Boolean),experts:$$('input[name="experts"]:checked').map(x=>x.value),status:v.status||'draft'};
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
function setupVisitorPeriods(selector,target){
 const labels={day:'오늘',week:'최근 7일',month:'최근 30일',all:'전체 기간'};
 const wrap=$(selector),area=$(target);if(!wrap||!area)return;
 function draw(period){
  wrap.querySelectorAll('[data-period]').forEach(b=>{const on=b.dataset.period===period;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))});
  area.innerHTML='<div class="ops-visitor-cards"><div><small>'+labels[period]+' 방문자</small><strong>—</strong><span>데이터 미연동</span></div><div><small>페이지뷰</small><strong>—</strong><span>데이터 미연동</span></div><div><small>주요 유입 경로</small><strong>—</strong><span>데이터 미연동</span></div></div><div class="ops-chart-empty"><span>'+labels[period]+' 방문 추이</span><p>분석 연동 후 실제 데이터가 이 영역에 표시됩니다.</p></div>';
 }
 wrap.querySelectorAll('[data-period]').forEach(b=>b.addEventListener('click',()=>draw(b.dataset.period)));draw('day');
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
    const quick=all.filter(d=>d.type==='quick'),general=all.filter(d=>d.type!=='quick');
    const pending=all.filter(d=>d.status==='new');
    $('#opSummary').innerHTML='<div class="ops-stats"><div>빠른 문의<strong>'+quick.length+'</strong><small>미확인 '+quick.filter(d=>d.status==='new').length+'건</small></div><div>일반 문의<strong>'+general.length+'</strong><small>미확인 '+general.filter(d=>d.status==='new').length+'건</small></div><div>뉴스<strong>'+news.size+'</strong><small>데이터베이스 등록</small></div><div>업무사례<strong>'+cases.size+'</strong><small>데이터베이스 등록</small></div></div>'+(pending.length?'<p class="ops-unread">확인이 필요한 문의 '+pending.length+'건</p>':'<p class="muted">미확인 문의가 없습니다.</p>');
  }catch(e){if($('#opSummary'))$('#opSummary').textContent='현황 조회 실패: '+e.message}
 }else if(kind==='visitors'){
  root.innerHTML=panel('방문자 현황','<div class="ops-periods" id="visitorPeriods"><button type="button" data-period="day">일일</button><button type="button" data-period="week">주간</button><button type="button" data-period="month">월간</button><button type="button" data-period="all">전체</button></div><div class="ops-visitor-summary" id="visitorSummary"></div><div class="ops-tracking-foot"><p>현재 방문자 측정 데이터가 연결되지 않아 실제 방문자 수를 표시하지 않습니다. GA4 측정 ID와 보고서 조회 연동 후 방문자·페이지뷰·유입경로가 표시됩니다.</p><a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer">분석 보고서 열기 ↗</a></div>');
  setupVisitorPeriods('#visitorPeriods','#visitorSummary');
 }else if(kind==='seo'){
  root.innerHTML=panel('SEO · 메타정보 점검','<p class="muted">각 공개 페이지 HTML에 설정된 제목·설명·키워드를 확인합니다. 검색엔진의 실제 노출 순위나 색인 상태를 의미하지 않습니다.</p><div id="seoStatus">메타정보 검사 중...</div>');
  const result=await Promise.all(operationalPages.map(async ([name,path])=>{try{const res=await fetch(siteUrl(path),{cache:'no-store'});if(!res.ok)throw Error('HTTP '+res.status);const html=await res.text(),doc=new DOMParser().parseFromString(html,'text/html');return {name,path,title:doc.title,description:doc.querySelector('meta[name="description"]')?.content||'',keywords:doc.querySelector('meta[name="keywords"]')?.content||''}}catch(e){return {name,path,error:e.message}}}));
  $('#seoStatus').innerHTML=result.map(x=>'<div class="ops-row"><strong>'+esc(x.name)+'</strong><span>'+esc(x.error||x.title||'제목 미설정')+'</span><small>'+esc(x.error||('설명 '+(x.description?'설정':'없음')+' · 키워드 '+(x.keywords?'설정':'없음')))+'</small><a href="'+siteUrl(x.path)+'" target="_blank" rel="noopener">페이지 열기 ↗</a></div>').join('');
 }else if(kind==='calculators'){
  root.innerHTML=panel('계산기 운영 현황','<p class="muted">현재 등록된 계산기 5종의 이동 링크입니다. 계산 횟수는 분석 이벤트 수집·보고가 연결되지 않아 표시하지 않습니다.</p>'+calcPages.map(([name,path])=>'<div class="ops-row"><strong>'+name+'</strong><a href="'+siteUrl(path)+'" target="_blank" rel="noopener">계산기 열기 ↗</a><small>운영 페이지</small></div>').join(''));
 }else if(kind==='inquiries'){
  root.innerHTML=panel('문의 관리','<p class="muted">빠른 문의와 일반 문의를 구분합니다. 현재 이메일 앱에서만 전송된 과거 문의는 데이터베이스에 자동 기록되지 않습니다.</p><div class="ops-filters"><button data-inquiry-kind="quick">빠른 문의</button><button data-inquiry-kind="general">일반 문의</button><button data-inquiry-kind="all">전체</button></div><div id="inquiryList">문의 조회 중...</div>');
  let docs=[];try{const snap=await getDocs(collection(db,'inquiries'));docs=snap.docs.map(d=>({id:d.id,...d.data()}));docs.sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0))}catch(e){$('#inquiryList').textContent='문의 조회 실패: '+e.message;return}
  function draw(type){
    const items=docs.filter(x=>type==='all'||x.type===type);
    $('#inquiryList').innerHTML=items.length?items.map(x=>{
      const date=x.createdAt?.toDate?.()?.toLocaleString('ko-KR')||'접수일 확인 중';
      const pending=x.status==='new';
      const details=x.details?'<details><summary>상세 접수 정보</summary><p>'+esc(x.details).replace(/\\n/g,'<br>')+'</p></details>':'';
      return '<div class="ops-row"><strong>'+(x.type==='quick'?'빠른 문의':'일반 문의')+' · '+esc(x.name||'이름 미입력')+'</strong><small>'+esc(date)+' · '+(pending?'미확인':'확인 완료')+'</small><span>'+esc(x.phone||'연락처 없음')+' / '+esc(x.email||'이메일 없음')+'</span><p>'+esc(x.message||'')+'</p>'+details+(pending?'<button type="button" data-mark="'+esc(x.id)+'">확인 처리</button>':'')+'</div>';
    }).join(''):'<p class="muted">등록된 문의가 없습니다.</p>';
    $$('[data-mark]').forEach(b=>b.onclick=async()=>{b.disabled=true;try{await setDoc(doc(db,'inquiries',b.dataset.mark),{status:'reviewed'},{merge:true});const item=docs.find(x=>x.id===b.dataset.mark);if(item)item.status='reviewed';draw(type);msg('문의 확인 처리 완료');}catch(e){b.disabled=false;msg('처리 실패: '+e.message)}});
  }
  $('[data-inquiry-kind]').forEach(b=>b.onclick=()=>{root.querySelectorAll('[data-inquiry-kind]').forEach(x=>x.classList.toggle('active',x===b));draw(b.dataset.inquiryKind)});const first=root.querySelector('[data-inquiry-kind="all"]');if(first)first.click();
 }
}
clearForm('news');
