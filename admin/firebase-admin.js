import {auth,db} from '../assets/js/firebase-client.js';
import {signInWithEmailAndPassword,signOut,onAuthStateChanged,setPersistence,inMemoryPersistence} from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js';
import {doc,getDoc,collection,getDocs,query,setDoc,deleteDoc,serverTimestamp} from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const state={view:'news',items:[],editing:null,authorized:false,inquiryFilter:null};
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
 if(kind==='cases'){const storedCategory=item.categories?.[0]||item.category||Object.keys(categories).find(k=>categories[k]===item.meta1)||'corporate';f.elements.category.value=categories[storedCategory]?storedCategory:'corporate';f.elements.tags.value=(item.tags||[]).join(', ');$$('input[name="experts"]').forEach(i=>{i.checked=(item.experts||[]).includes(i.value)})}
 $('#'+kind+'FormTitle').textContent='게시물 수정';window.scrollTo({top:0,behavior:'smooth'});
}
async function updateStatus(item){try{await setDoc(doc(db,state.view,item.id),{status:item.status==='published'?'draft':'published',updatedAt:serverTimestamp()},{merge:true});msg('공개 상태 변경 완료');await load()}catch(err){msg('변경 실패: '+err.message)}}
async function remove(item){if(!confirm('이 게시물을 삭제할까요? 복구하려면 다시 등록해야 합니다.'))return;try{await deleteDoc(doc(db,state.view,item.id));clearForm(state.view);msg('삭제 완료');await load()}catch(err){msg('삭제 실패: '+err.message)}}

