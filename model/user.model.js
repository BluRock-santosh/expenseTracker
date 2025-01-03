import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    expenses: [
      {
        amount: { type: Number, required: true },
        name: { type: String, required: true },
        category: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};
userSchema.statics.getExpensesByDateRange = function (startDate, endDate) {
  return this.expenses.filter(
    (expense) => expense.date >= startDate && expense.date <= endDate
  );
};

userSchema.methods.getTotalExpenses = function () {
  return this.expenses.reduce((total, expense) => total + expense.amount, 0);
};

userSchema.methods.validPassword = async function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_EXPIRY }
  );
};

userSchema.methods.addExpense =  async function (expense) {
  this.expenses.push(expense);
  return await this.save();
};

userSchema.methods.removeExpense = async function (expenseId) {
  this.expenses = this.expenses.filter(
    (expense) => expense._id.toString() !== expenseId
  );
  return  await this.save();
};

const User = mongoose.model("User", userSchema);
export default User;
