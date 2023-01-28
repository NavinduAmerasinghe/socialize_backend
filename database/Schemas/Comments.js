const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new mongoose.Schema(
  {
    UserName: {
      type: String,
      required: true,
    },
    Content: {
      type: String,
      required: true,
    },
    DateCreated: {
      type: String,
      required: true,
    },
    UserImg: {
      type: String,
      required: true,
    },
    PostID: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
