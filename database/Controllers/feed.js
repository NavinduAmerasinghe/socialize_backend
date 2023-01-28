const { validationResult } = require("express-validator");
const Post = require("../Schemas/posts");
const date = require("date-and-time");
const UserDB = require("../Schemas/user");

exports.createPost = (request, response, next) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }

  if (!request.file) {
    const error = new Error("No Image provided");
    error.stautsCode = 422;
    throw error;
  }

  const imageURL = request.file.path;
  console.log("hello ");
  const now = new Date();

  CurrentDate = date.format(now, "ddd, MMM DD YYYY");
  const { title, content, creator, AvatarURL } = request.body;
  console.log(AvatarURL);

  const myArray = imageURL.split("Images\\");

  const path = myArray[1];
  var FinalPath = path.replace(/\\/g, "/").toString();

  const post = new Post({
    title: title,
    content: content,
    imageUrl: FinalPath,
    date: CurrentDate,
    creator: creator,
    AvatarURL: AvatarURL,
    Comments: [],
  });
  post
    .save()
    .then((result) => {
      return UserDB.findById(creator);
    })
    .then((user) => {
      user.posts.push(post);
      return user.save();
    })
    .then((post) => {
      response.status(201).json({
        message: "Post created successfully!",
        post: post,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
      console.log(err);
    });
};

exports.getPost = (req, res, next) => {
  console.log("Trying to get one Post for ID ");
  console.log("Params post ID is " + req.params.postId);
  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        console.log("Could not find post");
        const error = new Error("Could not find post");
        error.statusCode = 404;
        throw error;
      } else {
        console.log("Post fetched");
        res.status(200).json({ message: "Post fetched.", post: post });
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getAllPost = async (req, res, next) => {
  console.log("Inside retreive all  users route ");
  try {
    const AllPosts = await Post.find({});

    const AllPostsIDs = [];

    AllPosts.forEach(function (x) {
      AllPostsIDs.push(x._id);
    });

    res.status(200).json(AllPostsIDs);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
