// Copy only frontend assets to the public deployment directory. Never copy .env files.
import {mkdir,copyFile,cp} from 'node:fs/promises';
await mkdir('public',{recursive:true});
await copyFile('index.html','public/index.html');
for(const directory of ['css','js','data'])await cp(directory,`public/${directory}`,{recursive:true});
