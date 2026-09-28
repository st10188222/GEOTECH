import test from 'node:test';
import assert from 'node:assert/strict';
import handler,{validFeedback} from '../api/gemini.js';
import {questions,categories} from '../data/questions.js';
import {interviews} from '../data/interviews.js';
const q=interviews[0];const body={questionId:q.id,question:q.question,category:q.category,difficulty:q.difficulty,answer:'Effective stress is total stress minus pore-water pressure.',followUpDepth:0};
const feedback={overallScore:75,summary:'Sound definition.',strengths:['Correct relationship'],missingPoints:['Practical example'],technicalAccuracy:'Correct',structureFeedback:'Add an example.',communicationFeedback:'Clear.',betterApproach:['Explain the physical meaning.'],exampleImprovedAnswer:'Effective stress is the stress carried by the solid skeleton.',followUpQuestion:'What happens if pore pressure rises?'};
async function call(value=body,method='POST',headers={}){const res={headers:{},setHeader(k,v){this.headers[k]=v;},status(s){this.code=s;return this;},json(v){this.value=v;return this;}};await handler({method,headers:{'content-type':'application/json',...headers},body:value},res);return res;}
test('local bank is complete and valid',()=>{assert.ok(questions.length>=50);assert.equal(new Set(questions.map(q=>q.id)).size,questions.length);assert.equal(categories.length,11);for(const q of questions){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.ok(q.options[q.correctAnswer]);assert.ok(q.explanation&&q.takeaway);}assert.ok(interviews.length>=45);});
test('API validates boundaries and handles provider responses',async()=>{const oldKey=process.env.GEMINI_API_KEY,oldFetch=global.fetch;try{
 delete process.env.GEMINI_API_KEY;
 assert.equal((await call(body,'GET')).code,405);
 for(const bad of [null,[],{},'{bad', {...body,answer:' '},{...body,answer:'x'.repeat(8001)},{...body,followUpDepth:3},{...body,questionId:'invented'},{...body,question:'altered original'}])assert.equal((await call(bad)).code,400);
 assert.equal((await call({...body,extra:'x'.repeat(17000)})).code,413);
 assert.equal((await call(body,'POST',{'content-type':'text/plain'})).code,415);
 assert.equal((await call()).code,503);
 process.env.GEMINI_API_KEY='test-only-not-a-real-key';
 global.fetch=async(url,init)=>{assert.ok(url.includes('gemini-2.5-flash-lite'));assert.equal(init.headers['x-goog-api-key'],process.env.GEMINI_API_KEY);return {ok:true,json:async()=>({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify(feedback)}]}}]})};};
 assert.deepEqual((await call()).value,feedback);
 assert.equal((await call({...body,followUpDepth:2,question:'A relevant follow-up?'})).code,200);
 for(const status of [401,403,404,429,500]){global.fetch=async()=>({ok:false,status});assert.equal((await call()).code,status===429?429:502);}
 global.fetch=async()=>({ok:true,json:async()=>({candidates:[{finishReason:'STOP',content:{parts:[{text:'not json'}]}}]})});assert.equal((await call()).code,502);
 global.fetch=async()=>{throw new Error('network');};assert.equal((await call()).code,502);
 assert.equal(validFeedback({...feedback,overallScore:101}),false);assert.equal(validFeedback({...feedback,strengths:'bad'}),false);
 }finally{global.fetch=oldFetch;if(oldKey===undefined)delete process.env.GEMINI_API_KEY;else process.env.GEMINI_API_KEY=oldKey;}});
