import mongoose, { Schema } from "mongoose";
import { IFormularioDocument } from "../interfaces/IFormulario";

const FormularioSchema = new Schema<IFormularioDocument>(
  {
    usuarioId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    animalId: {
      type: Schema.Types.ObjectId,
      ref: "Animal",
      required: true,
    },

    nome: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    telefone: {
      type: String,
      required: true,
      trim: true,
    },

    tipoMoradia: {
      type: String,
      required: true,
      trim: true,
    },

    tempoMedioSozinho: {
      type: String,
      required: true,
      trim: true,
    },

    mensagem: {
      type: String,
      required: true,
      trim: true,
    },

    aceitarTermos: {
      type: Boolean,
      required: true,
    },
    status: {
      type: String,
      enum: ["em_analise", "finalizado_ok", "negado"],
      default: "em_analise",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


FormularioSchema.index(
  { usuarioId: 1, animalId: 1 },
  { unique: true }
);


export default mongoose.model<IFormularioDocument>(
  "Formulario",
  FormularioSchema
);