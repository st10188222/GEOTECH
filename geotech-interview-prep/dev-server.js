// Tiny local-only server: serves an explicit public-file list and the same Vercel handler.
import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import handler from './api/gemini.js';
const root=path.dirname(fileURLToPath(import.meta.url));
http.createServer(async(req,res)=>{
 res.status=code=>{res.statusCode=code;return res;};res.json=value=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(value));};
 const url=new URL(req.url,'http://localhost');
 if(url.pathname==='/api/gemini'){let size=0,chunks=[];for await(const chunk of req){size+=chunk.length;if(size>16000){res.status(413).json({error:'This answer is too large.'});return;}chunks.push(chunk);}req.body=Buffer.concat(chunks).toString();await handler(req,res);return;}
 const requested=url.pathname==='/'?'index.html':url.pathname.slice(1);
 if(!/^(index\.html|(?:css|js|data)\/[a-zA-Z0-9-]+\.(?:css|js))$/.test(requested)){res.statusCode=404;res.end('Not found');return;}
 try{const file=await readFile(path.join(root,requested));res.setHeader('Content-Type',requested.endsWith('.html')?'text/html':requested.endsWith('.css')?'text/css':'text/javascript');res.end(file);}catch{res.statusCode=404;res.end('Not found');}
}).listen(process.env.PORT||3000,'127.0.0.1',()=>console.log(`Geotech ready at http://localhost:${process.env.PORT||3000}`));
