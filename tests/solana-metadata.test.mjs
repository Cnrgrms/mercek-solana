import {test} from 'node:test';
import assert from 'node:assert/strict';
import {metadataAddress,metadataFromAccount,metadataFromMint} from '../worker/solana-metadata.mjs';
import {solanaLabApi} from '../worker/solana-lab.mjs';

const mint='11111111111111111111111111111111';
const program='metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s';
const tokenProgram='TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
const usdc='EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

test('derives the canonical Metaplex account for Solana USDC',async()=>{
  assert.equal(await metadataAddress(usdc),'5x38Kp4hvdomTCnCrAny4UtMUt5rQBdB6px2K1Ui45Wq');
});

function metadataAccount(mutable){
  // MetadataV1, zero authority and mint, three empty strings, no creators.
  const bytes=new Uint8Array(82);
  bytes[0]=4;
  bytes[81]=mutable;
  return {owner:program,data:[Buffer.from(bytes).toString('base64'),'base64']};
}

test('Metaplex distinguishes mutable, immutable, absent and wrong-owner accounts',()=>{
  assert.equal(metadataFromAccount(metadataAccount(1),mint,mint).status,'mutable');
  assert.equal(metadataFromAccount(metadataAccount(0),mint,mint).status,'immutable');
  assert.equal(metadataFromAccount(null,mint,mint).status,'missing');
  assert.equal(metadataFromAccount({...metadataAccount(1),owner:mint},mint,mint).status,'unknown');
  assert.equal(metadataFromAccount(metadataAccount(1),usdc,mint).status,'unknown');
});

test('Token-2022 metadata honours update authority and does not guess external state',()=>{
  const detect=(authority,pointer=mint)=>metadataFromMint({extensions:[
    {extension:'metadataPointer',state:{metadataAddress:pointer}},
    {extension:'tokenMetadata',state:{mint,updateAuthority:authority}}
  ]},mint);
  assert.equal(detect(null).status,'immutable');
  assert.equal(detect(usdc).status,'mutable');
  assert.equal(detect(undefined).status,'unknown');
  assert.equal(detect(usdc,usdc).status,'external');
});

test('RPC metadata failure retains the verified token mint and authority result',async()=>{
  const result=await solanaLabApi(new Request('https://mer.test/api/solana-lab/token?network=devnet&mint='+mint),{},async(_url,options)=>{
    const {method,params}=JSON.parse(options.body);
    if(method==='getTokenLargestAccounts')return Response.json({result:{value:[]}});
    if(params[1].encoding==='base64')return new Response(null,{status:429});
    return Response.json({result:{context:{slot:9},value:{owner:tokenProgram,data:{parsed:{type:'mint',info:{supply:'100',decimals:0,mintAuthority:null,freezeAuthority:null}}}}}});
  });
  const report=await result.json();
  assert.equal(report.chain.supply,'100');
  assert.equal(report.chain.freezeAuthority,null);
  assert.equal(report.metadata.status,'unknown');
  assert.equal(report.metadata.issue,'upstream_rate_limit');
  assert.equal(report.metadata.evidenceState,'sourceUnavailable');
  assert.equal(report.metadata.provider,'Solana RPC');
  assert.ok(Date.parse(report.metadata.queriedAt));
});
