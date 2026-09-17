# 🚀 Guide Configuration Google Analytics 4 - Étape par Étape

**Temps estimé: 5-10 minutes**

## ✅ Prérequis
- Un compte Google (Gmail)
- Accès au code source du projet (déjà fait ✓)

---

## 📋 ÉTAPE 1: Créer une propriété GA4 (si pas déjà fait)

### 1.1 Aller sur Google Analytics
🔗 **https://analytics.google.com**

### 1.2 Se connecter
- Utilisez votre compte Google

### 1.3 Créer une propriété (si nécessaire)
1. Cliquez sur **"Admin"** (⚙️ en bas à gauche)
2. Colonne "Compte" → Cliquez sur **"Créer un compte"** (ou sélectionnez un compte existant)
3. Nom du compte: `Conciergeries France` (ou autre)
4. Cliquez **"Suivant"**

### 1.4 Configurer la propriété
1. Nom de la propriété: `ma-conciergerie-annuaire.com`
2. Fuseau horaire: `(GMT+01:00) Paris`
3. Devise: `Euro (EUR)`
4. Cliquez **"Suivant"**

### 1.5 Informations sur l'entreprise
1. Secteur: `Immobilier` ou `Services`
2. Taille: Sélectionnez votre taille
3. Usage: Cochez les cases pertinentes
4. Cliquez **"Créer"**
5. Acceptez les conditions

---

## 📊 ÉTAPE 2: Créer un flux de données Web

### 2.1 Ajouter un flux de données
1. Après création, vous êtes sur "Configuration du flux de données"
2. Sélectionnez **"Web"** (🌐)

### 2.2 Configurer le flux Web
1. **URL du site Web**: `https://ma-conciergerie-annuaire.com`
2. **Nom du flux**: `Site Web Principal`
3. Cliquez **"Créer un flux"**

### 2.3 Copier le Measurement ID ⭐ **IMPORTANT**
1. Vous voyez maintenant les "Détails du flux de données Web"
2. En haut à droite, vous voyez **"ID de mesure"**
3. Format: `G-XXXXXXXXXX` (10 caractères après G-)
4. 📋 **COPIEZ ce code** - vous en aurez besoin!

**Exemple**: `G-1A2B3C4D5E`

---

## 🔧 ÉTAPE 3: Configurer le projet (LOCAL)

### 3.1 Créer le fichier .env.local
Dans le dossier racine du projet, créez un fichier `.env.local`:

```bash
# Dans le terminal à la racine du projet
touch .env.local
```

### 3.2 Ajouter le Measurement ID
Ouvrez `.env.local` et ajoutez:

```env
VITE_GA_MEASUREMENT_ID=G-VOTRE-ID-ICI
```

⚠️ **Remplacez `G-VOTRE-ID-ICI` par votre vrai ID copié à l'étape 2.3**

**Exemple**:
```env
VITE_GA_MEASUREMENT_ID=G-1A2B3C4D5E
```

### 3.3 Tester en local
```bash
npm run dev
```

1. Ouvrez http://localhost:5173 (ou le port affiché)
2. Ouvrez la **Console** (F12)
3. Vous devriez voir:
   ```
   [Analytics] Event tracked: view_directory
   ```

---

## ☁️ ÉTAPE 4: Déployer sur Vercel

### 4.1 Aller sur Vercel
🔗 **https://vercel.com/dashboard**

### 4.2 Sélectionner votre projet
- Trouvez le projet `conciergeries` (ou son nom)

### 4.3 Ajouter la variable d'environnement
1. Cliquez sur **"Settings"** (⚙️)
2. Menu de gauche → **"Environment Variables"**
3. Cliquez **"Add New"**
4. Remplissez:
   - **Key**: `VITE_GA_MEASUREMENT_ID`
   - **Value**: `G-VOTRE-ID-ICI` (votre vrai ID)
   - **Environments**: Cochez **Production**, **Preview**, **Development**
5. Cliquez **"Save"**

### 4.4 Redéployer
1. Onglet **"Deployments"**
2. Cliquez sur les **3 points** (...) du dernier déploiement
3. Cliquez **"Redeploy"**
4. Attendez 2-3 minutes

---

## 🎯 ÉTAPE 5: Configurer les conversions dans GA4

### 5.1 Retourner sur Google Analytics
🔗 **https://analytics.google.com**

### 5.2 Aller dans Admin → Events
1. Cliquez sur **"Admin"** (⚙️ en bas à gauche)
2. Colonne "Propriété" → **"Events"** (Événements)
3. Patientez quelques heures pour que les événements apparaissent

### 5.3 Marquer les conversions ⭐
Une fois que les événements apparaissent dans la liste:

