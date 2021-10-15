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

app.get('/', async (req, res) => {
  await res.send(fs.readFileSync(`${process.cwd()}/src/index.html`, 'utf-8'))
})

app.post('/upload', async function(req, res) {
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
  sampleFile.mv(uploadPath, async function(err) {
    if (err)
      return res.status(500).send(err);
    
    let base64 = encode(uploadPath);
    gun.get(fileId).get('extension').put({ extension: sampleFile.name.split(".")[sampleFile.name.split(".").length - 1] })
    let b = 0;
    for await(i of chunkIt(base64, 10000)) {
      gun.get(fileId).get(b).set(i);
      console.log(b);
      b++;
    }
    
    await fs.unlinkSync(uploadPath)
    
    await res.send('File uploaded! Keep the ID : ' + fileId)
  })
});

app.get('/download', async (req, res) => {
  
  let file = req.query.id
  let extension;
  gun.get(file).get('extension').on((data) => {
    extension = data.extension
  })
  
  // console.log(extension)
  
  let chunks = []

  let c = 0;
  while (c < 10001) {
    console.log(c)
    gun.get(file).get(c).map().on(async data => { chunks.push(data) })
    c++;
  }

  console.log(chunks)
  
  decode(cleanChunks(chunks), __dirname + '/tmp2/' + file + `.${extension}`)
  
  await res.download(__dirname + '/tmp2/' + file + `.${extension}`, file + `.${extension}`, function(err) {
    
    if (err) {
      console.log(err); // Check error if you want
    }
    fs.unlink(__dirname + '/tmp2/' + `${file}.${extension}`, function(){
        console.log(`${file}.${extension}`) // Callback
    });
    
  });
})