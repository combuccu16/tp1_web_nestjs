export interface NavLink {
  path: string;
  label: string;
  exercise: string;
  description: string;
}

export const NAV_LINKS: readonly NavLink[] = [
  {
    path: '/cv',
    label: 'Cv',
    exercise: 'Ex. 3, 5, 9',
    description: 'Liste des CVs, détail et embauches',
  },
  { path: '/todo', label: 'Todo', exercise: 'Ex. 7', description: 'Service de todos' },
  {
    path: '/week-todo',
    label: 'Week todo',
    exercise: 'Ex. 8',
    description: 'Une liste de todos par jour',
  },
  {
    path: '/word',
    label: 'Mini word',
    exercise: 'Ex. 4',
    description: 'Mise en forme avec des style bindings',
  },
  {
    path: '/color',
    label: 'Color',
    exercise: 'Ex. 1, 6',
    description: 'Couleur du div et directive arc-en-ciel',
  },
  { path: '/ttc', label: 'TTC', exercise: 'Ex. 2', description: 'Calculateur de prix TTC' },
];

export const UPCOMING_LINKS: readonly string[] = ['Add Cv', 'Rxjs'];
