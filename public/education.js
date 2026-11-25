const educationMetrics = [
  ['Birim fiyat', 'Bir adet coin veya tokenın fiyatıdır. Küçük bir sayı, varlığın ucuz olduğunu göstermez.'],
  ['Piyasa değeri', 'Birim fiyat ile dolaşımdaki miktarın çarpımıdır. Varlığın piyasa büyüklüğünü gösterir.'],
  ['24 saatlik hacim', 'Veri kaynağının izlediği piyasalarda son 24 saatte bildirilen işlemlerin toplam değeridir.'],
  ['Dolaşımdaki arz', 'Piyasada dolaşımda olduğu tahmin edilen coin veya token adedidir.'],
  ['24 saatlik değişim', 'Birim fiyatın 24 saat önceye göre yüzde farkıdır.']
];

const educationConcepts = [
  ...educationMetrics,
  ['Oynaklık (volatilite)', 'Fiyatın zaman içinde ne kadar değiştiğidir. Bunu anlamak için tek günlük değişim yerine birden fazla günün hareketine bak.'],
  ['Likidite', 'Bir varlığın fiyatını fazla oynatmadan el değiştirebilmesidir. Geçmiş işlem hacmi, o anda alım ve satım için bekleyen emirlerin derinliğini tek başına göstermez.']
];

const educationSafety = [
  ['Kurtarma kelimelerini kimseyle paylaşma', 'Cüzdan kurtarma kelimelerini (seed phrase) hiçbir siteye yazma. Destek ekibi olduğunu söyleyen kişilere de gönderme.'],
  ['Benzer isimlerde resmî adresi karşılaştır', 'İsim ve simge kopyalanabilir. Projenin resmî sayfasındaki ağı ve kontrat adresinin tamamını karşılaştır. Solana tokenlarında mint adresi kullanılır.'],
  ['Düşük hacim ve düşük likiditeyi ayrı değerlendir', 'Düşük likiditede küçük bir işlem bile fiyatı sert oynatabilir. Bir projenin likiditesinin çekilmesi gibi bir rug pull durumunda ani değer kaybı yaşanabilir. Tek başına düşük hacim dolandırıcılık kanıtı sayılmaz.'],
  ['“Garanti kazanç” vaatlerine temkinli yaklaş', 'Kesin kâr vaadi, acele ettirme ve önce para gönderme talebi birer uyarı işaretidir.']
];

const educationExample = Object.freeze({
  name: 'Eğitim örneği',
  current_price: 0.2,
  market_cap: 2_000_000,
  circulating_supply: 10_000_000,
  total_volume: 40_000,
  price_change_percentage_24h: -4
});

function educationReading(asset) {
  const {price_change_percentage_24h: change, market_cap: cap, total_volume: volume} = asset;
  const movement = !Number.isFinite(change)
    ? '24 saatlik değişim verisi eksik. Bu süre için fiyatın yönü değerlendirilemiyor.'
    : change > 0
      ? 'Son 24 saatte fiyat yükselmiş. Hareketin ne kadar sürdüğünü anlamak için daha uzun bir döneme de bak.'
      : change < 0
        ? 'Son 24 saatte fiyat gerilemiş. Daha düşük birim fiyatı değerlendirirken dolaşımdaki arzı ve piyasa değerini de incele.'
        : 'Bildirilen 24 saatlik değişim sıfır. Gün içinde fiyat hareket etmiş olabilir.';
  const ratio = Number.isFinite(cap) && cap > 0 && Number.isFinite(volume) && volume >= 0
    ? 100 * (volume / cap)
    : null;
  const activity = Number.isFinite(ratio)
    ? 'Bildirilen 24 saatlik hacim, piyasa değerinin yaklaşık %' +
      new Intl.NumberFormat('tr-TR', {maximumFractionDigits: 4}).format(ratio) +
      '’i kadar. Bu oran işlem hareketi hakkında fikir verir. Likiditeyi anlamak için bir işlemin fiyatı ne kadar oynatabileceğine de bakılır.'
    : 'Hacmi piyasa değeriyle karşılaştırmak için geçerli hacim ve sıfırdan büyük bir piyasa değeri gerekir.';
  return [movement, activity];
}

function educationDataKind({sample, stale, available, pending}) {
  if (sample) return 'sample';
  if (available) return stale ? 'stale' : 'market';
  return pending ? 'pending' : 'unavailable';
}

