import {
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByStoreId,
} from "../../../server/prisma/products"; 

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      const id = req.query.id;
      const {product, error} = await getProductById(id);
      // if (error) {
      //   const { products, error } = await getProductsByStoreId(id); // check if id is a store id
      //   console.log("here");
      //   console.log(products);
      //   if (error) throw new Error(error);
      //   return res.status(200).json({ products });
      // }
      if (error) throw new Error(error);
      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "POST") { // to get all store products by store id
    try {
      const id = req.query.id;
      const { products, error } = await getProductsByStoreId(id);
      console.log('products')
      console.log(id)
      if (error) throw new Error(error);
      return res.status(200).json({ data: products });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }


  if (req.method === "PUT") {
    try {
      const id = req.query.id;
      const data = req.body;
      const { updatedProduct, error } = await updateProduct(id, data);
      if (error) throw new Error(error);
      return res.status(200).json({ data: updatedProduct });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "DELETE") {
    try {
      const id = req.query.id;
      console.log('id')
      console.log(id)
      const { product, error } = await deleteProduct(id);
      if (error) throw new Error(error);
      return res.status(200).json({ deleted: true });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE", "POST"]);
  res.status(425).end(`Method ${req.method} is not allowed `);
};

export default handler;
