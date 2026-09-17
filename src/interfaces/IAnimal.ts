export interface IAnimal {
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