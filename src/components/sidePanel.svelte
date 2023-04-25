<script>
    import { createEventDispatcher } from "svelte";
    import Button from "/src/components/button.svelte";

    const dispatch = createEventDispatcher();

    let searchInput = "";
    let replaceInput = "";
    let searchPlaceholder = "Search...";
    let replacePlaceholder = "Replace...";

    function searchAndReplace(event){
        dispatch("searchAndReplace", {
            searchInput: searchInput,
            replaceInput: replaceInput
        });
    }
</script>

<div class="flex flex-col divide-y divide-slate-700 bg-slate-800">
    <!-- CONTAINER -->
     <div class="flex flex-col">
        <!-- HEADER -->
        <div class="p-4 pb-0">
            <h2 class="text-medium">Batch search and replace</h2>
        </div>
        <!-- CONTENT -->
        <div class="p-4 flex flex-col gap-4 items-stretch">
            <!-- Search and Replace -->
            <form on:submit={ searchAndReplace } class="flex flex-col gap-4 items-stretch">
                <label class="sr-only" for="searchInput">Find:</label>
                <input bind:value="{searchInput}" class="px-3 py-2 rounded-lg bg-slate-900 ring-blue-500 focus:ring-2 transition placeholder-white placeholder-opacity-40" type="text" id="searchInput" placeholder={searchPlaceholder}>
                
                <label class="sr-only" for="replaceInput">Replace:</label>
                <input bind:value="{replaceInput}" class="px-3 py-2 rounded-lg bg-slate-900 ring-blue-500 focus:ring-2 transition placeholder-white placeholder-opacity-40" type="text" id="replaceInput" placeholder={replacePlaceholder}>
                
                <Button on:click={ searchAndReplace }> Search and Replace</Button>
            </form>
        </div>
    </div>
    <!-- END CONTAINER -->

    <!-- CONTAINER -->
    <div class="flex flex-col">
        <!-- HEADER -->
        <div class="p-4 pb-0">
            <h2 class="text-medium">Batch change captions</h2>
        </div>
        <!-- CONTENT -->
        <div class="p-4 flex flex-col gap-4 items-stretch">
            <Button on:click={ () => alert("Are you sure") }> Use filename as caption...</Button>
            <Button on:click={ () => alert("test") }> Clear captions...</Button>
        </div>
    </div>
    <!-- END CONTAINER -->
</div>