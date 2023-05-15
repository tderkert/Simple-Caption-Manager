import express from 'express';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import ExifReader from 'exifreader';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer'

// Setup express
const app = express();
app.use(express.json());
app.use(express.urlencoded());

// Backend path to data
const dataRootPath = './data';

// Frontend path to data
const dataRootPathFrontend = dataRootPath.substring(1);


// Multer storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const directory = req.body.directory_path;
    cb(null, directory);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});


// Multer upload
const upload = multer({ storage: storage });

// Multer upload function

function uploadFiles(req, res, next) {
  let numFiles = req.files.length;
  let uploadedFiles = [];

  req.files.forEach(function (file) {
    // Do something with each file, like moving it to a custom directory
    // and pushing its new path to the `uploadedFiles` array.
    // You can also handle any errors that occur during the upload process.

    uploadedFiles.push(file.path);
    numFiles--;

    // Log upload progress
    console.log(`${numFiles+1} files left to upload.`);
    console.log(`File uploaded: ${file.path}`);

    if (numFiles === 0) {
      // All files have been uploaded, so call the next middleware function
      // or route handler, passing along any relevant data or results.

      req.uploadedFiles = uploadedFiles;
      console.log("all files uploaded")
      next();
    }
  });
}


////////////////////////////////////////
///// Create missing caption files /////
////////////////////////////////////////


function createMissingCaptionFiles(directory){
  const imageFiles = [];
  const captionFiles = [];

  fs.readdirSync(directory).forEach((file) => {
    const filePath = path.join(directory, file);

    // Check if file is an image
    if (fs.statSync(filePath).isFile() && ['.jpg', '.jpeg', '.png', '.gif'].includes(path.extname(filePath).toLowerCase())) {
      console.log(filePath)
      imageFiles.push(file);
      const captionFilePath = path.join(directory, `${path.parse(filePath).name}.txt`);
      console.log("captionFilePath:", captionFilePath)

      // Check if caption file already exists
      if (!fs.existsSync(captionFilePath)) {

          // Write empty caption to file
          fs.writeFileSync(captionFilePath, '');
          console.log(`Caption file created for ${file}.`);
      } else {
          captionFiles.push(file);
          console.log(`Caption file already exists for ${file}.`);
      }
    }
  });

  // Check if image files and caption files are equal
  if (imageFiles.length !== captionFiles.length) {
    console.log('Image files and caption files are not equal.');
    console.log('Image files:', imageFiles.length);
    console.log('Caption files:', captionFiles.length);
  }
}

// Set captions based on filename
function setCaptionsBasedOnFilename(directory){

  fs.readdirSync(directory).forEach((file) => {
    const filePath = path.join(directory, file);

    // Check if file is an image
    if (fs.statSync(filePath).isFile() && ['.txt'].includes(path.extname(filePath).toLowerCase())) {
      let tempCaption = `${path.parse(filePath).name}`

      // Remove parentheses and content
      const parenthesesAndContentRegex = /\([^()]*\)/g;
      tempCaption = tempCaption.replace(parenthesesAndContentRegex, '')

      // Write caption to file
      fs.writeFileSync(filePath, tempCaption);

      console.log("tempCaption:", tempCaption)
    }
  });


}

function createImageCaptionPairsData(directory) {
  // Get image-caption-pairs
  const imageCaptionPairs = fs.readdirSync(directory)
    .filter(file => /\.(jpe?g|png|gif)$/i.test(file))
    .map(imageFile => ({  
      image_path:   path.join(directory, imageFile),
      caption_path: path.join(directory, `${imageFile.split('.')[0]}.txt`),
      id: uuidv4(),
      // exif data of image
      exif: ExifReader.load(fs.readFileSync(path.join(directory, imageFile)))
    })); 
  
  // Get caption content
  const pairsWithCaptions = imageCaptionPairs.map(pair => {
    const captionContent = fs.readFileSync(pair.caption_path, 'utf-8');
    return { ...pair, caption_content: captionContent };
  });
  return pairsWithCaptions;
}


////////////////////////////////////////
///////////// API Endpoints ////////////
////////////////////////////////////////



