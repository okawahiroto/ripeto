import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db, auth } from '@/src/lib/firebase';
import { incrementPracticeCount } from '@/src/features/sections/api';
import type { PracticeLog } from '@/src/types/models';

function logsCol(goalId: string, pieceId: string, sectionId: string) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('未認証');
  return collection(
    db,
    'users',
    uid,
    'goals',
    goalId,
    'pieces',
    pieceId,
    'sections',
    sectionId,
    'logs'
  );
}

function toLog(
  id: string,
  data: Record<string, unknown>,
  sectionId: string,
  pieceId: string,
  goalId: string
): PracticeLog {
  return {
    id,
    sectionId,
    pieceId,
    goalId,
    note: data.note as string,
    createdAt: (data.createdAt as Timestamp).toDate(),
  };
}

/** 練習ログを追加し、practiceCount を +1 する */
export async function addLog(
  goalId: string,
  pieceId: string,
  sectionId: string,
  note: string
): Promise<PracticeLog> {
  const [ref] = await Promise.all([
    addDoc(logsCol(goalId, pieceId, sectionId), {
      note,
      createdAt: Timestamp.now(),
    }),
    incrementPracticeCount(goalId, pieceId, sectionId),
  ]);

  return {
    id: ref.id,
    sectionId,
    pieceId,
    goalId,
    note,
    createdAt: new Date(),
  };
}

export async function fetchLogs(
  goalId: string,
  pieceId: string,
  sectionId: string
): Promise<PracticeLog[]> {
  const q = query(logsCol(goalId, pieceId, sectionId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) =>
    toLog(d.id, d.data() as Record<string, unknown>, sectionId, pieceId, goalId)
  );
}
