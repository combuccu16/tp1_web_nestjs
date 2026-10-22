# NestJS – TP1 RT4 : Todo API

Projet réalisé en équipe dans le cadre du TP1 RT4 (NestJS) – année universitaire 2026 / 2027.
Sujet par **Aymen Sellaouti** : voir [topic.md](./topic.md).

---

## Les règles du jeu

1. Si l'on nous demande d'expliquer le code et qu'on le lit sans le comprendre, ce n'est pas notre code : la note est **0**.
2. Toujours **réfléchir avant** de coder ou de parler à l'IA.
3. Architecture cohérente, code propre, lisible et factorisé, design patterns appliqués : c'est un **devoir**.
4. La validation est un entretien : **chacun doit pouvoir expliquer tout le projet**, pas seulement sa partie.

---

## Règles de collaboration

1. **Ordre imposé** : chaque personne ne commence qu'après que la précédente ait terminé.
2. **Chacun ne touche qu'à ses propres fichiers.**
3. Seules exceptions (ajouts minimaux, uniquement après que le propriétaire ait fini) :
   - Ben Fraj enregistre TypeORM / `TodoModule` dans `app.module.ts` (une ligne, fichier d'Akram).
   - Alaa configure le `ValidationPipe` global dans `main.ts` (fichier d'Akram).
   - Akram ajoute sa route de stats dans `todo.controller.ts` / `todo.service.ts` **en tout dernier** (après Adab).
4. Chaque membre doit être capable d'expliquer **l'intégralité de son code** à la validation.

---

## Équipe et répartition

| Membre | Parties du TP | Résumé |
| --- | --- | --- |
| **Akram** | 1 + 7 | Setup, `CommonModule`, provider `uuid`, injection de dépendances, statistiques |
| **Ben Fraj** | 2 & 4 | TypeORM, `StatusEnum`, `TodoEntity`, champs de suivi, timestamps réutilisables |
| **Alaa** | 3 | Validation, messages d'erreurs centralisés, DTOs |
| **Ayachi** | 5 & 6 | CRUD (add / update / delete), soft delete, restore |
| **Adab** | 8 | Récupération, recherche, pagination |

---

## Akram – Mise en place et statistiques *(Parties 1 & 7)*

### Tâches
- [x] **A1** — Créer le projet NestJS (`nest new`) et pousser le squelette **en premier** (les autres en dépendent).
- [x] **A2** — Créer le module `CommonModule` :
  - [x] Le déclarer `@Global()` et l'exporter, car il sera utilisé partout.
  - [x] Provider la bibliothèque `uuid` avec le **bon type de provider** — pouvoir justifier le choix (`useFactory` vs `useValue` vs `useClass`).
- [x] **A3** — Créer un module et un service de test (`src/test-injection/`) pour démontrer l'injection de dépendance du provider `uuid`.
- [x] **A4** — **Statistiques** : endpoint qui renvoie, en **une seule requête SQL** (`COUNT ... GROUP BY`), le nombre de todos pour chacun des trois statuts — en incluant aussi les statuts à 0.

### Fichiers
`package.json`, `tsconfig.json`, `nest-cli.json`, `src/main.ts`, `src/app.module.ts`, `src/common/**` (hors `entities/` et `messages/`), `src/test-injection/**`, route de stats dans `todo.controller.ts` / `todo.service.ts` (en dernier).

### À préparer pour la validation
Le provider `uuid` : pourquoi un custom provider, différence entre `useFactory` / `useValue` / `useClass`, injection tokens. La requête unique des stats : pourquoi pas 3 requêtes séparées.

---

## Ben Fraj – Entité et base de données *(Parties 2 & 4)*

### Tâches
- [x] **B1** — Configurer **TypeORM** dans l'application (connexion + variables d'environnement).
- [x] **B2** — Définir `StatusEnum` (les trois statuts).
- [x] **B3** — Créer `TodoEntity` :

  | Champ | Type |
  | --- | --- |
  | `id` | entier auto-incrémenté |
  | `name` | string |
  | `description` | string |
  | `createdAt` | date de création |
  | `status` | `StatusEnum` |

- [x] **B4** — Ajouter `updatedAt` et `deletedAt`, **gérés automatiquement par TypeORM** (`@UpdateDateColumn`, `@DeleteDateColumn`).
- [x] **B5** — Rendre `createdAt` **non modifiable** une fois créé.
- [x] **B6** — Rendre `createdAt`, `updatedAt` et `deletedAt` **réutilisables** : créer une classe abstraite de base (ex. `TimestampEntity`) et l'étendre dans `TodoEntity`.
- [x] **B7** — Créer le module `TodoModule` avec `TypeOrmModule.forFeature([TodoEntity])` et l'enregistrer dans `AppModule`.
- [x] **B8** — Insérer quelques todos de test pour débloquer Dalcon et Adab.

### Fichiers
`src/data-source.ts`, `.env`, `src/todo/todo.module.ts`, `src/todo/entity/**`, `src/common/entities/**` (+ une ligne dans `app.module.ts`).

Ajouts hors périmètre initial : `scripts/seed.ts` (jeu de données, idempotent), `src/todo/entity/todo.entity.spec.ts` (tests de l'entité), `db.sqlite` et `.env` et suivis par Git pour éviter toute configuration locale.

### À préparer pour la validation
Pourquoi `@DeleteDateColumn` plutôt qu'un `deleted: boolean`. Le principe d'une classe abstraite réutilisable (DRY).

---

## Alaa – Validation des données *(Partie 3)*

### Tâches
- [x] **C1** — Créer un fichier **centralisé** de messages d'erreurs de validation (`src/common/messages/`) — optimiser la réutilisation et la maintenance.
- [x] **C2** — `CreateTodoDto` :
  - [x] `description` : obligatoire, minimum **10** caractères.
  - [x] `name` : obligatoire, entre **3** et **10** caractères.
  - [x] Messages d'erreurs personnalisés via le fichier centralisé.
- [x] **C3** — `UpdateTodoDto` (DTO **propre à la mise à jour**) :
  - [x] **Aucun champ obligatoire.**
  - [x] Mêmes contraintes de taille que l'ajout.
  - [x] `status` doit appartenir aux valeurs de `StatusEnum`.
- [x] **C4** — Configurer le `ValidationPipe` global (avec `whitelist` et `transform`).

### Fichiers
`src/todo/dto/**`, `src/common/messages/**` (+ configuration du pipe dans `main.ts`).

### À préparer pour la validation
Différence entre un DTO de création et un DTO de mise à jour. Le rôle du `ValidationPipe` et où il s'insère dans le cycle de requête NestJS.

---

## Ayachi – Opérations d'écriture *(Parties 5 & 6)*

### Tâches
- [x] **D1** — `addTodo` : ajouter un todo en base. **Garder les deux versions du code.**
- [x] **D2** — `updateTodo` : mettre à jour un todo via son `id`.
- [x] **D3** — `deleteTodo` : supprimer **définitivement** un todo via son `id`.
- [x] **D4** — `softDeleteTodo` : suppression logique via son `id` (utilise `deletedAt`).
- [x] **D5** — `restoreTodo` : restaurer un todo supprimé logiquement.
- [x] **D6** — Exposer toutes ces méthodes via les routes du `TodoController`.

### Fichiers
`src/todo/todo.service.ts`, `src/todo/todo.controller.ts`.

### À préparer pour la validation
La différence entre les deux versions d'`addTodo`. Pourquoi la suppression logique et comment TypeORM l'applique (`findOne` ignore les todos soft-deletés).

---

## Adab – Récupération, recherche et pagination *(Partie 8)*

### Tâches
- [x] **E1** — `GET /todos` : récupérer l'ensemble des todos.
- [x] **E2** — `GET /todos/:id` : récupérer un todo par son `id`.
  - [x] Gérer le cas où le todo n'existe pas (404 `NotFoundException`).
- [x] **E3** — Recherche : modifier l'API `GET` pour récupérer les todos dont le `name` **ou** la `description` contiennent la chaîne passée en paramètre, **et** ayant le statut passé en paramètre. Les deux critères restent **optionnels**.
- [x] **E4** — Pagination : ajouter le traitement nécessaire pour paginer `getAll` (page / limit).

### Fichiers
`src/todo/todo.service.ts`, `src/todo/todo.controller.ts` *(travailler sur une branche séparée, la lecture n'a pas besoin d'attendre Dalcon ; merger après lui)*.

### À préparer pour la validation
La construction de la requête de recherche (`Like`, `Or`, critères optionnels). Le calcul de l'offset en pagination.

---

## Dépendances entre membres

```
Akram (A1–A3, squelette)  ─►  Ben Fraj (entité)  ─►  Alaa (DTOs)
                                                  ─►  Dalcon (écriture)  ─►  Adab (lecture)
                                                  ─►  Akram (A4, stats — en dernier)
```

## Organisation Git

- Une branche par personne (`feat/akram-setup`, `feat/benfraj-entity`, etc.).
- Dalcon et Adab modifient les mêmes fichiers (`todo.service.ts`, `todo.controller.ts`) : **merger souvent** pour éviter les conflits ; Adab attend la fin de Dalcon avant de merger.
- Akram n'ajoute sa route de stats qu'**après** le merge final d'Adab.
- Aucune fusion sans relecture par un autre membre.

## Frontend (tableau de bord)

Un tableau de bord statique, en **HTML, CSS et JavaScript purs** — sans framework, sans bundler, sans étape de build. Il est servi par l'API elle-même (`express.static`), sur le préfixe `/ui` :

| URL | Contenu |
| --- | --- |
| `http://localhost:3000/` | index JSON de l'API (`GET /`) |
| `http://localhost:3000/ui/` | le tableau de bord |

```bash
npm run start:dev     # puis ouvrir http://localhost:3000/ui/
```

Les fichiers sont dans `public/` :

| Fichier | Rôle |
| --- | --- |
| `index.html` | structure de la page |
| `styles.css` | jetons de design (couleurs, typographie, mise en page) |
| `api.js` | client HTTP — une fonction par endpoint, **aucune** manipulation du DOM |
| `app.js` | état de l'interface, rendu, événements — **aucun** appel réseau direct |

Le tableau de bord est un board à trois colonnes — `TODO`, `IN_PROGRESS`, `DONE` — parce que les trois statuts de `StatusEnum` *sont* trois colonnes. Une carte se déplace d'une colonne à l'autre par **glisser-déposer**, ce qui déclenche un `PATCH /todos/:id`.

Points notables :

- l'API et le frontend sont servis par **le même processus et la même origine** : les requêtes sont relatives et **aucune configuration CORS n'est nécessaire** ;
- la validation est **déléguée au serveur** : les messages d'erreur affichés sont ceux de `VALIDATION_MESSAGES` (partie 3), ce qui montre le travail de validation côté API ;
- `GET /todos/trash` complète la partie 6 : sans elle, un todo supprimé logiquement disparaît totalement de l'API et ne peut plus être restauré.

## Checklist finale (équipe entière)

- [x] Toute la couverture de [topic.md](./topic.md) (parties 1 à 8) est implémentée
- [x] L'application démarre sans erreur et tous les endpoints sont testés
- [ ] Chaque membre présente sa partie aux autres, puis on fait tourner les rôles pour que **tout le monde sache défendre l'ensemble du projet**
