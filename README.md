# SweeTy - Pâtisserie de Luxe | Boutique + Admin

Boutique e-commerce luxe 2 fichiers séparés prête pour GitHub et Netlify.

## Structure
- `index.html` -> Boutique Client (SweeTy Client)
- `admin.html` -> Espace Admin (SweeTy Admin)
- `src/shared` -> localStorage partagé (même base)
- `src/client` -> App client luxe FR + WhatsApp
- `src/admin` -> Dashboard admin sécurisé

## Identifiants Admin
- ID: `0776380744`
- MDP: `SweeTy092026`
- WhatsApp configurable dans Paramètres -> 213665826284

## Déploiement Netlify (1 clic)

### Option A: Depuis GitHub (recommandé)
1. Crée un repo GitHub : `sweety-shop`
2. Push ce dossier :
```bash
git init
git add .
git commit -m "SweeTy initial"
git branch -M main
git remote add origin https://github.com/TON_USER/sweety-shop.git
git push -u origin main
```
3. Va sur https://app.netlify.com/start
4. Import from Git -> choisis `sweety-shop`
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Deploy ! 
   - Client: `https://ton-site.netlify.app/`
   - Admin: `https://ton-site.netlify.app/admin.html`

### Option B: Drag & Drop direct
```bash
npm install
npm run build
```
Glisse le dossier `dist` sur https://app.netlify.com/drop

## Local dev
```bash
npm install
npm run dev
# Client: http://localhost:5173/
# Admin: http://localhost:5173/admin.html
```

## Base de données
Actuellement localStorage (sweeTy_products, sweeTy_categories, sweeTy_settings, sweeTy_orders). 
Quand client et admin sont sur même domaine, les données sont partagées instantanément.

Pour passer en Firebase:
1. Crée projet Firebase
2. Remplace `src/shared/storage.js` par Firestore
3. Ajoute `.env` avec VITE_FIREBASE_...

## Personnalisation
- Couleurs: `tailwind.config.js`
- Logo: `src/client/App.jsx`
- Numéro WhatsApp: Admin > Paramètres
- Produits: Admin > Produits > Ajouter (upload depuis téléphone)

## Netlify Forms / Functions (optionnel)
Si tu veux recevoir commandes sans WhatsApp, ajoute Netlify Function dans `netlify/functions/order.js`