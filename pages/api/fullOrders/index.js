import { createFullOrder, getFullOrders } from "../../../server/prisma/fullOrders";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      const { orders, error } = await getFullOrders();
      if (error) throw new Error(error);
      return res.status(200).json({ orders });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "POST") { 
    try {
      const data = req.body;
      const { fullOrder, error } = await createFullOrder(data);
      if (error) throw new Error(error);
      return res.status(200).json({ fullOrder: fullOrder });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(425).end(`Method ${req.method} is not allowed `);
};

export default handler;
