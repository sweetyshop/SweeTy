
import React, { useState, useEffect, useMemo } from 'react'
import { LS, getJSON, setJSON } from '../shared/storage.js'
import { seedCategories, seedProducts, seedSettings, seedTestimonials } from '../shared/seed.js'

function Login({onLogin}){
  const [id,setId]=useState('');const [pwd,setPwd]=useState('');const [err,setErr]=useState('');const [lock,setLock]=useState(0);const [attempts,setAttempts]=useState(0);
  useEffect(()=>{ if(lock>0){const t=setInterval(()=>setLock(s=>s-1),1000); return ()=>clearInterval(t)} },[lock]);
  const submit=e=>{e.preventDefault(); if(lock>0)return; const h=localStorage.getItem(LS.hash); if(id.trim()==='0776380744'&& btoa(pwd)===h){localStorage.setItem(LS.token, JSON.stringify({exp:Date.now()+43200000})); onLogin()} else {const a=attempts+1; setAttempts(a); setErr(`Incorrect ${a}/3`); if(a>=3){setLock(30); setAttempts(0)}}};
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#1A120D] to-black">
      <div className="w-full max-w-md bg-[#1E150F] border border-[#C5A572]/20 rounded-[24px] p-8 shadow-2xl">
        <div className="text-center mb-8"><div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#C5A572] to-[#D4B483] flex items-center justify-center text-[#1A120D] font-bold text-2xl serif mb-4">S</div><h1 className="serif text-3xl text-[#FFFBF7]">SweeTy Admin</h1><p className="text-[#C5A572]/70 text-sm">Espace Administration</p></div>
        <form onSubmit={submit} className="space-y-4">
          <input value={id} onChange={e=>setId(e.target.value)} placeholder="ID / 0776380744" className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white outline-none focus:border-[#C5A572]" />
          <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="Mot de passe" className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white outline-none focus:border-[#C5A572]" />
          {err && <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-sm p-3 rounded-xl">{err}</div>}
          {lock>0 && <div className="bg-yellow-500/10 text-yellow-300 text-sm p-3 rounded-xl">Verrouillé {lock}s</div>}
          <button type="submit" disabled={lock>0} className="w-full py-3 rounded-xl bg-[#C5A572] text-[#1A120D] font-semibold">{lock>0?`Attendez ${lock}s`:'Se connecter'}</button>
        </form>
        <div className="mt-6 text-center text-[11px] text-white/30">ID: 0776380744 | MDP: SweeTy092026</div>
      </div>
    </div>
  )
}

export default function App(){
  const [auth,setAuth]=useState(false)
  const [view,setView]=useState('dashboard')
  const [products,setProducts]=useState([])
  const [cats,setCats]=useState([])
  const [settings,setSettings]=useState(seedSettings)
  const [orders,setOrders]=useState([])
  const [search,setSearch]=useState('')
  const [showProd,setShowProd]=useState(false)
  const [editing,setEditing]=useState(null)
  const [toasts,setToasts]=useState([])
  const [mobile,setMobile]=useState(false)

  const toast=m=>{const id=Date.now(); setToasts(v=>[...v,{id,m}]); setTimeout(()=>setToasts(v=>v.filter(x=>x.id!==id)),3000)}

  useEffect(()=>{
    if(!localStorage.getItem(LS.products)) localStorage.setItem(LS.products, JSON.stringify(seedProducts))
    if(!localStorage.getItem(LS.cats)) localStorage.setItem(LS.cats, JSON.stringify(seedCategories))
    if(!localStorage.getItem(LS.settings)) localStorage.setItem(LS.settings, JSON.stringify(seedSettings))
    if(!localStorage.getItem(LS.orders)) localStorage.setItem(LS.orders, JSON.stringify([]))
    if(!localStorage.getItem(LS.hash)) localStorage.setItem(LS.hash, btoa('SweeTy092026'))
    setProducts(getJSON(LS.products,seedProducts))
    setCats(getJSON(LS.cats,seedCategories))
    setSettings(getJSON(LS.settings,seedSettings))
    setOrders(getJSON(LS.orders,[]))
    const tok=getJSON(LS.token,null); if(tok&&tok.exp>Date.now()) setAuth(true)
  },[])

  const saveProds=p=>{localStorage.setItem(LS.products,JSON.stringify(p)); setProducts(p)}
  const saveSet=s=>{localStorage.setItem(LS.settings,JSON.stringify(s)); setSettings(s); toast('Paramètres enregistrés')}

  if(!auth) return <Login onLogin={()=>setAuth(true)} />

  const stats={total:products.length,dispo:products.filter(p=>p.availability==='disponible').length,rupture:products.filter(p=>p.availability==='rupture').length,today:orders.filter(o=>new Date(o.date).toDateString()===new Date().toDateString()).length}
  const filtered=products.filter(p=>!search||p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen flex bg-[#0F0A07] text-[#FFFBF7]">
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#1A120D] border-r border-white/5 p-6 flex flex-col transition ${mobile?'translate-x-0':'-translate-x-full md:translate-x-0'}`}>
        <div className="flex gap-3 mb-8"><div className="w-10 h-10 rounded-xl bg-[#C5A572] flex items-center justify-center text-[#1A120D] font-bold serif">S</div><div><div className="serif font-bold">SweeTy</div><div className="text-[10px] text-[#C5A572] tracking-widest">ADMIN</div></div></div>
        <nav className="space-y-1 flex-1">
          {[['dashboard','📊','Tableau de bord'],['products','🧁','Produits'],['categories','📂','Catégories'],['orders','📦','Commandes'],['settings','⚙️','Paramètres']].map(([k,ic,lb])=>(
            <button key={k} onClick={()=>{setView(k); setMobile(false)}} className={`w-full text-left px-4 py-3 rounded-xl flex gap-3 text-sm ${view===k?'bg-[#C5A572] text-[#1A120D] font-semibold':'text-white/70 hover:bg-white/5'}`}>{ic}{lb}</button>
          ))}
        </nav>
        <button onClick={()=>{localStorage.removeItem(LS.token); setAuth(false)}} className="mt-auto w-full py-2 rounded-xl bg-red-500/10 text-red-300 text-sm">Déconnexion</button>
      </div>

      <div className="flex-1 md:ml-72">
        <div className="sticky top-0 z-20 bg-[#0F0A07]/80 backdrop-blur border-b border-white/5 px-6 py-4 flex justify-between">
          <div className="flex gap-3"><button onClick={()=>setMobile(!mobile)} className="md:hidden p-2 bg-white/5 rounded-lg">☰</button><h1 className="serif text-xl capitalize">{view}</h1></div>
          <div className="text-xs text-white/40">{settings.shopName}</div>
        </div>
        <div className="p-6">
          {view==='dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[{l:'Total',v:stats.total},{l:'Disponibles',v:stats.dispo},{l:'Rupture',v:stats.rupture},{l:'Commandes Jour',v:stats.today}].map((s,i)=><div key={i} className="rounded-2xl p-5 bg-[#1E150F] border border-white/5"><div className="text-white/50 text-xs">{s.l}</div><div className="serif text-3xl mt-2">{s.v}</div></div>)}
              </div>
              <div className="rounded-2xl bg-[#1E150F] border border-white/5 p-5">
                <h3 className="serif mb-4">Produits récents</h3>
                <div className="space-y-2">{products.slice(0,5).map(p=><div key={p.id} className="flex gap-3 p-2 rounded-xl hover:bg-white/5"><img src={p.images[0]} className="w-12 h-12 rounded-lg object-cover" /><div><div className="text-sm">{p.name}</div><div className="text-xs text-white/40">{p.price} DZD</div></div></div>)}</div>
              </div>
              <div className="p-4 rounded-xl bg-[#C5A572]/10 border border-[#C5A572]/20 text-[#C5A572] text-sm">💡 Change ton numéro WhatsApp dans Paramètres pour recevoir les vraies commandes.</div>
            </div>
          )}

          {view==='products' && (
            <div className="space-y-4">
              <div className="flex gap-2 justify-between flex-wrap">
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher..." className="flex-1 max-w-md px-4 py-2.5 rounded-xl bg-[#1E150F] border border-white/10 text-white text-sm outline-none focus:border-[#C5A572]" />
                <button onClick={()=>{setEditing(null); setShowProd(true)}} className="px-5 py-2.5 rounded-xl bg-[#C5A572] text-[#1A120D] font-semibold text-sm">+ Nouveau produit</button>
              </div>
              <div className="rounded-2xl bg-[#1E150F] border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-black/30 text-white/40 text-xs"><tr>{['Produit','Prix','Stock','Statut','Actions'].map(h=><th key={h} className="text-left px-4 py-3">{h}</th>)}</tr></thead>
                    <tbody>{filtered.map(p=><tr key={p.id} className="border-t border-white/5"><td className="px-4 py-3"><div className="flex gap-3"><img src={p.images[0]} className="w-10 h-10 rounded-lg object-cover" /><div><div>{p.name}</div><div className="text-xs text-white/40">{p.category}</div></div></div></td><td className="px-4 py-3">{p.promoPrice||p.price} DZD</td><td className="px-4 py-3">{p.stock}</td><td className="px-4 py-3"><span className={`text-[10px] px-2 py-1 rounded-full ${p.availability==='disponible'?'bg-green-500/20 text-green-300':'bg-red-500/20 text-red-300'}`}>{p.availability}</span></td><td className="px-4 py-3"><div className="flex gap-1"><button onClick={()=>{setEditing(p); setShowProd(true)}} className="px-2 py-1 rounded bg-white/10 text-xs">Edit</button><button onClick={()=>{if(confirm('Supprimer?')){saveProds(products.filter(x=>x.id!==p.id)); toast('Supprimé')}}} className="px-2 py-1 rounded bg-red-500/20 text-red-300 text-xs">Del</button></div></td></tr>)}</tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {view==='categories' && <div className="grid md:grid-cols-3 gap-4">{cats.map(c=>{const cnt=products.filter(p=>p.category===c.name).length; return <div key={c.id} className="rounded-2xl bg-[#1E150F] border border-white/5 p-4 flex gap-4"><img src={c.image} className="w-16 h-16 rounded-xl object-cover" /><div><div>{c.name}</div><div className="text-xs text-white/40">{cnt} produits</div></div></div>})}</div>}

          {view==='orders' && <div className="rounded-2xl bg-[#1E150F] border border-white/5 p-4"><div className="p-3 mb-4 rounded-xl bg-blue-500/10 text-blue-200 text-sm">WhatsApp ne renvoie pas auto. Commandes générées via bouton client.</div>{orders.length===0?<div className="py-12 text-center text-white/40">Aucune commande</div>:<div className="space-y-2">{orders.slice().reverse().map(o=><div key={o.id} className="p-4 rounded-xl bg-black/30 border border-white/5 flex justify-between"><div><div className="text-[#C5A572] font-mono text-sm">{o.ref}</div><div className="text-sm">{o.customer.name} • {o.customer.phone}</div><div className="text-xs text-white/40">{new Date(o.date).toLocaleString()}</div></div><div className="text-right"><div className="font-bold">{o.total} DZD</div><div className="text-xs text-white/50">{o.status}</div></div></div>)}</div>}</div>}

          {view==='settings' && (
            <div className="max-w-2xl space-y-4">
              <h2 className="serif text-2xl">Paramètres</h2>
              <div className="rounded-2xl bg-[#1E150F] border border-white/5 p-6 space-y-4">
                <div><label className="text-xs text-white/60">Nom boutique</label><input value={settings.shopName} onChange={e=>setSettings({...settings,shopName:e.target.value})} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white" /></div>
                <div><label className="text-xs text-white/60">WhatsApp (213...)</label><input value={settings.whatsapp} onChange={e=>setSettings({...settings,whatsapp:e.target.value})} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white" /></div>
                <div><label className="text-xs text-white/60">Adresse</label><input value={settings.address} onChange={e=>setSettings({...settings,address:e.target.value})} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs text-white/60">Frais livraison</label><input type="number" value={settings.deliveryFee} onChange={e=>setSettings({...settings,deliveryFee:parseInt(e.target.value)||0})} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white" /></div>
                  <div><label className="text-xs text-white/60">Min commande</label><input type="number" value={settings.minOrder} onChange={e=>setSettings({...settings,minOrder:parseInt(e.target.value)||0})} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white" /></div>
                </div>
                <div><label className="text-xs text-white/60">Bannière</label><input value={settings.banner} onChange={e=>setSettings({...settings,banner:e.target.value})} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white" /></div>
                <button onClick={()=>{localStorage.setItem('sweeTy_settings',JSON.stringify(settings)); toast('Enregistré')}} className="px-6 py-2.5 rounded-xl bg-[#C5A572] text-[#1A120D] font-semibold">Enregistrer</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showProd && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#1E150F] border border-white/10 p-6">
            <div className="flex justify-between mb-4"><h3 className="serif text-xl">{editing?'Modifier':'Nouveau produit'}</h3><button onClick={()=>setShowProd(false)} className="w-8 h-8 rounded-full bg-white/5">✕</button></div>
            <ProductForm product={editing} cats={cats} onClose={()=>setShowProd(false)} onSave={p=>{if(editing)saveProds(products.map(x=>x.id===p.id?p:x)); else saveProds([p,...products]); setShowProd(false); toast('Produit enregistré')}} />
          </div>
        </div>
      )}

      <div className="fixed bottom-4 right-4 space-y-2 z-50">{toasts.map(t=><div key={t.id} className="px-4 py-3 rounded-xl bg-green-600 text-white text-sm shadow-xl">{t.m}</div>)}</div>
    </div>
  )
}

function ProductForm({product,cats,onClose,onSave}){
  const [f,setF]=useState(product||{id:'p'+Date.now(),name:'',desc:'',category:cats[0]?.name||'Gâteaux secs',images:['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600'],price:0,promoPrice:'',unit:'piece',availability:'disponible',stock:10,featured:false,nouveau:false,createdAt:Date.now()})
  const onImg=e=>{const files=Array.from(e.target.files); Promise.all(files.map(file=>new Promise(r=>{const fr=new FileReader(); fr.onload=()=>r(fr.result); fr.readAsDataURL(file)}))).then(imgs=>setF({...f,images:[...f.images,...imgs]}))}
  return (
    <div className="space-y-3">
      <input value={f.name} onChange={e=>setF({...f,name:e.target.value})} placeholder="Nom*" className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white" />
      <textarea value={f.desc} onChange={e=>setF({...f,desc:e.target.value})} placeholder="Description" rows="2" className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white"></textarea>
      <div className="grid grid-cols-2 gap-3">
        <select value={f.category} onChange={e=>setF({...f,category:e.target.value})} className="px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white">{cats.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}</select>
        <select value={f.unit} onChange={e=>setF({...f,unit:e.target.value})} className="px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white">{['piece','kg','boite','tasse','bouteille'].map(u=><option key={u} value={u}>{u}</option>)}</select>
        <input type="number" value={f.price} onChange={e=>setF({...f,price:e.target.value})} placeholder="Prix" className="px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white" />
        <input type="number" value={f.promoPrice} onChange={e=>setF({...f,promoPrice:e.target.value})} placeholder="Promo" className="px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white" />
        <input type="number" value={f.stock} onChange={e=>setF({...f,stock:e.target.value})} placeholder="Stock" className="px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white" />
        <select value={f.availability} onChange={e=>setF({...f,availability:e.target.value})} className="px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white">{['disponible','indisponible','rupture'].map(v=><option key={v} value={v}>{v}</option>)}</select>
      </div>
      <div><label className="text-xs text-white/60">Images</label><input type="file" multiple accept="image/*" onChange={onImg} className="w-full mt-1 text-xs text-white/60" /><div className="grid grid-cols-4 gap-2 mt-2">{f.images.map((im,i)=><div key={i} className="relative"><img src={im} className="w-full h-16 object-cover rounded-lg" /><button onClick={()=>setF({...f,images:f.images.filter((_,idx)=>idx!==i)})} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-[10px]">x</button></div>)}</div></div>
      <div className="flex gap-3 pt-2"><button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-white/5">Annuler</button><button onClick={()=>{if(!f.name||!f.price){alert('Nom et prix requis'); return} onSave({...f,price:parseInt(f.price)||0,promoPrice:f.promoPrice?parseInt(f.promoPrice):null,stock:parseInt(f.stock)||0})}} className="flex-1 py-2.5 rounded-xl bg-[#C5A572] text-[#1A120D] font-semibold">Enregistrer</button></div>
    </div>
  )
}
