const User = require("../models/User");

// cria ou atualiza usuário (sync do login)
exports.syncUser = async (req, res) => {
  const { firebaseUid, name, email, photoURL } = req.body;

  let user = await User.findOne({ firebaseUid });

  if (!user) {
    user = await User.create({
      firebaseUid,
      name,
      email,
      photoURL,
    });
  }

  return res.json(user);
};

// buscar usuário
exports.getUser = async (req, res) => {
  const { uid } = req.params;

  const user = await User.findOne({ firebaseUid: uid });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.json(user);
};