const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");

require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGODB_STRING);

let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => console.log("We're connected to MongoDB Compass."));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: ['http://localhost:8000', 'http://localhost:5173'],
    credentials: true,
    optionSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use("/users", userRoutes);

app.use("/products", productRoutes);

app.use("/cart", cartRoutes);

app.use("/orders", orderRoutes);

if (require.main === module) {
    app.listen(process.env.PORT || 4000, () => console.log(`Server running at port ${process.env.PORT || 4000}`));
}

module.exports = { app, mongoose };
