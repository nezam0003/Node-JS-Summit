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

// read data from file
lib.read = (dir, file, callBack) => {
  fs.readFile(`${lib.basedir + dir}/${file}.json`, "utf8", (err, data) => {
    callBack(err, data);
  });
};

// updating of existing file
lib.update = (dir, file, data, callBack) => {
  // open file
  fs.open(`${lib.basedir + dir}/${file}.json`, "r+", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // convert data to string
      const stringData = JSON.stringify(data);

      // truncate file
      fs.ftruncate(fileDescriptor, (err) => {
        if (!err) {
          // write file
          fs.writeFile(fileDescriptor, stringData, (err) => {
            if (!err) {
              // close file
              fs.close(fileDescriptor, (err) => {
                if (!err) {
                  callBack(false);
                } else {
                  callBack("error on closing file");
                }
              });
            } else {
              callBack("error on updating file");
            }
          });
        } else {
          callBack("error on truncating file");
        }
      });
    } else {
      callBack("error when updating file..");
    }
  });
};

// delete file
lib.delete = (dir, file, callBack) => {
  // unlink file
  fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
    if (!err) {
      callBack(false);
    } else {
      callBack(err);
    }
  });
};
// Export module
module.exports = lib;
