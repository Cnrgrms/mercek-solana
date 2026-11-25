import http from 'node:http';
import {readFileSync} from 'node:fs';
import {Readable} from 'node:stream';

async function currentWorker() {
  return (await import('data:text/javascript;base64,'+readFileSync('dist/server/index.js').toString('base64'))).default;
}

const portIndex=process.argv.indexOf('--port');
const port=Number(portIndex>=0?process.argv[portIndex+1]:process.env.PORT||5173);
http.createServer(async(req,res)=>{
  try {
    const worker=await currentWorker();
    const options={method:req.method,headers:req.headers};
    if(!['GET','HEAD'].includes(req.method)) Object.assign(options,{body:Readable.toWeb(req),duplex:'half'});
    const response=await worker.fetch(new Request('http://'+req.headers.host+req.url,options),process.env,{waitUntil:p=>p.catch(()=>{})});
    res.writeHead(response.status,Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch {
    res.writeHead(500);
    res.end('Request failed');
  }
}).listen(port,'0.0.0.0',()=>console.log('Mercek preview http://0.0.0.0:'+port));
