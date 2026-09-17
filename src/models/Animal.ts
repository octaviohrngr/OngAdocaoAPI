import mongoose, { Document, Schema } from "mongoose";

export interface IAnimalDocument extends Document {
  nome: string;
  especie: "gato" | "cachorro";
  raca: string;
  idadeEstimada: number;
  porte: "pequeno" | "médio" | "grande";
  foto1: string;
  foto2: string;
  temperamento: string;
  historicoVacina: string;
}

const AnimalSchema = new Schema<IAnimalDocument>(
  {
    nome: {
      type: String,
      required: true,
      trim: true,
    },

    especie: {
      type: String,
      enum: ["gato", "cachorro"],
      required: true,
    },

    raca: {
      type: String,
      required: true,
      trim: true,
    },

    idadeEstimada: {
      type: Number,
      required: true,
      min: 0,
    },

    porte: {
      type: String,
      enum: ["pequeno", "médio", "grande"],
      required: true,
    },

    foto1: {
      type: String,
      required: true,
    },

    foto2: {
      type: String,
      required: true,
    },

    temperamento: {
      type: String,
      required: true,
      trim: true,
    },

    historicoVacina: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAnimalDocument>(
  "Animal",
  AnimalSchema
);