/* Full CoinGecko directory, on-demand quotes, source-aware research. */
const U=MercekUniverse;
const universeCopy={
all:['Tüm coinler','All coins','Alle Coins','Все монеты','Todas las monedas','Tutte le monete'],title:['Kripto evrenini keşfet.','Explore the crypto universe.','Die Krypto-Welt entdecken.','Исследуйте мир криптовалют.','Explora el universo cripto.','Esplora l’universo crypto.'],scope:['CoinGecko kataloğundaki tüm varlıklar aranabilir. Her varlık için fiyat, haber veya geçmiş bulunmayabilir.','Search every asset in the CoinGecko directory. Prices, news and history may not exist for every asset.','Alle Werte im CoinGecko-Verzeichnis suchen. Kurse, Nachrichten und Historie sind nicht für jeden Wert vorhanden.','Поиск по всему каталогу CoinGecko. Цена, новости и история доступны не для каждого актива.','Busca todo el catálogo CoinGecko. No todos los activos tienen precio, noticias o historial.','Cerca nell’intero catalogo CoinGecko. Prezzo, notizie e storico non esistono per ogni asset.'],search:['Tüm coinlerde isim veya sembol ara','Search all coins by name or symbol','Alle Coins nach Name oder Symbol suchen','Поиск всех монет по имени или символу','Busca todas las monedas por nombre o símbolo','Cerca tutte le monete per nome o simbolo'],ondemand:['Güncel fiyatı incele','View current price','Aktuellen Kurs ansehen','Посмотреть текущую цену','Ver precio actual','Vedi prezzo attuale'],catalogTime:['Katalog alındı','Directory retrieved','Verzeichnis abgerufen','Каталог получен','Catálogo consultado','Catalogo recuperato'],loading:['Varlık yükleniyor…','Loading asset…','Wert wird geladen…','Загрузка актива…','Cargando activo…','Caricamento asset…'],quoteMissing:['Bu varlık için güncel piyasa verisi henüz alınamadı. Haber ve geçmiş sekmeleri bağımsız çalışır.','Current market data is unavailable for this asset. News and history load independently.','Aktuelle Marktdaten nicht verfügbar. Nachrichten und Historie werden separat geladen.','Текущие рыночные данные недоступны. Новости и история загружаются отдельно.','Datos actuales no disponibles. Noticias e historial se cargan por separado.','Dati attuali non disponibili. Notizie e storico vengono caricati separatamente.'],cooldown:['Kaynak şu anda yanıt vermiyor veya istek sınırı doldu. Son kayıt varsa gösterilir. Bir dakika sonra yeniden deneyebilirsin.','The source is unavailable or rate-limited. The last snapshot is shown when available. Retry in a minute.','Quelle nicht erreichbar oder Limit erreicht. Letzter Datenstand, falls verfügbar. In einer Minute erneut versuchen.','Источник недоступен или лимит исчерпан. При наличии показан последний снимок. Повторите через минуту.','Fuente no disponible o límite alcanzado. Se muestra el último registro si existe. Reintenta en un minuto.','Fonte non disponibile o limite raggiunto. Ultimo snapshot se disponibile. Riprova fra un minuto.'],newsSnapshot:['Canlı haber akışı alınamadı. Son başarılı haber kopyası gösteriliyor; tarihini kontrol et.','Live news is unavailable. Showing the last successful news snapshot; check its date.','Live-Nachrichten nicht verfügbar. Letzter erfolgreicher Stand; Datum prüfen.','Прямой поток недоступен. Показан последний успешный снимок; проверьте дату.','Noticias en vivo no disponibles. Última copia correcta; comprueba su fecha.','Notizie live non disponibili. Ultimo snapshot riuscito; verifica la data.'],observation:['CoinGecko günlük USD fiyat gözlemleri kullanılıyor. Yüksek/düşük ve destek/direnç yalnız günlük gözlemlere dayanır; gün içi OHLC değildir. Ücretsiz uç noktanın 365 gün sınırı nedeniyle 2 yıl her varlıkta bulunmaz. Hacim dönemi karşılaştırması bu kaynakta hesaplanmaz.','Using daily CoinGecko USD price observations. High/low and support/resistance use daily observations, not intraday OHLC. The free endpoint’s 365-day limit prevents two-year coverage for every asset. Period volume comparisons are not computed for this source.','Tägliche CoinGecko-USD-Beobachtungen, keine Intraday-OHLC. Hoch/Tief und Niveaus nur auf Tagesbeobachtungen. 365-Tage-Limit: nicht für jeden Wert zwei Jahre. Kein Volumenvergleich.','Дневные наблюдения CoinGecko в USD, не внутридневные OHLC. Максимум/минимум и уровни по дневным наблюдениям. Лимит 365 дней не позволяет два года для каждого актива. Сравнение объёмов не рассчитывается.','Observaciones diarias CoinGecko en USD, no OHLC intradía. Máximos/mínimos y niveles según observaciones diarias. El límite de 365 días impide dos años para cada activo. Sin comparación de volumen.','Osservazioni giornaliere CoinGecko in USD, non OHLC intraday. Massimi/minimi e livelli da osservazioni giornaliere. Limite di 365 giorni: due anni non disponibili per tutti. Nessun confronto dei volumi.'],old:['Son başarılı kayıt · Güncel olmayabilir','Last successful snapshot · May be outdated','Letzter erfolgreicher Stand · Eventuell veraltet','Последний успешный снимок · Может устареть','Último registro correcto · Puede estar obsoleto','Ultimo snapshot riuscito · Potrebbe essere obsoleto'],notAvailable:['Bu kaynakta yeterli geçmiş yok. Daha kısa bir dönem seçebilir veya kaynak sayfasını inceleyebilirsin.','This source has insufficient history. Select a shorter period or inspect the source page.','Quelle hat zu wenig Historie. Kürzeren Zeitraum oder Quellseite wählen.','В источнике недостаточно истории. Выберите меньший период или страницу источника.','Historial insuficiente. Elige un período menor o consulta la fuente.','Storico insufficiente. Scegli un periodo più breve o consulta la fonte.']};
const ut=k=>universeCopy[k]?.[cgLangs.indexOf(lang)]??universeCopy[k]?.[1]??k;
const universeCache=U.createCache({storage:cgStorage,fetcher:(...a)=>fetch(...a)});
let universeItems=[],universeStamp=null,universeLoading=false,universeFailed=false,universeLimit=100,quotePending={},quoteErrors={},topIds=new Set(),activeQuoteToken=0;
const universeRenderBefore=render,universeLoadBefore=loadLive;
loadLive=async function(){const previous=coins.slice();await universeLoadBefore();coins.forEach(c=>topIds.add(c.id));for(const c of previous)if(!coins.some(x=>x.id===c.id))coins.push(c);if(view==='compare')refreshComparison();if(view==='detail'&&selected&&!coins.some(c=>c.id===selected))ensureUniversal(selected);};
function placeholderCoin(c){return {id:c.id,name:c.name.replace(/[<>&"']/g,''),symbol:c.symbol.replace(/[<>&"']/g,''),glyph:'◈',color:'#b6f36a',solana:c.id==='solana',current_price:null,price_change_percentage_24h:null,market_cap:null,total_volume:null,market_cap_rank:null,circulating_supply:null,fully_diluted_valuation:null,max_supply:null};}
async function loadUniverse(){if(universeLoading)return;universeLoading=true;universeFailed=false;try{const s=await universeCache.get('/coins.json',86400000);universeItems=U.directory(s.data);universeStamp=s.data.fetched_at;if(Date.now()-universeStamp>86400000){try{const live=await universeCache.get('https://api.coingecko.com/api/v3/coins/list',86400000);universeItems=U.directory(live.data);universeStamp=live.at;}catch{universeFailed=true}}}catch{universeFailed=true}finally{universeLoading=false;if(view==='catalog'||view==='home'||view==='watch')render();if(view==='compare'){refreshComparison();refreshCompareOptions('a');refreshCompareOptions('b');}if(view==='detail'&&selected){if(!coins.some(c=>c.id===selected))ensureUniversal(selected);else if(!researchData[selected+':history']&&!researchPending[selected+':history'])fetchChart()}}}
function universeNotice(){return `<div class="universe-notice"><div><strong>${ut('all')} · ${universeItems.length.toLocaleString(t('locale'))}</strong><p>${ut('scope')}</p>${universeStamp?`<small>${ut('catalogTime')}: ${rdate(universeStamp,true)}</small>`:''}${universeFailed?`<p>${ut('old')}</p>`:''}</div><button class="btn primary" onclick="openCatalog()">${ut('all')}</button></div>`}
function universeMatches(q=query){let items=U.search(universeItems,q);if(view==='watch'||filter==='watch')items=items.filter(c=>watch.includes(c.id));if(filter==='solana')items=items.filter(c=>['solana','jupiter-exchange-solana','raydium','bonk','jito-governance-token'].includes(c.id));return items;}
const marketRowsBeforeUniverse=rows;
function universalRows(items,limit=100,showMore=true){return `<div class="universe-grid">${items.slice(0,limit).map(m=>{const c=coins.find(c=>c.id===m.id);return `<button class="universe-asset" onclick="openUniversal('${m.id}')"><span class="universe-symbol">${c?coinIcon(c):esc(m.symbol.slice(0,3))}</span><span class="universe-name"><strong>${esc(m.name)}</strong><small>${esc(m.symbol)} · ${esc(m.id)}</small></span><span class="universe-quote">${c&&c.current_price!=null?money(c.current_price):ut('ondemand')}${c?.price_change_percentage_24h!=null?`<small class="${c.price_change_percentage_24h>=0?'positive':'negative'}">${pct(c.price_change_percentage_24h)}</small>`:''}</span></button>`}).join('')}</div>${showMore&&items.length>limit?`<button class="btn catalog-more" onclick="universeLimit+=100;render()">${rt('more')} (${Math.min(limit,items.length)} / ${items.length})</button>`:''}`}
rows = function () {
  const homePreview = view === 'home';
  const showCatalogMatches = universeItems.length && (query.trim() || view === 'watch' || filter === 'watch');
  const items = showCatalogMatches ? universeMatches() : [];
  const content = showCatalogMatches
    ? `<p class="research-source" role="status">${items.length.toLocaleString(t('locale'))} ${t('assets')} · ${ut('scope')}</p>${
      items.length ? universalRows(items, homePreview ? homeCoinLimit : universeLimit, !homePreview)
        : `<div class="empty">${t('noresults')}</div>`
    }`
    : marketRowsBeforeUniverse();
  if (!homePreview) return content;
  return content + `<div class="home-catalog-more"><button class="btn primary" type="button" onclick="openCatalogFromHome()">${rt('more')}</button></div>`;
};

function openCatalogFromHome() {
  activeEcosystem = '';
  catalogQuery = query.trim();
  universeLimit = 100;
  openCatalog();
}
const universeHomeBefore=home;home=function(){return universeHomeBefore().replace(cg('heading'),ut('title')).replace(cg('sub'),ut('scope')).replace('<div class="cg-market">',universeNotice()+'<div class="cg-market">')};
const featuredEcosystems = [
  ['solana','Solana','SOL',['solana','jupiter-exchange-solana','raydium','bonk','jito-governance-token']],
  ['ethereum','Ethereum','ETH',['ethereum','chainlink','uniswap','aave','lido-dao']],
  ['bitcoin','Bitcoin','BTC',['bitcoin']],
  ['binance-smart-chain','BNB Chain','BNB',['binancecoin','pancakeswap-token','venus']],
  ['base','Base','ETH',['aerodrome-finance','brett']],
  ['arbitrum-one','Arbitrum One','ARB',['arbitrum','camelot-token','gmx']],
  ['optimistic-ethereum','OP Mainnet','OP',['optimism','velodrome-finance']],
  ['avalanche','Avalanche','AVAX',['avalanche-2','joe','benqi']],
  ['polygon-pos','Polygon PoS','POL',['polygon-ecosystem-token','quickswap']],
  ['sui','Sui','SUI',['sui','cetus-protocol','deep']],
  ['the-open-network','TON','TON',['the-open-network','notcoin']],
  ['aptos','Aptos','APT',['aptos','thala']]
];
const ecoCopy = {
  title:['Coin Ekosistemleri','Coin Ecosystems','Coin-Ökosysteme','Экосистемы монет','Ecosistemas de monedas','Ecosistemi delle monete'],
  search:['Ekosistem adı veya sembolü ara','Search ecosystem name or symbol','Ökosystemname oder Symbol suchen','Поиск по имени или символу','Buscar ecosistema por nombre o símbolo','Cerca ecosistema per nome o simbolo'],
  lead:['Bir ağ seç ve o ağa bağlı varlıkları incele.','Pick a network to browse its assets.','Netzwerk auswählen und zugehörige Werte ansehen.','Выберите сеть и просмотрите её активы.','Elige una red para ver sus activos.','Scegli una rete per vedere i suoi asset.'],
  networkAssets:['Bu ağdaki varlıklar','Assets on this network','Kryptowerte dieses Netzwerks','Активы этой сети','Activos de esta red','Asset di questa rete'],
  switch:['Ekosistem değiştir','Change ecosystem','Ökosystem wechseln','Сменить экосистему','Cambiar ecosistema','Cambia ecosistema'],
  fallback:['Mercek’in başlangıç eşleştirmeleri gösteriliyor.','Showing Mercek’s starter mappings.','Merceks Basiszuordnungen werden angezeigt.','Показаны базовые сопоставления Mercek.','Se muestran las asociaciones iniciales de Mercek.','Sono mostrate le associazioni iniziali di Mercek.'],
  updated:['Ağ eşleştirmeleri · CoinGecko ve Mercek','Network mappings · CoinGecko and Mercek','Netzwerkzuordnungen · CoinGecko und Mercek','Соответствия сетей · CoinGecko и Mercek','Redes asociadas · CoinGecko y Mercek','Reti associate · CoinGecko e Mercek'],
  close:['Kapat','Close','Schließen','Закрыть','Cerrar','Chiudi'],
  return:['Ekosisteme dön','Back to ecosystem','Zurück zum Ökosystem','Назад к экосистеме','Volver al ecosistema','Torna all’ecosistema'],
  notFound:['Bu ekosistem şu anda listede yok.','This ecosystem is not in the list.','Dieses Ökosystem ist nicht in der Liste.','Этой экосистемы нет в списке.','Este ecosistema no está en la lista.','Questo ecosistema non è nell’elenco.']
};
const ec = key => ecoCopy[key][Math.max(0,cgLangs.indexOf(lang))];
const ecoIdPattern = /^[a-z0-9_-]{1,151}$/;
const ecoSources = 'https://api.coingecko.com/api/v3/';
const ecosystemCache = U.createCache({storage:cgStorage,fetcher:(url,options)=>fetch(url,{...options,signal:AbortSignal.timeout(6500)})});
let activeEcosystem = '';
let detailEcosystem = '';
let ecosystemLoad;
let ecosystemSynced = false;
let ecosystemLoading = false;
let ecosystems = new Map(featuredEcosystems.map(([id,name,symbol,members])=>[id,{id,name,symbol,members:new Set(members)}]));

function ecosystemFilterButton() {
  return `<button class="chip" type="button" aria-haspopup="dialog" onclick="showEcosystemPicker()">${ec('title')}</button>`;
}
function ecosystemLookup(value) {
  return value.normalize('NFKD').replace(/\p{M}/gu,'').toLocaleLowerCase('tr').replaceAll('ı','i')
    .replace(/[^\p{L}\p{N}]+/gu,' ').trim();
}
function ecosystemAssetList() {
  const group = ecosystems.get(activeEcosystem);
  const items = universeItems.length ? universeItems : coins;
  return group ? items.filter(coin=>group.members.has(coin.id)) : [];
}
function pickerResults() {
  const list = $('#ecosystem-options');
  if (!list) return;
  const q = ecosystemLookup($('#ecosystem-search').value);
  const terms = q.split(' ').filter(Boolean);
  const matches = [...ecosystems.values()].filter(group=>{
    const label=ecosystemLookup(group.name+' '+group.id+' '+group.symbol);
    return terms.every(term=>label.includes(term));
  });
  list.innerHTML=matches.length ? matches.map(group=>`<button type="button" class="eco-option"
    onclick="openEcosystem('${group.id}')"><span><strong>${esc(group.name)}</strong>${group.symbol?` <small>${esc(group.symbol)}</small>`:''}</span></button>`).join('')
    : `<p class="empty">${t('noresults')}</p>`;
  $('#ecosystem-count').textContent = matches.length ? matches.length.toLocaleString(t('locale'))+' · '+ec('title') : t('noresults');
  $('#ecosystem-source').textContent = ecosystemSynced ? ec('updated') : ec('fallback');
}
function showEcosystemPicker() {
  let modal = $('#ecosystem-picker');
  if (!modal) {
    modal = document.createElement('dialog');
    modal.id = 'ecosystem-picker';
    modal.className = 'eco-picker';
    modal.setAttribute('aria-labelledby','ecosystem-title');
    document.body.append(modal);
  }
  if (modal.open) return;
  modal.innerHTML = `<div class="eco-picker-header"><h2 id="ecosystem-title">${ec('title')}</h2>
    <form method="dialog"><button class="btn" type="submit">${ec('close')}</button></form></div>
    <p>${ec('lead')}</p>
    <label class="sr-only" for="ecosystem-search">${ec('search')}</label>
    <input id="ecosystem-search" type="search" placeholder="${ec('search')}" autocomplete="off" autofocus>
    <p id="ecosystem-count" role="status"></p>
    <div id="ecosystem-options" class="eco-options"></div>
    <p id="ecosystem-source"></p>`;
  $('#ecosystem-search').addEventListener('input',pickerResults);
  pickerResults();
  modal.showModal();
  loadEcosystems();
}
function loadEcosystems() {
  if (ecosystemLoad) return ecosystemLoad;
  ecosystemLoading=true;
  ecosystemLoad=Promise.allSettled([
    ecosystemCache.get(ecoSources+'coins/list?include_platform=true',86400000),
    ecosystemCache.get(ecoSources+'asset_platforms',86400000)
  ]).then(([coinsResult,platformResult])=>{
    const listed=coinsResult.status==='fulfilled'?coinsResult.value.data:null;
    if (!Array.isArray(listed)||!listed.length) return;
    const platforms=platformResult.status==='fulfilled'&&Array.isArray(platformResult.value.data)?platformResult.value.data:[];
    const meta=new Map(platforms.filter(item=>item&&ecoIdPattern.test(item.id||'')).map(item=>[item.id,item]));
    const grouped=new Map();
    for (const coin of listed) {
      if (!coin||!ecoIdPattern.test(coin.id||'')||!coin.platforms) continue;
      for (const [id,address] of Object.entries(coin.platforms)) {
        if (!ecoIdPattern.test(id)||typeof address!=='string'||!address.trim()) continue;
        if (!grouped.has(id)) grouped.set(id,new Set());
        grouped.get(id).add(coin.id);
      }
    }
    if (!grouped.size) return;
    const ordered = [...grouped].sort(([a],[b])=>(meta.get(a)?.name||a).localeCompare(meta.get(b)?.name||b));
    for (const [id,members] of ordered) {
      const previous=ecosystems.get(id);
      const platform=meta.get(id);
      const native=platform?.native_coin_id;
      if (typeof native==='string'&&ecoIdPattern.test(native)) members.add(native);
      for (const coinId of previous?.members||[]) members.add(coinId);
      ecosystems.set(id,{id,members,name:previous?.name||platform?.name||id.replaceAll('-',' '),symbol:previous?.symbol||platform?.shortname||''});
    }
    ecosystemSynced=true;
  }).finally(()=>{
    ecosystemLoading=false;
    pickerResults();
    if(view==='catalog'&&activeEcosystem){
      const search=$('#catalog-search');
      if(search&&document.activeElement===search){renderCatalogRows();const source=$('#ecosystem-catalog-source');if(source)source.textContent=ecosystemSynced?ec('updated'):ec('fallback');}
      else render();
    }
  });
  return ecosystemLoad;
}
function openEcosystem(id) {
  if (!ecosystems.has(id)) return;
  $('#ecosystem-picker')?.close();
  activeEcosystem=id;
  catalogQuery='';
  universeLimit=100;
  view='catalog';
  render();
  history.replaceState(null,'','#ecosystem/'+id);
  window.scrollTo(0,0);
  if(!universeItems.length)loadUniverse();
  loadEcosystems();
}
function catalogAssets() {
  return U.search(activeEcosystem ? ecosystemAssetList() : universeItems,catalogQuery);
}
function catalogRowsMarkup(items) {
  return `<p role="status">${items.length.toLocaleString(t('locale'))} ${t('assets')}</p>${items.length ? universalRows(items,universeLimit) : rt('none')}`;
}
catalogPage=function(){
  const group=ecosystems.get(activeEcosystem);
  const title=activeEcosystem ? group?.name||ec('title') : ut('all');
  const items=catalogAssets();
  return `<section class="catalog-hero"><span class="eyebrow">${activeEcosystem?ec('title'):'MERCEK · COINGECKO'}</span><h1>${esc(title)}</h1>
  <p>${activeEcosystem?ec('networkAssets'):ut('scope')}</p>
  ${activeEcosystem?`<p id="ecosystem-catalog-source" class="research-source">${ecosystemSynced?ec('updated'):ec('fallback')}</p>
  <div class="eco-actions"><button class="btn primary" type="button" onclick="showEcosystemPicker()">${ec('switch')}</button><button class="btn" type="button" onclick="openCatalog()">${ut('all')}</button></div>`
    :`<p class="research-source">${universeItems.length.toLocaleString(t('locale'))} ${t('assets')} · ${universeStamp?rdate(universeStamp,true):''}</p>`}</section>
  <label class="sr-only" for="catalog-search">${ut('search')}</label><input class="catalog-search" id="catalog-search" placeholder="${ut('search')}" value="${esc(catalogQuery)}" oninput="catalogQuery=this.value;universeLimit=100;renderCatalogRows()">
  <div id="catalog-results">${activeEcosystem&&!group?`<p role="status">${ecosystemLoading?rt('loading'):ec('notFound')}</p>`
    :universeLoading&&!items.length?`<p role="status">${rt('loading')}</p>`:!universeItems.length&&!items.length?`<p>${ut('cooldown')}</p><button class="btn" onclick="loadUniverse()">${rt('retry')}</button>`:catalogRowsMarkup(items)}</div>`;
};
renderCatalogRows=function(){const el=$('#catalog-results');if(el)el.innerHTML=catalogRowsMarkup(catalogAssets());};
openCatalog=function(){
  if(activeEcosystem){catalogQuery='';universeLimit=100;}
  activeEcosystem='';view='catalog';render();history.replaceState(null,'','#markets');window.scrollTo(0,0);if(!universeItems.length)loadUniverse();
};
async function ensureUniversal(id){if(quotePending[id])return;const existing=coins.find(c=>c.id===id);if(existing?.current_price!=null&&Date.now()-(existing.quote_at??cgState.savedAt??0)<60000)return;const m=universeItems.find(x=>x.id===id);if(!m&&!coins.some(c=>c.id===id))return;if(!coins.some(c=>c.id===id))coins.push(placeholderCoin(m));quotePending[id]=true;delete quoteErrors[id];if(view==='detail'&&selected===id)render();try{const {data,stale,at}=await universeCache.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids='+encodeURIComponent(id)+'&sparkline=false&price_change_percentage=24h',60000);const list=MercekMarkets.normalize(data),c=list.find(c=>c.id===id);if(!c)throw Error('no_price');const quote={...c,quote_at:at,quote_stale:stale};const idx=coins.findIndex(c=>c.id===id);if(idx<0)coins.push(quote);else coins[idx]=quote;mode='live';}catch(e){quoteErrors[id]=e.message;}finally{quotePending[id]=false;if(view==='compare'&&(id===compareA||id===compareB))refreshComparison();if(view==='detail'&&selected===id){render();if(tab===0&&!researchData[id+':history']&&!researchPending[id+':history'])fetchChart()}}}
const compareCopy = {
  a: ['1. varlık','Asset 1','1. Kryptowert','Актив 1','Activo 1','Asset 1'],
  b: ['2. varlık','Asset 2','2. Kryptowert','Актив 2','Activo 2','Asset 2'],
  search: ['İsim, sembol veya coin kimliği ara','Search by name, symbol or coin ID','Nach Name, Symbol oder Coin-ID suchen','Поиск по имени, символу или ID','Busca por nombre, símbolo o ID','Cerca per nome, simbolo o ID'],
  browse: ['Listeyi aç','Open list','Liste öffnen','Открыть список','Abrir lista','Apri elenco'],
  close: ['Listeyi kapat','Close list','Liste schließen','Закрыть список','Cerrar lista','Chiudi elenco'],
  catalog: ['CoinGecko kataloğu','CoinGecko catalog','CoinGecko-Katalog','Каталог CoinGecko','Catálogo CoinGecko','Catalogo CoinGecko'],
  loading: ['Piyasa verisi yükleniyor…','Loading market data…','Marktdaten werden geladen…','Загрузка рыночных данных…','Cargando datos…','Caricamento dati…'],
  missing: ['Piyasa verisi şu anda alınamadı.','Market data is currently unavailable.','Marktdaten derzeit nicht verfügbar.','Рыночные данные недоступны.','Datos de mercado no disponibles.','Dati di mercato non disponibili.'],
  other: ['Diğer tarafta seçili','Selected on the other side','Auf der anderen Seite gewählt','Выбран на другой стороне','Seleccionado en el otro lado','Selezionato sull’altro lato']
};
const ct = key => compareCopy[key][Math.max(0,cgLangs.indexOf(lang))];
const comparePageSize = 25;
const comparePickerState = {a:{query:'',limit:comparePageSize,open:false},b:{query:'',limit:comparePageSize,open:false}};

function compareId(side) {
  return side === 'a' ? compareA : compareB;
}
function compareAsset(id) {
  const quote = coins.find(coin=>coin.id===id);
  if (quote) return quote;
  const asset = universeItems.find(coin=>coin.id===id);
  return asset ? placeholderCoin(asset) : null;
}
function compareSelection(side) {
  const id = compareId(side);
  const asset = compareAsset(id);
  let message = ct('missing');
  if (quotePending[id] || busy && !Number.isFinite(asset?.current_price)) message = ct('loading');
  else if (Number.isFinite(asset?.current_price)) message = mode==='demo' ? t('demo') : asset.quote_stale || (!asset.quote_at && cgState.stale) ? ut('old') : 'CoinGecko · ' + money(asset.current_price);
  return `<strong>${asset ? esc(asset.name) + ' · ' + esc(asset.symbol) : t('comparePick')}</strong><small>${message}</small>`;
}
function comparePicker(side) {
  const state = comparePickerState[side];
  const label = ct(side);
  return `<section class="compare-picker" aria-labelledby="compare-label-${side}">
    <h2 id="compare-label-${side}">${label}</h2>
    <div id="compare-selected-${side}" class="compare-selected" aria-live="polite">${compareSelection(side)}</div>
    <div class="compare-search">
      <label class="sr-only" for="compare-search-${side}">${label} · ${ct('search')}</label>
      <input id="compare-search-${side}" type="search" value="${esc(state.query)}" placeholder="${ct('search')}" autocomplete="off"
        aria-controls="compare-options-${side}" oninput="searchComparisonAssets('${side}',this.value)" onkeydown="if(event.key==='Escape'){event.preventDefault();closeCompareOptions('${side}')}">
      <button class="btn" type="button" id="compare-toggle-${side}" aria-controls="compare-options-${side}" onclick="toggleCompareOptions('${side}')"
        aria-expanded="${state.open}">${ct(state.open?'close':'browse')}</button>
    </div>
    <div id="compare-options-${side}" class="compare-options"${state.open?'':' hidden'}>${state.open?compareOptionMarkup(side):''}</div>
  </section>`;
}
function compareOptionMarkup(side) {
  const state = comparePickerState[side];
  const directory = universeItems.length ? universeItems : coins;
  const matches = U.search(directory,state.query);
  const items = state.query.trim() || !universeItems.length ? matches : [
    ...coins.filter(coin=>topIds.has(coin.id)), ...matches.filter(coin=>!topIds.has(coin.id))
  ];
  const other = compareId(side==='a'?'b':'a');
  const results = items.slice(0,state.limit).map(asset=>`<button type="button" class="compare-option" onclick="chooseComparisonAsset('${side}','${asset.id}')"${
    asset.id===other?' disabled':''}>
    <span><strong>${esc(asset.name)}</strong><small>${esc(asset.symbol)} · ${esc(asset.id)}</small></span>
    ${asset.id===other?`<small>${ct('other')}</small>`:''}</button>`).join('');
  return `<p class="compare-option-count" role="status">${items.length.toLocaleString(t('locale'))} ${t('assets')} · ${ct('catalog')}</p>
    ${results?`<div class="compare-option-list">${results}</div>`:`<p>${universeLoading?rt('loading'):t('noresults')}</p>`}
    ${items.length>state.limit?`<button class="btn compare-option-more" type="button" onclick="moreCompareOptions('${side}')">${rt('more')} (${state.limit} / ${items.length})</button>`:''}`;
}
function refreshCompareOptions(side) {
  const box = $('#compare-options-'+side);
  if (!box) return;
  const {open} = comparePickerState[side];
  box.hidden = !open;
  if (open) box.innerHTML = compareOptionMarkup(side);
  const button = $('#compare-toggle-'+side);
  button.setAttribute('aria-expanded',String(open));
  button.textContent = ct(open?'close':'browse');
}
function searchComparisonAssets(side,queryText) {
  Object.assign(comparePickerState[side],{query:queryText,limit:comparePageSize,open:true});
  refreshCompareOptions(side);
}
function toggleCompareOptions(side) {
  comparePickerState[side].open = !comparePickerState[side].open;
  refreshCompareOptions(side);
}
function closeCompareOptions(side) {
  comparePickerState[side].open = false;
  refreshCompareOptions(side);
}
function moreCompareOptions(side) {
  const state = comparePickerState[side];
  const previousLimit = state.limit;
  state.limit += comparePageSize;
  refreshCompareOptions(side);
  document.querySelectorAll('#compare-options-'+side+' .compare-option')[previousLimit]?.focus();
}
function refreshComparison() {
  const results = $('#compare-data');
  if (!results) return;
  for (const side of ['a','b']) {
    const selected = $('#compare-selected-'+side);
    const markup = compareSelection(side);
    if (selected.innerHTML!==markup) selected.innerHTML = markup;
  }
  results.innerHTML = comparisonResults(compareAsset(compareA),compareAsset(compareB));
}
function chooseComparisonAsset(side,id) {
  const asset = compareAsset(id);
  if (!asset || id===compareId(side==='a'?'b':'a')) return;
  if (side==='a') compareA=id;
  else compareB=id;
  Object.assign(comparePickerState[side],{query:'',limit:comparePageSize,open:false});
  const field = $('#compare-search-'+side);
  field.value = '';
  field.focus({preventScroll:true});
  refreshCompareOptions('a');
  refreshCompareOptions('b');
  ensureUniversal(id);
  refreshComparison();
}
const compareBaseMarkup = comparison;
comparison = function () {
  return `${compareBaseMarkup()}
    <div class="compareselects compare-catalog-pickers">${comparePicker('a')}${comparePicker('b')}</div>
    <div id="compare-data">${comparisonResults(compareAsset(compareA),compareAsset(compareB))}</div>`;
};
function openUniversal(id){if(!universeItems.some(c=>c.id===id)&&!coins.some(c=>c.id===id))return;detailEcosystem=view==='catalog'?activeEcosystem:'';const m=universeItems.find(c=>c.id===id);if(!coins.some(c=>c.id===id))coins.push(placeholderCoin(m));selected=id;view='detail';tab=0;range=1;researchSection='summary';researchDays=14;newsScope='asset';researchAnswer=null;researchQuestion='';chartState={points:null,real:false,loading:true,failed:false,key:null};render();history.replaceState(null,'','#token/'+id);window.scrollTo(0,0);ensureUniversal(id);fetchChart();}
openCoin=openUniversal;
const universeDetailBefore=detail;detail=function(){if(!coins.some(c=>c.id===selected)){return `<button class="btn" onclick="openCatalog()">${ut('all')}</button><p role="status">${universeLoading?ut('loading'):ut('quoteMissing')}</p>`;}let html=universeDetailBefore();if(detailEcosystem&&ecosystems.has(detailEcosystem))html=`<button class="btn eco-back" type="button" onclick="openEcosystem('${detailEcosystem}')">${ec('return')}</button>`+html;if(quotePending[selected]||quoteErrors[selected])html=`<div class="notice" role="status">${quotePending[selected]?ut('loading'):ut('quoteMissing')}${quoteErrors[selected]?`<p>${ut('cooldown')}</p><button class="btn" onclick="ensureUniversal(selected)">${rt('retry')}</button>`:''}</div>`+html;return html};
researchPanel=researchBeforeTop100;
async function directHistory(id){const pairs={bitcoin:'BTCUSDT',ethereum:'ETHUSDT',solana:'SOLUSDT','jupiter-exchange-solana':'JUPUSDT',raydium:'RAYUSDT',bonk:'BONKUSDT',chainlink:'LINKUSDT','jito-governance-token':'JTOUSDT','usd-coin':'USDCUSDT'};let pair=pairs[id];if(!pair){try{const tickers=await universeCache.get('https://api.coingecko.com/api/v3/coins/'+encodeURIComponent(id)+'/tickers?exchange_ids=binance',86400000);pair=U.binancePair(tickers.data,id);}catch{}}if(pair){try{const r=await universeCache.get('https://data-api.binance.vision/api/v3/klines?symbol='+pair+'&interval=1d&limit=1000',300000);return {...U.binanceHistory(r.data,id,pair),stale:r.stale,fetched_at:r.at};}catch{}}
const r=await universeCache.get('https://api.coingecko.com/api/v3/coins/'+encodeURIComponent(id)+'/market_chart?vs_currency=usd&days=365&interval=daily',300000);return {...U.cgHistory(r.data,id),stale:r.stale,fetched_at:r.at};}
async function directNews(id){const r=await universeCache.get('/api/research/news?asset='+encodeURIComponent(id)+'&v=8',300000);if((r.data.failed_sources?.length??0)<(r.data.source_count??3))return {...r.data,stale:r.stale};throw Error('no_live_news')}
async function snapshotNews(id){const r=await universeCache.get('/news-snapshot.json',300000),m=universeItems.find(c=>c.id===id)??coins.find(c=>c.id===id);const matches=n=>{const title=n.title.toLowerCase();return m&&(title.includes(m.name.toLowerCase())||(m.symbol.length>=3&&new RegExp('\\b'+m.symbol.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','i').test(n.title)))};const items=r.data.articles.filter(n=>n.published<=Date.now()+300000&&n.published>=Date.now()-31*86400000).sort((a,b)=>b.published-a.published);return {asset:id,fetched_at:r.data.fetched_at,asset_news:items.filter(matches),market_news:items.filter(n=>!matches(n)),failed_sources:[],snapshot:true,scope:'Cached publisher RSS headlines'};}
const researchRequests=new Map();
loadResearch=function(id,kind,force=false){const key=id+':'+kind;if(researchRequests.has(key))return researchRequests.get(key);if(!force&&researchData[key]&&Date.now()-researchData[key].fetched_at<300000)return Promise.resolve(researchData[key]);researchPending[key]=true;delete researchErrors[key];if(view==='detail'&&selected===id)render();const task=(async()=>{try{let data;if(kind==='history')data=await directHistory(id);else{try{data=await directNews(id)}catch{data=await snapshotNews(id)}}researchData[key]=data;return data;}catch(e){researchErrors[key]=e.message;}finally{researchPending[key]=false;researchRequests.delete(key);if(view==='detail'&&selected===id)render()}})();researchRequests.set(key,task);return task;};
fetchChart=async function(){const token=++chartToken,id=selected,key=id+':history';chartState={points:null,real:false,loading:true,failed:false,key:id+'-'+range};render();await loadResearch(id,'history');if(token!==chartToken||selected!==id)return;const h=researchData[key],days=[1,7,30,365,730][range],values=h?.candles?.slice(-days-1)??[];if(values.length>=2&&(days<=30||getStats(h,days))){chartState={points:values.map(c=>c.close),real:true,loading:false,failed:false,key:id+'-'+range};}else chartState={points:null,real:false,loading:false,failed:true,key:id+'-'+range};if(view==='detail')render()};
const researchErrorBeforeUniverse=researchError;researchError=function(kind){if(researchPending[selected+':'+kind])return `<p role="status">${rt('loading')}</p>`;return `<div class="research-empty" role="status"><h3>${kind==='history'?ut('notAvailable'):rt('noNews')}</h3><p>${ut('cooldown')}</p><button class="btn" onclick="loadResearch(selected,'${kind}',true)">${rt('retry')}</button><a href="https://www.coingecko.com/en/coins/${encodeURIComponent(selected)}" target="_blank" rel="noopener noreferrer">${t('viewSource')}</a></div>`};
researchSource=function(h){if(!h)return '';return `<p class="research-source">${rt('source')}: <a href="${esc(h.source_url)}" target="_blank" rel="noopener noreferrer">${esc(h.source)} · ${esc(h.pair)} · ${esc(h.quote)}</a><br>${rt('dataTime')}: ${rdate(h.candles.at(-1).closeTime,true)}<br>${rt('fetched')}: ${rdate(h.fetched_at,true)}${h.stale?`<br>${ut('old')}`:''}</p>`};
const universePanelBefore=researchPanel;researchPanel=function(c){const h=researchData[selected+':history'];let html=universePanelBefore(c);const notice=h?.observation_only?ut('observation'):h?`${esc(h.source)} · ${esc(h.quote)} · ${h.interval}`:ut('scope');return html.replace(rt('quoteNote'),notice)};
const universeNewsBefore=newsResearch;newsResearch=function(n,itemsOverride=null){return `${n?.snapshot?`<div class="research-warning" role="status">${ut('newsSnapshot')} · ${rdate(n.fetched_at,true)}</div>`:n?.stale?`<p class="research-warning">${ut('old')}</p>`:''}${universeNewsBefore(n,itemsOverride)}`};
const methodBeforeUniverse=methodText;methodText=function(type){if(researchData[selected+':history']?.observation_only)return ut('observation')+(type==='levels'?' '+['Son 30 gözlemde yerel dip/tepe kümeleri hesaplanır. Tolerans, son fiyatın %0,3’ü veya 14 günlük ortalama mutlak fiyat değişiminin %20’sinden büyük olanıdır. Seviyeler alım/satım sinyali değildir.','Local extrema in the last 30 observations are clustered. Tolerance is max(0.3% of last price, 20% of the mean absolute 14-day price change). Levels are not trading signals.','Lokale Extrema aus 30 Beobachtungen; Toleranz max(0,3 % des Kurses, 20 % der mittleren absoluten 14-Tage-Änderung). Keine Handelssignale.','Экстремумы 30 наблюдений; допуск max(0,3% цены, 20% среднего абсолютного изменения за 14 дней). Не торговые сигналы.','Extremos de 30 observaciones; tolerancia max(0,3% del precio, 20% del cambio absoluto medio de 14 días). No son señales.','Estremi di 30 osservazioni; tolleranza max(0,3% del prezzo, 20% della variazione assoluta media di 14 giorni). Non sono segnali.'][cgLangs.indexOf(lang)]:'');return methodBeforeUniverse(type)};
render=function(){universeRenderBefore();if(!demoSession)return;const b=document.querySelector('.headerend .pill');if(b)b.textContent='COINGECKO';const chartLabel=document.querySelector('.chartlabel');if(chartLabel&&view==='detail'&&chartState.real){const h=researchData[selected+':history'];if(h)chartLabel.textContent=h.source+' · '+h.quote;}if(view==='home'||view==='watch'){const input=$('#search');if(input){input.placeholder=ut('search');input.setAttribute('aria-label',ut('search'));}if(!document.querySelector('.universe-notice')){const box=document.createElement('div');box.innerHTML=universeNotice();const market=document.querySelector('.cg-market');if(market)market.before(box.firstElementChild);}}};
for(const l of cgLangs){packs[l].search=universeCopy.search[cgLangs.indexOf(l)];rtRows.catalog[cgLangs.indexOf(l)]=universeCopy.all[cgLangs.indexOf(l)];rtRows.catalogSub[cgLangs.indexOf(l)]=universeCopy.scope[cgLangs.indexOf(l)];}
if(location.hash.startsWith('#token/')){const id=location.hash.slice(7);if(/^[a-z0-9_-]{1,151}$/.test(id)){selected=id;view='detail';tab=0;}}else if(location.hash==='#markets')view='catalog';else if(location.hash==='#compare')view='compare';else if(location.hash.startsWith('#ecosystem/')){const id=location.hash.slice(11);if(ecoIdPattern.test(id)){activeEcosystem=id;view='catalog';loadEcosystems();}}
coins.forEach(c=>topIds.add(c.id));loadUniverse();if(view==='detail'&&selected){if(coins.some(c=>c.id===selected))fetchChart();}render();

const chartWithUniverseSource=chart;chart=function(c){let html=chartWithUniverseSource(c);const h=researchData[selected+':history'];if(chartState.real&&h)html=html.replaceAll(t('chartLive'),esc(h.source)+' · '+esc(h.quote)+' · '+(h.observation_only?'1d observations':'1d OHLC'));return html};

const statusBeforeUniverse=status;
status=function(){const c=view==='detail'?coins.find(c=>c.id===selected):null;if(!c?.quote_at)return statusBeforeUniverse();return `<div class="cg-status ${c.quote_stale?'cg-status-warning':''}" role="status"><div><strong>CoinGecko · ${esc(c.name)}</strong><span>${cg('updated')}: ${new Intl.DateTimeFormat(t('locale'),{dateStyle:'medium',timeStyle:'medium'}).format(c.quote_at)} · ${cg('cached')}</span>${c.quote_stale?`<p>${ut('old')}</p>`:''}</div><button class="btn" onclick="ensureUniversal(selected)">${t('refresh')}</button></div>`};

['Kripto varlık','Crypto asset','Kryptowert','Криптоактив','Criptoactivo','Cryptoasset'].forEach((label,i)=>packs[cgLangs[i]].main=label);
