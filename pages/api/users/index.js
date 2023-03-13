const bcrypt = require('bcrypt');
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../../../server/prisma/users";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      const { users, error } = await getUsers();
      if (error) throw new Error(error);
      return res.status(200).json({ users });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "POST") { 
    try {
      const data = req.body;
      const {password} = req.body;
      const saltRounds = 10;
      bcrypt.hash(password, saltRounds).then(hashedPassword => {
        data.password = hashedPassword
      })
      const { user, error } = await createUser(data);
      if (error) throw new Error(error);
      return res.status(200).json({ data: user });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(425).end(`Method ${req.method} is not allowed `);
};

export default handler;
