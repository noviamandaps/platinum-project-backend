import db from "../models/index.js";

const Payment = db.payment;
const UserBooking = db.userbooking;
const PassangerBooking = db.passangerbooking;
const Booking = db.booking;
const History = db.history;
const Wallet = db.wallet;
const Passanger = db.passanger;
const Ticket = db.ticket;
const Flight = db.flight;
const Plane = db.plane;
const Airport = db.airport;
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

export const getPaymentAllCondition = async (req, res) => {
  const reqUserId = req.user.userId;
  try {
    const payment = await Payment.findAll({
      include: {
        model: UserBooking,
        as: "usersPayment",
        where: { user_id: reqUserId },
        include: {
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
              include: { model: Passanger, as: "passanger" },
            },
          ],
        },
      },
    });

    if (payment == "") {
      return res.status(400).json({
        code: 400,
        status: true,
        msg: "You Dont Have Payments, Please Booking now",
      });
    }

    const sortPayment = payment.sort(function (a, b) {
      return b.createdAt - a.createdAt;
    });

    return res.status(200).json({
      code: 200,
      status: true,
      msg: "This Payment you have ",
      data: sortPayment,
    });
  } catch (error) {
    console.log(error);
  }
};

export const isPaymentTicket = async (req, res) => {
  const { id } = req.params;
  const reqUserId = req.user.userId;
  try {
    const payment = await Payment.findOne({
      where: {
        id,
      },
      include: {
        model: UserBooking,
        as: "usersPayment",
        where: { user_id: reqUserId },
        include: {
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
              include: { model: Passanger, as: "passanger" },
            },
          ],
        },
      },
    });

    const paymentMutual = JSON.parse(JSON.stringify(payment));

    const wallet = await Wallet.findOne({
      where: {
        user_id: reqUserId,
      },
    });

    const walletUsers = JSON.parse(JSON.stringify(wallet));

    if (walletUsers == null) {
      return res.status(202).json({
        code: 202,
        status: false,
        msg: "You Dont have Wallet Please Register Wallet to Admin",
      });
    }

    if (paymentMutual == null) {
      return res.status(400).json({
        code: 400,
        status: false,
        msg: "You Dont have Payment Ticket",
      });
    }

    if (paymentMutual.totalPrice > walletUsers.balance) {
      return res.status(400).json({
        code: 400,
        status: false,
        msg: "Wallet is not Enough please Top Up",
      });
    }

    let paymentResult = walletUsers.balance - paymentMutual.totalPrice;

    await Wallet.update(
      {
        balance: paymentResult,
      },
      {
        where: { user_id: reqUserId },
      }
    );

    const history = await History.create({
      userBooking_id: paymentMutual.userBooking_id,
      payment_id: paymentMutual.id,
      paymentType: "wallet",
      isHistory: true,
    });

    await Payment.update(
      {
        isPayed: true,
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
      message: `${getUsers.firstname} Payment Success with Payment ID ${paymentMutual.id} at ${format_tgl}`,
      isRead: false,
    });

    return res.status(200).json({
      code: 200,
      status: true,
      msg: "Payment Success",
      data: { paymentMutual, walletUsers },
    });
  } catch (error) {
    console.log(error);
  }
};

export const isCancelPayment = async (req, res) => {
  const { id } = req.params;
  const reqUserId = req.user.userId;
  try {
    const payment = await Payment.findOne({
      where: { id },
      include: [
        {
          model: UserBooking,
          as: "usersPayment",
          where: { user_id: reqUserId },
          include: [
            {
              model: Booking,
              as: "booking",
              include: [
                {
                  model: PassangerBooking,
                  as: "passangerBooking",
                  include: [{ model: Passanger, as: "passanger" }],
                },
              ],
            },
          ],
        },
      ],
    });

    const parsedBooking = JSON.parse(JSON.stringify(payment));

    if (parsedBooking == "") {
      return res.status(400).json({
        code: 400,
        status: true,
        msg: "Data Not Found",
      });
    }
    const history = await History.create({
      userBooking_id: payment.userBooking_id,
      payment_id: payment.id,
      paymentType: "Cancel",
      isHistory: false,
    });

    await Payment.update(
      {
        isPayed: false,
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
      message: `${getUsers.firstname} Payment Cancel with Payment ID ${payment.id} at ${format_tgl}`,
      isRead: false,
    });

    return res.status(200).json({
      code: 200,
      status: true,
      msg: "Booking Canceled",
    });
  } catch (error) {
    console.log(error);
  }
};

export const getPaymentFromCondition = async (req, res) => {
  const { id } = req.params;
  const reqUserId = req.user.userId;
  try {
    //CEK CONDITION IF ID null
    if (!id) {
      const payment = await Payment.findAll({
        where: {
          isPayed: false,
        },
        include: {
          model: UserBooking,
          as: "usersPayment",
          where: { user_id: reqUserId },
          include: {
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
                include: { model: Passanger, as: "passanger" },
              },
            ],
          },
        },
      });

      if (payment == "") {
        return res.status(400).json({
          code: 400,
          status: true,
          msg: "You Dont Have Payments not Paying",
        });
      }

      const sortPayment = payment.sort(function (a, b) {
        return b.createdAt - a.createdAt;
      });

      return res.status(200).json({
        code: 200,
        status: true,
        msg: "This Payment you have ",
        data: sortPayment,
      });
    }
    //END

    const payment = await Payment.findAll({
      where: {
        isPayed: id,
      },
      include: {
        model: UserBooking,
        as: "usersPayment",
        where: { user_id: reqUserId },
        include: {
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
              include: { model: Passanger, as: "passanger" },
            },
          ],
        },
      },
    });

    if (payment == "") {
      return res.status(400).json({
        code: 400,
        status: true,
        msg: "You Dont Have Payments, Please Booking now",
      });
    }

    const sortPayment = payment.sort(function (a, b) {
      return b.createdAt - a.createdAt;
    });

    return res.status(200).json({
      code: 200,
      status: true,
      msg: "This Payment you have ",
      data: sortPayment,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getPaymentById = async (req, res) => {
  const { id } = req.params;
  try {
    const getDataByUserId = req.user.userId;
    const payment = await Payment.findAll({
      where: {
        id,
        isPayed: false,
      },
      include: {
        model: UserBooking,
        as: "usersPayment",
        where: { user_id: getDataByUserId },
        include: {
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
              include: { model: Passanger, as: "passanger" },
            },
          ],
        },
      },
    });
    let paymentData = JSON.parse(JSON.stringify(payment));

    if (payment == "") {
      return res.status(400).json({
        code: 400,
        status: true,
        msg: "You Dont Have Payments, Please Booking now",
      });
    }

    return res.status(200).json({
      code: 200,
      status: true,
      msg: "This Payment you have ",
      data: paymentData,
    });
  } catch (error) {}
};
