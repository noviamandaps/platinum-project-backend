import db from "../models/index.js";

const Ticket = db.ticket;
const Type = db.classtype;
const Flight = db.flight;
const Airport = db.airport;
const Plane = db.plane;
export const getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findAll({
      include: [
        {
          model: Type,
          as: "class",
          attributes: ["type"],
        },
        {
          model: Flight,
          as: "flight",
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
            },
          ],
        },
      ],
    });
    return res.status(200).json({
      code: 200,
      status: true,
      msg: "ticket you searched Found",
      data: ticket,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Type,
          as: "class",
          attributes: ["type"],
        },
        {
          model: Flight,
          as: "flight",
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
            },
          ],
        },
      ],
    });
    return res.status(200).json({
      code: 200,
      status: true,
      msg: "Ticket You searched Found",
      data: ticket,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getTicketQuery = async (req, res) => {
  try {
    let arrival = req.query.arrival;
    let departure = req.query.departure;
    let datedeparture = req.query.datedeparture;
    let ticket = await Ticket.findAll({
      include: [
        {
          model: Type,
          as: "class",
          attributes: ["type"],
        },
        {
          model: Flight,
          as: "flight",
          include: [
            {
              model: Airport,
              as: "DepartureTerminal",
              where: {
                code: departure,
              },
            },
            {
              model: Airport,
              as: "ArrivalTerminal",
              where: {
                code: arrival,
              },
            },
            {
              model: Plane,
              as: "planeName",
            },
          ],
        },
      ],
    });

    const result = [];
    const departureDate = new Date(datedeparture);
    for (let i = 0; i < ticket.length; i++) {
      if (
        ticket[i].flight !== null &&
        ticket[i].flight.departureDate >= departureDate
      )
        result.push(ticket[i]);
    }

    if (result == "") {
      return res.status(400).json({
        code: 400,
        status: false,
        msg: "Ticket Not Found",
        data: result,
      });
    }
    return res.status(200).json({
      code: 200,
      status: true,
      msg: "Ticket Found",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

export const createTicket = async (req, res) => {
  try {
    const ticket = await Ticket.bulkCreate(req.body);
    return res.status(200).json({
      code: 200,
      status: true,
      msg: "Added Ticket Successfully",
      data: ticket,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteTicket = async (req, res) => {
  const ticket = await Ticket.findAll();
  const { id } = req.params;
  const dataBefore = await Ticket.findOne({
    where: { id: id },
  });

  const parsedDataProfile = JSON.parse(JSON.stringify(dataBefore));

  if (!parsedDataProfile) {
    return res.status(400).json({
      code: 400,
      status: false,
      msg: "Ticket Doesn't Existing",
    });
  }

  await Ticket.destroy({
    where: { id },
  });

  return res.status(200).json({
    code: 200,
    status: true,
    msg: "Delete Ticket Successfully",
  });
};

export const updateTicket = async (req, res) => {
  const { id } = req.params;
  const dataBeforeDelete = await Ticket.findOne({
    where: { id: id },
  });
  const parsedDataProfile = JSON.parse(JSON.stringify(dataBeforeDelete));

  if (!parsedDataProfile) {
    return res.status(400).json({
      code: 400,
      status: false,
      msg: "Ticket Not Found",
    });
  }

  const { flight_id, class_id, price, country, passanger_ammount } = req.body;

  try {
    await Ticket.update(
      {
        flight_id,
        class_id,
        price,
        country,
        passanger_ammount,
      },
      {
        where: { id: id },
      }
    );
    return res.status(200).json({
      code: 200,
      status: true,
      msg: "Ticket Success Updated",
    });
  } catch (error) {
    console.log(error);
  }
};
