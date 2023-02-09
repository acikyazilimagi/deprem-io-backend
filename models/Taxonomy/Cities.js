const mongoose = require("mongoose");

const citiesSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  cityId: {
    type: Number,
  }
});

module.exports = mongoose.model("cities", citiesSchema);
