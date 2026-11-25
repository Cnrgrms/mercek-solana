import {test} from 'node:test';
import assert from 'node:assert/strict';
import {solanaAddress,solRisk} from '../worker/solana-risk.mjs';
import {solanaLabApi} from '../worker/solana-lab.mjs';
import examples from '../public/solana-examples.json' with {type:'json'};

const mint='So11111111111111111111111111111111111111112';
const usd='EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const address='11111111111111111111111111111111';
const program='TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
const post=(task,body)=>new Request('https://mer.test/api/solana-lab/'+task,{method:'POST',body:JSON.stringify(body)});
const get=(task,query)=>new Request('https://mer.test/api/solana-lab/'+task+'?'+new URLSearchParams(query));
const quote={id:usd,name:'Fixture',symbol:'FIX',mcap:1000,usdPrice:1,liquidity:1e6,holderCount:500,
  stats24h:{buyVolume:70000,sellVolume:60000,numBuys:600,numSells:500},isVerified:true,organicScore:100,
  audit:{mintAuthorityDisabled:true,freezeAuthorityDisabled:true,topHoldersPercentage:15}};
function upstream(url,options={}) {
  if(url.startsWith('https://api.jup.ag/')){
    assert.equal(new Headers(options.headers).get('x-api-key'),'test-only');
    return Promise.resolve(Response.json([{...quote,id:'other'},quote]));
  }
  if(url.startsWith('https://api.dexscreener.com/'))return Promise.resolve(Response.json([
    {chainId:'solana',pairAddress:address,baseToken:{address:mint},liquidity:{usd:9e6}},
    {chainId:'solana',pairAddress:address,baseToken:{address:usd},liquidity:{usd:1e6},volume:{h24:100000},txns:{h24:{buys:500,sells:500}}}
  ]));
  const {method,params}=JSON.parse(options.body);
  let value={context:{slot:123}};
  if(method==='getAccountInfo') value.value={owner:program,data:{parsed:{type:'mint',info:{decimals:6,supply:'100',mintAuthority:address,freezeAuthority:null}}}};
  if(method==='getTokenLargestAccounts')value.value=[{address,amount:'10'}];
  if(method==='getSlot') value=123;
  if(method==='getBalance'){assert.equal(params[0],address);value.value=1234567890;}
  if(method==='getTokenAccountsByOwner'){
    assert.equal(params[0],address);
    value.value=params[1].programId===program?[{account:{data:{parsed:{info:{mint:usd,tokenAmount:{amount:'25',decimals:1}}}}}}]:[];
  }
  return Promise.resolve(Response.json({result:value}));
}
test('validates decoded 32-byte addresses',()=>{
  assert.equal(solanaAddress(mint),true);assert.equal(solanaAddress(usd),true);
  assert.equal(solanaAddress('1'.repeat(33)),false);assert.equal(solanaAddress('O'.repeat(32)),false);
});
test('missing criteria produce a range and cannot produce a favorable category',()=>{
  assert.deepEqual(Object.values(solRisk({mintAuthority:null},null)).slice(1),[0,20,80,null,null]);
});
test('risk gives real zero full coverage and prioritizes RPC authority over market audit',()=>{
  const result=solRisk({mintAuthority:address,freezeAuthority:null},{mintDisabled:true,topHolders:0,liquidity:1e6,volume:10e5,buys:500,sells:500,organic:100,verified:true});
  assert.equal(result.coverage,100);assert.equal(result.score,20);assert.equal(result.criteria[0].points,20);assert.equal(result.category,'positive');
});
test('invalid input never calls upstream',async()=>{
  const response=await solanaLabApi(get('token',{mint:'123'}),{},()=>assert.fail());
  assert.equal(response.status,400);assert.equal((await response.json()).error,'invalid_address');
});
test('devnet never combines mainnet prices with a devnet mint',async()=>{
  const result=await solanaLabApi(get('token',{mint,network:'devnet'}),{},(url,options)=>{
    assert.match(url,/devnet/);return upstream(url,options);
  });
  const data=await result.json();
  assert.equal(data.chain.program,'SPL Token');assert.equal(data.market,null);assert.equal(data.risk.coverage,60);
});
test('mainnet matches exact Jupiter mint, combines stats, and respects RPC',async()=>{
  const result=await solanaLabApi(get('token',{mint:usd,network:'mainnet'}),{JUPITER_API_KEY:'test-only'},upstream);
  const data=await result.json();
  assert.equal(data.market.mint,usd);assert.equal(data.market.volume,130000);assert.equal(data.market.verified,true);
  assert.equal(data.risk.score,20);assert.equal(data.risk.criteria[0].points,20);
  assert.equal(data.pool.liquidity,1e6);assert.equal(data.concentration,10);assert.equal(data.evidence.rpc.state,'live');
});
test('reads wallet balances via POST and leaves devnet valuation unavailable',async()=>{
  const response=await solanaLabApi(post('wallet',{network:'devnet',address}),{},upstream);
  assert.equal(response.headers.get('Cache-Control'),'no-store');
  const data=await response.json();
  assert.equal(data.lamports,1234567890);assert.deepEqual(data.tokens.map(x=>[x.mint,x.amount]),[[usd,2.5]]);
  assert.equal(data.accountCoverage,2);assert.equal(data.knownUsd,null);
});
test('AI explicitly reports missing configuration without contacting a provider',async()=>{
  const result=await solanaLabApi(post('analyst',{mint}),{},()=>assert.fail());
  assert.equal(result.status,503);assert.equal((await result.json()).error,'ai_not_configured');
});
test('RPC outage stays explicit and provides zero coverage',async()=>{
  const result=await solanaLabApi(get('token',{mint:address}),{},()=>Promise.resolve(new Response('',{status:429})));
  const data=await result.json();assert.equal(data.issues.rpc,'upstream_rate_limit');assert.equal(data.risk.coverage,0);
});
test('a wallet request rejects cross-origin writes and excessive bodies',async()=>{
  const cross=new Request('https://mer.test/api/solana-lab/wallet',{method:'POST',headers:{Origin:'https://example.test'},body:'{}'});
  assert.equal((await solanaLabApi(cross,{},()=>assert.fail())).status,403);
  const long=post('wallet',{address,address2:'x'.repeat(3000)});
  assert.equal((await solanaLabApi(long,{},()=>assert.fail())).status,400);
});
test('optional AI receives server-computed facts with retention disabled and no wallet address',async()=>{
  const report=await (await solanaLabApi(get('token',{mint,network:'devnet'}),{},upstream)).json();
  assert.equal(report.evidence.rpc.state,'cached');
  const response=await solanaLabApi(post('analyst',{mint,network:'devnet',language:'en',address,reportId:report.reportId}),{MERCEK_AI_API_KEY:'test-only-ai'},async (url,options)=>{
    if(!url.startsWith('https://api.openai.com/'))return upstream(url,options);
    const body=JSON.parse(options.body);
    assert.equal(body.store,false);
    assert.match(body.instructions,/English/);
    assert.equal(JSON.parse(body.input).risk.coverage,60);
    assert.equal(Object.hasOwn(JSON.parse(body.input),'address'),false);
    return Response.json({output:[{content:[{type:'output_text',text:'Fixture only'}]}]});
  });
  assert.equal((await response.json()).output,'Fixture only');
});

