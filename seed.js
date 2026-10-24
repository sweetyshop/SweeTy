
export const seedCategories = [
  {id:'1',name:'Gâteaux secs',image:'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400'},
  {id:'2',name:'Viennoiseries',image:'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'},
  {id:'3',name:'Pâtisseries',image:'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400'},
  {id:'4',name:'Gâteaux et desserts',image:'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400'},
  {id:'5',name:'Café et boissons chaudes',image:'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400'},
  {id:'6',name:'Jus et boissons fraîches',image:'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400'},
  {id:'7',name:'Promotions',image:'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400'},
];
export const seedProducts = [
  {id:'p1',name:'Makrout au Miel',desc:'Makrout traditionnel miel pur fondant cannelle.',category:'Gâteaux secs',images:['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800'],price:2200,unit:'kg',weightOptions:[250,500,750,1000],availability:'disponible',stock:12,featured:true,nouveau:false,createdAt:Date.now()},
  {id:'p2',name:'Ghribia aux Amandes',desc:'Sables fondants amandes.',category:'Gâteaux secs',images:['https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800'],price:1800,unit:'kg',weightOptions:[250,500,750,1000],availability:'disponible',stock:8,featured:true,nouveau:true,createdAt:Date.now()},
  {id:'p5',name:'Croissant Pur Beurre',desc:'Feuilletage 48h pur beurre AOP.',category:'Viennoiseries',images:['https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800'],price:120,unit:'piece',availability:'disponible',stock:30,featured:true,nouveau:false,createdAt:Date.now()},
  {id:'p7',name:'Mille-Feuille Vanille',desc:'Pate caramelisee creme diplomate.',category:'Pâtisseries',images:['https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800'],price:280,unit:'piece',availability:'disponible',stock:12,featured:true,nouveau:false,createdAt:Date.now()},
  {id:'p13',name:'Box Decouverte',desc:'Best-sellers 1kg cadeau ideal.',category:'Promotions',images:['https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800'],price:3500,promoPrice:2800,unit:'boite',availability:'disponible',stock:7,featured:true,nouveau:true,createdAt:Date.now()},
];
export const seedSettings = {
  shopName:'SweeTy',whatsapp:'213665826284',phone:'0776380744',address:'Tlemcen, Algerie',
  deliveryFee:200,minOrder:500,banner:'Livraison gratuite des 3000 DZD',
  hours:{lundi:'07h30-22h00',mardi:'07h30-22h00',mercredi:'07h30-22h00',jeudi:'07h30-22h00',vendredi:'07h30-22h00',samedi:'07h30-22h00',dimanche:'08h00-22h00'}
};
export const seedTestimonials = [
  {id:'t1',name:'Amira B.',text:'Meilleurs makrout de Tlemcen !',note:5},
  {id:'t2',name:'Karim L.',text:'Croissants dignes de Paris.',note:5},
  {id:'t3',name:'Nour H.',text:'Box parfaite pour l Aid.',note:5}
];
