import {auth,db} from '../assets/js/firebase-client.js';
import {signInWithEmailAndPassword,signOut,onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js';
import {doc,getDoc,collection,getDocs,query,setDoc,deleteDoc,serverTimestamp} from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const state={view:'news',items:[],editing:null,authorized:false};
const msg=t=>{$('#status').textContent=t;};
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const categories={criminal:'형사',tax:'조세·세무',civil:'민사',family:'가사·상속',corporate:'기업',realestate:'부동산·건설',ip:'지식재산'};
const form=kind=>$('#'+kind+'Form');
function clearForm(kind){const f=form(kind);f.reset();if(kind==='news')f.elements.date.value=new Date().toLocaleDateString('sv-SE');state.editing=null;$('#'+kind+'FormTitle').textContent=kind==='news'?'뉴스 등록':'업무사례 등록';}
function setView(kind){state.view=kind;state.editing=null;$$('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===kind));$('#newsSection').hidden=kind!=='news';$('#casesSection').hidden=kind!=='cases';$('#listTitle').textContent=kind==='news'?'Firebase 뉴스':'Firebase 업무사례';clearForm(kind);load();}
$$('[data-view]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
$$('[data-reset]').forEach(b=>b.addEventListener('click',()=>clearForm(b.dataset.reset)));
$('#reload').addEventListener('click',()=>load());
$('#loginForm').addEventListener('submit',async e=>{e.preventDefault();msg('로그인 확인 중입니다.');const f=e.currentTarget;try{await signInWithEmailAndPassword(auth,f.elements.email.value.trim(),f.elements.password.value);f.elements.password.value='';}catch(err){msg('로그인 실패: '+err.message)}});
$('#logout').addEventListener('click',()=>signOut(auth));
onAuthStateChanged(auth,async user=>{
 state.authorized=false;$('#manager').hidden=true;$('#loginPanel').hidden=true;
 if(!user){$('#loginPanel').hidden=false;$('#connection').textContent='로그인 필요';$('#authName').textContent='로그인 필요';$('#logout').hidden=true;return;}
 try{const adm=await getDoc(doc(db,'admins',user.uid));if(!adm.exists()||adm.data().role!=='admin')throw Error('Firestore admins/{UID}의 role: admin 등록이 필요합니다.');state.authorized=true;$('#connection').textContent='Firebase 관리자 연결됨';$('#authName').textContent=user.email;$('#logout').hidden=false;$('#manager').hidden=false;msg('관리자 인증 완료');await load();}
 catch(err){$('#loginPanel').hidden=false;$('#connection').textContent='관리자 권한 없음';$('#authName').textContent=user.email;$('#logout').hidden=false;msg(err.message);}
});
async function load(){
 if(!state.authorized)return;
 $('#list').textContent='불러오는 중...';
 try{const snap=await getDocs(collection(db,state.view));state.items=snap.docs.map(d=>({id:d.id,...d.data()}));state.items.sort((a,b)=>String(b.date||b.createdAt?.seconds||'').localeCompare(String(a.date||a.createdAt?.seconds||'')));render();}
 catch(err){$('#list').textContent='조회 실패: '+err.message;msg('Firestore 규칙과 인증 상태를 확인해주세요.');}
}
function render(){
 const root=$('#list');root.innerHTML='';
 if(!state.items.length){root.textContent='Firebase에 등록된 글이 없습니다. 기존 GitHub 게시물은 공개 사이트에 그대로 유지됩니다.';return;}
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
 try{const old=state.items.find(i=>i.id===id);await setDoc(doc(db,kind,id),{...record,createdAt:old?.createdAt||serverTimestamp(),updatedAt:serverTimestamp()},{merge:true});clearForm(kind);msg('Firestore 저장 완료 · 공개 상태는 사이트에 자동 반영됩니다.');await load();}
 catch(err){msg('저장 실패: '+err.message)}
});
clearForm('news');
