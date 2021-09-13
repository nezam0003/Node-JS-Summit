/*
 * Title: Environments
 * description: Handle all environments related things
 * Author: Nezam
 * Date: 06-09-2021
 */

// Module scaffolding
const environments = {};

environments.staging = {
  port: 4000,
  envName: "staging",
  secreteKey: "abcdiidfijf",
  maxChecks: 5,
  twilio: {
    fromPhone: "+8801632146855",
    accountSid: "ACe44d343b40dbb172fb0d3b69b5d500c7",
    authToken: "4ef5d9ff29aabd88300154121cbb41e7",
  },
};
environments.production = {
  port: 5000,
  envName: "production",
  secreteKey: "fidhieijgjii",
  maxChecks: 5,
  twilio: {
    fromPhone: "+8801632146855",
    accountSid: "ACe44d343b40dbb172fb0d3b69b5d500c7",
    authToken: "4ef5d9ff29aabd88300154121cbb41e7",
  },
};

// determine which environment was passed
const currentEnvironment =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

// export coresponding environment object
const environmentToExport =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;

module.exports = environmentToExport;
