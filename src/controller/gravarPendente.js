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

    let pedidosPendentes = [];

    if (quantidadeAtendida < quantidadePedida) {
      existemPedidosPendentes = true;

      const saldoQuantidade = quantidadePedida - quantidadeAtendida;

      pedidosPendentes.push({
        numeroPedido: numeroPedido,
        idItem: idItem,
        quantidadePedida: quantidadePedida,
        quantidadeNota: quantidadeAtendida,
        saldoQuantidade: saldoQuantidade,
        valorPedido: pedido.valor_unitário_produto,
      });

      const pedidosPendentesAgrupados = {};
      let listagemPendentes = "";

      for (const pedido of pedidosPendentes) {
        const numeroPedido = pedido.numeroPedido;
        const itensPendentes = pedidosPendentesAgrupados[numeroPedido] || [];

        itensPendentes.push(
          `Número do item: ${pedido.idItem}, Saldo da quantidade: ${pedido.saldoQuantidade}`
        );

        pedidosPendentesAgrupados[numeroPedido] = itensPendentes;

        const saldoValorItem =
          parseFloat(pedido.valorPedido.replace(",", ".")) *
          pedido.saldoQuantidade;
        const valorUnitario = parseFloat(pedido.valorPedido.replace(",", "."));
        let valorTotalPedido = pedidosPendentesAgrupados[numeroPedido].reduce(
          (total, item) => {
            const saldo = parseFloat(
              item.match(/Saldo da quantidade: (\d+)/)[1]
            );
            return total + saldo * valorUnitario;
          },
          0
        );


        listagemPendentes += `Número do pedido: ${numeroPedido}\n`;
        listagemPendentes += `Valor total do pedido: R$ ${valorTotalPedido.toFixed(
          2
        )}\n`;
        listagemPendentes += `${itensPendentes.join("\n")}\n`;
        listagemPendentes += `Valor por unidade: R$ ${valorUnitario.toFixed(
          2
        )}\n`;
        listagemPendentes += `Saldo do valor do item: R$ ${saldoValorItem.toFixed(
          2
        )}\n\n`;
      }

      fs.appendFileSync("pedidosPendentes.txt", listagemPendentes, "utf8");
    
  }
  if (quantidadeAtendida > quantidadePedida) {
    throw new Error(
      `Quantidade atendida maior do que a quantidade pedida para o item ${idItem} do pedido ${numeroPedido}.`
    );
  }
}
}

if (!existemPedidosPendentes) {
  console.log("Não há pedidos pendentes.");
}
