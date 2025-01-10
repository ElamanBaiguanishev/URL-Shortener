const crypto = require("crypto");

function generateRandomHash(length = 6) {
  const randomHash = crypto.randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);

  return randomHash;
}

module.exports = generateRandomHash;
