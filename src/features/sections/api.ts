import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  increment,
  Timestamp,
} from 'firebase/firestore';
import { db, auth } from '@/src/lib/firebase';
import type { Section } from '@/src/types/models';

function sectionsCol(goalId: string, pieceId: string) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('未認証');
  return collection(db, 'users', uid, 'goals', goalId, 'pieces', pieceId, 'sections');
}

function sectionDoc(goalId: string, pieceId: string, sectionId: string) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('未認証');
  return doc(db, 'users', uid, 'goals', goalId, 'pieces', pieceId, 'sections', sectionId);
}

function toSection(id: string, data: Record<string, unknown>, pieceId: string, goalId: string): Section {
  return {
    id,
    pieceId,
    goalId,
    title: data.title as string,
    practiceCount: data.practiceCount as number,
    createdAt: (data.createdAt as Timestamp).toDate(),
  };
}

export async function createSection(goalId: string, pieceId: string, title: string): Promise<Section> {
  const ref = await addDoc(sectionsCol(goalId, pieceId), {
    title,
    practiceCount: 0,
    createdAt: Timestamp.now(),
  });
  return { id: ref.id, pieceId, goalId, title, practiceCount: 0, createdAt: new Date() };
}

export async function fetchSections(goalId: string, pieceId: string): Promise<Section[]> {
  const q = query(sectionsCol(goalId, pieceId), orderBy('createdAt', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toSection(d.id, d.data() as Record<string, unknown>, pieceId, goalId));
}

/** practiceCount を1増やす（ログ追加と同時に呼ぶ） */
export async function incrementPracticeCount(goalId: string, pieceId: string, sectionId: string): Promise<void> {
  await updateDoc(sectionDoc(goalId, pieceId, sectionId), {
    practiceCount: increment(1),
  });
}

export async function deleteSection(goalId: string, pieceId: string, sectionId: string): Promise<void> {
  await deleteDoc(sectionDoc(goalId, pieceId, sectionId));
}
