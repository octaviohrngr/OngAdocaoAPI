import mongoose, { Document, Schema } from "mongoose";
import { IAnimal } from "../interfaces/IAnimal";

const AnimalSchema = new Schema<IAnimal>(
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

    status: {
      type: String,
      enum: ["disponivel", "em_processo", "adotado"],
      default: "disponivel",
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

export default mongoose.model<IAnimal>(
  "Animal",
  AnimalSchema
);