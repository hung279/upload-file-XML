const mongoose = require("mongoose");
const { Schema } = mongoose;

const documentSchema = new Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    ext: {
      type: String,
    },
    path: {
      type: String,
      required: true,
    },
    pages: {
      type: Number,
    },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("Document", documentSchema);