import {
  getCategoryById,
  updatecategory,
  deleteCategory,
} from "../../../server/prisma/categories";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      const id = req.query.id;
      const { category, error } = await getCategoryById(id);
      if (error) throw new Error(error);
      return res.status(200).json({ category });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "PUT") {
    try {
      const id = req.query.id;
      const data = req.body;
      const { category, error } = await updatecategory(id, data);
      if (error) throw new Error(error);
      return res.status(200).json({ data: category });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "DELETE") {
    try {
      const id = req.query.id;
      const { error } = await deleteCategory(id);
      if (error) throw new Error(error);
      return res.status(200).json({ deleted: true });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(425).end(`Method ${req.method} is not allowed `);
};

export default handler;
