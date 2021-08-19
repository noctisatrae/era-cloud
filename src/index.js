const express = require('express');
const fileUpload = require('express-fileupload');
const Gun = require('gun');
const fs = require('fs');
const uuid4 = require('uuid4');

const path = require('path');
const root = path.dirname(require.main.filename)

const { encode, decode } = require('../lib/base64');
const { chunkIt, cleanChunks } = require('../lib/chunk');

const gun = Gun();
const app = express();

app.use(express.json())
app.use(fileUpload());

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log('API running at http://localhost:'+PORT);
})

app.get('/', (req, res) => {
  res.status(200).send({ msg: "Welcome to the ERA Cloud playground !" })
})

app.post('/upload', function(req, res) {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(418).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.sampleFile;
  uploadPath = __dirname + '/tmp/' + sampleFile.name;

  let fileId = uuid4();

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded! Keep the ID : ' + fileId);
  })
  
  let input = encode(__dirname + '/tmp/' + 'file.jpeg');
  
  for (i of chunkIt(input, 10000)) {
    gun.get(fileId).set(i)
  }
  
  fs.unlinkSync(uploadPath);
});

app.get('/download', async (req, res) => {
  let file = req.query.id
  
  let chunks = [];
  gun.get(file).map().on(async (data) => {
    chunks.push(data);
  })
  
  await res.send(cleanChunks(chunks.join("")))
})