import User from "../model/user.model.js";

export const addExpense = async (req, res, next) => {
  try {
    const {name, amount, description, category } = req.body;

    const newExpense = {
      name,
      amount,
      description,
      category,
    };

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.addExpense(newExpense);

    res.status(201).json({
      success: true,
      message: "Expense added successfully",

    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getExpenses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      expenses: user.expenses,
      totalExpenses: user.getTotalExpenses(),
      success: true,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteExpense = async (req, res, next) => {
  const expenseId = req.body.id;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.removeExpense(expenseId);

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateExpense = async (req, res, next) => {
  const expenseId = req.body.id;
  const { amount, description, category } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const expense = user.expenses.id(expenseId);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    expense.amount = amount;
    expense.description = description;
    expense.category = category;
    await user.save();
    res.status(200).json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getExpensesByDateRange = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ message: "Start date and end date are required" });
  }

  try {
    const expenses = await User.findById(req.user._id);

    // Use the method to get filtered expenses
    const filteredExpenses = expenses.getExpensesByDateRange(
      startDate,
      endDate
    );

    const totalExpenses = expenses.totalExpenses();
    return res.json({
      expenses: filteredExpenses,
      totalExpenses,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving expenses", error });
  }
};
