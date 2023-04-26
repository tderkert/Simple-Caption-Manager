<script>
    import { directoriesStore, currentDirectoryStore } from '/src/lib/store/GlobalStore.js';
    import { fly, fade } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';
    import Modal from '/src/components/modal.svelte';
    import { onMount } from 'svelte';
    export let visible = true;
    
    
    // Local variables
    let directories = [];
    let currentDirectory = "";

    // Subscribe to Directories Store
    directoriesStore.subscribe(value => {
        directories = value;
    });
    currentDirectoryStore.subscribe(value => {
        currentDirectory = value;
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
    }

    onMount(() => {
        


        // listen to key press 1-9 and set the currentDirectoryStore to the corresponding directory
        document.addEventListener('keydown', function(event) {
            if (event.key === '1' && visible === true) {
                document.getElementById("directory-1").focus();
                setTimeout(() => {
                    currentDirectoryStore.set(directories[0].directory_path);
                }, 400);
            }
            if (event.key === '2' && visible === true) {
                document.getElementById("directory-2").focus();
                setTimeout(() => {
                    currentDirectoryStore.set(directories[1].directory_path);
                }, 300);
            }
            if (event.key === '3' && visible === true) {
                document.getElementById("directory-3").focus();
                setTimeout(() => {
                    currentDirectoryStore.set(directories[2].directory_path);
                }, 400);
            }
            if (event.key === '4' && visible === true) {
                document.getElementById("directory-4").focus();
                setTimeout(() => {
                    currentDirectoryStore.set(directories[3].directory_path);
                }, 400);
            }
            if (event.key === '5' && visible === true) {
                document.getElementById("directory-5").focus();
                setTimeout(() => {
                    currentDirectoryStore.set(directories[4].directory_path);
                }, 400);
            }
            if (event.key === '6' && visible === true) {
                document.getElementById("directory-6").focus();
                setTimeout(() => {
                    currentDirectoryStore.set(directories[5].directory_path);
                }, 400);
            }
            if (event.key === '7' && visible === true) {
                document.getElementById("directory-7").focus();
                setTimeout(() => {
                    currentDirectoryStore.set(directories[6].directory_path);
                }, 400);
            }
            if (event.key === '8' && visible === true) {
                document.getElementById("directory-1").focus();
                setTimeout(() => {
                    currentDirectoryStore.set(directories[7].directory_path);
                }, 400);
            }
            if (event.key === '9' && visible === true) {
                document.getElementById("directory-8").focus();
                setTimeout(() => {
                    currentDirectoryStore.set(directories[8].directory_path);
                }, 400);
            }
        });
    });

</script>

<Modal bind:visible={visible}>

    <!-- Card Element -->
    <div transition:fly={flyProps} class="flex flex-col gap-2 p-3 pr-5 rounded-xl bg-slate-800 min-w-[400px]">
        <h2 role="dialog" aria-modal="true" class="px-4 py-2 pt-2 opacity-50">Choose a directory to work on:</h2>
        {#each directories as directory, index}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <a href="#" id="directory-{index+1}" on:click|preventDefault={handleDirectoryClick} data-path="{directory.directory_path}" 
                class=" flex gap-4 p-4 pr-6 bg-slate-900  hover:bg-opacity-80 rounded-lg cursor-pointer transition
                {currentDirectory == directory.directory_path ? 'bg-opacity-100' : 'bg-opacity-40'}
                focus:ring-2 focus:ring-opacity-100 focus:ring-blue-500"
                >
                <svg class="pointer-events-none" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                <span class="pointer-events-none w-full">{directory.directory_name}</span>
                <span class="pointer-events-none opacity-40">{index+1}</span>
            </a>
        {/each}
    </div>
</Modal>

<style>
</style>