import mongoose, {Document} from "mongoose";

export interface IFormularioDocument extends Document {
    usuarioId: mongoose.Types.ObjectId;
    animalId: mongoose.Types.ObjectId;
    nome: string;
    email: string;
    telefone: string;
    tipoMoradia: string;
    tempoMedioSozinho: string;
    mensagem: string;
    status: "em_analise" | "finalizado_ok" | "negado";
    aceitarTermos: boolean;
}