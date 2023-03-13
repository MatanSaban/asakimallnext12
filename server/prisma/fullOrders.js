import prisma from ".";

export async function getFullOrders() {
  try {
    const fullOrders = await prisma.fullOrders.findMany();
    return { fullOrders };
  } catch (error) {
    return { error };
  }
}

export async function getFullOrdersByUserId(id) {
  try {
    const fullOrders = await prisma.fullOrders.findMany({
      where: {
        fullOrder: id,
      },
    });
    return { fullOrders };
  } catch (error) {
    return { error };
  }
}

export async function createFullOrder(order) {
  try {
    const fullOrder = await prisma.fullOrders.create({ data: order });
    return { fullOrder: fullOrder };
  } catch (error) {
    return { error };
  }
}

export async function updateFullOrder(id, data) {
  try {
    const updatedFullOrder = await prisma.fullOrders.update({
      where: {
        id: id,
      },
      data: data,
    });
    return { updatedFullOrder };
  } catch (error) {
    return error;
  }
}

export async function getOrderById(id) {
  try {
    const order = await prisma.orders.findUnique({ where: { id } });
    return { order };
  } catch (error) {
    return { error };
  }
}

export async function deleteOrder(id) {
  try {
    const order = await prisma.orders.delete({ where: { id } });
    return { order };
  } catch (error) {
    return { error };
  }
}
