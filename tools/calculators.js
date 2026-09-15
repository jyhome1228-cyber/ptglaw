(()=>{
  const format=n=>Math.round(Number(n)||0).toLocaleString('ko-KR');
  const parse=v=>Number(String(v||'').replace(/[^0-9.-]/g,''))||0;
  const money=n=>`${format(n)}원`;
  const bindMoneyInput=(input,onChange)=>{
    const render=()=>{const n=parse(input.value);input.value=n?format(n):'';onChange(n)};
    input.addEventListener('input',render);render();
  };
  const progressive=(base,brackets)=>{
    const x=Math.max(0,Number(base)||0);
    for(const row of brackets){if(x<=row.limit)return Math.max(0,x*row.rate-row.deduct)}
    const last=brackets[brackets.length-1];return Math.max(0,x*last.rate-last.deduct);
  };
  const BASIC_RATES=[
    {limit:14000000,rate:.06,deduct:0},
    {limit:50000000,rate:.15,deduct:1260000},
    {limit:88000000,rate:.24,deduct:5760000},
    {limit:150000000,rate:.35,deduct:15440000},
    {limit:300000000,rate:.38,deduct:19940000},
    {limit:500000000,rate:.40,deduct:25940000},
    {limit:1000000000,rate:.42,deduct:35940000},
    {limit:Infinity,rate:.45,deduct:65940000}
  ];
  const INHERIT_GIFT_RATES=[
    {limit:100000000,rate:.10,deduct:0},
    {limit:500000000,rate:.20,deduct:10000000},
    {limit:1000000000,rate:.30,deduct:60000000},
    {limit:3000000000,rate:.40,deduct:160000000},
    {limit:Infinity,rate:.50,deduct:460000000}
  ];

  const withholding=document.querySelector('[data-withholding-calculator]');
  if(withholding){
    const input=withholding.querySelector('[data-amount]');
    const tax=withholding.querySelector('[data-tax]');
    const local=withholding.querySelector('[data-local-tax]');
    const total=withholding.querySelector('[data-withheld]');
    const net=withholding.querySelector('[data-net]');
    const tabs=[...withholding.querySelectorAll('[data-mode]')];
    let mode='gross';
    const calc=value=>{
      let gross=value;
      if(mode==='net') gross=value/0.967;
      const income=Math.floor(gross*0.03/10)*10;
      const localTax=Math.floor(income*0.1/10)*10;
      const withheld=income+localTax;
      const takeHome=Math.max(0,Math.round(gross-withheld));
      tax.textContent=money(income);local.textContent=money(localTax);total.textContent=money(withheld);net.textContent=money(takeHome);
    };
    bindMoneyInput(input,calc);
    tabs.forEach(btn=>btn.addEventListener('click',()=>{mode=btn.dataset.mode;tabs.forEach(x=>x.classList.toggle('is-active',x===btn));withholding.querySelector('[data-input-label]').textContent=mode==='gross'?'지급 예정 금액':'원하는 실수령액';calc(parse(input.value));}));
  }

  const vat=document.querySelector('[data-vat-calculator]');
  if(vat){
    const input=vat.querySelector('[data-amount]');
    const supply=vat.querySelector('[data-supply]');
    const tax=vat.querySelector('[data-vat]');
    const total=vat.querySelector('[data-total]');
    const tabs=[...vat.querySelectorAll('[data-mode]')];
    let mode='supply';
    const calc=value=>{
      let s=0,v=0,t=0;
      if(mode==='supply'){s=value;v=Math.round(s*.1);t=s+v}else{t=value;s=Math.round(t/1.1);v=t-s}
      supply.textContent=money(s);tax.textContent=money(v);total.textContent=money(t);
    };
    bindMoneyInput(input,calc);
    tabs.forEach(btn=>btn.addEventListener('click',()=>{mode=btn.dataset.mode;tabs.forEach(x=>x.classList.toggle('is-active',x===btn));vat.querySelector('[data-input-label]').textContent=mode==='supply'?'공급가액':'부가세 포함 금액';calc(parse(input.value));}));
  }

  const corporate=document.querySelector('[data-corporate-registration-calculator]');
  if(corporate){
    const capital=corporate.querySelector('[data-capital]');
    const region=corporate.querySelector('[data-region]');
    const reg=corporate.querySelector('[data-registration-tax]');
    const edu=corporate.querySelector('[data-education-tax]');
    const total=corporate.querySelector('[data-public-total]');
    let capitalValue=0;
    const calc=()=>{
      const base=Math.max(capitalValue*.004,112500);
      const registration=Math.round(base*(region.value==='metro'?3:1));
      const education=Math.round(registration*.2);
      reg.textContent=money(registration);edu.textContent=money(education);total.textContent=money(registration+education);
    };
    bindMoneyInput(capital,n=>{capitalValue=n;calc()});
    region.addEventListener('change',calc);calc();
  }

  const severance=document.querySelector('[data-severance-calculator]');
  if(severance){
    const start=severance.querySelector('[data-start-date]');
    const end=severance.querySelector('[data-end-date]');
    const wages=severance.querySelector('[data-three-month-wages]');
    const avgDays=severance.querySelector('[data-average-days]');
    const service=severance.querySelector('[data-service-days]');
    const avg=severance.querySelector('[data-average-wage]');
    const total=severance.querySelector('[data-severance-total]');
    const status=severance.querySelector('[data-severance-status]');
    let wageValue=0;
    const calc=()=>{
      let days=0;
      if(start.value&&end.value){const a=new Date(start.value+'T00:00:00'),b=new Date(end.value+'T00:00:00');days=Math.max(0,Math.round((b-a)/86400000));}
      const divisor=Math.max(1,parse(avgDays.value)||92);
      const daily=wageValue/divisor;
      const amount=daily*30*(days/365);
      service.textContent=`${format(days)}일`;avg.textContent=money(daily);total.textContent=money(amount);
      if(status)status.textContent=days>=365?'1년 이상 계속근로 기준 충족 여부를 추가 확인하세요.':'재직 1년 미만으로 일반적인 법정 퇴직금 대상이 아닐 수 있습니다.';
    };
    bindMoneyInput(wages,n=>{wageValue=n;calc()});
    [start,end,avgDays].forEach(el=>el.addEventListener('input',calc));calc();
  }

  const asset=document.querySelector('[data-asset-tax-calculator]');
  if(asset){
    const tabs=[...asset.querySelectorAll('[data-tax-mode]')];
    const panels=[...asset.querySelectorAll('[data-tax-panel]')];
    const setMode=mode=>{tabs.forEach(x=>x.classList.toggle('is-active',x.dataset.taxMode===mode));panels.forEach(x=>x.hidden=x.dataset.taxPanel!==mode)};
    tabs.forEach(btn=>btn.addEventListener('click',()=>setMode(btn.dataset.taxMode)));

    const transfer=asset.querySelector('[data-tax-panel="transfer"]');
    if(transfer){
      const sale=transfer.querySelector('[data-sale]'),purchase=transfer.querySelector('[data-purchase]'),expenses=transfer.querySelector('[data-expenses]'),holding=transfer.querySelector('[data-holding]');
      const gain=transfer.querySelector('[data-gain]'),taxable=transfer.querySelector('[data-taxable]'),national=transfer.querySelector('[data-national]'),local=transfer.querySelector('[data-local]'),total=transfer.querySelector('[data-tax-total]');
      let s=0,p=0,e=0;
      const calc=()=>{const g=Math.max(0,s-p-e);const base=Math.max(0,g-2500000);let n=0;if(holding.value==='under1')n=base*.5;else if(holding.value==='under2')n=base*.4;else n=progressive(base,BASIC_RATES);const l=n*.1;gain.textContent=money(g);taxable.textContent=money(base);national.textContent=money(n);local.textContent=money(l);total.textContent=money(n+l)};
      bindMoneyInput(sale,n=>{s=n;calc()});bindMoneyInput(purchase,n=>{p=n;calc()});bindMoneyInput(expenses,n=>{e=n;calc()});holding.addEventListener('change',calc);calc();
    }

    const gift=asset.querySelector('[data-tax-panel="gift"]');
    if(gift){
      const amount=gift.querySelector('[data-gift-amount]'),relation=gift.querySelector('[data-gift-relation]'),deduction=gift.querySelector('[data-gift-deduction]'),taxable=gift.querySelector('[data-gift-taxable]'),tax=gift.querySelector('[data-gift-tax]');
      let value=0;
      const calc=()=>{const d=parse(relation.value);const base=Math.max(0,value-d);deduction.textContent=money(d);taxable.textContent=money(base);tax.textContent=money(progressive(base,INHERIT_GIFT_RATES))};
      bindMoneyInput(amount,n=>{value=n;calc()});relation.addEventListener('change',calc);calc();
    }

    const inheritance=asset.querySelector('[data-tax-panel="inheritance"]');
    if(inheritance){
      const estate=inheritance.querySelector('[data-estate]'),deduct=inheritance.querySelector('[data-inheritance-deduction]'),taxable=inheritance.querySelector('[data-inheritance-taxable]'),tax=inheritance.querySelector('[data-inheritance-tax]');
      let e=0,d=0;
      const calc=()=>{const base=Math.max(0,e-d);taxable.textContent=money(base);tax.textContent=money(progressive(base,INHERIT_GIFT_RATES))};
      bindMoneyInput(estate,n=>{e=n;calc()});bindMoneyInput(deduct,n=>{d=n;calc()});calc();
    }
    setMode('transfer');
  }

  /* RESULT SHARE — common to all five calculators */
  const calcRoots=[withholding,vat,corporate,severance,asset].filter(Boolean);
  const pageTitle=document.querySelector('.ptg-tools-head h1')?.textContent.trim()||document.title.replace(/\s*\|.*$/,'');
  const cleanUrl=()=>`${location.origin}${location.pathname}`;
  const copyText=async text=>{
    try{await navigator.clipboard.writeText(text);return true}catch(e){
      const ta=document.createElement('textarea');ta.value=text;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();const ok=document.execCommand('copy');ta.remove();return ok;
    }
  };
  const toast=(box,message)=>{
    const el=box.querySelector('.ptg-share-toast');
    if(!el)return;
    el.textContent=message;el.classList.add('is-show');
    clearTimeout(el._timer);el._timer=setTimeout(()=>el.classList.remove('is-show'),2200);
  };
  const getFieldLines=scope=>[...scope.querySelectorAll('.ptg-calc-field')].map(field=>{
    const label=field.querySelector('label')?.textContent.trim();
    const control=field.querySelector('input,select');
    if(!label||!control)return null;
    let value='';
    if(control.tagName==='SELECT')value=control.options[control.selectedIndex]?.textContent.trim()||'';
    else value=control.value.trim();
    const unit=field.querySelector('.ptg-calc-input>span')?.textContent.trim()||'';
    return `${label}: ${value}${value&&unit?unit:''}`;
  }).filter(Boolean);
  const getShareText=result=>{
    const panel=result.closest('[data-tax-panel]');
    const scope=panel||result.closest('.ptg-calc-panel')||result.parentElement;
    const root=result.closest('[data-withholding-calculator],[data-vat-calculator],[data-corporate-registration-calculator],[data-severance-calculator],[data-asset-tax-calculator]');
    const activeMode=panel
      ? root?.querySelector(`[data-tax-mode="${panel.dataset.taxPanel}"]`)?.textContent.trim()
      : root?.querySelector('.ptg-calc-tabs .is-active')?.textContent.trim();
    const inputLines=getFieldLines(scope);
    const resultLines=[...result.querySelectorAll('.ptg-calc-row')].map(row=>{
      const label=row.querySelector('span')?.textContent.trim();
      const value=row.querySelector('strong')?.textContent.trim();
      return label&&value?`${label}: ${value}`:null;
    }).filter(Boolean);
    return [
      `[펜타곤 ${pageTitle}]`,
      activeMode?`계산 방식: ${activeMode}`:'',
      inputLines.length?'\n[입력값]':'',
      ...inputLines,
      resultLines.length?'\n[계산 결과]':'',
      ...resultLines,
      `\n계산기 링크: ${cleanUrl()}`,
      '※ 계산 결과는 참고용이며 실제 세무·법률 판단은 개별 사실관계에 따라 달라질 수 있습니다.'
    ].filter(Boolean).join('\n');
  };
  const addShare= result=>{
    if(result.nextElementSibling?.classList.contains('ptg-result-share'))return;
    const box=document.createElement('div');
    box.className='ptg-result-share';
    box.innerHTML=`<div class="ptg-result-share__head"><strong>결과 공유하기</strong><span>현재 계산 결과를 간편하게 전달할 수 있습니다.</span></div><div class="ptg-result-share__actions"><button type="button" data-share-kakao>카카오톡 공유</button><button type="button" data-share-link>링크 공유하기</button><button type="button" data-share-text>텍스트 복사하기</button></div><div class="ptg-share-toast" role="status" aria-live="polite"></div>`;
    result.insertAdjacentElement('afterend',box);
    box.querySelector('[data-share-kakao]').addEventListener('click',async()=>{
      const text=getShareText(result);
      if(navigator.share){
        try{await navigator.share({title:pageTitle,text,url:cleanUrl()});return}catch(e){if(e?.name==='AbortError')return;}
      }
      await copyText(text);toast(box,'공유 내용을 복사했습니다. 카카오톡에 붙여넣어 주세요.');
    });
    box.querySelector('[data-share-link]').addEventListener('click',async()=>{
      const url=cleanUrl();
      if(navigator.share){
        try{await navigator.share({title:pageTitle,url});return}catch(e){if(e?.name==='AbortError')return;}
      }
      await copyText(url);toast(box,'계산기 링크를 복사했습니다.');
    });
    box.querySelector('[data-share-text]').addEventListener('click',async()=>{
      await copyText(getShareText(result));toast(box,'계산 결과 텍스트를 복사했습니다.');
    });
  };
  calcRoots.forEach(root=>root.querySelectorAll('.ptg-calc-result').forEach(addShare));
})();