# NestJS – TP RT4 : Todo API + gestionnaire de CVs

Projet réalisé en équipe dans le cadre des TP NestJS RT4 – année universitaire 2026 / 2027.
Sujets par **Aymen Sellaouti** : TP1 → [topic.md](./topic.md) (terminé) · TP2 → [tasks2.md](./tasks2.md) (en cours, résumé ci-dessous).

---

## Les règles du jeu

1. Si l'on nous demande d'expliquer le code et qu'on le lit sans le comprendre, ce n'est pas notre code : la note est **0**.
2. Toujours **réfléchir avant** de coder ou de parler à l'IA.
3. Architecture cohérente, code propre, lisible et factorisé, design patterns appliqués : c'est un **devoir**.
4. La validation est un entretien : **chacun doit pouvoir expliquer tout le projet**, pas seulement sa partie.

---

# TP2 — Middleware, gestionnaire de CVs, seed, authentification

## Sujet (résumé — énoncé complet dans [tasks2.md](./tasks2.md))

| # | Exercice |
| --- | --- |
| 1 | **Middleware** d'authentification simulée sur le contrôleur Todo : lire le header `auth-user` (un JWT), le décoder avec `jsonwebtoken`, extraire `userId`, l'injecter dans `request`. À l'ajout on enregistre le user ; seul le créateur peut modifier / supprimer son todo. Sans token ou sans `userId` → réponse `res.json(...)` refusant l'accès. |
| 2 | **Gestionnaire de CVs** : entités `Cv` (id, name, firstname, age, cin, job, path), `User` (id, username, email, password), `Skill` (id, designation). Relations : `Cv *–1 User`, `Cv *–* Skill`. Modules, contrôleurs, services, DTOs (`nest generate resource`). **Factoriser le code.** |
| 3 | **Seed** de la base avec une *standalone application* (`NestFactory.createApplicationContext`) et la bibliothèque `@ngneat/falso`. Imports **relatifs**. Script npm `seed:cvs`. |
| 4 | Branche **`auth`** créée depuis `main` : désactiver le middleware, créer `AuthModule`, `User` = username (unique), password, email (unique), role. Inscription + login avec DTOs. |
| 5 | **Passport** : le login crée et renvoie un JWT (à vérifier sur jwt.io). |
| 6 | Le user connecté devient propriétaire du CV ; il ne voit, ne modifie et ne supprime que **ses** CVs ; protéger les routes réservées aux connectés et les tester. |
| 7 | **Guard admin** maison — de nouveaux rôles peuvent être ajoutés à tout moment, le guard doit le supporter sans modification. |
| 8 | Un **admin** récupère **tous** les CVs, un **user** seulement les siens. |

> Le PDF dit « Un user **non** connecté peut seulement voir ses cvs » : c'est très probablement une coquille pour « connecté » (un non-connecté n'a pas de CVs). On l'implémente ainsi — à confirmer avec l'enseignant.

---

## Règles de collaboration (anti-conflits)

