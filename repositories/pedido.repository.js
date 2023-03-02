import { promises as fs } from "fs";

const { readFile, writeFile} = fs;

async function getPedidos() {
  const data  = JSON.parse (await readFile(global.fileName));

  return data.pedidos;
}

async function getPedido (id) {
  const pedidos = await getPedidos();

  const pedido = pedidos.find(
    pedido => pedido.id === parseInt(id)
  );

  if (pedido) {
    return pedido;
  }
  throw new Error ("Registro não encontrado.")

}

async function insertPedido (pedido) {
  const data  = JSON.parse (await readFile(global.fileName));

  pedido =  { 
    id: data.nextId++,
    cliente: pedido.cliente,
    produto: pedido.produto,
    valor: pedido.valor,
    entregue: pedido.entregue,
    timestamp: pedido.timestamp
  };

  data.pedidos.push(pedido)

  await writeFile("pedidos.json", JSON.stringify(data, null, 2));

  return pedido
}

async function updatePedido(pedido) {
  const data = JSON.parse(await readFile(global.fileName));
  const index = data.pedidos.findIndex(a => a.id === pedido.id)

  if (index === -1) {
    throw new Error ("Registro não encontrado.")
  }

  data.pedidos[index].cliente = pedido.cliente;
  data.pedidos[index].produto = pedido.produto;
  data.pedidos[index].valor = pedido.valor;
  data.pedidos[index].entregue = pedido.entregue;

  await writeFile(global.fileName, JSON.stringify(data, null, 2));

  return data.pedidos[index];
}

async function deletePedido(id) {
  const data = JSON.parse( await readFile(global.fileName));
  data.pedidos = data.pedidos.filter(
    pedido => pedido.id !== parseInt(id)
  )
  await writeFile(global.fileName, JSON.stringify(data, null, 2));
}


export default {
  getPedidos,
  getPedido,
  insertPedido,
  updatePedido,
  deletePedido
}

