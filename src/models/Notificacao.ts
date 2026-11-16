
import mongoose, { Schema } from "mongoose";
import { INotificacao } from "../interfaces/INotificacao";

const NotificacaoSchema = new Schema<INotificacao>(
  {
    usuarioId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    formularioId: {
      type: Schema.Types.ObjectId,
      ref: "Formulario",
      required: true,
    },

    titulo: {
      type: String,
      required: true,
      trim: true,
    },

    mensagem: {
      type: String,
      required: true,
      trim: true,
    },

    tipo: {
      type: String,
      enum: [
        "nova_solicitacao",
        "adocao_aprovada",
        "adocao_negada",
      ],
      required: true,
},

    lida: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


NotificacaoSchema.index({
  usuarioId: 1,
  createdAt: -1,
});

NotificacaoSchema.index(
  { formularioId: 1, tipo: 1, usuarioId: 1 },
  { unique: true }
);


export default mongoose.model<INotificacao>(
  "Notificacao",
  NotificacaoSchema
);
