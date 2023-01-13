const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const checkAuth = require("./middleware/checkAuth");
const dotenv = require("dotenv");
dotenv.config()
const {sendMail} = require("./routes/mailSender")

const port = process.env.PORT;

const DB = process.env.DATABASE_URL;
console.log(DB);
mongooseOptions = {
  autoIndex: false,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
  keepAliveInitialDelay: 300000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  minPoolSize: 3,
};

mongoose.set("strictQuery", true);

mongoose.connect(DB, mongooseOptions).then(() => {
  console.log("Database Connected !");
});

mongoose.connection.on("error", (error) => {
  console.log(error);
});

// Used to log everything like GET, POST, etc requests
app.use(morgan("dev"));

// It ensures that we prevent Cross-Origin Resource Sharing(CORS) errors
// If client made req on localhost:4000, and received res from server which
// has localhost:3000 req will fail. It is always the case with RESTful APIs
// So, we attach headers from servers to client to tell browser that it's OK
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

// Extracts json data and makes it easy readable to us
app.use(bodyParser.json());

app.use("/", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// To make uploads folder publically available with '/api/videos' route
app.use(express.static("public"));

app.use("/api/signup", require("./routes/signUp"));
app.use("/api/signin", require("./routes/signIn"));
app.use("/api/signout", checkAuth, require("./routes/signOut"));
app.use("/api/admin", checkAuth, require("./routes/adminRoutes/adminRoutes"));

app.post("/api/subscribe-newsletter", checkAuth,async (req, res, next) => {
  try {
    await sendMail(
      req.body.email,
      `<p><b>You have successfully subscribed our newsletter.</b></p>`,
      "STORE"
    );
    return res.status(200).json({
      data:"successfully mailed"
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.use("/api/products", require("./routes/products"));
app.use("/api/orders/placeorder", checkAuth, require("./routes/placeOrder"));
app.use("/api/myorders", checkAuth, require("./routes/myOrders"));
app.use(
  "/api/saveshippingaddress",
  checkAuth,
  require("./routes/saveShippingAddress")
);
app.use(
  "/api/fetchshippingaddress",
  checkAuth,
  require("./routes/fetchShippingAddress")
);
app.use("/api/product/add-review", checkAuth, require("./routes/addReview"));
app.use("/api/product/delete-review", require("./routes/deleteReview"));
app.use("/api/addToCart", checkAuth, require("./routes/addToCart"));

app.all("*", (req, res) => {
  res.status(404).json({
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
