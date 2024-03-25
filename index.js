const connectToMongo = require("./db")
const express = require('express')
var cors = require('cors')
const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })
const mongoose = require("mongoose");
connectToMongo();


const app = express()
const port = 3000
app.use(cors())
app.use(express.json())
// Avaible Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/card',require('./routes/card'))
app.use('/api/checkout', require('./routes/checkout'));

require("./imageDetails");
const Images = mongoose.model("ImageDetails");



app.listen(port, () => {
  console.log(`Shree-Shyam-Restaurant backend  listening on port ${port}`)
})


//////////////////////////////////////////////////////////////////////////////////////////////////////

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../src/images/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/upload-image", upload.single("image"), async (req, res) => {
  console.log(req.body);
  const imageName = req.file.filename;

  try {
    await Images.create({ image: imageName });
    res.json({ status: "ok" });
  } catch (error) {
    res.json({ status: error });
  }
});

app.get("/get-image", async (req, res) => {
  try {
    Images.find({}).then((data) => {
      res.send({ status: "ok", data: data });
    });
  } catch (error) {
    res.json({ status: error });
  }
});
