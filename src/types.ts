export interface Person {
  id: string;
  name: string;
  archived?: boolean;
}

export interface ShuffleGroup {
  memberIds: string[];
}

export interface MonthRecord {
  id: string;
  label: string;
  groups: ShuffleGroup[];
  createdAt: string;
}

export interface AppData {
  people: Person[];
  history: MonthRecord[];
  groupSize: number;
}
