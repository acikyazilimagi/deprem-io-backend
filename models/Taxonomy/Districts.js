const mongoose = require("mongoose");

const districtsSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  districtId: {
    type: Number,
  },
  cityId: {
    type: Number,
  }
});

module.exports = mongoose.model("districts", districtsSchema);
