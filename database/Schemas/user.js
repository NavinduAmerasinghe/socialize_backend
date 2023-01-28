const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  ProfileDescription: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },
  Age: {
    type: Number,
    required: true,
  },
  Profession: {
    type: String,
    required: true,
  },

  Country: {
    type: String,
    required: true,
  },

  NumberFriends: {
    type: String,
    required: true,
  },

  Friends: [
    {
      type: Schema.Types.ObjectID,
      ref: "user",
    },
  ],

  ProfilePictures: {
    type: Array,
    default: [],
  },
  // Maybe String for Content Type
  /*
	img: {
		data: Buffer,
		contentType: String,
	},
	*/
  img: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },

  isConnected: {
    type: Boolean,
    required: true,
    default: false,
  },

  posts: [
    {
      type: Schema.Types.ObjectID,
      ref: "Post",
    },
  ],
  LikedPosts: [
    {
      type: Schema.Types.ObjectID,
      ref: "Post",
    },
  ],
});

module.exports = mongoose.model("user", UserSchema);
