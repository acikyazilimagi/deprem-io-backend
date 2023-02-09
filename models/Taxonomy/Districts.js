const mongoose = require("mongoose");

const districtsSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  id: {
    type: Number,
  },
  cityId: {
    type: Number,
    references: {
      model: "cities",
      key: "id",
    }
  }
});

module.exports = mongoose.model("districts", districtsSchema);
