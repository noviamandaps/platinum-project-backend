import db from "../models/index.js";
import { Op } from "sequelize";

const Flight = db.flight;
const Airport = db.airport;
const Ticket = db.ticket;
const Plane = db.plane;
const Users = db.users;
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

export const getFlight = async (req, res) => {
  try {
    const flight = await Flight.findAll({
      include: { all: true },
    });
    return res.status(200).json({
      code: 200,
      status: true,
      msg: "data you searched Found",
      data: flight,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getFlightBy = async (req, res) => {
  try {
    const { search } = req.params;
    let flight = await Flight.findAll({
      include: [
        {
          model: Airport,
          as: "DepartureTerminal",
        },
        {
          model: Airport,
          as: "ArrivalTerminal",
        },
        {
          model: Plane,
          as: "planeName",
          where: {
            [Op.or]: [{ namePlane: { [Op.like]: `%` + search + `%` } }],
          },
        },
      ],
    });

    if (flight == "") {
      return res.status(400).json({
        code: 400,
        status: false,
        msg: "Flight Doesn't Existing",
      });
    }

    return res.status(200).json({
      code: 200,
      status: true,
      msg: "data you searched Found",
      data: flight,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getFlightById = async (req, res) => {
  const { id } = req.params;
  try {
    const flight = await Flight.findAll({
      where: {
        id: id,
      },
      include: { all: true },
    });

    return res.status(200).json({
      code: 200,
      status: true,
      msg: "Flight Found",
      data: flight,
    });
  } catch (error) {
    console.log(error);
  }
};

export const createFlight = async (req, res) => {
  const reqUserId = req.user.userId;
  const {
    departureAirport,
    arrivalAirport,
    departureDate,
    arrivalDate,
    departureTime,
    arrivalTime,
    planeId,
  } = req.body.flight;

  const { class_id, price, country } = req.body.ticket;
  try {
    const flight = await Flight.create({
      departureAirport,
      arrivalAirport,
      departureDate,
      arrivalDate,
      departureTime,
      arrivalTime,
      planeId,
    });

    const ticket = await Ticket.create({
      flight_id: flight.id,
      class_id,
      price,
      country,
    });

    const getUsers = await Users.findOne({
      where: { id: reqUserId },
    });

    await Notification.create({
      user_id: reqUserId,
      message: `${getUsers.firstname} Success Create Flight with id ${flight.id} with ticket id ${ticket.id} at ${format_tgl}`,
      isRead: false,
    });

    return res.status(200).json({
      code: 200,
      status: true,
      msg: "Added Flight Successfully",
      data: { flight, ticket },
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateFlight = async (req, res) => {
  const { id } = req.params;
  const reqUserId = req.user.userId;
  const dataBeforeDelete = await Flight.findOne({
    where: { id: id },
  });
  const parsedDataProfile = JSON.parse(JSON.stringify(dataBeforeDelete));

  if (!parsedDataProfile) {
    return res.status(400).json({
      code: 400,
      status: false,
      msg: "Flight doesn't exist or has been deleted!",
    });
  }

  const {
    departureAirport,
    arrivalAirport,
    departureDate,
    arrivalDate,
    departureTime,
    arrivalTime,
    planeId,
  } = req.body.flight;

  const { class_id, price, country } = req.body.ticket;

  try {
    await Flight.update(
      {
        departureAirport,
        arrivalAirport,
        departureDate,
        arrivalDate,
        departureTime,
        arrivalTime,
        planeId,
      },
      {
        where: { id: id },
      }
    );

    await Ticket.update(
      {
        class_id,
        price,
        country,
      },
      {
        where: { flight_id: parsedDataProfile.id },
      }
    );

    const getUsers = await Users.findOne({
      where: { id: reqUserId },
    });

    await Notification.create({
      user_id: reqUserId,
      message: `${getUsers.firstname} Success Update Flight with ID ${id} at ${format_tgl}`,
      isRead: false,
    });
    return res.status(200).json({
      code: 200,
      status: true,
      msg: "Flight Success Updated",
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteFlight = async (req, res) => {
  const flight = await Flight.findAll();
  const { id } = req.params;
  const reqUserId = req.user.userId;
  try {
    const dataBefore = await Flight.findOne({
      where: { id: id },
    });
    const parsedDataProfile = JSON.parse(JSON.stringify(dataBefore));

    if (!parsedDataProfile) {
      return res.status(400).json({
        code: 400,
        status: false,
        msg: "Flight not found or nothing!",
      });
    }

    await Flight.destroy({
      where: { id },
    });

    await Ticket.destroy({
      where: {
        flight_id: parsedDataProfile.id,
      },
    });

    const getUsers = await Users.findOne({
      where: { id: reqUserId },
    });

    await Notification.create({
      user_id: reqUserId,
      message: `${getUsers.firstname} Success Delete Flight ID ${parsedDataProfile.id} at ${format_tgl}`,
      isRead: false,
    });

    return res.status(200).json({
      code: 200,
      status: true,
      msg: "Delete Flight Successfully",
    });
  } catch (error) {}
};
