# TP1 Angular RT4 — tâches détaillées par membre

**Sujet :** « Angular TP 1 RT4 2026 2027 » — Aymen Sellaouti (PDF).
**Lien avec le back :** c'est le **front** de la plateforme de recrutement **CvTech**. Le `Cv` (id, name, firstname, age, cin, job, path) est le même que celui du TP2 NestJS. Dans ce TP les données restent **en mémoire** (aucun appel HTTP à l'API pour l'instant).

> Ce fichier détaille **ce que chacun doit faire, dans quels fichiers, et comment savoir que c'est terminé**. Le [README](./README.md) en donne le résumé.

---

## 0. Le sujet en un coup d'œil

| Ex. | Diapo | Exercice | Responsable |
| --- | --- | --- | --- |
| **0** | — | Création du projet Angular, dépendances, routes, squelettes | **Akram** |
| **1** | 2 | Div dont la couleur suit un input + bouton « couleur par défaut » | **Amine Brahim** |
| **2** | 3 | Calculateur de prix TTC avec remises | **Alaa** |
| **3** | 4 | CvTech : liste des CVs + détail au clic (gestion de l'état) | **Ben Fraj** |
| **4** | 5 | Mini Word avec `ngStyle` (couleur, taille, police) | **Alaa** |
| **5** | 6 | Liste des CVs aux couleurs alternées | **Ben Fraj** |
| **6** | 7 | Directive « écriture arc-en-ciel » (`HostBinding` / `HostListener`) | **Amine Brahim** |
| **7** | 8 | Service de Todo + modèle + composant | **Dalcon** |
| **8** | 9 | Composant WeekTodo (5 colonnes indépendantes) | **Dalcon** |
| **9** | 10 | `CvService`, `EmbaucheService`, liste des embauchés, toast « budget dépassé » | **Adab** |
| **10** | 11 | Mise en page CvTech : barre de navigation, footer, carte de détail | **Akram** (navbar / footer / routes) + **Ben Fraj** (carte de détail) |

## 1. Organisation

### 1.1 Où vit le code

L'application Angular est créée dans **`frontend/`**, à la racine de ce dépôt (à côté de `src/` qui contient l'API NestJS). Un seul dépôt, un seul `main`.

```
tp1_web_nestjs/
├── src/            ← API NestJS (TP1 + TP2, ne pas toucher)
├── frontend/       ← application Angular (ce TP)
│   ├── src/app/
│   └── public/images/
├── README.md
└── tasks.md        ← ce fichier
```

### 1.2 Ordre de travail

```
Akram (étape 0 : projet, dépendances, routes, squelettes, navbar/footer)
   │  merge dans main, puis prévient l'équipe
   ├──► Amine (ex. 1 + 6)        ┐
   ├──► Alaa  (ex. 2 + 4)        │ en parallèle,
   ├──► Dalcon (ex. 7 + 8)       │ chacun dans ses fichiers
   └──► Ben Fraj (ex. 3 + 5 + carte de détail) ──► Adab (ex. 9)
```

Seul **Adab** doit attendre quelqu'un (Ben Fraj) : son exercice transforme la liste de CVs de Ben Fraj en service.

### 1.3 Règles anti-conflits (les mêmes qu'aux TP NestJS)

1. **Un fichier = un propriétaire** (tableau §8). On ne modifie pas le fichier d'un autre.
2. **Akram seul** touche `package.json`, `package-lock.json`, `angular.json`, `app.config.ts`, `app.routes.ts`, `app.{ts,html,css}`, `styles.css`. Besoin d'une librairie ou d'une route ? → on la demande à Akram.
3. Une branche par personne depuis un `main` à jour : `feat/<prenom>-ng-<sujet>`. Merge après relecture par un autre membre.
4. Pas de `ng generate` hors de son dossier : tous les squelettes sont créés par Akram à l'étape 0.
5. Exceptions autorisées (petites, après le merge du propriétaire) : listées dans les tâches d'**Adab** et d'**Amine**.

### 1.4 Conventions Angular du projet

- Composants **standalone** (pas de `NgModule`), syntaxe de contrôle **`@if` / `@for`** (avec `track`).
- Communication parent ↔ enfant : `input()` / `output()` (ou `@Input()` / `@Output()` — choisir l'un et s'y tenir dans toute l'équipe).
- État partagé entre composants non liés : un **service** `providedIn: 'root'`.
- Un dossier par fonctionnalité : `src/app/<feature>/…`. Les modèles dans `src/app/<feature>/model/`.

---

## 2. Akram — étape 0 + mise en page *(ex. 10, partie navigation)*

### Objectif
Créer le projet et **tout ce qui est partagé**, une seule fois, pour que les cinq autres puissent travailler en parallèle sans conflit.

### Tâches

- [x] **A1 — Créer le projet** dans `frontend/` (Angular **22**) :
  ```bash
  ng new frontend --routing --style=css --skip-git --ssr=false
  ```
  `--skip-git` : le dépôt Git existe déjà à la racine. `frontend/.gitignore` exclut `node_modules` et `dist`.
- [x] **A2 — Dépendances** (dans `frontend/`) : `bootstrap` 5.3, dont le CSS est chargé globalement via `angular.json` (`styles`).
  - **Pas de `ngx-toastr`** : sa dernière version (20.0.5) ne supporte qu'Angular 21. Le toast de l'ex. 9 est fait **maison** par Adab (`ToastService` + `ToastComponent`, styles Bootstrap), ce qui évite une dépendance incompatible.
  - `angular.json` → `schematics` : `ng generate` garde les suffixes `.component.ts` / `.service.ts` / `.directive.ts` et les classes `XxxComponent` / `XxxService` (Angular 22 les supprime par défaut).
- [x] **A3 — Squelettes** (vides, ils compilent) pour que les routes existent dès le départ :

  | Fichiers créés | Propriétaire |
  | --- | --- |
  | `color/color.component.*` · `rainbow/rainbow.directive.ts` | Amine |
  | `ttc/ttc.component.*` · `mini-word/mini-word.component.*` | Alaa |
  | `cv/cv/` · `cv/cv-list/` · `cv/cv-item/` · `cv/cv-detail/` | Ben Fraj |
  | `cv/services/cv.service.ts` · `cv/services/embauche.service.ts` · `cv/embauche/` · `shared/toast/` (`toast.service.ts`, `toast.component.*`) | Adab |
  | `todo/todo/` · `todo/services/todo.service.ts` · `todo/week-todo/` · `todo/day-todo/` | Dalcon |
  | `layout/navbar/` · `layout/footer/` · `layout/nav-links.ts` · `home/` | Akram |

  Les services utilisent `@Injectable({ providedIn: 'root' })` (syntaxe du cours). Angular 22 génère par défaut le nouveau `@Service()`, équivalent (singleton global) : à savoir citer.
- [x] **A4 — Routes** (`app.routes.ts`) — chaque route a aussi un `title` (titre de l'onglet) :

  | Chemin | Composant | Lien de la navbar |
  | --- | --- | --- |
  | `''` | `HomeComponent` | Home |
  | `cv` | `CvComponent` | Cv |
  | `todo` | `TodoComponent` | Todo |
  | `week-todo` | `WeekTodoComponent` | Week todo |
  | `word` | `MiniWordComponent` | Mini word |
  | `color` | `ColorComponent` | Color |
  | `ttc` | `TtcComponent` | TTC |
  | `**` | redirection vers `''` | — |

- [x] **A5 — Mise en page (ex. 10)** : le composant racine `App` (`app.ts` / `app.html`) = `<app-navbar>` + `<router-outlet>` + `<app-footer>` + `<app-toast>` (conteneur des toasts d'Adab).
  - `NavbarComponent` : marque **CvTech**, liens `routerLink` + `routerLinkActive` (le lien actif est mis en évidence). Les éléments de la capture qui relèvent de TP futurs (**Add Cv**, **Rxjs**, **Logout**, boutons **Français / English**) sont affichés mais désactivés.
  - `FooterComponent` : simple pied de page.
  - `HomeComponent` : une carte par exercice.
  - **Une seule liste de liens** (`layout/nav-links.ts`) lue par la navbar **et** la page d'accueil : ajouter une page = une ligne.
- [x] **A6 — Ne pas casser le back** : `"exclude": [..., "frontend"]` dans le `tsconfig.json` racine, et `frontend/**` exclu des deux configs Vitest racine (sinon `npm test` exécutait les tests Angular). `npm run build`, `npm test`, `npm run test:e2e`, `npm run lint` passent toujours.
- [x] **A7 — Scripts** : `npm run front` (à la racine) lance le front.
- [x] **A8** — `ng build` et `ng test` passent (test : la navbar CvTech et le footer s'affichent) ; mergé dans `main`.

### Fichiers
`frontend/package.json`, `frontend/package-lock.json`, `frontend/angular.json`, `frontend/tsconfig*.json`, `frontend/src/main.ts`, `frontend/src/index.html`, `frontend/src/styles.css`, `frontend/src/app/app.{ts,html,css,spec.ts}`, `frontend/src/app/app.{config,routes}.ts`, `frontend/src/app/layout/**`, `frontend/src/app/home/**`, `tsconfig.json`, `package.json`, `vitest.config*.ts` racine.

### Terminé quand
Tout le monde peut faire `git pull`, `npm install` dans `frontend/`, `ng serve`, et voir sa page (vide) en cliquant sur son lien.

### À préparer pour la validation
Composant standalone vs `NgModule`, rôle de `app.config.ts` (providers globaux), `provideRouter`, `routerLink` / `routerLinkActive`, `<router-outlet>`, route joker `**`.

---

## 3. Amine Brahim — Couleur du Div + directive arc-en-ciel *(ex. 1 et 6)*

### Ex. 1 — `ColorComponent` (diapo 2)

- [ ] **M1** — Un `div` (taille visible, ex. 200 × 100 px) et un `input type="text"`.
- [ ] **M2** — Quand on écrit une couleur dans l'input (`red`, `#ff0`, `rgb(0,128,0)`), elle devient la couleur de fond du div.
  - Utiliser une **variable de référence de template** : `<input #colorInput …>` puis lire `colorInput.value` (indice du sujet).
  - Lier le style : `[style.backgroundColor]="color"`.
- [ ] **M3** — Un bouton « Réinitialiser » : le div reprend sa **couleur par défaut** et l'input est vidé.
  - La couleur par défaut est une **constante** du composant (`DEFAULT_COLOR`), pas une valeur répétée dans le HTML.

### Ex. 6 — `RainbowDirective` (diapo 7)

- [ ] **M4** — Compléter la directive `rainbow/rainbow.directive.ts` (squelette créé par Akram).
- [ ] **M5** — `@HostBinding('style.color')` et `@HostBinding('style.borderColor')` sur deux propriétés de la directive.
- [ ] **M6** — Une méthode privée `randomColor(): string` qui renvoie une couleur aléatoire (ex. `rgb(r, g, b)` avec 3 entiers entre 0 et 255).
- [ ] **M7** — `@HostListener('keyup')` : à chaque lettre tapée, la couleur du texte **et** de la bordure changent.
- [ ] **M8** — « La directive ne doit pas s'instancier sur des balises où elle n'a pas de sens » → **restreindre le sélecteur** :
  ```ts
  @Directive({ selector: 'input[appRainbow], textarea[appRainbow]' })
  ```
  Ainsi `<div appRainbow>` n'instancie **rien**.
- [ ] **M9** — L'appliquer sur l'input de ton `ColorComponent` (`<input appRainbow …>`) pour la démonstration.

### Fichiers
`frontend/src/app/color/**`, `frontend/src/app/rainbow/**`.

### Terminé quand
- taper `blue` colore le div ; le bouton le remet à la couleur par défaut ;
- dans l'inspecteur, à chaque touche, l'input reçoit `style="color: …; border-color: …"` avec une nouvelle valeur ;
- `<div appRainbow>` ne change rien.

### À préparer pour la validation
Variable de référence `#nom`, property binding `[style.x]`, event binding `(click)`. Directive d'attribut vs composant, `HostBinding` / `HostListener`, rôle du **sélecteur** (CSS) d'une directive.

---

## 4. Alaa — Calculateur TTC + Mini Word *(ex. 2 et 4)*

### Ex. 2 — `TtcComponent` (diapo 3)

- [x] **C1** — Trois champs modifiables : **Prix HT** (défaut `0`), **Quantité** (défaut `1`), **TVA** en % (défaut `18`). Liaison bidirectionnelle `[(ngModel)]` (`FormsModule`) ou signals.
- [x] **C2** — Trois résultats affichés en direct (capture du sujet) :

  | Valeur | Formule |
  | --- | --- |
  | Prix unitaire TTC | `prixHT × (1 + tva / 100)` |
  | Remise | taux selon la quantité × (prix unitaire TTC × quantité) |
  | Prix total TTC | `prix unitaire TTC × quantité − remise` |

- [x] **C3** — Règles de remise :
  - quantité **entre 10 et 15** → **20 %** ;
  - quantité **> 15** → **30 %** ;
  - sinon 0 %.
  > ⚠️ Ambigu : la capture affiche « Discount : $0.00 » pour une quantité de **10**. Décider si 10 est inclus (texte) ou exclu (capture), l'écrire en commentaire, et savoir le justifier.
- [x] **C4** — Les taux et seuils sont des **constantes nommées** (pas de `0.2` ni de `15` en dur dans le calcul).
- [x] **C5** — Calculs **dérivés** (getter ou `computed()`) : jamais stockés à la main, ils se recalculent quand une entrée change.
- [x] **C6** — Affichage avec le pipe **`currency`**. Refuser les valeurs négatives (`min="0"` + garde dans le calcul).

### Ex. 4 — `MiniWordComponent` (diapo 5)

- [x] **C7** — Un paragraphe de texte + trois contrôles : `input type="color"`, `input type="number"` (taille en px), `select` de polices.
- [x] **C8** — Tout le style du paragraphe passe par **un seul `[ngStyle]`** :
  ```html
  <p [ngStyle]="{ color: color, 'font-size.px': size, 'font-family': font }">…</p>
  ```
- [x] **C9** — La liste des polices est un **tableau** dans le composant (`['Arial', 'Verdana', 'Times New Roman', 'Courier New', …]`), affichée avec `@for`.
- [x] **C10** — Valeurs par défaut cohérentes avec la capture (couleur, taille 30, police Arial).

### Fichiers
`frontend/src/app/ttc/**`, `frontend/src/app/mini-word/**`.

### Terminé quand
- Prix 100, quantité 1, TVA 18 → unitaire 118,00, total 118,00, remise 0 ;
- quantité 12 → remise de 20 % ; quantité 20 → remise de 30 % ;
- changer couleur / taille / police modifie immédiatement le paragraphe.

### À préparer pour la validation
Two-way binding `[(ngModel)]` = `[ngModel]` + `(ngModelChange)`, valeurs dérivées (getter / `computed`), pipes (`currency`), `ngStyle` vs `[style.x]` (plusieurs styles d'un coup vs un seul), unités `'font-size.px'`.

---

## 5. Ben Fraj — CvTech : liste, détail, couleurs alternées *(ex. 3, 5 et carte de l'ex. 10)*

### Ex. 3 — Liste + détail (diapo 4) — « Réfléchissez bien à la gestion de l'état »

- [x] **B1 — Modèle** `src/app/cv/model/cv.ts` :
  ```ts
  export class Cv {
      constructor(
          public id: number,
          public name: string,
          public firstname: string,
          public age: number,
          public cin: string,
          public job: string,
          public path: string,
      ) {}
  }
  ```
  Mêmes champs que le TP2 (le `name` du sujet ; côté API le champ s'appelle `lastname`).
- [x] **B2 — Architecture imposée** (4 composants) :
  ```
  CvComponent            ← parent : détient la liste ET le CV sélectionné (l'état)
  ├── CvListComponent    ← reçoit cvs (input), remonte la sélection (output)
  │     └── CvItemComponent ← affiche UN cv (photo + nom), émet au clic (output)
  └── CvDetailComponent  ← reçoit le cv sélectionné (input), l'affiche
  ```
  - **L'état n'est stocké qu'à un seul endroit** : `CvComponent` (`cvs` et `selectedCv`). Les enfants n'ont que des `input` / `output`.
  - Clic sur un item → `CvItemComponent` émet → `CvListComponent` ré-émet → `CvComponent` met à jour `selectedCv` → `CvDetailComponent` le reçoit.
- [x] **B3** — Commencer par **un seul CV** affiché et son détail au clic (consigne), puis passer à une liste de 3-4 CVs (`@for … track cv.id`).
- [x] **B4** — Aucun CV sélectionné → `CvDetailComponent` n'affiche rien (`@if`).
- [x] **B5** — Images dans `frontend/public/images/` ; si `path` est vide, afficher une image par défaut (`cv.png`).

### Ex. 5 — Couleurs alternées (diapo 6)

- [x] **B6** — Dans `CvListComponent`, les éléments successifs alternent entre **deux couleurs** :
  ```html
  @for (cv of cvs(); track cv.id; let odd = $odd) {
      <app-cv-item [cv]="cv" [class.odd]="odd" … />
  }
  ```
  Les deux couleurs sont dans le CSS du composant (`.odd { … }`). L'élément sélectionné reste repérable (classe `active`).

### Ex. 10 — Carte de détail (diapo 11)

- [ ] **B7** — `CvDetailComponent` reprend la carte de la capture : photo, citation, « Job Description », nom, âge, CIN, métier, et deux boutons **« embaucher »** et **« détails »**.
  - « embaucher » ne fait rien pour l'instant : c'est **Adab** qui le branchera (ex. 9).

### Fichiers
`frontend/src/app/cv/model/**`, `frontend/src/app/cv/cv/**`, `frontend/src/app/cv/cv-list/**`, `frontend/src/app/cv/cv-item/**`, `frontend/src/app/cv/cv-detail/**`, `frontend/public/images/**`.

### Terminé quand
Sur `/cv` : la liste s'affiche avec deux couleurs alternées, un clic affiche la carte de détail à droite, un autre clic change le détail.

### À préparer pour la validation
Pourquoi l'état est dans le parent (**une seule source de vérité**), flux de données descendant (`input`) et événements montants (`output`), composants **intelligents** (container) vs **de présentation**, `track` dans `@for`, `$odd` / `$even` / `$index`.

---

## 6. Dalcon — Todo + WeekTodo *(ex. 7 et 8)*

### Ex. 7 — Service, modèle, composant (diapo 8)

- [x] **D1 — Modèle** `src/app/todo/model/todo.ts` : `Todo { name: string; content: string }` (+ un `id` si besoin pour la suppression et `track`).
- [x] **D2 — `TodoService`** (`@Injectable({ providedIn: 'root' })`) :

  | Méthode | Rôle |
  | --- | --- |
  | `getTodos(): Todo[]` | récupérer la liste |
  | `addTodo(todo: Todo): void` | ajouter |
  | `deleteTodo(todo: Todo): void` | supprimer |
  | `logTodos(): void` | afficher la liste dans la console (`console.log`) |

  La liste est **privée** dans le service : les composants passent par les méthodes.
- [x] **D3 — `TodoComponent`** (capture) : champs **Name** et **Content**, bouton **Add Todo**, liste des todos avec un bouton de suppression pour chacun, bouton « Logger ».
  - Le service est **injecté** (`inject(TodoService)` ou constructeur), jamais instancié avec `new`.
  - Après l'ajout, le formulaire est vidé ; on n'ajoute pas un todo vide.

### Ex. 8 — WeekTodo (diapo 9)

- [x] **D4** — `WeekTodoComponent` affiche **5 colonnes** (lundi → vendredi), chacune = un `DayTodoComponent` (`@for` sur un tableau de jours).
- [x] **D5** — Chaque colonne a son formulaire (name, content, add) et **sa propre liste** : ajouter un todo le lundi ne l'ajoute pas le mardi.
- [x] **D6** — **Le point clé de l'exercice** : réutiliser le **même** `TodoService`, mais avec **une instance par colonne**, en le déclarant dans le composant :
  ```ts
  @Component({ selector: 'app-day-todo', providers: [TodoService], … })
  export class DayTodoComponent { … }
  ```
  → injecteur **hiérarchique** : chaque `DayTodoComponent` reçoit sa propre instance, alors que `TodoComponent` (ex. 7) utilise l'instance globale (`root`).

### Fichiers
`frontend/src/app/todo/**`.

### Terminé quand
- `/todo` : ajouter, afficher, supprimer, logger fonctionnent ;
- `/week-todo` : 5 colonnes indépendantes ; les todos de `/todo` n'apparaissent pas dans la semaine (et inversement).

### À préparer pour la validation
Injection de dépendances, `providedIn: 'root'` (singleton) vs `providers: [...]` dans un composant (une instance par composant), arbre des injecteurs, encapsulation de l'état dans un service.

---

## 7. Adab — CvService, EmbaucheService, liste des embauchés *(ex. 9)* — **après Ben Fraj**

- [ ] **E1 — `CvService`** (`providedIn: 'root'`) : il **devient le propriétaire de la liste des CVs**.
  - `getCvs(): Cv[]`, `getCvById(id: number): Cv | undefined`.
  - **Exception** (après le merge de Ben Fraj) : dans `cv.component.ts`, remplacer le tableau en dur par `this.cvService.getCvs()`. Une seule ligne, prévenir Ben Fraj.
- [ ] **E2 — `EmbaucheService`** (`providedIn: 'root'`) :
  - liste **privée** des CVs embauchés ;
  - `getEmbauchees(): Cv[]` ;
  - `embaucher(cv: Cv): boolean` → `false` si le CV est **déjà** embauché (pas de doublon), sinon l'ajoute et renvoie `true`.
- [ ] **E3 — `EmbaucheComponent`** : affiche la liste des embauchés **seulement si elle n'est pas vide** (`@if`). Il est placé sous la carte de détail dans `CvComponent`.
  - **Exception** : une balise `<app-embauche />` dans `cv.component.html`.
- [ ] **E4 — Bouton « embaucher »** :
  - **Exception** : dans `cv-detail.component.ts/html`, brancher le bouton de Ben Fraj : `(click)="embaucher()"` qui appelle `EmbaucheService.embaucher(cv)`.
- [ ] **E5 — Toasts maison** (`src/app/shared/toast/`, squelettes créés par Akram ; `<app-toast />` est déjà placé dans `app.html`) :
  - `ToastService` : un `signal<Toast[]>` (`{ id, message, type: 'success' | 'warning' | 'danger' }`), une méthode `show(message, type)` qui ajoute un toast et le retire automatiquement après ~3 s (`setTimeout`), et `dismiss(id)`.
  - `ToastComponent` : affiche les toasts du service en bas à droite avec les classes Bootstrap (`toast-container position-fixed bottom-0 end-0`, `toast show text-bg-{{ type }}`), bouton de fermeture.
  - déjà embauché → `toast.show('… est déjà embauché', 'warning')` ;
  - plus de **3** embauchés → `toast.show('Budget dépassé', 'danger')` ; le seuil est une **constante** (`MAX_EMBAUCHES = 3`) dans `EmbaucheService`.
  - La règle « budget dépassé » est **dans le service**, le composant ne fait qu'afficher le toast.

### Fichiers
`frontend/src/app/cv/services/**`, `frontend/src/app/cv/embauche/**`, `frontend/src/app/shared/toast/**` (+ les 3 exceptions ci-dessus).

### Terminé quand
Cliquer « embaucher » ajoute le CV à la liste qui apparaît ; recliquer sur le même CV affiche un avertissement ; le 4ᵉ embauché déclenche le toast « budget dépassé ».

### À préparer pour la validation
Pourquoi déplacer la liste dans un service (état partagé, composants qui ne se connaissent pas : la carte de détail et la liste des embauchés), singleton `providedIn: 'root'`, où mettre la règle métier (service) et où mettre l'affichage (composant).

---

## 8. Propriété des fichiers (dans `frontend/`)

| Fichier / dossier | Propriétaire |
| --- | --- |
| `package.json`, `package-lock.json`, `angular.json`, `tsconfig*.json`, `src/main.ts`, `src/index.html`, `src/styles.css` | Akram |
| `src/app/app.{ts,html,css,spec.ts}`, `src/app/app.{config,routes}.ts`, `src/app/layout/**`, `src/app/home/**` | Akram |
| `src/app/color/**`, `src/app/rainbow/**` | Amine Brahim |
| `src/app/ttc/**`, `src/app/mini-word/**` | Alaa |
| `src/app/cv/model/**`, `src/app/cv/{cv,cv-list,cv-item,cv-detail}/**`, `public/images/**` | Ben Fraj |
| `src/app/cv/services/**`, `src/app/cv/embauche/**`, `src/app/shared/toast/**` | Adab |
| `src/app/todo/**` | Dalcon |
| `tasks.md`, `README.md` | chacun ne coche **que ses propres cases** |

## 9. Checklist finale (équipe entière)

- [ ] Les 10 exercices du PDF sont implémentés et accessibles depuis la navbar
- [ ] `ng build` passe dans `frontend/` ; `npm run build` et `npm test` passent toujours à la racine (API NestJS)
- [ ] Chaque membre présente sa partie aux autres — **tout le monde sait défendre l'ensemble du projet**
