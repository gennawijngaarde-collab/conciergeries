# Guide de Configuration des Connecteurs HRIS

Ce guide explique comment configurer les connecteurs HRIS français dans **HR SyncGuard AI**.

## 📋 Connecteurs Disponibles

| HRIS | Région | Statut | Type d'authentification |
|------|--------|--------|------------------------|
| **Lucca** | 🇫🇷 France | ✅ Production | API Key + OAuth 2.0 |
| **Cegid** | 🇫🇷 France | ✅ Production | OAuth 2.0 |
| **Silae** | 🇫🇷 France | ✅ Production | API Key |
| **Sage** | 🌍 Global | ✅ Production | OAuth 2.0 |

---

## 1️⃣ Lucca

### Prérequis
- Compte administrateur Lucca
- Accès à l'interface de développement Lucca

### Configuration

#### Étape 1 : Obtenir les identifiants API

1. Connectez-vous à votre instance Lucca : `https://[votre-entreprise].ilucca.net`
2. Allez dans **Organisation > API**
3. Créez une nouvelle application
4. Notez :
   - **Domaine** : `[votre-entreprise].ilucca.net`
   - **Token API** : Le token généré

#### Étape 2 : Configurer les webhooks (optionnel)

1. Dans l'interface API Lucca, créez un webhook
2. URL de destination : `https://[votre-instance].hr-syncguard.ai/api/webhooks/hris/lucca`
3. Événements à surveiller :
   - `user.created`
   - `user.updated`
   - `user.terminated`
4. Notez le **secret webhook**

#### Étape 3 : Configuration dans HR SyncGuard AI

```json
{
  "systemName": "lucca",
  "settings": {
    "domain": "votre-entreprise.ilucca.net",
    "apiToken": "votre_token_api_lucca",
    "webhookSecret": "votre_secret_webhook"
  }
}
```

### Permissions requises
- `users:read` - Lecture des employés
- `users:write` - Mise à jour des employés (si nécessaire)
- `departments:read` - Lecture des départements
- `webhooks:receive` - Réception des webhooks

### Limites de l'API
- **Rate limit** : 100 requêtes/minute
- **Pagination** : Max 100 résultats par page

---

## 2️⃣ Cegid (Talentsoft)

### Prérequis
- Compte administrateur Cegid
- Accès au portail développeur Cegid

### Configuration

#### Étape 1 : Créer une application OAuth

1. Connectez-vous au portail développeur : `https://developers.cegid.com`
2. Créez une nouvelle application
3. Notez :
   - **Client ID** : ID de votre application
   - **Client Secret** : Secret de votre application
   - **Tenant Code** : Code de votre entreprise

#### Étape 2 : Configurer les redirections et scopes

**Scopes requis :**
- `api.read` - Lecture des données RH
- `api.write` - Écriture des données (si nécessaire)
- `employees.read` - Accès aux employés
- `employees.events` - Réception des événements

**Redirect URL :**
```
https://[votre-instance].hr-syncguard.ai/oauth/callback/cegid
```

#### Étape 3 : Configuration dans HR SyncGuard AI

```json
{
  "systemName": "cegid",
  "settings": {
    "instanceUrl": "https://votre-entreprise.cegid.cloud",
    "clientId": "votre_client_id",
    "clientSecret": "votre_client_secret",
    "tenantCode": "COMPANY001",
    "webhookSecret": "votre_secret_webhook"
  }
}
```

### Webhooks supportés
- `EMPLOYEE_HIRED` - Nouvelle embauche
- `EMPLOYEE_TERMINATED` - Départ
- `EMPLOYEE_TRANSFER` - Mutation/mobilité
- `EMPLOYEE_PROMOTION` - Promotion

### Limites de l'API
- **Rate limit** : 200 requêtes/minute
- **Token expiration** : 1 heure (renouvellement automatique)
- **Pagination** : Spring Data pagination (taille max : 100)

---

## 3️⃣ Silae

### Prérequis
- Accès administrateur Silae
- Dossier de paie configuré

### Configuration

#### Étape 1 : Obtenir la clé API

1. Connectez-vous à votre espace Silae
2. Allez dans **Paramètres > API**
3. Générez une clé API
4. Notez :
   - **Code dossier** : Code de votre dossier de paie (ex: `DOSS001`)
   - **Clé API** : La clé générée

#### Étape 2 : Configuration dans HR SyncGuard AI

```json
{
  "systemName": "silae",
  "settings": {
    "apiUrl": "https://api.silae.fr/v1",
    "apiKey": "votre_cle_api_silae",
    "dossierCode": "DOSS001",
    "webhookSecret": "votre_secret_webhook"
  }
}
```

### Endpoints utilisés
- `GET /dossiers/{code}/employes` - Liste des employés
- `GET /dossiers/{code}/employes/{matricule}` - Détails d'un employé
- `POST /webhooks` - Réception des événements

