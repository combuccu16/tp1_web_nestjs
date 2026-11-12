# NestJS – TP2 RT4

**Auteur du sujet :** Aymen Sellaouti
**Année universitaire :** 2026 / 2027

---

## Les règles du jeu

1. Lorsque l'enseignant demande d'expliquer votre code et que vous le lisez à ce moment-là, c'est que ce n'est pas votre code et que vous ne l'avez ni lu ni compris. Celui qui l'a écrit sera noté, et pour vous ce sera **0**.
2. Vous devez toujours **réfléchir avant** de commencer à coder ou de parler à l'IA.
3. Une architecture cohérente, un code propre, lisible et factorisé, ainsi que l'application des design patterns ne sont pas une option : c'est un **devoir**.
4. Considérez la validation comme un entretien : le jour J, vous devez être prête et très bien connaître votre sujet.

---

## Sommaire

1. [Middleware d'authentification](#1-middleware-dauthentification)
2. [Gestionnaire de CVs](#2-gestionnaire-de-cvs)
3. [Seed de la base de données](#3-seed-de-la-base-de-données)
4. [Authentification : AuthModule, inscription et login](#4-authentification--authmodule-inscription-et-login)
5. [Passport et JWT](#5-passport-et-jwt)
6. [Propriétaire des CVs et routes protégées](#6-propriétaire-des-cvs-et-routes-protégées)
7. [Guard admin](#7-guard-admin)
8. [Admin vs user : récupération des CVs](#8-admin-vs-user--récupération-des-cvs)

---

## 1. Middleware d'authentification

- [ ] Créer un **Middleware** qui simule un processus d'authentification.
- [ ] En cas d'accès au contrôleur **Todo** (partie persistance), il doit vérifier l'existence d'un header **`auth-user`** contenant un token JWT ([jwt.io](https://jwt.io/)).
- [ ] S'il existe, le **décoder** ([jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken), [@types/jsonwebtoken](https://www.npmjs.com/package/@types/jsonwebtoken)) et en extraire la propriété **`userId`**.
- [ ] **Injecter** `userId` dans l'objet `request`.
- [ ] Dans le `TodoController` :
  - à l'**ajout**, on enregistre le user ;
  - pour l'**update** et le **delete**, seul le user qui a créé le todo peut le modifier ou le supprimer.
- [ ] Si le token n'existe pas, ou s'il ne contient pas de `userId`, retourner une réponse au client ([`res.json`](https://expressjs.com/en/api.html#res.json)) lui indiquant qu'il ne peut pas accéder à la ressource.

```ts
import { verify } from "jsonwebtoken";
```

## 2. Gestionnaire de CVs

Nous voulons reproduire le schéma d'un petit gestionnaire de CVs :

| Entité | Champs |
| --- | --- |
| `Cv` | `id`, `name`, `firstname`, `age`, `cin`, `job`, `path` |
| `User` | `id`, `username`, `email`, `password` |
| `Skill` | `id`, `designation` |

**Relations :**

| Relation | Cardinalité |
| --- | --- |
| `Cv` ↔ `User` | plusieurs CVs pour **un** user (`* – 1`) |
| `Cv` ↔ `Skill` | plusieurs à plusieurs (`* – *`) |

- [ ] Créer les **modules, contrôleurs, services et entités** relatifs à ce schéma, ainsi que les **relations** associées.

> **Astuce :** la commande `nest generate resource` génère le squelette de tous les blocs NestJS (module, service, contrôleur), une classe d'entité, des classes DTO et les fichiers de test (`.spec`). Vous devez finaliser le reste. **Pensez à factoriser votre code pour ne pas réécrire la même chose.**

## 3. Seed de la base de données

### Génération de données fictives

Plusieurs bibliothèques existent, par exemple **ngneat/falso** : <https://ngneat.github.io/falso/docs/getting-started>

### Standalone applications

- Une application Nest peut être une application Web, des microservices, ou une application **Standalone**, indépendante du contexte Web.
- Une application Standalone est une couche sur le **conteneur IoC** de Nest : elle permet de récupérer n'importe quelle instance exportée par les modules importés.
- Pour la créer, utiliser `createApplicationContext` de `NestFactory` en lui passant votre module ; récupérer un service avec la méthode `get` en lui passant la classe souhaitée.

```ts
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  // Todo : Do What you want
  await app.close();
}
bootstrap();
```

- Pour l'exécuter, lancer `ts-node` suivi du chemin de votre fichier. Vous pouvez créer un script dans `package.json` :

```json
"scripts": {
  "seed:cvs": "ts-node src/commands/cv.seeder.ts"
}
```

- ⚠️ Pour que les seeds fonctionnent, les imports de vos éléments doivent être **relatifs** et non absolus.

Documentation : <https://docs.nestjs.com/standalone-applications#standalone-applications>

### Exercice

- [ ] Créer une **standalone application** permettant le seed de votre base de données.

## 4. Authentification : AuthModule, inscription et login

- [ ] Commencer par voir la partie **authentification et autorisation** du cours.
- [ ] Créer une autre branche à partir de la branche master, appelée **`auth`**.
- [ ] **Désactiver** le middleware.
- [ ] Créer un module **`AuthModule`**.
- [x] Mettre à jour l'entité `User` avec :
  - `username` (**unique**)
  - `password`
  - `email` (**unique**)
  - `role`
- [ ] Créer les fonctionnalités d'**inscription** et de **login**. Ne pas oublier de définir les **DTOs**.

## 5. Passport et JWT

- [ ] Mettre en place **Passport**.
- [ ] Modifier la fonction de login pour **créer un JWT** et le renvoyer à l'utilisateur.
- [ ] Vérifier la validité du token sur [jwt.io](https://jwt.io/).

## 6. Propriétaire des CVs et routes protégées

- [ ] Faire le nécessaire pour affecter le **user connecté** comme propriétaire du CV.
- [ ] Un user non connecté peut seulement voir ses CVs. *(probablement « connecté » : à confirmer avec l'enseignant)*
- [ ] Il ne peut **modifier ou supprimer que ses CVs**.
- [ ] **Protéger** les fonctionnalités accessibles uniquement aux personnes connectées, et les **tester**.

## 7. Guard admin

- [ ] Créer votre propre **Guard** qui ne donne l'accès qu'aux **admins** de l'application.

> **Remarque :** le propriétaire de l'application peut **ajouter des rôles à tout moment**. Pensez-y quand vous implémentez votre Guard.

## 8. Admin vs user : récupération des CVs

- [ ] Quand le user connecté est un **admin**, il peut récupérer **tous** les CVs. Quand c'est un **user**, il ne voit que **ses propres** CVs.
