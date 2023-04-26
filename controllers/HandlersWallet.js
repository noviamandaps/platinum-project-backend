import db from "../models/index.js";
const Wallet = db.wallet;
const Notification = db.notification;
const Users = db.users;

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

export const getSaldoWallet = async (req, res) => {
  const getIdUsers = req.user.userId;
  try {
    const wallet = await Wallet.findOne({
      where: {
        user_id: getIdUsers,
      },
    });

    if (wallet == null) {
      return res.status(400).json({
        code: 400,
        status: false,
        msg: "wallet not found, please register wallet first",
      });
    }

    return res.status(200).json({
      code: 200,
      status: true,
      msg: "wallet found",
      data: wallet,
    });
  } catch (error) {}
};

export const getSaldoWalletAll = async (req, res) => {
  try {
    const wallet = await Wallet.findAll({});

    if (wallet == "") {
      return res.status(400).json({
        code: 400,
        status: true,
        msg: "Doesn Have list Wallet found",
      });
    }

    return res.status(200).json({
      code: 200,
      status: true,
      msg: "wallet found",
      data: wallet,
    });
  } catch (error) {}
};

export const createWallet = async (req, res) => {
  const { user_id, balance } = req.body;
  const reqUserId = req.user.userId;
  try {
    const findWallet = await Wallet.findOne({
      where: {
        user_id,
      },
    });

    if (findWallet != null) {
      return res.status(400).json({
        code: 400,
        status: false,
        msg: `wallet has been created before to user ${user_id}`,
      });
    }
    const wallet = await Wallet.create({
      user_id,
      balance,
    });

    const getUsers = await Users.findOne({
      where: { id: reqUserId },
    });

    await Notification.create({
      user_id: reqUserId,
      message: `${getUsers.firstname} Success Create Wallet with ID ${wallet.id} at ${format_tgl}`,
      isRead: false,
    });

    return res.status(200).json({
      code: 200,
      status: true,
      msg: `wallet has been created to user ${user_id}`,
      data: wallet,
    });
  } catch (error) {}
};

export const updateWallet = async (req, res) => {
  const { id } = req.params;
  const reqUserId = req.user.userId;
  const wallet = await Wallet.findOne({
    where: { user_id: id },
  });
  const parsedDataProfile = JSON.parse(JSON.stringify(wallet));

  if (!parsedDataProfile) {
    return res.status(400).json({
      code: 400,
      status: false,
      msg: "Wallet doesn't exist or has been deleted!",
    });
  }

  const { balance } = req.body;

  //Sum Wallet
  const totalWallet = balance + wallet.balance;
  try {
    await Wallet.update(
      {
        balance: totalWallet,
      },
      {
        where: { user_id: id },
      }
    );

    const getUsers = await Users.findOne({
      where: { id: reqUserId },
    });

    await Notification.create({
      user_id: reqUserId,
      message: `${getUsers.firstname} Success Top Up Wallet with ID Users ${wallet.id} Total Balance : ${totalWallet} at ${format_tgl}`,
      isRead: false,
    });

    return res.status(200).json({
      code: 200,
      status: true,
      msg: "Wallet Success Updated",
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteWallet = async (req, res) => {
  const { id } = req.params;
  const reqUserId = req.user.userId;
  try {
    const wallet = await Wallet.findOne({
      where: { user_id: id },
    });
    const parsedDataProfile = JSON.parse(JSON.stringify(wallet));

    if (!parsedDataProfile) {
      return res.status(400).json({
        code: 400,
        status: false,
        msg: "Wallet doesn't exist or has been deleted!",
      });
    }

    await Wallet.destroy({
      where: { user_id: id },
    });

    const getUsers = await Users.findOne({
      where: { id: reqUserId },
    });

    await Notification.create({
      user_id: reqUserId,
      message: `${getUsers.firstname} Success Delete Wallet with ID Users ${parsedDataProfile.user_id} at ${format_tgl}`,
      isRead: false,
    });

    return res.status(200).json({
      code: 200,
      status: true,
      msg: "Wallet Success Deleted",
    });
  } catch (error) {
    console.log(error);
  }
};
