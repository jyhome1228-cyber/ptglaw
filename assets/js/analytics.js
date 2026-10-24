(async()=>{
  const base=location.hostname.endsWith('github.io')?'/ptglaw':'';
  let settings={};
  try{const r=await fetch(`${base}/content/settings.json?v=${Date.now()}`,{cache:'no-store'});if(r.ok)settings=await r.json()}catch(e){}
  const id=String(settings.ga4MeasurementId||'').trim();
  // Minimal first-party pageview logging, independent of optional GA4.
  // Session-based counts; no IP or contact information is stored.
  const validHost=location.hostname==='ptglaw.co.kr'||location.hostname==='www.ptglaw.co.kr'||location.hostname==='jyhome1228-cyber.github.io';
  const privacyOptOut=navigator.doNotTrack==='1'||navigator.globalPrivacyControl===true;
  const automated=/bot|crawler|spider|headless|lighthouse|pagespeed/i.test(navigator.userAgent);
  const route=location.pathname;
  const recentKey='ptgVisitLastRoute';
  const recent=sessionStorage.getItem(recentKey)||'';
  const recentTime=Number(sessionStorage.getItem('ptgVisitLastTime')||0);
  const shouldRecord=validHost&&!route.includes('/admin/')&&!privacyOptOut&&!automated&&document.visibilityState!=='prerender'&&!(recent===route&&Date.now()-recentTime<30000);
  if(shouldRecord){
    try{
      const {db}=await import('./firebase-client.js');
      const {collection,addDoc,serverTimestamp}=await import('https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js');
      let sid=sessionStorage.getItem('ptgVisitorSession');
      if(!sid||!/^[-a-f0-9]{36}$/i.test(sid)){sid=crypto.randomUUID();sessionStorage.setItem('ptgVisitorSession',sid)}
      const path=location.pathname.replace(/[^a-zA-Z0-9/_-]/g,'').slice(0,180)||'/';
      await addDoc(collection(db,'visitorEvents'),{sessionId:sid,path,createdAt:serverTimestamp()});
      sessionStorage.setItem(recentKey,route);
      sessionStorage.setItem('ptgVisitLastTime',String(Date.now()));
    }catch(err){console.warn('Visitor analytics unavailable:',err.code||err.message)}
  }
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