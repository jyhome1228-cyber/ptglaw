import {auth,db} from '../assets/js/firebase-client.js';
import {collection,getDocs,doc,getDoc} from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js';
import {onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const kst=()=>{const p=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const m=Object.fromEntries(p.map(x=>[x.type,x.value]));return Date.UTC(+m.year,+m.month-1,+m.day)};
const date=(epoch)=>new Date(epoch).toISOString().slice(0,10);
let authenticated=false,loading=false,cache=null;
function build(v,i){
 const today=kst(),dow=new Date(today).getUTCDay(),shift=(dow+6)%7;
 const start=date(today-(shift+7)*864e5),end=date(today-(shift+1)*864e5),priorStart=date(today-(shift+14)*864e5),priorEnd=date(today-(shift+8)*864e5);
 const count=(a,b)=>new Set(v.filter(x=>x.date>=a&&x.date<=b).map(x=>x.date+':'+x.visitorId)).size;
 const current=count(start,end),prior=count(priorStart,priorEnd);
 const delta=prior?((current-prior)/prior*100).toFixed(1)+'%':'비교 데이터 없음';
 const inquiryCount=i.filter(x=>{const t=x.createdAt?.toDate?.();if(!t)return false;const d=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(t);return d>=start&&d<=end}).length;
 const labels={naver:'네이버',google:'구글',chatgpt:'ChatGPT',kakao:'카카오톡',instagram:'인스타그램',perplexity:'Perplexity',gemini:'Gemini',direct:'직접 방문',referral:'외부 링크',search:'검색',social:'SNS',facebook:'페이스북',daum:'다음',bing:'Bing',email:'이메일',paid:'광고',youtube:'유튜브',linkedin:'링크드인'};
 const counts={};
 v.filter(x=>x.date>=start&&x.date<=end&&x.source).forEach(x=>{counts[x.source]=(counts[x.source]||0)+1});
 const sources=Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([s,n])=>esc(labels[s]||s)+' '+n+'건').join(' · ')||'확인 가능한 유입경로 없음';
 return {start,end,current,prior,delta,inquiryCount,sources,dow};
}
function render(){
 if(!authenticated||!cache)return;
 const section=document.querySelector('#opsSection'),dashboard=document.querySelector('[data-view="dashboard"].active');
 if(!section||section.hidden||!dashboard||section.querySelector('#ptgWeeklyReport'))return;
 const x=cache;
 const container=document.createElement('section');container.id='ptgWeeklyReport';container.className='panel';
 container.innerHTML='<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap"><div><small style="color:#e97920;font-weight:700">WEEKLY REPORT</small><h2 style="margin:6px 0">지난주 운영 리포트</h2><p class="muted">'+x.start+' ~ '+x.end+'</p></div><button type="button" id="ptgShowWeekly" class="primary">리포트 보기</button></div><div class="ops-visitor-cards" style="margin-top:18px"><div><small>방문자</small><strong>'+x.current+'</strong><span>일별 방문 기록 기준</span></div><div><small>전주 대비</small><strong>'+x.delta+'</strong><span>전주 '+x.prior+'건</span></div><div><small>접수된 문의</small><strong>'+x.inquiryCount+'</strong><span>지난주 접수 기준</span></div></div><p class="muted">주요 유입경로: '+x.sources+'</p>';
 section.prepend(container);
 let modal=document.querySelector('#ptgWeeklyModal');
 if(!modal){
  modal=document.createElement('div');modal.id='ptgWeeklyModal';modal.hidden=true;
  modal.style.cssText='position:fixed;inset:0;z-index:13000;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box';
  modal.innerHTML='<section role="dialog" aria-modal="true" aria-labelledby="ptgWeeklyTitle" style="background:white;border-radius:20px;padding:32px;width:min(650px,100%);box-sizing:border-box;box-shadow:0 24px 70px #0003"><small style="font-weight:700;color:#e97920">MONDAY REPORT</small><h2 id="ptgWeeklyTitle">지난주 주간 리포트</h2><p class="muted" id="ptgWeeklyDate"></p><div class="ops-visitor-cards" id="ptgWeeklyStats" style="margin:22px 0"></div><p class="muted" id="ptgWeeklySources"></p><div class="ptg-weekly-actions"><button type="button" id="ptgWeeklyClose">리포트 확인</button><button type="button" id="ptgWeeklyNever">더 이상 보지 않기</button></div></section>';
  document.body.appendChild(modal);
  modal.querySelector('#ptgWeeklyClose').onclick=()=>{modal.hidden=true};
  modal.querySelector('#ptgWeeklyNever').onclick=()=>{try{localStorage.setItem('ptgWeeklyPopupDisabled','1')}catch(_){}modal.hidden=true};
  modal.addEventListener('click',e=>{if(e.target===modal)modal.hidden=true});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')modal.hidden=true});
 }
 const open=()=>{
  modal.querySelector('#ptgWeeklyDate').textContent=x.start+' ~ '+x.end;
  modal.querySelector('#ptgWeeklyStats').innerHTML='<div><small>방문자</small><strong>'+x.current+'</strong></div><div><small>전주 대비</small><strong>'+x.delta+'</strong></div><div><small>문의 접수</small><strong>'+x.inquiryCount+'</strong></div>';
  modal.querySelector('#ptgWeeklySources').textContent='주요 유입경로: '+x.sources;
  modal.hidden=false;modal.querySelector('#ptgWeeklyClose').focus();
 };
 container.querySelector('#ptgShowWeekly').onclick=open;
 if(x.dow===1){let disabled=false;try{disabled=localStorage.getItem('ptgWeeklyPopupDisabled')==='1'}catch(_){}if(!disabled)open();}
}
const style=document.createElement('style');style.textContent=`#ptgWeeklyModal[hidden]{display:none!important}#ptgWeeklyModal .ptg-weekly-actions{display:flex;flex-direction:column;gap:10px;margin-top:24px}#ptgWeeklyModal .ptg-weekly-actions button{appearance:none;display:block;width:100%;min-height:48px;border:1px solid #e4e6e9;border-radius:10px;background:#fff;color:#444;font:600 14px Pretendard,"Apple SD Gothic Neo",sans-serif;cursor:pointer;padding:12px 16px;transition:background .2s}#ptgWeeklyModal #ptgWeeklyClose{background:#f58220;border-color:#f58220;color:#fff}#ptgWeeklyModal #ptgWeeklyClose:hover{background:#de6e12}#ptgWeeklyModal #ptgWeeklyNever:hover{background:#f5f5f5}#ptgWeeklyModal .ops-visitor-cards strong{font-size:clamp(20px,3vw,30px);overflow-wrap:anywhere;line-height:1.3}#ptgWeeklyModal section[role="dialog"]{max-height:90dvh;overflow:auto}@media(max-width:600px){#ptgWeeklyModal section[role="dialog"]{padding:24px!important}}`;document.head.appendChild(style);
const observer=new MutationObserver(()=>render());observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','hidden']});
onAuthStateChanged(auth,async user=>{
 authenticated=false;cache=null;if(!user)return;
 try{
  const member=await getDoc(doc(db,'admins',user.uid));if(member.data()?.role!=='admin')return;
  authenticated=true;
  const [visits,inquiries]=await Promise.all([getDocs(collection(db,'visits')),getDocs(collection(db,'inquiries'))]);
  cache=build(visits.docs.map(x=>x.data()),inquiries.docs.map(x=>x.data()));render();
 }catch(e){console.warn('Weekly report not available',e)}
});
