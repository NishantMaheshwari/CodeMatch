const express = require("express");
const connectDB = require("./src/Config/database");
const cookieParser = require("cookie-parser");
const app = express();
const dotenv = require("dotenv");
dotenv.config({});
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// app.listen(3003, () => {
//   console.log('Server has started');
// })

app.use(express.json());
app.use(cookieParser());

// routes
const authRouter = require("./src/routes/auth");
const profileRouter = require("./src/routes/profile");

app.use("/", authRouter);
app.use("/", profileRouter);

//database connect before server
connectDB().then(() => {
  try {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on ` + process.env.PORT);
    });
  } catch (error) {
    console.log(error);
  }
});