/* The education layer reads existing state and leaves the market controllers intact. */
const educationNavBefore = nav;
const educationRenderBefore = render;

const learningHubLabels = {
  tr: 'Öğrenme Merkezi', en: 'Learning Center', de: 'Lernzentrum',
  ru: 'Центр обучения', es: 'Centro de aprendizaje', it: 'Centro di apprendimento'
};

nav = function () {
  educationNavBefore();
  const title = learningHubLabels[lang] ?? learningHubLabels.tr;
  for (const selector of ['#desktopnav', '#bottomnav']) {
    const button = document.querySelector(selector + " button[onclick=\"navigate('learn')\"]");
    if (!button) continue;
    (button.querySelector('span') ?? button).textContent = title;
    if (view === 'learn') button.setAttribute('aria-current', 'page');
  }
};

function educationDefinitionList(definitions, cardMetadata) {
  return '<dl class="edu-definitions">' + definitions.map(([name, definition], index) =>
    '<div' + (cardMetadata ? educationCardAttributes(cardMetadata[index]) : '') + '><dt>' + name + '</dt><dd>' + definition + '</dd></div>'
  ).join('') + '</dl>';
}

function educationExampleMarkup() {
  const notes = educationReading(educationExample);
  const exampleMoney = new Intl.NumberFormat('tr-TR', {style: 'currency', currency: 'USD'});
  const exampleCount = new Intl.NumberFormat('tr-TR');
  const values = [
    exampleMoney.format(educationExample.current_price),
    exampleMoney.format(educationExample.market_cap),
    exampleMoney.format(educationExample.total_volume),
    exampleCount.format(educationExample.circulating_supply),
    '%−4'
  ];
  return `<div class="edu-example">
    <div class="edu-data" data-kind="sample"><strong>ÖRNEK VERİ</strong>
      <span>Aşağıdaki değerler hayalî bir varlığa aittir ve güncel piyasayı yansıtmaz.</span>
    </div>
    <dl class="edu-example-values">${educationMetrics.map(([name], index) =>
      `<div><dt>${name}</dt><dd>${values[index]}</dd></div>`
    ).join('')}</dl>
    <p>${notes[0]}</p><p>${notes[1]}</p>
  </div>`;
}

const educationTopics = [
  ['basics', 'Temel Kavramlar'],
  ['reading', 'Veri Okuma'],
  ['safety', 'Güvenlik'],
  ['networks', 'Piyasa & Ağlar']
];

const educationRoute = [
  ['networks', 'Kripto ağları nasıl çalışır?', 'Ağ, coin ve token arasındaki fark',
    'Blokzincir ağı işlemlerin kaydını tutar. Coin, kendi ağının yerel varlığıdır. Token ise bir ağ üzerinde oluşturulur.',
    'Bir varlığın kimliğini anlamak için adına ek olarak hangi ağda çalıştığına bak. Örneğin ETH, Ethereum ağının yerel varlığıdır.'],
  ['price', 'Fiyat tek başına ne ifade eder?', 'Piyasa değeri ve hacim',
    'Birim fiyat bir coin’in fiyatıdır. Piyasa değeri, bu fiyatın dolaşımdaki arzla çarpımıdır. Hacim, belirli bir sürede gerçekleşen işlemlerin toplam değeridir.',
    'İki coin’i karşılaştırırken birim fiyatla birlikte piyasa değerine ve 24 saatlik hacme bak. Aynı fiyattaki iki coin’in piyasa değeri farklı olabilir.'],
  ['movement', 'Ani değişimler nasıl yorumlanır?', 'Oynaklık ve likidite',
    'Oynaklık fiyatın ne kadar değiştiğini gösterir. Likidite, bir işlemin fiyatı fazla oynatmadan gerçekleşebilmesidir.',
    'Son 24 saatlik değişimi daha uzun bir grafikle karşılaştır. Bildirilen işlem hacmini okurken likiditeyi ayrıca değerlendir.'],
  ['security', 'Kendi güvenliğini nasıl korursun?', 'Temel riskler ve yaygın hatalar',
    'Kurtarma kelimelerini kimseyle paylaşma. Bir token’ın ağını ve adresini projenin resmî kaynağından kontrol et.',
    'Mercek zincir üstü yetkileri doğrulamaz. Coin karnesindeki kaynak ve veri zamanı, gördüğün bilginin nereden geldiğini anlamana yardımcı olur.']
];

