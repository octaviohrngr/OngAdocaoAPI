
import mongoose, { Schema } from "mongoose";

import { IEvento } from "../interfaces/IEvento";

const EventoSchema = new Schema<IEvento>(
  {
    titulo: {
      type: String,
      required: true,
    },
    dataHora: {
      type: Date,
      required: true,
    },
    localizacao: {
      type: String,
      required: true,
    },
    descricao: {
      type: String,
      required: true,
    },
    foto: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IEvento>("Evento", EventoSchema);
