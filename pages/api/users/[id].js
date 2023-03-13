import bcrypt from "bcrypt";
import {
  deleteUser,
  getUserById,
  getUserByMail,
  updateUser,
} from "../../../server/prisma/users";

const handler = async (req, res) => {
  if (req.method === "GET" || req.method === "POST") {
    try {
      const id = req.query.id;
      const { pass } = req.body;
      const { user, error } = await getUserById(id);
      if (error) {
        const { user, error } = await getUserByMail(id, pass);
        if (error) {
          throw new Error(error);
        }
        return res.status(200).json(user.id);
      }
      return res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "PUT") {
    try { 
      const data = req.body;
      const id = req.query.id;
      if (data.setToken) {
        const saltRounds = 10;
        await bcrypt.hash(id, saltRounds).then((hashedToken) => {
          data.token = hashedToken;
          delete data.setToken;
        });
        if (data.password) {
          await bcrypt.hash(data.password, saltRounds).then((hashedPassword) => {
            data.password = hashedPassword;
          });
        }
        const { updatedUser, error } = await updateUser(id, data);
        let updatedUserWithoutPass = updatedUser;
        if (updatedUserWithoutPass) {
          Object.keys(updatedUserWithoutPass).map((property) => {
            if (property === "password") {
              delete updatedUserWithoutPass[property];
            }
            return updatedUserWithoutPass;
          });
        }
        if (error) throw new Error(error);
        return res.status(200).json({
          data: "SUCCESS",
          token: updatedUser.token,
          user: updatedUserWithoutPass,
        }); 
      } else {
        const { updatedUser, error } = await updateUser(id, data);
        console.log('updatedUser hereeee')
        console.log(updatedUser)
        let updatedUserWithoutPassword = updatedUser;
        if (updatedUserWithoutPassword) {
          Object.keys(updatedUserWithoutPassword).map((property) => {
            if (property === 'password') {
              delete(updatedUserWithoutPassword[property])
            }
            return updatedUserWithoutPassword;
          })
        }
        console.log('updatedUserWithoutPassword')
        console.log(updatedUserWithoutPassword)
        if (error) throw new Error(error);
        return res
          .status(200)
          .json({ data: "SUCCESS", user : updatedUserWithoutPassword });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "DELETE") {
    try {
      const id = req.query.id;
      const { error } = await deleteUser(id);
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
