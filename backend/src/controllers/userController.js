const User = require("../models/user");

exports.syncUser = async (req, res) => {
  const { uid, name, email, picture } = req.user;
  const filter = { firebaseUid: uid };
  try {
    const user = await User.findOneAndUpdate(filter, {
      $setOnInsert: { firebaseUid: uid, name, email, photoURL: picture },
    }, { upsert: true, returnDocument: "after" });
    return res.json(user);
  } catch (error) {
    if (error.code !== 11000) throw error;
    return res.json(await User.findOne(filter));
  }
};

exports.getUser = async (req, res) => {
  if (req.params.uid !== req.user.uid) return res.status(403).json({ error: "Acesso negado." });
  const user = await User.findOne({ firebaseUid: req.user.uid });
  if (!user) return res.status(404).json({ error: "User not found" });
  return res.json(user);
};
