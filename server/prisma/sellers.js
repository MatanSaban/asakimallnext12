import prisma from ".";

export async function getSellers() {
  try {
    const sellers = await prisma.sellers.findMany();
    return { sellers };
  } catch (error) {
    return { error };
  }
}

export async function createSeller(seller) {
  try {
    const sellerFromDB = await prisma.sellers.create({ data: seller });
    return { seller: sellerFromDB };
  } catch (error) { 
    return { error };
  }
}

export async function getSellerById(id) {
  try {
    const seller = await prisma.sellers.findUnique({ where: { id } });
    return { seller };
  } catch (error) {
    return { error };
  }
}

export async function getSellerByUserId(id) {
  try {
    const seller = await prisma.sellers.findUnique({
       where: {
         userId : id
        } 
      });
    return { seller };
  } catch (error) {
    return { error };
  }
}

export async function updateSeller(id, data) {
  try {
    const updatedSeller = await prisma.sellers.update({
      where: {
        id: id,
      },
      data: data,
    });
    return { updatedSeller };
  } catch (error) {
    return error;
  }
}

export async function deleteSeller(id) {
  try {
    const seller = await prisma.sellers.delete({ where: { id } });
    return { seller };
  } catch (error) {
    return { error };
  }
}
