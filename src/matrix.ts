import type { Person } from './types';

const MATRIX_DOMAIN = 'openproject.org';

// Fallback: first-word initial + "." + last word + ":" + MATRIX_DOMAIN
export function guessMatrixId(name: string): string {
  const tokens = name.split(/\s+/).filter(Boolean);
  if (tokens.length < 2) return '';

  const initial = lettersOnly(tokens[0]).charAt(0);
  const last = lettersOnly(tokens[tokens.length - 1]);
  if (!last || !initial) return '';

  return `@${initial}.${last}:${MATRIX_DOMAIN}`;
}

const TRANSLITERATIONS: Record<string, string> = {
  ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss',
};

function lettersOnly(part: string): string {
  return [...part.toLowerCase()]
    .map((ch) => TRANSLITERATIONS[ch] ?? ch)
    .join('')
    .normalize('NFD')
    .replace(/[^a-z]/g, '');
}

export function matrixIdFor(person: Person): string {
  return person.matrixId || guessMatrixId(person.name);
}

export function findPerson(id: string, people: Person[]): Person {
  return people.find((p) => p.id === id) ?? { id: '', name: id };
}
