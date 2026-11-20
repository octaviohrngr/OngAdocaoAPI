import { Document } from "mongoose";

export interface IEvento extends Document {
  titulo: string;
  dataHora: Date;
  localizacao: string;
  descricao: string;
  foto?: string;
}