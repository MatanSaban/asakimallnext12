import bcrypt from 'bcrypt'
import {
    getUserByToken,
} from "../../../../server/prisma/users";

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const token = req.body.token;
      if (token) {
        const { user, error } = await getUserByToken(token);
        // console.log('user')
        // console.log(user)
        return res.status(200).json(user);
      } else {
        return res.status(500).json({ error: error.message });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }


  res.setHeader("Allow", ["POST"]);
  res.status(425).end(`Method ${req.method} is not allowed `);
};

export default handler;
