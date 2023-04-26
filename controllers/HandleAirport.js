import db from "../models/index.js";
import { Op } from "sequelize";
const Notification = db.notification;

//MAKE STRING DATE
let tgl = new Date();
let format_tgl =
  tgl.getFullYear() +
  "-" +
  (tgl.getMonth() + 1) +
  "-" +
  tgl.getDate() +
  " " +
  tgl.getHours() +
  ":" +
  tgl.getMinutes() +
  ":" +
  tgl.getSeconds();

const Airport = db.airport;
const Users = db.users;
export const getAirport = async (req, res) => {
  try {
    const airport = await Airport.findAll({});

    const sortAirport = airport.sort(function (a, b) {
      return b.createdAt - a.createdAt;
    });

    return res.status(200).json({
      code: 200,
      status: true,
      msg: "Airports searched Found",
      data: sortAirport,
    });
  } catch (error) {
    console.log(error);
  }
};

export const createAirport = async (req, res) => {
  const { name, code, city, country, terminal } = req.body;
  const reqUserId = req.user.userId;
  const airportName = await Airport.findAll({
    where: {
      name: name,
    },
  });
  if (airportName != "")
    return res.status(400).json({
      code: 400,
      status: false,
      msg: "airports is already exists",
    });

  const airportCode = await Airport.findAll({
    where: {
      code: code,
    },
  });
  if (airportCode != "")
    return res.status(400).json({
      code: 400,
      status: false,
      msg: "code is already exists",
    });

  const getUsers = await Users.findOne({
    where: { id: reqUserId },
  });

  try {
    const airport = await Airport.create({
      name,
      code,
      city,
      country,
      terminal,
      status: true,
    });

    await Notification.create({
      user_id: reqUserId,
      message: `${getUsers.firstname} Success Create Airport ${airport.name} with Code ${airport.code} Country ${airport.country} at ${format_tgl}`,
      isRead: false,
    });

    return res.status(200).json({
      code: 200,
      status: true,
      msg: "Added Airport Successfully",
      data: airport,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteAirport = async (req, res) => {
  const { id } = req.params;
  const reqUserId = req.user.userId;
  try {
    const dataBefore = await Airport.findOne({
      where: { id: id },
    });
    const parsedDataProfile = JSON.parse(JSON.stringify(dataBefore));

    if (!parsedDataProfile) {
      return res.status(400).json({
        code: 400,
        status: false,
        msg: "Airports Doesn't Existing",
      });
    }

    await Airport.destroy({
      where: { id },
    });

    const getUsers = await Users.findOne({
      where: { id: reqUserId },
    });

    await Notification.create({
      user_id: reqUserId,
      message: `${getUsers.firstname} Success Delete Airport ID ${parsedDataProfile.id} with Name : ${parsedDataProfile.name}, Code : ${parsedDataProfile.code} at ${format_tgl}`,
      isRead: false,
    });

    return res.status(200).json({
      code: 200,
      status: true,
      msg: "Delete Airport Successfully",
    });
  } catch (error) {}
};

export const getAirportBy = async (req, res) => {
  try {
    const { search } = await req.params;
    let airport = await Airport.findAll({
      where: {
        [Op.or]: [{ name: { [Op.like]: `%` + search + `%` } }],
      },
    });
    if (airport == "") {
      return res.status(400).json({
        code: 400,
        status: false,
        msg: "Airports Doesn't Existing",
      });
    }
    return res.status(200).json({
      code: 200,
      status: true,
      msg: "data you searched Found",
      data: airport,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAirportById = async (req, res) => {
  const { id } = req.params;
  try {
    const airport = await Airport.findOne({
      where: { id },
    });

    if (airport == "") {
      return res.status(400).json({
        code: 400,
        status: false,
        msg: "Airports Doesn't Existing",
        data: airport,
      });
    }
    return res.status(200).json({
      code: 200,
      status: true,
      msg: "data you searched Found",
      data: airport,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateAirport = async (req, res) => {
  const { id } = req.params;
  const reqUserId = req.user.userId;
  const airport = await Airport.findOne({
    where: { id: id },
  });

  if (airport == "") {
    return res.status(400).json({
      code: 400,
      status: false,
      msg: "Airports doesn't exist or has been deleted!",
    });
  }

  const { name, code, city, country, terminal, status } = req.body;
  try {
    await Airport.update(
      {
        name,
        code,
        city,
        country,
        terminal,
        status,
      },
      {
        where: { id: id },
      }
    );

    const getUsers = await Users.findOne({
      where: { id: reqUserId },
    });

    await Notification.create({
      user_id: reqUserId,
      message: `${getUsers.firstname} Success Update Airport ID ${airport.id} with Name : ${airport.name}, Code : ${airport.code} at ${format_tgl}`,
      isRead: false,
    });

    return res.status(200).json({
      code: 200,
      status: true,
      msg: "Airport Success Updated",
      data: Airport,
    });
  } catch (error) {
    console.log(error);
  }
};
