import prisma from ".";

export async function getProducts() {
  try {
    const products = await prisma.products.findMany();
    return { products };
  } catch (error) {
    return { error };
  }
}

export async function createProduct(product) {
  try {
    const productFromDB = await prisma.products.create({
      data: product
    });
    return { product: productFromDB };
  } catch (error) {
    return { error };
  }
}

export async function getProductById(id) {
  try {
    const product = await prisma.products.findUnique({ where: { id } });
    return { product };
  } catch (error) {
    return { error };
  }
}
export async function getProductsByStoreId(storeId) {
  try {
    const products = await prisma.products.findMany({
      where: { storeId: storeId },
    })
    return { products };
  } catch (error) {
    return { ProductsByStoreIdError : error };
  }
}

export async function updateProduct(id, data) {
  try {
    const updatedProduct = await prisma.products.update({
      where: {
        id: id,
      },
      data: data,
    });
    return { updatedProduct };
  } catch (error) {
    return error;
  }
}

export async function deleteProduct(id) {
  try {
    const product = await prisma.products.delete({ where: { id } });
    return { product };
  } catch (error) {
    return { error };
  }
}
