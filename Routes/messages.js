const { Router } = require("express");
const MessageDB = require("../database/Schemas/Messages");
const router = Router();

router.post("/", async (req, res) => {
  console.log("We are inside post message  route");
  console.log(req.body);
  const newMessage = new MessageDB(req.body);

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/:chatId", async (req, res) => {
  console.log("We are inside get message  route");
  console.log(req.params);
  try {
    const messages = await MessageDB.find({
      chatId: req.params.chatId,
    });
    res.status(200).json(messages);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
