declare interface IVacationBalanceResponse {
    userId: string;
    total: number;
    used: number;
    available: number;
    recordsCount: number;
    overallBalance: {
        total: number;
        used: number;
        available: number;
        recordsCount: number;
    };
    year: number | null;
    message: string;
}

declare interface IVacation {
    id: string;
    userId: string;
    firstVacationDay: string;
    lastVacationDay: string;
    vacationSeiNumber: string | null;
    requestType: string | null;
    year: number | null;
    amoutOfVacationDays: number;
    observations: string | null;
    effectiveEnjoyment: boolean | null;
    createdAt: string;
    updatedAt: string;
}