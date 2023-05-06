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



