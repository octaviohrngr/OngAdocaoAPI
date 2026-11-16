
import { Document, Types } from "mongoose";

export interface INotificacao extends Document {
  usuarioId: Types.ObjectId;
  formularioId: Types.ObjectId;
  titulo: string;
  mensagem: string;
  tipo: "nova_solicitacao" | "adocao_aprovada" | "adocao_negada";
  lida: boolean;
  createdAt: Date;
  updatedAt: Date;
}
