import { getProducts, createProduct } from "../../../server/prisma/products";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      const { products, error } = await getProducts();
      if (error) throw new Error(error);
      return res.status(200).json({ products });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "POST") {
    try {
      const data = req.body;
      const { product, error } = await createProduct(data);
      if (error) throw new Error(error);
      return res.status(200).json({ data: product });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(425).end(`Method ${req.method} is not allowed `);
};

export default handler;
