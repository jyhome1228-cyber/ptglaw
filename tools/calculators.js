(()=>{
  const format=n=>Math.round(Number(n)||0).toLocaleString('ko-KR');
  const parse=v=>Number(String(v||'').replace(/[^0-9.-]/g,''))||0;
  const bindMoneyInput=(input,onChange)=>{
    const render=()=>{const n=parse(input.value);input.value=n?format(n):'';onChange(n)};
    input.addEventListener('input',render);render();
  };

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
      tax.textContent=`${format(income)}원`;
      local.textContent=`${format(localTax)}원`;
      total.textContent=`${format(withheld)}원`;
      net.textContent=`${format(takeHome)}원`;
    };
    bindMoneyInput(input,calc);
    tabs.forEach(btn=>btn.addEventListener('click',()=>{
      mode=btn.dataset.mode;
      tabs.forEach(x=>x.classList.toggle('is-active',x===btn));
      withholding.querySelector('[data-input-label]').textContent=mode==='gross'?'지급 예정 금액':'원하는 실수령액';
      calc(parse(input.value));
    }));
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
      if(mode==='supply'){
        s=value;v=Math.round(s*0.1);t=s+v;
      }else{
        t=value;s=Math.round(t/1.1);v=t-s;
      }
      supply.textContent=`${format(s)}원`;
      tax.textContent=`${format(v)}원`;
      total.textContent=`${format(t)}원`;
    };
    bindMoneyInput(input,calc);
    tabs.forEach(btn=>btn.addEventListener('click',()=>{
      mode=btn.dataset.mode;
      tabs.forEach(x=>x.classList.toggle('is-active',x===btn));
      vat.querySelector('[data-input-label]').textContent=mode==='supply'?'공급가액':'부가세 포함 금액';
      calc(parse(input.value));
    }));
  }
})();