### Événements supportés
- `EMBAUCHE` - Nouvelle embauche
- `SORTIE` - Départ d'un employé
- `MODIFICATION` - Modification des données

### Limites de l'API
- **Rate limit** : 60 requêtes/minute
- **Format** : JSON ou XML (HR SyncGuard utilise JSON)

---

## 4️⃣ Sage HR

### Prérequis
- Compte administrateur Sage HR
- Accès au Developer Portal Sage

### Configuration

#### Étape 1 : Créer une application OAuth 2.0

1. Connectez-vous au portail développeur : `https://developers.sage.com`
2. Créez une nouvelle application
3. Configurez les permissions :
   - `employees:read`
   - `employees:write`
   - `webhooks:subscribe`
4. Notez :
   - **Client ID**
   - **Client Secret**
   - **Company ID**

#### Étape 2 : Configuration dans HR SyncGuard AI

```json
{
  "systemName": "sage",
  "settings": {
    "apiUrl": "https://api.sage.hr/v2.0",
    "clientId": "votre_client_id",
    "clientSecret": "votre_client_secret",
    "companyId": "12345",
    "webhookSecret": "votre_secret_webhook"
  }
}
```

### Webhooks supportés
- `employee.hired` - Nouvelle embauche
- `employee.terminated` - Départ
- `employee.updated` - Mise à jour (incluant mutations)

### Limites de l'API
- **Rate limit** : 300 requêtes/minute
- **Token expiration** : 1 heure
- **Pagination** : Max 100 résultats par page

---

## 🔐 Sécurité

### Stockage des credentials

Les identifiants sont **chiffrés au repos** dans la base de données :

```typescript
interface EncryptedCredentials {
  encrypted: string;  // Données chiffrées (AES-256-GCM)
  iv: string;         // Initialization vector
  authTag: string;    // Tag d'authentification
}
```

### Validation des webhooks

Pour chaque webhook reçu, HR SyncGuard AI :
1. ✅ Vérifie la signature HMAC
2. ✅ Valide le format de la payload
3. ✅ Vérifie que le tenant correspond
4. ✅ Enregistre l'événement dans les audit logs

### Permissions recommandées

**Principe du moindre privilège** :
- ✅ Lecture seule sur les données employés
- ✅ Pas d'accès aux données de paie sensibles
- ✅ Utiliser des comptes de service dédiés
- ✅ Rotation régulière des clés API

---

## 🧪 Test de connexion

### Via l'API HR SyncGuard AI

```bash
POST /api/connectors/validate
Content-Type: application/json

{
  "systemName": "lucca",
  "settings": {
    "domain": "demo.ilucca.net",
    "apiToken": "test_token"
  }
}
```

**Réponse attendue :**
```json
{
  "valid": true,
  "status": "healthy",
  "latency": 145,
  "message": "Connected to Lucca API",
  "employeeCount": 250
}
```

### Health check automatique

HR SyncGuard AI vérifie automatiquement l'état de chaque connecteur :
- ⏱️ Toutes les 5 minutes
- 📊 Latence mesurée
- 🚨 Alertes si dégradation ou panne

---

## 📊 Mapping des données

### Types de contrat

| HRIS Source | HR SyncGuard AI |
|-------------|-----------------|
| CDI (FR) | `permanent` |
| CDD (FR) | `fixed_term` |
| Stage (FR) | `internship` |
| Apprentissage (FR) | `internship` |
| Freelance | `freelance` |

### Statuts d'emploi

| HRIS Source | HR SyncGuard AI |
|-------------|-----------------|
| Actif | `active` |
| Sorti / Terminé | `terminated` |
| Suspendu | `suspended` |
| En congé | `on_leave` |

---

## 🆘 Dépannage

### Erreur : "Impossible de se connecter"

**Solutions :**
1. Vérifiez que les credentials sont corrects
2. Vérifiez que l'URL de l'instance est correcte
3. Vérifiez que l'IP de HR SyncGuard AI est autorisée
4. Consultez les logs : `/api/connectors/{id}/logs`

### Erreur : "Token expiré"

**Solutions :**
1. Le renouvellement est automatique pour OAuth 2.0
2. Pour les API Keys, regénérez la clé dans le HRIS source
3. Mettez à jour la configuration dans HR SyncGuard AI

### Webhooks non reçus

**Solutions :**
1. Vérifiez que l'URL webhook est accessible publiquement
2. Vérifiez que le secret webhook est correct
3. Consultez les logs de webhook dans le HRIS source
4. Testez manuellement : `POST /api/webhooks/test`

---

## 📞 Support

**Documentation :**
- Lucca : https://developers.lucca.fr/
- Cegid : https://developers.cegid.com/
- Silae : https://www.silae.fr/documentation-api
- Sage : https://developers.sage.com/

**Contact HR SyncGuard AI :**
- support@hr-syncguard.ai
- Documentation : https://docs.hr-syncguard.ai
