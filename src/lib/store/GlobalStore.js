import { writable } from 'svelte/store';

export const directoriesStore = writable([]);
export const currentDirectoryStore = writable("");
export const currentPairStore = writable({});



directoriesStore.subscribe(() => {
    console.log("directoriesStore changed");
});

currentDirectoryStore.subscribe(() => {
    console.log("currentDirectoryStore changed");
});


