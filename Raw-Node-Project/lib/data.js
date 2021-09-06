// dependencies
const fs = require("fs");
const path = require("path");

// Module scaffolding
const lib = {};

// base directory of data folder
lib.basedir = path.join(__dirname, "/../.data/");

// write data to file
lib.create = (dir, file, data, callBack) => {
  // open file to write
  fs.open(
    `${lib.basedir + dir}/${file}.json`,
    "wx",
    (error, fileDescriptor) => {
      if (!error && fileDescriptor) {
        // convert data to string
        const stringData = JSON.stringify(data);

        // write data to file and close
        fs.writeFile(fileDescriptor, stringData, (err) => {
          if (!err) {
            fs.close(fileDescriptor, (error) => {
              if (!error) {
                callBack(false);
              } else {
                callBack("Error closing the new file");
              }
            });
          } else {
            callBack("Error to writing file");
          }
        });
      } else {
        callBack("sorry, there was a error, file may already exists");
      }
    }
  );
};
// Export module
module.exports = lib;
