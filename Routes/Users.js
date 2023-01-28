const { Router } = require("express");
const UserDB = require("../database/Schemas/user");
const PostDB = require("../database/Schemas/posts");
const CommentDB = require("../database/Schemas/Comments");
const router = Router();

//get a user
router.get("/", async (req, res) => {
  console.log("Inside  retreive unique user");
  const userId = req.query.userId;
  try {
    const loadedUser = userId
      ? await UserDB.findById(userId)
      : await UserDB.findOne({ username: username });
    const {
      _id,
      FirstName,
      LastName,
      ProfileDescription,
      email,
      Age,
      Profession,
      Country,
      NumberFriends,
      Friends,
      isAdmin,
      isConnected,
      img,
    } = loadedUser;
    res.status(200).json(loadedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a user by Id
router.get("/:userId", async (req, res) => {
  console.log("Inside retreive other user route ");
  console.log(req);
  try {
    const userId = req.query.userId;
    console.log("User Id is ");
    console.log(userId);
    const loadedUser = await UserDB.findById(userId);

    const {
      _id,
      FirstName,
      LastName,
      ProfileDescription,
      email,
      Age,
      Profession,
      Country,
      NumberFriends,
      Friends,
      isAdmin,
      isConnected,
      img,
    } = loadedUser;
    console.log("loadedUser is");
    res.status(200).json(loadedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get User by Email
router.get("/Email/:email", async (req, res) => {
  console.log("Inside retreive other user route ");
  try {
    const Email = req.params.email;
    console.log("Email is ");
    console.log(Email);
    const loadedUser = await UserDB.find({
      email: { $in: [Email] },
    });

    if (loadedUser[0] !== undefined) {
      const message = "There is already a user with the email " + Email;
      res.json(message);
    } else {
      const message = "";
      console.log("loadedUser is");
      res.status(200).json(message);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/AllUsers/all", async (req, res, next) => {
  console.log("Inside retreive all  users route ");
  try {
    const AllUsers = await UserDB.find({});

    const AllUsersArray = [];

    let index = 1;
    AllUsers.forEach(function (loadedUser) {
      const {
        FirstName,
        LastName,
        email,

        img,
      } = loadedUser;

      let id = index;
      let Email = email;
      let firstName = FirstName;
      let lastName = LastName;
      let image = img;

      AllUsersArray.push({ id, firstName, lastName, image, Email });
      index = index + 1;
    });

    res.status(200).json(AllUsersArray);
  } catch (err) {
    console.log("The error is");
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  console.log("Inside delete user request ");
  try {
    const ID = req.params.id;
    console.log("User Id is ");
    console.log(ID);

    //Retreiving the User
    const User = await UserDB.findById(ID);

    const { FirstName, LastName } = User;

    const Username = FirstName + " " + LastName;

    console.log("Username is ");
    console.log(Username);

    //Deleting all the posts of the User
    DeletePosts = await PostDB.deleteMany({
      creator: ID,
    });
    const DeleteComments = await CommentDB.deleteMany({ UserName: Username });

    const field = await UserDB.deleteOne({
      _id: ID,
    });

    console.log(field);
    res.status(200).json("");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/Update", async (req, res) => {
  console.log("Inside the update profile route ");
  try {
    if (!req.file) {
      const {
        id,
        FirstName,
        LastName,
        Country,
        ProfileDescription,
        Profession,
      } = req.body;
      console.log("ID is " + id);
      const filter = { _id: id };
      var update = {};

      var dict = {};

      dict["key"] = "testing";

      const profession = "";
      if (Profession !== undefined) {
        update["Profession"] = Profession;
        console.log("Update is ");
        console.log(update);
      }

      let firstName = "";
      if (FirstName !== undefined) {
        firstName = FirstName;
        update["FirstName"] = FirstName;
      }
      let lastName = "";
      if (LastName !== undefined) {
        lastName = LastName;
        update["LastName"] = LastName;
      }
      const country = "";
      if (Country !== undefined) {
        update["Country"] = Country;
      }

      const profileDescription = "";
      if (ProfileDescription !== undefined) {
        update["ProfileDescription"] = ProfileDescription;
      }

      const RetreivedUser = await UserDB.findById(id);
      let Fullname = "";

      const FullName = RetreivedUser.FirstName + " " + RetreivedUser.LastName;

      if (firstName != "" || lastName != "") {
        Fullname = firstName + " " + lastName;
      }
      const filter3 = {
        UserName: FullName,
      };

      var update3 = {};

      if (Fullname != "") {
        update3["UserName"] = Fullname;
      }

      const UpdatedComments = await CommentDB.updateMany(filter3, update3);

      const Updated = await UserDB.findOneAndUpdate(filter, update);
    } else {
      const imageURL = req.file.path;

      const myArray = imageURL.split("Images\\");

      const path = myArray[1];
      var FinalPath = path.replace(/\\/g, "/").toString();
      console.log("Final Path is ");
      console.log(FinalPath);

      const {
        id,
        FirstName,
        LastName,
        Country,
        ProfileDescription,
        Profession,
      } = req.body;
      const filter = { _id: id };
      const update = {};

      const profession = "";
      if (Profession !== undefined) {
        update["Profession"] = Profession;
      }

      let firstName = "";
      if (FirstName !== undefined) {
        firstName = FirstName;
        update["FirstName"] = FirstName;
      }
      let lastName = "";
      if (LastName !== undefined) {
        lastName = LastName;
        update["LastName"] = LastName;
      }
      const country = "";
      if (Country !== undefined) {
        update["Country"] = Country;
      }

      const profileDescription = "";
      if (ProfileDescription !== undefined) {
        update["ProfileDescription"] = ProfileDescription;
      }
      const Image = "";
      if (FinalPath !== undefined) {
        update["img"] = FinalPath;
      }

      const RetreivedUser = await UserDB.findById(id);

      const Updated = await UserDB.findOneAndUpdate(filter, update);
      const FullName = RetreivedUser.FirstName + " " + RetreivedUser.LastName;

      let Fullname = "";

      if (firstName != "" || lastName != "") {
        Fullname = firstName + " " + lastName;
      }

      Updated.posts.forEach((post) => {
        //	if (post.toString() === id) {
        console.log(post.toString());
        const filter2 = { _id: post.toString() };
        var update2 = {};
        update2["AvatarURL"] = FinalPath;
        PostDB.findOneAndUpdate(filter2, update2).then((post) => {});

        //}
      });
      console.log("The old name  is " + FullName);
      console.log("The new name is " + Fullname);
      const filter3 = {
        UserName: FullName,
      };

      var update3 = {};
      console.log("Full Name1 is ");
      console.log(FullName);
      console.log("Full Name2 is ");
      console.log(Fullname);
      update3["UserImg"] = FinalPath;

      if (Fullname != "") {
        update3["UserName"] = Fullname;
      }

      const UpdatedComments = await CommentDB.updateMany(filter3, update3);
      console.log(UpdatedComments);
    }

    //Updating the comments as well here
    res.status(200).json("User Updated");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
