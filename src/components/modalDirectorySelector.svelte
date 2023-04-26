<script>
    import { directoriesStore, currentDirectoryStore } from '/src/lib/store/GlobalStore.js';
    import { fly, fade } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';
    import Modal from '/src/components/modal.svelte';
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

</script>

<Modal bind:visible={visible}>

    <!-- Card Element -->
    <div transition:fly={flyProps} class="flex flex-col gap-2 p-3 pr-5 rounded-xl bg-slate-800 min-w-[400px]">
        <h2 role="dialog" aria-modal="true" class="px-4 py-2 pt-2 opacity-50">Choose a directory to work on:</h2>
        {#each directories as directory}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div on:click={handleDirectoryClick} data-path="{directory.directory_path}" 
                class=" flex gap-4 p-4 pr-6 bg-slate-900  hover:bg-opacity-80 rounded-lg cursor-pointer transition
                {currentDirectory == directory.directory_path ? 'bg-opacity-100' : 'bg-opacity-40'}"
                >
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                {directory.directory_name}
                <svg class="pointer-events-none" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                <span class="pointer-events-none w-full">{directory.directory_name}</span>
                <span class="pointer-events-none opacity-40">{index+1}</span>
            </div>
        {/each}
    </div>
</Modal>