test('Explicit demo mode completes token and wallet flows without external requests',async()=>{
  const noNetwork=()=>{throw new Error('Demo must not call a provider');};
  const mint='EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
  const report=await solanaLabApi(new Request('https://test/api/solana-lab/token?mode=demo&mint='+mint),{},noNetwork);
  const data=await report.json();
  assert.equal(data.demo,true);assert.equal(data.risk.coverage,100);assert.equal(data.risk.score,data.risk.criteria.reduce((sum,c)=>sum+c.points,0));
  assert.equal(data.evidence.rpc.state,'exampleData');assert.equal(data.aiAvailable,false);
  const wallet=await solanaLabApi(new Request('https://test/api/solana-lab/wallet',{method:'POST',body:JSON.stringify({mode:'demo',address:'11111111111111111111111111111111'})}),{},noNetwork);
  const holdings=await wallet.json();assert.equal(holdings.demo,true);assert.equal(holdings.knownUsd,645);assert.equal(holdings.tokens.length,2);
});

test('Token picker search returns sanitized Solana mints and rejects short queries',async()=>{
 const fetcher=async()=>new Response(JSON.stringify([{id:usd,name:'USD Coin',symbol:'USDC'},{id:'bad',name:'Invalid'}]));
 const response=await solanaLabApi(new Request('https://test/api/solana-lab/search?query=USDC'),{},fetcher);
 const data=await response.json();assert.equal(data.items.length,1);assert.equal(data.items[0].mint,usd);
 const invalid=await solanaLabApi(new Request('https://test/api/solana-lab/search?query=a'),{},fetcher);assert.equal(invalid.status,400);
});

test('live wallet retries an unavailable configured RPC and keeps genuine zero balances',async()=>{
  const requested=new Set();
  const fetcher=async(url,options)=>{
    const host=new URL(url).hostname;
    if(host==='api.jup.ag')return new Response('[]');
    requested.add(host);
    if(host==='offline.example')return new Response('',{status:503});
    const {method}=JSON.parse(options.body);
    return Response.json({result:{value:method==='getBalance'?0:[]}});
  };
  const response=await solanaLabApi(post('wallet',{network:'mainnet',address}),{SOLANA_MAINNET_RPC_URL:'https://offline.example'},fetcher);
  const report=await response.json();
  assert.equal(response.status,200);
  assert.equal(report.lamports,0);
  assert.equal(report.accountCoverage,2);
  assert.ok(requested.has('offline.example'));
  assert.ok(requested.has('api.mainnet.solana.com'));
});

