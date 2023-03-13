import prisma from ".";

export async function getStoreOrders() {
  try {
    const storeOrders = await prisma.storeOrders.findMany();
    return { storeOrders };
  } catch (error) {
    return { error };
  }
}

export async function getStoreOrdersByUserId(id) {
  try {
    const storeOrders = await prisma.storeOrders.findMany({
      where: {
        User: id,
      },
    });
    return { storeOrders };
  } catch (error) {
    return { error };
  }
}

export async function createStoreOrder(order) {
  try {
    const storeOrder = await prisma.storeOrders.create({ data: order });
    return {storeOrder:storeOrder};
  } catch (error) {
    return { error };
  }
}

export async function updateStoreOrder(id, data) {
  try {
    const updatedOrder = await prisma.storeOrders.update({
      where: {
        id: id,
      },
      data: data,
    });
    return { updatedOrder };
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
