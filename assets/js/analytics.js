(async()=>{
  const base=location.hostname.endsWith('github.io')?'/ptglaw':'';
  // One anonymous browser visit per Korea calendar day (FINE.B-style).
  // No visitorEvents collection, no personal/contact data, and no visitor read access.
  const acceptedHosts=new Set(['ptglaw.co.kr','www.ptglaw.co.kr','jyhome1228-cyber.github.io']);
  if(acceptedHosts.has(location.hostname)&&!location.pathname.includes('/admin/')&&
     navigator.doNotTrack!=='1'&&navigator.globalPrivacyControl!==true&&
     !/bot|crawler|spider|headless|lighthouse|pagespeed/i.test(navigator.userAgent)){
    try{
      const dayParts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
      const dayMap=Object.fromEntries(dayParts.map(x=>[x.type,x.value]));
      const date=dayMap.year+'-'+dayMap.month+'-'+dayMap.day;
      const storedKey='ptgDailyVisit:'+date;
      let already=false;
      try{already=localStorage.getItem(storedKey)==='1'}catch(_){}
      if(!already){
        const {db}=await import('./firebase-client.js');
        const {addDoc,collection,serverTimestamp}=await import('https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js');
        let visitorId;
        try{visitorId=localStorage.getItem('ptgVisitorIdV2')}catch(_){}
        if(!visitorId||!/^[-a-f0-9]{36}$/i.test(visitorId)){
          visitorId=crypto.randomUUID();
          try{localStorage.setItem('ptgVisitorIdV2',visitorId)}catch(_){}
        }
        await addDoc(collection(db,'visits'),{
          visitorId,date,firstPath:location.pathname.replace(/[^a-zA-Z0-9/_-]/g,'').slice(0,160)||'/',
          createdAt:serverTimestamp()
        });
        try{localStorage.setItem(storedKey,'1')}catch(_){}
      }
    }catch(err){console.warn('Visit registration unsuccessful:',err.code||err.message)}
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