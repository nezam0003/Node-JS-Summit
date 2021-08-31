const fs = require("fs");

const myCurrentDirectory = __dirname;
console.log(myCurrentDirectory);

const ourReadStream = fs.createReadStream(
  `${myCurrentDirectory}/bigdata.txt`,
  "utf8"
);

ourReadStream.on("data", (data) => {
  console.log(data);
});
