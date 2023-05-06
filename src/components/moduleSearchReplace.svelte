<script>
    import Button from '/src/components/button.svelte';
    import { pairsStore } from '/src/lib/store/GlobalStore.js';

    let pairsData = [];
    let searchInput = "";
    let replaceInput = "";
    let searchPlaceholder = "Search...";
    let replacePlaceholder = "Replace...";

    pairsStore.subscribe(value => {
        pairsData = value;
    });

    ////////////////////////////////////////////////////////	
	/////////// Search and replace functionality ///////////
	////////////////////////////////////////////////////////

	function searchAndReplace() {
		console.log("search and replace", searchInput, replaceInput);

		let matchesFound = 0;

		// loop though pairs data and replace text inside caption_content
		for (let i = 0; i < pairsData.length; i++) {
			let pair = pairsData[i];
			let captionContent = pair.caption_content;
            
			// Replace all occurences of searchInput with replaceInput
			let newCaptionContent = captionContent.replaceAll(searchInput, replaceInput);

			if(captionContent !== newCaptionContent){
				// Update content in pair
				pair.caption_content = newCaptionContent;


				// Update matches found
				matchesFound++;
				console.log("matchesFound", matchesFound);
			}
		}
        pairsStore.set(pairsData);
		if(matchesFound <= 0){
			alert("No matches found")
		}else{
            
        }
		
	}
</script>


<div class="p-4 flex flex-col gap-4 items-stretch">
    <!-- Search and Replace -->
    <form class="flex flex-col gap-4 items-stretch">
        <label class="sr-only" for="searchInput">Find:</label>
        <input bind:value="{searchInput}" class="px-3 py-2 rounded-lg bg-slate-900 ring-blue-500 focus:ring-2 transition placeholder-white placeholder-opacity-40" type="text" id="searchInput" placeholder={searchPlaceholder}>
        
        <label class="sr-only" for="replaceInput">Replace:</label>
        <input bind:value="{replaceInput}" class="px-3 py-2 rounded-lg bg-slate-900 ring-blue-500 focus:ring-2 transition placeholder-white placeholder-opacity-40" type="text" id="replaceInput" placeholder={replacePlaceholder}>
        
        <Button on:click={ searchAndReplace }> Search and Replace</Button>
    </form>
</div>