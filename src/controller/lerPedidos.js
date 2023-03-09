const fs = require("fs");


const pedidosDiretorio = "../model/pedidos";
const pedidosArquivos = fs.readdirSync(pedidosDiretorio);
console.log(pedidosArquivos)

for (const pedidoArquivo of pedidosArquivos) {
  const pedidoContent = fs.readFileSync(
    `${pedidosDiretorio}/${pedidoArquivo}`,
    "utf-8"
  );

  
  const pedidoLinha = pedidoContent.trim().split("\n");

  const numerosItemVistos = {};
  let maiorNumeroItem = 0;

  for (const linha of pedidoLinha) {
    const pedido = JSON.parse(linha);

    if (typeof pedido.código_produto !== "string") {
      throw new Error(
        `Tipo de dado inválido no código do pedido ${pedidoArquivo}`
      );
    }
    if (
      typeof pedido.número_item !== "number" ||
      !pedido.hasOwnProperty("número_item") ||
      pedido.número_item <= 0
    ) {
      throw new Error(
        `Valor inválido ou faltante no item do pedido ${pedidoArquivo}`
      );
    }
    
  
    if (numerosItemVistos.hasOwnProperty(pedido.número_item)) {
        throw new Error(
          `Repetição de número_item ${pedido.número_item} no pedido ${pedidoArquivo}`
        );
      } else {
        numerosItemVistos[pedido.número_item] = true;
        if (pedido.número_item > maiorNumeroItem) {
          maiorNumeroItem = pedido.número_item;
        }
      } 

    if (
      typeof pedido.quantidade_produto !== "number" ||
      !pedido.hasOwnProperty("quantidade_produto") ||
      pedido.quantidade_produto <= 0
    ) {
      throw new Error(
        `Acrescente uma quantidade válida de produtos ${pedidoArquivo}`
      );
      }

    const valorStringQuantidade = pedido.valor_unitário_produto;
    const valorNumQuantidade = parseFloat(valorStringQuantidade.replace(",", "."));
    const regex = /^\d+(\.\d{1,2})?$/;

    if (
        (!regex.test(valorNumQuantidade.toFixed(2))) ||
        pedido.valor_unitário_produto  <= 0 
      ) {
        throw new Error(
          `Valor unitário do produto inválido ${pedidoArquivo}`
        );

      
    }
  }
}
