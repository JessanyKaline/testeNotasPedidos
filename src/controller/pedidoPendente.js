const fs = require("fs");

const notasDiretorio = "../model/notas";
const notasArquivos = fs.readdirSync(notasDiretorio);

const pedidosDiretorio = "../model/pedidos";
const pedidosArquivos = fs.readdirSync(pedidosDiretorio);

let existemPedidosPendentes = false;

for (const pedidoArquivo of pedidosArquivos) {
  const numeroPedido = pedidoArquivo.match(/\d+/)[0];
  const pedidoContent = fs.readFileSync(
    `${pedidosDiretorio}/${pedidoArquivo}`,
    "utf-8"
  );

  for (const linhaPedido of pedidoContent.trim().split("\n")) {
    const pedido = JSON.parse(linhaPedido);
    const idItem = pedido.número_item;
    const quantidadePedida = pedido.quantidade_produto;
    let quantidadeAtendida = 0;

    for (const notaArquivo of notasArquivos) {
      const notaContent = fs.readFileSync(
        `${notasDiretorio}/${notaArquivo}`,
        "utf-8"
      );

      for (const linhaNota of notaContent.trim().split("\n")) {
        const nota = JSON.parse(linhaNota);
        const idPedido = nota.id_pedido;
        const numeroItem = nota.número_item;
        const quantidadeNota = nota.quantidade_produto;

        if (idPedido == numeroPedido && numeroItem == idItem) {
          quantidadeAtendida += quantidadeNota;
        }
      }
    }

    if (quantidadeAtendida < quantidadePedida) {
      console.log(`O item ${idItem} do pedido ${numeroPedido} está pendente.`);
      existemPedidosPendentes = true;
    } else if (quantidadeAtendida > quantidadePedida) {
      throw new Error(
        `Quantidade atendida maior do que a quantidade pedida para o item ${idItem} do pedido ${numeroPedido}.`
      );
    }
  }
}

if (!existemPedidosPendentes) {
  console.log("Não há pedidos pendentes.");
}

