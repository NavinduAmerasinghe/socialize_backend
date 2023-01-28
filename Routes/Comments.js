const { Router } = require("express");
const CommentDB = require("../database/Schemas/Comments");
const router = Router();
const PostDB = require("../database/Schemas/posts");

router.get("/All/:PostID", async (req, res) => {
  console.log("Inside  get All Comments Route");
  try {
    const PostID = req.params.PostID;
    console.log("PostID) is ");
    console.log(PostID);
    const AllComments = await CommentDB.find({
      PostID: { $all: [PostID] },
    });

    const AllCommentsIDs = [];

    AllComments.forEach(function (x) {
      AllCommentsIDs.push(x);
    });

    res.status(200).json(AllCommentsIDs);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
router.post("/", async (req, res) => {
  console.log("We are inside post Comment Route");
  console.log(req.body);
  const newComment = new CommentDB(req.body);
  try {
    const savedComment = await newComment.save();
    Post = await PostDB.findById(req.body.PostID);
    Post.Comments.push(savedComment);
    await Post.save();
    res.status(200).json(savedComment);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  console.log("We are inside delete Comment Route");
  const CommentID = req.params.id;
  console.log("Comment ID is ");
  console.log(CommentID);
  try {
    //Retreive the Comment PostID
    const TheComment = await CommentDB.findOne({ _id: CommentID });

    const { PostID } = TheComment;

    //Deleting Comment from collection
    const DeletedPost = await CommentDB.deleteOne({
      _id: { $in: [CommentID] },
    });

    // Find the Post where that comment was
    const Post = await PostDB.findById(PostID);

    //Filter the array of posts remove the deleted one

    const NewPostArray = Post.Comments.filter(
      (entry) => entry.toString() !== CommentID
    );

    console.log(Post.Comments.length);

    console.log(NewPostArray.length);

    const filter = { _id: PostID };
    var update = {};
    update["Comments"] = NewPostArray;
    const Updated = await PostDB.findOneAndUpdate(filter, update);
    res.status(200).json(Updated);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
module.exports = router;
