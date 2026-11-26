import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync('public/solana-lab.js','utf8');
const wordsText=source.slice(0,source.indexOf('const examples=globalThis'));
const pairs=new Map();
for(const match of wordsText.matchAll(/(?:^|[\s,{])([A-Za-z_][A-Za-z0-9_]*):\[('(?:[^'\\]|\\.)*')\s*,\s*('(?:[^'\\]|\\.)*')\]/gm)){
  pairs.set(match[1],{tr:vm.runInNewContext(match[2]),en:vm.runInNewContext(match[3])});
}
const sandbox={};
vm.runInNewContext(readFileSync('public/solana-lab-i18n.js','utf8'),sandbox);
const i18n=sandbox.MercekSolanaLabI18n;
const placeholders=text=>[...text.matchAll(/\{(\w+)\}/g)].map(match=>match[1]).sort();
// Product names and technical terms that are legitimately identical in several languages.
const sameAsEnglish=new Set(['kicker','fdv','organic','walletWrapped','unitMin']);

test('the Solana Lab word list is parsed completely',()=>{
  assert.ok(pairs.size>=250,'expected the full Turkish/English word list, got '+pairs.size);
  for(const key of ['lead','walletPriceCoverage','demoSummary','pickerFailed'])assert.ok(pairs.has(key),key);
});

for(const language of ['de','ru','es','it']){
  test(`Solana Lab ${language} translation covers every key with matching placeholders`,()=>{
    const table=i18n[language];
    assert.ok(table,'missing language table');
    assert.deepEqual(Object.keys(table).filter(key=>!pairs.has(key)),[],'keys unknown to solana-lab.js');
    assert.deepEqual([...pairs.keys()].filter(key=>!Object.hasOwn(table,key)),[],'untranslated keys');
    for(const [key,{tr,en}] of pairs){
      const text=table[key];
      assert.equal(typeof text,'string',key);
      assert.ok(text.trim().length>0,key+' is empty');
      assert.deepEqual(placeholders(text),placeholders(en),key+' placeholders');
      assert.deepEqual(placeholders(tr),placeholders(en),key+' Turkish/English placeholders');
      assert.ok(!/[ğĞşŞıİ]/.test(text),key+' contains Turkish-only letters');
      if(!sameAsEnglish.has(key)&&language!=='ru')assert.notEqual(text,tr,key+' copies the Turkish text');
      if(language==='ru'&&!sameAsEnglish.has(key)&&!['walletWrapped'].includes(key))assert.match(text,/[А-Яа-я]/,key+' has no Cyrillic text');
    }
  });
}

test('the client chooses the language table by app language and falls back to English, never Turkish',()=>{
  assert.match(source,/const labLangs=\['tr','en','de','ru','es','it'\]/);
  assert.match(source,/labI18n\[code\]\?\.\[known\]\?\?words\[known\]\[1\]/);
  assert.equal(source.includes('langIndex'),false);
});

const address='11111111111111111111111111111111';
const mint='EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
let client=0;
// The Worker rate-limits AI requests per client address, so every request below comes from its own address.
const post=(task,body)=>new Request('https://mer.test/api/solana-lab/'+task,{method:'POST',headers:{'CF-Connecting-IP':'203.0.113.'+(++client)},body:JSON.stringify(body)});
const get=(task,query)=>new Request('https://mer.test/api/solana-lab/'+task+'?'+new URLSearchParams(query),{headers:{'CF-Connecting-IP':'203.0.113.'+(++client)}});

test('the AI report asks for the interface language and unknown languages fall back to Turkish',async()=>{
  const {solanaLabApi:api}=await import('../worker/solana-lab.mjs?i18n-analyst');
  const rpc=(url,options)=>{
    const {method}=JSON.parse(options.body);
    let value={context:{slot:1}};
    if(method==='getAccountInfo')value.value={owner:'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',data:{parsed:{type:'mint',info:{decimals:6,supply:'100',mintAuthority:null,freezeAuthority:null}}}};
    if(method==='getTokenLargestAccounts')value.value=[{address,amount:'10'}];
    return Promise.resolve(Response.json({result:value}));
  };
  const instructions=[];
  const fetcher=async(url,options)=>{
    if(url.startsWith('https://api.openai.com/')){
      instructions.push(JSON.parse(options.body).instructions);
      return Response.json({output:[{content:[{type:'output_text',text:'Fixture only'}]}]});
    }
    if(url.startsWith('https://api.jup.ag/')||url.startsWith('https://api.dexscreener.com/'))return Response.json([]);
    return rpc(url,options);
  };
  const env={MERCEK_AI_API_KEY:'test-only-ai'};
  const report=await (await api(get('token',{mint,network:'devnet'}),env,fetcher)).json();
  const expected={de:'German',ru:'Russian',es:'Spanish',it:'Italian',en:'English',tr:'Turkish',xx:'Turkish'};
  for(const [language,name] of Object.entries(expected)){
    const response=await api(post('analyst',{mint,network:'devnet',language,reportId:report.reportId}),env,fetcher);
    assert.equal((await response.json()).output,'Fixture only',language);
    assert.match(instructions.at(-1),new RegExp('report in '+name+'\\.'),language);
  }
});

test('wallet explanation sentences are offered in the interface language',async()=>{
  const {solanaLabApi:api}=await import('../worker/solana-lab.mjs?i18n-wallet');
  const env={JUPITER_API_KEY:'test-only',MERCEK_WALLET_SNAPSHOT_KEY:'test-only-snapshot',MERCEK_AI_API_KEY:'test-only-model'};
  let schema;
  const fetcher=async(url,options)=>{
    if(url==='https://api.openai.com/v1/responses'){
      schema=JSON.parse(options.body).text.format.schema.properties;
      const selected=Object.fromEntries(Object.entries(schema).map(([field,config])=>[field,config.enum[0]]));
      return Response.json({status:'completed',id:'resp_fixture',model:'test-model',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify(selected)}]}]});
    }
    if(url.includes('jup.ag'))return Response.json([]);
    const {method}=JSON.parse(options.body);
    return Response.json({result:{value:method==='getBalance'?1000000000:[]}});
  };
  const wallet=await (await api(post('wallet',{address}),env,fetcher)).json();
  const expected={
    de:/Assets mit Preis|Preise decken/,ru:/активам с ценой|Цены охватывают/,es:/activos con precio|precios cubren/,
    it:/asset con prezzo|prezzi coprono/,en:/priced assets|Pricing covers/,tr:/fiyatı bulunan|USD kapsamına/,xx:/fiyatı bulunan|USD kapsamına/
  };
  for(const [language,pattern] of Object.entries(expected)){
    const response=await (await api(post('wallet-analyst',{address,proof:wallet.proof,language}),env,fetcher)).json();
    assert.match(response.summary.scope,pattern,language);
    assert.equal(response.summary.concentration.length>0,true,language);
    assert.equal(response.summary.risk.length>0,true,language);
  }
});
