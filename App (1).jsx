
import React, { useState, useEffect, useMemo } from 'react'
import { LS, getJSON, setJSON, initIfNeeded } from '../shared/storage.js'
import { seedCategories, seedProducts, seedSettings, seedTestimonials } from '../shared/seed.js'

export default function App(){
  const [products,setProducts]=useState([])
  const [cats,setCats]=useState([])
  const [settings,setSettings]=useState(seedSettings)
  const [cart,setCart]=useState([])
  const [view,setView]=useState('home')
  const [selected,setSelected]=useState(null)
  const [search,setSearch]=useState('')
  const [catFilter,setCatFilter]=useState('')
  const [weightSel,setWeightSel]=useState({})
  const [checkout,setCheckout]=useState({name:'',phone:'',mode:'retrait',address:'',notes:''})
  const [toast,setToast]=useState(null)

  useEffect(()=>{
    initIfNeeded({products:seedProducts,cats:seedCategories,settings:seedSettings,testimonials:seedTestimonials})
    setProducts(getJSON(LS.products,seedProducts))
    setCats(getJSON(LS.cats,seedCategories))
    setSettings(getJSON(LS.settings,seedSettings))
    setCart(getJSON(LS.cart,[]))
  },[])

  useEffect(()=>{ setJSON(LS.cart,cart) },[cart])

  const addToast=(m)=>{setToast(m); setTimeout(()=>setToast(null),2500)}

  const priceFor=(p,weight)=>{
    if(p.unit==='kg' && weight){ return Math.round(p.price * weight/1000) }
    return p.promoPrice||p.price
  }

  const addToCart=(p, qty=1, weight=null)=>{
    const id = p.id + (weight?`-${weight}`:'')
    const price = weight ? priceFor(p,weight) : (p.promoPrice||p.price)
    setCart(prev=>{
      const ex = prev.find(x=>x.cartId===id)
      if(ex) return prev.map(x=>x.cartId===id?{...x,qty:x.qty+qty}:x)
      return [...prev,{cartId:id, id:p.id, name:p.name, image:p.images[0], price, qty, weight, unit:p.unit}]
    })
    addToast(p.name+' ajouté')
  }

  const cartTotal = useMemo(()=>cart.reduce((s,i)=>s+i.price*i.qty,0),[cart])
  const totalWithDelivery = cartTotal + (checkout.mode==='livraison' ? settings.deliveryFee : 0)

  const handleWhatsApp=()=>{
    if(!checkout.name||!checkout.phone){ alert('Nom et téléphone requis'); return }
    if(cart.length===0){ alert('Panier vide'); return }
    const lines = cart.map(i=>`- ${i.name} ${i.weight?`(${i.weight}g)`:''} × ${i.qty} = ${i.price*i.qty} DZD`).join('\n')
    const msg = `Bonjour SweeTy ! Je souhaite passer une commande.\n\nNom : ${checkout.name}\nTéléphone : ${checkout.phone}\nMode de réception : ${checkout.mode}\nAdresse : ${checkout.address||'Retrait magasin'}\n\nCOMMANDE :\n${lines}\n\nSous-total : ${cartTotal} DZD\nFrais de livraison : ${checkout.mode==='livraison'?settings.deliveryFee:0} DZD\nTOTAL : ${totalWithDelivery} DZD\n\nInstructions : ${checkout.notes}\n\nMerci de confirmer ma commande.`
    const url = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(msg)}`
    // save order
    const orders = getJSON(LS.orders,[])
    const ref = 'SW-'+Math.floor(1000+Math.random()*9000)
    orders.push({id:Date.now(),ref,date:new Date().toISOString(),customer:{...checkout},items:cart,total:totalWithDelivery,status:'Nouvelle'})
    setJSON(LS.orders,orders)
    window.open(url,'_blank')
    setCart([]); addToast('Commande envoyée sur WhatsApp !')
  }

  const filtered = products.filter(p=>{
    const s = !search || p.name.toLowerCase().includes(search.toLowerCase())
    const c = !catFilter || p.category===catFilter
    return s&&c
  })

  return (
    <div className="min-h-screen bg-[#FFFBF7] text-[#2C1810]">
      <div className="bg-[#2C1810] text-[#FFFBF7] text-center text-xs py-2 tracking-wide">{settings.banner}</div>
      <header className="sticky top-0 z-40 bg-[#FFFBF7]/90 backdrop-blur border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={()=>setView('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C5A572] to-[#D4B483] flex items-center justify-center text-[#2C1810] font-bold serif text-xl">S</div>
            <div><div className="serif font-bold text-xl leading-none">SweeTy</div><div className="text-[10px] tracking-[0.2em] text-[#C5A572]">PÂTISSERIE</div></div>
          </div>
          <nav className="hidden md:flex gap-8 text-sm">
            <button onClick={()=>setView('home')} className={view==='home'?'text-[#C5A572] font-semibold':''}>Accueil</button>
            <button onClick={()=>setView('boutique')} className={view==='boutique'?'text-[#C5A572] font-semibold':''}>Boutique</button>
            <button onClick={()=>window.scrollTo(0,document.body.scrollHeight)} className="">Contact</button>
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={()=>setView('cart')} className="relative px-4 py-2 rounded-full bg-[#2C1810] text-[#FFFBF7] text-sm">Panier ({cart.reduce((a,b)=>a+b.qty,0)})</button>
          </div>
        </div>
      </header>

      {view==='home' && (
        <div>
          <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-[#F8C8C0]/50 text-xs text-[#2C1810] mb-4">Fait maison • Tlemcen</div>
              <h1 className="serif text-4xl md:text-6xl leading-[0.9] font-bold">SweeTy —<br/>Le plaisir à<br/><span className="text-[#C5A572]">chaque bouchée.</span></h1>
              <p className="mt-6 text-[#2C1810]/60 max-w-lg">Pâtisseries, douceurs et café préparés pour vos plus beaux moments. Commande WhatsApp, retrait ou livraison.</p>
              <div className="mt-8 flex gap-3">
                <button onClick={()=>setView('boutique')} className="px-7 py-3 rounded-full bg-[#2C1810] text-white font-medium">Découvrir la boutique</button>
                <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" className="px-7 py-3 rounded-full border border-[#2C1810] font-medium">WhatsApp</a>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-6 text-sm">
                <div><div className="font-bold text-2xl serif">100%</div><div className="text-black/50">Fait maison</div></div>
                <div><div className="font-bold text-2xl serif">07h30-22h</div><div className="text-black/50">Ouvert 7j/7</div></div>
                <div><div className="font-bold text-2xl serif">DZD</div><div className="text-black/50">Paiement à la livraison</div></div>
              </div>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800" className="rounded-[32px] shadow-2xl w-full h-[520px] object-cover" />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl flex gap-3 items-center">
                <img src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=100" className="w-12 h-12 rounded-xl object-cover" />
                <div><div className="text-sm font-semibold">Croissant pur beurre</div><div className="text-xs text-black/50">Dès 120 DZD</div></div>
              </div>
            </div>
          </section>

          <section className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <h2 className="serif text-3xl mb-8">Catégories</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {cats.map(c=>(
                  <button key={c.id} onClick={()=>{setCatFilter(c.name); setView('boutique')}} className="group text-left rounded-2xl overflow-hidden border border-black/5 hover:border-[#C5A572] transition">
                    <img src={c.image} className="w-full h-24 object-cover group-hover:scale-105 transition" />
                    <div className="p-3 text-sm font-medium">{c.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="serif text-3xl">Produits vedettes</h2>
              <button onClick={()=>setView('boutique')} className="text-sm underline">Voir tout</button>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              {products.filter(p=>p.featured).slice(0,4).map(p=>(
                <div key={p.id} className="rounded-[20px] bg-white border border-black/5 overflow-hidden">
                  <img src={p.images[0]} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <div className="text-sm font-semibold">{p.name}</div>
                    <div className="text-xs text-black/50">{p.category}</div>
                    <div className="mt-2 flex justify-between items-center">
                      <div className="font-bold">{p.promoPrice? <><span className="text-[#C5A572]">{p.promoPrice} DZD</span> <span className="line-through text-xs text-black/30">{p.price}</span></> : `${p.price} DZD`}</div>
                      <button onClick={()=>addToCart(p)} className="w-8 h-8 rounded-full bg-[#2C1810] text-white">+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {view==='boutique' && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="flex flex-wrap gap-3 mb-6">
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher..." className="px-4 py-2.5 rounded-full border border-black/10 bg-white text-sm flex-1 max-w-md outline-none focus:border-[#C5A572]" />
            <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} className="px-4 py-2.5 rounded-full border border-black/10 bg-white text-sm">
              <option value="">Toutes catégories</option>
              {cats.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {filtered.map(p=>(
              <div key={p.id} className="rounded-[20px] bg-white border border-black/5 overflow-hidden">
                <img src={p.images[0]} className="w-full h-48 object-cover cursor-pointer" onClick={()=>{setSelected(p); setView('product')}} />
                <div className="p-4">
                  <div className="text-sm font-semibold">{p.name}</div>
                  <div className="text-xs text-black/50 mb-2">{p.unit}{p.weightOptions? ' • au kg':''}</div>
                  {p.unit==='kg' && (
                    <div className="flex gap-1 mb-3">
                      {p.weightOptions.map(w=>(
                        <button key={w} onClick={()=>setWeightSel({...weightSel,[p.id]:w})} className={`text-[11px] px-2 py-1 rounded-full border ${weightSel[p.id]===w?'bg-[#2C1810] text-white':'bg-white'}`}>{w}g</button>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-sm">{p.unit==='kg' && weightSel[p.id] ? Math.round(p.price*weightSel[p.id]/1000) : (p.promoPrice||p.price)} DZD</div>
                    <button onClick={()=>addToCart(p,1, p.unit==='kg'?weightSel[p.id]||500 : null)} className="px-3 py-1.5 rounded-full bg-[#2C1810] text-white text-xs">Ajouter</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view==='product' && selected && (
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 grid md:grid-cols-2 gap-10">
          <img src={selected.images[0]} className="w-full h-[500px] object-cover rounded-[24px]" />
          <div>
            <button onClick={()=>setView('boutique')} className="text-sm mb-4">← Retour</button>
            <h1 className="serif text-4xl font-bold">{selected.name}</h1>
            <p className="text-black/50 mt-2">{selected.category}</p>
            <p className="mt-6 text-black/70">{selected.desc}</p>
            <div className="mt-6 text-2xl font-bold">{selected.promoPrice? <><span className="text-[#C5A572]">{selected.promoPrice} DZD</span> <span className="line-through text-sm text-black/30">{selected.price}</span></> : `${selected.price} DZD`}<span className="text-sm font-normal text-black/50"> / {selected.unit}</span></div>
            <button onClick={()=>{addToCart(selected); setView('cart')}} className="mt-8 w-full py-3 rounded-full bg-[#2C1810] text-white font-medium">Ajouter au panier</button>
          </div>
        </div>
      )}

      {view==='cart' && (
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="serif text-3xl mb-6">Panier ({cart.length})</h2>
            {cart.length===0 ? <div className="py-12 text-center text-black/40">Panier vide — ajoutez des douceurs !</div> :
              <div className="space-y-3">
                {cart.map(i=>(
                  <div key={i.cartId} className="flex gap-4 p-3 rounded-2xl bg-white border border-black/5">
                    <img src={i.image} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{i.name} {i.weight?`(${i.weight}g)`:''}</div>
                      <div className="text-xs text-black/50">{i.price} DZD × {i.qty}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={()=>setCart(cart.map(x=>x.cartId===i.cartId?{...x,qty:Math.max(1,x.qty-1)}:x))} className="w-7 h-7 rounded-full bg-black/5">-</button>
                      <span className="text-sm">{i.qty}</span>
                      <button onClick={()=>setCart(cart.map(x=>x.cartId===i.cartId?{...x,qty:x.qty+1}:x))} className="w-7 h-7 rounded-full bg-black/5">+</button>
                      <button onClick={()=>setCart(cart.filter(x=>x.cartId!==i.cartId))} className="ml-2 text-xs text-red-400">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>
          <div className="rounded-[24px] bg-white border border-black/5 p-6 h-fit sticky top-24">
            <h3 className="font-semibold mb-4">Détails de commande</h3>
            <div className="space-y-3">
              <input value={checkout.name} onChange={e=>setCheckout({...checkout,name:e.target.value})} placeholder="Nom complet*" className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-sm outline-none focus:border-[#C5A572]" />
              <input value={checkout.phone} onChange={e=>setCheckout({...checkout,phone:e.target.value})} placeholder="Téléphone*" className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-sm outline-none focus:border-[#C5A572]" />
              <div className="flex gap-2">
                <label className={`flex-1 px-4 py-2.5 rounded-xl border text-sm cursor-pointer ${checkout.mode==='retrait'?'bg-[#2C1810] text-white':'bg-white'}`}><input type="radio" checked={checkout.mode==='retrait'} onChange={()=>setCheckout({...checkout,mode:'retrait'})} className="hidden" /> Retrait magasin</label>
                <label className={`flex-1 px-4 py-2.5 rounded-xl border text-sm cursor-pointer ${checkout.mode==='livraison'?'bg-[#2C1810] text-white':'bg-white'}`}><input type="radio" checked={checkout.mode==='livraison'} onChange={()=>setCheckout({...checkout,mode:'livraison'})} className="hidden" /> Livraison</label>
              </div>
              {checkout.mode==='livraison' && <input value={checkout.address} onChange={e=>setCheckout({...checkout,address:e.target.value})} placeholder="Adresse complète*" className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-sm outline-none" />}
              <textarea value={checkout.notes} onChange={e=>setCheckout({...checkout,notes:e.target.value})} placeholder="Instructions (sans noix, etc.)" rows="3" className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-sm outline-none"></textarea>
              <div className="pt-4 border-t space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-black/50">Sous-total</span><span>{cartTotal} DZD</span></div>
                <div className="flex justify-between"><span className="text-black/50">Livraison</span><span>{checkout.mode==='livraison'?settings.deliveryFee:0} DZD</span></div>
                <div className="flex justify-between font-bold text-base pt-2"><span>Total</span><span>{totalWithDelivery} DZD</span></div>
              </div>
              <button onClick={handleWhatsApp} className="w-full py-3 rounded-full bg-[#25D366] text-white font-semibold">Commander via WhatsApp</button>
              <div className="text-[11px] text-black/40 text-center">Paiement à la livraison • Min {settings.minOrder} DZD</div>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-20 border-t border-black/5 py-10 text-center text-xs text-black/40">
        SweeTy • {settings.address} • {settings.phone} • WhatsApp {settings.whatsapp} • Ouvert {settings.hours?.lundi}
      </footer>

      {toast && <div className="fixed bottom-4 right-4 bg-[#2C1810] text-white px-4 py-3 rounded-xl text-sm shadow-xl z-50">{toast}</div>}
    </div>
  )
}
