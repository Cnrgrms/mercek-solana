export function solNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null;
}

export function solanaAddress(value) {
  if (typeof value !== 'string' || !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value)) return false;
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let integer = 0n;
  for (const char of value) integer = integer * 58n + BigInt(alphabet.indexOf(char));
  const bytes = integer === 0n ? 0 : Math.ceil(integer.toString(16).length / 2);
  return (value.match(/^1*/)[0].length + bytes) === 32;
}

export function solRisk(chain, market) {
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

export function solConcentration(largest,chain) {
  const supply=chain?.supply;
  if(!largest?.accounts.length||!supply||BigInt(supply)===0n)return null;
  const sum=largest.accounts.reduce((total,item)=>total+BigInt(item.amount),0n);
  if(sum>BigInt(supply))return null;
  return Number(sum*1000000n/BigInt(supply))/10000;
}
export async function solReportId({network,mint,chain,concentration,pool,market,risk,issues}) {
  const fields={network,mint,chain:chain&&{...chain,slot:undefined,provider:undefined},concentration,pool:pool&&{...pool,attempts:undefined,previousAddress:undefined},
    market:market&&{verified:market.verified,organic:market.organic},risk,issues};
  const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(fields)));
  return Array.from(new Uint8Array(bytes),byte=>byte.toString(16).padStart(2,'0')).join('');
}
export function solReportRisk({chain,concentration,pool,market}) {
  return solRisk(chain,{topHolders:concentration,liquidity:pool?.liquidity,volume:pool?.volume,
    buys:pool?.buys,sells:pool?.sells,verified:market?.verified,organic:market?.organic});
}
