/**
 * Title: Notification function
 * description: all notification function to notify  users
 * author: Nezam
 * Date: 12-09-2121
 */

// Dependencies
const https = require("https");
const { twilio } = require("./environments");

// Module scaffolding
const notifications = {};

// SEND SMS TO USER USING TWILIO API
notifications.sendTwilioSMS = (phone, msg, callback) => {
  // Input validation
  const userPhone =
    typeof phone === "string" && phone.trim().length === 11
      ? phone.trim()
      : false;
  const userMSG =
    typeof msg === "string" &&
    msg.trim().length > 0 &&
    msg.trim().length <= 1600
      ? msg.trim()
      : false;

  if (userPhone && userMSG) {
    // Config the request payload
    const payload = {
      From: twilio.fromPhone,
      To: `+88${userPhone}`,
      Body: userMSG,
    };

    // Stringify payload
    const stringifyPayload = JSON.stringify(payload);

    // Config the request details object
    const requestDetails = {
      hostname: "api.twilio.com",
      method: "POST",
      path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
      auth: `${twilio.accountSid}:${twilio.authToken}`,
      headers: {
        "Content-Type": "applications/x-www-form-urlencoded",
      },
    };

    // instantiate the request object
    const req = https.request(requestDetails, (res) => {
      // get the status code of sent request
      const status = res.statusCode;

      // callback successfully if the request went through
      if (status === 200 || status === 201) {
        callback(false);
      } else {
        callback(`status was ${status}`);
      }
    });

    req.on("error", (e) => {
      callback(e);
    });

    req.write(stringifyPayload);
    req.end();
  } else {
    callback("sorry given parameter is not correct");
  }
};

// Export module
module.exports = notifications;
