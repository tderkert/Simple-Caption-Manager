<script>
    import Button from '/src/components/button.svelte';
    import InputText from '/src/components/inputText.svelte';
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
        <InputText bind:value={searchInput} placeholder={searchPlaceholder} id="searchInput"/>
        
        <label class="sr-only" for="replaceInput">Replace:</label>
        <InputText bind:value={replaceInput} placeholder={replacePlaceholder} id="replaceInput"/>
        
        <Button on:click={ handleSearchAndReplace }> Search and Replace</Button>
    </form>
</div>