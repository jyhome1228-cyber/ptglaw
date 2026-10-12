(()=>{
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const base=location.hostname.endsWith('github.io')?'/ptglaw':'';
  const toast=msg=>{const el=$('[data-toast]');el.textContent=msg;el.classList.add('show');clearTimeout(window.__ptgToast);window.__ptgToast=setTimeout(()=>el.classList.remove('show'),2600)};
  const esc=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[x]));
  const utf8ToB64=s=>btoa(unescape(encodeURIComponent(s)));
  const b64ToUtf8=s=>decodeURIComponent(escape(atob(String(s||'').replace(/\n/g,''))));
  const today=()=>new Date().toISOString().slice(0,10);

  $$('.admin-nav button').forEach(btn=>btn.addEventListener('click',()=>{
    $$('.admin-nav button').forEach(x=>x.classList.toggle('is-active',x===btn));
    $$('.admin-panel').forEach(p=>p.classList.toggle('is-active',p.dataset.panel===btn.dataset.panelTarget));
    if(btn.dataset.panelTarget==='cases')loadCaseManager();
  }));

  const repoInput=$('[data-gh-repo]'), branchInput=$('[data-gh-branch]'), tokenInput=$('[data-gh-token]'), status=$('[data-connection-status]');
  const getCfg=()=>({repo:sessionStorage.getItem('ptgAdminRepo')||repoInput.value.trim(),branch:sessionStorage.getItem('ptgAdminBranch')||branchInput.value.trim()||'main',token:sessionStorage.getItem('ptgAdminToken')||''});
  const syncConnection=()=>{const c=getCfg();repoInput.value=c.repo;branchInput.value=c.branch;tokenInput.value=c.token;status.textContent=c.token?'GitHub 토큰 입력됨 · 연결 확인 필요':'GitHub 연결 필요';status.classList.remove('is-on')};

  const ghRequest=async(path,opts={})=>{
    const c=getCfg();
    if(!c.token)throw new Error('먼저 사이트 상태에서 GitHub Token을 연결하세요.');
    const url=`https://api.github.com/repos/${c.repo}/contents/${path}${opts.read?`?ref=${encodeURIComponent(c.branch)}`:''}`;
    const res=await fetch(url,{method:opts.method||'GET',headers:{Accept:'application/vnd.github+json',Authorization:`Bearer ${c.token}`,'X-GitHub-Api-Version':'2022-11-28'},body:opts.body?JSON.stringify(opts.body):undefined});
    if(!res.ok){const e=await res.json().catch(()=>({}));const err=new Error(e.message||`GitHub ${res.status}`);err.status=res.status;throw err}
    return res.json();
  };
  const readRepoText=async path=>{const data=await ghRequest(path,{read:true});return {text:b64ToUtf8(data.content),sha:data.sha}};
  const writeRepoText=async(path,text,message)=>{let sha;try{sha=(await readRepoText(path)).sha}catch(e){if(e.status!==404)throw e}const c=getCfg();return ghRequest(path,{method:'PUT',body:{message,content:utf8ToB64(text),branch:c.branch,...(sha?{sha}:{})}})};
  const readPublicJson=async path=>{try{const res=await fetch(`${base}/${path}?v=${Date.now()}`,{cache:'no-store'});return res.ok?await res.json():[]}catch(e){return []}};
  const readRepoJson=async path=>{try{return JSON.parse((await readRepoText(path)).text)}catch(e){if(e.status===404)return [];throw e}};

  $('[data-save-connection]').addEventListener('click',async()=>{
    const repo=repoInput.value.trim(),branch=branchInput.value.trim()||'main',token=tokenInput.value.trim();
    if(repo!=='jyhome1228-cyber/ptglaw'||branch!=='main')return toast('허용된 저장소 jyhome1228-cyber/ptglaw의 main 브랜치만 연결할 수 있습니다.');
    if(!token)return toast('Fine-grained GitHub Token을 입력해주세요.');
    sessionStorage.setItem('ptgAdminRepo',repo);
    sessionStorage.setItem('ptgAdminBranch',branch);
    sessionStorage.setItem('ptgAdminToken',token);
    status.textContent='GitHub 권한 확인 중...';
    try{
      await ghRequest('content/cases.json',{read:true});
      status.textContent='GitHub 읽기 연결 확인됨';
      status.classList.add('is-on');
      toast('GitHub 읽기 연결 확인. 게시 권한은 콘텐츠 저장 시 검증됩니다.');
      document.dispatchEvent(new CustomEvent('ptg-admin-connected'));
    }catch(err){
      sessionStorage.removeItem('ptgAdminToken');
      tokenInput.value='';
      syncConnection();
      toast('GitHub 연결 실패: '+err.message);
    }
  });
  $('[data-clear-connection]').addEventListener('click',()=>{
    ['ptgAdminRepo','ptgAdminBranch','ptgAdminToken'].forEach(k=>sessionStorage.removeItem(k));
    tokenInput.value='';syncConnection();toast('GitHub 연결을 해제했습니다.');document.dispatchEvent(new CustomEvent('ptg-admin-disconnected'));
  });
  syncConnection();

  const refreshDashboard=async()=>{
    const [news,cases,settings]=await Promise.all([readPublicJson('content/news.json'),readPublicJson('content/cases.json'),readPublicJson('content/settings.json')]);
    $('[data-kpi-news]').textContent=Array.isArray(news)?news.length:0;
    $('[data-kpi-cases]').textContent=Array.isArray(cases)?cases.length:0;
    $('[data-kpi-analytics]').textContent=settings?.ga4MeasurementId?'ON':'OFF';
    if(settings?.ga4MeasurementId)$('[data-ga4-id]').value=settings.ga4MeasurementId;
    const list=$('[data-recent-content]');
    const rows=[...(Array.isArray(news)?news.map(x=>({type:'뉴스',title:x.title,date:x.date||''})):[]),...(Array.isArray(cases)?cases.filter(x=>!x.legacy).map(x=>({type:'사례',title:x.title,date:x.createdAt||''})):[])].sort((a,b)=>String(b.date).localeCompare(String(a.date))).slice(0,6);
    list.innerHTML=rows.length?rows.map(x=>`<div class="admin-list-item"><div><strong>${esc(x.title)}</strong><span>${esc(x.type)} · ${esc(x.date)}</span></div></div>`).join(''):'<div class="admin-empty">게시된 CMS 콘텐츠가 없습니다.</div>';
  };
  refreshDashboard();

  $('[data-news-date]').value=today();
  const renderNewsPreview=()=>{const image=$('[data-news-image]').value.trim(),title=$('[data-news-title]').value.trim(),source=$('[data-news-source]').value.trim(),summary=$('[data-news-summary]').value.trim();$('[data-news-preview]').innerHTML=`${image?`<img src="${esc(image)}" alt="">`:''}<h3>${esc(title||'기사 제목')}</h3><p>${esc(source||'언론사')}${summary?` · ${esc(summary)}`:''}</p>`};
  ['[data-news-title]','[data-news-source]','[data-news-summary]','[data-news-image]'].forEach(s=>$(s).addEventListener('input',renderNewsPreview));
  $('[data-fetch-news]').addEventListener('click',async()=>{
    const url=$('[data-news-url]').value.trim();if(!url)return toast('기사 URL을 입력하세요.');
    try{toast('기사 정보를 불러오는 중입니다.');const res=await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);if(!res.ok)throw new Error('메타데이터를 불러오지 못했습니다.');const json=await res.json(),d=json.data||{};$('[data-news-title]').value=d.title||'';$('[data-news-summary]').value=d.description||'';$('[data-news-image]').value=d.image?.url||'';let source=d.publisher||d.author||'';if(!source){try{source=new URL(url).hostname.replace(/^www\./,'')}catch(e){}}$('[data-news-source]').value=source;renderNewsPreview();toast('기사 정보를 불러왔습니다.')}catch(e){toast(e.message)}
  });
  // News and case CRUD handlers live in cms-manager.js.
  const loadCaseManager=()=>{};

  $('[data-save-analytics]').addEventListener('click',async()=>{
    const id=$('[data-ga4-id]').value.trim();if(id&&!/^G-[A-Z0-9]+$/i.test(id))return toast('GA4 Measurement ID 형식을 확인하세요.');
    try{await writeRepoText('content/settings.json',JSON.stringify({ga4MeasurementId:id,analyticsProvider:id?'ga4':'none'},null,2)+'\n','Update analytics settings');toast('방문자 분석 설정을 게시했습니다.');refreshDashboard()}catch(e){toast(e.message)}
  });

})();
