export const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const heading=(label,title,description)=>`<span class="eyebrow">${label}</span><h1>${title}</h1><p class="lead">${description}</p>`;
export const options=items=>items.map(x=>`<option>${escapeHTML(x)}</option>`).join('');
export function shuffle(items){const copy=[...items];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;}
export const list=items=>`<ul>${items.map(x=>`<li>${escapeHTML(x)}</li>`).join('')}</ul>`;
