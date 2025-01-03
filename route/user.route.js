import express from "express";
const Router = express.Router();
import {
  createUser,
  loginUser,
  logoutUser,
} from "../controller/user.controller.js";
import {
  addExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
} from "../controller/expense.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

// Public Routes (No Authentication Required)
Router.post("/user/signup",createUser); // User registration
Router.post("/user/login",loginUser); // User login

// Middleware for Protected Routes
Router.use(authMiddleware);


Router.route("/")
  .get(getExpenses) // Get all expenses
  .put(updateExpense) // Update an expense
  .post(addExpense) // Add an expense
  .delete(deleteExpense); // Delete an expense
  Router.route("/user/logout").post(logoutUser); 

export default Router;