test('live wallet signals complete RPC outage without returning a zero balance',async()=>{
  const fetcher=async()=>new Response('',{status:403});
  const response=await solanaLabApi(post('wallet',{network:'mainnet',address}),{},fetcher);
  assert.equal(response.status,502);
  assert.deepEqual(await response.json(),{error:'wallet_rpc_unavailable'});
});

test('network status tries another RPC when the configured endpoint rejects requests',async()=>{
  const response=await solanaLabApi(get('status',{network:'mainnet'}),{SOLANA_MAINNET_RPC_URL:'https://invalid-rpc.test'},async(url,options)=>{
    assert.equal(JSON.parse(options.body).method,'getSlot');
    if(url==='https://invalid-rpc.test')return new Response(null,{status:403});
    return Response.json({result:123});
  });
  const data=await response.json();
  assert.equal(data.slot,123);
  assert.equal(data.provider,'Solana RPC');
});

test('zero SOL with unreadable token programs is an incomplete valuation',async()=>{
  const response=await solanaLabApi(post('wallet',{address,network:'mainnet'}),{JUPITER_API_KEY:'test-only'},async(url,options)=>{
    if(url.startsWith('https://api.jup.ag/'))return Response.json([{...quote,id:mint}]);
    const {method}=JSON.parse(options.body);
    return method==='getBalance'?Response.json({result:{value:0}}):new Response(null,{status:429});
  });
  const data=await response.json();
  assert.equal(data.lamports,0);
  assert.equal(data.accountCoverage,0);
  assert.equal(data.valuationComplete,false);
});

test('DEX search fallback selects only a Solana pair matching the requested mint',async()=>{
  const alternate='DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263';
  const response=await solanaLabApi(get('token',{mint:alternate,network:'mainnet'}),{JUPITER_API_KEY:'test-only'},async(url,options)=>{
    if(url.includes('/token-pairs/'))return new Response(null,{status:503});
    if(url.includes('/latest/dex/search')) {
      assert.equal(new URL(url).searchParams.get('q'),alternate);
      return Response.json({pairs:[
        {chainId:'solana',pairAddress:mint,baseToken:{address:usd},liquidity:{usd:900}},
        {chainId:'solana',pairAddress:address,baseToken:{address:alternate},liquidity:{usd:100}}
      ]});
    }
    return upstream(url,options);
  });
  const data=await response.json();
  assert.equal(data.pool.address,address);
  assert.equal(data.pool.source,'search');
});

test('ready mints are valid, unique on each network and identified in demo reports',async()=>{
  for(const [network,tokens] of Object.entries(examples)){
    assert.equal(new Set(tokens.map(token=>token.mint)).size,tokens.length);
    for(const token of tokens){
      assert.ok(solanaAddress(token.mint),token.name);
      const response=await solanaLabApi(get('token',{network,mint:token.mint,mode:'demo'}),{});
      assert.equal(response.status,200);
      const report=await response.json();
      assert.equal(report.demo,true);
      assert.equal(report.network,network);
      assert.equal(report.mint,token.mint);
      assert.equal(report.market.symbol,token.symbol);
      assert.equal(report.market.name,token.name);
    }
  }
  assert.equal(examples.mainnet.find(token=>token.name==='USDC').mint,usd);
  assert.equal(examples.mainnet.find(token=>token.name==='BONK').mint,'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263');
  assert.notEqual(usd,examples.devnet.find(token=>token.name==='USDC').mint);
});

test('largest accounts tries each same-network RPC once and preserves partial reports',async()=>{
  const authority=address;
  const candidates=examples.mainnet.slice(-3).map(token=>token.mint);
  const rpcEnv={
    SOLANA_MAINNET_RPC_URL:'https://primary.example',
    SOLANA_MAINNET_LARGEST_BACKUP_RPC_URL:'https://backup.example',
    SOLANA_DEVNET_LARGEST_BACKUP_RPC_URL:'https://wrong-network.example',
    JUPITER_API_KEY:'test-only'
  };
  for(const [index,target] of candidates.entries()){
    const requested=[];
    const response=await solanaLabApi(get('token',{network:'mainnet',mint:target}),rpcEnv,async(url,options)=>{
      if(url.startsWith('https://api.jup.ag/'))return Response.json([{...quote,id:target}]);
      if(url.includes('dexscreener'))return Response.json([{chainId:'solana',pairAddress:address,baseToken:{address:target},
        liquidity:{usd:1000000},volume:{h24:100000},txns:{h24:{buys:500,sells:500}}}]);
      const {method,params}=JSON.parse(options.body);
      if(method==='getTokenLargestAccounts'){
        assert.equal(params[0],target);
        assert.ok(options.signal instanceof AbortSignal);
        const host=new URL(url).hostname;
        requested.push(host);
        if(index===2||index===1&&host==='primary.example')return Response.json({error:{code:-32602,message:'blocked'}});
        return Response.json({result:{value:[{address,amount:'40'}]}});
      }
      return Response.json({result:{value:params[1].encoding==='base64'?null:{owner:program,data:{parsed:{type:'mint',
        info:{decimals:6,supply:'100',mintAuthority:authority,freezeAuthority:null}}}}}});
    });
    const report=await response.json();
    assert.deepEqual(requested,index===0?['primary.example']:['primary.example','backup.example']);
    assert.equal(report.chain.mintAuthority,authority);
    assert.equal(report.pool.liquidity,1000000);
    assert.ok(Date.parse(report.evidence.accounts.queriedAt));
    if(index<2){
      assert.equal(report.evidence.accounts.provider,index===0?'Birincil RPC':'Yedek RPC');
      assert.equal(report.concentration,40);
      assert.equal(report.risk.coverage,100);
    }else{
      assert.equal(report.evidence.accounts.state,'sourceUnavailable');
      assert.equal(report.concentration,null);
      assert.equal(report.risk.coverage,75);
      assert.equal(report.risk.category,null);
      assert.equal(report.risk.criteria.find(item=>item.id==='holders').points,null);
      assert.equal(report.risk.upper-report.risk.points,25);
    }
  }
});

