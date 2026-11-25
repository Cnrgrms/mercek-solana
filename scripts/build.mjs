import {readFileSync,readdirSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
const types={html:'text/html; charset=utf-8',js:'text/javascript; charset=utf-8',css:'text/css; charset=utf-8',svg:'image/svg+xml',png:'image/png',json:'application/json; charset=utf-8',webmanifest:'application/manifest+json'};
const originalAPI=readFileSync('worker/api.mjs','utf8');
const math=originalAPI.slice(originalAPI.indexOf('export function cleanCandles'),originalAPI.indexOf('const decode')).replace(/export /g,'');
writeFileSync('public/research-math.js',`(function(root){const DAY=86400000;${math};root.MercekResearch={cleanCandles,periodStats,technicalLevels,eventChange};})(globalThis);`);
const solExamples=JSON.stringify(JSON.parse(readFileSync('public/solana-examples.json','utf8')));
writeFileSync('public/solana-examples.js','globalThis.MercekSolanaExamples='+solExamples+';\n'+
  'globalThis.MercekSolanaExplorer=(mint,network)=>"https://explorer.solana.com/address/"+mint+(network==="devnet"?"?cluster=devnet":"");\n');
const labRisk=readFileSync('worker/solana-risk.mjs','utf8').replace(/^export /gm,'');
writeFileSync('public/solana-report-math.js',`(()=>{
${labRisk}
globalThis.MercekSolanaReportMath={solConcentration,solReportRisk,solReportId};
})();
`);
const assets={};for(const name of readdirSync('public')){assets['/'+name]={type:types[name.split('.').at(-1)]||'application/octet-stream',data:readFileSync('public/'+name).toString('base64')};}
const api=readFileSync('worker/api.mjs','utf8').replace(/export /g,'');

const labMetadata=readFileSync('worker/solana-metadata.mjs','utf8').replace(/^import .*\n/gm,'').replace(/^export /gm,'');
const labAPI=readFileSync('worker/solana-lab.mjs','utf8').replace(/^import .*\n/gm,'').replace(/^export /gm,'');
const labDemo=readFileSync('worker/solana-demo.mjs','utf8').replace(/^import .*\n/gm,'').replace(/^export /gm,'');
const directory=readFileSync('public/coins.json','utf8');
const code='const coinDirectory='+directory+';\n'+api+'\n'+labRisk+'\nconst solExamples='+solExamples+';\n'+labDemo+'\n'+labMetadata+'\n'+labAPI+'\nconst assets='+JSON.stringify(assets)+';\nexport default {async fetch(request,env,ctx){const u=new URL(request.url);if(u.pathname.startsWith("/api/solana-lab/"))return solanaLabApi(request,env);if(u.pathname.startsWith("/api/"))return api(request,env,ctx);if(!["GET","HEAD"].includes(request.method))return new Response("Method not allowed",{status:405});const asset=assets[u.pathname==="/"?"/index.html":u.pathname];if(!asset)return new Response("Not found",{status:404});const bytes=Uint8Array.from(atob(asset.data),c=>c.charCodeAt(0));return new Response(request.method==="HEAD"?null:bytes,{headers:{"Content-Type":asset.type,"Cache-Control":u.pathname.endsWith(".png")?"public, max-age=86400":"no-cache","X-Content-Type-Options":"nosniff","Referrer-Policy":"strict-origin-when-cross-origin","Permissions-Policy":"camera=(), microphone=(), geolocation=()"}});}};';
rmSync('dist',{recursive:true,force:true});mkdirSync('dist/server',{recursive:true});mkdirSync('dist/.openai',{recursive:true});writeFileSync('dist/server/index.js',code);writeFileSync('dist/.openai/hosting.json',readFileSync('.openai/hosting.json'));console.log('Built embedded Worker with '+Object.keys(assets).length+' assets');
