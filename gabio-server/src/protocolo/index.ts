import { parseRequest } from './parser';
import { serializeResponse } from './serializer';
import { GbtpProtocolError } from '../types/protocol';
import { processarOperacao } from '../regras-de-negocio';

export function processarMensagemGBTP(rawMessage: string): string {
	try {
		const request = parseRequest(rawMessage);
		const response = processarOperacao(request);

		return serializeResponse(response);
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