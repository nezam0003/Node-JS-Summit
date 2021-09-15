const express = require("express");
const adminRouter = require("./adminRouter");
const publicRouter = require("./publicRouter");

const app = express();

app.use("/admin", adminRouter);
app.use("/", publicRouter);
app.listen(4000, () => console.log("server running on port 4000"));
