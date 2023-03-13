import { createStoreOrder, getStoreOrders } from "../../../server/prisma/storeOrders";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      const { orders, error } = await getStoreOrders();
      if (error) throw new Error(error);
      return res.status(200).json({ orders });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "POST") {
    try {
      const orderData = req.body;
      const { storeOrder, error } = await createStoreOrder(orderData);
      if (error) throw new Error(error);
      return res.status(200).json(storeOrder);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(425).end(`Method ${req.method} is not allowed `);
};

export default handler;
