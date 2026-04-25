export type GoalStatus = 'active' | 'completed';

export interface Goal {
  id: string;
  title: string;
  eventDate: Date;
  status: GoalStatus;
  createdAt: Date;
  completedAt?: Date;
}

export interface Piece {
  id: string;
  goalId: string;
  title: string;
  createdAt: Date;
}

export interface Section {
  id: string;
  pieceId: string;
  goalId: string;
  title: string;
  practiceCount: number;
  createdAt: Date;
}

export interface PracticeLog {
  id: string;
  sectionId: string;
  pieceId: string;
  goalId: string;
  note: string;
  createdAt: Date;
}

export type StarLevel = 'empty' | 'yellow' | 'gold' | 'rainbow';

export function getStarLevel(count: number): StarLevel {
  if (count === 0) return 'empty';
  if (count < 10) return 'yellow';
  if (count < 100) return 'gold';
  return 'rainbow';
}
