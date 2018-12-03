const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const UUID = require("uuid");
const multer = require("multer");
const http = require("http");
const socketIO = require("socket.io");

const server = http.createServer(app);
const io = socketIO(server);

io.on("connection", socket => {
  console.log(socket.id);

  socket.on("SEND_MESSAGE", function(data) {
    io.emit("RECEIVE_MESSAGE", data);
  });
});

const dbConnect = require("./_assets/db_connect");
let mydb = dbConnect();

/**
 * multer [START] - neotestovany zatial
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },

  filename: (req, file, cb) => {
    const newFilename = file.originalname;
    cb(null, newFilename);
  }
});

const upload = multer({
  storage
});

/**
 * multer [END]
 */

app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

/**
 * routes [START]
 */

app.get("/", (req, res) => {
  const eventShowAll = require("./modules/event/showAll");
  eventShowAll(mydb, req, res);
});

app.get("/find/:searchedString", (req, res) => {
  const finder = require("./modules/finder/finder");
  finder(mydb, req, res);
});

app.get("/event/:id", (req, res) => {
  const getOneEvent = require("./modules/event/getOne");
  getOneEvent(mydb, req, res);
});

app.post("/create-event", (req, res) => {
  const eventCreate = require("./modules/event/create");
  eventCreate(mydb, req, res);
});

app.put("/update-event/:id", (req, res) => {
  const eventUpdate = require("./modules/event/update");
  eventUpdate(mydb, req, res);
});

app.put("/delete-event/:id", (req, res) => {
  const eventDelete = require("./modules/event/delete");
  eventDelete(mydb, req, res);
});

app.get("/profile/:id", (req, res) => {
  const getUserInfo = require("./modules/user/info");
  getUserInfo(mydb, req, res);
});

app.get("/reviews/:id", (req, res) => {
  const getEventReviews = require("./modules/review/get");
  getEventReviews(mydb, req, res);
});

app.post("/review/add", (req, res) => {
  const addReview = require("./modules/review/add");
  addReview(mydb, req, res);
});

app.put("/review/delete/:id", (req, res) => {
  const removeReview = require("./modules/review/delete");
  removeReview(mydb, req, res);
});

app.put("/review/update/:id", (req, res) => {
  const updateReview = require("./modules/review/update");
  updateReview(mydb, req, res);
});

app.get("/comments/:id", (req, res) => {
  const getEventComments = require("./modules/comment/get");
  getEventComments(mydb, req, res);
});

app.post("/comments/add", (req, res) => {
  const addComment = require("./modules/comment/add");
  addComment(mydb, req, res);
});

app.put("/comments/delete/:id", (req, res) => {
  const removeComment = require("./modules/comment/delete");
  removeComment(mydb, req, res);
});

app.put("/comments/update/:id", (req, res) => {
  const updateComment = require("./modules/comment/update");
  updateComment(mydb, req, res);
});

app.post("/share-event", (req, res) => {
  const eventShare = require("./modules/event/share");
  eventShare(mydb, req, res);
});

app.post("/register", (req, res) => {
  const userRegister = require("./modules/user/register");
  userRegister(mydb, req, res);
});

app.post("/login", (req, res) => {
  const userLogin = require("./modules/user/login");
  userLogin(mydb, req, res);
});

app.post("/save-image", upload.single("selectedFile"), (req, res) => {
  res.send();
});

/**
 * routes [END]
 */

app.listen(process.env.PORT || 3000, () => {
  console.log("app is running on port 3000");
});
