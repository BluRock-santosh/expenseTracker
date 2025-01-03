import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./utils/dbConnect.js";
import cookieParser from "cookie-parser";
import Router from "./route/user.route.js";
dotenv.config();
const PORT = process.env.PORT || 4001;

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(
  {
    origin: "https://67784306b0b7744f0982058c--aquamarine-biscuit-6eb6a5.netlify.app/",
    credentials: true,
  }
));


app.use("/api", Router);

dbConnect();
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
