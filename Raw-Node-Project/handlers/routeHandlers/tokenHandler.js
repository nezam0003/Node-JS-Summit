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

// Token Post handler
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
        const expires = Date.now() + 24 * 60 * 60 * 1000;
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

// token get handler
handler._token.get = (requestProperties, callback) => {
  // check the id if valid
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

  if (id) {
    // lookup for token
    data.read("tokens", id, (err, tokenData) => {
      const token = { ...pasrseJSON(tokenData) };
      if (!err && token) {
        callback(200, token);
      } else {
        callback(404, {
          error: "sorry token not found",
        });
      }
    });
  } else {
    callback(404, {
      error: "sorry you have a problem with your request",
    });
  }
};

// token put handler
handler._token.put = (requestProperties, callback) => {
  const id =
    typeof requestProperties.body.id === "string" &&
    requestProperties.body.id.trim().length === 20
      ? requestProperties.body.id
      : false;

  const extend =
    typeof requestProperties.body.extend === "boolean" &&
    requestProperties.body.extend === true
      ? true
      : false;

  if (id && extend) {
    // check if token is valid
    data.read("tokens", id, (err1, tokenData) => {
      let tokenObject = pasrseJSON(tokenData);
      if (tokenObject.expires > Date.now()) {
        tokenObject.expires = Date.now() + 24 * 60 * 60 * 1000;

        // store the update data
        data.update("tokens", id, tokenObject, (err2) => {
          if (!err2) {
            callback(200, {
              success: "token updated successfully",
            });
          } else {
            callback(500, {
              error: "sorry can not update token",
            });
          }
        });
      } else {
        callback(400, {
          error: "sorry token expired",
        });
      }
    });
  } else {
    callback(400, {
      error: "there was a problem with your request",
    });
  }
};

// delete handler
handler._token.delete = (requestProperties, callback) => {
  // check the token if valid
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

  if (id) {
    // lookup user
    data.read("tokens", id, (err, deleteToken) => {
      if (!err && deleteToken) {
        data.delete("tokens", id, (err) => {
          if (!err) {
            callback(200, {
              success: "token removed",
            });
          } else {
            callback(500, {
              error: "cannot removed token",
            });
          }
        });
      } else {
        callback(500, {
          error: "there was a server side error",
        });
      }
    });
  } else {
    callback(400, {
      error: "there was a problem in your request",
    });
  }
};

// verify token function
handler._token.verify = (id, phone, callback) => {
  data.read("tokens", id, (err, tokenData) => {
    if (!err && tokenData) {
      if (
        pasrseJSON(tokenData).phone === phone &&
        pasrseJSON(tokenData).expires > Date.now()
      ) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

// export handler
module.exports = handler;
