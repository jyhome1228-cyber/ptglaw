(async()=>{
  const base=location.hostname.endsWith('github.io')?'/ptglaw':'';
  let settings={};
  try{const r=await fetch(`${base}/content/settings.json?v=${Date.now()}`,{cache:'no-store'});if(r.ok)settings=await r.json()}catch(e){}
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