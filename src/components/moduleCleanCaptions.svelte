<script>
    import Button from '/src/components/button.svelte';
    import { pairsStore, cleanCaptions } from '/src/lib/store/GlobalStore.js';

    let pairsData = [];
    let cleanPlaceholder = "Clean Captions";

    pairsStore.subscribe(value => {
        pairsData = value;
    });

    function handleCleanCaptions(){
        cleanCaptions()
    }
</script>


<div class="p-4 flex flex-col gap-4 items-stretch">
    <!-- Clean Captions -->
    <form class="flex flex-col gap-4 items-stretch">
        <Button on:click={ handleCleanCaptions }> Clean Captions</Button>
    </form>
</div>
