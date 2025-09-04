import { ProdutoParamsAppVendasPublico } from "./RespostaParamsAppVendasPublico";

// export interface Product {
//   id: number;
//   nome: string;
//   grupo: string;
//   valor: number;
//   image?: string;
// }

export interface CartItem extends ProdutoParamsAppVendasPublico {
  quantity: number;
}

export interface GroupedProducts {
  grupoProduto: string;
  data: ProdutoParamsAppVendasPublico[];
}