const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    // username must be unique
    unique: true,
  },
  email: {
    type: String,
    required: true,
    // email must be unique
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  address: {
    uf: {
      type: String,
    },
    city: {
      type: String,
    },
    neighborhood: {
      type: String,
    },
    cep: {
      type: String,
    },
    street: {
      type: String,
    },
    number: {
      type: String,
    },
    country: {
      type: String,
    }
  },
});

module.exports = mongoose.model("users", UserSchema);
