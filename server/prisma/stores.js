import prisma from ".";

export async function getStores() {
  try {
    const stores = await prisma.stores.findMany();
    return { stores };
  } catch (error) {
    return { error };
  }
}

export async function createStore(store) {
  try {
    const storeFromDB = await prisma.stores.create({ data: store });
    return { store: storeFromDB };
  } catch (error) {
    return { error };
  }
}

export async function getStoreById(storeId) {
  try {
    const store = await prisma.stores.findUnique({ 
      where: { 
        id : storeId
      }
    });
    return { store };
  } catch (error) {
    return { error };
  }
}

export async function getStoreBySlug(slug) {
  try {
    const store = await prisma.stores.findUnique({ where: { slug } });
    return { store };
  } catch (error) {
    return { error };
  }
}

export async function updateStore(id, data) {
  // try {
    
    const updatedStore = await prisma.stores.update({ 
      where: {
        id: id,
      },
      data: data,
    });
    console.log('updatedStore from prisma')
    console.log(updatedStore)
    return { updatedStore };
  // } catch (error) {
    // return error;
  // }
}

export async function deleteStore(id) {
  try {
    const store = await prisma.stores.delete({ where: { id } });
    return { store };
  } catch (error) {
    return { error };
  }
}
