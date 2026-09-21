import"./modulepreload-polyfill-B5Qt9EMX.js";import{a as h}from"./notes-store-CF7EqKaG.js";let d=[];const g=document.getElementById("note-count"),m=document.getElementById("notes-container"),f=document.getElementById("site-filter"),r=document.getElementById("label-filter"),u=document.getElementById("search-input"),v=document.getElementById("sort-filter");function E(e){const t=u.value,n=document.createElement("div");return n.className="note-card",n.innerHTML=`
        <div class="note-card-header">
            <div class="note-title">${t===""?e.questionId:i(e.questionId,t)}</div>
            <div class="note-site ${e.site}">${e.site}</div>
        </div>
        <div class="note-labels">
            ${e.labels.map(c=>`
                <span class="note-label">${t===""?c:i(c,t)}</span>
            `).join("")}
        </div>
        <div class="note-content">${t===""?e.content:i(e.content,t)}</div>
        <div class="note-meta">
            <span>Updated: ${new Date(e.updatedAt).toLocaleString()}</span>
            <!-- <button class="open-question-btn">Open Question →</button> --> 
        </div>
    `,n}function L(e){m.innerHTML="",e.forEach(t=>{m.appendChild(E(t))})}function l(){const e=f.value,t=r.value,n=u.value,c=v.value;let a=[...d];e!=="all"&&(a=a.filter(s=>s.site===e)),t!=="all"&&(a=a.filter(s=>s.labels.includes(t))),n!==""&&(a=a.filter(s=>s.questionId.toLowerCase().includes(n.toLowerCase())||s.content.toLowerCase().includes(n.toLowerCase())||s.labels.some(o=>o.toLowerCase().includes(n.toLowerCase()))));const p=(s,o)=>s<o?-1:s>o?1:0;c==="updated-desc"&&(a=a.sort((s,o)=>p(o.updatedAt,s.updatedAt))),c==="updated-asc"&&(a=a.sort((s,o)=>p(s.updatedAt,o.updatedAt))),L(a)}function i(e,t){const n=t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),c=new RegExp(n,"gi");return e.replace(c,a=>`<span class="search-match">${a}</span>`)}function C(){const e=new Set;d.forEach(t=>{t.labels.forEach(n=>{e.add(n)})}),e.forEach(t=>{const n=document.createElement("option");n.value=t,n.textContent=t,r.appendChild(n)})}async function b(){d=await h(),g.textContent=`Notes : ${d.length}`,C(),l(),f.addEventListener("change",l),r.addEventListener("change",l),u.addEventListener("input",l),v.addEventListener("change",l)}b();
