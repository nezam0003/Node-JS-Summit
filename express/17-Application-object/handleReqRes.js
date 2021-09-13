// Dependencies

// module scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
  console.log(req.app.locals.title);
  res.send("hello world");
};

// Export module
module.exports = handler;
