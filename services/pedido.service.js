import PedidoRepository from "../repositories/pedido.repository.js";

async function getPedidos() {
  return await PedidoRepository.getPedidos();
}

async function getPedido(id) {
  return await PedidoRepository.getPedido(id);
}

async function createPedido(pedido) {
  return await PedidoRepository.insertPedido(pedido);
}

async function updatePedido (pedido) {
  return await PedidoRepository.updatePedido(pedido);
}

async function updateEntregue (pedido) {
  const acc = await PedidoRepository.getPedido(pedido.id);
  acc.entregue = pedido.entregue;
  return await PedidoRepository.updatePedido(acc);
}

async function deletePedido(id) {
  return await PedidoRepository.deletePedido(id);
}


async function getMaisPedidos() {
  const pedidos = await PedidoRepository.getPedidos();
  
  // Filter only delivered orders
  const deliveredOrders = pedidos.filter(pedido => pedido.entregue);

  // Create a map of product names to pedido counts
  const productCounts = new Map();
  for (const pedido of deliveredOrders) {
    const product = pedido.produto;
    if (!productCounts.has(product)) {
      productCounts.set(product, 0);
    }
    productCounts.set(product, productCounts.get(product) + 1);
  }

  // Sort the product counts in descending pedido
  const sortedProductCounts = Array.from(productCounts)
    .sort((a, b) => b[1] - a[1]);

  // Return the best selling products
  return sortedProductCounts.map(([product, count]) => `${product} - ${count}`);
}


async function getGetTotalCliente(nomeCliente) {
  const pedidos = await PedidoRepository.getPedidos();
  const total = pedidos
    .filter((p) => p.cliente === nomeCliente && p.entregue)
    .map((p) => p.valor)
    .reduce((prev, curr) => prev + curr, 0)
  return total 
}

async function getGetTotalProduto(nomeProduto) {
  const pedidos = await PedidoRepository.getPedidos();
  const total = pedidos
    .filter((p) => p.produto === nomeProduto && p.entregue)
    .map((p) => p.valor)
    .reduce((prev, curr) => prev + curr, 0)
  return total 
}


export default {
  getPedidos,
  getPedido,
  createPedido,
  updatePedido,
  updateEntregue,
  deletePedido,
  getMaisPedidos,
  getGetTotalCliente,
  getGetTotalProduto
}