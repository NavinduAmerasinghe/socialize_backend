const { Router } = require("express");
const router = Router();

//Router File
const array = [
  { name: "Zidane", age: 27, nationality: "Frensh " },
  { name: "Ronaldinho", age: 25, nationality: "Brazi " },
];

router.get("/", (request, response) => {
  response.json(array);
});

//Route Parameters
router.get("/:name", (request, response) => {
  const { name } = request.params;

  const FoundName = array.find((g) => g.name === name);
  response.send(FoundName.name);
});

router.post("/", (request, response) => {
  console.log(request.body);
  array.push(request.body);
  response.send(201);
});

module.exports = router;
