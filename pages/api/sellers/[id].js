import {
  deleteSeller,
  getSellerById,
  updateSeller,
  getSellerByUserId
} from "../../../server/prisma/sellers";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      console.log(req.query.id);
      const id = req.query.id;
      const { seller, error } = await getSellerById(id);
      if (error) throw new Error(error);
      return res.status(200).json({ seller });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "POST") {
    try {
      console.log(req.query.id);
      const id = req.query.id;
      const body = req.body;
      if (body.userId) {
        const { seller, error } = await getSellerByUserId(id);
      } else {
        const { seller, error } = await getSellerById(id);
      }
      if (error) throw new Error(error);
      return res.status(200).json({ seller });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "PUT") {
    try {
      const id = req.query.id;
      const data = req.body;
      const { seller, error } = await updateSeller(id, data);
      if (error) throw new Error(error);
      return res.status(200).json({ data: seller });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "DELETE") {
    try {
      const id = req.query.id;
      const { error } = await deleteSeller(id);
      if (error) throw new Error(error);
      return res.status(200).json({ deleted: true });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST", "PUT"]);
  res.status(425).end(`Method ${req.method} is not allowed `);
};

export default handler;
