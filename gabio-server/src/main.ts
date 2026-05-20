import { ComunicadorServer } from "./comunicacao/comunicadorServer"
import { processarMensagemGBTP } from "./protocolo";

let comunicador: ComunicadorServer = new ComunicadorServer();

comunicador.setOnRequest((msg: string) => processarMensagemGBTP(msg));

comunicador.startServer(7001);