test('valid null, wrong account type, timeout, RPC rejection and malformed RPC are distinguished',async()=>{
  const fixtures=[
    ['4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU','mint_not_found',()=>Response.json({result:{value:null}})],
    ['CXk2AMBfi3TwaEL2468s6zP8xq9NxTXjp9gjMgzeUynM','not_a_token_mint',()=>Response.json({result:{value:{owner:address}}})],
    ['HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr','upstream_timeout',()=>{throw new DOMException('Signal aborted','TimeoutError');}],
    [program,'rpc_error',()=>Response.json({error:{code:-32000}})],
    ['TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb','unexpected_payload',()=>new Response('not-json')]
  ];
  for(const [target,code,result] of fixtures){
    const response=await solanaLabApi(get('token',{network:'devnet',mint:target}),{},async(_,options)=>{
      return JSON.parse(options.body).method==='getAccountInfo'?result():Response.json({result:{value:[]}});
    });
    const report=await response.json();
    assert.equal(report.issues.rpc,code);
    assert.equal(report.chain?.reason,['mint_not_found','not_a_token_mint'].includes(code)?code:undefined);
  }
});

test('wallet keeps unpriced Token-2022 holdings and shows exactly which program was read',async()=>{
  const token2022='TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb';
  const target=examples.devnet.find(item=>item.symbol==='PYUSD').mint;
  const response=await solanaLabApi(post('wallet',{address,network:'mainnet'}),{JUPITER_API_KEY:'test-only'},async(url,options)=>{
    if(url.includes('jup.ag'))return Response.json([]);
    const {method,params}=JSON.parse(options.body);
    if(method==='getBalance')return Response.json({result:{value:1000000000}});
    if(params[1].programId!==token2022)return new Response(null,{status:503});
    return Response.json({result:{value:[{account:{data:{parsed:{info:{mint:target,tokenAmount:{amount:'1000000',decimals:6}}}}}}]}});
  });
  const report=await response.json();
  assert.equal(report.accountCoverage,1);
  assert.equal(report.reads.spl.state,'sourceUnavailable');
  assert.equal(report.reads.token2022.state,'live');
  assert.equal(report.tokens[0].mint,target);
  assert.equal(report.tokens[0].usd,null);
  assert.equal(report.knownUsd,null);
  assert.equal(report.valuationComplete,false);
});

test('largest account fallback rejects a duplicate list and keeps only the ordered top 20',async()=>{
  const rows=Array.from({length:100},(_,i)=>({
    address:solTestAddress(i+1),amount:String(100-i)
  }));
  function solTestAddress(value){
    const digits='123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    const encoded=(value>=58?digits[Math.floor(value/58)]:'')+digits[value%58];
    return '1'.repeat(31)+encoded;
  }
  const requested=[];
  const response=await solanaLabApi(get('token',{mint,network:'mainnet'}),{
    SOLANA_MAINNET_RPC_URL:'https://primary.example',
    SOLANA_MAINNET_LARGEST_BACKUP_RPC_URL:'https://api.uniblock.dev/uni/v1/json-rpc?chainId=solana'
  },async(url,options)=>{
    if(url.includes('jup.ag')||url.includes('dexscreener.com'))return new Response(null,{status:503});
    const {method,params}=JSON.parse(options.body);
    if(method==='getTokenLargestAccounts'){
      assert.equal(params[1].commitment,'finalized');
      const host=new URL(url).hostname;
      requested.push(host);
      return Response.json({result:{value:host==='primary.example'?[rows[0],rows[0]]:rows}});
    }
    if(params[1].encoding==='base64')return Response.json({result:{value:null}});
    const data={parsed:{type:'mint',info:{decimals:9,supply:'2000',mintAuthority:null,freezeAuthority:null}}};
    return Response.json({result:{value:{owner:program,data}}});
  });
  const report=await response.json();
  assert.deepEqual(requested,['primary.example','api.uniblock.dev']);
  assert.deepEqual(report.biggest.accounts,rows.slice(0,20));
  assert.equal(report.biggest.provider,'Uniblock');
  assert.deepEqual(report.evidence.accounts.attempts.map(({provider,issue})=>({provider,issue})),[{provider:'Birincil RPC',issue:'unexpected_payload'}]);
  assert.equal(report.concentration,90.5);
});

