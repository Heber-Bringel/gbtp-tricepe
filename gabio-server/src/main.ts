import { ComunicadorServer } from "./comunicacao/comunicadorServer"

let comunicador: ComunicadorServer = new ComunicadorServer();

comunicador.startServer(7001);