import User from "../model/user.model.js";
import { sendEmail } from "../utils/SendMail.js";
import {userRegistrationEmailContent } from "../utils/static.js"; 

export const createUser = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
        success: "false",
                   
      });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await User.hashPassword(password);

   
    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
    });
    const user = newUser.toObject();
    delete user.password;

   const content  = userRegistrationEmailContent(username)
    sendEmail(newUser.email,content)

    

    res.status(201).json({
      success: "true",
      user,
      message: "User created successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }


    if ( !user.validPassword(password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token for the user
    const token = user.generateAccessToken();
    const totalExpenses = user.getTotalExpenses();

    delete user.password;

    const cookieOption = {
      secure: true,
      httpOnly: true,
      sameSite: "Lax",
      path: "/",
    };

    
    res.status(200).cookie("accessToken", token, cookieOption).json({
      user,
      success: "true",
      message: "user login successfully",
      token,
      totalExpenses,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("accessToken").json({ message: "logout successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};