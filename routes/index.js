import express from "express";
import yaml from "js-yaml";
import fs from "fs";
import {
  getUsers,
  Register,
  LoginUsers,
  Logout,
  whoAmI,
  deleteUsers,
  updateUsers,
  updateProfile,
  updatePassword,
  getUsersBy,
  getUsersById,
  getUsersByJwt,
  handleGetRoot,
} from "../controllers/HandlerUsers.js";
import {
  getTicket,
  createTicket,
  deleteTicket,
  updateTicket,
  getTicketById,
  getTicketQuery,
} from "../controllers/HandlerTicket.js";
import pkg from "../uploadImage/HandlerFile.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import {
  createAirport,
  deleteAirport,
  getAirport,
  getAirportBy,
  getAirportById,
  updateAirport,
} from "../controllers/HandleAirport.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import {
  actionBooking,
  getBookingById,
  getUserBooking,
} from "../controllers/HandlerBooking.js";
import {
  createWishlist,
  deleteWishlist,
  getWishlist,
  getWishlistbyid,
} from "../controllers/HandlerWishlist.js";
import {
  deletePassanger,
  getPassanger,
  getPassangerById,
  updatePassanger,
} from "../controllers/HandlerPassanger.js";
import {
  createFlight,
  deleteFlight,
  getFlight,
  getFlightBy,
  getFlightById,
  updateFlight,
} from "../controllers/HandlerFlight.js";
import {
  getPaymentAllCondition,
  getPaymentById,
  getPaymentFromCondition,
  isCancelPayment,
  isPaymentTicket,
} from "../controllers/HandlerPayment.js";

import {
  createWallet,
  deleteWallet,
  getSaldoWallet,
  getSaldoWalletAll,
  updateWallet,
} from "../controllers/HandlersWallet.js";
import {
  DeleteHistoryById,
  getHistoryById,
  getHistoryPayment,
} from "../controllers/HandlerHistory.js";
import {
  deleteNotificationById,
  getAllNotifyCondition,
  readNotify,
} from "../controllers/HandlerNotif.js";
const router = express.Router();
const prefix = "/v1/api/";
const { uploadPictures, getListFiles } = pkg;

const swaggerDocument = yaml.load(
  fs.readFileSync("Final_Project-OpenAPI.yaml", "utf8")
);
import swaggerUI from "swagger-ui-express";

//DOCS API
router.use(
  prefix + "api-docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocument)
);

//ROUTES FOR USERS
router.get(prefix, handleGetRoot);
router.get(prefix + "users", getUsers);
router.get(prefix + "users/:id", getUsersById);
router.get(prefix + "users/profile/:search", getUsersBy);
router.get(prefix + "users/myprofile", verifyToken, getUsersByJwt);
router.post(prefix + "register", Register);
router.post(prefix + "login", LoginUsers);
router.delete(prefix + "logout", verifyToken, Logout);
router.delete(prefix + "users/delete/:id", verifyToken, deleteUsers);
router.put(prefix + "users/edit/:id", verifyToken, updateUsers);
router.put(prefix + "users/profile", verifyToken, updateProfile);
router.put(prefix + "users/profile/password", verifyToken, updatePassword);
router.get(prefix + "whoami", verifyToken, whoAmI);

//ROUTES FOR UPLOAD FILE
router.post(prefix + "upload", uploadPictures);
router.get(prefix + "profilepictures", getListFiles);

//ROUTES FOR TICKETS
router.get(prefix + "tickets", getTicket);
router.get(prefix + "tickets/search", getTicketQuery);
router.post(prefix + "tickets", verifyToken, createTicket);
router.delete(prefix + "tickets/delete/:id", verifyToken, deleteTicket);
router.put(prefix + "tickets/edit/:id", verifyToken, updateTicket);
router.get(prefix + "tickets/:id", getTicketById);

//ROUTES FOR AIRPORT
router.get(prefix + "airports", getAirport);
router.get(prefix + "airports/:search", getAirportBy);
router.get(prefix + "airports/byid/:id", getAirportById);
router.put(prefix + "airports/edit/:id", verifyToken, updateAirport);
router.delete(prefix + "airports/delete/:id", verifyToken, deleteAirport);
router.post(prefix + "airports", verifyToken, createAirport);

//ROUTES FOR BOOKING
router.get(prefix + "bookings/byid/:id", verifyToken, getBookingById);
router.get(prefix + "userbookings", verifyToken, getUserBooking);

//ROUTER FOR PASSANGERS
router.get(prefix + "passanger", verifyToken, getPassanger);
router.get(prefix + "passanger/:id", verifyToken, getPassangerById);
router.put(prefix + "passanger/edit/:id", verifyToken, updatePassanger);
router.delete(prefix + "passanger/delete/:id", verifyToken, deletePassanger);

//ROUTES FOR WISHLIST
router.get(prefix + "wishlists", verifyToken, getWishlist);
router.get(prefix + "wishlists/:id", verifyToken, getWishlistbyid);
router.post(prefix + "wishlists/create", verifyToken, createWishlist);
router.delete(prefix + "wishlists/delete/:id", deleteWishlist);

//ROUTES FOR FLIGHT
router.get(prefix + "flight", getFlight);
router.get(prefix + "flight/:search", getFlightBy);
router.get(prefix + "flight/byid/:id", getFlightById);
router.post(prefix + "flight/create", verifyToken, createFlight);
router.delete(prefix + "flight/delete/:id", verifyToken, deleteFlight);
router.put(prefix + "flight/edit/:id", verifyToken, updateFlight);

//API FOR ACTION BUYER
router.post(prefix + "booking", verifyToken, actionBooking);
router.post(prefix + "booking/payment/:id", verifyToken, isPaymentTicket);
router.post(prefix + "cancel/payment/:id", verifyToken, isCancelPayment);

//API FOR TOKEN
router.get(prefix + "token", refreshToken);

//API FOR PAYMENT
router.get(prefix + "payments", verifyToken, getPaymentAllCondition);
router.get(prefix + "payments/all/:id", verifyToken, getPaymentFromCondition);
router.get(prefix + "payments/all", verifyToken, getPaymentFromCondition);
router.get(prefix + "payments/:id", verifyToken, getPaymentById);

//API FOR WALLET
router.get(prefix + "wallet", verifyToken, getSaldoWallet);
router.get(prefix + "wallet/all", verifyToken, getSaldoWalletAll);
router.post(prefix + "wallet/create", verifyToken, createWallet);
router.put(prefix + "wallet/edit/:id", verifyToken, updateWallet);
router.delete(prefix + "wallet/delete/:id", verifyToken, deleteWallet);

//API FOR HISTORY
router.get(prefix + "history/:condition", verifyToken, getHistoryPayment);
router.get(prefix + "history/byid/:id", verifyToken, getHistoryById);
router.delete(prefix + "history/delete/:id", verifyToken, DeleteHistoryById);

//API FOR NOTIFICATION
router.get(prefix + "notif/all", verifyToken, getAllNotifyCondition);
router.get(prefix + "notif/all/:id", verifyToken, getAllNotifyCondition);
router.put(prefix + "notif/read", verifyToken, readNotify);
router.post(prefix + "notif/read", verifyToken, readNotify);
router.delete(prefix + "notif/delete/:id", verifyToken, deleteNotificationById);

export default router;
