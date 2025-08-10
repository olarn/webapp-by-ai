import * as TE from 'fp-ts/TaskEither';
import { Database } from 'sqlite3';
import { promisify } from 'util';

export interface AdminOverviewStats {
  months: string[]; // e.g., ['2025-06', '2025-07', '2025-08']
  newClassesPerMonth: number[];
  incomePerMonth: number[];
  pendingEnrollments: number;
}

export class AdminService {
  constructor(private db: Database) { }

  private all = promisify(this.db.all.bind(this.db)) as any;
  private get = promisify(this.db.get.bind(this.db)) as any;

  getOverviewStats = (): TE.TaskEither<Error, AdminOverviewStats> =>
    TE.tryCatch(
      async () => {
        // Build last 3 month labels including current month
        const now = new Date();
        const labels: string[] = [];
        for (let i = 2; i >= 0; i -= 1) {
          const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
          const ym = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
          labels.push(ym);
        }

        // Compute from SQLite using strftime('%Y-%m', created_at)
        const startBoundary = await this.get(
          "SELECT date('now','-2 months','start of month') as start"
        );
        const startDate = (startBoundary as any).start as string;

        const classesRows = await this.all(
          `SELECT strftime('%Y-%m', created_at) AS ym, COUNT(*) AS count
           FROM courses
           WHERE datetime(created_at) >= datetime(?)
           GROUP BY ym
           ORDER BY ym ASC`,
          [startDate]
        );

        const incomeRows = await this.all(
          `SELECT strftime('%Y-%m', created_at) AS ym, SUM(amount) AS total
           FROM payments
           WHERE status = 'completed' AND datetime(created_at) >= datetime(?)
           GROUP BY ym
           ORDER BY ym ASC`,
          [startDate]
        );

        const pendingRow = await this.get(
          `SELECT COUNT(*) AS pending FROM enrollments WHERE status = 'pending'`
        );

        const classesMap = new Map<string, number>();
        for (const r of classesRows as Array<{ ym: string; count: number }>) {
          classesMap.set(r.ym, Number(r.count));
        }

        const incomeMap = new Map<string, number>();
        for (const r of incomeRows as Array<{ ym: string; total: number }>) {
          incomeMap.set(r.ym, Number(r.total || 0));
        }

        const newClassesPerMonth = labels.map((l) => classesMap.get(l) || 0);
        const incomePerMonth = labels.map((l) => incomeMap.get(l) || 0);
        const pendingEnrollments = Number((pendingRow as any)?.pending || 0);

        return {
          months: labels,
          newClassesPerMonth,
          incomePerMonth,
          pendingEnrollments,
        };
      },
      (error) => new Error(`Failed to get admin overview stats: ${error}`)
    );
}


