/**
 * Title: check Handler
 * description: check Handler function
 * author: Nezam
 * date: 11-09-2021
 */

// dependencies
const data = require("../../lib/data");
const { pasrseJSON, createRandomString } = require("../../helpers/utilities");
const { maxChecks } = require("../../helpers/environments");
const tokenHandler = require("./tokenHandler");

// module Scaffloding
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._check[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._check = {};

// check post handler
handler._check.post = (requestProperties, callback) => {
  // validate inputs
  const protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;

  const url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url
      : false;

  const method =
    typeof requestProperties.body.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(requestProperties.body.method) > -1
      ? requestProperties.body.method
      : false;

  const successCodes =
    typeof requestProperties.body.successCodes === "object" &&
    requestProperties.body.successCodes instanceof Array
      ? requestProperties.body.successCodes
      : false;

  const timeOutSeconds =
    typeof requestProperties.body.timeOutSeconds === "number" &&
    requestProperties.body.timeOutSeconds % 1 === 0 &&
    requestProperties.body.timeOutSeconds >= 1 &&
    requestProperties.body.timeOutSeconds <= 5
      ? requestProperties.body.timeOutSeconds
      : false;

  if (protocol && url && method && successCodes && timeOutSeconds) {
    let token =
      typeof requestProperties.headersObject.token === "string"
        ? requestProperties.headersObject.token
        : false;

    // lookup the user phone number by reading the token
    data.read("tokens", token, (err1, tokenData) => {
      if (!err1 && tokenData) {
        let userPhoneNumber = pasrseJSON(tokenData).phone;

        // lookup the user data
        data.read("users", userPhoneNumber, (err2, userData) => {
          if (!err2 && userData) {
            tokenHandler._token.verify(
              token,
              userPhoneNumber,
              (tokenIsValid) => {
                if (tokenIsValid) {
                  let userObject = pasrseJSON(userData);
                  let userChecks =
                    typeof userObject.checks === "object" &&
                    userObject.checks instanceof Array
                      ? userObject.checks
                      : [];

                  if (userChecks.length < maxChecks) {
                    let checkId = createRandomString(20);
                    let checkObject = {
                      id: checkId,
                      userPhoneNumber,
                      protocol,
                      url,
                      method,
                      successCodes,
                      timeOutSeconds,
                    };

                    // save to checks database
                    data.create("checks", checkId, checkObject, (err3) => {
                      if (!err3) {
                        // add check id to users object
                        userObject.checks = userChecks;
                        userObject.checks.push(checkId);

                        // save the new user data
                        data.update(
                          "users",
                          userPhoneNumber,
                          userObject,
                          (err4) => {
                            if (!err4) {
                              // return the data about the new check
                              callback(200, userObject);
                            } else {
                              callback(500, {
                                error: "sorry could not update users data.",
                              });
                            }
                          }
                        );
                      } else {
                        callback(500, {
                          error: "sorry there was a server side error.",
                        });
                      }
                    });
                  } else {
                    callback(401, {
                      error: "sorry user has reached maximum checking limits.",
                    });
                  }
                } else {
                  callback(403, {
                    error: "sorry authentication faluir",
                  });
                }
              }
            );
          } else {
            callback(403, {
              error: "sorry can not get user data",
            });
          }
        });
      } else {
        callback(403, {
          error: "sorry authentication problem",
        });
      }
    });
  } else {
    callback(400, {
      error: "sorry you have a problem with your request",
    });
  }
};

// check get handler
handler._check.get = (requestProperties, callback) => {
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

  if (id) {
    // lookup the check
    data.read("checks", id, (err1, checkData) => {
      if (!err1 && checkData) {
        let token =
          typeof requestProperties.headersObject.token === "string"
            ? requestProperties.headersObject.token
            : false;

        tokenHandler._token.verify(
          token,
          pasrseJSON(checkData).userPhoneNumber,
          (tokenIsValid) => {
            if (tokenIsValid) {
              callback(200, pasrseJSON(checkData));
            } else {
              callback(403, {
                error: "authentication error",
              });
            }
          }
        );
      } else {
        callback(500, {
          error: "sorry you have a problem",
        });
      }
    });
  } else {
    callback(400, {
      error: "sorry you have a problem with your request",
    });
  }
};

// check put handler
handler._check.put = (requestProperties, callback) => {
  const id =
    typeof requestProperties.body.id === "string" &&
    requestProperties.body.id.trim().length === 20
      ? requestProperties.body.id
      : false;

  // validate inputs
  const protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;

  const url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url
      : false;

  const method =
    typeof requestProperties.body.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(requestProperties.body.method) > -1
      ? requestProperties.body.method
      : false;

  const successCodes =
    typeof requestProperties.body.successCodes === "object" &&
    requestProperties.body.successCodes instanceof Array
      ? requestProperties.body.successCodes
      : false;

  const timeOutSeconds =
    typeof requestProperties.body.timeOutSeconds === "number" &&
    requestProperties.body.timeOutSeconds % 1 === 0 &&
    requestProperties.body.timeOutSeconds >= 1 &&
    requestProperties.body.timeOutSeconds <= 5
      ? requestProperties.body.timeOutSeconds
      : false;

  if (id) {
    if (protocol || url || method || successCodes || timeOutSeconds) {
      data.read("checks", id, (err1, checkData) => {
        if (!err1 && checkData) {
          let checkObject = pasrseJSON(checkData);

          let token =
            typeof requestProperties.headersObject.token === "string"
              ? requestProperties.headersObject.token
              : false;

          // Verify token
          tokenHandler._token.verify(
            token,
            checkObject.userPhoneNumber,
            (tokenIsValid) => {
              if (tokenIsValid) {
                if (protocol) {
                  checkObject.protocol = protocol;
                }
                if (url) {
                  checkObject.url = url;
                }
                if (method) {
                  checkObject.method = method;
                }
                if (successCodes) {
                  checkObject.successCodes = successCodes;
                }
                if (timeOutSeconds) {
                  checkObject.timeOutSeconds = timeOutSeconds;
                }

                // update the checkObject to checks database
                data.update("checks", id, checkObject, (err2) => {
                  if (!err2) {
                    callback(200);
                  } else {
                    callback(500, {
                      error: "sorry can not update database",
                    });
                  }
                });
              } else {
                callback(403, {
                  error: "authentication error",
                });
              }
            }
          );
        } else {
          callback(500, {
            error: "there was a problem in server side",
          });
        }
      });
    } else {
      callback(400, {
        error: "you must provid at least one field to update",
      });
    }
  } else {
    callback(400, {
      error: "there was a problem with your request",
    });
  }
};

// check delete handler
handler._check.delete = (requestProperties, callback) => {
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

  if (id) {
    // lookup the check
    data.read("checks", id, (err1, checkData) => {
      if (!err1 && checkData) {
        let token =
          typeof requestProperties.headersObject.token === "string"
            ? requestProperties.headersObject.token
            : false;

        tokenHandler._token.verify(
          token,
          pasrseJSON(checkData).userPhoneNumber,
          (tokenIsValid) => {
            if (tokenIsValid) {
              data.delete("checks", id, (err2) => {
                if (!err2) {
                  data.read(
                    "users",
                    pasrseJSON(checkData).userPhoneNumber,
                    (err3, userData) => {
                      let userObject = pasrseJSON(userData);
                      if (!err3 && userData) {
                        let userChecks =
                          typeof userObject.checks === "object" &&
                          userObject.checks instanceof Array
                            ? userObject.checks
                            : [];

                        // remove the deleted check id from user list of check
                        let checkPosition = userChecks.indexOf(id);

                        if (checkPosition > -1) {
                          userChecks.splice(checkPosition, 1);
                          // resave the user data
                          userObject.checks = userChecks;
                          data.update(
                            "users",
                            userObject.phone,
                            userObject,
                            (err4) => {
                              if (!err4) {
                                callback(200);
                              } else {
                                callback(500, {
                                  error: "can not update user",
                                });
                              }
                            }
                          );
                        } else {
                          callback(500, {
                            error: "can not find check position",
                          });
                        }
                      } else {
                        callback(500, {
                          error: "sorry can not read users",
                        });
                      }
                    }
                  );
                } else {
                  callback(500, {
                    error: "sorry can not delete",
                  });
                }
              });
            } else {
              callback(403, {
                error: "authentication error",
              });
            }
          }
        );
      } else {
        callback(500, {
          error: "sorry you have a problem",
        });
      }
    });
  } else {
    callback(400, {
      error: "sorry you have a problem with your request",
    });
  }
};

// export handler
module.exports = handler;
