# NestJS – TP1 RT4

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

1. [Mise en place du projet](#1-mise-en-place-du-projet)
2. [Entité et base de données](#2-entité-et-base-de-données)
3. [Validation des données](#3-validation-des-données)
4. [Champs de suivi et réutilisabilité](#4-champs-de-suivi-et-réutilisabilité)
5. [Opérations CRUD](#5-opérations-crud)
6. [Suppression logique (soft delete)](#6-suppression-logique-soft-delete)
7. [Statistiques](#7-statistiques)
8. [Récupération, recherche et pagination](#8-récupération-recherche-et-pagination)

---

## 1. Mise en place du projet

- [ ] Créer un nouveau projet Nest.
- [ ] Créer un module `CommonModule`.
  - Ce module sera souvent utilisé : pensez-y lors de sa création.
- [ ] Provider la bibliothèque [`uuid`](https://www.npmjs.com/package/uuid).
  - **Il faudra identifier le bon type de provider.**
- [ ] Créer un module et un service afin de tester l'injection via un petit exemple.

## 2. Entité et base de données

### Entité `TodoEntity`

Créer une entité `TodoEntity` qui représente votre todo au niveau de la base de données. Un todo est caractérisé par :

| Champ         | Type / Description                              |
| ------------- | ----------------------------------------------- |
| `id`          | Entier auto-incrémenté                          |
| `name`        | Nom du todo                                     |
| `description` | Description du todo                             |
| `createdAt`   | Date de création                                |
| `status`      | De type `StatusEnum` (que vous avez déjà défini) |

### Configuration

- [ ] Configurer **TypeORM** au niveau de votre application.

## 3. Validation des données

### 3.1 Ajout d'un Todo

Appliquer les contraintes suivantes :

| Champ         | Contraintes                                                  |
| ------------- | ------------------------------------------------------------ |
| `description` | Obligatoire, au moins **10** caractères                      |
| `name`        | Obligatoire, minimum **3** caractères, maximum **10** caractères |

- [ ] Créer vos propres messages d'erreurs.
- [ ] Les centraliser dans un même fichier pour optimiser la réutilisation et faciliter la maintenance de l'application.

### 3.2 Mise à jour d'un Todo

- [ ] Créer un **DTO propre à la méthode de mise à jour**.
  - Aucun champ n'est obligatoire pour l'update.
  - Garder les contraintes de la partie ajout (taille).
  - Le statut doit être une des valeurs de vos status.

## 4. Champs de suivi et réutilisabilité

- [ ] Mettre à jour `TodoEntity` en y ajoutant deux champs : `updatedAt` et `deletedAt`.
  - Ces deux champs doivent être **automatiquement gérés par TypeORM**.
- [ ] Faire la modification nécessaire pour que le champ `createdAt` **ne puisse pas être modifié** une fois créé.
- [ ] Les champs `createdAt`, `updatedAt` et `deletedAt` pouvant être utilisés plusieurs fois, **proposer une méthode pour les rendre réutilisables**.

## 5. Opérations CRUD

- [ ] **`addTodo`** : ajouter un todo dans la base de données.
  - Garder les deux versions de votre code.
- [ ] **`updateTodo`** : mettre à jour un todo dans la base de données via son `id`.
- [ ] **`deleteTodo`** : supprimer un todo dans la base de données via son `id`.

## 6. Suppression logique (soft delete)

- [ ] **`softDeleteTodo`** : supprimer un todo dans la base de données via son `id`, de façon *soft*.
- [ ] Implémenter aussi la méthode permettant de **restaurer** votre todo.

## 7. Statistiques

- [ ] Préparer une API permettant d'obtenir, en **une seule requête**, le nombre de todos pour chacun des trois statuts.

## 8. Récupération, recherche et pagination

### 8.1 Récupération de tous les todos

- [ ] Créer un endpoint permettant de récupérer l'ensemble des todos.

### 8.2 Récupération par identifiant

- [ ] Créer l'endpoint permettant de récupérer un todo par son `id`.
- [ ] Gérer le cas où le todo n'existe pas.

### 8.3 Recherche

- [ ] Modifier l'API `GET` afin de pouvoir récupérer les todos :
  - dont le `name` **ou** la `description` contiennent la chaîne passée en paramètre,
  - **et** ayant le statut passé en paramètre.
- [ ] Les deux critères de recherche restent **optionnels**.

### 8.4 Pagination

- [ ] Ajouter le traitement nécessaire pour paginer la fonction `getAll`.
