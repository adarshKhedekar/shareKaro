const express = require("express");
const multer = require("multer");
const dotenv = require("dotenv");
const cors = require("cors");
const File = require("./File.js");
const mongoose = require("mongoose");
dotenv.config();


const url = process.env.DATABASE_URL;
const PORT = process.env.PORT || 5000

// const url = process.env.DATABASE_URL;
mongoose.connect(url).then(() => {
  console.log('connection Successfull');
}).catch((err) => {
  console.log(err);
})

const app = express();
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

app.post("/", upload.array("files", 10), async (req, res) => {
  const files = req.files;
  if (!files) {
    return res.status(400).send("No file uploaded");
  }
  // console.log(files);
  let fileUrls = [];
  await Promise.all(
    files.map(async (file) => {
      const fileData = {
        path: file.path,
        originalName: file.originalname,
      };
      let f = await File.create(fileData);
      fileUrls.push(`${req.protocol}://${req.get("host")}/uploads/${f.id}`);
    })
  );

  res.json({ urls: fileUrls });
});

app.get("/uploads/:id", async (req, res) => {
  const newFile = await File.findById(req.params.id);
  res.download(newFile.path, newFile.originalName);
});

if(process.env.NODE_ENV == "production"){
  app.use(express.static('frontend/build'));
  const path = require('path');
  app.get('*',(req,res) => {
    res.sendFile(path.resolve(__dirname,'frontend','build','index.html'));
  })
}

app.listen(PORT, (req, res) => {
  console.log(`server listening on port ${process.env.PORT}`);
});
