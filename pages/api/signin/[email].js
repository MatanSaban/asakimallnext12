import {
  getUserByMail,
} from "../../../server/prisma/users";

const handler = async (req, res) => {


    if (req.method === "POST") {
        try {
          const email = req.query.email;
          const password = req.body.password;
          const { data, error } = await getUserByMail(email,password);
          if (error) {
            throw new Error(error);
          }
          return res.status(200).json(data);
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
      }


    res.setHeader("Allow", ["POST"]);
    res.status(425).end(`Method ${req.method} is not allowed `);  
};

export default handler;