# Mercek research prototype

Public educational crypto report app, six languages. Original UI retained in public/. Built as a Cloudflare Worker with embedded static assets and server-side research adapters.

## Run and verify

- npm run build (node scripts/build.mjs)
- npm test (node --test tests/*.test.mjs, every test file; a single file such as tests/research.test.mjs can also be run on its own)
- node scripts/validate-artifact.mjs
- npm run dev (local adapter; managed preview is started by sites-preview)

## New behavior

- 7/14/30/90/365/730-day completed UTC daily-candle summaries and maximum close drawdown.
- Data-backed natural-language question parser in six languages; no LLM or forecasting model.
- Thirty-day local pivot clusters, ATR-based tolerance, weak evidence explicitly labelled.
- Recent publisher/Google News RSS headlines with publisher links, timestamps and partial-source status; not a two-year news archive.
- Pre-publication daily close versus first/third subsequent daily close, temporal association only.
- Dynamic active Binance Spot USDT catalogue; CoinMarketCap is not connected.

## Sources and boundaries

Binance data-api.binance.vision read-only spot endpoints (USDT, not USD); existing overview uses CoinGecko USD separately. Current open candles are excluded. Missing or discontinuous periods do not receive fabricated returns. Newly listed assets can have shorter history. News headlines remain in their original language. RSS excerpts/full articles are not stored. API requests use server-controlled hosts; symbols come from an allowlisted static set or the validated exchange catalogue. Public research responses use five/ten-minute HTTP cache headers and a bounded per-isolate cache; the catalogue is memoized for one hour. Shared Cache API is disabled because the hosted runtime restricts it. No wallet, trade, custody, real authentication or private user data is added. Existing sign-in remains an explicitly labelled demo. Provider licensing, abuse protection and legal review remain production-commercialization tasks.

## Deployment

Preserve project identity and existing public audience. Build output is dist/server/index.js plus dist/.openai/hosting.json. public/ is the editable UI source; dist/ is generated. API routes: /api/research/history?asset=solana, /api/research/news?asset=solana, /api/research/catalog. Solana Lab routes: GET /api/solana-lab/status, token, search and metric; POST /api/solana-lab/wallet, analyst and wallet-analyst. Any other /api/solana-lab/ path returns 404. Dynamic catalogue IDs have market:PAIR form. The service worker does not cache /api/ responses.

## CoinGecko top 100
The market list uses the exact public keyless coins/markets endpoint, per_page=100, ordered by market cap in USD. Name/symbol search runs locally. Prices, capitalization and volume are never fabricated on API failure. The localStorage snapshot and persisted retry timestamp survive reloads, with a minimum 60-second cooldown and Retry-After handling. Unknown asset purposes are explicitly labelled; beginner summaries are curated and market commentary is deterministic, not a connected language model. History/news coverage remains limited to supported mapped assets and the separate Binance Spot catalog.

## Full universe and research repair (2026-11-21)
- All 21,338 IDs returned by the CoinGecko coins/list snapshot are searchable, including leading-hyphen and underscore IDs. The directory refreshes through the public endpoint when older than 24 hours; the bundled directory remains an explicitly timestamped fallback.
- The first 100 market records load together. Other quotes load on selection with a persistent 60-second cache. Equal symbols are disambiguated by name and CoinGecko ID.
- Research no longer depends on Binance access from the Worker (production upstream returned 403). Public Binance candles load in the browser; known mappings and exact CoinGecko ticker coin_id matches prevent symbol collisions. If unavailable, daily CoinGecko USD observations provide up to 365 days. Daily observations are labelled separately from intraday OHLC; periods requiring missing history stay unavailable.
- RSS requests remove the custom User-Agent that coincided with provider denial. Cointelegraph per-asset tag feeds supplement general feeds, CoinDesk and Google News. Provider failures are partial, not a failure of the whole tab. A dated bundled RSS headline snapshot is used only if live feeds fail. No article bodies are stored. Recent-feed absence does not imply no news exists.
- Research math is generated from the same pure functions used by the Worker. Browser calculations exclude open candles and refuse to bridge missing dates. Local caches persist failed-attempt cooldowns; 429 delays are shared per provider host without blocking own-site news.
- Repeated research requests share a promise. New assets and direct detail links survive reloads. Quote errors leave news and history independently accessible.
Validation: node --test tests/*.test.mjs (32 tests at that release; run npm test for the current count); node scripts/validate-artifact.mjs. Browser QA includes Solana two-year history, 30-day levels, two-week question, full-directory search, PENGU quote/history and detail reload. A zero-error guarantee or universal coverage of every token, all news and two years of history is not possible with keyless upstream providers.

## Expanded Q&A repair (2026-11-22)
The reported “son 4 haftadaki durumu özetle” was rejected because the old regex did not recognize “durum/özetle”. The shared qa-core parser replaces it with six-language period and topic recognition (including number words, inflected Turkish words, exact ISO/dotted date ranges, 1–730 completed days, multiple topics and follow-up period context). Four weeks always computes 28 daily intervals, independently of a 14-day navigation selection.

The assistant renders source-grounded facts for purpose, founders, technology, supply, market cap, volume, risk, exchanges and history; it supports comparisons and combined price/news questions. Project facts load from a validated matching CoinGecko coin profile. Source-language excerpts are labelled and HTML escaped. Personal forecasts receive context and risks rather than a blanket question error. Invalid dates, insufficient history and another named coin are distinguished from unsupported phrasing. Asynchronous replies remain bound to the selected coin.

There is NO language model connection and no API secret. The user declined the optional model-provider plugin. This release must not be described as unrestricted ChatGPT-like conversation or as able to answer every possible question. Unknown details remain unknown and sources are shown. No question is transmitted to an external model; only coin IDs are used for provider data requests.

Validation: 86 automated tests at that release (run npm test for the current count), including the exact screenshot regression, number words in six languages, multi-intent parsing, 28-day arithmetic, missing data, date boundaries, HTML/link sanitization and existing caching/news tests. Browser QA covers the screenshot question, follow-up volume, supply, comparison, purpose/founder/technology, invalid period and cross-coin clarification.

## Solana Lab · Dev3pack önizlemesi

### Kurulum

Node.js 22 veya üzeri kullan. Proje bağımlılıksız JavaScript ve bir HTTP Worker’dan oluşur.

```sh
npm run build
npm test
npm run dev
```

Yerelde `http://localhost:5173` açılır. Build sonucu `dist/server/index.js` standart bir Worker girişidir. Arşiv üretim barındırma kimliğini içermez.

| Sunucu değişkeni | Kullanım |
| --- | --- |
| `SOLANA_MAINNET_RPC_URL` | İsteğe bağlı özel Mainnet RPC. Varsayılan mint sorgusu Solana public RPC (erişim sorunu için dRPC yedeği), en büyük token hesapları sorgusu PublicNode (dRPC yedeği). |
| `SOLANA_DEVNET_RPC_URL` | İsteğe bağlı Devnet RPC. |
| `JUPITER_API_KEY` | İsteğe bağlı Jupiter kotası. |
| `MERCEK_AI_API_KEY` | Canlı AI özeti için gerekli sunucu anahtarı. |
| `MERCEK_AI_MODEL` | İsteğe bağlı model seçimi. |

Değerleri yalnız ortam değişkeni veya sunucu sırrı olarak tanımla. AI anahtarı bulunmadığında ekran işaretli kural tabanlı kısa açıklamayı gösterir.

### Mimari ve veri

Mevcut CoinGecko arayüzü, piyasa akışı ve Worker rotaları korunur. Deneme ana sayfası doğrudan Mainnet mint analizini açar. `public/solana-lab.js` karneyi gösterir. `worker/solana-lab.mjs` Base58 doğrulamasını, kaynak isteklerini, zaman damgalarını, istek sınırlarını ve önbelleği yönetir. Her kaynak bağımsız sonuçlanır. O anki kaynak sorgusu ve 30–45 saniyelik önbellek kayıtları ayrı işaretlenir. Örnek düğmeleri canlı taramayı çağırır.

Solana Lab arayüzü Türkçe, İngilizce, Almanca, Rusça, İspanyolca ve İtalyancadır. Türkçe ve İngilizce metinler `public/solana-lab.js` içindedir. Almanca, Rusça, İspanyolca ve İtalyanca metinler `public/solana-lab-i18n.js` içindedir. Çevirisi eksik bir anahtar İngilizceye düşer. 29 adımlı tur ve ana sayfadaki giriş metinleri yalnız Türkçedir.

- [Solana RPC](https://solana.com/docs/rpc/http/getaccountinfo) · SPL Token ve Token-2022 mint hesabı, yetkiler, toplam arz, hassasiyet ve slot.
- [Solana en büyük token hesapları](https://solana.com/docs/rpc/http/gettokenlargestaccounts) · en fazla 20 hesabın ham bakiyeleri toplamı / mintin toplam arzı. Hesap sıralaması, kişi veya sahip sıralaması değildir. Saklama, protokol, borsa veya havuz adresleri ayrıştırılmaz. Sağlayıcıların slotları farklı olabilir. Toplam arz sıfırsa veya hesap toplamını karşılamıyorsa oran hesaplanmaz.
- [DEX Screener](https://docs.dexscreener.com/api/reference) · dönen ve Solana mint adresi eşleşen havuzlar içinde USD likiditesi en yüksek havuz seçilir. Hacim ve işlem adedi yalnız seçilen havuza aittir. Eşitlikte havuz adresi kullanılır.
- [Jupiter Tokens V2](https://developers.jup.ag/docs/tokens/token-information) · mint eşleşmeli token kimliği, fiyat ve doğrulama. Organic Score ve doğrulama, piyasa kalitesi göstergeleri olarak kullanılır.
- AI, karne girdilerinin özet kimliğini doğrular ve yalnız sunucunun elde ettiği yapılandırılmış bulguları alır. Karne verisi değiştiğinde yeniden analiz gerekir. Sayısal değerleri karne gösterir. Modelin metnindeki rakamlar reddedilir (her yazı sistemindeki rakamlar dahil). Yalnız uygulamanın verdiği adlar (mint adresi, tokenın kendi adı ve sembolü, Token-2022, Tokens V2) ve sırayla gelen 1., 2., 3. liste işaretleri kabul edilir. Tokenın adı ve sembolü en fazla 32 karakter olmalı ve tek rakam grubu içermelidir. Canlı sağlayıcı testi anahtar gerektirir.

### Risk metodolojisi

`worker/solana-risk.mjs` yüksek puanı daha fazla risk göstergesi olarak yorumlar.

| Kriter | Azami katkı | Kural |
| --- | ---: | --- |
| Mint yetkisi | 20 | Etkin 20, kaldırılmış 0. |
| Freeze yetkisi | 15 | Etkin 15, kaldırılmış 0. |
| En büyük token hesaplarının payı | 25 | %20, %40, %60 ve %80 üst sınırları sırasıyla 0, 7, 15, 21. %80 üzeri 25. |
| Seçilen havuzun USD likiditesi | 20 | En az 1 milyon 0, 100 bin 5, 25 bin 12, 5 bin 17. 5 bin altı 20. |
| Seçilen havuzun 24 saatlik aktivitesi | 10 | İşlem ve USD hacim eşikleri (1000, 100000) için 0, (100, 10000) için 3, (20, 1000) için 6. Daha düşük pozitif aktivite 9. Sıfır işlem veya sıfır hacim 10. |
| Jupiter doğrulaması ve Organic Score | 10 | Doğrulanmamış 5 puan. Organic Score katkısı 5 eksi skorun yirmiye bölümünün aşağı yuvarlanmış değeri. |

Son skor yalnız kapsam 100 iken verilir. Kısmi sonuç aralığı, bilinen risk puanından başlar ve bilinmeyen kriter ağırlıklarının toplamı kadar genişler. 0–39 daha olumlu göstergeler, 40–59 orta, 60–79 yüksek, 80–100 çok yüksek risk göstergeleridir. Bu metodoloji eğitim amaçlıdır. Token-2022 uzantıları, program güvenliği ve varlık denetleyicisinin kimliği kapsam dışıdır. Özel Solana programı veya kontratı dağıtılmamıştır.

### Geliştirme geçmişi

- **21–23 Kasım 2026 · Hackathon öncesi:** Mercek coin karnesi, piyasa akışı, katalog, eğitim ve karşılaştırma altyapısı. Ayrı Solana Lab önizlemesinde RPC, Jupiter, Phantom ve ilk risk modeli.
- **23 Kasım 2026 · Hackathon öncesi:** Girişsiz ana ekran, kaynak kanıtı ve zamanları, token hesabı yoğunlaşması, mint eşleşmeli havuz seçimi, yüksek puan = yüksek risk yönü ve rapora bağlı AI girdi doğrulaması eklendi.
- **27–29 Kasım 2026 · Global etkinlik:** Bu paket hazırlanırken etkinlik başlamamıştı. Etkinlik sırasında geliştirme yapıldığı iddia edilmez.

Demo metni ve form notu için [DEMO.md](DEMO.md).

## Rehberli demo sürümü · 23 Kasım 2026
Solana Lab varsayılan olarak açıkça etiketlenen demo modunda açılır. Token raporu, ağ durumu ve portföy örnekleri dış servise ihtiyaç duymadan çalışır. USDC/BONK adları senaryoyu tanımak içindir, gösterilen sayılar ve yetki adresleri sentetiktir. Diğer geçerli mintler genel örnek karne üretir. Demo cüzdan bağlantısı bir simülasyondur. AI alanındaki açıklama kural tabanlıdır. Rapor bağlantısı `mode=demo` veya `mode=live` bilgisini taşır. Canlı moda geçiş tüm demo sonuçlarını temizler.

Lab içindeki “Nasıl kullanılır?” düğmesi, aşağıda anlatılan 29 adımlı turu Solana Lab bölümünden açar. İlk sürümdeki yedi adımlı ayrı rehberin yerini aldı. Tur ileri, geri, kapat, bitir ve Escape ile kontrol edilir. Gerçek RPC veya AI erişimi demo eklenerek çözülmüş sayılmaz.

## Token seçimi ve genel uygulama rehberi · 23 Kasım 2026
Tarayıcıya aranabilir token listesi eklendi. USDC, BONK ve Wrapped SOL mintleri kayıtlıdır. Yerel filtre adı, sembolü veya minti eşleştirir. Diğer tokenları ara düğmesi sunucuda Jupiter Tokens V2 search uç noktasını sorgular, en fazla 20 geçerli mint gösterir ve 60 saniye önbellek kullanır. Servis anahtar isterse JUPITER_API_KEY sunucuda ayarlanmalıdır. Devnet için Jupiter araması yapılmaz. Liste tam Solana token evreni olarak sunulmaz. Demo modunda seçilen diğer mintler açıkça genel eğitim senaryosu üretir.

Bu sürümde Nasıl kullanılır düğmeleri 14 adımlı bir Türkçe turu açıyordu. Güncel tur 29 adımdır ve aşağıdaki bölümde anlatılır. Tur Keşfet, coin karnesi, Takip Listem, Karşılaştır, Öğrenme Merkezi, Lab ve genel düğmeleri anlatır. İleri, geri, Escape ve bitir kontrolü vardır. Tur ilgili ekranı açar ve mümkün olduğunda alanı vurgular. Favorilere varlık eklemez, gerçek cüzdan bağlamaz.

## Keşfet açılışı ve yerinde kullanım turu · 23 Kasım 2026
Kök URL misafir erişimiyle Keşfet ekranını açar. Açık #solana-lab rapor bağlantıları hedefini korur. Koyu tema geri getirildi. İlk ziyaret, aynı tarayıcıda localStorage içindeki mercek-coach-seen-v1 ile takip edilir. Tur ilk Keşfet ziyaretinde otomatik başlar. Başlatıldığı anda görüldü olarak işaretlenir, kapatılırsa sonraki açılışta zorla başlamaz. Tarayıcı saklama alanı temizlenirse tekrar ilk ziyaret sayılır.

Keşfet içindeki Nasıl kullanılır düğmesi, ilgili düğme veya alanın yanında kısa açıklamalar gösteren 29 adımlı turu yeniden açar. Ayrı bölüm listesi yoktur. Devam et, Geri, Şimdilik kapat ve son adımda Tamam düğmeleri bulunur. Tur sekmeler arasında gezinir ve gereken raporu okuma amacıyla açar. Favorilere varlık eklemez veya gerçek cüzdan bağlamaz. Açılır balon yeniden boyutlandırma ve kaydırmada ilgili alana konumlanır. Escape ile kapatılır ve klavye odağı balon içinde döner.

### Jüri bağlantısı ve eksik kaynaklar

- `/#solana-lab?mode=live&network=mainnet&view=jury` giriş ve öğretici adımlarını beklemeden canlı Mainnet tarayıcısını açar. Normal ana sayfa misafir girişi ve Keşfet öğreticisi üzerinden ilerler.
- Hazır mintler, jüri karşılaştırması ve örnek senaryoların Explorer bağlantıları `public/solana-examples.json` kataloğunu kullanır. Canlı karşılaştırma bağlantısı Mainnet ve iki tam mint adresini taşır. Yeni sekme iki sorguyu bağımsız başlatır.
- `SOLANA_MAINNET_RPC_URL` ve `SOLANA_DEVNET_RPC_URL` sunucu tarafındaki birincil RPC adresleridir. `SOLANA_MAINNET_LARGEST_BACKUP_RPC_URL` ve `SOLANA_DEVNET_LARGEST_BACKUP_RPC_URL` ilgili ağ için `getTokenLargestAccounts` destekleyen ikinci sağlayıcıyı tanımlar. Bu metot her sağlayıcıya en fazla bir kez, 5,2 saniye zaman sınırıyla çağrılır. Varsayılan herkese açık RPC uçlarının kota ve metot kısıtları olabilir. Yedek uç canlı bir mint ile test edilmelidir.
- En büyük hesaplar kesinleşmiş (`finalized`) kayıtlar üzerinden sorgulanır. Yanıtın hesap adresleri benzersiz ve bakiyeler azalan sırada olmalıdır. Karne en fazla ilk 20 hesabı kullanır.
- Canlı piyasa sorgusunda DEX Screener token-pairs (5,5 sn), GeckoTerminal token-pools (6,5 sn) ve gerekirse DEX Screener arama (3,2 sn) kullanılır. 429 yanıtından sonra sağlayıcının Retry-After süresi boyunca o sağlayıcı atlanır. Doğru ağ ve tam mint adresiyle eşleşen, likidite ve 24 saatlik aktivite verisi tam havuzlar arasında en yüksek USD likiditesi seçilir. Metrik yenilemesi önce mevcut havuzu arar. Tüm ölçümler aynı havuza ve sağlayıcı yanıtına aittir. Geçerli tam sonuçlar ağ ve mint bazında 45 saniye önbelleklenir. Sağlayıcı hatasında aynı Worker örneği son başarılı veriyi 10 dakikaya kadar, zamanı ve yaşıyla gösterebilir. Sağlayıcı sorgu ayrıntıları ağ, HTTP durumu, süre ve filtreleme sonuçlarını API üzerinden sunar.
- Devnet için ayrıca bir RPC tanımlanmamışsa yalnız standart Helius Mainnet uç noktasının gizli anahtarı Helius’un ayrı Devnet adresine aktarılır. Wrapped SOL’da zincirde raporlanan mint arzı sıfırsa arz payı uygulanmaz olarak işaretlenir.
- Portföy toplamı için SOL bakiyesi, her iki token programı ve mevcut bakiyelerin fiyatları doğrulanır. Eksik toplam “Hesaplanamadı” olarak, fiyatı doğrulanan varlıkların değeri ve alt toplamın kapsamı ayrıca gösterilir.
- Canlı AI, yayın ortamında `MERCEK_AI_API_KEY` tanımlandığında etkinleşir. Yanıt önbelleği dil ve karne kimliğine bağlıdır.


### Canlı portföy ve model özeti

- Cüzdan Karnesi, Phantom onayı veya açık adresle aynı salt okunur RPC sorgusunu kullanır. SOL, SPL Token ve Token-2022 kaynakları ayrı gösterilir. Miktarlar zincirdeki tam sayı ve ondalıklarla birleştirilir. USD hesabına yalnızca Jupiter Tokens V2'de minti eşleşen, pozitif fiyatı bulunan kalemler girer. Fiyatlar 50 mintlik gruplarla sorgulanır. İstemci tamamlanan grupları gösterirken sıradaki grupları alır. Başarılı sorgular ağ ve mint bazlı önbelleklenir. Sağlayıcı 429 döndürdüğünde Retry-After gözetilir. Yarım kalan sorgularda daha önce başarılı olan zincir okumaları ve fiyatlar korunur.
- Seçici yenileme ve portföy açıklaması, ağ ve adrese bağlı, on dakikalık sıkıştırılmış ve şifreli anlık görüntüyü kullanır. Bir `MERCEK_WALLET_SNAPSHOT_KEY` tanımlanabilir. Mevcut Helius anahtarlı RPC yapılandırması varsa anlık görüntü için bundan ayrı bir kriptografik anahtar türetilir. Bu özellik anahtarları istemciye aktarmaz ve sunucu tarafında portföy kaydı tutmaz.
- Portföy açıklaması OpenAI Responses API kullanır. Yayın ortamında `MERCEK_AI_API_KEY` veya `OPENAI_API_KEY` gizli değer olarak yapılandırılır. Model `MERCEK_AI_MODEL` ile seçilir ve varsayılan `gpt-4.1-mini` olur. Modelin seçtiği cümleler doğrulanmış portföyden üretilen seçeneklerle sınırlandırılır. İstek cüzdan adresi, mint veya serbest metin metadata içermez. Model erişimi yoksa Kurallara dayalı özet gösterilir.
