const mongoose = require("mongoose");
const { Schema } = mongoose;

const segmentSchema = new Schema(
  {
    // document: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Document",
    //   required: true,
    // },
    text: {
      type: String,
    },
    // bold: {
    //   type: Boolean,
    //   default: false,
    // },
    // underline: {
    //   type: Boolean,
    //   default: false,
    // },
    // strike: {
    //   type: Boolean,
    //   default: false,
    // },
    // italic: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("Segment", segmentSchema);
