const express = require("express");
const app = express();
const s3 = require('./config/s3');
const upload = require('./config/multer');
const path = require('path');

app.post('/upload', upload.single('file'), async (req, res) => {
    const file = req.file;
  
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype
    };
  
    try {
      await s3.upload(params).promise();
      res.status(200).send('File uploaded to S3 successfully!');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error uploading file to S3');
    }
  });

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });