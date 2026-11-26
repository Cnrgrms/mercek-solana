/* Solana Lab is isolated from Mercek's existing market routes. */
(() => {
  const words = {
    kicker:['SOLANA TOKEN INTELLIGENCE','SOLANA TOKEN INTELLIGENCE'],
    lead:['Mint adresini tara, zincir üstü yetkileri ve piyasa verisini aynı raporda incele.','Scan a mint to inspect on-chain authorities and market data in a single report.'],
    overview:['Piyasa özeti','Market Overview'], scanner:['Token tarayıcı','Token Scanner'], risk:['Risk göstergeleri','Risk indicators'],
    analyst:['Bulguların açıklaması','Findings explained'], wallet:['Cüzdan karnesi','Wallet report'], status:['Solana ağ durumu','Solana Network Status'],
    watch:['CoinGecko piyasasını aç','Open CoinGecko markets'], look:['Tek bir mint adresi gir','Enter one mint address'], scan:['Analiz et','Analyze'],
    example:['Hazır mintler','Ready-to-use mints'], loading:['Yükleniyor…','Loading…'], unknown:['Veri yok','Unavailable'],
    note:['Bu prototip taramayı okuma amaçlı yapar. İşlem veya imza talep etmez.','This prototype is read-only. It requests no signature or transaction.'],
    dev:['Devnet · test ağı. Jupiter fiyatları ve USD portföy değeri yalnız Mainnet için gösterilir.','Devnet is the test network. Jupiter prices and USD portfolio valuation are Mainnet only.'],
    main:['Mainnet · Solana RPC, DEX Screener ve Jupiter.','Mainnet · Solana RPC, DEX Screener and Jupiter.'],
    report:['Token raporu','Token Report'], share:['Rapor bağlantısını kopyala','Copy report link'], copied:['Bağlantı kopyalandı.','Link copied.'],
    print:['Yazdır / PDF olarak kaydet','Print / save as PDF'], coverage:['Ağırlıklı veri kapsamı','Weighted data coverage'],
    range:['Olası skor aralığı','Possible score range'], disclaimer:['Skor kural tabanlı bir göstergedir. Yatırım tavsiyesi veya güvenlik garantisi değildir. Akıllı sözleşme ve Token-2022 uzantıları bu skorla denetlenmez.','The rule-based score is neither advice nor a security guarantee. This is not a smart-contract or Token-2022 extension audit.'],
    positive:['Daha az risk göstergesi','Fewer risk indicators'], moderate:['Orta düzey risk göstergeleri','Moderate risk indicators'], high:['Yüksek risk göstergeleri','High risk indicators'], veryHigh:['Çok yüksek risk göstergeleri','Very high risk indicators'],
    partial:['Kesin kategori için veri yetersiz','Insufficient data for a final category'], mint:['Token üretme yetkisi','Mint authority'], freeze:['Hesap dondurma yetkisi','Freeze authority'],
    holders:['Üst holder yoğunlaşması','Top-holder concentration'], liquidity:['Likidite','Liquidity'], activity:['İşlem aktivitesi','Trading activity'], verification:['Doğrulama ve Organic Score','Verification and Organic Score'],
    revoked:['Yetki kapalı','Authority disabled'], enabled:['Yetki aktif','Authority enabled'], market:['Jupiter piyasa verileri · Mainnet','Jupiter market data · Mainnet'],
    rpc:['Solana RPC · zincir üstü veri','Solana RPC · on-chain data'],
    aiAction:['AI raporu oluştur','Generate AI report'], rules:['Kural tabanlı açıklama','Rules-based explanation'],
    good:['Olumlu göstergeler','Favorable indicators'], weak:['Dikkat gerektiren göstergeler','Indicators to review'],
    missing:['Hesaplanamayan kriterler','Unscored criteria'], clear:['Bu grupta değerlendirilen gösterge yok.','No scored indicator in this group.'],
    connect:['Cüzdanı bağla','Connect wallet'], connectPhantom:['Phantom’u bağla','Connect Phantom'], disconnect:['Bağlantıyı kes','Disconnect'], openPhantom:['Phantom uygulamasında aç','Open in Phantom'],
    walletConsent:['Bağlantı ve bakiye yenileme, herkese açık adresini bakiye sorgusu için Solana RPC’ye iletir. Adres Mercek’te kaydedilmez.','Connect and refresh send your public address to Solana RPC to retrieve balances. Mercek does not store your address.'],
    refresh:['Yenile','Refresh'], noWallet:['Uyumlu cüzdan bulunamadı. Phantom’u tarayıcıda etkinleştir veya Phantom uygulamasından aç.','No compatible wallet found. Enable Phantom in your browser or open this site in Phantom.'],
    walletFail:['Cüzdan bağlantısı tamamlanamadı.','Wallet connection could not be completed.'],
    valuation:['Portföy değeri','Portfolio value'], subtotal:['Doğrulanabilen ara toplam','Verified subtotal'],
    valuationUnavailable:['Hesaplanamadı','Unavailable'],
    valuationPartial:['Toplam değer için SOL bakiyesi, iki token programı ve eldeki varlıkların fiyatları doğrulanmalı.','A total requires a verified SOL balance, both token programs and prices for the holdings.'],
    valuationDevnet:['Devnet portföyü USD olarak değerlenmez.','Devnet holdings are not valued in USD.'],
    sourceLabel:['Kaynak','Source'], jury:['Canlı Solana analizini aç','Open live Solana analysis'], accountCoverage:['Okunabilen token programı','Token programs read'],
    tokenCounts:['Fiyatı bulunan SPL varlığı','Priced SPL assets'], riskCoverage:['Skoru hesaplanabilen varlık','Assets with a complete score'],
    usd:['USD fiyatı','USD price'], cap:['Piyasa değeri','Market cap'], fdv:['FDV','FDV'], count:['Holder sayısı','Holder count'],
    volume:['24s hacim','24h volume'], buys:['24s alım','24h buys'], sells:['24s satım','24h sells'], verified:['Jupiter doğrulaması','Jupiter verified'],
    organic:['Organic Score','Organic Score'], yes:['Doğrulanmış','Verified'], no:['Doğrulanmamış','Not verified'],
    metadata:['Bilgiler güncellenebilir mi?','Is metadata mutable?'],
    liveMainnet:['Canlı Mainnet','Live Mainnet'], indicator:['Gösterge','Indicator'],
    userMeaning:['Kullanıcı için anlamı','What it means'], chainRecord:['Zincir kaydı','On-chain record'],
    dataSource:['Kaynak ve sorgu zamanı','Source and query time'],
    metadataMeaning:['Düzenleme yetkisi ad, sembol veya tanıtım bağlantısını değiştirmeye izin verebilir.','Edit authority may allow changes to the name, symbol, or metadata link.'],
    portfolioAsset:['Varlık','Asset'], portfolioAmount:['Miktar','Amount'], portfolioUsd:['USD değeri','USD value'],
    marketAccounts:['Piyasa ve token hesapları','Market and token accounts'], poolLiquidity:['Havuz likiditesi','Pool liquidity'],
    metadataMutable:['Güncellenebilir','Mutable'], metadataImmutable:['Güncellenemez','Immutable'],
    metadataMissing:['Standart metadata hesabı bulunamadı','No standard metadata account found'],
    metadataExternal:['Harici metadata kaynağı doğrulanamadı','External metadata source could not be verified'],
    metadataUnknown:['Doğrulanamadı','Unverified'],
    metadataHelp:['Metadata, tokenın adı, sembolü ve görsel bağlantısı gibi tanıtım bilgilerini içerir. Güncellenebilir durumdaysa yetkili hesap bu alanları değiştirebilir.','Metadata contains information such as the token name, symbol, and image link. If mutable, the update authority can change these fields.'],
    mintHelp:['Etkinse yetkili hesap yeni token üretebilir. Bu, arzın mutlaka artacağı anlamına gelmez.','An active mint authority can issue new tokens. This does not mean the supply will increase.'],
    freezeHelp:['Etkinse yetkili hesap, belirli token hesaplarını dondurarak bu hesaplardaki transferleri durdurabilir.','An active freeze authority can freeze individual token accounts and stop transfers from them.'],
    verifyUnknown:['Kaynak ulaşılabilir olduğunda yeniden sorgula.','Try again when the source is available.'],
    holdingsTitle:['Öne çıkan SPL / Token-2022 varlıkları','Notable SPL / Token-2022 holdings'],
    holdingsOrder:['USD değeri bulunan varlıklar, değer sırasıyla önce gösterilir.','Holdings with a USD value appear first, ordered by value.'],
    tokenRead:['Token hesabı sorgusu tamamlandı','Token-account lookup completed'],
    emptyHoldings:['Pozitif bakiyeli SPL veya Token-2022 varlığı bulunamadı.','No positive SPL or Token-2022 holdings were found.'],
    walletIncomplete:['Token listesi kısmi. Okunamayan hesaplar için varlık bulunmadığı varsayılmaz.','The holdings list is partial. Unread token accounts may contain holdings.'],
    emptyMint:['Analiz etmek için bir mint adresi gir veya bir örnek seç.','Enter a mint address or select an example.'],
    emptyWallet:['Sorgulamak için herkese açık Solana cüzdan adresini gir.','Enter a public Solana wallet address.'],
    last:['Son analiz' ,'Last analysis'], invalid_address:['Geçersiz adres. 32 baytlık Solana Base58 adresi gir.','Invalid address. Enter a 32-byte Solana Base58 address.'],
    mint_not_found:['Bu ağda mint hesabı bulunamadı.','Mint account not found on this network.'], not_a_token_mint:['Bu adres bir token minti değil.','This address is not a token mint.'],
    token_not_indexed:['Jupiter bu mint için sonuç döndürmedi.','Jupiter returned no match for this mint.'],
    mainnet_only:['Jupiter piyasa verisi Mainnet analizlerinde gösterilir.','Jupiter market data appears in Mainnet scans.'],
    credentials_required:['Veri sağlayıcısı bu sorguyu kabul etmedi. Biraz sonra yeniden dene.','The data provider did not accept this request. Try again shortly.'],
    rate_limit:['İstek sınırına ulaşıldı. Biraz sonra yeniden dene.','Rate limit reached. Try again shortly.'],
    upstream_rate_limit:['Veri sağlayıcısı istekleri sınırladı. Yeniden dene.','The upstream provider rate-limited the request. Please retry.'],
    upstream_error:['Kaynak yanıt vermedi veya bağlantı kurulamadı.','The data source was unavailable.'],
    upstream_timeout:['Kaynak zaman aşımına uğradı.','The data source timed out.'],
    ai_not_configured:['AI servisi yapılandırılmamış.','AI is not configured.'],
    insufficient_data:['Rapor için kaynak verisi bulunamadı.','No source data is available for this report.']
  };
  Object.assign(words,{
    wallet_rpc_unavailable:['Solana bakiye kaynağına ulaşılamadı. Biraz sonra Yenile ile tekrar dene.','Solana balance data is unavailable. Use Refresh to try again shortly.'],
    walletCanceled:['Cüzdan bağlantısı onaylanmadı. Hazır olduğunda tekrar bağlanabilirsin.','The wallet connection was declined. You can try again when ready.'],
    walletApproval:['Cüzdan uygulamanda bağlantı isteğini onayla.','Approve the connection in your wallet.'],
    walletReadOnly:['Adres sorgusu · Salt okunur','Address lookup · Read only'],
    portfolioPrice:['USD fiyatı','USD price'],
    walletPricingMore:['Kalan fiyat grupları sorgulanıyor…','Fetching the remaining price groups…'],
    walletPriceRetryAt:['Fiyat sağlayıcısı yeniden sorgu zamanı','Price provider retry time'],
    walletWrapped:['Wrapped SOL','Wrapped SOL'],
    walletPriceNotReturned:['Sağlayıcı fiyat yayımlamadı','Provider returned no price'],
    walletPriceFailed:['Fiyat sorgusu başarısız','Price lookup failed'],
    walletPricePending:['Fiyat sorgusu bekliyor','Price lookup pending'],
    walletPriceCoverage:['USD toplamı gözlenen {total} varlığın {priced} tanesini kapsıyor.','The USD total covers {priced} of {total} observed assets.'],
    walletEmptyVerified:['Portföy boş. SOL bakiyesi ve iki token programı başarıyla sorgulandı.','The portfolio is empty. The SOL balance and both token programs were read successfully.'],
    walletChainComplete:['SOL ve iki token programı başarıyla okundu.','SOL and both token programs were read successfully.'],
    walletPriceComplete:['USD toplamı gözlenen tüm varlıkları kapsıyor.','The USD total covers all observed assets.'],
    walletRules:['Kurallara dayalı özet','Rules-based summary'],
    walletAiTitle:['AI açıklaması','AI explanation'],
    walletAiAction:['AI ile portföyü açıkla','Explain portfolio with AI'],
    walletAiUnavailable:['AI şu anda kullanılamıyor. Kurallara dayalı özet gösteriliyor.','AI is unavailable. The rules-based summary is shown.'],
    wallet_snapshot_expired:['Portföy özeti yenilenmeli. Yenile ile yeni bir sorgu başlatabilirsin.','The portfolio snapshot needs renewal. Use Refresh to start a new lookup.'],
    walletLeader:['Fiyatı bulunan varlıklar içinde en büyük kalemin USD değerindeki payı','Largest holding’s share of priced value'],
    walletConnected:['Cüzdan bağlı','Wallet connected'],
    walletAddressLabel:['Herkese açık Solana adresi','Public Solana address'],
    walletLookup:['Bakiyeyi sorgula','Look up balance'],
    walletClear:['Sorguyu kapat','Close lookup'],
    walletInstall:['Phantom’u edin','Get Phantom'],
    walletLiveAction:['Canlı cüzdana geç','Switch to live wallet'],
    walletSetup:['Bilgisayarda cüzdan uzantını etkinleştir. Telefonda bu ekranı Phantom içinden açıp bağlantıyı onayla. Herkese açık bir adresle de bakiye sorgulayabilirsin.','Enable your wallet extension on desktop. On mobile, open this page in Phantom and approve the connection. You can also look up a public address.'],
    invalid_search:['Arama için en az iki karakter yaz.','Enter at least two characters.'],
    title:['Solana tokenını analiz et','Analyze a Solana token'],
    pool:['Piyasa likiditesi','Market liquidity'],
    concentration:['En büyük token hesaplarının arz payı','Share held by largest token accounts'],
    holders:['En büyük token hesaplarının arz payı','Share held by largest token accounts'],
    ownershipScope:['Solana RPC en büyük 20 token hesabına kadar veri verir. Bir sahip birden fazla hesabı kontrol edebilir. Havuz, borsa ve protokol hesapları bu ölçümde ayrıştırılmaz.','Solana RPC returns up to the 20 largest token accounts. One owner can control multiple accounts. Pool, exchange and protocol accounts are not separated here.'],
    poolRule:['Önce DEX Screener, gerekirse GeckoTerminal sorgulanır. Doğru Solana mintiyle eşleşen, likidite ve 24 saatlik aktivite verisi tam havuzlar arasında USD likiditesi en yüksek olan seçilir. Yeniden sorguda önce mevcut havuz denenir.','DEX Screener is preferred, with GeckoTerminal as fallback. Of the matching Solana pools with liquidity and complete 24-hour activity, the highest USD liquidity wins. A retry prefers the existing pool.'],
    pool_incomplete:['Havuz eşleşti, piyasa ölçümleri eksik.','Pool matched, market metrics are incomplete.'],
    pool_mismatch:['Doğru Solana mintiyle eşleşen havuz bulunamadı.','No pool matches the exact Solana mint.'],
    pool_access_denied:['Piyasa sağlayıcısı erişimi reddetti.','The market provider denied access.'],
    poolDiagnostics:['Sağlayıcı sorgu ayrıntıları','Provider request details'],
    trades24:['24 saatlik işlem sayısı','24-hour transaction count'],
    riskScore:['Risk skoru','Risk score'],
    stale:['Eski veri · son başarılı sorgu','Stale data · last successful query'],
    staleAge:['Veri yaşı','Data age'],
    switchedPool:['Farklı bir havuzdan veri alındı. İlk değerlendirilen havuz','Data came from a different pool. First pool considered'],
    partialData:['Bazı kaynaklar eksik. Mevcut bulgular aşağıda gösteriliyor.','Some sources are missing. Available findings are shown below.'],
    riskDirection:['Yüksek puan daha fazla risk göstergesi anlamına gelir.','A higher score indicates more risk signals.'],
    supply:['Toplam arz','Total supply'], decimals:['Ondalık hassasiyet','Decimals'],
    explorer:['Solana Explorer’da minti aç','Open mint in Solana Explorer'],
    viewPool:['Kaynakta havuzu aç','Open pool at source'],
    alternatePool:['GeckoTerminal yedek kaynağında eşleşen havuz gösteriliyor. Havuz adresi birincil kaynaktakinden farklı olabilir.','Showing a matching pool from GeckoTerminal. Its address may differ from the primary source’s pool.'],
    nativeScope:['Uygulanamaz · Mint arzı sıfır','Not applicable · Zero mint supply'],
    nativeSupply:['Wrapped SOL, SOL’un token hesaplarında tutulan biçimidir. Zincirdeki mint arzı 0 olduğu için bu alana göre arz payı hesaplanamaz ve ilgili 25 puan veri kapsamına eklenmez.','Wrapped SOL is SOL held in token accounts. The mint supply is zero, so this share cannot be computed and the corresponding 25 points are outside the data coverage.'],
    viewJupiter:['Jupiter’da tokenı aç','Open token in Jupiter'],
    cached:['Önbellekten','Cached'], live:['Kaynak sorgulandı','Source queried'],
    concentration_unavailable:['Arz payı hesaplanamadı. Hesap bakiyeleri veya geçerli toplam arz eksik.','Supply share could not be computed. Account balances or valid total supply are missing.'],
    pool_not_found:['Bu mint için USD likiditesi bulunan bir havuz dönmedi.','No pool with USD liquidity was returned for this mint.'],
    report_changed:['Kaynak verisi değişti. AI özeti için karneni yeniden analiz et.','Source data changed. Run the analysis again before generating the AI summary.'],
    ai_unverified_numbers:['AI çıktısında doğrulanamayan sayı bulundu. Kural tabanlı özet gösteriliyor.','The AI output contained an unverified number. The rules-based summary is shown.'],
    programContext:['Yetki adresi · Denetleyenin kimliği doğrulanmadı','Authority address · Controller identity not verified'],
    noExtensions:['Token-2022 için metadata durumu okunur. Transfer kısıtları ve diğer uzantılar bu karnenin kapsamı dışındadır.','This report reads Token-2022 metadata status. Transfer restrictions and other extensions are outside its scope.'],
    scope:['Risk modeli · kaynak ve kapsam','Risk model · source and coverage'],
    exampleData:['Örnek veri · canlı kaynaktan alınmadı','Sample data · not fetched from a live source'],
    summaryTR:['Türkçe','Turkish'],
    rpc_error:['RPC sağlayıcısı zincir sorgusunu kabul etmedi.','The RPC provider rejected the chain query.'],
    unexpected_payload:['Veri sağlayıcısından beklenmeyen bir yanıt geldi.','The provider returned an unexpected response.'],
    sourceUnavailable:['Veri alınamadı','Data unavailable'],
    sourceNoResult:['Sorgulandı · veri yok','Queried · no data'],
    compareLive:['USDC ve BONK’u canlı karşılaştır','Compare USDC and BONK live'],
    compareTitle:['Zincir üstü yetki karşılaştırması','On-chain authority comparison'],
    compareShare:['Karşılaştırma bağlantısını kopyala','Copy comparison link'],
    compareOpen:['Paylaşılabilir karşılaştırmayı aç','Open shareable comparison'],
    retry:['Tekrar dene','Retry'],
    retryToken:['Yeniden analiz et','Analyze again'],
    onChain:['Zincir üstü bulgular','On-chain findings'],
    authorityNote:['Yetkinin varlığı, kullanıldığını veya kötüye kullanıldığını göstermez.','Having an authority does not establish that it was used or abused.'],
    noMissing:['Tüm skor kriterleri hesaplandı.','All scoring criteria were measured.'],
    mintClosed:['Bu yetkiyle yeni token üretilemez.','New tokens cannot be issued using this authority.'],
    freezeClosed:['Bu yetkiyle token hesapları dondurulamaz.','Token accounts cannot be frozen using this authority.'],
    authorityUnknown:['Yetki durumu zincir kaynağından doğrulanamadı.','The chain source could not verify the authority.'],
    aiGenerated:['AI ile oluşturulan açıklama','AI-generated explanation'],
    priceMissing:['Fiyat alınamadı','Price unavailable'],
    solIncluded:['SOL değeri dahil','SOL value included'],
    solExcluded:['SOL değeri hesaplanamadı','SOL value unavailable'],
    baseBalance:['SOL bakiyesi','SOL balance'],
    refreshMissing:['Eksik veriyi yeniden sorgula','Retry missing data'],
    refreshMetricPending:['Eksik veri sorgulanıyor…','Fetching missing data…'],
    refreshMetricFailed:['Veri bu denemede de alınamadı. Mevcut bulgular korunuyor.','Data is still unavailable. Existing findings are preserved.'],
    refreshMetricPartial:['Bazı değerler güncellendi. Eksik alanlar yeniden sorgulanabilir.','Some values were updated. Missing fields can be retried.'],
    refreshMetricDone:['Metrik güncellendi.','Metric updated.'],
    scopeMeasured:['Ölçülen kriterler','Measured criteria'],
    zeroSupply:['Mint arzı sıfır olduğu için arz payı hesaplanamaz. Bu kriterin 25 puanı kapsama eklenmez.','Supply share cannot be calculated from a zero mint supply. The criterion’s 25 points are excluded from data coverage.']
  });
  Object.assign(words,{
    demoTitle:['DEMO · Örnek veriler','DEMO · Sample data'],
    demoText:['Tüm sayısal değerler, yetkiler, havuz ve cüzdan bilgileri eğitim senaryosudur. Zincirden doğrulanmış güncel veri değildir.','All numbers, authorities, pool and wallet details are an educational scenario. They are not current data verified on-chain.'],
    liveTitle:['CANLI VERİ MODU','LIVE DATA MODE'],
    liveText:['Kaynaklara erişilemediğinde eksik alanlar işaretlenir.','Missing fields are marked when sources are unavailable.'],
    goLive:['Canlı veriye geç','Switch to live data'], demoOn:['Demo modunu aç','Open demo mode'],
    previewSummary:['Hackathon önizlemesi · Yetki karşılaştırması ve cüzdan senaryoları','Hackathon preview · Authority comparison and wallet scenarios'],
    mintPlaceholder:['Solana mint adresini yapıştır','Paste Solana mint address'],
    pickerSummary:['Token adı veya sembolüyle ara','Search by token name or symbol'],
    pickerLabel:['Listeden token seç','Choose a token from the list'],
    pickerPlaceholder:['Ad, sembol veya mint adresi ara','Search name, symbol or mint address'],
    pickerSearch:['Diğer tokenları ara','Search other tokens'],
    pickerHint:['Kayıtlı tokenlar anında süzülür. Diğer tokenları ara, Jupiter kaynağını sorgular. Aynı isimli tokenlarda mint adresini kontrol et.','Saved tokens filter instantly. Searching other tokens queries Jupiter. For tokens with the same name, check the mint address.'],
    pickerSelect:['Seç ve analiz et','Select and analyze'],
    pickerEmpty:['Listede eşleşme yok. Diğer tokenları ara düğmesini kullanabilir veya mint adresini aşağıya yapıştırabilirsin.','No match in the list. You can use the search button for other tokens or paste the mint address below.'],
    pickerDevnet:['Jupiter araması Mainnet içindir. Devnet mint adresini aşağıya girebilirsin.','Jupiter search is for Mainnet. You can enter a Devnet mint address below.'],
    pickerSearching:['Jupiter üzerinde aranıyor…','Searching on Jupiter…'],
    pickerResults:['Jupiter · {n} sonuç. İsim ve mint adresini birlikte kontrol et.','Jupiter · {n} results. Check the name and mint address together.'],
    pickerNoResults:['Jupiter eşleşme döndürmedi.','Jupiter returned no match.'],
    pickerFailed:['Arama kaynağına erişilemedi. {reason} Kayıtlı tokenları seçebilir veya mint adresi girebilirsin.','The search source was unavailable. {reason} You can choose a saved token or enter a mint address.'],
    demoNetwork:['DEMO · Ağ durumu senaryosu · Slot {slot}','DEMO · Network status scenario · Slot {slot}'],
    activityFmt:['{n} işlem / 24s','{n} trades in 24h'],
    demoSource:['DEMO · Eğitim senaryosu','DEMO · Educational scenario'],
    unitSec:['sn','sec'], unitMin:['dk','min'],
    method_mint:['Aktif yetki tam risk puanı, kapalı yetki sıfır puan.','Enabled earns full risk points, disabled earns zero.'],
    method_freeze:['Aktif yetki tam risk puanı, kapalı yetki sıfır puan.','Enabled earns full risk points, disabled earns zero.'],
    method_holders:['%20, %40, %60 ve %80 üst sınırları sırasıyla 0, 7, 15 ve 21 risk puanı. %80 üzeri 25.','At most 20%, 40%, 60% and 80% contribute 0, 7, 15 and 21 risk points. Above 80% contributes 25.'],
    method_liquidity:['USD likiditesi alt sınırları 5 bin, 25 bin, 100 bin ve 1 milyon. Karşılık gelen risk puanları 17, 12, 5 ve 0. 5 bin altı 20 puan.','USD liquidity minimums of 5k, 25k, 100k and 1m contribute 17, 12, 5 and 0. Below 5k contributes 20.'],
    method_activity:['24 saatte işlem ve USD hacmi alt sınırları (20 / 1 bin), (100 / 10 bin), (1.000 / 100 bin) için risk sırasıyla 6, 3, 0. Daha düşük pozitif aktivite 9, sıfır aktivite veya hacim 10.','Trade count and USD volume thresholds of (20 / 1k), (100 / 10k), and (1,000 / 100k) contribute 6, 3, and 0 risk points. Lower positive activity contributes 9, and zero trades or volume contributes 10.'],
    method_verification:['Doğrulama yoksa 5 risk puanı. Organic Score her 20 puanda 1 risk puanı düşürür (azami 5).','Unverified contributes 5 risk points. Every 20 Organic Score points reduces risk by 1 (up to 5).'],
    demoReport:['DEMO · Bu karnedeki değerler ve yetki adresleri eğitim senaryosudur.','DEMO · The values and authority addresses in this report are an educational scenario.'],
    scoreHow:['Skor nasıl hesaplandı?','How was this score calculated?'],
    fieldsMeaning:['Bu bilgiler ne anlama gelir?','What do these fields mean?'],
    demoModel:['DEMO · Model bağlantısı kullanılmaz. Özet karnedeki örnek ölçümlerden hazırlanır.','DEMO · No model connection is used. The summary is prepared from the sample measurements in the report.'],
    phantomHelp:['Phantom açılmadı mı?','Phantom did not open?'],
    phantomHelpBody:['Mercek bağlantısını kopyala. Phantom’u aç, Siteler bölümündeki arama çubuğuna bağlantıyı yapıştır. Sayfayı açınca Cüzdanı bağla seçeneğini kullan.','Copy the Mercek link. Open Phantom, go to Sites and paste the link into its search bar. Open the result, then choose Connect wallet.'],
    phantomLinkLabel:['Mercek cüzdan bağlantısı','Mercek wallet link'], copyLink:['Bağlantıyı kopyala','Copy link'],
    linkSelected:['Bağlantı seçildi. Cihazındaki Kopyala seçeneğini kullan.','Link selected. Use your device’s Copy option.'],
    demoWallet:['DEMO cüzdan · Hayalî bakiye ve varlıklar. Gerçek cüzdan bağlantısı kurulmaz.','DEMO wallet · Fictional balances and holdings. No real wallet connection is made.'],
    demoWalletOpen:['Demo cüzdanını aç','Open demo wallet'],
    authClosed:['kapalı','disabled'], authOpen:['etkin','enabled'],
    demoSummary:['{name} · Demo karnesinde risk göstergesi {score}/100, veri kapsamı {coverage}/100. Mint yetkisi {mint}, freeze yetkisi {freeze}. En büyük örnek token hesabı arzın %{share} payını temsil ediyor. Likidite {liquidity}. Yetkiler token üretme ve hesap dondurma yeteneği açısından, yoğunlaşma ve likidite ise piyasa hareketlerinin etkisi açısından birlikte okunmalıdır. Değerler eğitim senaryosudur. Kural tabanlı açıklama · yatırım tavsiyesi değildir.','{name} · In the demo report the risk indicator is {score}/100 and data coverage is {coverage}/100. Mint authority is {mint}, freeze authority is {freeze}. The largest sample token account represents {share}% of supply. Liquidity is {liquidity}. Authorities should be read for their ability to issue tokens and freeze accounts, and concentration and liquidity for their effect on market moves. The values are an educational scenario. Rules-based explanation · not investment advice.']
  });
  const examples=globalThis.MercekSolanaExamples;
  const reportMath=globalThis.MercekSolanaReportMath;
  const explorer=globalThis.MercekSolanaExplorer;
  const juryTokens=examples.mainnet.filter(token=>['USDC','BONK'].includes(token.symbol));
  const juryMints=juryTokens.map(token=>token.mint).join(',');
  const labLangs=['tr','en','de','ru','es','it'];
  const labLocales={tr:'tr-TR',en:'en-US',de:'de-DE',ru:'ru-RU',es:'es-ES',it:'it-IT'};
  const labLang=()=>typeof lang==='string'&&labLangs.includes(lang)?lang:'tr';
  const labI18n=globalThis.MercekSolanaLabI18n||{};
  const locale=()=>labLocales[labLang()];
  const w=key=>{
    const known=Object.hasOwn(words,key)?key:'upstream_error',code=labLang();
    return code==='tr'?words[known][0]:code==='en'?words[known][1]:(labI18n[code]?.[known]??words[known][1]);
  };
  const wf=(key,values)=>w(key).replace(/\{(\w+)\}/g,(match,name)=>values[name]??match);
  const h=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const state={demo:true,tour:-1,pickerQuery:'',pickerRemote:[],pickerMessage:'',pickerRun:0,network:'mainnet',mint:'',report:null,networkStatus:null,wallet:null,portfolio:null,reportRun:0,walletRun:0,walletAiRun:0,walletAi:null,walletAiStatus:'',connectRun:0,connecting:false,networkRun:0,aiRun:0,scanMessage:'',walletMessage:'',ai:null,aiMessage:'',shareMessage:''};
  const wallets=new Set();
  const walletRegistry={register:(...items)=>{
    for(const item of items) wallets.add(item);
    refreshWalletControls();
    return ()=>{for(const item of items) wallets.delete(item);refreshWalletControls();};
  }};
  window.addEventListener('wallet-standard:register-wallet',event=>{if(typeof event.detail==='function')event.detail(walletRegistry);});
  window.dispatchEvent(new CustomEvent('wallet-standard:app-ready',{detail:walletRegistry}));
  const juryLink='/#solana-lab?mode=live&network=mainnet&view=jury';
  const routes=new URLSearchParams(location.hash.startsWith('#solana-lab?')?location.hash.slice(12):'');
  const juryLanding=routes.get('view')==='jury'&&routes.get('mode')==='live';
  const previewLink='/#solana-lab?mode=demo&view=preview';
  const previewLanding=routes.get('view')==='preview'&&location.hash.startsWith('#solana-lab?');
  if(routes.get('network')==='devnet')state.network='devnet';
  state.demo=routes.get('mode')!=='live';
  state.mint=routes.get('mint')?.slice(0,44)||'';
  const comparison={active:false,entries:new Map(),run:0,message:'',marketMint:juryTokens[0].mint};
  const canCompare=()=>!state.demo&&state.network==='mainnet';
  const sharedComparison=juryLanding&&canCompare()&&routes.get('compare')===juryMints;
  const comparisonUrl=()=>new URL(juryLink+'&'+new URLSearchParams({compare:juryMints}),location.origin).href;
  const format=(n,opts={})=>typeof n==='number'&&Number.isFinite(n)?new Intl.NumberFormat(locale(),{maximumFractionDigits:6,...opts}).format(n):w('unknown');
  const usd=n=>format(n,{style:'currency',currency:'USD',maximumFractionDigits:n>=1?2:8});
  const textDate=iso=>iso?new Intl.DateTimeFormat(locale(),{dateStyle:'medium',timeStyle:'medium'}).format(new Date(iso)):w('unknown');
  const request=async(path,args={},method='GET')=>{
    args={...args,mode:state.demo?'demo':'live'};
    const options={method,signal:AbortSignal.timeout(30000)};
    if(method==='POST')Object.assign(options,{headers:{'Content-Type':'application/json'},body:JSON.stringify(args)});
    let res;
    try {
      res=await fetch('/api/solana-lab/'+path+(method==='GET'?'?'+new URLSearchParams(args):''),options);
    }catch(error){throw Error(error.name==='TimeoutError'?'upstream_timeout':'upstream_error');}
    const data=await res.json().catch(()=>{throw Error('unexpected_payload');});
    if(!res.ok)throw Error(data.error||'upstream_error');
    return data;
  };
  const short=address=>address.slice(0,5)+'…'+address.slice(-5);
  const networkName=()=>state.network==='mainnet'?'Mainnet':'Devnet';
  const section=(id,title,content)=>`<section id="${id}" class="lab-card panel"><h2>${w(title)}</h2>${content}</section>`;
  const metric=(key,value)=>`<div><dt>${w(key)}</dt><dd>${h(value)}</dd></div>`;
  const controlled=(id,text,style='')=>`<button class="btn ${style}" type="button" data-lab-action="${id}">${w(text)}</button>`;
  const panels=()=>`<div class="solana-lab" lang="${labLang()}">
    <div class="lab-demo-banner" role="status"><strong>${w(state.demo?'demoTitle':'liveTitle')}</strong><p>${w(state.demo?'demoText':'liveText')}</p><div class="lab-actions"><button class="btn" data-lab-action="mode">${w(state.demo?'goLive':'demoOn')}</button><button class="btn" data-lab-action="guide">Nasıl kullanılır?</button></div></div>
    <header class="lab-hero">
      <div><p class="eyebrow">${w('kicker')}</p><h1>${w('title')}</h1><p class="lab-tagline">Look Beyond the Price.</p><p>${w('lead')}</p>${canCompare()?'<div class="lab-actions">'+controlled('compare-live','compareLive','primary')+'</div>':''}</div>
      <div class="lab-network"><label for="lab-network">${w('status')}</label>
        <select id="lab-network"><option value="devnet"${state.network==='devnet'?' selected':''}>Devnet</option><option value="mainnet"${state.network==='mainnet'?' selected':''}>Mainnet</option></select>
        <div id="lab-network-result" role="status"></div>${controlled('network','refresh')}
      </div>
    </header>
    <div id="lab-comparison" aria-live="polite"></div>
    ${state.demo?`<details class="lab-card panel lab-jury-panel"${previewLanding?' open':''}>
      <summary>${w('previewSummary')}</summary>
      <mercek-jury-preview></mercek-jury-preview>
    </details>`:''}
    <div class="lab-start">
      ${section('lab-scan','scanner',`<p>${w(state.network==='devnet'?'dev':'main')}</p>
        <form id="lab-form"><label for="lab-mint">${w('look')}</label><div class="lab-input-row">
        <input id="lab-mint" value="${h(state.mint)}" spellcheck="false" autocomplete="off" maxlength="44" placeholder="${h(w('mintPlaceholder'))}">
        <button class="btn primary" type="submit">${w('scan')}</button></div></form>
        <div class="lab-actions"><span>${networkName()} · ${w('example')}</span>${examples[state.network].map(({name,mint})=>`<button class="btn" type="button" data-example-mint="${mint}">${name}</button>`).join('')}</div><p id="lab-scan-feedback" role="status"></p><details class="lab-picker"><summary>${w('pickerSummary')}</summary><div class="lab-picker-content"><label for="lab-token-query">${w('pickerLabel')}</label><div class="lab-input-row"><input id="lab-token-query" type="search" value="${h(state.pickerQuery)}" placeholder="${h(w('pickerPlaceholder'))}" autocomplete="off"><button type="button" class="btn" data-lab-action="search-tokens">${w('pickerSearch')}</button></div><p class="lab-picker-hint">${w('pickerHint')}</p><div id="lab-token-options" class="lab-token-options"></div><p id="lab-token-search-status" role="status"></p></div></details>`)}
      ${section('lab-market','overview',`<p>CoinGecko · Mercek</p>${controlled('market','watch','primary')}`)}
    </div>
    <div id="lab-report"></div>
    <div id="lab-wallet-home"><div id="lab-wallet"></div></div>
  </div>`;
  function repaintNetwork() {
    const node=document.querySelector('#lab-network-result');
    if(!node)return;
    const result=state.networkStatus;
    node.textContent=result?.slot!==undefined&&state.demo?wf('demoNetwork',{slot:format(result.slot)}):result?.slot!==undefined?`${networkName()} · Slot ${format(result.slot)}`+(result.provider?' · '+result.provider:''):result?.error?w(result.error):w('loading');
  }
  async function loadNetwork() {
    const run=++state.networkRun;
    state.networkStatus=null;repaintNetwork();
    try {const status=await request('status',{network:state.network});if(run===state.networkRun)state.networkStatus=status;}
    catch(error){if(run===state.networkRun)state.networkStatus={error:error.message};}
    repaintNetwork();
  }
  const explain=criterion=>{
    const {id,observed}=criterion;
    if(id==='mint'||id==='freeze')return observed===true?w('revoked'):observed===false?w('enabled'):w('unknown');
    if(id==='holders')return observed==null?w('unknown'):format(observed)+'%';
    if(id==='liquidity')return usd(observed);
    if(id==='activity')return observed==null?w('unknown'):wf('activityFmt',{n:format(observed)});
    return observed==null?w('unknown'):'Organic Score '+format(observed)+'/100';
  };
  function evidenceLine(value, operation, demo=false) {
    const source=demo?w('demoSource'):value?.provider;
    const stateLabel=value?w(value.state):w('sourceUnavailable');
    return `<p class="lab-evidence">${[source,operation,stateLabel,value?.queriedAt&&textDate(value.queriedAt)].filter(Boolean).map(h).join(' · ')}</p>`;
  }
  function authorityFinding(criterion) {
    const details=criterion.observed===null?w('authorityUnknown'):w(criterion.id+(criterion.observed?'Closed':'Help'));
    return `<div><dt>${w(criterion.id)}</dt><dd>${h(explain(criterion))}<small>${h(details)}</small></dd></div>`;
  }
  const scopeMessage=scope=>w(scope==='native_supply'?'nativeSupply':'zeroSupply');
  const metricCriteria={accounts:['holders'],rpc:['mint','freeze'],pool:['liquidity','activity'],jupiter:['verification']};
  const metricTitles={accounts:'concentration',rpc:'rpc',pool:'pool',jupiter:'market',metadata:'metadata'};
  const metricStatuses=new WeakMap();
  const pendingMetrics=new Set();
  function metricMissing(report,metric) {
    if(!report||report.demo)return false;
    if(metric==='accounts'&&(report.accountScope||!/^[1-9]\d*$/.test(report.chain?.supply??'')))return false;
    if(report.network==='devnet'&&['jupiter','pool'].includes(metric))return false;
    if(metric==='metadata')return !!report.chain?.program&&!!report.metadata?.issue;
    if(metric==='jupiter'&&report.market?.price==null)return true;
    if(metric==='rpc'&&report.chain?.program&&(report.chain.supply==null||report.chain.decimals==null))return true;
    return report.risk.criteria.some(row=>metricCriteria[metric]?.includes(row.id)&&row.points===null);
  }
  function retryMetricKey(report,metric) {
    return [report.network,report.mint,metric,metric==='pool'?report.pool?.address:''].join(':');
  }
  function metricStatus(report,metric,column=false) {
    const status=metricStatuses.get(report)?.[metric];
    const canRetry=metricMissing(report,metric);
    if(!canRetry&&!status)return '';
    const pending=pendingMetrics.has(retryMetricKey(report,metric));
    return `<div class="lab-metric-retry">
      ${column?`<p><strong>${w(metricTitles[metric])}</strong>${metric==='accounts'&&report.concentration!==null?' · '+format(report.concentration)+'%':''}</p>`:''}
      ${column&&['accounts','pool','jupiter'].includes(metric)?evidenceLine(report.evidence[metric], ''):''}
      ${status||pending?`<p role="status">${w(pending?'refreshMetricPending':status)}</p>`:''}
      ${canRetry?`<button class="btn" type="button" data-retry-metric="${metric}"${column?` data-retry-column="${h(report.mint)}"`:''}${pending?' disabled aria-busy="true"':''}>${w('refreshMissing')}</button>`:''}
    </div>`;
  }
  function fillMissing(current,incoming,fields) {
    if(!current)return incoming;
    const updated={...current};
    for(const field of fields)if(updated[field]==null&&incoming[field]!=null)updated[field]=incoming[field];
    return updated;
  }
  function applyMetric(report,result) {
    const {metric,value,issue,evidence}=result;
    if(metric==='metadata'){
      if(!issue)report.metadata={...value,queriedAt:evidence?.queriedAt,evidenceState:evidence?.state};
      return;
    }
    if(metric==='pool'){
      // Keep a previously displayed pool intact unless this lookup returns a complete replacement.
      if(report.pool&&(issue||!value||evidence?.state==='stale'))return;
      if(value)report.pool=value;
      report.evidence.pool=evidence??report.evidence.pool;
      report.issues.pool=issue;
      return;
    }
    report.evidence[metric]=evidence??report.evidence[metric];
    report.issues[metric]=issue;
    if(issue)return;
    if(metric==='accounts'){
      report.concentration=reportMath.solConcentration(value,report.chain);
      report.biggest=value;
      if(report.concentration===null)report.issues.accounts='concentration_unavailable';
    }else if(metric==='rpc'){
      // Null represents a revoked authority. An omitted authority is unknown.
      report.chain=report.chain?.program?{
        ...fillMissing(report.chain,value,['supply','decimals','slot']),
        mintAuthority:report.chain.mintAuthority===undefined?value.mintAuthority:report.chain.mintAuthority,
        freezeAuthority:report.chain.freezeAuthority===undefined?value.freezeAuthority:report.chain.freezeAuthority
      }:value;
      if(report.chain?.supply==='0'){
        report.accountScope=report.accountScope??'zero_supply';
        report.concentration=null;
        report.issues.accounts=null;
      }else if(report.biggest){
        report.concentration=reportMath.solConcentration(report.biggest,report.chain);
        if(report.concentration!==null)report.issues.accounts=null;
      }
    }else if(metric==='jupiter'){
      report.market=fillMissing(report.market,value,['name','symbol','price','cap','fdv','holders','verified','organic']);
    }
  }
  async function retryMetric(metric,columnMint) {
    const current=()=>columnMint?comparison.entries.get(columnMint)?.report:state.report;
    const report=current();
    if(!metricMissing(report,metric))return;
    const key=retryMetricKey(report,metric);
    if(pendingMetrics.has(key))return;
    const args={network:report.network,mint:report.mint,metric};
    if(metric==='pool'&&report.pool)args.pair=report.pool.address;
    const repaint=()=>columnMint?repaintComparison(columnMint):repaintReport();
    pendingMetrics.add(key);
    repaint();
    let status='refreshMetricFailed';
    try{
      const result=await request('metric',args);
      if(current()!==report||result.mint!==report.mint||result.network!==report.network||result.metric!==metric)return;
      applyMetric(report,result);
      if(!result.issue||metric==='pool'&&result.value){
        const risk=reportMath.solReportRisk(report);
        report.risk=risk;
        const reportId=await reportMath.solReportId(report);
        if(report.risk===risk)report.reportId=reportId;
        report.analyzedAt=new Date().toISOString();
        if(!columnMint&&current()===report){++state.aiRun;state.ai=null;state.aiMessage='';}
        if(metric==='metadata'?!report.metadata?.issue:!report.issues[metric]||metric==='pool'&&result.value)status=metricMissing(report,metric)?'refreshMetricPartial':'refreshMetricDone';
      }
    }catch{}
    finally{
      pendingMetrics.delete(key);
      if(current()===report){
        metricStatuses.set(report,{...metricStatuses.get(report),[metric]:status});
        repaint();
      }else if(current()&&retryMetricKey(current(),metric)===key){
        repaint();
      }
    }
  }
  function missingCriteria(risk,accountScope) {
    const missing=risk.criteria.filter(row=>row.points===null&&(!accountScope||row.id!=='holders'));
    return `${missing.length?`<p class="lab-notice"><strong>${w('missing')}</strong> · ${missing.map(row=>w(row.id)).join(', ')}</p>`:accountScope?'':`<p>${w('noMissing')}</p>`}
      ${accountScope?`<p><strong>${w('concentration')} · ${w('nativeScope')}</strong></p><p>${scopeMessage(accountScope)}</p>
      <p>${w('scopeMeasured')} · ${risk.criteria.filter(row=>row.points!==null).map(row=>w(row.id)).join(', ')}</p>`:''}`;
  }
  function riskSummary(risk) {
    return `<p><strong>${w('coverage')} · ${risk.coverage}/100</strong>${risk.score!==null?' · '+w('riskScore')+' '+risk.score+'/100':risk.coverage>0?' · '+w('riskScore')+' · '+w('range')+' '+risk.points+'–'+risk.upper:''}</p><p>${w(risk.category||'partial')}</p>`;
  }
  const juryRows=[
    ['mint','mint','mintHelp'],
    ['freeze','freeze','freezeHelp'],
    ['metadata','metadata','metadataMeaning'],
    ['evidence','dataSource'],
    ['risk','coverage'],
    ['links','chainRecord'],
  ];
  const metadataLabels={mutable:'metadataMutable',immutable:'metadataImmutable',missing:'metadataMissing',external:'metadataExternal'};
  function comparisonCell(token,row) {
    const item=comparison.entries.get(token.mint);
    const r=item?.report;
    const error=item?.error??(r?.chain?.program?null:r?.issues.rpc);
    const loading=()=>`<span class="lab-jury-muted">${w(error||r?'sourceUnavailable':'loading')}</span>`;
    if(row==='header')return `<strong>${h(token.symbol)}</strong><small>${h(r?.market?.name??token.name)} · Mainnet</small><code>${h(token.mint)}</code>`;
    if(row==='links')return `<a href="${h(explorer(token.mint,'mainnet'))}" target="_blank" rel="noopener noreferrer">${h(token.symbol)} Explorer</a>
      ${r&&(r.chain?.program||r.market||r.pool)?`<button type="button" class="btn" data-compare-scan="${h(token.mint)}">${w('report')}</button>`:''}`;
    if(row==='evidence')return `${r?evidenceLine(r.evidence.rpc,'getAccountInfo'):loading()}
      ${error?`<p class="lab-notice">${w(error)}</p><button type="button" class="btn" data-compare-retry="${h(token.mint)}">${w('retry')}</button>`:''}
      ${r?.chain?.program?metricStatus(r,'rpc',true):''}`;
    if(!r)return loading();
    if(row==='metadata')return `${w(metadataLabels[r.metadata?.status]??'metadataUnknown')}
      ${r.metadata?.queriedAt?evidenceLine({provider:[r.metadata.source,r.metadata.provider].filter(Boolean).join(' · '),state:r.metadata.evidenceState,queriedAt:r.metadata.queriedAt},''):''}
      ${metricStatus(r,'metadata',true)}`;
    if(row==='risk')return riskSummary(r.risk)+missingCriteria(r.risk,r.accountScope)+['accounts','pool','jupiter'].map(key=>metricStatus(r,key,true)).join('');
    const observed=r.risk.criteria.find(criterion=>criterion.id===row)?.observed;
    const status=observed===true?'closed':observed===false?'active':'unknown';
    return `<strong class="lab-jury-${status}">${w(observed===true?'revoked':observed===false?'enabled':'unknown')}</strong>`;
  }
  function poolDetails(report) {
    const pool=report.pool;
    const evidence=report.evidence.pool;
    const host=pool?.provider==='GeckoTerminal'?'https://www.geckoterminal.com/solana/pools/':'https://dexscreener.com/solana/';
    const age=evidence?.state==='stale'?Math.max(0,Math.floor((Date.now()-Date.parse(evidence.queriedAt))/1000)):null;
    return `
      ${report.issues.pool?`<p class="lab-notice">${w(report.issues.pool)}</p>`:''}
      ${evidenceLine(evidence,'',report.demo)}
      ${age!==null?`<p class="lab-notice">${w('staleAge')} · ${h(age<60?format(age)+' '+w('unitSec'):format(Math.floor(age/60))+' '+w('unitMin'))}</p>`:''}
      ${pool?.provider==='GeckoTerminal'?`<p>${w('alternatePool')}</p>`:''}
      ${pool?.previousAddress?`<p>${w('switchedPool')} · <code>${h(pool.previousAddress)}</code></p>`:''}
      ${pool&&!report.demo?`<p>${pool.dex?h(pool.dex)+' · ':''}<code>${h(pool.address)}</code> · <a href="${host}${h(pool.address)}" target="_blank" rel="noopener noreferrer">${w('viewPool')}</a></p>`:''}
      ${evidence?.attempts?.length?`<details class="lab-pool-diagnostics"><summary>${w('poolDiagnostics')}</summary><ul>${evidence.attempts.map(item=>`<li>${h(item.provider)} · ${h(item.source)} · ${item.httpStatus?'HTTP '+h(item.httpStatus)+' · ':''}${h(item.durationMs)} ms · ${h(item.stage)}${item.issue?' · '+w(item.issue):''}${item.schema?' · '+h(item.schema):''}
        ${item.candidates!=null?` · ${h(item.candidates)} → ${h(item.networkMatches)} → ${h(item.mintMatches)} → ${h(item.complete)}`:''}${item.retryAt?' · '+h(textDate(item.retryAt)):''}</li>`).join('')}</ul></details>`:''}`;
  }
  const poolTrades=pool=>pool?.buys!=null&&pool.sells!=null?pool.buys+pool.sells:null;
  function repaintJuryMarket() {
    const panel=document.querySelector('#lab-jury-market');
    if(!panel)return;
    const selected=comparison.marketMint;
    const item=comparison.entries.get(selected);
    const r=item?.report;
    for(const button of panel.querySelectorAll('[data-jury-market]')) {
      button.setAttribute('aria-pressed',String(button.dataset.juryMarket===selected));
    }
    panel.querySelector('[data-jury-market-content]').innerHTML=r?`
      <dl class="lab-metrics">
        ${metric('poolLiquidity',usd(r.pool?.liquidity))}
        ${metric('trades24',format(poolTrades(r.pool)))}
        ${metric('concentration',r.accountScope?w('nativeScope'):r.concentration!=null?format(r.concentration)+'%':w('sourceUnavailable'))}
        ${metric('coverage',r.risk.coverage+'/100')}
      </dl>
      ${poolDetails(r)}
      ${r.accountScope?`<p>${scopeMessage(r.accountScope)}</p>`:evidenceLine(r.evidence.accounts,'getTokenLargestAccounts')}
      ${['pool','accounts'].map(key=>metricStatus(r,key,true)).join('')}`
      :`<p role="status">${w(item?.error?'sourceUnavailable':'loading')}</p>`;
  }
  function repaintComparison(mint) {
    const root=document.querySelector('#lab-comparison');
    if(!root)return;
    if(mint&&root.querySelector('#lab-jury-live')){
      const token=juryTokens.find(token=>token.mint===mint);
      for(const cell of root.querySelectorAll(`[data-column-mint="${mint}"]`)) {
        cell.innerHTML=comparisonCell(token,cell.dataset.juryRow);
      }
      if(comparison.marketMint===mint)repaintJuryMarket();
      return;
    }
    const wallet=document.querySelector('#lab-wallet');
    if(!canCompare()||!comparison.active){
      document.querySelector('#lab-wallet-home').append(wallet);
      root.replaceChildren();
      return;
    }
    const cells=(row,tag)=>juryTokens.map(token=>`<${tag}${tag==='th'?' scope="col"':''} data-column-mint="${h(token.mint)}" data-jury-row="${row}">${comparisonCell(token,row)}</${tag}>`).join('');
    root.innerHTML=section('lab-jury-live','compareTitle',`
      <p class="lab-jury-mode">${w('liveMainnet')}</p>
      <div class="lab-jury-box">
        <p>${w('authorityNote')}</p>
        <div class="lab-jury-table-scroll" tabindex="0" role="region" aria-label="${w('compareTitle')}">
          <table class="lab-jury-table">
            <thead><tr><th scope="col">${w('indicator')}</th>${cells('header','th')}<th scope="col">${w('userMeaning')}</th></tr></thead>
            <tbody>${juryRows.map(([row,label,meaning])=>`<tr><th scope="row">${w(label)}</th>${cells(row,'td')}<td class="lab-jury-muted">${meaning?w(meaning):''}</td></tr>`).join('')}</tbody>
          </table>
        </div>
        <div class="lab-actions">${controlled('compare-share','compareShare')}<a href="${h(comparisonUrl())}" target="_blank" rel="noopener noreferrer">${w('compareOpen')}</a></div>
        <p id="lab-jury-share-status" role="status">${h(comparison.message)}</p>
      </div>
      <div class="lab-jury-grid">
        <section id="lab-jury-market" class="lab-jury-box">
          <header><h3>${w('marketAccounts')}</h3><div class="lab-actions">${juryTokens.map(token=>`<button type="button" class="btn" data-jury-market="${h(token.mint)}">${h(token.symbol)}</button>`).join('')}</div></header>
          <div data-jury-market-content></div>
        </section>
        <div id="lab-jury-wallet-slot"></div>
      </div>`);
    const wasInJury=wallet.closest('#lab-jury-wallet-slot');
    root.querySelector('#lab-jury-wallet-slot').append(wallet);
    if(!wasInJury&&state.portfolio)repaintWallet();
    repaintJuryMarket();
  }
  async function compareToken(mint,run) {
    comparison.entries.set(mint,{});
    repaintComparison(mint);
    try {
      const report=await request('token',{network:'mainnet',mint});
      if(run===comparison.run)comparison.entries.set(mint,{report});
    }catch(error){
      if(run===comparison.run)comparison.entries.set(mint,{error:error.message});
    }
    if(run===comparison.run)repaintComparison(mint);
  }
  function startComparison(scroll=false) {
    if(!canCompare())return;
    const run=++comparison.run;
    Object.assign(comparison,{active:true,entries:new Map(),message:''});
    repaintComparison();
    updateLabUrl();
    if(scroll)document.querySelector('#lab-comparison')?.scrollIntoView({block:'start'});
    return Promise.all(juryTokens.map(token=>compareToken(token.mint,run)));
  }
  function clearComparison() {
    ++comparison.run;
    comparison.active=false;
    comparison.entries.clear();
  }
  const decimalSeparator=()=>(1.1).toLocaleString(locale()).charAt(1);
  function displaySupply(chain) {
    if(!chain?.supply||!Number.isInteger(chain.decimals)||chain.decimals<0||chain.decimals>255)return w('unknown');
    if(!chain.decimals)return chain.supply;
    const padded=chain.supply.padStart(chain.decimals+1,'0');
    const suffix=padded.slice(-chain.decimals).replace(/0+$/,'');
    return padded.slice(0,-chain.decimals)+(suffix?decimalSeparator()+suffix:'');
  }
  function criterionMethod(id) {
    return Object.hasOwn(words,'method_'+id)?w('method_'+id):'';
  }
  function groupNotes(items) {
    return items.length?`<ul>${items.map(row=>`<li>${w(row.id)} · ${h(explain(row))}${row.points==null?'':` (${row.points}/${row.weight})`}</li>`).join('')}</ul>`:`<p>${w('clear')}</p>`;
  }
  function metadataDetails(metadata) {
    const label=metadataLabels[metadata?.status]??'metadataUnknown';
    return `<dl class="lab-metrics lab-metadata">${metric('metadata',w(label))}</dl>
      ${metadata?.queriedAt?`<p class="lab-evidence">${h(metadata.source??'')}${metadata.provider?' · '+h(metadata.provider):''} · ${w(metadata.evidenceState)} · ${h(textDate(metadata.queriedAt))}</p>`:''}
      ${metadata?.issue?`<p class="lab-notice">${w(metadata.issue)}</p>`:''}`;
  }
  function repaintReport() {
    const status=document.querySelector('#lab-scan-feedback');
    const root=document.querySelector('#lab-report');
    if(!root||!status)return;
    status.textContent=state.scanMessage?w(state.scanMessage):state.report&&Object.values(state.report.issues).some(issue=>issue&&issue!=='mainnet_only')?w('partialData'):'';
    const r=state.report;
    if(!r){root.innerHTML=state.scanMessage&&!['loading','invalid_address','emptyMint','mint_not_found','not_a_token_mint'].includes(state.scanMessage)?controlled('retry-token','retryToken'):'';return;}
    const m=r.market;const c=r.chain;const risk=r.risk;
    const identity=m?.name??examples[r.network].find(({mint})=>mint===r.mint)?.name??short(r.mint);
    const chainLink=explorer(r.mint,r.network);
    const evidence=r.evidence;
    const pool=r.pool;
    const metrics=[['usd',usd(m?.price)],['cap',usd(m?.cap)],['fdv',usd(m?.fdv)],
      ['count',format(m?.holders)],['verified',m?.verified==null?w('unknown'):w(m.verified?'yes':'no')],['organic',format(m?.organic)]];
    root.innerHTML=`<article class="lab-report">
      <header class="lab-report-head"><div>${m?.icon?`<img class="lab-token-icon" src="${h(m.icon)}" referrerpolicy="no-referrer" alt="">`:''}
      ${r.demo?`<p class="lab-notice"><strong>${w('demoReport')}</strong></p>`:''}<p class="eyebrow">${w('report')} · ${networkName()}</p><h2>${h(identity)} ${m?.symbol?`<small>${h(m.symbol)}</small>`:''}</h2><code>${h(r.mint)}</code>
      <p>${w('last')} · ${h(textDate(r.analyzedAt))}</p></div>
      <div class="lab-report-actions">${controlled('share','share')}${controlled('print','print')}<small role="status">${h(state.shareMessage)}</small></div></header>
      ${section('lab-findings','onChain',`<dl class="lab-judge-authorities">${risk.criteria.slice(0,2).map(authorityFinding).join('')}</dl>
        ${evidenceLine(evidence.rpc,'getAccountInfo',r.demo)}<p>${w('authorityNote')}</p>
        ${r.issues.rpc?`<p class="lab-notice">${w(r.issues.rpc)}</p>`:''}
        ${riskSummary(risk)}${missingCriteria(risk,r.accountScope)}
        <p><a href="${h(chainLink)}" target="_blank" rel="noopener noreferrer">${w('explorer')}</a></p>`)}
      ${section('lab-risk','risk',`<div class="lab-score">
        <strong>${risk.score==null?'—':risk.score+'/100'}</strong><div><b>${w(risk.category||'partial')}</b><p>${w('coverage')} · ${risk.coverage}/100${risk.score==null&&risk.coverage>0?` · ${w('range')} ${risk.points}–${risk.upper}`:''}</p></div>
        </div><p>${w('riskDirection')}</p><details class="lab-risk-details"><summary>${w('scoreHow')}</summary><div class="lab-criteria">${risk.criteria.map(row=>`<div><b>${w(row.id)}</b><strong>${row.points??'—'}/${row.weight}</strong><p>${h(r.accountScope&&row.id==='holders'?w('nativeScope'):explain(row))}</p><small>${h(r.accountScope&&row.id==='holders'?scopeMessage(r.accountScope):criterionMethod(row.id))}</small></div>`).join('')}</div></details><p class="lab-notice">${w('disclaimer')}</p>`)}
      <div class="lab-start">
        ${section('lab-chain','rpc',`${r.issues.rpc?`<p class="lab-notice">${w(r.issues.rpc)}</p>`:''}
          ${c?.program?`<p>${h(c.program)} · Slot ${format(c.slot)}</p>`:''}
          <dl class="lab-metrics">${risk.criteria.slice(0,2).map(row=>metric(row.id,explain(row))).join('')}${metric('supply',displaySupply(c))}${metric('decimals',format(c?.decimals))}</dl>
          ${metricStatus(r,'rpc')}
          ${metadataDetails(r.metadata)}${metricStatus(r,'metadata')}
          <details class="lab-risk-details"><summary>${w('fieldsMeaning')}</summary>
            <dl class="lab-terms"><dt>${w('mint')}</dt><dd>${w('mintHelp')}</dd><dt>${w('freeze')}</dt><dd>${w('freezeHelp')}</dd><dt>${w('metadata')}</dt><dd>${w('metadataHelp')}</dd></dl>
          </details>
          ${['mintAuthority','freezeAuthority'].map(key=>typeof c?.[key]==='string'?`<p>${w(key==='mintAuthority'?'mint':'freeze')}: <code>${h(c[key])}</code></p>`:'').join('')}
          ${c?.program==='Token-2022'?`<p class="lab-notice">${w('noExtensions')}</p>`:''}
          ${['mintAuthority','freezeAuthority'].some(key=>typeof c?.[key]==='string')?`<p>${w('programContext')}</p>`:''}
          ${evidenceLine(evidence.rpc,'getAccountInfo',r.demo)}
          <p><a href="${h(chainLink)}" target="_blank" rel="noopener noreferrer">${w('explorer')}</a></p>`)}
      </div>
      <div class="lab-start">
        ${section('lab-ownership','concentration',`<p>${w('ownershipScope')}</p>
          <dl class="lab-metrics">${metric('concentration',r.accountScope?w('nativeScope'):r.concentration==null?w('sourceUnavailable'):format(r.concentration)+'%')}</dl>
          ${r.accountScope?'<p>'+scopeMessage(r.accountScope)+'</p>':r.issues.accounts?`<p class="lab-notice">${w(r.issues.accounts)}</p>`:''}
          ${r.accountScope?'':evidenceLine(evidence.accounts,'getTokenLargestAccounts'+(Number.isSafeInteger(r.biggest?.slot)?' · Slot '+format(r.biggest.slot):''),r.demo)}
          ${evidence.accounts?.attempts?.length?`<ul class="lab-wallet-sources">${evidence.accounts.attempts.map(({provider,issue,httpStatus,rpcCode})=>`<li>${h(provider)} · ${w(issue)}${Number.isInteger(httpStatus)?' (HTTP '+httpStatus+')':Number.isInteger(rpcCode)?' (RPC '+rpcCode+')':''}</li>`).join('')}</ul>`:''}
          ${metricStatus(r,'accounts')}
          ${!r.accountScope&&r.biggest?.accounts.length?`<details><summary>${r.biggest.accounts.length} · ${w('concentration')}</summary><ol>${r.biggest.accounts.map(account=>`<li><code>${h(account.address)}</code></li>`).join('')}</ol></details>`:''}`)}
        ${section('lab-pool','pool',`<p>${w('poolRule')}</p>
          <dl class="lab-metrics">${metric('liquidity',usd(pool?.liquidity))}${metric('trades24',format(poolTrades(pool)))}${metric('volume',usd(pool?.volume))}${metric('buys',format(pool?.buys))}${metric('sells',format(pool?.sells))}</dl>
          ${poolDetails(r)}
          ${metricStatus(r,'pool')}`)}
      </div>
        ${section('lab-jupiter','market',`${r.issues.jupiter?`<p class="lab-notice">${w(r.issues.jupiter)}</p>`:''}
          <dl class="lab-metrics">${metrics.map(([key,value])=>metric(key,value)).join('')}</dl>
          ${evidenceLine(evidence.jupiter,'',r.demo)}
          ${metricStatus(r,'jupiter')}
          ${m&&!r.demo?`<p><a href="https://jup.ag/tokens/${r.mint}" target="_blank" rel="noopener noreferrer">${w('viewJupiter')}</a></p>`:''}`)}
      ${section('lab-analyst','analyst',`${r.demo?`<p class="lab-notice">${w('demoModel')}</p>`+controlled('demo-summary','rules','primary'):!r.aiAvailable?'':controlled('ai','aiAction','primary')}
        <p role="status">${state.aiMessage?w(state.aiMessage):''}</p>
        ${state.ai?`<p class="lab-ai-output">${r.demo?'':`<strong>${w('aiGenerated')}</strong><br>`}${h(state.ai)}</p>`:''}
        <h3>${w('rules')}</h3><div class="lab-criteria"><div><b>${w('good')}</b>${groupNotes(risk.criteria.filter(x=>x.points===0))}</div>
        <div><b>${w('weak')}</b>${groupNotes(risk.criteria.filter(x=>x.points!==null&&x.points>0))}</div>
        <div><b>${w('missing')}</b>${groupNotes(risk.criteria.filter(x=>x.points===null&&(!r.accountScope||x.id!=='holders')))}${r.accountScope?`<p><strong>${w('nativeScope')}</strong></p><p>${scopeMessage(r.accountScope)}</p>`:''}</div></div>`)}
    </article>`;
  }
  function updateLabUrl() {
    const params=new URLSearchParams({network:state.network,mode:state.demo?'demo':'live'});
    if(view!=='solana-lab')return;
    if((juryLanding&&!state.demo)||comparison.active)params.set('view','jury');
    if(comparison.active&&canCompare())params.set('compare',juryMints);
    if(previewLanding&&state.demo)params.set('view','preview');
    if(walletLanding)params.set('panel','wallet');
    if(state.report)params.set('mint',state.report.mint);
    history.replaceState(null,'',location.pathname+'#solana-lab?'+params);
  }
  async function scan(mint) {
    const run=++state.reportRun;
    ++state.aiRun;
    Object.assign(state,{mint:mint.trim(),report:null,scanMessage:'loading',ai:null,aiMessage:'',shareMessage:''});
    if(!state.mint||!validSolanaAddress(state.mint)){
      state.scanMessage=state.mint?'invalid_address':'emptyMint';
      updateLabUrl();repaintReport();return;
    }
    updateLabUrl();repaintReport();
    try {const r=await request('token',{network:state.network,mint:state.mint});if(run===state.reportRun){state.report=r.chain?.reason||(!r.chain?.program&&!r.market&&!r.pool)?null:r;state.scanMessage=r.chain?.reason||(!r.chain?.program&&!r.market&&!r.pool?r.issues.rpc:'')||'';updateLabUrl();}}
    catch(error){if(run===state.reportRun)state.scanMessage=error.message;}
    repaintReport();
  }
  async function runAi() {
    if(!state.report?.aiAvailable||state.aiMessage==='loading')return;
    const run=++state.aiRun;state.aiMessage='loading';repaintReport();
    try {const r=await request('analyst',{network:state.network,mint:state.report.mint,language:labLang(),reportId:state.report.reportId},'POST');if(run===state.aiRun&&r.reportId===state.report?.reportId){state.ai=r.output;state.aiMessage='';}}
    catch(error){if(run===state.aiRun)state.aiMessage=error.message;}
    repaintReport();
  }
  function compatibleWallets() {
    return [...wallets].filter(wallet=>wallet?.chains?.some(chain=>chain.startsWith('solana:'))&&wallet.features?.['standard:connect']);
  }
  function phantomProvider(){
    return [window.phantom?.solana,window.solana].find(provider=>provider?.isPhantom&&typeof provider.connect==='function')??null;
  }
  function walletAppUrl(){
    const target=new URL(location.pathname,location.origin);
    target.search=new URLSearchParams({wallet:'live',network:state.network});
    return target.href;
  }
  function phantomBrowse(target){
    return 'https://phantom.com/ul/browse/'+encodeURIComponent(target)+'?'+new URLSearchParams({ref:location.origin});
  }
  function walletConnectionControls(){
    const target=walletAppUrl();
    const phantom=phantomProvider();
    const choices=compatibleWallets();
    const options=choices.map((item,index)=>`<option value="${index}">${h(item.name)}</option>`).join('');
    const select=choices.length?`<label class="sr-only" for="lab-wallet-select">Wallet</label><select id="lab-wallet-select">${options}</select>`:'';
    const connect=choices.some(wallet=>wallet.name!=='Phantom')
      ? `<button class="btn primary" type="button" data-lab-action="connect" ${state.connecting?'disabled':''}>${w(state.connecting?'walletApproval':'connect')}</button>`
      : '';
    const phantomReady=phantom||choices.some(wallet=>wallet.name==='Phantom');
    const phantomButton=phantomReady?`<button class="btn primary" type="button" data-lab-action="connect-phantom" ${state.connecting?'disabled':''}>${w(state.connecting?'walletApproval':'connectPhantom')}</button>`:'';
    const mobile=phantomReady?'':`
      <div class="lab-actions">
        <a class="btn ${connect?'':'primary'}" href="${h(phantomBrowse(target))}">${w('openPhantom')}</a>
        <a class="btn" href="https://phantom.com/download" target="_blank" rel="noopener noreferrer">${w('walletInstall')}</a>
      </div>
      <details class="lab-phantom-help"><summary>${w('phantomHelp')}</summary>
        <p>${w('phantomHelpBody')}</p>
        <label for="lab-phantom-url">${w('phantomLinkLabel')}</label>
        <div class="lab-input-row"><input id="lab-phantom-url" type="url" value="${h(target)}" readonly>
        <button class="btn" type="button" data-lab-action="copy-wallet-link">${w('copyLink')}</button></div>
        <p id="lab-phantom-copy-status" role="status"></p>
      </details>`;
    return `${phantomButton||connect?`<div class="lab-actions">${phantomButton}${connect?select+connect:''}</div>`:''}${mobile}`;
  }
  function refreshWalletControls() {
    const root=document.querySelector('#lab-phantom-controls');
    if(!root||state.wallet)return;
    const controls=walletConnectionControls();
    if(root.walletControls===controls)return;
    const previous=root.querySelector('#lab-wallet-select')?.selectedOptions[0]?.text;
    root.innerHTML=controls;
    root.walletControls=controls;
    const select=root.querySelector('#lab-wallet-select');
    if(select){
      const choices=[...select.options];
      const selected=choices.find(option=>option.text===previous)??choices.find(option=>option.text==='Phantom');
      if(selected)select.value=selected.value;
    }
  }
  function walletEntry(){
    return `<p>${w('walletSetup')}</p><div id="lab-phantom-controls"></div>
      <form id="lab-address-lookup"><label for="lab-public-address">${w('walletAddressLabel')}</label><div class="lab-input-row"><input id="lab-public-address" required maxlength="44" autocomplete="off" spellcheck="false"><button class="btn" type="submit">${w('walletLookup')}</button></div></form>`;
  }
  const walletPriceLabels={not_returned:'walletPriceNotReturned',failed:'walletPriceFailed',pending:'walletPricePending'};
  function walletHoldings(tokens,inJury) {
    const rows=tokens.map(token=>{
      const name=token.symbol??examples[state.network].find(item=>item.mint===token.mint)?.symbol??short(token.mint);
      const button=`<button type="button" class="btn" data-wallet-mint="${h(token.mint)}" title="${h(token.mint)}">${h(name)}</button>`;
      const preciseAmount=displaySupply({supply:token.raw,decimals:token.decimals});
      const amount=h(preciseAmount===w('unknown')?format(token.amount):preciseAmount);
      const missing=state.network==='devnet'?w('unknown'):w(walletPriceLabels[token.priceStatus]??'priceMissing');
      const price=h(token.price==null?missing:format(token.price,{style:'currency',currency:'USD',maximumSignificantDigits:17}));
      const value=h(token.usd==null?missing:usd(token.usd));
      const priceTime=token.priceAt?`<small>${token.priceState==='cached'?w('cached')+' · ':''}${h(textDate(token.priceAt))}</small>`:'';
      return inJury?`<tr><th scope="row">${button}</th><td>${amount}</td><td>${price}${priceTime}</td><td>${value}</td></tr>`
        :`<div>${button}<code>${h(token.mint)}</code><span>${w('portfolioAmount')} · ${amount}</span><span>${w('portfolioPrice')} · ${price} ${priceTime}</span><span>${w('portfolioUsd')} · ${value}</span></div>`;
    }).join('');
    if(!inJury)return `<div class="lab-holdings">${rows}</div>`;
    return `<div class="lab-jury-holdings"><table><thead><tr>${['portfolioAsset','portfolioAmount','portfolioPrice','portfolioUsd'].map(label=>`<th scope="col">${w(label)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`;
  }
  function walletAnalysis(portfolio,holdings) {
    if(state.demo||portfolio.network!=='mainnet')return '';
    const priced=holdings.filter(token=>token.usd!==null).sort((a,b)=>b.usd-a.usd);
    const share=priced.length&&portfolio.knownUsd>0?priced[0].usd/portfolio.knownUsd*100:null;
    const analysis=state.walletAi;
    return `<section class="lab-wallet-analysis">
      <h3>${w(analysis?'walletAiTitle':'walletRules')}</h3>
      ${analysis?`<ul>${['concentration','scope','risk'].map(key=>`<li>${h(analysis.summary[key])}</li>`).join('')}</ul>
        <p class="lab-evidence">${h(analysis.provider)} · ${h(analysis.model)} · ${h(analysis.requestId)}</p>`:
        `<p>${w(portfolio.chainComplete?'walletChainComplete':'walletIncomplete')}</p>
        <p>${w(portfolio.valuationComplete?'walletPriceComplete':'valuationPartial')}</p>`}
      ${share!==null?`<p>${w('walletLeader')} · ${h(format(share,{maximumFractionDigits:2}))}%</p>`:''}
      <p role="status">${state.walletAiStatus?w(state.walletAiStatus):!portfolio.aiAvailable?w('ai_not_configured'):!portfolio.proof?w('wallet_snapshot_expired'):''}</p>
      ${portfolio.aiAvailable&&portfolio.proof?`<button class="btn" type="button" data-lab-action="wallet-ai"${state.walletAiStatus==='loading'||['loading','walletPricingMore'].includes(state.walletMessage)?' disabled':''}>${w('walletAiAction')}</button>`:''}
    </section>`;
  }
  function repaintWallet() {
    const el=document.querySelector('#lab-wallet');
    if(!el)return;
    const p=state.portfolio;
    const inJury=!!el.closest('#lab-jury-wallet-slot');
    const raw=p?.lamportsRaw??(p?.lamports==null?null:String(p.lamports));
    const sol=raw===null?w('unknown'):displaySupply({supply:raw,decimals:9})+' SOL';
    const tokens=!state.demo?p?.tokens.map(token=>token.mint===examples.mainnet.find(item=>item.symbol==='SOL')?.mint?
      {...token,symbol:w('walletWrapped')}:token):p?.tokens;
    const held=p?.native?[{...p.native,symbol:'SOL'},...tokens]:tokens??[];
    const needsRetry=!!(p&&!state.demo&&(p.missingReads?.length||p.pricePending||p.priceFailed||state.network==='mainnet'&&p.pricedAssets<p.observedAssets));
    el.innerHTML=section('lab-portfolio','wallet',`${state.demo?`<p class="lab-notice">${w('demoWallet')}</p>`:`<p>${w('walletConsent')}</p>`}<p>${w('note')}</p>
      ${state.wallet?`
        ${state.demo?'':`<strong>${w(state.wallet.readOnly?'walletReadOnly':'walletConnected')}</strong>`}
        <p><button type="button" class="btn" data-lab-action="wallet-address" title="${h(state.wallet.address)}">${h(short(state.wallet.address))}</button> · ${networkName()} · <b>${h(sol)}</b></p>
        <p id="lab-full-address" hidden><code>${h(state.wallet.address)}</code></p>
        <div class="lab-actions">${controlled('disconnect',state.wallet.readOnly?'walletClear':'disconnect')}
          <button type="button" class="btn" data-lab-action="wallet"${['loading','walletPricingMore'].includes(state.walletMessage)?' disabled':''}>${w('refresh')}</button>
          ${needsRetry&&p.proof?`<button type="button" class="btn" data-lab-action="wallet-retry"${['loading','walletPricingMore'].includes(state.walletMessage)?' disabled':''}>${w('refreshMissing')}</button>`:''}</div>`
        :state.demo?`<div class="lab-actions"><button class="btn primary" data-lab-action="connect">${w('demoWalletOpen')}</button>${controlled('wallet-live','walletLiveAction')}</div>`:walletEntry()}
      <p id="lab-wallet-status" role="status">${state.walletMessage?w(state.walletMessage):''}</p>
      ${p?`<dl class="lab-metrics">${inJury?metric('baseBalance',sol):''}${metric('valuation',p.valuationComplete||state.demo?usd(p.knownUsd):w('valuationUnavailable'))}${!state.demo&&!p.valuationComplete&&p.knownUsd!=null?metric('subtotal',usd(p.knownUsd)):''}${metric('accountCoverage',p.accountCoverage+'/2')}</dl>
      ${p.reads?`<ul class="lab-wallet-sources">${[['balance',w('baseBalance')],['spl','SPL Token'],['token2022','Token-2022']].map(([key,label])=>`<li>${evidenceLine(p.reads[key],label+(p.reads[key]?.slot?' · Slot '+format(p.reads[key].slot):''))}</li>`).join('')}
        ${p.priceRead?`<li>${evidenceLine(p.priceRead,w('portfolioPrice'))}</li>`:''}</ul>`:''}
      ${!state.demo&&state.network==='mainnet'&&p.observedAssets>0?`<p>${h(w('walletPriceCoverage').replace('{priced}',format(p.pricedAssets)).replace('{total}',format(p.observedAssets)))}</p>`:''}
      ${Object.entries(p.priceCoverage??{}).filter(([,count])=>count>0).map(([status,count])=>`<p>${w(walletPriceLabels[status])} · ${h(format(count))}</p>`).join('')}
      ${!state.demo&&!p.valuationComplete?`<p class="lab-notice">${w(state.network==='devnet'?'valuationDevnet':'valuationPartial')}</p>`:''}
      ${p.priceRetryAt>Date.now()?`<p class="lab-notice">${w('walletPriceRetryAt')} · ${h(textDate(p.priceRetryAt))}</p>`:''}
      ${p.issues.map(issue=>`<p class="lab-notice">${w(issue)}</p>`).join('')}
      ${!p.chainComplete&&!state.demo?`<p class="lab-notice">${w('walletIncomplete')}</p>`:p.empty?`<p>${w('walletEmptyVerified')}</p>`:''}
      ${held.length?`<h3>${w('holdingsTitle')}</h3>${walletHoldings(held,inJury)}`:''}
      ${walletAnalysis(p,held)}`:''}`);
    refreshWalletControls();
  }
  function clearWallet() {
    ++state.walletRun;++state.connectRun;++state.walletAiRun;
    state.connecting=false;state.wallet?.off?.();state.wallet=null;state.portfolio=null;
    state.walletMessage='';state.walletAi=null;state.walletAiStatus='';repaintWallet();
  }
  async function loadWallet({selective=false,keep=false}={}) {
    if(!state.wallet)return;
    let proof=selective?state.portfolio?.proof:null;
    if(selective&&!proof)return;
    const run=++state.walletRun;
    ++state.walletAiRun;
    if(!selective&&!keep)state.portfolio=null;
    if(!state.portfolio){state.walletAi=null;state.walletAiStatus='';}
    else if(state.walletAiStatus==='loading')state.walletAiStatus='';
    state.walletMessage='loading';repaintWallet();
    const target={network:state.network,address:state.wallet.address};
    let action=selective?'retry':'continue';
    try {
      for(let page=0;page<12;page++){
        const lastPending=state.portfolio?.pricePending;
        const p=await request('wallet',{...target,...(proof?{proof,priceAction:action}:{})},'POST');
        if(run!==state.walletRun)return;
        state.portfolio=p;state.walletAi=null;state.walletAiStatus='';
        const more=p.proof&&p.pricePending&&!(p.priceRetryAt>Date.now())&&page<11
          &&(action==='retry'||lastPending==null||p.pricePending<lastPending||!proof);
        state.walletMessage=more?'walletPricingMore':'';
        repaintWallet();
        if(!more)return;
        proof=p.proof;action='continue';
      }
    }catch(error){if(run===state.walletRun){state.walletMessage=error.message;repaintWallet();}}
  }
  async function explainWallet() {
    const portfolio=state.portfolio;
    if(!state.wallet||!portfolio?.proof||state.walletAiStatus==='loading'||['loading','walletPricingMore'].includes(state.walletMessage))return;
    const run=++state.walletAiRun;
    state.walletAi=null;state.walletAiStatus='loading';repaintWallet();
    try{
      const data=await request('wallet-analyst',{network:portfolio.network,address:state.wallet.address,
        proof:portfolio.proof,language:labLang()},'POST');
      if(run===state.walletAiRun&&portfolio===state.portfolio){state.walletAi=data;state.walletAiStatus='';}
    }catch(error){
      if(run===state.walletAiRun&&portfolio===state.portfolio)state.walletAiStatus=error.message==='wallet_snapshot_expired'?error.message:'walletAiUnavailable';
    }
    if(run===state.walletAiRun)repaintWallet();
  }
  async function connectWallet(phantomOnly=false) {
    if(state.demo){state.wallet={address:'11111111111111111111111111111111'};await loadWallet();return;}
    if(state.connecting)return;
    const choices=compatibleWallets();
    const index=Number(document.querySelector('#lab-wallet-select')?.value??0);
    const standard=phantomOnly?(phantomProvider()?null:choices.find(wallet=>wallet.name==='Phantom')):choices[index];
    const phantom=phantomProvider();
    if(!standard&&!phantom?.isPhantom){state.walletMessage='noWallet';repaintWallet();return;}
    const connection=++state.connectRun;
    state.connecting=true;state.walletMessage='';repaintWallet();
    try {
      if(standard){
        const result=await standard.features['standard:connect'].connect();
        if(connection!==state.connectRun)return;
        const account=result?.accounts?.find(item=>item.chains?.some(chain=>chain.startsWith('solana:'))&&validSolanaAddress(item.address));
        if(!account)throw Error('missing_account');
        const off=standard.features['standard:events']?.on('change',changes=>{
          if(connection!==state.connectRun||!state.wallet||!changes.accounts)return;
          const next=changes.accounts.find(item=>item.chains?.some(chain=>chain.startsWith('solana:'))&&validSolanaAddress(item.address));
          if(!next?.address){clearWallet();return;}
          if(next.address===state.wallet.address)return;
          state.wallet.address=next.address;
          loadWallet();
        });
        state.wallet={address:account.address,off,disconnect:()=>standard.features['standard:disconnect']?.disconnect()};
      } else {
        const result=await phantom.connect();
        if(connection!==state.connectRun)return;
        const address=result.publicKey?.toString();
        if(!validSolanaAddress(address))throw Error('missing_account');
        const changed=key=>{
          if(connection!==state.connectRun||!state.wallet)return;
          const address=key?.toString();
          if(!validSolanaAddress(address)){clearWallet();return;}
          if(address===state.wallet.address)return;
          state.wallet.address=address;
          loadWallet();
        };
        const disconnected=()=>{if(connection===state.connectRun)clearWallet();};
        phantom.on?.('accountChanged',changed);
        phantom.on?.('disconnect',disconnected);
        state.wallet={address,off:()=>{phantom.off?.('accountChanged',changed);phantom.off?.('disconnect',disconnected);},disconnect:()=>phantom.disconnect()};
      }
      state.connecting=false;
      await loadWallet();
    }catch(error){
      if(connection!==state.connectRun)return;
      state.connecting=false;
      state.walletMessage=Number(error?.code)===4001?'walletCanceled':'walletFail';
      repaintWallet();
    }
  }
  async function disconnectWallet() {
    const disconnect=state.wallet?.disconnect;
    clearWallet();
    const run=state.connectRun;
    try{await disconnect?.();}catch{if(run===state.connectRun){state.walletMessage='walletFail';repaintWallet();}}
  }
  function pickerItems(){
    const known=examples[state.network];
    const map=new Map([...known,...state.pickerRemote].map(item=>[item.mint,item]));
    const query=state.pickerQuery.toLocaleLowerCase(locale()).trim();
    return [...map.values()].filter(item=>[item.name,item.symbol,item.mint].some(value=>value.toLocaleLowerCase(locale()).includes(query)));
  }
  function repaintTokenPicker(){
    const options=document.querySelector('#lab-token-options');if(!options)return;
    const items=pickerItems();
    options.innerHTML=items.length?items.map(item=>`<button type="button" class="lab-token-option" data-pick-mint="${h(item.mint)}"><span><strong>${h(item.name)}</strong> <small>${h(item.symbol)}</small><code>${h(item.mint)}</code></span><span>${w('pickerSelect')}</span></button>`).join(''):`<p>${w('pickerEmpty')}</p>`;
    document.querySelector('#lab-token-search-status').textContent=state.pickerMessage;
  }
  async function searchTokens(){
    const query=state.pickerQuery.trim();if(query.length<2){state.pickerMessage='En az iki karakter yaz.';repaintTokenPicker();return;}
    if(state.network!=='mainnet'){state.pickerMessage=w('pickerDevnet');repaintTokenPicker();return;}
    const run=++state.pickerRun;state.pickerMessage=w('pickerSearching');repaintTokenPicker();
    try{const result=await request('search',{query});if(run!==state.pickerRun)return;state.pickerRemote=result.items;state.pickerMessage=result.items.length?wf('pickerResults',{n:result.items.length}):w('pickerNoResults');}
    catch(error){if(run!==state.pickerRun)return;state.pickerMessage=wf('pickerFailed',{reason:w(error.message)});}
    repaintTokenPicker();
  }
  function validSolanaAddress(address) {
    const alphabet='123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    if(!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address))return false;
    let value=0n;
    for(const char of address)value=value*58n+BigInt(alphabet.indexOf(char));
    const significantBytes=value===0n?0:Math.ceil(value.toString(16).length/2);
    return address.match(/^1*/)[0].length+significantBytes===32;
  }
  function bindLab(root) {
    root.addEventListener('submit',event=>{
      if(event.target.id!=='lab-address-lookup')return;
      event.preventDefault();
      const address=event.target.elements['lab-public-address'].value.trim();
      const status=root.querySelector('#lab-wallet-status');
      if(!validSolanaAddress(address)){
        status.textContent=w(address?'invalid_address':'emptyWallet');
        return;
      }
      ++state.connectRun;state.connecting=false;
      state.wallet={address,readOnly:true};
      loadWallet();
    });

    root.querySelector('#lab-token-query').addEventListener('input',event=>{++state.pickerRun;state.pickerQuery=event.target.value;state.pickerMessage='';repaintTokenPicker();});
    root.querySelector('#lab-token-query').addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();searchTokens();}});

    root.querySelector('#lab-mint').addEventListener('input',event=>{state.mint=event.target.value;});
    root.querySelector('#lab-form').addEventListener('submit',event=>{event.preventDefault();scan(root.querySelector('#lab-mint').value);});
    root.querySelector('#lab-network').addEventListener('change',event=>{
      clearComparison();++state.reportRun;++state.aiRun;++state.pickerRun;state.pickerRemote=[];state.pickerQuery='';state.pickerMessage='';
      const mint=root.querySelector('#lab-mint').value;
      Object.assign(state,{network:event.target.value,mint,report:null,scanMessage:'',ai:null,aiMessage:'',shareMessage:''});
      updateLabUrl();render();loadNetwork();if(state.wallet)loadWallet();
    });
    root.addEventListener('click',async event=>{
      const picked=event.target.closest('button')?.dataset.pickMint;
      if(picked){root.querySelector('#lab-mint').value=picked;scan(picked);return;}
      const button=event.target.closest('button');
      const action=button?.dataset.labAction;
      if(button?.dataset.retryMetric){retryMetric(button.dataset.retryMetric,button.dataset.retryColumn);return;}
      if(button?.dataset.juryMarket){comparison.marketMint=button.dataset.juryMarket;repaintJuryMarket();return;}
      if(action==='compare-live'){startComparison(true);return;}
      if(button?.dataset.compareRetry){compareToken(button.dataset.compareRetry,comparison.run);return;}
      if(button?.dataset.compareScan||button?.dataset.walletMint){
        root.querySelector('#lab-mint').value=button.dataset.compareScan??button.dataset.walletMint;
        scan(root.querySelector('#lab-mint').value);
        document.querySelector('#lab-scan')?.scrollIntoView({block:'start'});
        return;
      }
      if(action==='compare-share'){
        try{await navigator.clipboard.writeText(comparisonUrl());comparison.message=w('copied');}
        catch{comparison.message=comparisonUrl();}
        const status=root.querySelector('#lab-jury-share-status');
        if(status)status.textContent=comparison.message;
        return;
      }
      if(action==='retry-token'){scan(state.mint);return;}
      if(action==='search-tokens'){searchTokens();return;}
      const example=event.target.closest('button')?.dataset.exampleMint;
      if(example){root.querySelector('#lab-mint').value=example;scan(example);return;}
      if(action==='mode'||action==='wallet-live'){
        clearComparison();++state.reportRun;++state.aiRun;++state.networkRun;
        state.demo=!state.demo;clearWallet();state.report=null;state.ai=null;state.aiMessage='';state.scanMessage='';state.networkStatus=null;
        updateLabUrl();render();loadNetwork();
        if(action==='mode'&&canCompare())startComparison();
        if(action==='wallet-live')document.querySelector('#lab-portfolio')?.scrollIntoView({block:'center'});
        return;
      }
      if(action==='guide'){startGuide('solana-lab');return;}
      if(action==='demo-summary'){
        const r=state.report;
        state.ai=wf('demoSummary',{name:r.market.name,score:r.risk.score,coverage:r.risk.coverage,mint:w(r.chain.mintAuthority===null?'authClosed':'authOpen'),freeze:w(r.chain.freezeAuthority===null?'authClosed':'authOpen'),share:r.concentration,liquidity:usd(r.pool.liquidity)});
        repaintReport();return;
      }
      if(action==='market'){navigate('home');if(!demoSession)enterDemo();}
      if(action==='network')loadNetwork();
      if(action==='ai')runAi();
      if(action==='connect')connectWallet();
      if(action==='disconnect')disconnectWallet();
      if(action==='wallet')loadWallet({keep:true});
      if(action==='wallet-retry')loadWallet({selective:true});
      if(action==='wallet-ai')explainWallet();
      if(action==='connect-phantom')connectWallet(true);
      if(action==='copy-wallet-link'){
        const field=root.querySelector('#lab-phantom-url');
        const status=root.querySelector('#lab-phantom-copy-status');
        try{
          await navigator.clipboard.writeText(field.value);
          status.textContent=w('copied');
        }catch{
          field.focus();
          field.select();
          status.textContent=w('linkSelected');
        }
      }
      if(action==='wallet-address'){const full=root.querySelector('#lab-full-address');full.hidden=!full.hidden;}
      if(action==='print')window.print();
      if(action==='share'){
        try{await navigator.clipboard.writeText(location.href);state.shareMessage=w('copied');}
        catch{state.shareMessage=location.href;}
        repaintReport();
      }
    });
  }
  const guideSteps=[
    ['home','#desktopnav [onclick="navigate(\'home\')"], #bottomnav [onclick="navigate(\'home\')"]','Keşfet ile başla','Keşfet, kripto varlıkları bulduğun başlangıç ekranıdır. Buradan coin seçebilir, fiyatlarını inceleyebilir ve karnelerine ulaşabilirsin.'],
    ['home','.intro','Bu ekranda ne görüyorsun?','Piyasa listesi varlıkları ve mevcut fiyat verilerini gösterir. Kaynağın güncel, önbellekten veya örnek olup olmadığına ilişkin uyarıları da bu ekranda görürsün.'],
    ['home','#searchinput','Aradığın coini bul','Bu alana coin adı veya sembolü yazınca liste süzülür. Aramayı temizlediğinde tüm sonuçlar geri gelir.'],
    ['home','.searchrow>.btn','Verileri yenile','Yenile, piyasa kaynağından güncel veri ister. Kaynağın istek limiti varsa ekranda bekleme veya hata bilgisi görünür.'],
    ['home','.filters','Listeyi daralt','Tümü filtreyi temizler. Coin Ekosistemleri ağ seçimini açar. Takip ettiklerim, yıldızla kaydettiğin varlıkları gösterir.'],
    ['home','#rows','Coin karnesini aç','Bir coin satırına dokunarak ayrıntılarını açarsın. Yıldız düğmesi coini takip listene ekler veya oradan çıkarır.'],
    ['home','.home-catalog-more .btn','Daha fazla varlığı gör','Ana sayfada ilk on varlık görünür. Daha fazla göster, arama yapabileceğin tüm coinler sayfasını açar.'],
    ['detail','.detailtitle','Seçtiğin coinin karnesi','Bu ekran seçilen varlığın fiyatını ve piyasa bilgilerini gösterir. Piyasa değeri ve hacim, fiyatı birlikte yorumlamana yardımcı olur.'],
    ['detail','.tabs','Coin içindeki bölümler','Sekmeler coin bilgileri, eğitim notları ve veri kaynakları arasında geçiş yapar. Borsalar, varlığın işlem gördüğü kaynak piyasaları gösterir. Dönem düğmeleri grafiğin zaman aralığını değiştirir.'],
    ['watch','[onclick="navigate(\'watch\')"]','Takip listem','Yıldızladığın coinleri topluca burada bulursun. Yıldızı kaldırdığında coin bu listeden çıkar. Henüz varlık eklemediysen liste boş görünür.'],
    ['compare','[onclick="navigate(\'compare\')"]','Karşılaştır','İki varlığın fiyat, piyasa değeri ve hacmini aynı ekranda incelemek için bu sekmeyi açarsın.'],
    ['compare','.compare-catalog-pickers','İki varlığı seç','Her seçim kutusunda isim veya sembolle arama yap. Listeden bir varlık seçtiğinde alttaki karşılaştırma tablosu güncellenir. Eksik değerler ayrıca belirtilir.'],
    ['learn','[onclick="navigate(\'learn\')"]','Öğrenme Merkezi','Kripto kavramlarını ve temel güvenlik notlarını bu sekmede öğrenirsin. Buradaki içerikler yeni başlayanlar için kısa açıklamalar sunar.'],
    ['learn','.hub-actions','Nereden başlayacağını seç','Öğrenmeye başla, ilk öğrenme konusunu açar. Kavram ara, eğitim içerikleri içinde arama yapacağın alana götürür.'],
    ['learn','#edu-query','Kavram ve konu ara','Piyasa değeri, hacim veya likidite gibi bir kavram yaz. Konu düğmeleriyle içerikleri süzebilir, Tümü ile filtreyi kaldırabilirsin.'],
    ['learn','.edu-route','Konuları sırayla öğren','Önce Şunu Oku kartlarından birine basınca o konunun açıklaması aynı bölümde açılır. Ardından sıradaki karta geçebilirsin.'],
    ['learn','.edu-myth-grid','Yanılgıları fark et','Bu kartlar yaygın yanlış düşünceleri ve açıklamalarını yan yana verir. Örneğin düşük birim fiyat tek başına ucuzluk anlamına gelmez.'],
    ['learn','[data-edu-disclosure="quiz-0"]','Kendini kontrol et','Kontrol sorusuna dokunduğunda kısa açıklama açılır. Cevabı okuyarak öğrendiğin kavramı pekiştirebilirsin.'],
    ['solana-lab','#desktopnav button:last-child, #bottomnav button:last-child','Solana Lab','Bu sekmede Solana tokenlarını tarayabilir, yetkilerini karşılaştırabilir ve cüzdan karnesini inceleyebilirsin. Hackathon önizlemesi bu akışları örnek verilerle gösterir.'],
    ['solana-lab','.lab-demo-banner','Örnek veri mi, canlı veri mi?','Demo modunda etiketli örnek senaryoları görürsün. Mainnet seçiliyken Canlı veriye geç düğmesi USDC ve BONK karşılaştırmasını gerçek kaynaklardan açar. Devnet, Solana’nın test ağıdır.'],
    ['solana-lab','.lab-picker','Listeden token seç','Ad, sembol veya mint adresiyle arama yap. Seç ve analiz et düğmesi karneyi açar. Diğer tokenları ara, Jupiter kaynağında arama yapar.'],
    ['solana-lab','#lab-form','Kendi mint adresini incele','Mint adresini bu alana yapıştır ve Analiz et düğmesine bas. Geçersiz adres girersen bir açıklama gösterilir. USDC ve BONK düğmeleri hazır örnekleri açar.'],
    ['solana-lab','#lab-chain','Token yetkilerini oku','Üretme yetkisi yeni token basmaya, dondurma yetkisi belirli hesapların transferlerini durdurmaya izin verir. Canlı USDC–BONK tablosunda bu yetkileri, metadata durumunu ve sorgu zamanını yan yana oku. Explorer bağlantısı ilgili mint kaydını açar.'],
    ['solana-lab','#lab-jury-market, #lab-pool','Piyasa hareketini anlamlandır','Piyasa ve token hesapları kartında USDC veya BONK’u seçerek havuz likiditesini, büyük token hesaplarının arz payını ve veri kapsamını incele. Tekli raporda hacim ve işlem sayıları da bulunur. Bir ölçüm alınamadığında Eksik veriyi yeniden sorgula seçeneğini kullanabilirsin.'],
    ['solana-lab','#lab-risk','Risk karnesini yorumla','Yüksek puan daha fazla risk göstergesi demektir. Her kutuda ölçümün puana katkısı yazılıdır. Veri kapsamı eksikse kesin puan yerine olası aralık gösterilebilir.'],
    ['solana-lab','#lab-analyst','Bulguları sade bir dille oku','Kural tabanlı açıklama düğmesi demo karnesindeki bulguları özetler. Canlı model yapılandırılmışsa AI açıklaması istenebilir. Bu açıklamalar yatırım tavsiyesi vermez.'],
    ['solana-lab','#lab-portfolio','Portföy alanını kullan','Demo cüzdanı örnek portföyü gösterir. Canlı modda herkese açık bir Solana adresini girerek veya uyumlu bir cüzdan bağlayarak SOL ve token bakiyelerini inceleyebilirsin. Açık adresle sorgulama salt okunurdur.'],
    ['solana-lab','.lab-report-actions','Raporu paylaş veya kaydet','Rapor bağlantısını kopyala, bu tokenın analiz bağlantısını alır. Yazdır / PDF olarak kaydet, tarayıcının yazdırma ekranını açar.'],
    ['home','#home-guide-start','Hazırsın','Tur tamamlandı. Keşfet ekranındaki Nasıl kullanılır? düğmesiyle istediğin zaman yeniden başlayabilirsin. Şimdi coinleri incelemeye başlayabilirsin.']
  ];
  let guideRun=0;
  // The legacy seen marker also included dismissals, so it cannot establish completion.
  const guideCompletedKey='mercek-coach-completed-v1';
  const guideDismissedKey='mercek-coach-dismissed';
  let guideCompleted=safeGet(guideCompletedKey)==='1';
  let guideDismissed=false;
  try {guideDismissed=sessionStorage.getItem(guideDismissedKey)==='1';}catch{}
  let guideCoversIntro=false;
  const reportGuideTargets=new Set(['#lab-chain','#lab-jury-market, #lab-pool','#lab-risk','#lab-analyst','.lab-report-actions']);
  let coachTarget=null;
  let guideFrame=0;
  function visibleTarget(selector){
    return [...document.querySelectorAll(selector)].find(el=>el.getBoundingClientRect().width>0&&el.getBoundingClientRect().height>0)||(view==='solana-lab'&&document.querySelector('#lab-scan'))||document.querySelector('#app');
  }
  function positionCoach(){
    const bubble=document.querySelector('#mercek-coach');const spot=document.querySelector('#mercek-coach-spot');
    if(!bubble||!spot||state.tour<0)return;
    coachTarget=visibleTarget(guideSteps[state.tour][1]);
    const rect=coachTarget.getBoundingClientRect();
    const viewport=window.visualViewport;const width=viewport?.width||innerWidth;const height=viewport?.height||innerHeight;
    const top=Math.max(8,rect.top-6),bottom=Math.min(height-8,rect.bottom+6);
    Object.assign(spot.style,{top:top+'px',left:Math.max(8,rect.left-6)+'px',width:Math.min(width-16,rect.width+12)+'px',height:Math.max(20,bottom-top)+'px'});
    bubble.style.width=Math.min(420,width-24)+'px';
    const box=bubble.getBoundingClientRect();
    const below=rect.bottom+16,above=rect.top-box.height-16;
    let y=below+box.height<height-12?below:above>=12?above:height-box.height-12;
    y=Math.max(12,y);
    const x=Math.max(12,Math.min(rect.left,width-box.width-12));
    Object.assign(bubble.style,{left:x+'px',top:y+'px',visibility:'visible'});
  }
  function queueCoachPosition(){cancelAnimationFrame(guideFrame);guideFrame=requestAnimationFrame(positionCoach);}
  window.addEventListener('resize',queueCoachPosition);
  window.addEventListener('scroll',queueCoachPosition,{passive:true});
  window.visualViewport?.addEventListener('resize',queueCoachPosition);
  function closeGuide(completed=false){
    ++guideRun;state.tour=-1;
    if(guideCoversIntro){
      guideDismissed=true;
      try {sessionStorage.setItem(guideDismissedKey,'1');}catch{}
      if(completed&&!guideCompleted){
        guideCompleted=true;
        safeSet(guideCompletedKey,'1');
      }
    }
    document.querySelector('#mercek-coach-layer')?.remove();
    document.body.classList.remove('coach-running');
    document.querySelector('#home-guide-start, [data-lab-action="guide"]')?.focus({preventScroll:true});
  }
  async function showGuide(){
    const run=++guideRun;
    document.querySelector('#mercek-coach-layer')?.remove();
    if(state.tour<0){closeGuide();return;}
    const [route,selector,title,body]=guideSteps[state.tour];
    if(view!==route){
      if(route==='detail'){const coin=coins.find(item=>item.id===selected)||coins[0];if(coin)openCoin(coin.id);}
      else {
        if(route==='home'&&!demoSession)enterDemo(false);
        else navigate(route);
        if(route==='solana-lab')updateLabUrl();
      }
    }
    if(reportGuideTargets.has(selector)&&state.demo&&!state.report){
      await scan(examples[state.network][0].mint);
      if(run!==guideRun)return;
    }
    if(run!==guideRun)return;
    coachTarget=visibleTarget(selector);
    coachTarget?.scrollIntoView({behavior:'instant',block:'center'});
    const layer=document.createElement('div');layer.id='mercek-coach-layer';
    const last=state.tour===guideSteps.length-1;
    layer.innerHTML=`<div class="coach-shield"></div><div id="mercek-coach-spot" aria-hidden="true"></div><section id="mercek-coach" role="dialog" aria-modal="true" aria-labelledby="coach-title" tabindex="-1"><p class="coach-progress">Birlikte keşfedelim · ${state.tour+1}/${guideSteps.length}</p><h2 id="coach-title">${title}</h2><p>${body}</p><div class="coach-controls"><button class="btn" data-guide="close">Şimdilik kapat</button><button class="btn" data-guide="back" ${state.tour===0?'disabled':''}>Geri</button><button class="btn primary" data-guide="next">${last?'Tamam':'Devam et'}</button></div></section>`;
    layer.addEventListener('click',event=>{
      const action=event.target.closest('button')?.dataset.guide;
      if(!action)return;
      if(action==='close'){closeGuide();return;}
      if(action==='next'&&last){
        closeGuide(true);
        return;
      }
      state.tour+=action==='back'?-1:1;
      showGuide();
    });
    layer.addEventListener('keydown',event=>{
      if(event.key==='Escape'){event.preventDefault();closeGuide();return;}
      if(event.key==='Tab'){
        const buttons=[...layer.querySelectorAll('button:not(:disabled)')];const first=buttons[0],last=buttons.at(-1);
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
        else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
      }
    });
    document.body.append(layer);document.body.classList.add('coach-running');
    positionCoach();layer.querySelector('[data-guide="next"]').focus({preventScroll:true});
  }
  function startGuide(route='home'){
    if(!demoSession&&route==='home')enterDemo(false);
    guideCoversIntro=route==='home';
    state.tour=guideSteps.findIndex(step=>step[0]===route);
    showGuide();
  }
  function maybeStartGuide({newSession=false}={}){
    if(newSession){
      guideDismissed=false;
      try {sessionStorage.removeItem(guideDismissedKey);}catch{}
    }
    if(demoSession&&view==='home'&&!juryLanding&&!previewLanding&&!guideCompleted&&!guideDismissed&&state.tour<0)startGuide();
  }

  const openDemoSession=enterDemo;
  enterDemo=function(autoGuide=true){
    if(demoSession)return;
    view='home';
    query='';
    filter='all';
    history.replaceState(null,'',location.pathname+'#home');
    openDemoSession();
    if(autoGuide)maybeStartGuide({newSession:true});
  };

  const walletQuery=new URLSearchParams(location.search);
  const directWallet=walletQuery.get('wallet')==='live'&&!location.hash;
  let walletDiscoveryTimers=[];
  function watchWalletDiscovery() {
    walletDiscoveryTimers.forEach(clearTimeout);
    walletDiscoveryTimers=[];
    if(!document.querySelector('#lab-phantom-controls'))return;
    refreshWalletControls();
    walletDiscoveryTimers=[300,900,2000].map(ms=>setTimeout(refreshWalletControls,ms));
  }
  window.addEventListener('pageshow',watchWalletDiscovery);
  window.addEventListener('focus',watchWalletDiscovery);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')watchWalletDiscovery();});

  const walletLanding=directWallet||location.hash.startsWith('#solana-lab?')&&routes.get('panel')==='wallet';
  const sharedLabReport=location.hash.startsWith('#solana-lab?')&&Boolean(state.mint);
  const beforeNav=nav;
  nav=function(){
    beforeNav();
    for(const menu of document.querySelectorAll('#desktopnav,#bottomnav')){
      const tab=document.createElement('button');
      tab.type='button';tab.textContent='Solana Lab';
      if(view==='solana-lab'){tab.classList.add('active');tab.setAttribute('aria-current','page');}
      tab.addEventListener('click',()=>{navigate('solana-lab');updateLabUrl();if(!state.networkStatus)loadNetwork();});
      menu.append(tab);
    }
  };
  const beforeRender=render;
  render=function(){
    const field=document.querySelector('#lab-mint');
    const active=document.activeElement===field&&field;
    const cursor=active?[field.selectionStart,field.selectionEnd]:null;
    beforeRender();
    if(view==='home'&&!document.body.classList.contains('onboarding')){
      const welcome=document.createElement('div');welcome.className='home-guide-entry';
      welcome.innerHTML='<span>Mercek’i adım adım tanı.</span><button id="home-guide-start" type="button" class="btn">Nasıl kullanılır?</button>';
      welcome.querySelector('button').addEventListener('click',()=>startGuide());
      const preview=document.createElement('a');
      preview.className='btn';preview.href=previewLink;preview.textContent='Hackathon önizlemesini aç';
      preview.addEventListener('click',event=>{event.preventDefault();location.hash=previewLink.split('#')[1];location.reload();});
      welcome.append(preview);
      const intro=document.querySelector('#app .intro');if(intro)intro.after(welcome);else document.querySelector('#app').prepend(welcome);
    }
    if(document.body.classList.contains('onboarding')&&!juryLanding){
      const guest=document.querySelector('#app button[data-demo="guest"]')
        ?? [...document.querySelectorAll('#app button')].find(button=>button.textContent.trim()==='Hesap olmadan keşfet'||button.textContent.trim()==='Explore without an account');
      if(guest){
        const link=document.createElement('a');
        link.className='lab-jury-entry';
        link.href=juryLink;
        link.textContent=w('jury');
        link.addEventListener('click',event=>{event.preventDefault();location.hash=juryLink.split('#')[1];location.reload();});
        const preview=document.createElement('a');
        preview.className='lab-jury-entry';preview.href=previewLink;preview.textContent='Hackathon önizlemesini aç';
        preview.addEventListener('click',event=>{event.preventDefault();location.hash=previewLink.split('#')[1];location.reload();});
        guest.after(preview,link);
      }
    }
    if(state.tour>=0)queueCoachPosition();
    if(view!=='solana-lab'||(!demoSession&&!sharedLabReport&&!walletLanding&&!juryLanding&&!previewLanding))return;
    document.body.classList.remove('onboarding');
    const app=document.querySelector('#app');
    app.innerHTML=panels();
    bindLab(app.querySelector('.solana-lab'));
    if(cursor){const next=document.querySelector('#lab-mint');next.focus({preventScroll:true});next.setSelectionRange(...cursor);}
    repaintNetwork();repaintComparison();repaintReport();repaintWallet();watchWalletDiscovery();repaintTokenPicker();
  };
  // Shared Lab report links remain available without opening a demo session.
  if(directWallet){
    state.demo=false;
    state.network=walletQuery.get('network')==='devnet'?'devnet':'mainnet';
  }
  if(previewLanding)demoSession=true;
  if(!location.hash)view='home';
  if(walletLanding||location.hash.startsWith('#solana-lab')){
    view='solana-lab';
    if(demoSession||sharedLabReport||walletLanding||juryLanding||previewLanding){
      loadNetwork();
      if(state.mint)scan(state.mint);
    }
  }
  render();
  if(!location.hash||location.hash==='#home')maybeStartGuide();
  if(sharedComparison)startComparison();
  if(walletLanding)document.querySelector('#lab-portfolio')?.scrollIntoView({block:'start'});
})();
