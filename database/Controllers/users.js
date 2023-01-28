const { validationResult } = require("express-validator");
const Post = require("../Schemas/posts");
const UserDB = require("../Schemas/user");

const bycript = require("bcryptjs");

const jwt = require("jsonwebtoken");

exports.createUser = (request, response, next) => {
  console.log("Inside create user");
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
  const myArray = imageURL.split("Images\\");

  const path = myArray[1];
  var FinalPath = path.replace(/\\/g, "/").toString();
  console.log("Final Path is ");
  console.log(FinalPath);

  const {
    FirstName: FirstName,
    LastName: LastName,
    password: password,
    ProfileDescription: ProfileDescription,
    email: email,
    Age: Age,
    Profession: Profession,
    Country: Country,
    NumberFriends: NumberFriends,
    Friends: Friends,
    isAdmin: isAdmin,
    isConnected: isConnected,

    //image: imageURL,
  } = request.body;
  let HashedPassword = bycript.hashSync(password, 12);

  console.log("Hashed password is " + HashedPassword);
  const user = new UserDB({
    FirstName: FirstName,
    LastName: LastName,
    password: HashedPassword,
    ProfileDescription: ProfileDescription,
    email: email,
    Age: Age,
    Profession: Profession,
    Country: Country,
    NumberFriends: NumberFriends,
    //Friends: Friends,
    ProfilePictures: [],
    img: FinalPath,
    isAdmin: isAdmin,
    isConnected: isConnected,
  });
  user
    .save()
    .then((result) => {
      console.log(user._id);
      response.status(201).json({
        message: "User created successfully!",
        user: result,
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

exports.login = (request, response, next) => {
  console.log("Inside login route controller ");
  const email = request.body.email;
  const password = request.body.password;
  let loadedUser;
  UserDB.findOne({ email: email })
    .then((user) => {
      if (!user) {
        response.status(401).send("A user with this email could not be found");
      }

      loadedUser = user;
      return bycript.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong password !");
        response.status(401).send("The password is invalid !");
      }
      const {
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
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        "MyDifficultSecret",
        { expiresIn: "1h" }
      );

      response.status(200).json({
        token: token,
        email: loadedUser.email,
        FirstName: loadedUser.FirstName,
        LastName: loadedUser.LastName,
        status: "success",
      });
    })
    .catch((err) => {
      if (!err.statuscode) {
        err.statuscode = 500;
      }
      next(err);
    });
};

exports.getUserProfile = (request, response, next) => {
  console.log("Inside getUserProfile ");
  const email = request.email;
  //const password = request.body.password;
  let loadedUser;
  UserDB.findOne({ email: email })
    .then((user) => {
      if (!user) {
        response.status(401).send("A user with tis email could not be found");
      }

      loadedUser = user;

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
        posts,
        LikedPosts,
      } = loadedUser;
      const NumberOfPosts = posts.length;
      response.status(200).json({
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
        NumberOfPosts,
        posts,
        LikedPosts,
      });
    })
    .catch((err) => {
      if (!err.statuscode) {
        err.statuscode = 500;
      }

      console.log("The error is ");
      console.log(err);

      next(err);
    });
};
