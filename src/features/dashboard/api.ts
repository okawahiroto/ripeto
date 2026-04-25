import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db, auth } from '@/src/lib/firebase';
import type { Goal } from '@/src/types/models';
import { fetchActiveGoals } from '@/src/features/goals/api';

export interface DashboardStats {
  /** 直近3件のアクティブゴール（残り日数付き） */
  upcomingGoals: Array<Goal & { daysUntil: number }>;
  /** アクティブゴール総数 */
  goalCount: number;
  /** 全曲数（アクティブゴール配下） */
  pieceCount: number;
  /** 全練習箇所数（アクティブゴール配下） */
  sectionCount: number;
  /** 全練習回数合計 */
  totalPracticeCount: number;
}

function calcDaysUntil(date: Date): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('未認証');

  const goals = await fetchActiveGoals();
  const goalCount = goals.length;

  const upcomingGoals = goals
    .slice(0, 3)
    .map((g) => ({ ...g, daysUntil: calcDaysUntil(g.eventDate) }));

  let pieceCount = 0;
  let sectionCount = 0;
  let totalPracticeCount = 0;

  // ゴールごとに曲・練習箇所を集計（クライアント側集計）
  await Promise.all(
    goals.map(async (goal) => {
      const piecesSnap = await getDocs(
        query(collection(db, 'users', uid, 'goals', goal.id, 'pieces'), orderBy('createdAt', 'asc'))
      );
      pieceCount += piecesSnap.size;

      await Promise.all(
        piecesSnap.docs.map(async (pieceDoc) => {
          const sectionsSnap = await getDocs(
            query(
              collection(db, 'users', uid, 'goals', goal.id, 'pieces', pieceDoc.id, 'sections'),
              orderBy('createdAt', 'asc')
            )
          );
          sectionCount += sectionsSnap.size;
          sectionsSnap.docs.forEach((s) => {
            totalPracticeCount += (s.data().practiceCount as number) ?? 0;
          });
        })
      );
    })
  );

  return { upcomingGoals, goalCount, pieceCount, sectionCount, totalPracticeCount };
}
