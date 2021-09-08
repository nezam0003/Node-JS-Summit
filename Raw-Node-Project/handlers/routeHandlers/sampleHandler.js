// module scaffolding
const handler = {};

handler.sampleHandler = (requestProperties, callBack) => {
  callBack(200, {
    message: "this is sample handler url",
  });
};
module.exports = handler;
