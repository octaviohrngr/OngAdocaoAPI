import mongoose, {Document} from "mongoose";

export interface IFormularioDocument extends Document {
    usuarioId: mongoose.Types.ObjectId;
    nome: string;
    email: string;
    telefone: string;
    tipoMoradia: string;
    tempoMedioSozinho: string;
    mensagem: string;
    aceitarTermos: boolean;
}