test('GeckoTerminal recovers from DEX Screener 429 with a pool for the exact Solana mint',async()=>{
  const {solanaLabApi:api}=await import('../worker/solana-lab.mjs?gecko-fixture');
  const geckoPool=(id,base,quote,liquidity)=>({
    id:'solana_'+id,
    attributes:{address:id,reserve_in_usd:liquidity,volume_usd:{h24:'10.50'},transactions:{h24:{buys:20,sells:2}}},
    relationships:{base_token:{data:{id:'solana_'+base}},quote_token:{data:{id:'solana_'+quote}}}
  });
  const reply=await api(get('token',{mint:usd}),{JUPITER_API_KEY:'test-only'},async(url,options)=>{
    if(url.includes('dexscreener.com')){
      assert.match(url,/token-pairs/);
      return new Response(null,{status:429});
    }
    if(url.includes('geckoterminal.com'))return Response.json({data:[
      geckoPool(address,mint,program,'99999'),
      geckoPool(program,mint,usd,'100.01')
    ]});
    return upstream(url,options);
  });
  const report=await reply.json();
  assert.equal(report.evidence.pool.provider,'GeckoTerminal');
  assert.equal(report.pool.address,program);
  assert.equal(report.pool.liquidity,100.01);
  assert.equal(report.pool.buys,2);
  assert.equal(report.issues.pool,null);
});

test('native wrapped SOL with zero mint supply skips an inapplicable concentration request',async()=>{
  const {solanaLabApi:api}=await import('../worker/solana-lab.mjs?native-fixture');
  const response=await api(get('token',{mint,network:'devnet'}),{},async(url,options)=>{
    const {method,params}=JSON.parse(options.body);
    assert.equal(method,'getAccountInfo');
    return Response.json({result:{value:params[1].encoding==='base64'?null:{owner:program,data:{parsed:{type:'mint',
      info:{decimals:9,supply:'0',mintAuthority:null,freezeAuthority:null}}}}}});
  });
  const report=await response.json();
  assert.equal(report.accountScope,'native_supply');
  assert.equal(report.issues.accounts,null);
  assert.equal(report.concentration,null);
  assert.equal(report.risk.criteria.find(item=>item.id==='holders').points,null);
});

test('unkeyed Jupiter lookups for concurrent ready mints use one exact-mint batch',async()=>{
  const {solanaLabApi:api}=await import('../worker/solana-lab.mjs?batch-fixture');
  let calls=0;
  const targets=examples.mainnet.slice(0,2);
  const reports=await Promise.all(targets.map(async token=>{
    const response=await api(get('token',{mint:token.mint}),{},async(url,options)=>{
      if(url.includes('jup.ag')){
        calls++;
        const query=new URL(url).searchParams.get('query').split(',');
        assert.deepEqual(query,[...examples.mainnet.map(item=>item.mint)].sort());
        return Response.json(targets.map(row=>({...quote,id:row.mint,name:row.name})));
      }
      return upstream(url,options);
    });
    return response.json();
  }));
  assert.equal(calls,1);
  assert.deepEqual(reports.map(report=>report.market.mint),targets.map(token=>token.mint));
});

test('standard Helius configuration uses the separate authenticated Devnet host',async()=>{
  const {solanaLabApi:api}=await import('../worker/solana-lab.mjs?helius-fixture');
  const env={SOLANA_MAINNET_RPC_URL:'https://mainnet.helius-rpc.com/?api-key=test-only'};
  const response=await api(get('status',{network:'devnet'}),env,async endpoint=>{
    const url=new URL(endpoint);
    assert.equal(url.hostname,'devnet.helius-rpc.com');
    assert.equal(url.searchParams.get('api-key'),'test-only');
    return Response.json({result:12345});
  });
  const data=await response.json();
  assert.equal(data.network,'devnet');
  assert.equal(data.provider,'Helius');
  assert.equal(data.slot,12345);
  assert.equal(JSON.stringify(data).includes('test-only'),false);
});

