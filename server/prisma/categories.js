import prisma from ".";

export async function getCategories() {
  try {
    const categories = await prisma.categories.findMany();
    return { categories };
  } catch (error) {
    return { error };
  }
}

export async function createCategory(category) {
  try {
    const categoryFromDB = await prisma.categories.create({ data: category });
    return { category: categoryFromDB };
  } catch (error) {
    return { error };
  }
}

export async function getCategoryById(id) {
  try {
    const category = await prisma.categories.findUnique({ where: { id } });
    return { category };
  } catch (error) {
    return { error };
  }
}

export async function updatecategory(id, data) {
  try {
    const updatedcategory = await prisma.categories.update({
      where: {
        id: id,
      },
      data: data,
    });
    return { updatedcategory };
  } catch (error) {
    return error;
  }
}

export async function deleteCategory(id) {
  try {
    const category = await prisma.categories.delete({ where: { id } });
    return { category };
  } catch (error) {
    return { error };
  }
}
