const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const checkAuth = require("./middleware/checkAuth");
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(
  "mongodb+srv://Rahul-admin:Rahul.123@cluster0.v5lr1om.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

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

app.use("/api/deployments/latest/products", require("./routes/products"));
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

app.listen(process.env.PORT, () => {
  console.log(`Listening on ${process.env.PORT} port!`);
});
