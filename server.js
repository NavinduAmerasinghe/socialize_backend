const { response } = require("express");
const express = require("express");
const dotenv = require("dotenv");
const UsersRouter = require("./Routes/Users");
const FriendsRouter = require("./Routes/Friends");
const PostsRouter = require("./Routes/Posts");
const CommentsRouter = require("./Routes/Comments");
const chatRouter = require("./Routes/chat");
const messagesRouter = require("./Routes/messages");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const authRoute = require("./routes/authentication");
const multer = require("multer");
const path = require("path");
const app = express();
const { v4: uuidv4 } = require("uuid");

dotenv.config();

connectDB = require("./database/connection");

const cors = require("cors");

const filestorage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, "../Frontend/my-app/src/Images");
  },

  //add back the extension
  filename: (request, file, callback) => {
    callback(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  multer({ storage: filestorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join("../Images")));
app.use(cookieParser());

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

//Database
connectDB();

app.use(cors());

//Router api
app.use("/Users", UsersRouter);

app.use("/auth", authRoute);

app.use("/Friends", FriendsRouter);

app.use("/Posts", PostsRouter);

app.use("/Comments", CommentsRouter);

app.use("/Chat", chatRouter);

app.use("/Messages", messagesRouter);
app.get("/", (req, res) => {
  res.send("hello world");
});

//Listner
app.listen(5000, () => {
  console.log("Server started on  port 5000");
});
