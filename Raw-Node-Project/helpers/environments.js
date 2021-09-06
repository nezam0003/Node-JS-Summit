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
};
environments.production = {
  port: 5000,
  envName: "production",
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
