const workouts=[
{id:"A",title:"Pull + Bíceps + Core",focus:"Costas • braços • abdômen",cardio:"Remo",area:"Polias",exercises:[
["Puxada frente neutra","4 x 10","puxada frente pegada neutra","upper"],["Remada baixa","4 x 10","remada baixa polia","upper"],["Face Pull","3 x 15","face pull","upper"],["Rosca Scott máquina","3 x 10","rosca scott maquina","upper"],["Rosca martelo na polia","3 x 12","rosca martelo polia","upper"],["Abdominal máquina","3 x 15","abdominal maquina","core"],["Prancha","3 x 45s","prancha abdominal","core"]]},
{id:"B",title:"Pernas — Máquinas",focus:"Pernas • core",cardio:"Corda",area:"Máquinas de pernas",exercises:[
["Leg Press 45°","4 x 12","leg press 45","lower"],["Mesa flexora","4 x 12","mesa flexora","lower"],["Cadeira extensora","3 x 12","cadeira extensora","lower"],["Cadeira abdutora","3 x 15","cadeira abdutora","lower"],["Panturrilha sentada","4 x 15","panturrilha sentada maquina","lower"],["Abdominal máquina","3 x 15","abdominal maquina","core"],["Prancha lateral","3 x 40s","prancha lateral","core"]]},
{id:"C",title:"Push + Braços + Core",focus:"Peito • ombros • tríceps",cardio:"Esteira inclinada",area:"Peito / polias",exercises:[
["Supino máquina convergente","4 x 10","supino maquina convergente","upper"],["Supino inclinado com halteres","3 x 10","supino inclinado halteres pegada neutra","upper"],["Peck Deck","3 x 12","peck deck","upper"],["Elevação lateral máquina","3 x 15","elevacao lateral maquina","upper"],["Tríceps corda","3 x 12","triceps corda polia","upper"],["Tríceps unilateral na polia","3 x 12","triceps unilateral polia","upper"],["Elevação de pernas","3 x 15","elevacao pernas abdominal","core"],["Prancha","3 x 45s","prancha abdominal","core"]]},
{id:"D",title:"Academia Cheia — Circuito",focus:"Full body • braços • core",cardio:"Remo",area:"Polias",exercises:[
["Puxada frente","4 x 10","puxada frente","upper"],["Remada baixa","4 x 10","remada baixa polia","upper"],["Tríceps corda","4 x 12","triceps corda","upper"],["Rosca na polia","4 x 12","rosca biceps polia","upper"],["Face Pull","4 x 15","face pull","upper"],["Abdominal máquina","3 x 15","abdominal maquina","core"]]}
];

const def={screen:"home",week:1,tennis:0,completed:{},loads:{},notes:{},history:[],current:"A",schedule:[],settings:{name:"José",rest:60,tennisDays:[]}};
let state=JSON.parse(localStorage.getItem("meutreino")||"null")||structuredClone(def);
state.settings={...def.settings,...(state.settings||{})};
state.settings.tennisDays=Array.isArray(state.settings.tennisDays)?state.settings.tennisDays:[];

const $=s=>document.querySelector(s);
const save=()=>localStorage.setItem("meutreino",JSON.stringify(state));
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const video=q=>"https://www.youtube.com/results?search_query="+encodeURIComponent(q);
function toast(t){const x=$("#toast");if(!x)return;x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),1600)}
function go(s){state.screen=s;save();render()}
function pct(w){return Math.round(w.exercises.filter((_,i)=>state.completed[`${state.week}-${w.id}-${i}`]).length/w.exercises.length*100)}
function prevLoad(w,i){const n=parseFloat(String(state.loads[`${Math.max(1,state.week-1)}-${w.id}-${i}`]||"").replace(",","."));return Number.isFinite(n)?n:null}
function suggestion(w,i){const p=prevLoad(w,i);if(p===null)return null;return Math.round(p*(w.exercises[i][3]==="lower"?1.05:1.025)*2)/2}

function render(){
 $("#title").textContent=state.screen==="home"?`Semana ${state.week}`:state.screen==="workouts"?"Treinos":state.screen==="history"?"Histórico":state.screen==="settings"?"Ajustes":`Treino ${state.current}`;
 document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("active",b.dataset.nav===state.screen));
 $("#screen").innerHTML=state.screen==="home"?home():state.screen==="workouts"?workoutsScreen():state.screen==="history"?historyScreen():state.screen==="settings"?settingsScreen():workoutScreen(state.current);
 bind();
}

