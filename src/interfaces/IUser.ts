export interface IUser {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  tipo: "admin" | "adotante";
}