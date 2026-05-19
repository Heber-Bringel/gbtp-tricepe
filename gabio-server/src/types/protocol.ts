export type GbtpOperation = 'BALANCE' | 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER';

export type GbtpStatus = 'OK' | 'ERROR';

export interface GbtpRequest {
    operation: GbtpOperation;
    accountId: number;
    toAccountId: number | null;
    value: number;
}

export interface GbtpResponse {
    status: GbtpStatus;
    message: string;
    balance: number | null;
}

export class GbtpProtocolError extends Error {
    public readonly code: string;

    constructor(message: string, code = 'PROTOCOL_ERROR') {
        super(message);
        this.name = 'GbtpProtocolError';
        this.code = code;
    }
}
