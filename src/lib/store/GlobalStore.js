import { writable } from 'svelte/store';

export const directoriesStore = writable([]);
export const currentDirectoryStore = writable("");
export const currentDirectoryIndexStore = writable(0);
export const pairsStore = writable([]);
export const currentPairStore = writable({});
export const currentPairIndexStore = writable(0);



directoriesStore.subscribe(() => {
    console.log("directoriesStore changed");
});

currentDirectoryStore.subscribe(() => {
    console.log("currentDirectoryStore changed");
});

currentDirectoryIndexStore.subscribe(() => {
    console.log("currentDirectoryIndexStore changed");
});


