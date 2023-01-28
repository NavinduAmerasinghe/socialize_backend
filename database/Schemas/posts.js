const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },
    AvatarURL: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },

    creator: {
      type: String,
      required: true,
    },
    ColorOfLikeButton: {
      type: String,
      default: "default",
    },
    NumberOfLikes: {
      type: Number,
      default: 0,
    },

    Comments: [
      {
        type: Schema.Types.ObjectID,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
