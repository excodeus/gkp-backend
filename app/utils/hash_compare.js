const bcrypt = require("bcrypt");

const hash = async (password) => {
  const saltRounds = 12;
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
};

const compare = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

const clearToken = (token) => token.replace("Bearer ", "");

module.exports = { hash, compare, clearToken };