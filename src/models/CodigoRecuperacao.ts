
import mongoose, { Schema } from "mongoose";

const CodigoRecuperacaoSchema = new Schema(
  {
    usuarioId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    codigoHash: {
      type: String,
      required: true,
    },

    tentativas: {
      type: Number,
      default: 0,
    },

    expiraEm: {
      type: Date,
      required: true,
    },

    verificado: {
      type: Boolean,
      default: false,
    },

    tokenHash: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

CodigoRecuperacaoSchema.index(
  { expiraEm: 1 },
  { expireAfterSeconds: 0 }
);

export default mongoose.model(
  "CodigoRecuperacao",
  CodigoRecuperacaoSchema
);
