# Simple Caption Manager
A simple web UI to write, modify and manage captions files images. Helpful when writing captions for images inteded for training with Stable Diffusion etc.


## How to use
* Put folders with images in `/data/`. 
* If an image file has no caption file it will be created automatically. (Caption files are `.txt` files with the same name as the image.) 
* When captions are edited it updates the caption files instantly without asking to save anything (be careful)).


## Run
Run `npm run dev` in terminal, and open `http://localhost:5173/` in your browser.