const { Router } = require("express");
const ChatDB = require("../database/Schemas/Chat");
const router = Router();

router.post("/", async (req, res) => {
  console.log("We are inside post chat route");
  console.log(req.body);
  const newChat = new ChatDB({
    members: [req.body.senderID, req.body.receiverID],
  });

  try {
    const savedConversatop = await newChat.save();
    res.status(200).json(savedConversatop);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/:userId", async (req, res) => {
  console.log("We are inside get chat route");
  try {
    const chat = await ChatDB.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/TwoChat/:FirstUserId/:SecondUserId", async (req, res) => {
  try {
    const chat = await ChatDB.findOne({
      members: { $all: [req.params.FirstUserId, req.params.SecondUserId] },
    });
    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