test('a metric refresh queries only largest accounts and restores the original risk rules',async()=>{
  const {solanaLabApi:api}=await import('../worker/solana-lab.mjs?metric-fixture');
  const {solConcentration,solReportRisk}=await import('../worker/solana-risk.mjs');
  const calls=[];
  const upstream=async(url,options)=>{
    if(url.includes('jup.ag')){
      calls.push('jupiter');
      return Response.json([{...quote,id:usd}]);
    }
    if(url.includes('dexscreener.com')){
      calls.push('pool');
      return Response.json([{chainId:'solana',pairAddress:address,baseToken:{address:usd},liquidity:{usd:1000000},
        volume:{h24:100000},txns:{h24:{buys:500,sells:500}}}]);
    }
    const {method,params}=JSON.parse(options.body);
    calls.push(method);
    if(method==='getTokenLargestAccounts')return calls.filter(call=>call===method).length<=2
      ? new Response(null,{status:429}) : Response.json({result:{context:{slot:123},value:[{address,amount:'35'}]}});
    return Response.json({result:{value:params[1].encoding==='base64'?null:{owner:program,data:{parsed:{type:'mint',
      info:{decimals:6,supply:'100',mintAuthority:address,freezeAuthority:address}}}}}});
  };
  const env={JUPITER_API_KEY:'test-only'};
  const report=await (await api(get('token',{mint:usd}),env,upstream)).json();
  assert.equal(report.risk.coverage,75);
  calls.length=0;
  const failed=await (await api(get('metric',{mint:usd,metric:'accounts'}),env,upstream)).json();
  assert.equal(failed.issue,'upstream_rate_limit');
  assert.deepEqual(calls,['getTokenLargestAccounts','getTokenLargestAccounts']);
  const updated=await (await api(get('metric',{mint:usd,metric:'accounts'}),env,upstream)).json();
  assert.equal(updated.issue,null);
  assert.equal(updated.mint,usd);
  assert.equal(updated.network,'mainnet');
  assert.equal(updated.evidence.state,'live');
  assert.deepEqual(calls,['getTokenLargestAccounts','getTokenLargestAccounts','getTokenLargestAccounts']);
  assert.equal(solReportRisk({...report,concentration:solConcentration(updated.value,report.chain)}).coverage,100);
  assert.equal((await api(get('metric',{mint:usd,metric:'jupiter',network:'devnet'}),env,upstream)).status,400);
});

test('pool diagnostics separate incomplete metrics, wrong chain and wrong mint before Gecko fallback',async()=>{
  const {solanaLabApi:api}=await import('../worker/solana-lab.mjs?pool-diagnostics');
  const base={chainId:'solana',pairAddress:address,baseToken:{address:usd},liquidity:{usd:19000}};
  const gecko={id:'solana_'+program,attributes:{address:program,reserve_in_usd:'7000',volume_usd:{h24:'2600'},
    transactions:{h24:{buys:35,sells:18}}},relationships:{base_token:{data:{id:'solana_'+usd}}}};
  const calls=[];
  const fetcher=async(url,options)=>{
    if(url.includes('/token-pairs/')){
      calls.push(url);
      return Response.json([base,{...base,chainId:'ethereum'},{...base,baseToken:{address:mint}}]);
    }
    if(url.includes('geckoterminal')){
      calls.push(url);
      assert.ok(options.signal instanceof AbortSignal);
      assert.equal(options.headers.Accept,'application/json;version=20230203');
      return Response.json({data:[gecko]});
    }
    return upstream(url,options);
  };
  const report=await (await api(get('token',{mint:usd}),{JUPITER_API_KEY:'test-only'},fetcher)).json();
  assert.equal(calls.length,2);
  assert.equal(report.pool.provider,'GeckoTerminal');
  assert.equal(report.pool.address,program);
  assert.equal(report.pool.liquidity,7000);
  assert.equal(report.pool.previousAddress,address);
  assert.equal(report.risk.coverage,100);
  const [first,second]=report.evidence.pool.attempts;
  assert.deepEqual([first.httpStatus,first.schema,first.candidates,first.networkMatches,first.mintMatches,first.complete,first.stage],
    [200,'array',3,2,1,0,'metrics']);
  assert.deepEqual([second.httpStatus,second.schema,second.selectedPool,second.network,second.mint],[200,'object.data[]',program,'mainnet',usd]);
});

test('pool retry honors Retry-After across mints and keeps the last successful cache timestamp',async()=>{
  const {solanaLabApi:api}=await import('../worker/solana-lab.mjs?pool-cooldown');
  const env={JUPITER_API_KEY:'test-only'};
  const bonk=examples.mainnet.find(item=>item.symbol==='BONK').mint;
  const calls=[];
  let fail=false;
  const fetcher=async(url,options)=>{
    if(url.includes('dexscreener.com')){
      calls.push('dex');
      if(fail)return new Response('',{status:429,headers:{'Retry-After':'90'}});
    }
    if(url.includes('geckoterminal')){
      calls.push('gecko');
      return new Response('',{status:503});
    }
    return upstream(url,options);
  };
  const first=await (await api(get('token',{mint:usd}),env,fetcher)).json();
  fail=true;
  calls.length=0;
  const stale=await (await api(get('metric',{mint:usd,metric:'pool',pair:address}),env,fetcher)).json();
  assert.equal(stale.value.address,first.pool.address);
  assert.equal(stale.evidence.queriedAt,first.evidence.pool.queriedAt);
  assert.equal(stale.evidence.state,'stale');
  assert.deepEqual(calls,['dex','gecko']);
  const missing=await (await api(get('token',{mint:bonk}),env,fetcher)).json();
  assert.equal(missing.pool,null);
  assert.deepEqual(calls,['dex','gecko','gecko']);
  assert.equal(missing.evidence.pool.attempts[0].stage,'cooldown');
  assert.ok(Date.parse(missing.evidence.pool.attempts[0].retryAt)>Date.now());
  assert.equal(missing.evidence.pool.attempts[1].httpStatus,503);
});