// get image-caption-pairs from directory
app.get('/image-caption-pairs?:directory', (req, res) => {
  const directory = req.query.directory;

  // Create missing caption files
  createMissingCaptionFiles(directory)

  // Get image caption pairs
  const imageCaptionPairs = createImageCaptionPairsData(directory)

  // Send image caption pairs
  res.json(imageCaptionPairs);

});



// Update single caption file
app.post('/update-caption', (req, res) => {
  console.log('POST RESPONSE',req.body)
  const { caption_path, caption_content } = req.body;
  fs.writeFileSync(caption_path, caption_content);
  res.sendStatus(200);
});

// Get directories in directoryPath and each directory name
app.get('/directories', (req, res) => {
  
  // Get directories in directoryPath and each directory name and count of image files
  const directories = fs.readdirSync(dataRootPath)
    .filter(file => fs.statSync(path.join(dataRootPath, file)).isDirectory())
    .map(directory => ({
      directory_path: path.join(dataRootPath, directory),
      directory_name: directory,
      image_count: fs.readdirSync(path.join(dataRootPath, directory)).filter(file => /\.(jpe?g|png|gif)$/i.test(file)).length,
    }));
  res.json(directories);
});

// Endpoint to set captions based on filename
app.get('/add-filenames-to-captions?:directory', (req, res) => {
  const directory = req.query.directory;

  // Set captions based on filename
  setCaptionsBasedOnFilename(directory)

  // Create missing caption files
  createMissingCaptionFiles(directory)

  // Get image caption pairs
  const imageCaptionPairs = createImageCaptionPairsData(directory)

  // Send image caption pairs
  res.json(imageCaptionPairs);
});


// Endpoint to upload files to a directory
app.post('/save-files',upload.array('files'), uploadFiles, (req, res, next) => {
  // Console uploaded files
  console.log("req.uploadedFiles:", req.uploadedFiles)

  // Get directory path
  let directoryPath = req.body.directory_path
  console.log("upload path:", directoryPath)

  // Create missing caption files
  createMissingCaptionFiles(directoryPath)
  
  // Create new data
  let newPairsData = createImageCaptionPairsData(directoryPath)

  // Respons status ok
  res.status(200);

  // Respons with new data including new files
  res.json(newPairsData);
  
});


// Endpoint to create a new directory in dataRootPath
app.post('/create-directory', (req, res) => {

  // Get directory name
  let directoryName = req.body.directory_name

  // Create directory if it doesnt already exist
  if (!fs.existsSync(path.join(dataRootPath, directoryName))){
    fs.mkdirSync(path.join(dataRootPath, directoryName));
    console.log(`Directory ${directoryName} created.`);
  } else {
    console.log(`Directory ${directoryName} already exists.`);
  }
  
  // Respons status ok
  res.status(200);
  res.json({directory_name: directoryName});
});


// Express route handler for opening the current directory in Finder
app.post('/open-folder', (req, res) => {
  console.log("req.body:", req.body)

  // Get the path from the request
  const currentDir = req.body.directory_path;

  // Get relative path of current directory

  // Get absolute path of current directory
  const absolutePath = path.resolve( currentDir );
  console.log("absolutePath:", absolutePath)

  // Get escaped absolute path of current directory
  const escapedAbsolutePath = absolutePath.replace(/(\s+)/g, '\\$1');
  console.log("escapedAbsolutePath:", escapedAbsolutePath)
  
  // Use the `open` command to open the directory in Finder
  if (os.platform() === 'darwin') {
    exec(`open "${escapedAbsolutePath}"`, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Failed to open folder');
        return;
      }
  
      // Send a success response if the command executed successfully
      res.status(200).send('Folder opened');
    });
  } else if (os.platform() === 'win32') {
    let command = `explorer /select, "${escapedAbsolutePath}"`
    console.log('windows open folder', command)
    exec(command, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Failed to open folder');
        return;
      }
  
      // Send a success response if the command executed successfully
      res.status(200).send('Folder opened');
    });
  } else {
    res.status(500).send('Unsupported platform');
  }

});


// Enable serving image files in directoryPath directory
app.use(dataRootPathFrontend, express.static(dataRootPath))
console.log(dataRootPath)

app.use(express.static('public'))
console.log(dataRootPath)


// Start Server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

