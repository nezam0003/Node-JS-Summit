// module scaffolding
const handler = {};

handler.notFoundHandler = (requestProperties, callBack) => {
  callBack(404, {
    message: "your requested url was not found !",
  });
};
module.exports = handler;
