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
  const syncConnection=()=>{const c=getCfg();repoInput.value=c.repo;branchInput.value=c.branch;tokenInput.value=c.token;status.textContent=c.token?'GitHub 게시 연결됨':'GitHub 연결 필요';status.classList.toggle('is-on',Boolean(c.token))};

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

  $('[data-save-connection]').addEventListener('click',()=>{
    sessionStorage.setItem('ptgAdminRepo',repoInput.value.trim());
    sessionStorage.setItem('ptgAdminBranch',branchInput.value.trim()||'main');
    sessionStorage.setItem('ptgAdminToken',tokenInput.value.trim());
    syncConnection();
    toast('GitHub 게시 연결을 저장했습니다.');
    loadCaseManager();
  });
  $('[data-clear-connection]').addEventListener('click',()=>{
    ['ptgAdminRepo','ptgAdminBranch','ptgAdminToken'].forEach(k=>sessionStorage.removeItem(k));
    tokenInput.value='';syncConnection();toast('GitHub 연결을 해제했습니다.');loadCaseManager();
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
  $('[data-publish-news]').addEventListener('click',async()=>{
    const url=$('[data-news-url]').value.trim(),title=$('[data-news-title]').value.trim();if(!url||!title)return toast('URL과 제목을 확인하세요.');
    try{const data=await readRepoJson('content/news.json');data.unshift({id:`news-${Date.now()}`,date:$('[data-news-date]').value||today(),source:$('[data-news-source]').value.trim(),title,url,category:$('[data-news-category]').value,summary:$('[data-news-summary]').value.trim(),image:$('[data-news-image]').value.trim(),createdAt:new Date().toISOString()});await writeRepoText('content/news.json',JSON.stringify(data,null,2)+'\n',`Publish news: ${title}`);toast('뉴스를 게시했습니다. GitHub Pages 반영까지 잠시 걸릴 수 있습니다.');refreshDashboard()}catch(e){toast(e.message)}
  });

  /* ---------- CASE POST MANAGER ---------- */
  const casePanel=$('[data-panel="cases"]');
  const caseManager=document.createElement('div');
  caseManager.className='admin-card admin-case-manager';
  caseManager.innerHTML=`<div class="admin-section-title"><div><h2>게시된 업무사례</h2><span class="admin-muted" data-case-manager-count>0건</span></div><button class="admin-btn" type="button" data-refresh-cases>새로고침</button></div><div class="admin-case-toolbar"><input type="search" data-case-search placeholder="제목·분야·결과 검색"><span class="admin-muted">삭제하면 업무사례 목록에서 즉시 제외됩니다.</span></div><div class="admin-list admin-case-list" data-case-manager-list><div class="admin-empty">업무사례를 불러오는 중입니다.</div></div>`;
  casePanel.appendChild(caseManager);

  let caseCache=[];
  const caseHref=item=>item.href?`../cases/${String(item.href).replace(/^\.\//,'')}`:`../cases/view/?id=${encodeURIComponent(item.id||'')}`;
  const caseDate=item=>item.createdAt?String(item.createdAt).slice(0,10):(item.legacy?'기존 사례':'');
  const renderCaseManager=()=>{
    const query=$('[data-case-search]').value.trim().toLowerCase();
    const items=caseCache.filter(item=>!query||[item.title,item.meta1,item.meta2,item.result].some(v=>String(v||'').toLowerCase().includes(query)));
    $('[data-case-manager-count]').textContent=`${caseCache.length}건`;
    $('[data-case-manager-list]').innerHTML=items.length?items.map(item=>`<div class="admin-list-item admin-case-row" data-case-id="${esc(item.id)}"><div class="admin-case-row__copy"><strong>${esc(item.title||'제목 없음')}</strong><span>${esc(item.meta1||'업무사례')}${item.result?` · ${esc(item.result)}`:''}${caseDate(item)?` · ${esc(caseDate(item))}`:''}</span></div><div class="admin-case-row__actions"><a class="admin-btn" href="${esc(caseHref(item))}" target="_blank" rel="noopener">보기</a><button class="admin-btn danger" type="button" data-delete-case="${esc(item.id)}">삭제</button></div></div>`).join(''):'<div class="admin-empty">조건에 맞는 업무사례가 없습니다.</div>';
  };

  async function loadCaseManager(){
    try{
      const cfg=getCfg();
      const data=cfg.token?await readRepoJson('content/cases.json'):await readPublicJson('content/cases.json');
      caseCache=Array.isArray(data)?data:[];
      renderCaseManager();
    }catch(e){
      $('[data-case-manager-list]').innerHTML=`<div class="admin-empty">${esc(e.message)}</div>`;
    }
  }

  $('[data-case-search]').addEventListener('input',renderCaseManager);
  $('[data-refresh-cases]').addEventListener('click',loadCaseManager);
  $('[data-case-manager-list]').addEventListener('click',async e=>{
    const btn=e.target.closest('[data-delete-case]');
    if(!btn)return;
    const id=btn.dataset.deleteCase;
    const item=caseCache.find(x=>String(x.id)===String(id));
    if(!item)return;
    if(!getCfg().token)return toast('삭제하려면 사이트 상태에서 GitHub Token을 먼저 연결하세요.');
    if(!confirm(`“${item.title}” 업무사례를 삭제할까요?\n업무사례 목록에서는 제거되며 GitHub Pages 반영까지 잠시 걸릴 수 있습니다.`))return;
    btn.disabled=true;
    try{
      const data=await readRepoJson('content/cases.json');
      const next=(Array.isArray(data)?data:[]).filter(x=>String(x.id)!==String(id));
      await writeRepoText('content/cases.json',JSON.stringify(next,null,2)+'\n',`Delete case: ${item.title}`);
      toast('업무사례를 삭제했습니다.');
      await loadCaseManager();
      refreshDashboard();
    }catch(err){toast(err.message);btn.disabled=false}
  });

  const resetCaseForm=()=>{
    ['[data-case-title]','[data-case-summary]','[data-case-meta1]','[data-case-meta2]','[data-case-result]','[data-case-tags]','[data-case-overview]','[data-case-strategy]','[data-case-result-body]','[data-case-point]'].forEach(s=>{$(s).value=''});
    $('[data-case-category]').value='criminal';
  };

  $('[data-publish-case]').addEventListener('click',async()=>{
    const title=$('[data-case-title]').value.trim(),summary=$('[data-case-summary]').value.trim();
    if(!title||!summary)return toast('사례 제목과 요약을 입력하세요.');
    if(!getCfg().token)return toast('게시하려면 사이트 상태에서 GitHub Token을 먼저 연결하세요.');
    try{
      const data=await readRepoJson('content/cases.json'),category=$('[data-case-category]').value;
      const tags=$('[data-case-tags]').value.split(',').map(x=>x.trim()).filter(Boolean);
      data.unshift({id:`case-${Date.now()}`,title,summary,meta1:$('[data-case-meta1]').value.trim()||category,meta2:$('[data-case-meta2]').value.trim(),result:$('[data-case-result]').value.trim(),tags,categories:[category],overview:$('[data-case-overview]').value.trim(),strategy:$('[data-case-strategy]').value.trim(),resultBody:$('[data-case-result-body]').value.trim(),point:$('[data-case-point]').value.trim(),createdAt:new Date().toISOString()});
      await writeRepoText('content/cases.json',JSON.stringify(data,null,2)+'\n',`Publish case: ${title}`);
      resetCaseForm();
      toast('업무사례를 게시했습니다.');
      await loadCaseManager();
      refreshDashboard();
    }catch(e){toast(e.message)}
  });

  $('[data-save-analytics]').addEventListener('click',async()=>{
    const id=$('[data-ga4-id]').value.trim();if(id&&!/^G-[A-Z0-9]+$/i.test(id))return toast('GA4 Measurement ID 형식을 확인하세요.');
    try{await writeRepoText('content/settings.json',JSON.stringify({ga4MeasurementId:id,analyticsProvider:id?'ga4':'none'},null,2)+'\n','Update analytics settings');toast('방문자 분석 설정을 게시했습니다.');refreshDashboard()}catch(e){toast(e.message)}
  });

  loadCaseManager();
})();
