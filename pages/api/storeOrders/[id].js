import { deleteOrder, getOrderById, updateOrder } from "@/lib/prisma/orders";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      const id = req.query.id;
      const { order, error } = await getOrderById(id);
      if (error) throw new Error(error);
      return res.status(200).json({ order });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "PUT") {
    try {
      const id = req.query.id;
      const data = req.body;
      const { order, error } = await updateOrder(id, data);
      if (error) throw new Error(error);
      return res.status(200).json({ data: order });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "DELETE") {
    try {
      const id = req.query.id;
      const { error } = await deleteOrder(id);
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
