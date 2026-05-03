const express = require("express");
const router = express.Router();

const { syncUser, getUser } = require("../controllers/userController");

router.post("/sync", syncUser);
router.get("/:uid", getUser);

module.exports = router;