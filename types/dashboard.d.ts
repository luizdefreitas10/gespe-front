declare interface IOverviewBalanceSummary {
  total: number;
  used: number;
  available: number;
}

declare interface IOverviewYearBalance extends IOverviewBalanceSummary {
  year: number;
}

declare interface IVacationOverviewResponse {
  userId: string;
  recordsCount: number;
  totalBalance: IOverviewBalanceSummary;
  yearBalances: IOverviewYearBalance[];
  vacations: IVacation[];
}

declare interface ITreOverviewYearBalance extends IOverviewYearBalance {
  recordsCount: number;
}

declare interface ITreOverviewResponse {
  userId: string;
  selectedYear: number | null;
  totalRecordsCount: number;
  filteredRecordsCount: number;
  totalBalance: IOverviewBalanceSummary;
  yearBalances: ITreOverviewYearBalance[];
  tres: ITre[];
}
