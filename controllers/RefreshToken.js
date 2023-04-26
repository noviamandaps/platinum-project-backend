import db from "../models/index.js";
import jwt from "jsonwebtoken";

const Users = db.users;
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    const user = await Users.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user[0]) return res.sendStatus(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) return res.sendStatus(403);
        const userId = user[0].id;
        const firstname = user[0].firstname;
        const lastname = user[0].lastname;
        const gender = user[0].gender;
        const phone = user[0].phone;
        const birthdate = user[0].birthdate;
        const postalcode = user[0].postalcode;
        const pictures = user[0].pictures;
        const email = user[0].email;
        const accessToken = jwt.sign(
          {
            userId,
            firstname,
            lastname,
            gender,
            email,
            phone,
            birthdate,
            postalcode,
            pictures,
          },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "1d",
          }
        );
        res
          .status(200)
          .json({ code: 200, msg: "Token Refresh Finish", accessToken });
      }
    );
  } catch (error) {
    console.log(error);
  }
};
