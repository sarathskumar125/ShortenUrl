const express = require("express");
const path = require('path')
const axios = require("axios");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");


dotenv.config();
const app = express();
app.use(cors());
const port = 5000;

const mongoUrl = process.env.MONGODB_URI;

// Define the URL schema
const urlSchema = new mongoose.Schema({
  full_url: String,
  shortened_url: String,
});

// Create the URL model
const Url = mongoose.model("Url", urlSchema);

app.use(express.json());

app.post("/api/shorten", async (req, res) => {
  try {
    const urls  = req.body.url;
    console.log(urls);
    const shortenedUrls = [];

    for (const url of urls) { 
      // Make request to CleanURI API
      const response = await axios.post("https://cleanuri.com/api/v1/shorten", {
        url,
      });
      const { result_url: shortenedUrl } = response.data;

      // Save the original and shortened URLs in MongoDB using Mongoose 
      const newUrl = new Url({ full_url: url, shortened_url: shortenedUrl });
      await newUrl.save();
      console.log(`URL shortened: ${url} -> ${shortenedUrl}`);
      shortenedUrls.push(newUrl);
    }
    res.status(200).send(shortenedUrls) 

  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request." });
  }
});
 
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");

    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, '/frontend/build')))
    app.get('*',(req,res)=>{
      res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
    })

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });


