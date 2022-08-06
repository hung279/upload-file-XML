const mongoose = require("mongoose");

module.exports = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb://localhost:27017/uploadFileXML",
      { useNewUrlParser: true }
    );
    console.log("Connected database");
  } catch (error) {
    console.log(error);
  }
};
