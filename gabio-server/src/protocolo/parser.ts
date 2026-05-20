import { GbtpOperation, GbtpProtocolError, GbtpRequest } from '../types/protocol';

const REQUIRED_KEYS = ['OPERATION', 'ACCOUNT_ID', 'TO_ACCOUNT_ID', 'VALUE'] as const;
const ALLOWED_OPERATIONS: GbtpOperation[] = ['BALANCE', 'DEPOSIT', 'WITHDRAW', 'TRANSFER'];

function parsePositiveInteger(value: string, fieldName: string): number {
    if (!/^\d+$/.test(value)) {
        throw new GbtpProtocolError(`Campo ${fieldName} deve ser inteiro positivo.`);
    }

    return Number(value);
}

function parseNonNegativeNumber(value: string, fieldName: string): number {
    if (value.length === 0) {
        throw new GbtpProtocolError(`Campo ${fieldName} nao pode ser vazio.`);
    }

    const parsed = Number(value);

    if (!Number.isFinite(parsed) || parsed < 0) {
        throw new GbtpProtocolError(`Campo ${fieldName} deve ser numero nao negativo.`);
    }

    return parsed;
}

export function parseRequest(rawMessage: string): GbtpRequest {
    if (!rawMessage || rawMessage.trim().length === 0) {
        throw new GbtpProtocolError('Mensagem vazia.');
    }

    const normalized = rawMessage.replace(/\r\n/g, '\n').trim();
    const lines = normalized.split('\n').filter((line) => line.trim().length > 0);
    const fields = new Map<string, string>();

    for (const line of lines) {
        const separatorIndex = line.indexOf(':');

        if (separatorIndex <= 0) {
            throw new GbtpProtocolError(`Linha invalida: "${line}". Use CHAVE:VALOR.`);
        }

        const key = line.slice(0, separatorIndex).trim();
        const value = line.slice(separatorIndex + 1).trim();

        if (!REQUIRED_KEYS.includes(key as (typeof REQUIRED_KEYS)[number])) {
            throw new GbtpProtocolError(`Campo desconhecido: ${key}.`);
        }

        if (fields.has(key)) {
            throw new GbtpProtocolError(`Campo duplicado: ${key}.`);
        }

        fields.set(key, value);
    }

    for (const requiredKey of REQUIRED_KEYS) {
        if (!fields.has(requiredKey)) {
            throw new GbtpProtocolError(`Campo obrigatorio ausente: ${requiredKey}.`);
        }
    }

    const operation = fields.get('OPERATION') as string;

    if (!ALLOWED_OPERATIONS.includes(operation as GbtpOperation)) {
        throw new GbtpProtocolError(`Operacao invalida: ${operation}.`);
    }

    const accountId = parsePositiveInteger(fields.get('ACCOUNT_ID') as string, 'ACCOUNT_ID');
    const toAccountRaw = fields.get('TO_ACCOUNT_ID') as string;
    const value = parseNonNegativeNumber(fields.get('VALUE') as string, 'VALUE');

    const toAccountId = toAccountRaw === ''
        ? null
        : parsePositiveInteger(toAccountRaw, 'TO_ACCOUNT_ID');

    if (operation === 'TRANSFER' && toAccountId === null) {
        throw new GbtpProtocolError('TRANSFER exige TO_ACCOUNT_ID preenchido.');
    }

    if (operation !== 'TRANSFER' && toAccountId !== null) {
        throw new GbtpProtocolError(`${operation} nao deve enviar TO_ACCOUNT_ID.`);
    }

    return {
        operation: operation as GbtpOperation,
        accountId,
        toAccountId,
        value
    };
}
