const express = require("express");
const app = express();
const user = require("./routes/userRoutes");
const connectDatabase = require("./config/db");
var cors = require("cors");
app.use(cors({ origin: true, credentials: true }));
const multer = require("multer");
const uploads = multer({
  dest: "uploads/",
});
app.use(express.json());

app.use("/api/v1", user);
require("dotenv").config({ path: "./config/.env" });

app.use(express.urlencoded({ extended: true }));
app.post("/api/photos", uploads.single("files"), (req, res) => {
  res.send(req.file);
  return res.send("Upload Successfully!");
});
const { OpenAI } = require("openai");

const openai = new OpenAI({
    apiKey: "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"
});

app.post('/chatGPT', async (req, res) => {
    console.log("Hello")
    const { prompt } = req.body;
    const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
    });
    return res.send(completion.choices[0].message.content)
    // console.log(completion.choices[0].message.content);
})

connectDatabase();

const { spawn } = require("child_process");
const Image = require("./Models/imageModel")

const pythonScriptPath = "./hello.py";
require("dotenv").config({ path: "./config/.env" });

app.use(express.json());
var cors = require("cors");
app.use(cors({ origin: true, credentials: true }));

// connectDatabase();

app.use(express.urlencoded({ extended: true }));
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 30 * 1000000,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error("Invalid file type");
      error.code = "INVALID_FILE_TYPE";
      return cb(error, false);
    }
    
    cb(null, true);
  },
});
app.get("/get-image/:id", async(req, res)=>{
  const {id} = req.params
  const image = await Image.findById(id)
  if(!image){
    return res.status(400).send({message: "image not found!!"})
  }
  return res.status(200).send({message: "image fetched!!",image});
})
app.post("/api/photos", upload.single("files"), (req, res) => {
  const pythonScriptArgs = [req.file.destination, req.file.filename];
  console.log("upload success!!");
  try {
    const pythonProcess = spawn("python", [
      pythonScriptPath,
      ...pythonScriptArgs,
    ]);
    let response = "";
    pythonProcess.stdout.on("data", (data) => {
      console.log(`Python script output: ${data}`);
      response += data;
    });
    
    pythonProcess.stderr.on("data", (data) => {
      console.error(`Error in Python script: ${data}`);
      return;
    });
    pythonProcess.on("close", async(code) => {
      if (code === 0) {
        const dbData = await Image.create({image:response})
        return res.status(200).send({ message: "Image inserted!!",dbData });
      } else {
        console.error(`Python script exited with code ${code}`);
        // return res.status(500).json({ error: "Internal server error" });
      }
    });
    
  } catch (error) {
    console.log(error);
  }
});
app.get("/", (req, res) =>{
  res.send("Server Deployed!!")
})

app.listen(process.env.PORT, () => {
  console.log(`Server Listening on ${process.env.PORT}`);
});
