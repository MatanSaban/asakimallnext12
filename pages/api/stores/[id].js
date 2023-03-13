import {
  getStoreById,
  updateStore,
  deleteStore,
  getStoreBySlug,
} from "../../../server/prisma/stores";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      const id = req.query.id;
      let { store, error } = await getStoreById(id);
      if (error) {
        let { store, error } = await getStoreBySlug(id); // check if id means slug
        if (error) throw new Error(error);
        return res.status(200).json({ store });
      }
      return res.status(200).json({ store });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "PUT") {
    try {
      const id = req.query.id;
      const data = req.body;
      console.log("PUT from stores")
      console.log(req.body)
      console.log(id)
      const { updatedStore, error } = await updateStore(id, data);
      if (error) throw new Error(error);
      console.log('updatedStore')
      console.log(updatedStore)
      return res.status(200).json({ data: updatedStore });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "DELETE") {
    try {
      const id = req.query.id;
      const { error } = await deleteStore(id);
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
