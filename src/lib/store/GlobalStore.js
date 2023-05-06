import { writable } from 'svelte/store';

export const directoriesStore = writable([]);
export const currentDirectoryStore = writable("");
export const currentDirectoryIndexStore = writable(0);
export const pairsStore = writable([]);
export const currentPairStore = writable({});
export const currentPairIndexStore = writable(0);

let pairsData = [];

pairsStore.subscribe(value => {
    pairsData = value;
});

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
            


            // Update matches found
            matchesFound++;
            console.log("matchesFound", matchesFound);
        }
    }
    pairsStore.set(pairsData);
    if(matchesFound <= 0){
        alert("No matches found")
    }else{
        
    }
    
}