import {test} from 'node:test';
import assert from 'node:assert/strict';

// Valid 32-byte Solana addresses. Every case uses its own mint because AI answers are cached per report.
const mints=[
  'B5KMCwyAKDmJCLcm7eGsrdT9R3zs1xJdMCiwahVGx46A','DmwiC4pNLLKcn6UuCcVd5LvUF38G43oyrKe53srxpywi',
  'A9GvauUoHdTimFXnEXYhurkVm82MSH9ftgC6eKqzKHKn','4kdVzxNWryEZjPqaFbSKZe94HzuRgQ8Td9aXzdSd55ke',
  '3eYnkZSZh3My5Q3V3GuFQzktg2uwxvT1zefJYJk6vEJy','BVUMrcmJfu5VxSRXL3KuTpWuvPQh1z54RB8idFqtFrBJ',
  'CaCjHfAthuTa8QEZtpTaG2QPi9QGgcsr4EbBNeda1Qpw','E5FQUTVpE6LvguiiCebRYQYTbxFXzZUAa6KBc2Bko1Wa',
  '6L6arXQsZyHaEc84fz9iJb1Lg8AY22aaEyAzjg2P7Myp','GBwN3koLFJiFB1RuvQ67ySYGWAHrzS8pyDWC3C5arfBt',
  '3W3vWN3puYbdZ1zbDuULzapyb9k87SQGT6ddc713W8na',
  '58vqN1Jq9R3tciBKLWyPjVe2HvmcHswvpBSPk8bShr1S',
  'F8ZfHcktuCZCwAS3JSVJTD4K4kys32sbU1KV9ZBsXsxq',
  '3Up8Rezx5mWtMQrQaYfG167792RAtCrHus4fWEwypUoY'
];
const holder='11111111111111111111111111111111';
let used=0,client=0;
const request=(task,body)=>new Request('https://mer.test/api/solana-lab/'+task,{method:'POST',headers:{'CF-Connecting-IP':'198.51.100.'+(++client)},body:JSON.stringify(body)});
const tokenRequest=(query)=>new Request('https://mer.test/api/solana-lab/token?'+new URLSearchParams(query),{headers:{'CF-Connecting-IP':'198.51.100.'+(++client)}});

async function ask(text,{network='devnet',market=null}={}) {
  // The Worker caps AI calls at 12 per minute for the whole instance, so each group of six cases gets its own instance.
  const {solanaLabApi}=await import('../worker/solana-lab.mjs?ai-numbers-'+Math.floor(used/6));
  const mint=mints[used++];
  const env={MERCEK_AI_API_KEY:'test-only-ai',JUPITER_API_KEY:'test-only-jupiter'};
  const answer=typeof text==='function'?text(mint):text;
  const fetcher=async(url,options)=>{
    if(url.startsWith('https://api.openai.com/'))return Response.json({output:[{content:[{type:'output_text',text:answer}]}]});
    if(url.includes('jup.ag'))return Response.json(market?[{id:mint,name:market.name,symbol:market.symbol,usdPrice:1}]:[]);
    if(url.includes('dexscreener')||url.includes('geckoterminal'))return Response.json({pairs:[],data:[]});
    const {method}=JSON.parse(options.body);
    const value={context:{slot:1}};
    if(method==='getAccountInfo')value.value={owner:'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',data:{parsed:{type:'mint',info:{decimals:6,supply:'100',mintAuthority:null,freezeAuthority:null}}}};
    if(method==='getTokenLargestAccounts')value.value=[{address:holder,amount:'10'}];
    return Response.json({result:value});
  };
  const report=await (await solanaLabApi(tokenRequest({mint,network}),env,fetcher)).json();
  const response=await solanaLabApi(request('analyst',{mint,network,language:'en',reportId:report.reportId}),env,fetcher);
  return {...(await response.json()),mint,status:response.status};
}

const accepted=[
  ['a program name that contains digits','Token-2022 mints can carry extensions, so review them separately. Jupiter Tokens V2 supplies verification.'],
  ['an in-order numbered list','1. The authorities are disabled.\n2. Liquidity data is missing.\n3. Check the pool before relying on it.'],
  ['the mint address from the report',mint=>'The mint '+mint+' has no active mint authority.'],
  ['a mint address followed by punctuation',mint=>'Checked ('+mint+').']
];
for(const [name,text] of accepted){
  test('AI report is kept when its only digits are '+name,async()=>{
    const result=await ask(text);
    assert.equal(result.error,undefined,JSON.stringify(result));
    assert.equal(typeof result.output,'string');
  });
}

test('AI report may repeat the token name and symbol that the app supplied',async()=>{
  const result=await ask('Fixture 7 Token (FX7) shows no active authorities.',{network:'mainnet',market:{name:'Fixture 7 Token',symbol:'FX7'}});
  assert.equal(result.error,undefined,JSON.stringify(result));
  assert.match(result.output,/Fixture 7 Token/);
});

const rejected=[
  ['an invented amount','Liquidity is about 1,234 USD.'],
  ['an invented score','The risk score is 72 out of 100.'],
  ['a numbered list that is out of order','1. Authorities are disabled.\n5. Liquidity is high.'],
  ['a digit glued to a program name','Token-20221 mints are fine.'],
  ['an Arabic-Indic digit','Holders hold ٣ of supply.'],
  ['a full-width digit','Holders hold ３ of supply.'],
  ['a digit glued to the mint address',mint=>'Checked '+mint+'5 today.']
];
for(const [name,text] of rejected){
  test('AI report is rejected for '+name,async()=>{
    const result=await ask(text);
    assert.equal(result.error,'ai_unverified_numbers',JSON.stringify(result));
    assert.equal(result.output,undefined);
  });
}

test('AI report is rejected when a supplied name is followed by an invented number',async()=>{
  const result=await ask('Fixture 7 Token (FX7) has 42 holders.',{network:'mainnet',market:{name:'Fixture 7 Token',symbol:'FX7'}});
  assert.equal(result.error,'ai_unverified_numbers',JSON.stringify(result));
});
