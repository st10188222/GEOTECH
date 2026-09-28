let recognition;
export function stopSpeech(){if(recognition){recognition.onend=null;recognition.onresult=null;recognition.onerror=null;recognition.abort();recognition=null;}}
export function attachSpeech(textarea,onChange){
 const start=document.querySelector('#speak'),stop=document.querySelector('#stop'),status=document.querySelector('#speech-status');
 const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!SpeechRecognition){start.disabled=true;stop.disabled=true;status.textContent="Speech recognition isn't supported in this browser. You can still type your answer.";return;}
 let base='',finalText=''; recognition=new SpeechRecognition();recognition.lang='en-ZA';recognition.continuous=true;recognition.interimResults=true;
 const reset=()=>{start.disabled=false;stop.disabled=true;start.textContent='Start speaking';start.classList.remove('recording');textarea.readOnly=false;};
 // Final segments accumulate; interim segments are replaced instead of duplicated.
 recognition.onresult=event=>{let interim='';for(let i=event.resultIndex;i<event.results.length;i++){if(event.results[i].isFinal)finalText+=event.results[i][0].transcript+' ';else interim+=event.results[i][0].transcript;}textarea.value=(base+' '+finalText+interim).trim().slice(0,8000);onChange();};
 recognition.onerror=event=>{status.textContent=event.error==='not-allowed'?'Microphone permission was denied. You can still type your answer.':'Speech recognition stopped. You can type or try again.';reset();};
 recognition.onend=reset;
 start.onclick=()=>{base=textarea.value;finalText='';try{recognition.start();start.disabled=true;stop.disabled=false;start.textContent='Listening…';start.classList.add('recording');textarea.readOnly=true;status.textContent='Listening. Stop to edit your transcript.';}catch{reset();status.textContent='Could not start speech recognition. Please type or try again.';}};
 stop.onclick=()=>{recognition.stop();reset();status.textContent='Recording stopped. You can edit the transcript.';};
}
