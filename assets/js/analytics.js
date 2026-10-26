(async()=>{
  const base=location.hostname.endsWith('github.io')?'/ptglaw':'';
  // First-party analytics: one daily visit per browser, as in FINE.B.
  // Pageviews are retained separately in the existing visitorEvents collection.
  const validHost=['ptglaw.co.kr','www.ptglaw.co.kr','jyhome1228-cyber.github.io'].includes(location.hostname);
  const automated=/bot|crawler|spider|headless|lighthouse|pagespeed/i.test(navigator.userAgent);
  const privacyOptOut=navigator.doNotTrack==='1'||navigator.globalPrivacyControl===true;
  const path=location.pathname.replace(/[^a-zA-Z0-9/_-]/g,'').slice(0,180)||'/';
  if(validHost&&!path.includes('/admin/')&&!automated&&!privacyOptOut){
    try{
      const {db}=await import('./firebase-client.js');
      const {collection,addDoc,serverTimestamp}=await import('https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js');
      const browserKey='ptgVisitorIdV2';
      let sid;
      try{sid=localStorage.getItem(browserKey)}catch(_){}
      if(!sid||!/^[-a-f0-9]{36}$/i.test(sid)){
        sid=crypto.randomUUID();
        try{localStorage.setItem(browserKey,sid)}catch(_){}
      }
      // One unique visit per calendar day. A pageview is still recorded for each route.
      const day=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
      const eventKey='ptgEvent:'+day+':'+path;
      let seen=false;
      try{seen=sessionStorage.getItem(eventKey)==='1'}catch(_){}
      if(!seen){
        await addDoc(collection(db,'visitorEvents'),{sessionId:sid,path,createdAt:serverTimestamp()});
        try{sessionStorage.setItem(eventKey,'1')}catch(_){}
      }
    }catch(err){
      console.warn('[PTG visitor tracker]',err.code||err.message);
    }
  }
  // Optional GA4 settings must never delay first-party visit collection.
  let settings={};
  try{
    const controller=new AbortController();
    const abort=setTimeout(()=>controller.abort(),2500);
    try{const response=await fetch(`${base}/content/settings.json`,{cache:'no-store',signal:controller.signal});if(response.ok)settings=await response.json()}
    finally{clearTimeout(abort)}
  }catch(err){console.info('GA4 settings unavailable; first-party analytics remains independent.')}
  const id=String(settings.ga4MeasurementId||'').trim();
  if(!/^G-[A-Z0-9]+$/i.test(id))return;
  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){dataLayer.push(arguments)};
  const s=document.createElement('script');s.async=true;s.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;document.head.appendChild(s);
  gtag('js',new Date());gtag('config',id,{anonymize_ip:true});
  const event=(name,params={})=>gtag('event',name,{page_path:location.pathname,...params});
  document.addEventListener('click',e=>{
    const a=e.target.closest('a,button');if(!a)return;
    const href=a.getAttribute('href')||'';
    if(href.startsWith('tel:'))event('contact_click',{method:'phone'});
    else if(href.startsWith('mailto:'))event('contact_click',{method:'email'});
    else if(href.includes('/contact/'))event('contact_click',{method:'contact_page'});
  });
  let calcTracked=false;
  document.addEventListener('input',e=>{
    if(calcTracked)return;
    if(e.target.closest('[data-withholding-calculator],[data-vat-calculator]')){calcTracked=true;event('calculator_use',{tool:location.pathname.includes('withholding')?'withholding':'vat'})}
  });
  if(/\/cases\/(case\d+|view)\/?/.test(location.pathname))event('content_view',{content_type:'case'});
  if(/\/news\d+\/?/.test(location.pathname))event('content_view',{content_type:'news'});
})();