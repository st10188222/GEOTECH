const HISTORY='geotech.history.v1', SESSION='geotech.session.v1';
export function notice(message){document.querySelector('#notice').textContent=message;}
// Storage can fail in private browsing or when full. Practice should still work.
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}}
function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch{notice('This browser could not save progress. You can keep practising.');}}
export function history(){const value=read(HISTORY,[]);return Array.isArray(value)?value.filter(x=>x&&['quiz','interview'].includes(x.type)&&typeof x.date==='string'):[];}
export function saveAttempt(attempt){write(HISTORY,[{...attempt,date:new Date().toISOString()},...history()].slice(0,200));}
export function clearHistory(){try{localStorage.removeItem(HISTORY);localStorage.removeItem(SESSION);}catch{notice('Could not clear browser storage. Check browser permissions.');return false;}return true;}
export function session(){return read(SESSION,null);}
export function saveSession(value){write(SESSION,value);}
export function metrics(){const entries=history(),quizzes=entries.filter(x=>x.type==='quiz');const total=quizzes.reduce((n,x)=>n+(Number(x.total)||0),0);const correct=quizzes.reduce((n,x)=>n+(Number(x.score)||0),0);const interviews=entries.filter(x=>x.type==='interview').length;const review=[...new Set(quizzes.flatMap(x=>Array.isArray(x.missedTopics)?x.missedTopics:[]))];return {practised:total+interviews,accuracy:total?`${Math.round(correct/total*100)}%`:'—',interviews,review};}
