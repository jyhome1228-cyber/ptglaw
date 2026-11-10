import {auth,db} from '../assets/js/firebase-client.js';
import {onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js';
import {collection,doc,getDoc,getDocs,setDoc,serverTimestamp} from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js';

// Completed Korea-time Monday–Sunday weeks, one immutable document per week.
const DAY=86400000;
const fmt=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'});
const inKorea=value=>{const p=Object.fromEntries(fmt.formatToParts(value).map(x=>[x.type,x.value]));return p.year+'-'+p.month+'-'+p.day};
const iso=n=>new Date(n).toISOString().slice(0,10);
const epoch=d=>Date.parse(d+'T00:00:00Z');
const monday=d=>{const n=epoch(d);return iso(n-((new Date(n).getUTCDay()+6)%7)*DAY)};
const weekEnd=start=>iso(epoch(start)+6*DAY);
const previous=start=>iso(epoch(start)-7*DAY);
const today=()=>inKorea(new Date());
const sourceNames={direct:'직접 방문',search:'검색',naver:'네이버',google:'구글',chatgpt:'ChatGPT',claude:'Claude',gemini:'Gemini',perplexity:'Perplexity',bing:'Bing',daum:'다음',referral:'외부 링크',kakao:'카카오',instagram:'인스타그램',facebook:'페이스북',youtube:'유튜브',linkedin:'링크드인',email:'이메일',social:'SNS',paid:'광고',threads:'Threads',x:'X'};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dated=t=>{try{return t?.toDate?inKorea(t.toDate()):t?.seconds?inKorea(new Date(t.seconds*1000)):''}catch{return ''}};
const num=x=>Number(x||0).toLocaleString('ko-KR');
const unique=visits=>new Set(visits.map(v=>v.date+':'+v.visitorId)).size;
const fetchData=async()=>{const [visits,inquiries]=await Promise.all([getDocs(collection(db,'visits')),getDocs(collection(db,'inquiries'))]);return {visits:visits.docs.map(d=>d.data()),inquiries:inquiries.docs.map(d=>d.data())}};
function summarize(start,data){
 const end=weekEnd(start);
 const v=data.visits.filter(x=>x.date>=start&&x.date<=end&&x.visitorId);
 const inquiries=data.inquiries.filter(x=>{const d=dated(x.createdAt);return d>=start&&d<=end});
 const prev=previous(start),prior=data.visits.filter(x=>x.date>=prev&&x.date<start&&x.visitorId);
 const daily=[];for(let t=epoch(start);t<=epoch(end);t+=DAY){const d=iso(t);daily.push({date:d,count:unique(v.filter(x=>x.date===d))})}
 const sources={};for(const x of v){const name=x.source||'unclassified';sources[name]=(sources[name]||0)+1}
 const n=unique(v),old=unique(prior),hasPrior=prior.length>0;
 return {start,end,visitors:n,previousVisitors:hasPrior?old:null,changePct:hasPrior&&old?Math.round((n-old)/old*1000)/10:null,inquiryCount:inquiries.length,quickInquiries:inquiries.filter(x=>x.type==='quick').length,generalInquiries:inquiries.filter(x=>x.type!=='quick').length,daily,sources,method:'브라우저별 날짜 중복을 제거한 방문 기록 수로 실제 개인 수와 다를 수 있습니다.',schemaVersion:1};
}
let admin=false,busy=false,initialized=false,records=[],selected='',status='';
const view=document.getElementById('weeklyArchiveSection');
const active=()=>!!view&&!view.hidden&&admin;
const label=s=>String(s||'').replace(/-/g,'.');
function detail(r){
 const daily=(r.daily||[]).map(x=>'<div><span>'+label(x.date)+'</span><strong>'+num(x.count)+'</strong></div>').join('');
 const sources=Object.entries(r.sources||{}).sort((a,b)=>b[1]-a[1]).map(([source,c])=>'<div><span>'+esc(sourceNames[source]||source)+'</span><strong>'+num(c)+'</strong></div>').join('')||'<p>유입 출처 기록이 없습니다.</p>';
 const delta=r.changePct==null?'비교 불가':(r.changePct>0?'+':'')+r.changePct+'%';
 return '<div class="ptg-report-title"><small>WEEKLY REPORT</small><h2>'+label(r.start)+' ~ '+label(r.end)+'</h2></div>'+
 '<div class="ptg-report-kpis"><div><small>방문 기록</small><strong>'+num(r.visitors)+'</strong></div><div><small>전주 대비</small><strong>'+delta+'</strong></div><div><small>접수 문의</small><strong>'+num(r.inquiryCount)+'</strong></div></div>'+
 '<div class="ptg-report-splits"><section><h3>일자별 방문</h3>'+daily+'</section><section><h3>유입경로</h3>'+sources+'</section></div>'+
 '<div class="ptg-report-notes"><p>빠른 문의 '+num(r.quickInquiries)+'건 · 일반 문의 '+num(r.generalInquiries)+'건</p><p>'+esc(r.method)+'</p><p>영구 삭제된 이전 문의는 보고서에서 복원할 수 없습니다.</p></div>';
}
function render(){
 if(!active())return;
 const sorted=records.slice().sort((a,b)=>b.start.localeCompare(a.start));
 if(!sorted.some(r=>r.start===selected))selected=sorted[0]?.start||'';
 const chosen=sorted.find(r=>r.start===selected);
 view.innerHTML='<section class="panel ptg-report-archive"><div class="ptg-report-head"><div><small>REPORT ARCHIVE</small><h2>주간 운영 리포트 보관함</h2><p>완료된 주차의 방문·유입경로·문의 기록을 날짜별로 확인합니다.</p></div><button type="button" id="ptgRefreshReports" '+(busy?'disabled':'')+'>'+(busy?'집계 중':'리포트 갱신')+'</button></div><p class="ptg-report-status" role="status">'+esc(status)+'</p>'+
 (sorted.length?'<div class="ptg-report-grid"><div class="ptg-report-weeks">'+sorted.map(r=>'<button type="button" data-start="'+esc(r.start)+'" class="'+(r.start===selected?'active':'')+'"><strong>'+label(r.start)+' ~ '+label(r.end)+'</strong><small>방문 '+num(r.visitors)+' · 문의 '+num(r.inquiryCount)+'</small></button>').join('')+'</div><div class="ptg-report-main">'+detail(chosen)+'</div></div>':'<p class="ptg-report-empty">아직 보관된 완료 주차 리포트가 없습니다. 한 주가 끝나고 관리자가 로그인하면 자동 집계됩니다.</p>')+'</section>';
 view.querySelector('#ptgRefreshReports')?.addEventListener('click',()=>{void sync(true)});
 view.querySelectorAll('[data-start]').forEach(button=>button.addEventListener('click',()=>{selected=button.dataset.start;render()}));
}
async function sync(force=false){
 if(!admin||busy||(!force&&initialized))return;
 busy=true;status='주간 기록을 확인하는 중입니다.';render();
 try{
  const data=await fetchData();
  let existing=null,readFailed=false;
  try{existing=await getDocs(collection(db,'weeklyReports'))}catch(e){readFailed=true;console.warn('Weekly archive read permission:',e.code||e.message)}
  const saved=new Map(existing?existing.docs.map(d=>[d.id,{...d.data(),start:d.id,saved:true}]):[]);
  const dates=[...data.visits.map(x=>x.date||''),...data.inquiries.map(x=>dated(x.createdAt))].filter(x=>/^\d{4}-\d{2}-\d{2}$/.test(x)).sort();
  const last=previous(monday(today()));
  const first=dates.length?monday(dates[0]):last;
  const limit=Math.max(epoch(first),epoch(last)-103*7*DAY);
  const computed=[];
  if(dates.length){for(let t=epoch(last);t>=limit;t-=7*DAY)computed.push(summarize(iso(t),data))}
  let written=0,failed=readFailed;
  for(const item of computed){
   if(readFailed)break;
   if(saved.has(item.start))continue;
   try{await setDoc(doc(db,'weeklyReports',item.start),{...item,createdAt:serverTimestamp()});saved.set(item.start,{...item,saved:true});written++}
   catch(e){failed=true;console.warn('Weekly report persistence:',e.code||e.message);if(e.code==='permission-denied')break}
  }
  const merged=new Map(computed.map(x=>[x.start,x]));
  for(const [k,v] of saved)merged.set(k,v);
  records=[...merged.values()];
  status=!dates.length?'완료된 주간 방문 기록이 아직 없습니다.':failed?'지난 주차는 계산했지만 보관에 실패했습니다. Firestore 권한을 확인해 주세요.':written?written+'개 주간 리포트를 저장했습니다.':'지난주까지의 기록이 누적되어 있습니다.';
  initialized=true;
 }catch(e){status='리포트 조회 실패: '+(e.code||e.message);console.warn('Weekly report loading:',e)}
 finally{busy=false;render()}
}
document.querySelector('[data-view="weeklyReports"]')?.addEventListener('click',()=>queueMicrotask(()=>{if(active()){render();void sync()}}));
onAuthStateChanged(auth,async user=>{
 admin=false;initialized=false;records=[];if(!user)return;
 try{const member=await getDoc(doc(db,'admins',user.uid));if(!member.exists()||member.data().role!=='admin')return;admin=true;await sync()}
 catch(e){console.warn('Weekly archive permission:',e.code||e.message)}
});
