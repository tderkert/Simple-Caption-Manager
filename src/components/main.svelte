<script>
    import { createEventDispatcher } from "svelte";
    import CaptionCard from "/src/components/captionCard.svelte";
    import { pairsStore } from '/src/lib/store/GlobalStore.js';
    import FileDropZone from "/src/components/fileDropZone.svelte";
    export let pairsData = [];

    pairsStore.subscribe(value => {
        pairsData = value
    });


</script>

<!--  MAIN -->
<main id="content" class=" content flex-grow h-full overflow-y-scroll relative">
    <div id="pairs-list" class="grid gap-x-2 gap-y-4 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {#each pairsData as pair, index}
            <CaptionCard {pair} {index} on:saveCaption on:openInModal/>
	    {/each}
    </div>
    <FileDropZone/>
</main>