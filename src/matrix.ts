import type { Person } from './types';

export function findPerson(id: string, people: Person[]): Person {
  return people.find((p) => p.id === id) ?? { id: '', name: id };
}
