<script>
    import Button from '/src/components/button.svelte';
    import { pairsStore, searchAndReplace } from '/src/lib/store/GlobalStore.js';

    let pairsData = [];
    let searchInput = "";
    let replaceInput = "";
    let searchPlaceholder = "Search...";
    let replacePlaceholder = "Replace...";

    pairsStore.subscribe(value => {
        pairsData = value;
    });

    function handleSearchAndReplace(){
        searchAndReplace(searchInput, replaceInput)
    }
</script>


<div class="p-4 flex flex-col gap-4 items-stretch">
    <!-- Search and Replace -->
    <form class="flex flex-col gap-4 items-stretch">
        <label class="sr-only" for="searchInput">Find:</label>
        <input bind:value="{searchInput}" class="px-3 py-2 rounded-lg bg-slate-900 ring-blue-500 focus:ring-2 transition placeholder-white placeholder-opacity-40" type="text" id="searchInput" placeholder={searchPlaceholder}>
        
        <label class="sr-only" for="replaceInput">Replace:</label>
        <input bind:value="{replaceInput}" class="px-3 py-2 rounded-lg bg-slate-900 ring-blue-500 focus:ring-2 transition placeholder-white placeholder-opacity-40" type="text" id="replaceInput" placeholder={replacePlaceholder}>
        
        <Button on:click={ handleSearchAndReplace }> Search and Replace</Button>
    </form>
</div>