const educationDefinitionMeta = [
  ['edu-price', 'basics reading', 'unit price birim fiyat'],
  ['edu-cap', 'basics reading', 'market cap piyasa değeri'],
  ['edu-volume', 'basics reading', 'volume 24s 24h işlem hacmi'],
  ['edu-supply', 'basics', 'circulating supply arz'],
  ['edu-change', 'basics reading', '24s 24h değişim yüzde'],
  ['edu-volatility', 'reading', 'volatility volatilite oynaklık'],
  ['edu-liquidity', 'reading safety', 'liquidity likidite']
];

const educationSafetyMeta = [
  ['', 'safety', 'seed phrase kurtarma kelimeleri cüzdan'],
  ['', 'safety networks', 'token mint kontrat sözleşme adresi'],
  ['', 'safety reading', 'rug pull düşük hacim likidite'],
  ['', 'safety', 'garanti kazanç kesin kâr dolandırıcılık']
];

const learningHubLessonMeta = [
  ['', 'basics reading', 'likidite liquidity hacim volume'],
  ['', 'basics reading', 'market cap piyasa değeri kapitalizasyon'],
  ['', 'basics reading', 'supply arz token'],
  ['', 'safety networks', 'mint freeze yetki token'],
  ['', 'reading', 'hacim volume fiyat price'],
  ['', 'reading safety', 'kaynak zaman eksik veri kapsam']
];

const educationMyths = [
  ['basics reading', 'market cap', 'Birim fiyat düşükse coin ucuzdur.', 'Birim fiyatı dolaşımdaki arz ve piyasa değeriyle birlikte oku. İki varlığın birim fiyatı aynı olsa bile piyasa büyüklükleri farklı olabilir.'],
  ['reading safety', 'volume liquidity rug pull', 'Yüksek hacim varsa işlem her an kolaydır.', 'Hacim geçmiş işlemleri, likidite ise bir işlemin fiyatı ne kadar oynatabileceğini anlatır. Likidite sığ olduğunda fiyat sert hareket edebilir. Bir rug pull vakasında likiditenin çekilmesi ani kayba yol açabilir.'],
  ['reading', '24s 24h volatilite', 'Bir günde yükseldiyse yükseliş sürecektir.', '24 saatlik değişim geçmişi gösterir. Hareketin o güne özgü olup olmadığını anlamak için birkaç dönemi karşılaştır.'],
  ['networks safety', 'mint kontrat sahte token', 'Tokenın adı aynıysa proje de aynıdır.', 'Ad ve simge kopyalanabilir. Resmî kaynaktan ağı ve tam kontrat adresini, Solana tokenlarında ise mint adresini karşılaştır.']
];

const educationQuiz = [
  ['basics reading', 'market cap', 'Aynı fiyatta iki coinin piyasa değeri farklı olabilir mi?', 'Evet. Piyasa değeri, fiyat ile dolaşımdaki arzın çarpımıdır. Arzları farklıysa piyasa değerleri de farklı olur.'],
  ['reading', 'volume liquidity hacim likidite', '24 saatlik hacim o anda likiditeyi tek başına gösterir mi?', 'Hayır. Hacim geçmişte gerçekleşen işlemleri ölçer. O anda yapılacak bir işlemin fiyatı ne kadar oynatabileceği likiditeyle ilgilidir.'],
  ['reading', 'volatilite 24s 24h değişim', 'Coin bir günde %8 düşmüşse, son hafta boyunca düşmüş müdür?', 'Bunu anlamak için haftanın fiyat geçmişine bak. %8 yalnızca son 24 saatteki net değişimi ifade eder.'],
  ['safety', 'seed phrase kurtarma kelimeleri', 'Destek ekibi kurtarma kelimelerini isterse ne yaparsın?', 'Paylaşma. Mesajdaki bağlantıya tıklama ve gerekiyorsa projenin resmî sitesinden destek kanalını kendin aç.']
];

function educationCardAttributes([id, topics, keywords]) {
  return `${id ? ` id="${id}" tabindex="-1"` : ''} data-edu-card data-topics="${topics}" data-keywords="${keywords}"`;
}

