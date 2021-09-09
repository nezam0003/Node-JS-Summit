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

// convert password to hash
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

utilities.createRandomString = (stringLength) => {
  let length = stringLength;
  length =
    typeof stringLength === "number" && stringLength > 0 ? stringLength : false;

  if (length) {
    let possibleCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let output = "";
    for (let i = 1; i <= length; i += 1) {
      let randomCharacter = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      );
      output += randomCharacter;
    }
    return output;
  } else {
    return false;
  }
};

module.exports = utilities;
