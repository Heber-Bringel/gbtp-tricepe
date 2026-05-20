import { parseRequest } from './parser';
import { serializeResponse } from './serializer';
import { GbtpProtocolError } from '../types/protocol';

export function processarMensagemGBTP(rawMessage: string): string {
	try {
		const request = parseRequest(rawMessage);

		return serializeResponse({
			status: 'OK',
			message: `Mensagem ${request.operation} valida e parseada com sucesso.`,
			balance: null
		});
	} catch (error) {
		const message = error instanceof GbtpProtocolError
			? error.message
			: 'Erro inesperado ao processar mensagem.';

		return serializeResponse({
			status: 'ERROR',
			message,
			balance: null
		});
	}
}
