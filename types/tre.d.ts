declare interface ITreBalanceResponse {
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

declare interface ITre {
    id: string;
    userId: string;
    firstTreDay: string | null;
    lastTreDay: string | null;
    treSeiNumber: string | null;
    requestType: string | null;
    yearOfAcquisition: number | null;
    amoutOfTreDays: number;
    observations: string | null;
    effectiveEnjoyment: string | null;
    createdAt: string;
    updatedAt: string | null;
}

