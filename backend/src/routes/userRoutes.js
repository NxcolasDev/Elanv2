const express = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const { syncUser, getUser } = require("../controllers/userController");
const router = express.Router();

router.use(authenticate());
router.post("/sync", syncUser);
router.get("/:uid", getUser);

module.exports = router;