function home(){
 const done=workouts.filter(w=>pct(w)===100).length;
 return `<div class="card hero"><div class="eyebrow">SEMANA ${state.week}</div><h2>Seu treino, sem enrolação.</h2><p class="muted">Cut • abdômen • braços • pernas em máquinas • proteção das articulações.</p><div class="row wrap"><button class="btn" data-action="open-workouts">Começar treino</button><button class="btn secondary" data-action="tennis">🎾 Joguei tênis hoje</button></div></div>
 <div class="grid"><div class="stat"><span class="muted">Treinos</span><b>${done}/4</b></div><div class="stat"><span class="muted">Tênis</span><b>${state.tennis}</b></div><div class="stat"><span class="muted">Semana</span><b>${state.week}</b></div><div class="stat"><span class="muted">Status</span><b>${done===4?"✓":"Em curso"}</b></div></div>
 <div class="card"><h2>Semana gerada</h2>${state.schedule.length?state.schedule.map(x=>`<div class="exercise"><div class="row"><b>${esc(x.day)}</b><span class="pill">${esc(x.type)}</span></div><div class="muted">${esc(x.detail)}</div></div>`).join(""):"<p class=\"muted\">Vá em Ajustes → Gerar semana.</p>"}</div>
 <div class="card"><h2>Progresso</h2>${workouts.map(w=>`<div style="margin:13px 0"><div class="row"><b>Treino ${w.id}</b><span class="muted">${pct(w)}%</span></div><div class="progress"><i style="width:${pct(w)}%"></i></div></div>`).join("")}</div>`;
}

function workoutsScreen(){
 return `<div class="screen">${workouts.map(w=>`<div class="card workout"><div><div class="eyebrow">TREINO ${w.id}</div><h3>${w.title}</h3><div class="muted">${w.focus}</div><span class="pill">${w.area} • ${w.cardio}</span></div><button class="btn" data-open="${w.id}">Abrir</button></div>`).join("")}</div>`;
}

function workoutScreen(id){
 const w=workouts.find(x=>x.id===id);if(!w)return "<div class=\"card\">Treino não encontrado.</div>";
 return `<div class="card hero"><div class="eyebrow">TREINO ${w.id}</div><h2>${w.title}</h2><p class="muted">${w.focus} • ${w.area}</p><p class="row"><span>Progresso</span><b>${pct(w)}%</b></p><div class="progress"><i style="width:${pct(w)}%"></i></div></div>
 <div class="card"><h2>Exercícios</h2>${w.exercises.map((e,i)=>{const k=`${state.week}-${w.id}-${i}`,s=suggestion(w,i);return `<div class="exercise"><label class="check"><input type="checkbox" data-check="${k}" ${state.completed[k]?"checked":""}><span><b>${e[0]}</b><div class="sets">${e[1]}</div></span></label><div class="row"><div><input class="load" data-load="${k}" value="${esc(state.loads[k]||"")}" placeholder="${s!==null&&!state.loads[k]?s+" kg":"kg"}" inputmode="decimal">${s!==null&&!state.loads[k]?`<div class="muted">Sugestão: ${s} kg</div>`:""}</div><button class="btn secondary" data-timer>⏱ ${state.settings.rest}s</button></div><a href="${video(e[2])}" target="_blank" rel="noopener">🎥 Ver execução no YouTube</a></div>`}).join("")}</div>
 <div class="card"><h2>Cardio</h2><p>${w.cardio==="Remo"?"🚣 6× (1 min forte + 1 min leve)":w.cardio==="Corda"?"🪢 10× (30s + 30s)":"🏃 10 min de esteira inclinada"}</p></div>
 <div class="card"><h2>Observações</h2><textarea class="notes" data-note="${w.id}" placeholder="RPE, carga, articulações, observações...">${esc(state.notes[w.id]||"")}</textarea></div>
 <button class="btn full" data-finish="${w.id}">✓ Concluir treino</button>`;
}

function historyScreen(){
 return `<div class="card"><h2>Histórico</h2><p class="muted">Seus registros ficam salvos neste aparelho.</p>${state.history.length?state.history.slice().reverse().map(x=>`<div class="exercise"><b>Semana ${x.week} • Treino ${x.id}</b><div class="muted">${new Date(x.date).toLocaleString("pt-BR")}</div></div>`).join(""):"<p class=\"muted\">Nenhum treino concluído.</p>"}</div><div class="card"><button class="btn" data-action="new-week">Nova semana</button> <button class="btn secondary" data-action="reset">Apagar dados</button></div>`;
}

