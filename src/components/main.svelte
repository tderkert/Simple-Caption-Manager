<script>
    import { createEventDispatcher } from "svelte";
    import CaptionCard from "/src/components/captionCard.svelte";
    export let pairsData = [];



</script>

<!--  MAIN -->
<main id="content" class="p-4 content flex-grow h-full overflow-y-scroll">
    <div id="pairs-list" class="grid gap-x-2 gap-y-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {#each pairsData as pair, index}
            <CaptionCard {pair} {index} on:saveCaption on:openInModal/>
	    {/each}
    </div>
</main>