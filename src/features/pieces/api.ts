import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db, auth } from '@/src/lib/firebase';
import type { Piece } from '@/src/types/models';

function piecesCol(goalId: string) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('未認証');
  return collection(db, 'users', uid, 'goals', goalId, 'pieces');
}

function toPiece(id: string, data: Record<string, unknown>, goalId: string): Piece {
  return {
    id,
    goalId,
    title: data.title as string,
    createdAt: (data.createdAt as Timestamp).toDate(),
  };
}

export async function createPiece(goalId: string, title: string): Promise<Piece> {
  const ref = await addDoc(piecesCol(goalId), {
    title,
    createdAt: Timestamp.now(),
  });
  return { id: ref.id, goalId, title, createdAt: new Date() };
}

export async function fetchPieces(goalId: string): Promise<Piece[]> {
  const q = query(piecesCol(goalId), orderBy('createdAt', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toPiece(d.id, d.data() as Record<string, unknown>, goalId));
}

export async function deletePiece(goalId: string, pieceId: string): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('未認証');
  await deleteDoc(doc(db, 'users', uid, 'goals', goalId, 'pieces', pieceId));
}