1. **Un fichier = un propriétaire.** Le tableau [Propriété des fichiers](#propriété-des-fichiers) fait foi. On ne modifie pas le fichier d'un autre ; on lui demande.
2. **Akram passe en premier (étape 0)** : il installe **toutes** les dépendances du TP2, génère tous les squelettes et câble `app.module.ts` / `data-source.ts`. Après son merge, **personne d'autre ne touche à `package.json`, `package-lock.json`, `app.module.ts` ni `data-source.ts`**. Besoin d'une dépendance oubliée ? → on la demande à Akram.
3. **Ne jamais committer `db.sqlite`** (fichier binaire suivi par Git = conflit garanti). Avant chaque commit : `git restore db.sqlite`. Option : `git update-index --skip-worktree db.sqlite` une fois pour toutes.
4. **Une branche par personne**, toujours créée depuis un `main` à jour (`git pull` avant). On ne pousse jamais directement sur `main` : on merge sa branche après relecture par un autre membre.
5. Exceptions autorisées (une ligne, uniquement **après** le merge du propriétaire) — listées dans les tâches concernées.
6. Chaque membre doit être capable d'expliquer **l'intégralité de son code** (et des grandes lignes du reste) à la validation.

---

## Équipe et répartition TP2

| Membre | Exercices | Résumé | Branche(s) |
| --- | --- | --- | --- |
| **Akram** | 0 + 3 | Dépendances, squelettes, câblage, service CRUD générique ; puis seed standalone | `feat/akram-tp2-setup`, `feat/akram-seeder` |
| **Ben Fraj** | 2 (entités) + 4 (user) | Entités `User` / `Cv` / `Skill`, relations, `RoleEnum` | `feat/benfraj-cv-entities` |
| **Dalcon** | 1 | Middleware JWT `auth-user` + propriétaire des todos | `feat/dalcon-auth-middleware` |
| **Alaa** | 2 (DTOs, User, Skill) | Tous les DTOs + services/contrôleurs `User` et `Skill` | `feat/alaa-user-skill` |
| **Amine Brahim** | 4, 5, 7 | Branche `auth`, `AuthModule`, inscription/login, Passport JWT, guard de rôles | `auth`, `feat/amine-auth` |
| **Adab** | 2 (Cv) + 6 + 8 | Service/contrôleur `Cv`, propriétaire, admin voit tout | `feat/adab-cv`, `feat/adab-cv-ownership` |

### Ordre / dépendances

```
Akram 0 (setup) ─┬─► Dalcon (middleware, ex.1)  ──────────────► merge main
                 └─► Ben Fraj (entités) ─┬─► Alaa (DTOs + User/Skill) ─┐
                                         ├─► Amine (auth, ex.4/5/7) ───┼─► Adab (Cv + propriétaire, ex.6/8)
                                         └─► Akram (seeder, ex.3) ◄────┘  (Cv CRUD dès que Alaa a fini les DTOs)
```

- Dalcon peut commencer **dès** l'étape 0 d'Akram : il est indépendant des CVs.
- Amine crée la branche `auth` depuis `main` **après** le merge de Dalcon (il doit désactiver son middleware).
- Adab fait le CRUD Cv sur `main` (phase 1), puis l'ownership sur une branche partant de `auth` (phase 2).
- À la fin, `auth` est mergée dans `main`.

---

## Akram — Mise en place + seed *(étape 0 & exercice 3)*

### Tâches
- [x] **A0.1** — Installer **en une seule fois** toutes les dépendances du TP2 :
  - `jsonwebtoken`, `@types/jsonwebtoken` (ex. 1)
  - `@ngneat/falso` (ex. 3)
  - `@nestjs/passport`, `passport`, `passport-jwt`, `@types/passport-jwt`, `@nestjs/jwt` (ex. 5)
  - `bcryptjs` (hash des mots de passe, ex. 4) — version pur JavaScript de `bcrypt`, même API, pas de compilation native sous Windows ; types inclus.
- [x] **A0.2** — Ajouter `JWT_SECRET=...` (et `JWT_EXPIRES_IN=1h`) dans `.env`.
- [x] **A0.3** — Squelettes `user`, `cv`, `skill` (module, service, contrôleur, DTOs, entité) et `auth` (module, service, contrôleur), au format du projet : classes `UserEntity` / `CvEntity` / `SkillEntity` (dossiers `entities/`, chaque entité a déjà son `id` et étend `TimestampEntity`), imports **relatifs avec extension `.js`** (projet ESM). Les squelettes compilent mais restent vides : le contenu appartient aux autres.
- [x] **A0.4** — Enregistrer `UserModule`, `CvModule`, `SkillModule`, `AuthModule` dans `app.module.ts` et les 3 entités dans `data-source.ts`.
- [x] **A0.5** — **Factorisation** : `src/common/generic/crud.service.ts`, service générique abstrait `CrudService<T>` (`create`, `findAll`, `findOne` → 404, `update`, `remove` en soft delete) que les services `User`, `Skill` et `Cv` étendront :
  ```ts
  @Injectable()
  export class SkillService extends CrudService<SkillEntity> {
      constructor(@InjectRepository(SkillEntity) repository: Repository<SkillEntity>) {
          super(repository);
      }
  }
  ```
- [x] **A0.6** — `npm run build` et `npm test` passent, mergé dans `main`, **équipe prévenue**.
- [ ] **A3.1** — `src/commands/cv.seeder.ts` : la standalone application est en place (`createApplicationContext` / `app.close()`) ; reste à générer avec `falso` des users, des skills et des CVs reliés (owner + skills) **après le merge de Ben Fraj**.
- [x] **A3.2** — Script `"seed:cvs"` dans `package.json`. Projet ESM + décorateurs : `ts-node` pur pose problème, donc on compile puis on exécute : `nest build && node dist/commands/cv.seeder.js`.
- [ ] **A3.3** — Le seed doit être **idempotent** (ne pas dupliquer si la base est déjà remplie) et, après le merge d'Amine, hasher les mots de passe générés.

### Fichiers
`package.json`, `package-lock.json`, `.env`, `src/app.module.ts`, `src/data-source.ts`, `src/main.ts`, `src/common/generic/**`, `src/commands/**`, `public/**`.

Exception : après le merge de Dalcon, ajouter le header `auth-user` dans `public/api.js` pour que le tableau de bord `/ui` continue de fonctionner.

### À préparer pour la validation
Qu'est-ce qu'une standalone application et pourquoi les imports doivent être relatifs. Le service générique : héritage + génériques TypeScript, et en quoi il évite la duplication (DRY / template method).

---

## Ben Fraj — Entités et relations *(exercice 2, partie entités + exercice 4, entité User)*

### Tâches
- [x] **B1** — `RoleEnum` (`ADMIN`, `USER`) dans `src/user/enums/role.enum.ts`. Penser **extensible** : ajouter un rôle = ajouter une ligne.
- [ ] **B2** — `UserEntity` : `id`, `username` (**unique**), `email` (**unique**), `password` (ne jamais le renvoyer : `select: false` ou `@Exclude`), `role` (défaut `USER`), étend `TimestampEntity`.
- [ ] **B3** — `SkillEntity` : `id`, `designation`.
- [ ] **B4** — `CvEntity` : `id`, `name`, `firstname`, `age`, `cin`, `job`, `path`, étend `TimestampEntity`.
- [ ] **B5** — Relations :
  - `CvEntity` `@ManyToOne` → `UserEntity` (le propriétaire) / `UserEntity` `@OneToMany` → `cvs`.
  - `CvEntity` `@ManyToMany` ↔ `SkillEntity` avec `@JoinTable` côté Cv.
  - Choisir et justifier `eager`, `cascade`, `onDelete`.
- [ ] **B6** — Vérifier avec `synchronize` que les tables + la table de jointure sont créées correctement (ne pas committer `db.sqlite`).

### Fichiers
`src/user/entities/**`, `src/user/enums/**`, `src/cv/entities/**`, `src/skill/entities/**`.

### À préparer pour la validation
Owning side d'une relation, rôle de `@JoinTable`, différence `eager` / `lazy` / `relations: [...]`, `unique: true` vs validation applicative.

---

## Dalcon — Middleware d'authentification simulée *(exercice 1)*

### Tâches
- [ ] **D1** — `src/common/middlewares/auth.middleware.ts` (`NestMiddleware`) :
  - lire le header `auth-user` ;
  - le vérifier/décoder avec `verify` de `jsonwebtoken` et `process.env.JWT_SECRET` ;
  - extraire `userId` et l'injecter dans `req` (`req.userId`) ;
  - si le token est absent, invalide ou sans `userId` → `res.status(403).json({ message: ... })` **sans** appeler `next()`.
- [ ] **D2** — Typer la requête : `src/common/interfaces/request-with-user-id.interface.ts`.
- [ ] **D3** — Brancher le middleware **uniquement** sur le contrôleur Todo : `TodoModule implements NestModule` → `consumer.apply(AuthMiddleware).forRoutes(TodoController)`.
- [ ] **D4** — `TodoEntity` : ajouter `userId` (nullable, pour les todos existants).
- [ ] **D5** — `addTodo` enregistre `userId` ; `updateTodo`, `deleteTodo`, `softDeleteTodo`, `restoreTodo` ne réussissent que si `todo.userId === req.userId`, sinon `ForbiddenException`.
- [ ] **D6** — Tester avec un token généré sur jwt.io (même secret) : sans header, mauvais user, bon user.

### Fichiers
`src/common/middlewares/**`, `src/common/interfaces/**`, `src/todo/todo.module.ts`, `src/todo/todo.controller.ts`, `src/todo/todo.service.ts`, `src/todo/entity/todo.entity.ts`.

⚠️ Des modifications locales non committées existent sur `todo.service.ts` (essais `addTodo` / `save`) : les intégrer ou les jeter **avant** de commencer.

### À préparer pour la validation
Cycle de vie d'une requête Nest (middleware → guard → interceptor → pipe → handler). Pourquoi `verify` et pas `decode`. Différence middleware / guard.

---

## Alaa — DTOs + modules User et Skill *(exercice 2, partie DTOs / services)*

### Tâches
- [ ] **C1** — DTOs avec `class-validator`, messages pris dans `src/common/messages/validation-messages.ts` (fichier d'Alaa depuis le TP1) :
  - `CreateUserDto` / `UpdateUserDto` (`PartialType`).
  - `CreateSkillDto` / `UpdateSkillDto`.
  - `CreateCvDto` (dont `skillIds?: number[]`) / `UpdateCvDto`. `age` positif, `cin` au bon format.
- [ ] **C2** — `SkillService` et `UserService` **étendent `CrudService<T>`** d'Akram (pas de CRUD réécrit).
- [ ] **C3** — `SkillController` et `UserController` : routes REST complètes, `ParseIntPipe` sur les `:id`.
- [ ] **C4** — `UserModule` et `SkillModule` : `TypeOrmModule.forFeature([...])`, **exporter** les services (utilisés par l'auth et le seed).
- [ ] **C5** — Ajouter les nouveaux messages d'erreurs dans le fichier centralisé.

### Fichiers
`src/user/dto/**`, `src/skill/dto/**`, `src/cv/dto/**`, `src/user/user.{module,service,controller}.ts`, `src/skill/skill.{module,service,controller}.ts`, `src/common/messages/**`.

### À préparer pour la validation
`PartialType` / `mapped-types`, pourquoi un DTO de création ≠ entité, comment l'héritage de `CrudService` évite la duplication.

---

## Amine Brahim — Authentification et autorisation *(exercices 4, 5, 7)*

### Tâches
- [ ] **M1** — Après le merge de Dalcon : créer la branche **`auth`** depuis `main` et la pousser. Travailler sur `feat/amine-auth`, merger dans `auth`.
- [ ] **M2** — **Désactiver le middleware** de Dalcon (exception : commenter/retirer la ligne `consumer.apply(...)` dans `todo.module.ts`, uniquement sur la branche `auth`).
- [ ] **M3** — DTOs `RegisterDto` (username, email, password) et `LoginDto` (username ou email + password).
- [ ] **M4** — `AuthService.register` : vérifier l'unicité (→ `ConflictException`), hasher le mot de passe avec `bcryptjs`, rôle `USER` par défaut, ne jamais renvoyer le mot de passe.
- [ ] **M5** — `AuthService.login` : vérifier le mot de passe (`compare` de `bcryptjs`), sinon `UnauthorizedException` ; signer un JWT (`JwtService`) avec `{ sub: id, username, role }` et le renvoyer. Vérifier le token sur jwt.io.
- [ ] **M6** — Passport : `JwtStrategy` (`passport-jwt`, Bearer token) qui place le user dans `req.user` ; `JwtAuthGuard`.
- [ ] **M7** — Décorateur `@CurrentUser()` pour récupérer le user connecté dans un contrôleur.
- [ ] **M8** — **Guard de rôles** : décorateur `@Roles(...roles)` (`SetMetadata`) + `RolesGuard` (`Reflector`) qui vérifie `requiredRoles.includes(user.role)`. Ajouter un rôle ne doit demander **aucune** modification du guard. Exemple d'usage : `@Roles(RoleEnum.ADMIN)`.
- [ ] **M9** — `AuthModule` : `PassportModule`, `JwtModule.register({ secret: process.env.JWT_SECRET, signOptions: { expiresIn } })`, `TypeOrmModule.forFeature([UserEntity])` (ou import de `UserModule`) ; exporter les guards.

### Fichiers
`src/auth/**` (`auth.module.ts`, `auth.service.ts`, `auth.controller.ts`, `dto/`, `strategies/`, `guards/`, `decorators/`, `interfaces/jwt-payload.interface.ts`).

### À préparer pour la validation
Stratégie Passport et `AuthGuard('jwt')`, structure d'un JWT (header / payload / signature), pourquoi hasher (et saler), comment le `RolesGuard` lit les métadonnées.

---

## Adab — Module Cv, propriétaire et admin *(exercice 2 partie Cv, exercices 6 & 8)*

### Tâches
- [ ] **E1** — *(phase 1, sur `main`, après Alaa)* `CvService` **étend `CrudService<CvEntity>`** ; `create` / `update` résolvent `skillIds` en `SkillEntity` (relation many-to-many).
- [ ] **E2** — `CvController` : routes REST complètes ; `CvModule` avec `TypeOrmModule.forFeature([CvEntity, SkillEntity])`.
- [ ] **E3** — *(phase 2, branche depuis `auth`, après Amine)* À la création, le user connecté (`@CurrentUser()`) devient **propriétaire** du CV.
- [ ] **E4** — Protéger les routes Cv avec `JwtAuthGuard`.
- [ ] **E5** — `update` / `remove` : uniquement si le CV appartient au user connecté, sinon `ForbiddenException`.
- [ ] **E6** — `findAll` / `findOne` : un **ADMIN** voit **tous** les CVs, un **USER** seulement les siens.
- [ ] **E7** — Tester chaque cas (sans token, user A vs user B, admin) — collection Postman / fichier `.http` dans `test/http/cv.http`.

### Fichiers
`src/cv/cv.module.ts`, `src/cv/cv.service.ts`, `src/cv/cv.controller.ts`, `test/http/**`.

### À préparer pour la validation
Charger une relation many-to-many (`relations`, `In(ids)`), où placer la règle de propriété (service vs guard) et pourquoi, filtrage selon le rôle.

---

## Propriété des fichiers

| Fichier / dossier | Propriétaire |
| --- | --- |
| `package.json`, `package-lock.json`, `.env`, `src/app.module.ts`, `src/data-source.ts`, `src/main.ts`, `public/**` | Akram |
| `src/common/generic/**`, `src/commands/**` | Akram |
| `src/user/entities/**`, `src/user/enums/**`, `src/cv/entities/**`, `src/skill/entities/**` | Ben Fraj |
| `src/common/middlewares/**`, `src/common/interfaces/**`, `src/todo/**` (hors `dto/`) | Dalcon |
| `src/*/dto/**` (user, skill, cv, todo), `src/common/messages/**`, `src/user/user.*.ts`, `src/skill/skill.*.ts` | Alaa |
| `src/auth/**` | Amine Brahim |
| `src/cv/cv.*.ts`, `test/http/**` | Adab |
| `README.md` | chacun coche **uniquement ses propres cases** (lignes différentes → pas de conflit) |
| `db.sqlite` | personne — ne jamais le committer |

## Organisation Git

```bash
git checkout main && git pull
git checkout -b feat/<prenom>-<sujet>
# ... travail ...
git restore db.sqlite
git add <mes fichiers uniquement>
git commit -m "feat(<scope>): ..."
git push -u origin feat/<prenom>-<sujet>
# relecture par un autre membre, puis merge dans main (ou dans auth pour Amine / Adab phase 2)
```

## Checklist finale TP2 (équipe entière)

- [ ] Les exercices 1 à 8 du PDF sont implémentés
- [ ] `npm run build` passe, l'application démarre, `npm run seed:cvs` remplit la base
- [ ] Tous les cas d'accès (anonyme, user, autre user, admin) sont testés
- [ ] La branche `auth` est mergée dans `main`
- [ ] Chaque membre présente sa partie aux autres — **tout le monde sait défendre l'ensemble du projet**

---

# TP1 — Todo API *(terminé)*

## Répartition TP1

| Membre | Parties du TP | Résumé |
| --- | --- | --- |
| **Akram** | 1 + 7 | Setup, `CommonModule`, provider `uuid`, injection de dépendances, statistiques |
| **Ben Fraj** | 2 & 4 | TypeORM, `StatusEnum`, `TodoEntity`, champs de suivi, timestamps réutilisables |
| **Alaa** | 3 | Validation, messages d'erreurs centralisés, DTOs |
| **Ayachi** | 5 & 6 | CRUD (add / update / delete), soft delete, restore |
| **Adab** | 8 | Récupération, recherche, pagination |

### Akram – Mise en place et statistiques *(Parties 1 & 7)*
- [x] **A1** — Créer le projet NestJS (`nest new`) et pousser le squelette **en premier**.
- [x] **A2** — `CommonModule` `@Global()` exporté ; provider `uuid` avec le **bon type de provider** (`useFactory` vs `useValue` vs `useClass`).
- [x] **A3** — Module et service de test (`src/test-injection/`) pour démontrer l'injection du provider `uuid`.
- [x] **A4** — **Statistiques** en **une seule requête SQL** (`COUNT ... GROUP BY`), statuts à 0 inclus.

### Ben Fraj – Entité et base de données *(Parties 2 & 4)*
- [x] **B1** — Configurer **TypeORM** (connexion + variables d'environnement).
- [x] **B2** — `StatusEnum` (trois statuts).
- [x] **B3** — `TodoEntity` : `id`, `name`, `description`, `createdAt`, `status`.
- [x] **B4** — `updatedAt` / `deletedAt` gérés par TypeORM (`@UpdateDateColumn`, `@DeleteDateColumn`).
- [x] **B5** — `createdAt` non modifiable.
- [x] **B6** — Classe abstraite réutilisable `TimestampEntity`.
- [x] **B7** — `TodoModule` avec `TypeOrmModule.forFeature([TodoEntity])`.
- [x] **B8** — Todos de test (`scripts/seed.ts`).

### Alaa – Validation des données *(Partie 3)*
- [x] **C1** — Messages d'erreurs centralisés (`src/common/messages/`).
- [x] **C2** — `CreateTodoDto` : `description` ≥ 10, `name` entre 3 et 10.
- [x] **C3** — `UpdateTodoDto` : rien d'obligatoire, mêmes tailles, `status` ∈ `StatusEnum`.
- [x] **C4** — `ValidationPipe` global (`whitelist`, `transform`).

### Ayachi – Opérations d'écriture *(Parties 5 & 6)*
- [x] **D1** — `addTodo` (deux versions conservées).
- [x] **D2** — `updateTodo`. **D3** — `deleteTodo`. **D4** — `softDeleteTodo`. **D5** — `restoreTodo`.
- [x] **D6** — Routes du `TodoController`.

### Adab – Récupération, recherche et pagination *(Partie 8)*
- [x] **E1** — `GET /todos`. **E2** — `GET /todos/:id` (404 si absent).
- [x] **E3** — Recherche `name` **ou** `description` + statut, critères optionnels.
- [x] **E4** — Pagination (page / limit).

## Frontend (tableau de bord)

Tableau de bord statique en **HTML, CSS et JavaScript purs**, servi par l'API (`express.static`) sur `/ui` :

| URL | Contenu |
| --- | --- |
| `http://localhost:3000/` | index JSON de l'API (`GET /`) |
| `http://localhost:3000/ui/` | le tableau de bord |

```bash
npm run start:dev     # puis ouvrir http://localhost:3000/ui/
```

| Fichier (`public/`) | Rôle |
| --- | --- |
| `index.html` | structure de la page |
| `styles.css` | jetons de design |
| `api.js` | client HTTP — une fonction par endpoint, aucune manipulation du DOM |
| `app.js` | état, rendu, événements — aucun appel réseau direct |

Board à trois colonnes (`TODO`, `IN_PROGRESS`, `DONE`), glisser-déposer → `PATCH /todos/:id`. Même origine que l'API (pas de CORS), validation déléguée au serveur, `GET /todos/trash` pour restaurer les todos soft-deletés.
