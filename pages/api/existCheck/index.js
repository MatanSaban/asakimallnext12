import {
    getAllUsersForExistChecking,
  } from "../../../server/prisma/users";
  
  const handler = async (req, res) => {
    if (req.method === "POST") {
        let existQuery = [];
        const body = req.body
        console.log("body")
        console.log(...body)
      try {
        const { users, error } = await getAllUsersForExistChecking(...body);
        if (error ) throw new Error(error);
        users.map((user) => {
            if (body[0] !== '') {
                if (user.email == body[0]) {
                  console.log('user')
                  console.log(body[0])
                existQuery.push('email')
              }
            }
            if (body[1] !== '') {
                if (user.mobilephone == body[1]) {
                  console.log('user')
                  console.log(body[1])
                existQuery.push('phone')
              }
            }
        })
        return res.status(200).json([...existQuery]);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }
    res.setHeader("Allow", ["POST"]);
    res.status(425).end(`Method ${req.method} is not allowed `);
  };
  
  export default handler;
  