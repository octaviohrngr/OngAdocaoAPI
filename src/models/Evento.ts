import mongoose, { Document, Schema } from "mongoose";

export interface IEventoDocument extends Document {
  titulo: string;
  dataHora: Date;
  localizacao: string;
  descricao: string;
}

const EventoSchema = new Schema<IEventoDocument>(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
    },

    dataHora: {
      type: Date,
      required: true,
    },

    localizacao: {
      type: String,
      required: true,
      trim: true,
    },

    descricao: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IEventoDocument>("Evento", EventoSchema);