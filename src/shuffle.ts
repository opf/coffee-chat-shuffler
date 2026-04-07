import type { MonthRecord, Person, ShuffleGroup } from './types';

type PairKey = string;

function pairKey(a: string, b: string): PairKey {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

function buildPairFrequencies(history: MonthRecord[]): Map<PairKey, number> {
  const freq = new Map<PairKey, number>();
  for (const record of history) {
    for (const group of record.groups) {
      const ids = group.memberIds;
      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          const key = pairKey(ids[i], ids[j]);
          freq.set(key, (freq.get(key) ?? 0) + 1);
        }
      }
    }
  }
  return freq;
}

function splitIntoGroups(people: Person[], groupSize: number): ShuffleGroup[] {
  const groups: ShuffleGroup[] = [];
  const numGroups = Math.ceil(people.length / groupSize);
  for (let i = 0; i < numGroups; i++) {
    groups.push({ memberIds: [] });
  }
  people.forEach((person, idx) => {
    groups[idx % numGroups].memberIds.push(person.id);
  });
  return groups;
}

function scoreGroups(groups: ShuffleGroup[], freq: Map<PairKey, number>): number {
  let score = 0;
  for (const group of groups) {
    const ids = group.memberIds;
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        score += freq.get(pairKey(ids[i], ids[j])) ?? 0;
      }
    }
  }
  return score;
}

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function computeShuffle(
  people: Person[],
  groupSize: number,
  history: MonthRecord[],
  attempts = 500,
): ShuffleGroup[] {
  const active = people.filter((p) => !p.archived);
  if (active.length === 0) return [];

  const freq = buildPairFrequencies(history);
  let bestGroups = splitIntoGroups(shuffleArray(active), groupSize);
  let bestScore = scoreGroups(bestGroups, freq);

  for (let i = 1; i < attempts; i++) {
    const shuffled = shuffleArray(active);
    const groups = splitIntoGroups(shuffled, groupSize);
    const score = scoreGroups(groups, freq);
    if (score < bestScore) {
      bestScore = score;
      bestGroups = groups;
    }
  }

  return bestGroups;
}
