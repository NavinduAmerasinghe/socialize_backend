const bcrypt = require("bcryptjs");

const Users = [
  {
    User: 1,
    username: "Ozil",
    password: bcrypt.hashSync("123456", 10),

    email: "ozil@yahoo.ca",

    isAdmin: false,
  },

  {
    User: 2,
    username: "Maamar",
    password: bcrypt.hashSync("123456", 10),

    email: "Maamar@yahoo.ca",

    isAdmin: true,
  },
];

module.exports = Users;
