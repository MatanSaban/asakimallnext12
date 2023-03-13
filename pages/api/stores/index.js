import { getStores, createStore } from "../../../server/prisma/stores";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      const { stores, error } = await getStores();
      if (error) throw new Error(error);
      return res.status(200).json({ stores });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } 

  if (req.method === "POST") {
    try {
      const data = req.body;
      const { store, error } = await createStore(data);
      if (error) throw new Error(error);
      return res.status(200).json({ data: store });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(425).end(`Method ${req.method} is not allowed `);
};

export default handler;
