import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../interfaces/IUser";

export interface IUserDocument extends IUser, Document {}

const UserSchema = new Schema<IUserDocument>(
  {
    nome: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    telefone: {
      type: String,
      required: true,
      trim: true,
    },

    senha: {
      type: String,
      required: true,
    },

    tipo: {
      type: String,
      enum: ["admin", "adotante"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUserDocument>("User", UserSchema);