import { Document } from "mongoose";


export interface IAnimal extends Document {
  nome: string;
  especie: "gato" | "cachorro";
  raca: string;
  idadeEstimada: number;
  porte: "pequeno" | "médio" | "grande";
  foto1: string;
  foto2: string;
  status: "disponivel" | "em_processo" | "adotado";
  temperamento: string;
  historicoVacina: string;
}