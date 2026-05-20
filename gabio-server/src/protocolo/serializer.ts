import { GbtpProtocolError, GbtpResponse } from '../types/protocol';

const ALLOWED_STATUS = ['OK', 'ERROR'];

function formatBalance(balance: number | null): string {
    if (balance === null) {
        return '';
    }

    if (!Number.isFinite(balance)) {
        throw new GbtpProtocolError('BALANCE invalido para serializacao.');
    }

    return balance.toFixed(2);
}

export function serializeResponse(response: GbtpResponse): string {
    if (!ALLOWED_STATUS.includes(response.status)) {
        throw new GbtpProtocolError('STATUS invalido para serializacao.');
    }

    if (response.message.trim().length === 0) {
        throw new GbtpProtocolError('MESSAGE nao pode ser vazio.');
    }

    const safeMessage = response.message.replace(/\r?\n/g, ' ');

    return [
        `STATUS:${response.status}`,
        `MESSAGE:${safeMessage}`,
        `BALANCE:${formatBalance(response.balance)}`
    ].join('\n');
}
