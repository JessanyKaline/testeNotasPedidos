const fs = require("fs");

const notasDiretorio = "../model/notas";
const notasArquivos = fs.readdirSync(notasDiretorio);

const pedidosDiretorio = "../model/pedidos";
const pedidosArquivos = fs.readdirSync(pedidosDiretorio);

for (const pedidoArquivo of pedidosArquivos) {
  const numeroPedido = pedidoArquivo.match(/\d+/)[0];
  const pedidoContent = fs.readFileSync(
    `${pedidosDiretorio}/${pedidoArquivo}`,
    "utf-8"
  );

  const pedidoLinha = pedidoContent.trim().split("\n");

  for (const linha of pedidoLinha) {
    try {
      const pedido = JSON.parse(linha);

      for (const notaArquivo of notasArquivos) {
        const notaContent = fs.readFileSync(
          `${notasDiretorio}/${notaArquivo}`,
          "utf-8"
        );

        const notaLinha = notaContent.trim().split("\n");

        for (const linha of notaLinha) {
          try {
            const nota = JSON.parse(linha);

            if (
              nota.id_pedido == numeroPedido &&
              nota.número_item == pedido.número_item
            ) {
              console.log(
                `Pedido ${numeroPedido} encontrado na nota ${notaArquivo}`
              );
            }
          } catch (err) {
            throw new Error(
              `Erro ao ler arquivo ${notaArquivo}: ${err.message}`
            );
          }
        }
      }
    } catch (err) {
      throw new Error(
        `Erro ao ler arquivo ${pedidoArquivo}: ${err.message}`
      );
    }
  }
}
