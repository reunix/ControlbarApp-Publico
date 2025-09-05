export interface EventosAbertos {
  idEvento: number;
  nomeEvento: string;
  nomeCliente: string;
  imagemEvento: string | null;
  latitude:number;
  longitude:number;
  enderecoCompleto:string;
  autopagto: boolean;
}