const imageField=$('#newsForm input[name="image"]');
const imagePreview=$('#newsImagePreview');
const directImageUrl=value=>!value||(/^https?:\/\//i.test(value)&&/\.(png|jpe?g|webp|gif|avif)(?:[?#]|$)/i.test(value));
function updateNewsImagePreview(){
 if(!imagePreview||!imageField)return;
 const value=imageField.value.trim();
 imagePreview.classList.remove('is-error');
 if(!value){imagePreview.textContent='등록된 이미지가 없습니다. 뉴스룸에는 기본 카드가 표시됩니다.';return;}
 if(!directImageUrl(value)){imagePreview.textContent='기사 페이지 URL은 이미지로 사용할 수 없습니다. 실제 이미지 파일 주소를 입력해주세요.';imagePreview.classList.add('is-error');return;}
 const img=document.createElement('img');img.alt='대표 이미지 미리보기';
 img.addEventListener('error',()=>{imagePreview.textContent='이미지를 불러오지 못했습니다. 주소 또는 외부 사이트의 이미지 차단 여부를 확인해주세요.';imagePreview.classList.add('is-error')});
 img.src=value;imagePreview.replaceChildren(img);
}
imageField?.addEventListener('change',updateNewsImagePreview);
imageField?.addEventListener('input',updateNewsImagePreview);

function getValues(f){return Object.fromEntries(new FormData(f).entries())}
for(const kind of ['news','cases'])form(kind).addEventListener('submit',async e=>{
 e.preventDefault();if(!state.authorized)return msg('관리자 권한이 필요합니다.');
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
    $('#opSummary').innerHTML='<div class="ops-stats"><button type="button" class="ops-stat-link" data-open-inquiry="quick">빠른 문의<strong>'+quick.length+'</strong><small>미확인 '+quick.filter(d=>d.status==='new').length+'건 · 확인하기</small></button><button type="button" class="ops-stat-link" data-open-inquiry="general">일반 문의<strong>'+general.length+'</strong><small>미확인 '+general.filter(d=>d.status==='new').length+'건 · 확인하기</small></button><div>뉴스<strong>'+news.size+'</strong><small>데이터베이스 등록</small></div><div>업무사례<strong>'+cases.size+'</strong><small>데이터베이스 등록</small></div></div>'+(pending.length?'<p class="ops-unread">확인이 필요한 문의 '+pending.length+'건</p>':'<p class="muted">미확인 문의가 없습니다.</p>');
    $('#opSummary [data-open-inquiry]').forEach(button=>button.onclick=()=>{state.inquiryFilter=button.dataset.openInquiry;setView('inquiries')});
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
  root.innerHTML=panel('문의 관리',
    '<div class="inquiry-intro"><div><p class="muted">문의하기 페이지와 빠른 문의가 같은 데이터베이스로 들어옵니다. 최신 접수순으로 확인하고 바로 전화·이메일 응대를 할 수 있습니다.</p><small>온라인 접수 실패 후 이메일로만 전달된 문의는 이 목록에 자동 기록되지 않습니다.</small></div><button type="button" id="reloadInquiries">새로고침</button></div>'+
    '<div id="inquiryOverview" class="inquiry-overview"></div>'+
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

  const filter={type:state.inquiryFilter||'all',status:'all',term:''};
  state.inquiryFilter=null;
  const normalize=v=>String(v||'').toLowerCase().replace(/\\s+/g,'');
  const phoneHref=v=>'tel:'+String(v||'').replace(/[^0-9+]/g,'');
  const categoryLabel=x=>x.category||((x.type==='quick')?'빠른 문의':'일반 상담');

  function overview(){
    const total=docs.length;
    const fresh=docs.filter(x=>x.status==='new').length;
    const quick=docs.filter(x=>x.type==='quick').length;
    const general=docs.filter(x=>x.type!=='quick').length;
    $('#inquiryOverview').innerHTML=
      '<div><small>전체 문의</small><strong>'+total+'</strong><span>누적 접수</span></div>'+
      '<div class="is-alert"><small>미확인</small><strong>'+fresh+'</strong><span>확인 필요</span></div>'+
      '<div><small>빠른 문의</small><strong>'+quick+'</strong><span>간편 문의</span></div>'+
      '<div><small>문의하기</small><strong>'+general+'</strong><span>상세 문의·견적</span></div>';
  }

  function syncFilters(){
    root.querySelectorAll('[data-inquiry-kind]').forEach(b=>b.classList.toggle('active',b.dataset.inquiryKind===filter.type));
    root.querySelectorAll('[data-inquiry-status]').forEach(b=>b.classList.toggle('active',b.dataset.inquiryStatus===filter.status));
  }

  function draw(){
    const term=normalize(filter.term);
    const items=docs.filter(x=>{
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
      const pending=x.status==='new';
      const typeLabel=x.type==='quick'?'빠른 문의':'문의하기';
      const name=x.name||'이름 미입력';
      const phone=x.phone||'';
      const email=x.email||'';
      const details=x.details?'<details class="inquiry-details"><summary>상세 접수 정보 보기</summary><div>'+esc(x.details).replace(/\\n/g,'<br>')+'</div></details>':'';
      const phoneAction=phone?'<a class="inquiry-action" href="'+esc(phoneHref(phone))+'">전화하기</a>':'';
      const mailAction=email?'<a class="inquiry-action" href="mailto:'+esc(email)+'">메일 보내기</a>':'';
      return '<article class="inquiry-card '+(pending?'is-new':'is-reviewed')+'">'+
        '<div class="inquiry-card-head"><div class="inquiry-badges"><span class="inquiry-badge '+(x.type==='quick'?'is-quick':'is-general')+'">'+typeLabel+'</span><span class="inquiry-badge '+(pending?'is-status-new':'is-status-reviewed')+'">'+(pending?'미확인':'확인 완료')+'</span><span class="inquiry-badge is-category">'+esc(categoryLabel(x))+'</span></div><time>'+esc(date)+'</time></div>'+
        '<div class="inquiry-card-body"><div class="inquiry-card-title"><strong>'+esc(name)+'</strong><span>'+esc(phone||'연락처 없음')+(email?' · '+esc(email):'')+'</span></div>'+
        '<p>'+esc(x.message||'문의 내용 없음').replace(/\\n/g,'<br>')+'</p>'+details+'</div>'+
        '<div class="inquiry-card-actions">'+phoneAction+mailAction+
        '<button type="button" class="inquiry-action '+(pending?'is-primary':'')+'" data-status-id="'+esc(x.id)+'" data-next-status="'+(pending?'reviewed':'new')+'">'+(pending?'확인 완료 처리':'미확인으로 되돌리기')+'</button></div>'+
        '</article>';
    }).join('');
    syncFilters();
    $$('[data-status-id]').forEach(button=>button.onclick=async()=>{
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
  $('#inquirySearch').addEventListener('input',e=>{filter.term=e.target.value;draw()});
  root.querySelectorAll('[data-inquiry-kind]').forEach(b=>b.onclick=()=>{filter.type=b.dataset.inquiryKind;draw()});
  root.querySelectorAll('[data-inquiry-status]').forEach(b=>b.onclick=()=>{filter.status=b.dataset.inquiryStatus;draw()});
  $('#reloadInquiries').onclick=()=>renderOps('inquiries');
  draw();
 }
}
clearForm('news');
