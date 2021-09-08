/**
 * Title: Utilities
 * description: all utiliy related function
 * author: Nezam
 * date: 07-09-2021
 */

// dependencies
const crypto = require("crypto");
const environments = require("./environments");

// module Scaffloding
const utilities = {};

// parse json string to object

utilities.pasrseJSON = (jsonString) => {
  let output;
  try {
    output = JSON.parse(jsonString);
  } catch {
    output = {};
  }
  return output;
};

// conver password to hash
utilities.hash = (str) => {
  if (typeof str === "string" && str.length > 0) {
    const hash = crypto
      .createHmac("sha256", environments.secreteKey)
      .update(str)
      .digest("hex");
    return hash;
  }
  return false;
};
module.exports = utilities;
