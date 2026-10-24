
export const LS = {
  products: 'sweeTy_products',
  cats: 'sweeTy_categories',
  settings: 'sweeTy_settings',
  orders: 'sweeTy_orders',
  cart: 'sweeTy_cart',
  testi: 'sweeTy_testimonials',
  token: 'sweeTy_admin_token',
  hash: 'sweeTy_admin_hash'
};
export function getJSON(k,f){try{const v=localStorage.getItem(k);return v?JSON.parse(v):f;}catch{return f;}}
export function setJSON(k,v){localStorage.setItem(k,JSON.stringify(v));}
export function initIfNeeded(seed){
  if(!localStorage.getItem(LS.products)) setJSON(LS.products, seed.products);
  if(!localStorage.getItem(LS.cats)) setJSON(LS.cats, seed.cats);
  if(!localStorage.getItem(LS.settings)) setJSON(LS.settings, seed.settings);
  if(!localStorage.getItem(LS.orders)) setJSON(LS.orders, []);
  if(!localStorage.getItem(LS.testi)) setJSON(LS.testi, seed.testimonials);
  if(!localStorage.getItem(LS.hash)) localStorage.setItem(LS.hash, btoa('SweeTy092026'));
}
