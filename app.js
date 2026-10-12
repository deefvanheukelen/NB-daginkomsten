import {createClient} from 'https://esm.sh/@supabase/supabase-js@2';
import {SUPABASE_URL,SUPABASE_ANON_KEY,SCHEMA} from './config.js';
const $=id=>document.getElementById(id);const today=new Date();let current=new Date(today.getFullYear(),today.getMonth(),today.getDate()),mode='day',client,session,items=[];
const fmt=new Intl.NumberFormat('nl-BE',{style:'currency',currency:'EUR'});const dateStr=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const dateLabel=d=>new Intl.DateTimeFormat('nl-BE',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(d);const setStatus=s=>$('status').textContent=s;
function init(){const url=SUPABASE_URL||localStorage.getItem('nb_url'),key=SUPABASE_ANON_KEY||localStorage.getItem('nb_key');if(!url||!key){$('setup').hidden=false;return}client=createClient(url,key,{auth:{persistSession:true,autoRefreshToken:true}});client.auth.onAuthStateChange((_event,s)=>{session=s;showAuth()});client.auth.getSession().then(({data})=>{session=data.session;showAuth()})}
function showAuth(){$('setup').hidden=true;$('login').hidden=!!session;$('app').hidden=!session;$('logout').hidden=!session;if(session)load()}
$('saveConfig').onclick=()=>{const url=$('url').value.trim(),key=$('key').value.trim();if(!/^https:\/\/.+\.supabase\.co\/?$/.test(url)||!key){setStatus('Controleer de URL en publieke sleutel.');return}localStorage.setItem('nb_url',url);localStorage.setItem('nb_key',key);$('setup').hidden=true;init()};
$('loginForm').onsubmit=async e=>{e.preventDefault();setStatus('Aanmelden…');const {error}=await client.auth.signInWithPassword({email:$('email').value,password:$('password').value});setStatus(error?'Aanmelden mislukt: '+error.message:'')};$('logout').onclick=()=>client.auth.signOut();
for(let m=0;m<12;m++){$('monthSelect').add(new Option(new Intl.DateTimeFormat('nl-BE',{month:'long'}).format(new Date(2026,m,1)),m))}for(let y=today.getFullYear()-10;y<=today.getFullYear()+10;y++)$('yearSelect').add(new Option(y,y));
function controls(){$('dayTab').classList.toggle('active',mode==='day');$('monthTab').classList.toggle('active',mode==='month');$('dayControls').hidden=mode!=='day';$('monthControls').hidden=mode!=='month';$('dateButton').textContent=dateLabel(current);$('dateInput').value=dateStr(current);$('monthSelect').value=current.getMonth();$('yearSelect').value=current.getFullYear()}
$('dayTab').onclick=()=>{mode='day';load()};$('monthTab').onclick=()=>{mode='month';load()};function move(n){if(mode==='day')current.setDate(current.getDate()+n);else{current.setDate(1);current.setMonth(current.getMonth()+n)}load()}$('prev').onclick=()=>move(-1);$('next').onclick=()=>move(1);$('dateButton').onclick=()=>{const el=$('dateInput');if(el.showPicker)el.showPicker();else el.click()};$('dateInput').onchange=e=>{if(e.target.value){const [y,m,d]=e.target.value.split('-').map(Number);current=new Date(y,m-1,d);load()}};function monthChange(){current=new Date(Number($('yearSelect').value),Number($('monthSelect').value),1);load()}$('monthSelect').onchange=monthChange;$('yearSelect').onchange=monthChange;
let touchX=0,touchY=0;$('app').addEventListener('touchstart',e=>{touchX=e.changedTouches[0].screenX;touchY=e.changedTouches[0].screenY},{passive:true});$('app').addEventListener('touchend',e=>{if(e.target.closest('input,select,button'))return;const dx=e.changedTouches[0].screenX-touchX,dy=e.changedTouches[0].screenY-touchY;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.5)move(dx<0?1:-1)},{passive:true});
const lower = value => String(value ?? '').trim().toLocaleLowerCase('nl-BE');
function normalize(r, services, customers){
  const service = services.get(String(r.service_id));
  const customer = customers.get(String(r.customer_id));
  return {
    date: String(r.appointment_date ?? '').slice(0,10),
    time: String(r.appointment_time ?? '').slice(0,5),
    service: service?.name ?? 'Onbekende behandeling',
    customer: customer ? [customer.first_name, customer.last_name].filter(Boolean).join(' ') : 'Onbekende klant',
    amount: Number(r.price ?? 0),
    payment: String(r.payment_method_label ?? ''),
    private: r.is_private === true,
    deleted: r.deleted_at,
    status: r.status
  };
}
let loadVersion = 0;
async function load(){
  controls(); if(!session)return;
  const version = ++loadVersion;
  setStatus('Afspraken laden…'); $('entries').innerHTML='';
  const start=mode==='day'?dateStr(current):dateStr(new Date(current.getFullYear(),current.getMonth(),1));
  const end=mode==='day'?dateStr(new Date(current.getFullYear(),current.getMonth(),current.getDate()+1)):dateStr(new Date(current.getFullYear(),current.getMonth()+1,1));
  const userId=session.user.id;
  const [appointmentsResult, servicesResult, customersResult] = await Promise.all([
    client.from('appointments').select('*').eq('user_id',userId).gte('appointment_date',start).lt('appointment_date',end).is('deleted_at',null).order('appointment_date').order('appointment_time'),
    client.from('services').select('id,name').eq('user_id',userId),
    client.from('customers').select('id,first_name,last_name').eq('user_id',userId)
  ]);
  if(version!==loadVersion)return;
  const error=appointmentsResult.error||servicesResult.error||customersResult.error;
  if(error){setStatus('Fout bij ophalen van NailBooker: '+error.message);$('summary').textContent='Geen gegevens beschikbaar';return;}
  const services=new Map((servicesResult.data||[]).map(s=>[String(s.id),s]));
  const customers=new Map((customersResult.data||[]).map(c=>[String(c.id),c]));
  items=(appointmentsResult.data||[]).map(r=>normalize(r,services,customers)).filter(r=>
    !r.private && !r.deleted && lower(r.payment)!=='andere' &&
    !SCHEMA.excludedServices.some(s=>lower(s)===lower(r.service)) &&
    !SCHEMA.privateServiceNames.some(s=>lower(s)===lower(r.service))
  );
  render();setStatus('');
}
function render(){const sum=items.reduce((a,r)=>a+(Number.isFinite(r.amount)?r.amount:0),0);$('summary').innerHTML=`<div><small>${mode==='day'?'Daginkomsten':'Maandinkomsten'} · ${items.length} afspraken</small><div><strong>${fmt.format(sum)}</strong></div></div>`;if(!items.length){$('entries').innerHTML='<div class="panel empty">Geen afspraken voor deze periode.</div>';return}const groups=new Map();for(const r of items){if(!groups.has(r.date))groups.set(r.date,[]);groups.get(r.date).push(r)}$('entries').innerHTML=[...groups].map(([date,rows])=>{const [y,m,d]=date.split('-').map(Number);const title=dateLabel(new Date(y,m-1,d));return `<section class="group"><div class="group-head"><span>${esc(title)}</span><span>${rows.length} afspraken</span></div>${rows.map(r=>`<div class="appointment"><span class="time">${esc(r.time)}</span><div class="detail"><strong>${esc(r.service)}</strong><small>${esc(r.customer)}${r.payment?' · '+esc(r.payment):''}</small></div><span class="amount">${fmt.format(r.amount||0)}</span></div>`).join('')}<div class="group-total">Dagtotaal: ${fmt.format(rows.reduce((a,r)=>a+(r.amount||0),0))}</div></section>`}).join('')}
init();