1. Trouvez **`quote_submit`**
   - Cliquez sur le toggle à droite → **"Marquer comme conversion"**
   
2. Trouvez **`pms_signup`**
   - Cliquez sur le toggle à droite → **"Marquer comme conversion"**
   
3. Trouvez **`pms_purchase`**
   - Cliquez sur le toggle à droite → **"Marquer comme conversion"**
   
4. Trouvez **`click_website`**
   - Cliquez sur le toggle à droite → **"Marquer comme conversion"**

⏰ **Note**: Les événements n'apparaissent qu'après avoir reçu au moins 1 occurrence. Naviguez sur le site pour les générer!

---

## 🔍 ÉTAPE 6: Vérifier que tout fonctionne

### 6.1 Vérification en temps réel
1. Google Analytics → **"Reports"** → **"Realtime"** (Temps réel)
2. Ouvrez votre site en production dans un autre onglet
3. Naviguez sur le site
4. Vous devriez voir:
   - Utilisateurs actifs: 1 (vous)
   - Événements qui s'affichent en temps réel

### 6.2 Événements à tester

| Action sur le site | Événement GA4 attendu |
|--------------------|-----------------------|
| Ouvrir la page `/conciergeries` | `view_directory` |
| Ouvrir une fiche conciergerie | `view_listing` |
| Rechercher une ville | `search_directory` |
| Cliquer sur un téléphone | `click_phone` |
| Cliquer sur un email | `click_email` |
| Cliquer sur "Visiter le site" | `click_website` |
| Soumettre le formulaire devis | `quote_submit` |
| Ouvrir la page PMS | `pms_view` |

### 6.3 Vérification console navigateur
1. Ouvrez votre site en production
2. F12 → Console
3. Tapez: `dataLayer`
4. Vous devriez voir un tableau avec tous les événements

---

## 🎯 ÉTAPE 7: Lier Google Search Console (BONUS)

### 7.1 Aller dans GA4 Admin
1. **Admin** → Colonne "Propriété" → **"Associations Search Console"**
2. Cliquez **"Associer"**
3. Sélectionnez votre propriété Search Console
4. Cliquez **"Suivant"** puis **"Envoyer"**

**Avantages**:
- Voir les requêtes de recherche Google
- Corréler le trafic organique avec les conversions
- Données SEO enrichies

---

## ✅ Checklist finale

Cochez quand c'est fait:

- [ ] Propriété GA4 créée
- [ ] Flux de données Web configuré
- [ ] Measurement ID copié (format `G-XXXXXXXXXX`)
- [ ] `.env.local` créé avec le Measurement ID
- [ ] Test en local réussi (console montre les événements)
- [ ] Variable d'environnement ajoutée sur Vercel
- [ ] Site redéployé sur Vercel
- [ ] Vérification temps réel dans GA4 (au moins 1 événement)
- [ ] 4 conversions configurées (`quote_submit`, `pms_signup`, `pms_purchase`, `click_website`)
- [ ] (Bonus) Search Console lié

---

## 🆘 Dépannage

### ❌ Problème: "Les événements n'apparaissent pas dans GA4"

**Solutions**:
1. Vérifier que le Measurement ID est correct (format `G-XXXXXXXXXX`)
2. Attendre 24-48h pour les rapports standards
3. Utiliser le rapport **"Temps réel"** pour voir immédiatement
4. Vérifier la console navigateur pour les erreurs

### ❌ Problème: "GA4 ne se charge pas"

**Solutions**:
1. Vérifier dans la console navigateur: `window.gtag` doit être une fonction
2. Vérifier l'onglet Network: doit charger `gtag/js?id=G-...`
3. Vérifier que la variable d'environnement est bien définie sur Vercel
4. Redéployer le site

### ❌ Problème: "Les conversions n'apparaissent pas"

**Solutions**:
1. S'assurer que l'événement a été déclenché au moins une fois
2. Attendre quelques heures
3. Vérifier dans Admin → Events que l'événement existe

---

## 📞 Besoin d'aide?

Si vous bloquez sur une étape:
1. Faites une capture d'écran
2. Notez à quelle étape vous êtes
3. Décrivez l'erreur exacte

---

## 🎉 Félicitations!

Une fois toutes les étapes complétées, votre tracking GA4 est **100% opérationnel** et vous pourrez:

✅ Voir tous les visiteurs en temps réel
✅ Tracker les conversions (devis, inscriptions, achats)
✅ Analyser les sources de trafic
✅ Optimiser votre SEO et acquisition
✅ Mesurer le ROI de vos actions marketing

**Temps total: ~10 minutes**
