<script>
    import { createEventDispatcher } from "svelte";
    import Button from "/src/components/button.svelte";

    // Modules
    import ModuleSearchReplace from "/src/components/moduleSearchReplace.svelte";
    import ModuleAppendString from "/src/components/moduleAppendString.svelte";

    const dispatch = createEventDispatcher();


    function clearAllCaptions(event){
        dispatch("clearAllCaptions", {
            clearAllCaptions: true
        });
    }

    function addFilenamesToCaptions(event){
        dispatch("addFilenamesToCaptions", {
            addFilenamesToCaptions: true
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
        <ModuleSearchReplace />
    </div>
    <!-- END CONTAINER -->

    <!-- CONTAINER -->
    <div class="flex flex-col">
        <!-- HEADER -->
        <div class="p-4 pb-0">
            <h2 class="text-medium">Append to captions</h2>
        </div>
        <!-- CONTENT -->
        <ModuleAppendString />
    </div>
    <!-- END CONTAINER -->

    <!-- CONTAINER -->
    <div class="flex flex-col">
        <!-- CONTENT -->
        <div class="p-4 flex flex-col gap-4 items-stretch">
            <Button on:click={addFilenamesToCaptions}> Use filenames as captions...</Button>
        </div>
    </div>
    <!-- END CONTAINER -->

    <!-- CONTAINER -->
    <div class="flex flex-col">
        <!-- CONTENT -->
        <div class="p-4 flex flex-col gap-4 items-stretch">
            <Button on:click={clearAllCaptions}> Clear captions...</Button>
        </div>
    </div>
    <!-- END CONTAINER -->

</div>