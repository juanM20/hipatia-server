// server/src/main.ts

import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import AWS from 'aws-sdk';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3001;

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
})

const s3 = new AWS.S3();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));


app.get('/api', (_req, res) => {
    res.status(200).json({ message: 'Hello from the server!' });
});

app.post("/start-upload", async (req, res) => {
    const { fileName, fileType } = req.body;
  
    const params = {
      Bucket: process.env.S3_BUCKET ?? '',
      Key: fileName,
      ContentType: fileType,
    };
  
    try {
      const upload = await s3.createMultipartUpload(params).promise();
      // console.log({ upload });
      res.send({ uploadId: upload.UploadId });
    } catch (error) {
      res.send(error);
    }
  });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});