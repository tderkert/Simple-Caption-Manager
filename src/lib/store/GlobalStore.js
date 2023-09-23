import { writable } from 'svelte/store';

export const directoriesStore = writable([]);
export const currentDirectoryStore = writable("");
export const currentDirectoryIndexStore = writable(0);
export const pairsStore = writable([]);
export const currentPairStore = writable({});
export const currentPairIndexStore = writable(0);

let pairsData = [];
let currentDirectory = "";

// Subscribe to stores for global function access
pairsStore.subscribe(value => {
    pairsData = value;
});
currentDirectoryStore.subscribe(value => {
    currentDirectory = value;
});

//////////////////////////////////////////////////////
/////////////// Get directories //////////////////////
//////////////////////////////////////////////////////
export const getDirectories = function() {
    console.log("Global: getDirectories() called");

    // Fetch directories json file from server at the '/directories' endpoint
		fetch('/directories')
        .then(response => response.json())
        .then(data => {
            directoriesStore.set(data);
        })
        .catch(error => console.error(error));
};



//////////////////////////////////////////////////////
/////////////// Save single pair /////////////////////
//////////////////////////////////////////////////////
export const saveCaption = function(pair) {
    console.log("Global: saveCaption() called");

    const caption_path = pair.caption_path;
    const caption_content = pair.caption_content;
    const caption_id = pair.id;

    // upate caption content of pair in pairsData with id of caption_id
    for (let i = 0; i < pairsData.length; i++) {
        let tempPair = pairsData[i];
        if (tempPair.id == caption_id) {
            pairsData[i].caption_content = caption_content;
        }
    }



    fetch('/update-caption', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            caption_path,
            caption_content
        })
    })
    .then(response => response)
    .then(data => console.log(data))
    .then(() => pairsStore.set(pairsData))
    .catch(error => console.error(error));
};

//////////////////////////////////////////////////////
// Create new directory and add to directoriesStore //
//////////////////////////////////////////////////////
export const createDirectory = function(directoryName) {
    console.log("Global: createDirectory() called", directoryName);

    fetch('/create-directory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            directory_name: directoryName
        })
    })
    // if response ok, update directoriesStore
    .then(response => {
        console.log("response", response);
        if (response.ok) {
            getDirectories();
        }
    })

};



///////////////////////////////////////////////////////////
/////////// Append to captions functionality //////////////
///////////////////////////////////////////////////////////

export const appendToCaptions = function (appendString, appendUseComma) {
    for (let i = 0; i < pairsData.length; i++) {
        let pair = pairsData[i];
        let captionContent = pair.caption_content.replaceAll("\n", ""); // Remove all newlines to check if caption is empty
        let newCaptionContent = "";

        if (captionContent == "") {
            newCaptionContent = "" + appendString;
        }else if (appendUseComma) {

            newCaptionContent = captionContent + ", " + appendString;
        } else {
            newCaptionContent = captionContent + " " + appendString;
        }
        pair.caption_content = newCaptionContent.replaceAll("\n", "");
        saveCaption(pair)
    }
}

////////////////////////////////////////////////////////
/////////// Search and replace functionality ///////////
////////////////////////////////////////////////////////

export const searchAndReplace = function(searchInput, replaceInput) {
    console.log("search and replace", searchInput, replaceInput);

    let matchesFound = 0;

    // loop though pairs data and replace text inside caption_content
    for (let i = 0; i < pairsData.length; i++) {
        let pair = pairsData[i];
        let captionContent = pair.caption_content;

        // Replace all occurences of searchInput with replaceInput
        let newCaptionContent = captionContent.replaceAll(searchInput, replaceInput);

        if(captionContent !== newCaptionContent){
            // Update content in pair
            pair.caption_content = newCaptionContent;
            saveCaption(pair);


            // Update matches found
            matchesFound++;
            console.log("matchesFound", matchesFound);
        }
    }
    pairsStore.set(pairsData);
    if(matchesFound <= 0){
        alert("No matches found")
    }// else {}

}

////////////////////////////////////////////////////////
//////////////////// Clean Captions ////////////////////
////////////////////////////////////////////////////////

export const cleanCaptions = function() {
    console.log("clean captions");

    for (const pair of pairsData) {
        const captionContent = pair.caption_content;
        const oldCaptions = captionContent.split(",")

        if (oldCaptions.length < 1) {
            continue;
        }

        const newCaptions = [];

        console.log("old captions: ", captionContent);

        for (let caption of oldCaptions) {
            caption = caption.trim()
            if (caption != "") {
                newCaptions.push(caption);
            }
        }

        pair.caption_content = `${newCaptions.join(", ")},`;

        console.log("new captions: ", pair.caption_content);

        saveCaption(pair);
    }

    pairsStore.set(pairsData);

}

//////////////////////////////////////////////
/////////////// Save files ///////////////////
//////////////////////////////////////////////

export let saveFiles = function(files, directory) {
    console.log("Global: saveFiles() called", files, directory);
    const formData = new FormData();

    //Add directory for form data
    formData.append('directory_path', directory);

    //Add files for form data
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }



    // Post
    fetch('/save-files', {
        method: 'POST',
        body: formData
        })
        .then(response => {
            if (response.ok) {
                console.log('File upload successful');

                // log response json data
                // Will be new pairs data to update the frontend data
                response.json().then(data => {
                    console.log(data);
                    pairsStore.set(data);
                });
            } else {
                console.log('File upload failed');
            }
        })


        .catch(error => {
        console.log('Error uploading file:', error);
    });


}


////////////////////////////////////////////////////////
//////////// Open current directory in OS //////////////
////////////////////////////////////////////////////////

export const openFolderInOS = function() {
    console.log("Global: openFolderInOS() called");

    // Post to endpoint '/open-folder' with current directory
    fetch('/open-folder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            directory_path: currentDirectory
        })
    })
    .then(response => {
        console.log(response);
    })

}
