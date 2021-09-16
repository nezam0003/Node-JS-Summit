const express = require("express");
const multer = require("multer");
const path = require("path");

// file upload folder
const UPLOADS_FOLDER = "./uploads/";

// make storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_FOLDER);
  },
  filename: (req, file, cb) => {
    const fileExtention = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExtention, "")
        .toLowerCase()
        .split(" ")
        .join("-") +
      "-" +
      Date.now();

    cb(null, fileName + fileExtention);
  },
});

// prepare the final multer object
var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "avater") {
      if (
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png"
      ) {
        cb(null, true);
      } else {
        cb(new Error("only .jpg .jpeg or .png file allowed"));
      }
    } else if (file.fieldname === "doc") {
      if (file.mimetype === "application/pdf") {
        cb(null, true);
      } else {
        cb(new Error("only .pdf file allowed"));
      }
    } else {
      cb(new Error("sorry someting went wrong with file upload"));
    }
  },
});

const app = express();

/** single file */
// app.post("/", upload.single("avater"), (req, res) => {
//   res.send("hello world");
// });

/*** multiple file */
app.post(
  "/",
  upload.fields([
    { name: "avater", maxCount: 1 },
    { name: "doc", maxCount: 1 },
  ]),
  (req, res) => {
    console.log(req.files);
    res.send("hello world");
  }
);

// error handling
app.use((err, req, res, next) => {
  if (err) {
    if (err instanceof multer.MulterError) {
      res.status(500).send("there was an upload error");
    } else {
      res.status(500).send(err.message);
    }
  } else {
    res.send("success");
  }
});

// app.post("/", upload.array("avater", 3), (req, res) => {
//   res.send("hello world");
// });

// app.post(
//   "/",
//   upload.fields([
//     { name: "avater", maxCount: 1 },
//     { name: "gallery", maxCount: 3 },
//   ]),
//   (req, res) => {
//     res.send("hello world");
//   }
// );

app.listen(4000, () => console.log("app listing on port 4000"));
