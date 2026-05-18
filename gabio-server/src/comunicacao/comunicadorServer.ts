import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';

export class ComunicadorServer {
    private onRequestCallback: ((msg: string) => string) | null = null;

    public startServer(porta: number) {
        const httpServer: http.Server = http.createServer((req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('WebSocket server is running');
        });

        const wss: WebSocketServer = new WebSocketServer({ server: httpServer });

        wss.on('connection', (ws: WebSocket) => {
            console.log('Novo cliente conectado');

            ws.on('message', (data: any) => {
                const msg: string = data.toString();
                console.log(`Mensagem recebida do cliente: ${msg}`);

                let response = msg;
                if (this.onRequestCallback) {
                    response = this.onRequestCallback(msg);
                }

                ws.send(response);
                ws.close();
            });

            ws.on('close', () => console.log('Cliente desconectado'));
        });

        httpServer.listen(porta, () => console.log(`Servidor WebSocket ouvindo na porta ${porta}`));
    }

    public setOnRequest(callback: (msg: string) => string) {
        this.onRequestCallback = callback;
    }

}