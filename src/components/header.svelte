<script>
    import { createEventDispatcher } from "svelte";
    import Button from "/src/components/button.svelte";
    import { currentDirectoryStore } from '/src/lib/store/GlobalStore.js';

    export let pairCount = 0;
    const dispatch = createEventDispatcher();
    let currentDirectoryString = "";

    currentDirectoryStore.subscribe(value => {
       // Use value but remove everything except the last directory
        currentDirectoryString = value.replace(/^.*[\\\/]/, '');
    });

    function handleOpenDirectorySelector(event){
        console.log("handleOpenDirectorySelector");
        dispatch("openDirectorySelector", {
            open: true
        })
    }
</script>

<div class=" col-span-2 p-4 bg-slate-800 shadow-lg flex justify-between items-center flex-grow-0 flex-shrink-0 z-20">
    <!-- Icon & Title -->
    <div class="flex items-center gap-4 ">
        <img src="icon-48.svg" alt="icon" class="text-white">
        

    </div>

    <!-- Counter -->
    <div class="flex flex-row gap-2 items-center self-stretch">
        {#if currentDirectoryString}
            <h1 class="text-white font-medium flex items-center gap-2">  
                <svg class="opacity-40" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" class="s-gXfn2HjkrZPh"></path></svg>
                {currentDirectoryString}
            </h1>

            <div class="w-[1px] self-stretch opacity-10 mx-3"></div>

            <svg class="opacity-40" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            <p><span id="counter">{pairCount}</span> <span class="opacity-50">images</span></p>
        {/if}
    </div>

    <!-- Change directory -->
    <Button on:click={handleOpenDirectorySelector}><svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg> Change directory</Button>

</div>