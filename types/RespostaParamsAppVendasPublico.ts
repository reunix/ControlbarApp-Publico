export interface ProdutoParamsAppVendasPublico {
  idProduto: number;
  nomeProduto: string;
  grupoProduto: string;
  valorProduto: number;
  imagemProduto: string | null;
}

export interface FormaPagtoParamsAppVendasPublico {
  nomeFormapagto: string;
  idFormapagto: number;
}

export interface RespostaParamsAppVendasPublico {
  produtos: ProdutoParamsAppVendasPublico[];
  formaspagto: FormaPagtoParamsAppVendasPublico[] ;
}