test('wallet selective retry preserves verified reads and prices and fills missing program and quotes',async()=>{
  const {solanaLabApi:api}=await import('../worker/solana-lab.mjs?portfolio-selective');
  const token22='TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb';
  const env={JUPITER_API_KEY:'test-only',MERCEK_WALLET_SNAPSHOT_KEY:'test-only-snapshot'};
  const calls=[];
  let fail=true;
  const row=(mint,amount,decimals=0)=>({account:{data:{parsed:{info:{mint,owner:address,tokenAmount:{amount,decimals}}}}}});
  const fetcher=async(url,options)=>{
    const target=new URL(url);
    if(target.hostname==='api.jup.ag'){
      const ids=target.searchParams.get('query').split(',');
      calls.push(['price',ids]);
      return Response.json(ids.filter(id=>id!==mint||!fail).map(id=>({id,usdPrice:id===usd?2:10})));
    }
    const {method,params}=JSON.parse(options.body);
    calls.push(method==='getBalance'?['balance']:['program',params[1].programId]);
    if(method==='getBalance')
      return new Response('{"result":{"context":{"slot":120},"value":9007199254740993}}');
    if(params[1].programId===token22&&fail)return new Response('',{status:503});
    return Response.json({result:{context:{slot:125},value:params[1].programId===token22?[]:[row(usd,'100',2),row(usd,'200',2)]}});
  };
  const run=proof=>api(post('wallet',{address,network:'mainnet',...(proof?{proof}:{})}),env,fetcher);
  const first=await (await run()).json();
  assert.equal(first.lamportsRaw,'9007199254740993');
  assert.equal(first.lamports,null);
  assert.equal(first.tokens[0].raw,'300');
  assert.deepEqual(first.missingReads,['token2022']);
  assert.equal(first.observedAssets,2);
  assert.equal(first.pricedAssets,1);
  assert.equal(first.knownUsd,6);
  assert.equal(first.native.priceStatus,'not_returned');
  assert.deepEqual(first.priceCoverage,{not_returned:1,failed:0,pending:0});
  assert.equal(first.valuationComplete,false);
  assert.ok(first.proof);
  fail=false;calls.length=0;
  const next=await (await run(first.proof)).json();
  assert.deepEqual(calls,[['program',token22],['price',[mint]]]);
  assert.equal(next.reads.spl.queriedAt,first.reads.spl.queriedAt);
  assert.equal(next.tokens[0].priceAt,first.tokens[0].priceAt);
  assert.equal(next.chainComplete,true);
  assert.equal(next.valuationComplete,true);
  assert.equal(next.pricedAssets,2);
  const altered=await api(post('wallet',{address:usd,proof:first.proof}),env,fetcher);
  assert.equal(altered.status,409);
});

test('wallet analyst accepts only permitted OpenAI output and binds it to a private verified snapshot',async()=>{
  const {solanaLabApi:api}=await import('../worker/solana-lab.mjs?portfolio-model');
  const env={JUPITER_API_KEY:'test-only',MERCEK_WALLET_SNAPSHOT_KEY:'test-only-snapshot',
    MERCEK_AI_API_KEY:'test-only-model',MERCEK_AI_MODEL:'test-configured-model'};
  let reply='valid';
  let modelCalls=0;
  const fetcher=async(url,options)=>{
    if(url!=='https://api.openai.com/v1/responses')return upstream(url,options);
    ++modelCalls;
    assert.equal(options.headers.Authorization,'Bearer test-only-model');
    const body=JSON.parse(options.body);
    assert.equal(body.model,'test-configured-model');
    assert.equal(body.store,false);
    assert.equal(body.text.format.strict,true);
    assert.equal(body.input.includes(address),false);
    const facts=JSON.parse(body.input);
    assert.equal(facts.observedAssets,2);
    assert.equal(facts.pricedAssets,1);
    assert.equal(facts.knownUsd,2.5);
    if(reply==='offline')return new Response(null,{status:503});
    const selected=Object.fromEntries(Object.entries(body.text.format.schema.properties).map(([field,config])=>[field,config.enum[0]]));
    if(reply==='false-number')selected.concentration='5000 USD';
    return Response.json({status:'completed',id:'resp_fixture',model:'test-configured-model',
      output:[{type:'message',content:[{type:'output_text',text:JSON.stringify(selected)}]}]},{headers:{'x-request-id':'req_fixture'}});
  };
  const wallet=await (await api(post('wallet',{address}),env,fetcher)).json();
  const ask=()=>api(post('wallet-analyst',{address,proof:wallet.proof}),env,fetcher);
  const response=await (await ask()).json();
  assert.equal(response.requestId,'req_fixture');
  assert.equal(response.provider,'OpenAI');
  assert.match(response.summary.scope,/fiyatı bulunan/);
  reply='false-number';
  assert.equal((await (await ask()).json()).error,'invalid_ai_response');
  reply='offline';
  assert.equal((await ask()).status,502);
  assert.equal(modelCalls,3);
});

