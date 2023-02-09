const mongoose = require("mongoose");

const collabrationListingSchema = new mongoose.Schema({
  institutionName: {
    type: String,
    required: true,
  },
  City: {
    type: Number,
    required: true,
  },
  District: {
    type: Number,
    required: true,
  },
  needType: {
    type: [Number], // 1: ilaç, 2: tıbbi malzeme, 3: tıbbi cihaz, 4: tıbbi ekipman, 5: tıbbi personel, 6: diğer
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  locationUrl: {
    type: String,
  },
  activeStatus: {
    type: Boolean,
    required: true,
    default: false,
  },
  emergencyStatus: {
    type: Number, // 0: normal, 1: acil, 2: acil acil
    required: true,
  },
  contactPerson: {
    type: String,
  },
  contactPersonPhone: {
    type: String,
  },
  note: {
    type: String,
  }
},
  { timestamps: true, paranoid: true });



module.exports = mongoose.model("collabrationListing", collabrationListingSchema);;
