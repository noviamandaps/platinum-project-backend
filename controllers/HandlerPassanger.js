import db from "../models/index.js";

const Passanger = db.passanger;

export const getPassanger = async (req, res) => {
  try {
    const passanger = await Passanger.findAll();
    return res.status(200).json({
      code: 200,
      status: true,
      msg: "data you searched Found",
      data: passanger,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getPassangerById = async (req, res) => {
  try {
    const passanger = await Passanger.findOne({
      where: { id: req.params.id },
    });

    if (!passanger) {
      return res.status(400).json({
        code: 400,
        status: false,
        msg: "Passanger not found or nothing!",
      });
    }
    return res.status(200).json({
      code: 200,
      status: true,
      msg: "data you searched Found",
      data: passanger,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updatePassanger = async (req, res) => {
  const { id } = req.params;
  const dataBeforeDelete = await Passanger.findOne({
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

  const { firstname, lastname, email, age, identityType, identityNumber } =
    req.body;
  try {
    await Passanger.update(
      {
        firstname,
        lastname,
        email,
        age,
        identityType,
        identityNumber,
      },
      {
        where: { id: id },
      }
    );
    return res.status(200).json({
      code: 200,
      status: true,
      msg: "Passanger Success Updated",
    });
  } catch (error) {
    console.log(error);
  }
};

export const deletePassanger = async (req, res) => {
  const { id } = req.params;
  const dataBefore = await Passanger.findOne({
    where: { id: id },
  });
  const parsedDataProfile = JSON.parse(JSON.stringify(dataBefore));

  if (!parsedDataProfile) {
    return res.status(400).json({
      code: 400,
      status: false,
      msg: "Passanger not found or nothing!",
    });
  }
  await Passanger.destroy({
    where: { id },
  });

  return res.status(200).json({
    status: true,
    msg: "Delete Data Successfully",
  });
};
