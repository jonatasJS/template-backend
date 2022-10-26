const routes = require("express").Router();
const bcrypt = require("bcrypt");
const { Router } = require("express");

const { Users } = require("./models");

routes.get("/", (req, res) => {
  const version = require("../package.json").version;

  res.json({
    version,
  });
});

routes.get("/users", async (req, res) => {
  const users = await Users.find();

  // não é necessário enviar o password no response
  const usersWithoutPassword = users.map((user) => {
    const { password, ...userWithoutPassword } = user._doc;
    return userWithoutPassword;
  });

  res.json(usersWithoutPassword);
});

routes.post("/users", async (req, res) => {
  try {
    const userData = req.body;

    // criptografar a senha
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);

    const user = await Users.create(userData);

    // não retornar a senha do usuário no response
    res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      address: user?.address,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({
        error: "Username or email already exists",
      });
    }

    return res.status(500).json({ err, message: "Internal Server Error" });
  }
});

routes.delete("/user/:id", async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);

    await user.remove();

    return res.send({
      message: `Aviso \"${user.name}\" removido com sucesso!`,
    });
  } catch (err) {
    return res
      .status(400)
      .send({ error: err, message: "Internal Server Error" });
  }
});

routes.get("/user/:id", async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);

    return res.json(user);
  } catch (err) {
    return res
      .status(400)
      .send({ error: err, message: "Internal Server Error" });
  }
});

routes.put("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    const userDate = req.body;

    await user.save({
      validateBeforeSave: true,
    });

    return res.json(user);
  } catch (err) {
    return res
      .status(400)
      .send({ error: err, message: "Internal Server Error" });
  }
});

// auth
routes.post("/auth", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await Users.findOne({ username });

    if (!user) {
      return res.status(400).json({
        error: "Username or password is incorrect",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        error: "Username or password is incorrect",
      });
    }

    return res.json({
      message: "Login successful",
      data: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        address: user?.address,
      },
    });
  } catch (err) {
    return res.status(500).json({ err, message: "Internal Server Error" });
  }
});

module.exports = routes;
