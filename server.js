import express from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';


const app = express();
app.use(express.json());
app.use(express.urlencoded());

// Backend path to data
const dataRootPath = './data';

// Frontend path to data
const dataRootPathFrontend = dataRootPath.substring(1);

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
      id: uuidv4()
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

  // const directories = fs.readdirSync(dataRootPath)
  //   .filter(file => fs.statSync(path.join(dataRootPath, file)).isDirectory())
  //   .map(directory => ({
  //     directory_path: path.join(dataRootPath, directory),
  //     directory_name: directory
  //   }));
  // res.json(directories);
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


// Enable serving image files in directoryPath directory
app.use(dataRootPathFrontend, express.static(dataRootPath))
console.log(dataRootPath)

app.use(express.static('public'))
console.log(dataRootPath)


// Start Server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
