import {solRisk} from './solana-risk.mjs';
import solExamples from '../public/solana-examples.json' with {type:'json'};
export const demoMints=Object.fromEntries(solExamples.mainnet.filter(token=>['USDC','BONK'].includes(token.symbol)).map(token=>[token.symbol.toLowerCase(),token.mint]));
// Educational scenarios. These values are synthetic, never a chain snapshot.
export function demoReport(network,mint){
  const fixture=solExamples[network].find(item=>item.mint===mint);
  const usdc=fixture?.symbol==='USDC'||mint===demoMints.usdc;
  const wrapped=fixture?.symbol==='SOL';
  const bonk=mint===demoMints.bonk;
  const market={name:fixture?.name??(usdc?'USDC':bonk?'BONK':'Örnek token / Sample token'),symbol:fixture?.symbol??(usdc?'USDC':bonk?'BONK':'DEMO'),price:fixture?.demoPrice??(usdc?1:0.00002),cap:wrapped?150000000:usdc?5000000000:1700000000,fdv:wrapped?150000000:usdc?5000000000:1800000000,holders:usdc?150000:800000,verified:true,organic:80};
  const chain={provider:'DEMO',program:fixture?.program??'SPL Token',slot:300000000,decimals:fixture?.decimals??(usdc?6:5),supply:wrapped?'1000000000000000':usdc?'5000000000000000':'9000000000000000000',mintAuthority:usdc?mint:null,freezeAuthority:usdc?mint:null};
  const pool={address:mint,dex:'Örnek havuz / Sample pool',liquidity:usdc?2000000:75000,volume:usdc?800000:30000,buys:usdc?800:180,sells:usdc?700:120};
  const concentration=usdc?35:65;
  const risk=solRisk(chain,{...market,...pool,topHolders:concentration});
  const analyzedAt=new Date().toISOString();
  return {demo:true,network,mint,chain,metadata:{status:usdc?'mutable':'immutable',source:'DEMO',queriedAt:analyzedAt,evidenceState:'exampleData'},market,pool,concentration,biggest:{provider:'DEMO',accounts:[{address:mint,amount:String(BigInt(chain.supply)*BigInt(concentration)/100n)}]},risk,evidence:Object.fromEntries(['rpc','accounts','pool','jupiter'].map(key=>[key,{state:'exampleData',queriedAt:analyzedAt}])),issues:{},analyzedAt,reportId:'demo:'+network+':'+mint,aiAvailable:false};
}
export function demoPortfolio(network){
 const tokens=[demoReport(network,demoMints.usdc),demoReport(network,demoMints.bonk)].map((r,i)=>({mint:r.mint,symbol:r.market.symbol,amount:i?1000000:250,usd:i?20:250,risk:{score:r.risk.score,coverage:100}}));
 return {demo:true,network,lamports:2500000000,solUsd:375,knownUsd:645,pricedCount:2,accountCoverage:2,tokens,issues:[]};
}
