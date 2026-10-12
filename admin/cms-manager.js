/* Pentagon editorial CMS — GitHub Contents API
   Public articles and cases only. NEVER store client inquiries or private files in this repository.
*/
(()=>{
  'use strict';
  const $=s=>document.querySelector(s);
  const $$=s=>Array.from(document.querySelectorAll(s));
  const base=location.hostname.endsWith('github.io')?'/ptglaw':'';
  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const get=s=>($(s)?.value||'').trim();
  const today=()=>new Date().toISOString().slice(0,10);
  const status=x=>x?.status==='draft'?'draft':'published';
  const token=()=>sessionStorage.getItem('ptgAdminToken')||'';
  const hasToken=()=>Boolean(token());
  const notify=text=>{
    const el=$('[data-toast]');if(!el)return;
    el.textContent=text;el.classList.add('show');
    clearTimeout(el._cmsTimer);el._cmsTimer=setTimeout(()=>el.classList.remove('show'),3500);
  };
  const publicUrl=p=>base+'/'+p;
  const trustedURL=(url,allowRelative=false)=>{
    if(!url)return true;
    try{
      const parsed=new URL(url,location.href);
      if(parsed.protocol!=='https:'&&parsed.protocol!=='http:')return false;
      if(!allowRelative&&!/^https?:\/\//i.test(url))return false;
      if(allowRelative&&!/^https?:\/\//i.test(url)&&!/^(\.\.\/|\.\/|\/)[\w./?=&%-]+$/i.test(url))return false;
      return true;
    }catch(e){return false}
  };
  const encode64=str=>btoa(unescape(encodeURIComponent(str)));
  const decode64=str=>decodeURIComponent(escape(atob((str||'').replace(/\s/g,''))));
  const config=()=>({repo:sessionStorage.getItem('ptgAdminRepo')||'jyhome1228-cyber/ptglaw',branch:sessionStorage.getItem('ptgAdminBranch')||'main',token:token()});
  const pathFor=kind=>kind==='news'?'content/news.json':'content/cases.json';
  const parseArray=(raw,path)=>{
    const data=JSON.parse(raw);
    if(!Array.isArray(data))throw new Error(path+'의 JSON은 배열이어야 합니다.');
    return data;
  };
  async function readRepo(path){
    const c=config();
    if(!c.token)throw new Error('사이트 상태에서 GitHub 연결을 완료해주세요.');
    if(c.repo!=='jyhome1228-cyber/ptglaw'||c.branch!=='main')throw new Error('등록된 펜타곤 저장소(main)만 편집할 수 있습니다.');
    const url='https://api.github.com/repos/'+c.repo+'/contents/'+path+'?ref='+encodeURIComponent(c.branch);
    const r=await fetch(url,{headers:{Accept:'application/vnd.github+json',Authorization:'Bearer '+c.token,'X-GitHub-Api-Version':'2022-11-28'},cache:'no-store'});
    if(!r.ok)throw new Error('GitHub 읽기 실패 ('+r.status+'). 접근 권한과 토큰을 확인해주세요.');
    const payload=await r.json();
    return {sha:payload.sha,data:parseArray(decode64(payload.content),path)};
  }
  async function readPublic(path){
    const response=await fetch(publicUrl(path)+'?t='+Date.now(),{cache:'no-store'});
    if(!response.ok)throw new Error('게시 데이터 로딩 실패 ('+response.status+')');
    return parseArray(await response.text(),path);
  }
  async function modify(kind,action,message){
    const c=config(),path=pathFor(kind);
    if(!c.token)throw new Error('게시하려면 먼저 GitHub 토큰을 연결해주세요.');
    const current=await readRepo(path);
    const updated=action(current.data.slice());
    if(!Array.isArray(updated))throw new Error('변경 데이터 형식이 잘못되었습니다.');
    const response=await fetch('https://api.github.com/repos/'+c.repo+'/contents/'+path,{
      method:'PUT',
      headers:{Accept:'application/vnd.github+json',Authorization:'Bearer '+c.token,'X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'},
      body:JSON.stringify({message,branch:c.branch,sha:current.sha,content:encode64(JSON.stringify(updated,null,2)+'\n')})
    });
    if(!response.ok){
      let info={};try{info=await response.json()}catch(e){}
      if(response.status===409)return Promise.reject(new Error('다른 관리자가 먼저 수정했습니다. 목록을 새로고침 후 다시 진행해주세요.'));
      throw new Error('GitHub 게시 실패 ('+response.status+'): '+(info.message||'권한을 확인해주세요.'));
    }
    return updated;
  }
  const data={news:[],cases:[]},editing={news:null,cases:null};
  const fieldValue=(section,field)=>get('[data-'+section+'-'+field+']');
  const setField=(section,field,value)=>{
    const el=$('[data-'+section+'-'+field+']');
    if(el)el.value=value??'';
  };
  const region={criminal:'형사',tax:'조세·세무',civil:'민사',family:'가사·상속',corporate:'기업',realestate:'부동산·건설',ip:'지식재산'};
  const labelStatus=x=>status(x)==='draft'?'임시저장':'공개 중';
  const navHref=item=>{
    if(item.href)return '../cases/'+String(item.href).replace(/^(\.\/|\.\.\/cases\/)/,'');
    return '../cases/view/?id='+encodeURIComponent(item.id||'');
  };

  // Append dedicated management lists without duplicating the existing editor forms.
  const newsForm=$('[data-news-title]')?.closest('.admin-form');
  const caseForm=$('[data-case-title]')?.closest('.admin-form');
  if(!newsForm||!caseForm)return;
  const newsImageField=$('[data-news-image]')?.closest('.admin-field');
  newsImageField?.insertAdjacentHTML('afterend',
    '<div class="admin-field"><label>내부 상세페이지 링크 (선택)</label><input data-news-href placeholder="예: ../news5/ · 없으면 기사 원문"><small>기존 내부 뉴스 페이지를 유지할 때만 입력하세요.</small></div>'+
    '<div class="admin-field"><label>공개 상태</label><select data-news-status><option value="published">즉시 공개</option><option value="draft">임시저장 (목록 비노출 · JSON 공개)</option></select></div>');
  $('[data-publish-news]')?.insertAdjacentHTML('afterend','<button class="admin-btn" type="button" data-news-cancel hidden>수정 취소 · 새 글</button>');
  const caseCategory=$('[data-case-category]')?.closest('.admin-field');
  caseCategory?.insertAdjacentHTML('afterend','<div class="admin-field"><label>추가 분야 (선택)</label><select data-case-extra-category><option value="">선택 안 함</option><option value="criminal">형사</option><option value="tax">조세·세무</option><option value="civil">민사</option><option value="family">가사·상속</option><option value="corporate">기업</option><option value="realestate">부동산·건설</option><option value="ip">지식재산</option></select><small>한 사례를 최대 두 분야에 노출할 수 있습니다.</small></div>');
  const caseTags=$('[data-case-tags]')?.closest('.admin-field');
  caseTags?.insertAdjacentHTML('afterend',
    '<div class="admin-field"><label>공개 상태</label><select data-case-status><option value="published">즉시 공개</option><option value="draft">임시저장 (목록 비노출 · JSON 공개)</option></select></div>');
  $('[data-publish-case]')?.insertAdjacentHTML('afterend','<button class="admin-btn" type="button" data-case-cancel hidden>수정 취소 · 새 사례</button>');
  const newsPanel=$('[data-panel="news"]');
  const casePanel=$('[data-panel="cases"]');
  const createManager=(kind,title,placeholder)=> {
    const wrap=document.createElement('div');wrap.className='admin-card admin-cms-manager';
    wrap.innerHTML='<div class="admin-section-title"><div><h2>'+title+'</h2><span class="admin-muted" data-'+kind+'-count>불러오는 중</span></div>'+
      '<button type="button" class="admin-btn" data-'+kind+'-refresh>새로고침</button></div>'+
      '<div class="admin-case-toolbar"><input type="search" data-'+kind+'-search placeholder="'+placeholder+'" aria-label="'+title+' 검색">'+
      '<span class="admin-muted">편집 후 저장하면 GitHub Pages 배포에 반영됩니다.</span></div>'+
      '<div class="admin-list" data-'+kind+'-list><div class="admin-empty">목록을 불러오고 있습니다.</div></div>';
    return wrap;
  };
  const newsManager=createManager('news','게시된 뉴스 및 임시저장 글','제목·언론사·키워드 검색');
  const caseManager=createManager('cases','업무사례 목록','제목·분야·결과 검색');
  newsPanel.appendChild(newsManager);casePanel.appendChild(caseManager);

  function render(kind){
    const items=data[kind],query=fieldValue(kind,'search').toLowerCase();
    const filtered=items.filter(x=>[x.title,x.source,x.summary,x.meta1,x.meta2,x.result].some(v=>String(v||'').toLowerCase().includes(query)));
    const counter=$('[data-'+kind+'-count]');
    if(counter)counter.textContent=items.length+'건 · 공개 '+items.filter(x=>status(x)==='published').length+'건 · 임시저장 '+items.filter(x=>status(x)==='draft').length+'건';
    const root=$('[data-'+kind+'-list]');
    if(!root)return;
    root.innerHTML=filtered.length?filtered.map(item=>{
      const id=esc(item.id||''),isStatic=kind==='cases'&&item.legacy;
      const link=kind==='cases'?navHref(item):item.href||item.url||'#';
      const safeLink=trustedURL(link,true)?link:'#';
      const original=kind==='news'&&/^\.\.\/news\d+\//.test(item.href||'');
      const subtitle=kind==='news'?(item.source||'')+' · '+(item.date||''):(item.meta1||'업무사례')+' · '+(item.result||'');
      return '<div class="admin-list-item admin-cms-row" data-record-id="'+id+'">'+
        '<div class="admin-cms-row__copy"><div class="admin-cms-row__labels"><span class="admin-cms-state '+(status(item)==='draft'?'is-draft':'')+'">'+labelStatus(item)+'</span>'+
        ((isStatic||original)?'<span class="admin-cms-label">기존 HTML 상세</span>':'')+'</div>'+
        '<strong>'+esc(item.title||'제목 없음')+'</strong><span>'+esc(subtitle)+'</span></div>'+
        '<div class="admin-cms-row__actions">'+
        '<a class="admin-btn" target="_blank" rel="noopener noreferrer" href="'+esc(safeLink)+'">보기</a>'+
        '<button type="button" class="admin-btn" data-cms-edit="'+id+'">수정</button>'+
        '<button type="button" class="admin-btn" data-cms-toggle="'+id+'">'+(status(item)==='draft'?'공개':'비공개')+'</button>'+
        '<button type="button" class="admin-btn danger" data-cms-delete="'+id+'">삭제</button>'+
        '</div></div>';
    }).join(''):'<div class="admin-empty">검색 결과가 없습니다.</div>';
  }
  async function reload(kind,quiet=false){
    try{
      data[kind]=hasToken()?(await readRepo(pathFor(kind))).data:await readPublic(pathFor(kind));
      render(kind);
      if(!quiet)notify((kind==='news'?'뉴스':'업무사례')+' 목록을 새로고침했습니다.');
      updateDashboardCounters();
    }catch(e){
      const list=$('[data-'+kind+'-list]');
      if(list)list.innerHTML='<div class="admin-empty">'+esc(e.message)+'</div>';
      if(!quiet)notify(e.message);
    }
  }
  function updateDashboardCounters(){
    if($('[data-kpi-news]'))$('[data-kpi-news]').textContent=data.news.filter(x=>status(x)==='published').length;
    if($('[data-kpi-cases]'))$('[data-kpi-cases]').textContent=data.cases.filter(x=>status(x)==='published').length;
  }
  function cancel(kind){
    editing[kind]=null;
    const keys=kind==='news'?['url','title','source','date','summary','image','href']:['title','summary','meta1','meta2','result','tags','overview','strategy','result-body','point'];
    keys.forEach(k=>setField(kind==='news'?'news':'case',k,''));
    if(kind==='news'){setField('news','category','firm');setField('news','status','published');setField('news','date',today());}
    else{setField('case','category','criminal');setField('case','extra-category','');setField('case','status','published');}
    const cancelBtn=$('[data-'+(kind==='news'?'news':'case')+'-cancel]');
    if(cancelBtn)cancelBtn.hidden=true;
    const submit=$('[data-publish-'+(kind==='news'?'news':'case')+']');
    if(submit)submit.textContent=kind==='news'?'뉴스 게시 / 저장':'업무사례 게시 / 저장';
    if(kind==='news')$('[data-news-preview]')?.replaceChildren();
  }
  function edit(kind,id){
    const item=data[kind].find(x=>String(x.id)===String(id));
    if(!item)return;
    editing[kind]=id;
    if(kind==='news'){
      ['url','title','source','summary','image'].forEach(key=>setField('news',key,item[key]||''));
      setField('news','href',item.href&&item.href!==item.url?item.href:'');
      setField('news','date',/^\d{4}[-.]\d{2}[-.]\d{2}$/.test(item.date||'')?String(item.date).replace(/\./g,'-'):'');
      setField('news','category',item.category||'firm');setField('news','status',status(item));
    }else{
      ['title','summary','meta1','meta2','result','overview','strategy','point'].forEach(k=>setField('case',k,item[k]||''));
      setField('case','result-body',item.resultBody||'');
      setField('case','tags',Array.isArray(item.tags)?item.tags.join(', '):'');
      setField('case','category',item.categories?.[0]||'corporate');setField('case','extra-category',item.categories?.[1]||'');setField('case','status',status(item));
    }
    const c=$('[data-'+(kind==='news'?'news':'case')+'-cancel]');
    const submit=$('[data-publish-'+(kind==='news'?'news':'case')+']');
    if(c)c.hidden=false;if(submit)submit.textContent='수정 내용 저장';
    if(kind==='news')$('[data-news-title]')?.dispatchEvent(new Event('input'));
    const heading=(kind==='news'?$('[data-news-title]'):$('[data-case-title]'));
    heading?.scrollIntoView({behavior:'smooth',block:'center'});
    heading?.focus({preventScroll:true});
    if(kind==='cases'&&item.legacy)notify('기존 14개 사례의 목록 정보만 수정됩니다. /cases/caseN/ 정적 상세 HTML은 별도 수정이 필요합니다.');
    if(kind==='news'&&item.href&&item.href.startsWith('../news'))notify('기존 뉴스 상세 HTML은 별도 파일입니다. 목록 데이터만 갱신됩니다.');
  }
  const panelMap={news:newsManager,cases:caseManager};
  for(const kind of ['news','cases']){
    panelMap[kind].addEventListener('input',e=>{
      if(e.target.matches('[data-'+kind+'-search]'))render(kind);
    });
    panelMap[kind].addEventListener('click',async e=>{
      const refresh=e.target.closest('[data-'+kind+'-refresh]');
      if(refresh)return reload(kind);
      const editBtn=e.target.closest('[data-cms-edit]');
      if(editBtn)return edit(kind,editBtn.dataset.cmsEdit);
      const toggle=e.target.closest('[data-cms-toggle]');
      const del=e.target.closest('[data-cms-delete]');
      if(!toggle&&!del)return;
      const id=(toggle||del).dataset[toggle?'cmsToggle':'cmsDelete'];
      const item=data[kind].find(x=>String(x.id)===String(id));
      if(!item)return;
      if(!hasToken())return notify('수정하려면 GitHub 토큰을 연결해주세요.');
      const legacyNotice=(item.legacy||(/^..\//.test(item.href||'')))?' (기존 정적 HTML 상세페이지는 그대로 유지됩니다.)':'';
      const message=toggle?(status(item)==='draft'?'공개 전환':'목록 비노출 전환'):'삭제';
      if(!confirm('“'+item.title+'” '+message+'할까요?'+legacyNotice))return;
      const button=toggle||del;button.disabled=true;
      try{
        await modify(kind,list=>{
          const target=list.find(x=>String(x.id)===String(id));
          if(!target)throw new Error('대상이 이미 삭제되었습니다. 새로고침 후 다시 시도해주세요.');
          if(toggle){target.status=status(target)==='draft'?'published':'draft';return list}
          return list.filter(x=>String(x.id)!==String(id));
        },(toggle?'Change publication status: ':'Remove CMS entry: ')+item.title);
        if(editing[kind]===id)cancel(kind);
        notify(message+' 완료 · 페이지 반영은 배포 후 확인해주세요.');
        await reload(kind,true);
      }catch(err){notify(err.message)}finally{button.disabled=false}
    });
  }
  $('[data-news-cancel]')?.addEventListener('click',()=>cancel('news'));
  $('[data-case-cancel]')?.addEventListener('click',()=>cancel('cases'));

  let busy=false;
  async function saveNews(){
    const url=fieldValue('news','url'),title=fieldValue('news','title');
    if(!title||!url)return notify('기사 제목과 원문 URL을 입력해주세요.');
    if(!trustedURL(url))return notify('기사 URL은 https:// 또는 http://로 시작해야 합니다.');
    const image=fieldValue('news','image'),href=fieldValue('news','href');
    if(!trustedURL(image)||!trustedURL(href,true))return notify('이미지 URL 또는 내부 상세 링크 형식을 확인해주세요.');
    const id=editing.news,prev=data.news.find(x=>String(x.id)===String(id));
    if(!id&&!get('[data-news-date]'))return notify('게시일을 선택해주세요.');
    const record={
      ...(prev||{}),id:id||'news-'+Date.now(),title,url,source:fieldValue('news','source'),
      date:(fieldValue('news','date')?fieldValue('news','date').replace(/-/g,'.'):(prev?.date||today().replace(/-/g,'.'))),
      summary:fieldValue('news','summary'),image,category:fieldValue('news','category')||'firm',
      status:fieldValue('news','status')||'published',
      createdAt:prev?.createdAt||new Date().toISOString(),
      updatedAt:new Date().toISOString()
    };
    if(href)record.href=href;else delete record.href;
    await modify('news',arr=>{
      if(id){const p=arr.findIndex(x=>String(x.id)===String(id));if(p<0)throw new Error('수정할 뉴스를 찾을 수 없습니다.');arr[p]=record;}
      else arr.unshift(record);
      return arr;
    },(id?'Edit news: ':'Publish news: ')+title);
    cancel('news');
    notify('뉴스 저장 완료 · 배포 후 뉴스룸에 반영됩니다.');
    await reload('news',true);
  }
  async function saveCase(){
    const title=fieldValue('case','title'),summary=fieldValue('case','summary');
    if(!title||!summary)return notify('사례 제목과 요약은 필수입니다.');
    const id=editing.cases,prev=data.cases.find(x=>String(x.id)===String(id));
    const category=fieldValue('case','category')||'corporate';
    const extra=fieldValue('case','extra-category');
    const categories=[category,...(extra&&extra!==category?[extra]:[])];
    const record={
      ...(prev||{}),id:id||'case-'+Date.now(),title,summary,
      meta1:fieldValue('case','meta1')||region[category]||'업무사례',
      meta2:fieldValue('case','meta2'),result:fieldValue('case','result'),
      tags:fieldValue('case','tags').split(',').map(x=>x.trim()).filter(Boolean),
      categories,
      overview:fieldValue('case','overview'),strategy:fieldValue('case','strategy'),
      resultBody:fieldValue('case','result-body'),point:fieldValue('case','point'),
      status:fieldValue('case','status')||'published',
      createdAt:prev?.createdAt||new Date().toISOString(),
      updatedAt:new Date().toISOString()
    };
    await modify('cases',arr=>{
      if(id){const p=arr.findIndex(x=>String(x.id)===String(id));if(p<0)throw new Error('수정할 업무사례를 찾을 수 없습니다.');arr[p]=record;}
      else arr.unshift(record);
      return arr;
    },(id?'Edit case: ':'Publish case: ')+title);
    cancel('cases');
    notify('업무사례 저장 완료 · 배포 후 홈페이지에 반영됩니다.');
    await reload('cases',true);
  }
  const clickSave=async(kind,event)=>{
    if(event)event.preventDefault();
    if(busy)return;
    if(!hasToken())return notify('먼저 사이트 상태에서 GitHub 토큰을 연결해주세요.');
    busy=true;
    const button=$('[data-publish-'+(kind==='news'?'news':'case')+']');
    if(button)button.disabled=true;
    try{if(kind==='news')await saveNews();else await saveCase();}
    catch(e){notify(e.message)}
    finally{busy=false;if(button)button.disabled=false}
  };
  $('[data-publish-news]')?.addEventListener('click',e=>clickSave('news',e));
  $('[data-publish-case]')?.addEventListener('click',e=>clickSave('cases',e));
  document.addEventListener('ptg-admin-connected',()=>{reload('news',true);reload('cases',true)});
  document.addEventListener('ptg-admin-disconnected',()=>{reload('news',true);reload('cases',true)});
  // The CMS works in read-only mode without a token, so it can be inspected before authentication.
  Promise.all([reload('news',true),reload('cases',true)]).then(()=>{});
})();