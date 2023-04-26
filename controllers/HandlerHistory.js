import db from "../models/index.js";
import users from "../models/users.js";

const History = db.history;
const UserBooking = db.userbooking;
const Booking = db.booking;
const PassangerBooking = db.passangerbooking;
const Passanger = db.passanger;
const Users = db.users;
const Ticket = db.ticket;
const Flight = db.flight;
const Plane = db.plane;
const Airport = db.airport;

export const getHistoryPayment = async (req, res) => {
  const reqUserId = req.user.userId;
  const { condition } = req.params;
  try {
    const history = await History.findAll({
      where: { isHistory: condition },
      include: [
        {
          model: UserBooking,
          as: "userBooking",
          where: { user_id: reqUserId },
          include: [
            { model: Users, as: "users" },
            {
              model: Booking,
              as: "booking",
              include: [
                {
                  model: Ticket,
                  as: "ticketDeparture",
                  include: {
                    model: Flight,
                    as: "flight",
                    include: [
                      { model: Plane, as: "planeName" },
                      { model: Airport, as: "DepartureTerminal" },
                      { model: Airport, as: "ArrivalTerminal" },
                    ],
                  },
                },
                {
                  model: Ticket,
                  as: "ticketReturn",
                  include: {
                    model: Flight,
                    as: "flight",
                    include: [
                      { model: Plane, as: "planeName" },
                      { model: Airport, as: "DepartureTerminal" },
                      { model: Airport, as: "ArrivalTerminal" },
                    ],
                  },
                },
                {
                  model: PassangerBooking,
                  as: "passangerBooking",
                  include: [
                    {
                      model: Passanger,
                      as: "passanger",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    const historySort = history.sort(function (a, b) {
      return b.createdAt - a.createdAt;
    });

    if (history == "") {
      return res.status(400).json({
        code: 400,
        status: true,
        msg: `you don't have history payment`,
      });
    }
    return res.status(200).json({
      code: 200,
      status: true,
      msg: `you don't have history payment`,
      data: historySort,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getHistoryById = async (req, res) => {
  const reqUserId = req.user.userId;
  const { id } = req.params;
  try {
    const history = await History.findAll({
      where: { id },
      include: [
        {
          model: UserBooking,
          as: "userBooking",
          where: { user_id: reqUserId },
          include: [
            { model: Users, as: "users" },
            {
              model: Booking,
              as: "booking",
              include: [
                {
                  model: Ticket,
                  as: "ticketDeparture",
                  include: {
                    model: Flight,
                    as: "flight",
                    include: [
                      { model: Plane, as: "planeName" },
                      { model: Airport, as: "DepartureTerminal" },
                      { model: Airport, as: "ArrivalTerminal" },
                    ],
                  },
                },
                {
                  model: Ticket,
                  as: "ticketReturn",
                  include: {
                    model: Flight,
                    as: "flight",
                    include: [
                      { model: Plane, as: "planeName" },
                      { model: Airport, as: "DepartureTerminal" },
                      { model: Airport, as: "ArrivalTerminal" },
                    ],
                  },
                },
                {
                  model: PassangerBooking,
                  as: "passangerBooking",
                  include: [
                    {
                      model: Passanger,
                      as: "passanger",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    return res.status(200).json({
      code: 200,
      status: true,
      msg: `This payment users with id ${id}`,
      data: history,
    });
  } catch (error) {
    console.log(error);
  }
};

export const DeleteHistoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const history = await History.findOne({
      where: { id: id },
    });
    const parsedDataProfile = JSON.parse(JSON.stringify(history));

    if (!parsedDataProfile) {
      return res.status(400).json({
        code: 400,
        status: false,
        msg: "History Doesn't Existing",
      });
    }

    await History.destroy({
      where: { id },
    });

    return res.status(200).json({
      code: 200,
      status: true,
      msg: "Delete History Successfully",
    });
  } catch (error) {}
};
