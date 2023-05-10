# Simple Caption Manager
A simple web UI to write, modify and manage image caption files. Helpful when writing captions for images intended for training with Stable Diffusion etc.

![Simple Caption Manager - Preview Image](https://user-images.githubusercontent.com/6050484/237302030-895b87da-6c31-4cad-88d8-97f22e3179af.png)


## How to use
* Put folders with images in `/data/`. 
* If an image file has no caption file it will be created automatically.
* When captions are edited it updates the caption files instantly without asking to save anything (be careful).
* Click on images to view in bigger size; focus mode.

## Shortcuts
* Open directory selecter:  `Ctrl` + `O`.
  * Navigate in directory list `Up/Down`, press `Enter` to select.
* Traverse between images when in focus mode: `Cmd` + `Left/Right`.

## Features
* Drag and drop image files into the main view to add them
* Create new directory
* Search and replace
* Append to captions
* Use filenames as captions
* Clear captions

## How to get running
1. Run `npm install` to install dependencies.
2. Run `npm run dev` in terminal, and open `http://localhost:5173/` in your browser.

## Disclaimers
This project was created with a lot of help from ChatGPT and Copilot. I'm hobby developer creating a tool for myself, and hopefully other people can find it useful. Let me know if you find bugs, or want to suggest improvements and features. Only tested on MacOS for now.

## Main libraries used
* SvelteKit
* Express
* Tailwind CSS
* Multer