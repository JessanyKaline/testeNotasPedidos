# Teste de Back-end - Processo Seletivo

Seguindo o enunciado proposto e o princípio da arquitetura MVC, desenvolvi uma aplicação Javascript que roda em Node.js. Minha lógica foi desenvolvida a partir dos arquivos na pasta src/controller, na seguinte ordem:
- lerPedidos.js
- lerNotas.js
- pedidoPendente.js
- gravarPendente.js

E os diretórios dos pedidos e notas estão na pasta src/model. 

É possível executar cada arquivo separadamente rodando "node lerNotas.js" ou qualquer outro no terminal, nesse caso cada arquivo possui uma finalidade pedida no enunciado. Fiz isso para ser possível acompanhar minha linha de raciocínio para desenvolvimento completo do que foi solicitado. 

Portanto o programa é rodado na pasta src no arquivo 'app.js', basta rodar no terminal "node app.js" isso gerará um arquivo .txt com os pedidos pendentes e suas informações. Sugiro após clonar excluir o arquivo 'pedidosPendentes.txt' para gerar um novo arquivo .txt.
