import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == "") return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = {
      userId: decoded.userId,
      firstname: decoded.firstname,
      lastname: decoded.lastname,
      gender: decoded.gender,
      email: decoded.email,
      role_id: decoded.role_id,
      phone: decoded.phone,
      birthdate: decoded.birthdate,
      pictures: decoded.pictures,
    };
    req.id = decoded.userId;
    req.firstname = decoded.firstname;
    req.lastname = decoded.lastname;
    req.gender = decoded.gender;
    req.email = decoded.email;
    req.role_id = decoded.role_id;
    req.phone = decoded.phone;
    req.birthdate = decoded.birthdate;
    req.pictures = decoded.pictures;
    next();
  });
};
