const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

//Middleware
app.use(cors());
app.use(express.json()); //for parsing application/json
app.use(express.urlencoded({ extended: true })); //For parsing application/x-www-form-urlencode

//MongoDB Connection
mongoose
  .connect("mongoURI")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

//Schema and model
const seriesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String },
  seasons: { type: Number, default: 1 },
});

const Series = mongoose.model("Series", seriesSchema);

//Routes
app.get("/api/series", async (req, res) => {
  try {
    const series = await Series.find();
    res.json(series);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving series", error });
  }
});

app.post("/api/series", async (req, res) => {
  try {
    const newSeries = new Series(req.body);
    await newSeries.save();
    res.status(201).json(newSeries);
  } catch (error) {
    res.status(400).json({ message: "Error adding series", error });
  }
});

//start the server
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
