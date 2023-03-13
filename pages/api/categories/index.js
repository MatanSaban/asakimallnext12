import { getCategories, createCategory } from "../../../server/prisma/categories";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      const { categories, error } = await getCategories();
      if (error) throw new Error(error);
      return res.status(200).json({ categories });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "POST") { 
    try {
      const data = req.body;
      console.log(req);
      const { category, error } = await createCategory(data);
      if (error) throw new Error(error);
      return res.status(200).json({ data: category });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(425).end(`Method ${req.method} is not allowed `);
};

export default handler;
