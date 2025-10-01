const express = require("express");
const connectDB = require("./src/Config/database");
const cookieParser = require("cookie-parser");
const app = express();
const dotenv = require("dotenv");
dotenv.config({});
const cors = require("cors");
const http = require("http");

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
const requestRouter = require("./src/routes/request");
const userRouter = require("./src/routes/user");
// const paymentRouter = require("./src/routes/payment");
const initializeSocket = require("./src/utils/socket");
const chatRouter = require("./src/routes/chat");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
// app.use("/", paymentRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
initializeSocket(server);


//database connect before server
connectDB().then(() => {
  try {
    server.listen(process.env.PORT, () => {
      console.log(`Server running on ` + process.env.PORT);
    });
  } catch (error) {
    console.log(error);
  }
});