/**
 * Title: token Handler
 * description: token Handler function
 * author: Nezam
 * date: 07-09-2021
 */

// dependencies
const data = require("../../lib/data");
const { hash } = require("../../helpers/utilities");
const { pasrseJSON } = require("../../helpers/utilities");

const { createRandomString } = require("../../helpers/utilities");

// const { pasrseJSON } = require("../../helpers/utilities");

// module Scaffloding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._token = {};

handler._token.post = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  if (phone && password) {
    data.read("users", phone, (err1, userData) => {
      const hashedPassword = hash(password);
      if (hashedPassword === pasrseJSON(userData).password) {
        const tokenId = createRandomString(20);
        const expires = Date.now() + 60 * 60 * 1000;
        const tokenObject = {
          phone,
          id: tokenId,
          expires,
        };

        // store token to database
        data.create("tokens", tokenId, tokenObject, (err2) => {
          if (!err2) {
            callback(200, tokenObject);
          } else {
            callback(500, {
              error: "sorry can not create token",
            });
          }
        });
      } else {
        callback(400, {
          error: "sorry password is not valied",
        });
      }
    });
  } else {
    callback(400, {
      error: "sorry you have a problem with your request",
    });
  }
};

// get handler
handler._token.get = (requestProperties, callBack) => {};

// put handler
handler._token.put = (requestProperties, callBack) => {};

// delete handler
handler._token.delete = (requestProperties, callBack) => {};

// export handler
module.exports = handler;
