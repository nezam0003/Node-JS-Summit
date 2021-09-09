/**
 * Title: User Handler
 * description: user Handler function
 * author: Nezam
 * date: 06-09-2021
 */

// dependencies
const data = require("../../lib/data");
const { hash } = require("../../helpers/utilities");
const { pasrseJSON } = require("../../helpers/utilities");

// module Scaffloding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._users[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._users = {};

handler._users.post = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

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

  const tosAgreement =
    typeof requestProperties.body.tosAgreement === "boolean" &&
    requestProperties.body.tosAgreement
      ? requestProperties.body.tosAgreement
      : false;

  if (firstName && lastName && phone && password && tosAgreement) {
    // make sure that the user doesn't already exists
    data.read("users", phone, (err1) => {
      if (err1) {
        const userObject = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgreement,
        };
        // store the user to db
        data.create("users", phone, userObject, (err2) => {
          if (!err2) {
            callback(200, {
              message: "User was created successfully!",
            });
          } else {
            callback(500, { error: "Could not create user!" });
          }
        });
      } else {
        callback(500, {
          error: "There was a problem in server side!",
        });
      }
    });
  } else {
    callback(400, {
      error: "You have a problem in your request",
    });
  }
};

// get handler
handler._users.get = (requestProperties, callback) => {
  // check the phone number if valid
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;

  if (phone) {
    // lookup for user
    data.read("users", phone, (err, user) => {
      const newUser = { ...pasrseJSON(user) };
      if (!err && user) {
        delete newUser.password;
        callback(200, newUser);
      } else {
        callback(404, {
          error: "sorry user not exists",
        });
      }
    });
  } else {
    callback(404, {
      error: "sorry requested user was not found",
    });
  }
};

// put handler
handler._users.put = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

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

  if (phone) {
    if (firstName || lastName || password) {
      // lookup the user
      data.read("users", phone, (err, udata) => {
        const userData = { ...pasrseJSON(udata) };
        if (!err && userData) {
          if (firstName) {
            userData.firstName = firstName;
          }
          if (lastName) {
            userData.lastName = lastName;
          }
          if (password) {
            userData.password = hash(password);
          }

          // update to db
          data.update("users", phone, userData, (err) => {
            if (!err) {
              callback(200, {
                success: "data updated successfully",
              });
            } else {
              callback(500, {
                error: "there was an error while updating database",
              });
            }
          });
        } else {
          callback(400, {
            error: "you have a problem with your request",
          });
        }
      });
    } else {
      callback(400, {
        error: "you have a problem with your request",
      });
    }
  } else {
    callback(400, {
      error: "not a valid user. please try again",
    });
  }
};

// delete handler
handler._users.delete = (requestProperties, callback) => {
  // check the phone number if valid
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;

  if (phone) {
    // lookup user
    data.read("users", phone, (err, deleteItem) => {
      if (!err && deleteItem) {
        data.delete("users", phone, (err) => {
          if (!err) {
            callback(200, {
              success: "user removed",
            });
          } else {
            callback(500, {
              error: "cannot removed user",
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

// export handler
module.exports = handler;
