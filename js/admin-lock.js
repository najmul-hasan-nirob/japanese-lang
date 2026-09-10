// Japanese Lang — Global Admin Lock
(function(){'use strict';
const SUPABASE_URL='https://levpdywhnikadumfocao.supabase.co';
const SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxldnBkeWhuaWthZHVtZm9jYW8iLCJpYXQiOjE3ODY4Nzk1MzUsImV4cCI6MjEwMjQ1NTM1M30.NiBsJ_jEeAPNuDLdjqn9bQamTOz-kgLaLLQPcE6N6aM';
const KEY='japaneseLangAdminSession',TTL=30*60*1000;
let token='',expiresAt=0;
function load(){try{const s=JSON.parse(sessionStorage.getItem(KEY)||'null');if(s&&s.token&&Number(s.expiresAt)>Date.now()){token=s.token;expiresAt=Number(s.expiresAt);return true}sessionStorage.removeItem(KEY)}catch(_){}return false}
function save(){try{sessionStorage.setItem(KEY,JSON.stringify({token,expiresAt}))}catch(_){}
}
function clear(){token='';expiresAt=0;try{sessionStorage.removeItem(KEY)}catch(_){};window.dispatchEvent(new Event('japaneseAdminChanged'));updateButton()}
async function verify(password){const r=await fetch(SUPABASE_URL+'/functions/v1/manual-input',{method:'POST',headers:{Authorization:'Bearer '+SUPABASE_ANON_KEY,apikey:SUPABASE_ANON_KEY,'Content-Type':'application/json'},body:JSON.stringify({action:'verify',password:String(password||'')})});const d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d.error||'Incorrect password.');if(!d.token)throw Error('Could not create an admin session.');token=d.token;expiresAt=Date.now()+Math.min(Number(d.expiresIn||1800)*1000,TTL);save();window.dispatchEvent(new Event('japaneseAdminChanged'));updateButton();return token}
async function unlock(password){if(load()&&expiresAt>Date.now()){updateButton();return token}const p=password??window.prompt('Enter the Admin password:');if(!p)return '';return verify(p)}
function isUnlocked(){if(token&&expiresAt>Date.now())return true;if(load())return true;clear();return false}
function getToken(){return isUnlocked()?token:''}
function lock(){clear()}
function updateButton(){const b=document.getElementById('adminLockButton');if(!b)return;const on=isUnlocked();b.textContent=on?'🔓 Admin':'🔒 Admin';b.setAttribute('aria-label',on?'Lock Admin mode':'Unlock Admin mode');b.title=on?'Lock Admin mode':'Unlock Admin mode'}
function bind(){const b=document.getElementById('adminLockButton');if(b)b.addEventListener('click',async()=>{if(isUnlocked()){if(window.confirm('Lock Admin mode now?'))lock();return}try{await unlock()}catch(e){window.alert(e.message||'Could not unlock Admin mode.')}});updateButton();setInterval(()=>{if(token&&Date.now()>=expiresAt)clear()},15000)}
window.japaneseAdmin={unlock,isUnlocked,getToken,lock,verify};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})();
