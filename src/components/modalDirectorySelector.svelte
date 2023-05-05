<script>
    import { directoriesStore, currentDirectoryStore, currentDirectoryIndexStore } from '/src/lib/store/GlobalStore.js';
    import { fly, fade } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';
    import Modal from '/src/components/modal.svelte';
    import { afterUpdate, onMount } from 'svelte';
    import Tag from '/src/components/tag.svelte';

    export let visible = true;
    
    
    // Local variables
    let directories = [];
    let currentDirectory = "";
    let currentDirectoryIndex = 0

    // Subscribe to Directories Store
    directoriesStore.subscribe(value => {
        directories = value;
    });
    currentDirectoryStore.subscribe(value => {
        currentDirectory = value;
    });
    currentDirectoryIndexStore.subscribe(value => {
        currentDirectoryIndex = value;
    });

    

    // Transitions
    let flyProps = {
        duration: 200,
        y: 20,
        easing: cubicOut
    }
    let fadeProps = {
        duration: 200,
        easing: cubicOut
    }

    // Update selected directory
    function handleDirectoryClick(event) {
        currentDirectoryStore.set(event.target.dataset.path);
        // index is not a number, turn it into a number

        
        let indexAsNumber = Number(event.target.dataset.index);
        currentDirectoryIndexStore.set(indexAsNumber);
    }

    onMount(() => {

        // listen to key up and down it increments or decrements the currentDirectoryIndexStore
        document.addEventListener('keydown', function(event) {
            if (event.key === 'ArrowUp' && visible === true) {

                if (currentDirectoryIndex > 0) {
                    currentDirectoryIndexStore.set(currentDirectoryIndex - 1);
                    updateFocus()
                }
            }
            if (event.key === 'ArrowDown' && visible === true) {
                if (currentDirectoryIndex < directories.length - 1) {
                    currentDirectoryIndexStore.set(currentDirectoryIndex + 1);
                    updateFocus()
                }
            }
        });

        
    });

    afterUpdate(() => {
        updateFocus()

    });

    function updateFocus() {
        // selecte element based on data-index attribute
        let currentFocus = document.querySelector(`[data-index="${currentDirectoryIndex}"]`)
        if (currentFocus) {
            console.log("currentFocus", currentFocus)
            currentFocus.focus();
        }
    }

</script>

<Modal bind:visible={visible}>

    <!-- Card Element -->
    <div transition:fly={flyProps} class="flex flex-col gap-2 p-3 rounded-xl bg-slate-800 min-w-[400px]">
        <h2 role="dialog" aria-modal="true" class="px-4 py-2 pt-2 opacity-50">Choose a directory to work on:</h2>
        {#each directories as directory, index}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <button id="directory-{index+1}" on:click|preventDefault={handleDirectoryClick} data-path="{directory.directory_path}" data-index="{index}" 
                class="flex items-center gap-4 p-4 bg-slate-900  hover:bg-opacity-80 rounded-lg cursor-pointer transition
                {currentDirectory == directory.directory_path ? 'bg-opacity-100' : 'bg-opacity-40'}
                focus:ring-2 focus:ring-opacity-100 focus:ring-blue-500"
                >
                <svg class="pointer-events-none" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                <span class="pointer-events-none w-full text-left">{directory.directory_name}</span>
                <Tag label={directory.image_count} />
            </button>
        {/each}
    </div>
</Modal>

<style>
</style>