test('wallet pages split large portfolios, retain prices on HTTP 429 and retry only that group',async()=>{
  const {solanaLabApi:api}=await import('../worker/solana-lab.mjs?wallet-batches');
  const digits='123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  const ids=Array.from({length:601},(_,i)=>{
    const n=256+i;
    return '1'.repeat(30)+digits[Math.floor(n/58)]+digits[n%58];
  });
  const accounts=ids.map(mint=>({account:{data:{parsed:{info:{mint,tokenAmount:{amount:'2',decimals:0}}}}}}));
  const calls=[];
  let chainCalls=0;
  const fetcher=async(url,options)=>{
    if(url.includes('jup.ag')){
      const query=new URL(url).searchParams.get('query').split(',');
      calls.push(query);
      assert.ok(query.length<=50);
      if(calls.length===2)return new Response(null,{status:429,headers:{'Retry-After':'1'}});
      return Response.json(query.map(id=>({id,usdPrice:1})));
    }
    chainCalls++;
    const {method,params}=JSON.parse(options.body);
    const value=method==='getBalance'?1000000000:params[1].programId===program?accounts:[];
    return Response.json({result:{value}});
  };
  const env={MERCEK_WALLET_SNAPSHOT_KEY:'test-only',JUPITER_API_KEY:'test-only'};
  const load=async(proof,priceAction)=>await (await api(post('wallet',{address,proof,priceAction}),env,fetcher)).json();
  const initial=await load();
  assert.equal(initial.observedAssets,602);
  assert.equal(initial.pricedAssets,50);
  assert.equal(initial.priceFailed,50);
  assert.equal(initial.pricePending,502);
  assert.deepEqual(initial.priceCoverage,{not_returned:0,failed:50,pending:502});
  assert.ok(initial.proof?.startsWith('2.'));
  const cooled=await load(initial.proof,'retry');
  assert.equal(calls.length,2);
  assert.equal(cooled.knownUsd,initial.knownUsd);
  const now=Date.now;
  let page;
  try{
    Date.now=()=>now()+1500;
    const recovered=await load(cooled.proof,'retry');
    assert.deepEqual(calls[2],calls[1]);
    assert.equal(recovered.pricedAssets,100);
    assert.equal(recovered.priceFailed,0);
    assert.equal(recovered.native.raw,'1000000000');
    page=recovered;
    for(let turn=0;page.pricePending&&turn<8;turn++)page=await load(page.proof,'continue');
  }finally{Date.now=now;}
  assert.equal(page.pricedAssets,602);
  assert.equal(page.knownUsd,1203);
  assert.equal(page.valuationComplete,true);
  assert.deepEqual(page.priceCoverage,{not_returned:0,failed:0,pending:0});
  assert.equal(chainCalls,3);
});

test('largest accounts honors Uniblock retry-after and retains original data timestamp',async()=>{
  const {solanaLabApi:api}=await import('../worker/solana-lab.mjs?largest-provider-backoff');
  const env={SOLANA_MAINNET_RPC_URL:'https://primary.example',SOLANA_MAINNET_LARGEST_BACKUP_RPC_URL:'https://api.uniblock.dev'};
  const hosts=[];
  let limited=false;
  const fetcher=async url=>{
    const host=new URL(url).hostname;
    hosts.push(host);
    if(host==='primary.example')return Response.json({error:{code:-32600}});
    if(limited)return new Response(null,{status:429,headers:{'Retry-After':'15'}});
    return Response.json({result:{value:[{address,amount:'20'}]}});
  };
  const query=mint=>api(get('metric',{network:'mainnet',metric:'accounts',mint}),env,fetcher).then(res=>res.json());
  const first=await query(usd);
  limited=true;
  const stale=await query(usd);
  assert.equal(stale.evidence.state,'stale');
  assert.equal(stale.evidence.queriedAt,first.evidence.queriedAt);
  assert.equal(stale.evidence.attempts[1].httpStatus,429);
  const other=await query(mint);
  assert.equal(other.value,null);
  assert.ok(Date.parse(other.evidence.attempts[1].retryAt)>Date.now());
  assert.deepEqual(hosts,['primary.example','api.uniblock.dev','primary.example','api.uniblock.dev','primary.example']);
});