function settingsScreen(){
 const ds=["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"];
 return `<div class="card"><h2>Ajustes</h2><label class="muted">Nome</label><input class="field" id="name" value="${esc(state.settings.name)}"><div class="small-gap"></div><label class="muted">Descanso padrão</label><input class="field" id="rest" value="${state.settings.rest}" inputmode="numeric"><button class="btn" data-action="save-settings">Salvar</button></div>
 <div class="card"><h2>Dias de tênis</h2><p class="muted">Marque os dias habituais. A geração evita colocar pernas nesses dias.</p><div class="grid">${ds.map((d,i)=>`<button class="btn ${state.settings.tennisDays.includes(i)?"":"secondary"}" data-day="${i}">${d}</button>`).join("")}</div></div>
 <div class="card"><h2>Gerar nova semana</h2><p class="muted">Distribui os 4 treinos nos dias disponíveis.</p><button class="btn full" data-action="generate">⚡ Gerar semana</button></div>
 <div class="card"><h2>Semana</h2><button class="btn" data-action="new-week">Nova semana →</button></div>
 <div class="card"><h2>Sobre</h2><p class="muted">MeuTreino v1.1 • progressão de cargas + geração semanal.</p></div>`;
}

function bind(){
 document.querySelectorAll("[data-nav]").forEach(b=>b.onclick=()=>go(b.dataset.nav));
 document.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>{state.screen="workout";state.current=b.dataset.open;render()});
 document.querySelectorAll("[data-action]").forEach(b=>b.onclick=()=>action(b.dataset.action));
 document.querySelectorAll("[data-check]").forEach(x=>x.onchange=()=>{state.completed[x.dataset.check]=x.checked;save();render()});
 document.querySelectorAll("[data-load]").forEach(x=>x.oninput=()=>{state.loads[x.dataset.load]=x.value;save()});
 document.querySelectorAll("[data-note]").forEach(x=>x.oninput=()=>{state.notes[x.dataset.note]=x.value;save()});
 document.querySelectorAll("[data-timer]").forEach(x=>x.onclick=()=>timer());
 document.querySelectorAll("[data-finish]").forEach(x=>x.onclick=()=>finish(x.dataset.finish));
 document.querySelectorAll("[data-day]").forEach(x=>x.onclick=()=>{const d=+x.dataset.day,a=state.settings.tennisDays;state.settings.tennisDays=a.includes(d)?a.filter(v=>v!==d):[...a,d];save();render()});
}

function finish(id){state.history.push({week:state.week,id,date:new Date().toISOString()});save();toast(`Treino ${id} concluído ✓`);go("home")}
function timer(){
 let n=state.settings.rest;
 $("#modalbody").innerHTML=`<div class="eyebrow">DESCANSO</div><div class="timer" id="timer">${n}</div><button class="btn full" id="stop">Parar</button>`;
 $("#modal").classList.remove("hide");
 const int=setInterval(()=>{n--;const el=$("#timer");if(el)el.textContent=n;if(n<=0){clearInterval(int);navigator.vibrate?.(150)}},1000);
 $("#stop").onclick=()=>{clearInterval(int);$("#modal").classList.add("hide")};
}
$("#close").onclick=()=>$("#modal").classList.add("hide");
$("#modal").onclick=e=>{if(e.target.id==="modal")$("#modal").classList.add("hide")};

function generate(){
 const names=["Segunda","Terça","Quarta","Quinta","Sexta","Sábado","Domingo"],t=state.settings.tennisDays;
 let avail=[0,1,2,3,4,5,6].filter(d=>!t.includes(d));
 let chosen=avail.slice(0,4);
 if(chosen.length<4)chosen=[0,1,2,3].filter(d=>!t.includes(d)).slice(0,4);
 state.schedule=chosen.map((d,i)=>({day:names[d],type:`Treino ${workouts[i].id}`,detail:workouts[i].title}));
 save();
}
function action(a){
 if(a==="open-workouts")go("workouts");
 if(a==="tennis"){state.tennis++;save();toast("Tênis registrado 🎾");render()}
 if(a==="reset"&&confirm("Apagar todos os dados?")){localStorage.removeItem("meutreino");location.reload()}
 if(a==="save-settings"){state.settings.name=$("#name").value;state.settings.rest=Math.max(15,Number($("#rest").value)||60);save();toast("Salvo ✓");render()}
 if(a==="generate"){generate();toast("Semana gerada ⚡");go("home")}
 if(a==="new-week"){state.week++;state.tennis=0;state.completed={};state.notes={};state.schedule=[];save();toast(`Nova semana ${state.week}`);go("home")}
}
render();