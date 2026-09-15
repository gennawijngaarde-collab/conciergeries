# 🇫🇷 Intégration des SIRH Français

## Vue d'ensemble

**HR SyncGuard AI** supporte maintenant **4 connecteurs HRIS français en production** :

| SIRH | Statut | Documentation | Type d'API |
|------|--------|--------------|------------|
| **Lucca** | ✅ Production | [Guide](https://developers.lucca.fr/) | REST + OAuth 2.0 |
| **Cegid (Talentsoft)** | ✅ Production | [Guide](https://developers.cegid.com/) | REST + OAuth 2.0 |
| **Silae** | ✅ Production | [Guide](https://www.silae.fr/documentation-api) | REST + API Key |
| **Sage HR** | ✅ Production | [Guide](https://developers.sage.com/) | REST + OAuth 2.0 |

---

## 📦 Fichiers créés

### Connecteurs HRIS

```
src/connectors/hris/
├── lucca/
│   └── lucca-connector.ts       # Connecteur Lucca (479 lignes)
├── cegid/
│   └── cegid-connector.ts       # Connecteur Cegid (481 lignes)
├── silae/
│   └── silae-connector.ts       # Connecteur Silae (364 lignes)
└── sage/
    └── sage-connector.ts        # Connecteur Sage (467 lignes)
```

### Registre et configuration

```
src/connectors/
├── connector-registry.ts        # Registre central des connecteurs
└── interfaces/
    └── hris-connector.interface.ts  # Interface standard
```

### Documentation

```
docs/
├── CONNECTOR_CONFIGURATION_GUIDE.md  # Guide de configuration détaillé
└── FRENCH_HRIS_INTEGRATION.md       # Ce document
```

### Interface utilisateur

```
src/app/(dashboard)/dashboard/connectors/
└── page.tsx                     # Page de gestion des connecteurs
```

---

## 🔌 Fonctionnalités par connecteur

### 1. Lucca

**Fonctionnalités :**
- ✅ Synchronisation des employés (pagination automatique)
- ✅ Webhooks en temps réel (`user.created`, `user.updated`, `user.terminated`)
- ✅ Health checks automatiques
- ✅ Support des types de contrats français (CDI, CDD, Stage, Apprenti)

**Configuration requise :**
```typescript
{
  domain: "mycompany.ilucca.net",
  apiToken: "lucca_token_xxx",
  webhookSecret: "secret_xxx"  // Optionnel
}
```

**Endpoints utilisés :**
- `GET /api/v3/users` - Liste des employés
- `GET /api/v3/users/{id}` - Détails d'un employé
- `POST /webhooks` - Réception des événements

### 2. Cegid (Talentsoft)

**Fonctionnalités :**
- ✅ OAuth 2.0 automatique avec refresh token
- ✅ Support multi-tenant (tenant code)
- ✅ Webhooks enrichis (`EMPLOYEE_HIRED`, `EMPLOYEE_TERMINATED`, `EMPLOYEE_TRANSFER`)
- ✅ Pagination Spring Data

**Configuration requise :**
```typescript
{
  instanceUrl: "https://mycompany.cegid.cloud",
  clientId: "client_xxx",
  clientSecret: "secret_xxx",
  tenantCode: "COMPANY001"
}
```

**Token management :**
- Expiration : 1 heure
- Renouvellement automatique 1 min avant expiration
- Gestion des erreurs OAuth

### 3. Silae

**Fonctionnalités :**
- ✅ API Key simple
- ✅ Support des dossiers de paie multiples
- ✅ Format JSON natif
- ✅ Webhooks de paie (`EMBAUCHE`, `SORTIE`, `MODIFICATION`)

**Configuration requise :**
```typescript
{
  apiUrl: "https://api.silae.fr/v1",  // Optionnel
  apiKey: "silae_key_xxx",
  dossierCode: "DOSS001"
}
```

**Particularités :**
- Matricule employé comme identifiant unique
- Support des numéros de sécurité sociale
- Données de paie disponibles (non synchronisées par défaut)

### 4. Sage HR

**Fonctionnalités :**
- ✅ OAuth 2.0 avec support refresh token
- ✅ API globale (multi-pays)
- ✅ Webhooks détaillés avec `changes` array
- ✅ Support des congés et absences

**Configuration requise :**
```typescript
{
  apiUrl: "https://api.sage.hr/v2.0",  // Optionnel
  clientId: "sage_client_xxx",
  clientSecret: "sage_secret_xxx",
  companyId: "12345"
}
```

**Webhooks avancés :**
- Détection automatique des changements de poste
- Support des dates effectives
- Raisons de départ trackées

---

## 🔄 Mapping des données

### Types de contrats français

| HRIS | CDI | CDD | Stage | Apprentissage | Freelance |
|------|-----|-----|-------|---------------|-----------|
| **Universel** | `permanent` | `fixed_term` | `internship` | `internship` | `freelance` |
| **Lucca** | CDI | CDD | Stage | Apprenti | Freelance |
| **Cegid** | CDI | CDD | Stage | Alternance | Freelance |
| **Silae** | CDI | CDD | Stage | Apprentissage | Freelance |
| **Sage** | permanent | fixed_term | internship | internship | freelance |

### Statuts d'emploi

| Statut source | Statut universel |
|---------------|------------------|
| Actif / Active | `active` |
| Sorti / Terminated | `terminated` |
| Suspendu / Suspended | `suspended` |
| En congé / On Leave | `on_leave` |

---

## 🚀 Utilisation

### Instancier un connecteur

```typescript
import { createHRISConnector } from '@/connectors/connector-registry';

// Créer un connecteur Lucca
const luccaConnector = createHRISConnector('lucca');

// Configurer
await luccaConnector.configure({
  tenantId: 'tenant_123',
  credentials: encryptedCredentials,
  settings: {
    domain: 'mycompany.ilucca.net',
    apiToken: process.env.LUCCA_API_TOKEN,
  }
});

// Synchroniser les employés
const employees = await luccaConnector.syncEmployees();
console.log(`${employees.length} employés synchronisés`);
```

### Traiter un webhook

```typescript
// Dans votre route API Next.js
export async function POST(request: Request) {
  const payload = await request.json();
  const signature = request.headers.get('X-Signature');
  
  const connector = createHRISConnector('lucca');
  await connector.configure(config);
  
  // Valider et traiter
  if (connector.validateWebhookSignature(payload, signature)) {
    const event = await connector.handleWebhook(payload);
    if (event) {
      // Traiter l'événement
      await processEvent(event);
    }
  }
  
  return Response.json({ received: true });
}
```

### Obtenir les connecteurs français

```typescript
import { getFrenchConnectors } from '@/connectors/connector-registry';

const frenchConnectors = getFrenchConnectors();
// Retourne : [Lucca, Cegid, Silae]
```

---

## 🎨 Interface utilisateur

### Page de gestion des connecteurs

URL : `/dashboard/connectors`

**Fonctionnalités :**
- 📊 Statistiques globales (connecteurs actifs, latence, santé)
- ✅ Liste des connecteurs configurés avec statut en temps réel
- ➕ Catalogue des connecteurs disponibles
- 🔧 Configuration visuelle (bouton "Connecter")
- 📖 Liens vers la documentation de chaque HRIS

**Captures d'écran :**
```
┌─────────────────────────────────────────────┐
│ Connecteurs actifs: 3                       │
│ Employés synchronisés: 250                  │
│ Latence moyenne: 109ms                      │
│ Santé globale: 100%                         │
└─────────────────────────────────────────────┘

Connecteurs configurés:
┌─────────────────────────────────────────────┐
│ 🟢 Lucca · 🇫🇷 France                       │
│ 250 employés · 145ms                        │
│ [Configurer] [Health Check]                │
└─────────────────────────────────────────────┘

Connecteurs français disponibles:
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Cegid        │ │ Silae        │ │ Sage HR      │
│ OAuth 2.0    │ │ API Key      │ │ OAuth 2.0    │
│ [Connecter]  │ │ [Connecter]  │ │ [Connecter]  │
└──────────────┘ └──────────────┘ └──────────────┘
```

---

## 🔐 Sécurité

### Chiffrement des credentials

Tous les identifiants sont chiffrés au repos :
- **Algorithm:** AES-256-GCM
- **Stockage:** PostgreSQL avec RLS
- **Rotation:** Supportée via l'UI

```typescript
interface EncryptedCredentials {
  encrypted: string;  // Données chiffrées
  iv: string;         // Initialization vector
  authTag: string;    // Tag d'authentification
}
```

### Validation des webhooks

Chaque webhook est validé :
1. ✅ Signature HMAC-SHA256
2. ✅ Format de payload
3. ✅ Tenant/Company ID
4. ✅ Timestamp (protection replay)

### Permissions

Configuration en lecture seule recommandée :
- ✅ `employees:read` (lecture)
- ❌ `employees:write` (écriture désactivée par défaut)
- ✅ `webhooks:receive` (webhooks)

---

## 📊 Monitoring

### Health checks automatiques

Fréquence : **Toutes les 5 minutes**

Métriques collectées :
- ✅ Statut (healthy / degraded / down)
- ⏱️ Latence API (ms)
- 📊 Nombre d'employés
- 📅 Dernière synchronisation

### Alertes

Déclenchées si :
- 🔴 Connecteur down > 5 min
- 🟠 Latence > 2000ms pendant 3 checks consécutifs
- 🟠 Échec de synchronisation

---

## 🧪 Tests

### Test de connexion

```bash
# Via l'API
curl -X POST https://your-instance/api/connectors/validate \
  -H "Content-Type: application/json" \
  -d '{
    "systemName": "lucca",
    "settings": {
      "domain": "demo.ilucca.net",
      "apiToken": "test_token"
    }
  }'
```

**Réponse attendue :**
```json
{
  "valid": true,
  "status": "healthy",
  "latency": 145,
  "message": "Connected to Lucca API",
  "warnings": []
}
```

### Tester les webhooks

```bash
# Lucca
curl -X POST https://your-instance/api/webhooks/hris/lucca \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "user.created",
    "user": { ... }
  }'
```

---

## 📞 Support technique

### Documentation officielle

- **Lucca:** https://developers.lucca.fr/
- **Cegid:** https://developers.cegid.com/
- **Silae:** https://www.silae.fr/documentation-api
- **Sage:** https://developers.sage.com/

### FAQ

**Q: Quel connecteur choisir ?**
R: Choisissez celui que vous utilisez actuellement. HR SyncGuard AI supporte les 4 principaux SIRH français.

**Q: Puis-je connecter plusieurs HRIS ?**
R: Non, un seul HRIS source par tenant. Mais vous pouvez avoir plusieurs systèmes d'actions.

**Q: Les données de paie sont-elles synchronisées ?**
R: Non, uniquement les données RH (employés, départements, postes). Les données sensibles de paie ne sont jamais synchronisées.

**Q: Quelle est la fréquence de synchronisation ?**
R: Temps réel via webhooks + synchronisation complète toutes les 24h.

---

## 🎯 Prochaines étapes

Pour connecter votre SIRH :

1. 📖 **Lire le guide de configuration** : `/docs/CONNECTOR_CONFIGURATION_GUIDE.md`
2. 🔑 **Obtenir vos identifiants API** depuis votre SIRH
3. 🔌 **Configurer le connecteur** via `/dashboard/connectors`
4. ✅ **Valider la connexion** avec le health check
5. 🎉 **Commencer à orchestrer** vos workflows RH/IT !

---

**Développé avec ❤️ pour les équipes RH françaises**
