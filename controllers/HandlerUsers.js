import db from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

const Users = db.users;
const Role = db.role;
const Address = db.address;
const Wallet = db.wallet;
export const handleGetRoot = async (req, res) => {
  res.status(200).json({
    code: 200,
    status: "OK",
    msg: "Management API For Order Ticketing is Ready",
  });
};

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: [
        "id",
        "firstname",
        "lastname",
        "gender",
        "phone",
        "email",
        "password",
        "pictures",
      ],
      include: [
        {
          model: Role,
          as: "roles",
          attributes: ["roleName"],
        },
        {
          model: Address,
          as: "address",
          attributes: ["homeAddress", "province", "city"],
        },
      ],
    });
    res.status(200).json({
      code: 200,
      status: true,
      msg: "data you searched Found",
      data: users,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUsersBy = async (req, res) => {
  try {
    const { search } = await req.params;
    const users = await Users.findAll({
      where: {
        [Op.or]: [
          { firstname: { [Op.like]: `%` + search + `%` } },
          { lastname: { [Op.like]: `%` + search + `%` } },
          { email: { [Op.like]: `%` + search + `%` } },
          { phone: { [Op.like]: `%` + search + `%` } },
          { gender: { [Op.like]: `%` + search + `%` } },
        ],
      },
      attributes: [
        "id",
        "firstname",
        "lastname",
        "gender",
        "phone",
        "email",
        "password",
        "pictures",
      ],
      include: [
        {
          model: Role,
          as: "roles",
          attributes: ["roleName"],
        },
        {
          model: Address,
          as: "address",
          attributes: ["homeAddress", "province", "city"],
        },
      ],
    });

    if (users == "") {
      return res.status(400).json({
        code: 400,
        status: false,
        msg: "Users not found",
      });
    }
    res.status(200).json({
      code: 200,
      status: true,
      msg: "data users searched Found",
      data: users,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUsersById = async (req, res) => {
  const { id } = req.params;
  try {
    const users = await Users.findAll({
      where: { id: id },
      attributes: [
        "id",
        "firstname",
        "lastname",
        "gender",
        "phone",
        "email",
        "password",
        "pictures",
      ],
      include: [
        {
          model: Role,
          as: "roles",
          attributes: ["roleName"],
        },
        {
          model: Address,
          as: "address",
          attributes: ["homeAddress", "province", "city"],
        },
      ],
    });
    res.status(200).json({
      code: 200,
      status: true,
      msg: "data you searched Found",
      data: users,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUsersByJwt = async (req, res) => {
  try {
    const users = await Users.findAll({
      where: { id: req.user.userId },

      attributes: [
        "id",
        "firstname",
        "lastname",
        "gender",
        "phone",
        "email",
        "password",
        "pictures",
      ],
      include: [
        {
          model: Role,
          as: "roles",
          attributes: ["roleName"],
        },
        {
          model: Address,
          as: "address",
          attributes: ["homeAddress", "province", "city"],
        },
      ],
    });
    res.status(200).json({
      code: 200,
      status: true,
      msg: "data you searched Found",
      data: users,
    });
  } catch (error) {
    console.log(error);
  }
};

export const Register = async (req, res) => {
  const {
    email,
    firstname,
    lastname,
    gender,
    phone,
    birthdate,
    pictures,
    password,
    confPassword,
    homeAddress,
    country,
    province,
    city,
  } = req.body;
  if (password !== confPassword)
    return res.status(400).json({
      code: 400,
      success: false,
      msg: "Password dan Confirm Password tidak cocok",
    });

  const users = await Users.findAll({
    where: {
      email: email,
    },
  });
  if (users != "")
    return res.status(400).json({
      code: 400,
      status: false,
      msg: "your email has been created before",
    });

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    const user = await Users.create({
      email,
      firstname,
      lastname,
      gender,
      phone,
      birthdate,
      role_id: 2,
      pictures,
      password: hashPassword,
    });

    await Address.create({
      homeAddress,
      country,
      province,
      city,
      user_id: user.id,
    });

    await Wallet.create({
      balance: 0,
      user_id: user.id,
    });

    res.status(200).json({
      code: 200,
      status: true,
      msg: "Register Berhasil",
    });
  } catch (error) {
    console.log(error);
  }
};

export const LoginUsers = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        email: req.body.email,
      },
    });
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) {
      return res.status(400).json({
        code: 400,
        status: false,
        msg: "Wrong Password",
      });
    }
    const userId = user[0].id;
    const firstname = user[0].firstname;
    const lastname = user[0].lastname;
    const gender = user[0].gender;
    const phone = user[0].phone;
    const birthdate = user[0].birthdate;
    const postalcode = user[0].postalcode;
    const pictures = user[0].pictures;
    const role_id = user[0].role_id;
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
        role_id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const refreshToken = jwt.sign(
      {
        userId,
        firstname,
        email,
        gender,
        lastname,
        phone,
        birthdate,
        postalcode,
        pictures,
        role_id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    await Users.update(
      { refresh_token: refreshToken, access_token: accessToken },
      {
        where: {
          id: userId,
        },
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      code: 200,
      msg: "Token Has Been Created",
      accessToken,
    });
  } catch (error) {
    res.status(404).json({
      code: 404,
      status: false,
      msg: "Email tidak ditemukan",
    });
  }
};

export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(200).json({
      code: 200,
      status: false,
      msg: "User Has Been Log Out",
    });
  }
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user[0]) {
    return res.status(200).json({
      code: 200,
      status: false,
      msg: "User Not Found",
    });
  }
  const userId = user[0].id;
  await Users.update(
    { refresh_token: null },
    {
      where: {
        id: userId,
      },
    }
  );
  res.clearCookie("refreshToken");
  return res.status(200).json({
    code: 200,
    status: true,
    msg: "You Logout Now",
  });
};

export const whoAmI = async (req, res) => {
  try {
    const currentUser = req.user;
    res.status(200).json({
      code: 200,
      status: true,
      msg: "This data Users Login Now",
      currentUser,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteUsers = async (req, res) => {
  const user = await Users.findAll();
  const { id } = req.params;
  const dataBefore = await Users.findOne({
    where: { id: id },
  });
  const parsedDataProfile = JSON.parse(JSON.stringify(dataBefore));

  if (!parsedDataProfile) {
    return res.status(400).json({
      code: 400,
      status: false,
      msg: "Users Account doesn't exist or has been deleted!",
    });
  }

  await Users.destroy({
    where: { id },
  });

  await Address.destroy({
    where: { id },
  });

  return res.status(200).json({
    code: 200,
    status: true,
    msg: "Delete Data Successfully",
  });
};

export const updateProfile = async (req, res) => {
  const dataBeforeDelete = await Users.findAll({
    where: { id: req.user.userId },
  });
  const parsedDataProfile = JSON.parse(JSON.stringify(dataBeforeDelete));

  if (!parsedDataProfile) {
    return res.status(400).json({
      code: 400,
      status: false,
      msg: "Users doesn't exist or has been deleted!",
    });
  }

  const {
    email,
    firstname,
    lastname,
    gender,
    phone,
    birthdate,
    pictures,
    homeAddress,
    country,
    province,
    city,
  } = req.body;

  try {
    const user = await Users.update(
      {
        email,
        firstname,
        lastname,
        gender,
        phone,
        birthdate,
        pictures,
      },
      {
        where: { id: req.user.userId },
      }
    );
    await Address.update(
      {
        homeAddress,
        country,
        province,
        city,
      },
      {
        where: { user_id: req.user.userId },
      }
    );

    const accessToken = jwt.sign(
      {
        userId: req.user.userId,
        email,
        firstname,
        lastname,
        gender,
        phone,
        birthdate,
        pictures,
        role_id: req.user.role_id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const refreshToken = jwt.sign(
      {
        userId: req.user.userId,
        email,
        firstname,
        lastname,
        gender,
        phone,
        birthdate,
        pictures,
        role_id: req.user.role_id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    await Users.update(
      { refresh_token: refreshToken, access_token: accessToken },
      {
        where: {
          id: req.user.userId,
        },
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      code: 200,
      status: true,
      msg: "Users Success Updated",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateUsers = async (req, res) => {
  const { id } = req.params;
  const dataBeforeDelete = await Users.findOne({
    where: { id: id },
  });
  const parsedDataProfile = JSON.parse(JSON.stringify(dataBeforeDelete));

  if (!parsedDataProfile) {
    return res.status(400).json({
      code: 400,
      status: false,
      msg: "Users doesn't exist or has been deleted!",
    });
  }

  const {
    email,
    firstname,
    lastname,
    gender,
    phone,
    birthdate,
    pictures,
    homeAddress,
    country,
    province,
    city,
  } = req.body;

  try {
    const user = await Users.update(
      {
        email,
        firstname,
        lastname,
        gender,
        phone,
        birthdate,
        pictures,
      },
      {
        where: { id: id },
      }
    );
    await Address.update(
      {
        homeAddress,
        country,
        province,
        city,
      },
      {
        where: { user_id: id },
      }
    );
    return res.status(200).json({
      code: 200,
      status: true,
      msg: "Users Success Updated",
    });
  } catch (error) {
    console.log(error);
  }
};

export const updatePassword = async (req, res) => {
  const dataBeforeDelete = await Users.findAll({
    where: { id: req.user.userId },
  });
  const parsedDataProfile = JSON.parse(JSON.stringify(dataBeforeDelete));

  if (!parsedDataProfile) {
    return res.status(400).json({
      code: 400,
      status: false,
      msg: "Users doesn't exist or has been deleted!",
    });
  }

  const user = await Users.findAll({
    where: { id: req.user.userId },
  });

  const { oldPassword, newPassword, confPassword } = req.body;

  if (!oldPassword)
    return res.status(400).json({
      code: 400,
      success: false,
      msg: "Masukkan password baru!",
    });

  if (oldPassword == newPassword)
    return res.status(400).json({
      code: 400,
      success: false,
      msg: "Password baru dan lama tidak boleh sama!",
    });

  if (newPassword !== confPassword)
    return res.status(400).json({
      code: 400,
      success: false,
      msg: "Password dan Confirm Password tidak cocok",
    });

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(newPassword, salt);

  try {
    await Users.update(
      {
        password: hashPassword,
      },
      {
        where: { id: req.user.userId },
      }
    );
    return res.status(200).json({
      code: 200,
      status: true,
      msg: "Password Success Updated",
    });
  } catch (error) {
    console.log(error);
  }
};