function educationNormalize(text) {
  return text.normalize('NFKD').replace(/\p{M}/gu, '')
    .toLowerCase().replaceAll('ı', 'i').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

const educationFilterState = {query: '', topic: ''};
let activeEducationRoute = null;

function educationSetupPage(page) {
  const input = page.querySelector('#edu-query');
  const chips = [...page.querySelectorAll('[data-edu-topic]')];
  const groups = [...page.querySelectorAll('[data-edu-group]')].map(group => [
    group, [...group.querySelectorAll('[data-edu-card]')].map(card => ({
      card,
      topics: card.dataset.topics.split(' '),
      index: educationNormalize(card.dataset.keywords + ' ' + card.textContent)
    }))
  ]);
  const empty = page.querySelector('#edu-empty');
  const status = page.querySelector('#edu-results-status');
  const clearButton = page.querySelector('[data-edu-clear]');
  const routeButtons = page.querySelectorAll('[data-edu-route]');
  const syncRoute = () => {
    for (const button of routeButtons) {
      const expanded = button.dataset.eduRoute === activeEducationRoute;
      button.setAttribute('aria-expanded', String(expanded));
      page.querySelector('#' + button.getAttribute('aria-controls')).hidden = !expanded;
    }
  };
  syncRoute();
  const refresh = () => {
    const terms = educationNormalize(educationFilterState.query).split(' ').filter(Boolean);
    let count = 0;
    for (const [group, cards] of groups) {
      let matches = 0;
      for (const {card, topics, index} of cards) {
        const visible = (!educationFilterState.topic || topics.includes(educationFilterState.topic))
          && terms.every(term => index.includes(term));
        card.hidden = !visible;
        matches += Number(visible);
      }
      group.hidden = matches === 0;
      count += matches;
    }
    empty.hidden = count > 0;
    clearButton.hidden = !educationFilterState.query && !educationFilterState.topic;
    for (const chip of chips) {
      chip.setAttribute('aria-pressed', String(chip.dataset.eduTopic === educationFilterState.topic));
    }
    const message = count ? count + ' içerik gösteriliyor.' : 'Eşleşen içerik bulunamadı.';
    if (status.textContent !== message) status.textContent = message;
  };
  const reset = () => {
    educationFilterState.query = '';
    educationFilterState.topic = '';
    input.value = '';
    refresh();
  };
  input.value = educationFilterState.query;
  input.addEventListener('input', () => {
    educationFilterState.query = input.value;
    refresh();
  });
  page.addEventListener('click', event => {
    const control = event.target.closest('button');
    if (!control) return;
    if (Object.hasOwn(control.dataset, 'eduTopic')) {
      educationFilterState.topic = control.dataset.eduTopic;
      refresh();
    } else if (Object.hasOwn(control.dataset, 'eduClear')) {
      reset();
      input.focus();
    } else if (control.dataset.hubJump) {
      const target = page.querySelector('#' + control.dataset.hubJump);
      target.focus({preventScroll: true});
      target.scrollIntoView({block: 'start'});
    } else if (control.dataset.eduRoute) {
      const step = control.dataset.eduRoute;
      activeEducationRoute = activeEducationRoute === step ? null : step;
      syncRoute();
    }
  });
  refresh();
}

learn = function () {
  return `<div class="edu-page edu-path hub-page" lang="tr">
    <header class="hub-hero">
      <div class="hub-hero-copy">
        <p class="eyebrow">ÖĞRENME MERKEZİ</p>
        <h1>Kriptoyu adım adım öğren.</h1>
        <p>Blokzincir ağlarını tanı, coin karnesindeki verileri yorumla ve temel riskleri fark et.</p>
        <div class="hub-actions">
          <button class="btn primary" type="button" data-hub-jump="edu-route-title">Öğrenmeye başla</button>
          <button class="btn" type="button" data-hub-jump="edu-query">Kavram ara</button>
        </div>
      </div>
      <div class="hub-glance">
        <h2>Başlangıç rotası</h2>
        <ol>
          <li><span>Ağlar ve varlıklar</span></li>
          <li><span>Fiyat ve piyasa değeri</span></li>
          <li><span>Oynaklık ve likidite</span></li>
          <li><span>Güvenlik</span></li>
        </ol>
      </div>
    </header>
    <section class="panel edu-panel edu-filters hub-filter" aria-label="Öğrenme merkezinde ara ve filtrele">
      <label for="edu-query">Öğrenme merkezinde ara</label>
      <div class="edu-search-row">
        <input id="edu-query" type="search" placeholder="Örn. market cap, hacim, seed phrase, Solana" autocomplete="off">
        <button type="button" class="btn" data-edu-clear hidden>Temizle</button>
      </div>
      <div class="edu-chips" role="group" aria-label="Konuya göre filtrele">
        ${[['', 'Tümü'], ...educationTopics].map(([key, title]) =>
          `<button type="button" class="btn" data-edu-topic="${key}" aria-pressed="false">${title}</button>`).join('')}
      </div>
      <p id="edu-results-status" class="edu-results-status" role="status"></p>
    </section>
    <section class="panel edu-panel edu-route" aria-labelledby="edu-route-title">
      <h2 id="edu-route-title" tabindex="-1">Önce Şunu Oku</h2>
      <p class="hub-route-hint">Bir adım seç. Açıklaması ve coin karnesinde neye bakacağın burada açılır.</p>
      <ol role="list">${educationRoute.map(([id, title, subtitle, lesson, application], index) => `<li role="listitem">
        <button type="button" id="route-button-${id}" data-edu-route="${id}" aria-expanded="false" aria-controls="route-panel-${id}">
          <span class="edu-step" aria-label="${index + 1}. adım">${index + 1}</span>
          <span><strong>${title}</strong><small>${subtitle}</small></span>
        </button>
        <div class="hub-route-detail" id="route-panel-${id}" role="region" aria-labelledby="route-button-${id}" hidden>
          <h3>${index + 1}. Adım · ${title}</h3>
          <p>${lesson}</p>
          <p><strong>Mercek’te neye bakılır?</strong> ${application}</p>
        </div>
      </li>`).join('')}</ol>
    </section>
    <div id="edu-empty" class="panel edu-panel" hidden>
      <h2>Eşleşen içerik yok</h2>
      <p>Başka bir kavram yazabilir veya filtreleri temizleyebilirsin.</p>
      <button type="button" class="btn" data-edu-clear>Tüm içerikleri göster</button>
    </div>
    <section class="panel edu-panel" data-edu-group>
      <div${educationCardAttributes(['edu-networks', 'basics networks', 'bitcoin ethereum solana blockchain blokzincir ağ'])}>
        <h2>Kripto piyasası ve blokzincir ağları</h2>
        <p>Bitcoin, Ethereum ve Solana farklı blokzincir ağlarıdır. BTC, ETH ve SOL bu ağların kendi varlıklarıdır. Tokenlar bir ağ üzerinde çalışır ve benzer adlarla birden fazla ağda bulunabilir. Bir varlığı incelerken hangi ağa ait olduğunu ve veri kaynağını kontrol et.</p>
      </div>
    </section>
    <section class="panel edu-panel" data-edu-group>
      <h2>Temel Kavramlar ve Metrik Rehberi</h2>
      ${educationDefinitionList(educationConcepts, educationDefinitionMeta)}
      <p><a href="https://www.coingecko.com/en/faq" target="_blank" rel="noopener noreferrer">CoinGecko metrik açıklamaları</a></p>
    </section>
    <section class="panel edu-panel" id="edu-safety" tabindex="-1" data-edu-group>
      <h2>Yeni Başlayanlar İçin Temel Güvenlik Notları</h2>
      <p>Mercek zincir üzerindeki kontratları veya yetkileri doğrulamaz. Aşağıdaki adımlar kendi kontrollerini yapmana yardımcı olur.</p>
      ${educationDefinitionList(educationSafety, educationSafetyMeta)}
      <p><a href="https://ethereum.org/security/" target="_blank" rel="noopener noreferrer">Ethereum güvenlik rehberi</a> ·
         <a href="https://solana.com/docs/tokens" target="_blank" rel="noopener noreferrer">Solana token belgeleri</a></p>
    </section>
    <details class="panel edu-panel" data-edu-disclosure="example" data-edu-group>
      <summary>Örnek veri görünümünü dene</summary>
      <div${educationCardAttributes(['', 'reading', 'örnek veri piyasa değeri market cap arz hacim'])}>
        ${educationExampleMarkup()}
      </div>
    </details>
    <section class="panel edu-panel hub-lessons" data-edu-group>
      <h2>Uygulamalı okuma notları</h2>
      <div class="edu-quiz hub-lesson-grid" lang="${lang}">${t('lessons').map(([title, body], index) =>
        `<details data-edu-disclosure="lesson-${index}"${educationCardAttributes(learningHubLessonMeta[index])}>
          <summary>${title}</summary><p>${body}</p>
        </details>`).join('')}</div>
    </section>
    <section class="panel edu-panel" data-edu-group>
      <h2>Yaygın Yanılgılar ve Doğruları</h2>
      <div class="edu-myth-grid">${educationMyths.map(([topics, keywords, myth, correction]) =>
        `<article class="edu-myth"${educationCardAttributes(['', topics, keywords])}>
          <p class="edu-myth-label">Yanılgı</p>
          <h3>${myth}</h3>
          <p class="edu-truth-label">Doğru</p>
          <p>${correction}</p>
        </article>`).join('')}</div>
    </section>
    <section class="panel edu-panel" data-edu-group>
      <h2>Kendini Kontrol Et</h2>
      <p>Cevabını düşündükten sonra soruyu aç.</p>
      <div class="edu-quiz">${educationQuiz.map(([topics, keywords, question, answer], index) =>
        `<details data-edu-disclosure="quiz-${index}"${educationCardAttributes(['', topics, keywords])}>
          <summary>${question}</summary>
          <p>${answer}</p>
        </details>`).join('')}</div>
    </section>
    <aside class="panel edu-panel edu-bridge" aria-labelledby="edu-bridge-title">
      <h2 id="edu-bridge-title">Şimdi coin karnesinde dene</h2>
      <p>Katalogdan bir varlık seç. Karnesinde birim fiyatı, piyasa değerini ve 24 saatlik hacmi bul. Bir alanın verisi eksikse diğer metriklerden o alan için sonuç çıkarma.</p>
      <button type="button" class="btn btn-primary" onclick="openCatalog()">Coin kataloğunu aç</button>
    </aside>
  </div>`;
};

function openEducationExample() {
  const example = document.querySelector('.edu-path details[data-edu-disclosure="example"]');
  if (!example) return;
  document.querySelector('.edu-path [data-edu-clear]').click();
  example.open = true;
  example.querySelector('summary').focus({preventScroll: true});
  example.scrollIntoView({block: 'start'});
}

function educationCoinReading(asset) {
  const {price_change_percentage_24h: change, market_cap: cap, total_volume: volume} = asset;
  if (Number.isFinite(change)) {
    if (change === 0) return 'Bildirilen 24 saatlik fark %0. Gün içindeki hareketi görmek için grafiği incele.';
    const direction = change > 0 ? 'yükselmiş' : 'gerilemiş';
    return `Bildirilen fiyat son 24 saatte %${new Intl.NumberFormat('tr-TR', {maximumFractionDigits: 4}).format(Math.abs(change))} ${direction}. Hareketin ne kadar sürdüğünü görmek için daha uzun bir döneme bak.`;
  }
  if (Number.isFinite(cap) && cap > 0 && Number.isFinite(volume) && volume >= 0) {
    const ratio = 100 * (volume / cap);
    if (Number.isFinite(ratio)) return `24 saatlik hacmin piyasa değerine oranı yaklaşık %${num(ratio, 4)}. Bu oran işlem hareketini özetler. Likiditeyi değerlendirirken emir derinliğini de incelemek gerekir.`;
  }
  if (Number.isFinite(volume)) {
    return `Bildirilen 24 saatlik hacim ${money(volume, true)}. Hacim geçmiş işlem hareketini gösterir. Fiyatın yönünü okumak için değişim verisi gerekir.`;
  }
  if (Number.isFinite(cap)) {
    return `Bildirilen piyasa değeri ${money(cap, true)}. Bu metrik varlığın piyasa büyüklüğünü gösterir. Fiyatın yönü için değişim verisini incele.`;
  }
  return 'Kısa yorum için 24 saatlik değişim, hacim veya piyasa değeri verisi gerekir.';
}

function educationCoinMarkup(asset) {
  const fields = [
    ['fiyat', asset.current_price],
    ['24 saatlik değişim', asset.price_change_percentage_24h],
    ['piyasa değeri', asset.market_cap],
    ['24 saatlik hacim', asset.total_volume],
    ['dolaşımdaki arz', asset.circulating_supply],
    ['tam seyreltilmiş değer', asset.fully_diluted_valuation],
    ['azami arz', asset.max_supply]
  ];
  const missing = fields.filter(([, value]) => !Number.isFinite(value)).map(([label]) => label);
  const hasQuote = missing.length < fields.length;
  const pending = !!quotePending[asset.id] || (!hasQuote && busy);
  const kind = educationDataKind({
    sample: mode === 'demo' || asset.educationSample === true,
    stale: asset.quote_stale || (!asset.quote_at && cgState.stale),
    available: hasQuote,
    pending
  });
  const source = {
    sample: 'ÖRNEK VERİ · Eğitim amaçlı değerler.',
    stale: 'CoinGecko · Son başarılı kayıt, güncel olmayabilir.',
    market: 'CoinGecko · Piyasa verisi',
    pending: 'CoinGecko verisi yükleniyor.',
    unavailable: 'CoinGecko bu varlık için piyasa verisi sağlayamadı.'
  }[kind];
  return `<section class="panel edu-panel edu-coin" lang="tr" aria-labelledby="edu-coin-title">
    <div class="edu-coin-header">
      <h2 id="edu-coin-title">${esc(asset.name)} için kısa okuma notu</h2>
      <button class="textbutton" type="button" onclick="navigate('learn')">Öğrenme merkezini aç</button>
    </div>
    <div class="edu-data" data-kind="${kind}">${source}</div>
    ${!pending && missing.length ? `<p class="edu-missing">Bu kaynakta şu alanlar için veri yok<b> · </b>${missing.join(', ')}.</p>` : ''}
    ${hasQuote || kind === 'sample' ? `<p>${educationCoinReading(asset)}</p>` : ''}
    ${kind === 'unavailable' ? `<button class="textbutton" type="button" onclick="navigate('learn');openEducationExample()">ÖRNEK VERİ · Eğitim örneğini aç</button>` : ''}
    <p class="edu-reminder">Mercek bu varlığı zincir üzerinde doğrulamaz. Bu not yatırım tavsiyesi değildir.</p>
  </section>`;
}

let educationRenderKey;
render = function () {
  const app = document.querySelector('#app');
  const nextKey = view === 'detail' ? view + ':' + selected + ':' + tab : view;
  const openDisclosures = nextKey === educationRenderKey
    ? new Set([...app.querySelectorAll('details[data-edu-disclosure][open]')].map(item => item.dataset.eduDisclosure))
    : new Set();
  educationRenderKey = nextKey;
  const searchWasFocused = view === 'learn' && document.activeElement?.id === 'edu-query';
  educationRenderBefore();
  if (!demoSession) return;
  if (view === 'learn') {
    const page = app.querySelector('.edu-path');
    if (page) educationSetupPage(page);
    if (searchWasFocused) page?.querySelector('#edu-query').focus({preventScroll: true});
  }
  if (mode === 'demo' && ['home', 'watch', 'detail', 'compare'].includes(view)) {
    app.insertAdjacentHTML('afterbegin',
      '<div class="edu-data" data-kind="sample" role="status" lang="tr"><strong>ÖRNEK VERİ</strong><span>Gösterilen örnek değerler güncel piyasayı yansıtmaz.</span></div>');
  }
  if (!busy && cgState.error && !cgState.data?.length && view === 'home') {
    app.querySelector('.cg-status')?.insertAdjacentHTML('afterend',
      '<section class="panel edu-panel" lang="tr"><h2>Piyasa verisi şu anda alınamadı</h2>' +
      '<p>Coin kataloğunda arama yapmaya devam edebilirsin.</p>' +
      '<details data-edu-disclosure="home-example"><summary>ÖRNEK VERİ · Eğitim örneğini aç</summary>' +
      educationExampleMarkup() + '</details></section>');
  }
  if (view === 'detail' && [0, 1].includes(tab)) {
    const asset = coins.find(coin => coin.id === selected);
    const metricsRoot = app.querySelector('.metrics');
    if (asset && metricsRoot) metricsRoot.insertAdjacentHTML('afterend', educationCoinMarkup(asset));
  }
  for (const item of app.querySelectorAll('details[data-edu-disclosure]')) {
    item.open = openDisclosures.has(item.dataset.eduDisclosure);
  }
};

if (['#education', '#learn'].includes(location.hash)) view = 'learn';
render();
