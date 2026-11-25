/* Isolated sample scenarios embedded inside the full Mercek application. */
(() => {
  const style = "\n:host{display:block;--bg:#0b1017;--card:#141c27;--card2:#192331;--line:#303f4f;--text:#eef3fa;--muted:#a6b5c7;--green:#b6f36a;--teal:#64dec0;--gold:#f2ca80}\n*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:16px/1.45 Inter,-apple-system,BlinkMacSystemFont,\"Segoe UI\",sans-serif}main, .bar{width:min(1160px,calc(100% - 40px));margin:auto}\nheader{border-bottom:1px solid var(--line)}.bar{min-height:68px;display:flex;align-items:center;justify-content:space-between;gap:12px}.brand{display:flex;align-items:center;gap:11px;font-weight:850;letter-spacing:.08em}.brand b{font-size:1.05rem}.mark{width:34px;height:34px;border-radius:9px;background:var(--green);position:relative}.mark:before{content:\"\";position:absolute;border:2px solid #192819;border-radius:50%;width:11px;height:11px;top:8px;left:8px}.mark:after{content:\"\";position:absolute;background:#192819;width:8px;height:2px;left:19px;top:22px;transform:rotate(45deg)}\nmain{padding:20px 0 42px}p,h1,h2,h3,dl,dd{margin:0}p,dt,small{color:var(--muted)}h2{font-size:1.15rem}h3{font-size:.97rem}a{color:var(--green);text-underline-offset:3px}button,select{font:inherit;color:var(--text);background:var(--card2);border:1px solid var(--line);padding:8px 12px;min-height:44px;border-radius:9px}button{cursor:pointer;font-weight:650}button[aria-pressed=true]{border-color:var(--green);color:var(--green);background:#22362b}button:hover{border-color:var(--green)}:focus-visible{outline:2px solid var(--green);outline-offset:3px}.notice{border:1px solid #645238;background:#211c16;color:var(--gold);border-radius:10px;padding:8px 13px;font-size:.9rem}\n.hero{margin-top:12px;border:1px solid #334a4b;border-radius:20px;background:radial-gradient(ellipse at 95% 0%,#27494a,transparent 65%),#141f28;padding:clamp(18px,3.3vw,38px)}.hero h1{font-size:clamp(2rem,5.3vw,3.9rem);line-height:1.04;letter-spacing:-.055em;margin:4px 0 9px}.tag{color:var(--green);font-size:.87rem;font-weight:700}.panel{margin-top:12px;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px;min-width:0}.panel-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:10px}.badge{display:inline-flex;border:1px solid var(--line);padding:4px 9px;border-radius:30px;color:var(--muted);font-size:.8rem}.row-actions{display:flex;gap:7px;flex-wrap:wrap;align-items:center}\n.table-scroll{overflow-x:auto}table{width:100%;border-collapse:collapse;text-align:left}th,td{padding:8px;border-bottom:1px solid var(--line);vertical-align:top;font-size:.9rem}th{color:var(--muted);font-weight:650}tbody th{color:var(--text)}td strong{display:block}.comparison td:nth-child(2),.comparison td:nth-child(3){width:23%}.comparison td:nth-child(4){width:39%;color:var(--muted)}.active{color:var(--gold)}.closed{color:var(--teal)}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.grid .panel{margin-top:0}.grid{margin:12px 0}.metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:9px}.metrics>div{background:#0f1820;border:1px solid var(--line);border-radius:11px;padding:9px;overflow-wrap:anywhere}.metrics dt{font-size:.83rem}.metrics dd{font-weight:760;font-size:1.09rem}.meta{display:block;margin-top:9px;font-size:.82rem}.note{padding:9px 11px;margin-top:9px;border-left:3px solid var(--gold);color:var(--gold);background:#1c2024;font-size:.89rem}.clear{border-left-color:var(--teal);color:#b6dfd2}.minor{margin-top:8px;font-size:.86rem}.source{display:grid;grid-template-columns:auto minmax(0,1fr);gap:4px 14px;margin-top:10px}.source dt,.source dd{font-size:.86rem}.source dd{overflow-wrap:anywhere}.heading-label{font-size:.9rem;font-weight:650}.walletRows{margin-top:7px}.walletRows td:last-child,.walletRows th:last-child{text-align:right}.walletRows caption{text-align:left;color:var(--muted);font-size:.83rem;margin:4px 0}\n@media(max-width:720px){main,.bar{width:calc(100% - 24px)}.grid{grid-template-columns:1fr}.grid .panel{height:auto}.panel{padding:13px}.comparison table{min-width:620px}}\n";
  const markup = "\n<p class=\"notice\"><strong>Jüri önizlemesi · Örnek veri.</strong> Likidite, arz payı ve portföy değerleri örnek senaryolardır. Explorer bağlantıları gerçek mint adreslerini açar.</p>\n\n<section class=\"panel comparison\" aria-labelledby=\"compare-title\">\n<div class=\"panel-head\"><h2 id=\"compare-title\">USDC ve BONK’un yetkilerini karşılaştır</h2><span class=\"badge\">Kaynak · Solana RPC / Metaplex · örnek</span></div>\n<div class=\"table-scroll\"><table><thead><tr><th scope=\"col\">Gösterge</th><th scope=\"col\">USDC</th><th scope=\"col\">BONK</th><th scope=\"col\">Kullanıcı için anlamı</th></tr></thead><tbody>\n<tr><th scope=\"row\">Token üretme</th><td><strong class=\"active\">Aktif</strong></td><td><strong class=\"closed\">Kapalı</strong></td><td>Yetkili hesap yeni token üretebilir.</td></tr>\n<tr><th scope=\"row\">Hesap dondurma</th><td><strong class=\"active\">Aktif</strong></td><td><strong class=\"closed\">Kapalı</strong></td><td>Yetkili hesap belirli token hesaplarının transferini durdurabilir.</td></tr>\n<tr><th scope=\"row\">Metadata</th><td>Güncellenebilir</td><td>Güncellenebilir</td><td>Yetkili hesap ad, sembol veya tanıtım bağlantısını güncelleyebilir.</td></tr>\n<tr><th scope=\"row\">Zincir kaydı</th><td><a data-demo-explorer=\"USDC\" target=\"_blank\" rel=\"noopener noreferrer\">USDC Explorer</a></td><td><a data-demo-explorer=\"BONK\" target=\"_blank\" rel=\"noopener noreferrer\">BONK Explorer</a></td><td>Mint adresini ve zincir kaydını incele.</td></tr>\n</tbody></table></div>\n</section>\n<div class=\"grid\">\n<section class=\"panel\" aria-labelledby=\"market-title\">\n<div class=\"panel-head\"><h2 id=\"market-title\">Piyasa ve token hesapları</h2><div class=\"row-actions\"><button type=\"button\" data-token=\"USDC\" aria-pressed=\"true\">USDC</button><button type=\"button\" data-token=\"BONK\" aria-pressed=\"false\">BONK</button></div></div>\n<div class=\"row-actions\"><label class=\"heading-label\" for=\"provider\">Kaynak senaryosu</label><select id=\"provider\"><option value=\"backup\">DEX Screener kesintisi</option><option value=\"primary\">DEX Screener yanıt verdi</option><option value=\"none\">İki kaynak da erişilemiyor</option></select></div>\n<div aria-live=\"polite\">\n<dl class=\"metrics\"><div><dt>Havuz likiditesi</dt><dd id=\"liquidity\"></dd></div><div><dt>En büyük hesapların arz payı</dt><dd id=\"concentration\"></dd></div><div><dt>Ağırlıklı veri kapsamı</dt><dd id=\"coverage\"></dd></div></dl>\n<dl class=\"source\"><dt>Havuz</dt><dd id=\"pool\"></dd><dt>Piyasa kaynağı</dt><dd id=\"marketSource\"></dd><dt>Son veri zamanı</dt><dd id=\"dataTime\"></dd><dt>Hesap dağılımı</dt><dd id=\"chainSource\"></dd></dl>\n<p class=\"note\" id=\"marketNote\"></p>\n</div>\n</section>\n<section class=\"panel\" aria-labelledby=\"wallet-title\">\n<div class=\"panel-head\"><h2 id=\"wallet-title\">Cüzdan karnesi</h2><span class=\"badge\">Örnek portföy · Salt okunur</span></div>\n<div class=\"row-actions\" aria-label=\"Portföy senaryoları\"><button type=\"button\" data-wallet=\"complete\" aria-pressed=\"true\">Dolu portföy</button><button type=\"button\" data-wallet=\"empty\" aria-pressed=\"false\">Boş portföy</button><button type=\"button\" data-wallet=\"partial\" aria-pressed=\"false\">Eksik veri</button></div>\n<div aria-live=\"polite\">\n<dl class=\"metrics\"><div><dt>SOL bakiyesi</dt><dd id=\"sol\"></dd></div><div><dt>Okunan token programı</dt><dd id=\"programs\"></dd></div><div><dt>Portföy değeri</dt><dd id=\"total\"></dd></div></dl>\n<div class=\"table-scroll\" id=\"holdings\"><table class=\"walletRows\"><caption>USD değeri bulunan varlıklar</caption><thead><tr><th scope=\"col\">Varlık</th><th scope=\"col\">Miktar</th><th scope=\"col\">Örnek değer</th></tr></thead><tbody id=\"walletRows\"></tbody></table></div>\n<p class=\"note\" id=\"walletNote\"></p>\n</div>\n</section>\n</div>\n";
  customElements.define('mercek-jury-preview', class extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const root = this.attachShadow({mode:'open'});
      root.innerHTML = '<style>'+style+'</style>'+markup;
      for(const link of root.querySelectorAll('[data-demo-explorer]')){
        const token=globalThis.MercekSolanaExamples.mainnet.find(item=>item.symbol===link.dataset.demoExplorer);
        link.href=globalThis.MercekSolanaExplorer(token.mint,'mainnet');
      }
      /* Reuses the deployed Solana Lab score and missing-criteria coverage rules. */
      function solNumber(value) {
        return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null;
      }
      
      function solanaAddress(value) {
        if (typeof value !== 'string' || !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value)) return false;
        const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
        let integer = 0n;
        for (const char of value) integer = integer * 58n + BigInt(alphabet.indexOf(char));
        const bytes = integer === 0n ? 0 : Math.ceil(integer.toString(16).length / 2);
        return (value.match(/^1*/)[0].length + bytes) === 32;
      }
      
      function solRisk(chain, market) {
        const disabled = value => value === null ? true : typeof value === 'string' ? false : null;
        const authority = (onChain, audit) => {
          const result = disabled(onChain);
          return result !== null ? result : typeof audit === 'boolean' ? audit : null;
        };
        const mint = authority(chain?.mintAuthority, market?.mintDisabled);
        const freeze = authority(chain?.freezeAuthority, market?.freezeDisabled);
        const holders = solNumber(market?.topHolders);
        const liquidity = solNumber(market?.liquidity);
        const volume = solNumber(market?.volume);
        const trades = [solNumber(market?.buys), solNumber(market?.sells)];
        const organic = solNumber(market?.organic);
        const verified = typeof market?.verified === 'boolean' ? market.verified : null;
        const activity = trades.every(value => value !== null) ? trades[0] + trades[1] : null;
        const group = [
          ['mint',20,mint===null?null:mint?20:0,mint],
          ['freeze',15,freeze===null?null:freeze?15:0,freeze],
          ['holders',25,holders===null||holders>100?null:holders<=20?25:holders<=40?18:holders<=60?10:holders<=80?4:0,holders],
          ['liquidity',20,liquidity===null?null:liquidity>=1e6?20:liquidity>=1e5?15:liquidity>=25000?8:liquidity>=5000?3:0,liquidity],
          ['activity',10,activity===null||volume===null?null:activity>=1000&&volume>=100000?10:activity>=100&&volume>=10000?7:activity>=20&&volume>=1000?4:activity>0&&volume>0?1:0,activity],
          ['verification',10,verified===null||organic===null||organic>100?null:(verified?5:0)+Math.floor(organic/20),organic]
        ];
        const criteria = group.map(([id,weight,points,observed])=>({id,weight,points,observed}));
        const known = criteria.filter(row=>row.points!==null);
        const points = known.reduce((a,b)=>a+b.points,0);
        const coverage = known.reduce((a,b)=>a+b.weight,0);
        const riskCriteria = criteria.map(row=>({...row,points:row.points===null?null:row.weight-row.points}));
        const riskPoints = coverage - points;
        const upper = riskPoints + 100 - coverage;
        const score = coverage===100?riskPoints:null;
        const category = score===null?null:score>=80?'veryHigh':score>=60?'high':score>=40?'moderate':'positive';
        return {criteria:riskCriteria,points:riskPoints,coverage,upper,score,category};
      }
      
      const scenarios = {
        USDC:{authority:"11111111111111111111111111111111", concentration:29.4, pool:"USDC / SOL", dex:"Orca", liquidity:1820000, buys:780, sells:660,volume:715000},
        BONK:{authority:null, concentration:47.2, pool:"BONK / SOL", dex:"Raydium", liquidity:680000, buys:490,sells:311,volume:191000}
      };
      const wallets = {
        complete:{sol:"0,84 SOL",programs:"2/2",total:"373,08 USD",rows:[["USDC","250","250,00 USD"],["BONK","3.600.000","64,28 USD"],["SOL","0,84","58,80 USD"]],note:"İki token programı da okundu. Toplam, SOL ile listelenen tokenların örnek USD değerini içerir."},
        empty:{sol:"0 SOL",programs:"2/2",total:"0,00 USD",rows:[],note:"İki token programı da okundu. Pozitif bakiyeli varlık bulunamadı."},
        partial:{sol:"0,84 SOL",programs:"1/2",total:"Hesaplanamadı",rows:[["SOL","0,84","58,80 USD"]],note:"Bir token programı okunamadı. Görünen SOL değeri kısmi bilgidir."}
      };
      let token="USDC";
      const byId=id=>root.getElementById(id);
      const put=(id,value)=>{byId(id).textContent=value};
      const fmt=new Intl.NumberFormat("tr-TR",{maximumFractionDigits:1});
      function renderMarket(){
        const mode=byId("provider").value;
        const item=scenarios[token];
        const quote=mode==="none"?null:item;
        const coverage=solRisk({mintAuthority:item.authority,freezeAuthority:item.authority},{
          topHolders:item.concentration,liquidity:quote?.liquidity,buys:quote?.buys,sells:quote?.sells,volume:quote?.volume,verified:true,organic:80
        }).coverage;
        put("liquidity",quote?fmt.format(quote.liquidity)+" USD":"Veri yok");
        put("concentration","%"+fmt.format(item.concentration));
        put("coverage",coverage+"/100");
        put("pool",quote?quote.pool+" · "+quote.dex+" · örnek":"Doğrulanamadı");
        put("marketSource",mode==="primary"?"DEX Screener · birincil kaynak":mode==="backup"?"GeckoTerminal · yedek kaynak":"İki kaynak da yanıt vermedi");
        put("dataTime",quote?(mode==="backup"?"24 Kas 2026 · 14.11 TSİ · örnek":"24 Kas 2026 · 14.12 TSİ · örnek"):"Kullanılabilir kayıt yok");
        put("chainSource","Helius · getTokenLargestAccounts · örnek");
        put("marketNote",mode==="backup"?"Birincil kaynak yanıt vermedi. Likidite, aynı mint ve havuz adresi eşleştirilen yedek kaynaktan gösteriliyor.":mode==="none"?"Likidite ve işlem aktivitesi hesaplanamadı. Zincir üstü bulgular görünür ve ağırlıklı veri kapsamı düşer.":"Birincil kaynaktan aynı Solana mintine ait seçili havuz gösteriliyor.");
        byId("marketNote").classList.toggle("clear",mode==="primary");
      }
      function renderWallet(mode){
        const data=wallets[mode];
        put("sol",data.sol);put("programs",data.programs);put("total",data.total);put("walletNote",data.note);
        byId("walletNote").classList.toggle("clear",mode!=="partial");
        byId("holdings").hidden=!data.rows.length;
        const rows=data.rows.map(values=>{
          const row=document.createElement("tr");
          for(const value of values){const cell=document.createElement("td");cell.textContent=value;row.append(cell);}
          return row;
        });
        byId("walletRows").replaceChildren(...rows);
        root.querySelectorAll("[data-wallet]").forEach(button=>button.setAttribute("aria-pressed",button.dataset.wallet===mode));
      }
      root.querySelectorAll("[data-token]").forEach(button=>button.addEventListener("click",()=>{
        token=button.dataset.token;
        root.querySelectorAll("[data-token]").forEach(item=>item.setAttribute("aria-pressed",item===button));
        renderMarket();
      }));
      root.querySelectorAll("[data-wallet]").forEach(button=>button.addEventListener("click",()=>renderWallet(button.dataset.wallet)));
      byId("provider").addEventListener("change",renderMarket);
      renderMarket();
      renderWallet("complete");

    }
  });
})();
