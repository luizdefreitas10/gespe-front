/** Monta o payload de overview de férias a partir do usuário (mesma fonte da lista em visualização geral). */
export function buildVacationOverviewFromUser(user: IUser): IVacationOverviewResponse {
  const vacations = (user.vacation ?? []) as IVacation[];
  const yearMap = new Map<number, { total: number; used: number }>();

  for (const v of vacations) {
    const y =
      v.year ??
      (v.firstVacationDay ? new Date(v.firstVacationDay).getFullYear() : new Date().getFullYear());
    const days = Number(v.amoutOfVacationDays) || 0;
    const cur = yearMap.get(y) ?? { total: 0, used: 0 };
    cur.total += days;
    if (v.effectiveEnjoyment === true) {
      cur.used += days;
    }
    yearMap.set(y, cur);
  }

  const yearBalances: IOverviewYearBalance[] = Array.from(yearMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([year, { total, used }]) => ({
      year,
      total,
      used,
      available: Math.max(0, total - used),
    }));

  const aggregated = yearBalances.reduce(
    (acc, yb) => ({
      total: acc.total + yb.total,
      used: acc.used + yb.used,
      available: acc.available + yb.available,
    }),
    { total: 0, used: 0, available: 0 }
  );

  const totalBalance =
    aggregated.total > 0
      ? aggregated
      : {
          total: user.totalVacationDays ?? 0,
          used: 0,
          available: user.totalVacationDays ?? 0,
        };

  return {
    userId: user.id,
    recordsCount: vacations.length,
    totalBalance,
    yearBalances,
    vacations,
  };
}

function treEffectiveEnjoyed(effective: string | boolean | null | undefined): boolean {
  return effective === true || effective === "YES";
}

/** Monta o payload de overview de TRE a partir do usuário. */
export function buildTreOverviewFromUser(user: IUser): ITreOverviewResponse {
  const tres = (user.tre ?? []) as ITre[];
  const yearMap = new Map<number, { total: number; used: number; records: number }>();

  for (const t of tres) {
    const rawY =
      t.yearOfAcquisition ??
      (t.firstTreDay ? new Date(t.firstTreDay).getFullYear() : null) ??
      (t.createdAt ? new Date(t.createdAt).getFullYear() : new Date().getFullYear());
    const y = Number(rawY);
    if (Number.isNaN(y)) continue;
    const days = Number(t.amoutOfTreDays) || 0;
    const cur = yearMap.get(y) ?? { total: 0, used: 0, records: 0 };
    cur.records += 1;
    cur.total += days;
    if (treEffectiveEnjoyed(t.effectiveEnjoyment)) {
      cur.used += days;
    }
    yearMap.set(y, cur);
  }

  const yearBalances = Array.from(yearMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([year, { total, used, records }]) => ({
      year,
      total,
      used,
      available: Math.max(0, total - used),
      recordsCount: records,
    }));

  const aggregated = yearBalances.reduce(
    (acc, yb) => ({
      total: acc.total + yb.total,
      used: acc.used + yb.used,
      available: acc.available + yb.available,
    }),
    { total: 0, used: 0, available: 0 }
  );

  const totalBalance =
    aggregated.total > 0
      ? aggregated
      : {
          total: user.totalTreDays ?? 0,
          used: 0,
          available: user.totalTreDays ?? 0,
        };

  return {
    userId: user.id,
    selectedYear: null,
    totalRecordsCount: tres.length,
    filteredRecordsCount: tres.length,
    totalBalance,
    yearBalances,
    tres,
  };
}
