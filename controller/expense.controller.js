import User from "../model/user.model.js";

export const addExpense = async (req, res, next) => {
  try {
    const { name, amount, description, category } = req.body;

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
      message: "Expenses retrieved successfully",
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

  //  
  const expense =user.expenses.filter(expense => expense.expenseId !== expenseId);
  await user.save();

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
      expenses: expense,
    });
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
  const { startDate, endDate } = req.body;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ message: "Start date and end date are required" });
  }

  try {
    // Fetch the user by their ID
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter expenses by date range
    const filteredExpenses = user.expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate)
      );
    });

    // Calculate total expenses using the filtered list
    const totalExpenses = filteredExpenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );

    // Respond with filtered expenses and total
    return res.json({
      expenses: filteredExpenses,
      totalExpenses,
      success: true,
      message: "Expenses retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving expenses:", error);
    return res.status(500).json({
      message: "Error retrieving expenses",
      error: error.message,
    });
  }
};
