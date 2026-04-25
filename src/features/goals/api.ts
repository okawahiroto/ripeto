import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db, auth } from '@/src/lib/firebase';
import type { Goal, GoalStatus } from '@/src/types/models';

function goalsCol() {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('未認証');
  return collection(db, 'users', uid, 'goals');
}

function toGoal(id: string, data: Record<string, unknown>): Goal {
  return {
    id,
    title: data.title as string,
    eventDate: (data.eventDate as Timestamp).toDate(),
    status: data.status as GoalStatus,
    createdAt: (data.createdAt as Timestamp).toDate(),
    completedAt: data.completedAt ? (data.completedAt as Timestamp).toDate() : undefined,
  };
}

export async function createGoal(title: string, eventDate: Date): Promise<Goal> {
  const ref = await addDoc(goalsCol(), {
    title,
    eventDate: Timestamp.fromDate(eventDate),
    status: 'active',
    createdAt: Timestamp.now(),
  });
  return {
    id: ref.id,
    title,
    eventDate,
    status: 'active',
    createdAt: new Date(),
  };
}

export async function fetchActiveGoals(): Promise<Goal[]> {
  const q = query(goalsCol(), where('status', '==', 'active'), orderBy('eventDate', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toGoal(d.id, d.data() as Record<string, unknown>));
}

export async function completeGoal(goalId: string): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('未認証');
  await updateDoc(doc(db, 'users', uid, 'goals', goalId), {
    status: 'completed',
    completedAt: Timestamp.now(),
  });
}
