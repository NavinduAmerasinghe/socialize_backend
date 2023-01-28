const express = require("express");
const { body } = require("express-validator");
const Post = require("../database/Schemas/posts");
const CommentDB = require("../database/Schemas/Comments");
const UserDB = require("../database/Schemas/user");
const mongoose = require("mongoose");
const feedController = require("../database/Controllers/feed");
const router = express.Router();

// POST /feed/post
router.post("/Create", feedController.createPost);

router.get("/AllPosts", async (req, res, next) => {
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
});

router.get("/:postId", async (req, res, next) => {
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
});
router.delete("/Delete/:postId", async (req, res, next) => {
  console.log("Inside the delete Posts Method");
  console.log("Params post ID is " + req.params.postId);
  const postId = req.params.postId;

  try {
    //Retreive the UserID creator
    const ThePost = await Post.findById(postId);

    const { creator } = ThePost;

    //Deleting Post from collection
    const DeletedPost = await Post.deleteOne({
      _id: { $in: [postId] },
    });

    // Deleting All Comments from the Collection
    const RemovedComments = await CommentDB.deleteMany({
      PostID: { $in: [postId] },
    });

    // Find the user creator of the post
    const CreatorUser = await UserDB.findById(creator);

    const NewPostArray = CreatorUser.posts.filter(
      (entry) => entry.toString() !== postId
    );

    console.log(CreatorUser.posts.length);

    console.log(NewPostArray.length);

    const filter = { _id: creator };
    var update = {};
    update["posts"] = NewPostArray;
    //Update the UserCollection
    const Updated = await UserDB.findOneAndUpdate(filter, update);
    res.status(200).json(Updated);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/PostsUser/:UserId", async (req, res, next) => {
  try {
    console.log("Trying to get all posts for one User ");
    console.log("Params post ID is ");
    console.log(req.params);
    const UserId = req.params.UserId;

    const AllPosts = await Post.find({ creator: UserId });
    console.log(AllPosts);
    res.status(200).json(AllPosts);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put("/AddLike/:PostID/:UserID", async (req, res, next) => {
  try {
    console.log("Trying to add a like to a post ");
    console.log("Params post ID is ");
    console.log(req.params);
    const PostID = req.params.PostID;
    const UserID = req.params.UserID;
    console.log("User ID is ");
    console.log(UserID);

    const RtreivedUser = await UserDB.findById(UserID);

    const RtreivedPost = await Post.findById(PostID);

    console.log("Old array is ");
    console.log(RtreivedUser.LikedPosts);

    var Objectid = mongoose.Types.ObjectId(PostID);
    if (RtreivedUser.LikedPosts.indexOf(Objectid) === -1) {
      const NewArray = RtreivedUser.LikedPosts.push(RtreivedPost);
      RtreivedUser.save();
      console.log("New array is ");
      console.log(NewArray);
    } else {
      console.log(PostID);
      console.log("Is already in the array ");
    }

    let NumberOfLikes = RtreivedPost.NumberOfLikes;
    NumberOfLikes += 1;
    const filter = { _id: PostID };
    var update = {};
    update["NumberOfLikes"] = NumberOfLikes;
    const Updated = await Post.findOneAndUpdate(filter, update);

    res.status(200).json(NumberOfLikes);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put("/RemoveLike/:PostID/:UserID", async (req, res, next) => {
  try {
    console.log("Trying to remove a like to a post ");
    console.log("Params post ID is ");
    console.log(req.params);
    const PostID = req.params.PostID;
    const UserID = req.params.UserID;
    console.log("User ID is ");
    console.log(UserID);

    const RtreivedUser = await UserDB.findById(UserID);

    const RtreivedPost = await Post.findById(PostID);

    var Objectid = mongoose.Types.ObjectId(PostID);
    console.log(Objectid);
    //Meaning the element is Present in The Array
    if (RtreivedUser.LikedPosts.indexOf(Objectid) !== -1) {
      const NewArray = RtreivedUser.LikedPosts.filter(
        (id) => id.toString() !== PostID
      );

      console.log("New array is ");
      console.log(NewArray);
      console.log("Old array is ");
      console.log(RtreivedUser.LikedPosts);

      const filter = { _id: UserID };
      var update = {};
      update["LikedPosts"] = NewArray;
      const Updated = await UserDB.findOneAndUpdate(filter, update);
    } else {
      console.log(PostID);
      console.log("Is already in the array ");
    }

    let NumberOfLikes = RtreivedPost.NumberOfLikes;
    NumberOfLikes -= 1;
    const filter = { _id: PostID };
    var update = {};
    update["NumberOfLikes"] = NumberOfLikes;
    const Updated = await Post.findOneAndUpdate(filter, update);

    res.status(200).json(NumberOfLikes);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
