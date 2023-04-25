<script>
	// Svelte
    import { onMount } from 'svelte';
	// Store
	import { directoriesStore, currentDirectoryStore, currentPairStore } from '/src/lib/store/GlobalStore.js';
	// Components
	import Header from "/src/components/header.svelte";
	import Main from "/src/components/main.svelte";
    import SidePanel from '/src/components/sidePanel.svelte';
    import ModalPathSelector from '/src/components/modalPathSelector.svelte';
	import Modal from '/src/components/modal.svelte';
	import Button from '/src/components/button.svelte';
    import CaptionCard from '../components/captionCard.svelte';

	// Clear console
	console.clear()

	// State variables
	let directories = []
	let pairsData = []
	let currentDirectory = ""
	let currentPair = {}
	$: pairCount = pairsData.length
	let pathSelectorOpen = false;
	let detailedViewOpen = false;

	// Subscribe to global state store
	directoriesStore.subscribe(value => {
		directories = value;
	});
	currentDirectoryStore.subscribe(value => {
		currentDirectory = value;
		if (currentDirectory != "") {
			fetchPairsData(currentDirectory);
			closePathSelector();
		}
	});

	currentPairStore.subscribe(value => {
		console.log("currentPairStore", value);
	});



	onMount(async () => {
		// Fetch directories json file from server at the '/directories' endpoint
		fetch('/directories')
			.then(response => response.json())
			.then(data => {
				directoriesStore.set(data);
				console.log(directories);
				openPathSelector()
			})

	});

	///////////////////////////////////////////////
	//// Fetch data and render from endpoint //////
	///////////////////////////////////////////////
	function fetchPairsData(directory) {
		console.log("fetchPairsData", directory);

		// Fetch pairs json file from server at the '/pairs' endpoint
		fetch('/image-caption-pairs?directory=' + directory)
			.then(response => response.json())
			.then(data => {
				pairsData = data;
				console.log(pairsData);
			})
	}

	///////////////////////////////////////////////////////

	function openPathSelector() {
		console.log("openPathSelector");
		pathSelectorOpen = true;
	}

	function closePathSelector() {
		console.log("closePathSelector");
		pathSelectorOpen = false;
	}

	////////////////////////////////////////////////////////	
	/////////// Search and replace functionality ///////////
	////////////////////////////////////////////////////////

	function searchAndReplace(searchInput, replaceInput) {
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

				// Save caption to database
				saveCaption(pair)

				// Update matches found
				matchesFound++;
			}
		}

		if(matchesFound > 0){
			// Update for reactivity
			pairsData = pairsData
		}else{
			alert("No matches found")
		}
		
	}



	////////////////////////////////////////////////////////
	/////////////// Save functionality /////////////////////
	////////////////////////////////////////////////////////
	function saveCaption(pair) {
        
        const caption_path = pair.caption_path;
        const caption_content = pair.caption_content;
		const caption_id = pair.id;

		// upate caption content of pair in pairsData with id of caption_id
		for (let i = 0; i < pairsData.length; i++) {
			let tempPair = pairsData[i];
			if (tempPair.id == caption_id) {
				pairsData[i].caption_content = caption_content;
			}
		}

        fetch('/update-caption', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                caption_path,
                caption_content
            })
        })
        .then(response => response)
        .then(data => console.log(data))
        .catch(error => console.error(error));
    };


	////////////////////////////////////////////////////////
	//////////////////// EVENT HANDLEING ///////////////////
	////////////////////////////////////////////////////////
	function handleSearchAndReplace(event) {
		let searchInput = event.detail.searchInput;
		let replaceInput = event.detail.replaceInput;
		searchAndReplace(searchInput, replaceInput);
	}

	function handleSaveCaption(event) {
		console.log("handleSaveCaption", event.detail.pair);
		let pair = event.detail.pair;
		saveCaption(pair);
	}

	function handleSelectDirectory(event) {
		console.log("handleSelectDirectory", event.detail.directory);
		// pathSelectorOpen = false
		// let directory = event.detail.directory;
		// selectedDirectory = directory;
		// fetchPairsData(directory)
	}
	function handleOpenPathSelector(event) {
		console.log("handleOpenPathSelector");
		openPathSelector()
	}

	function handleOpenInModal(event) {
		console.log("handleOpenInModal", event.detail.pair);
		currentPair = event.detail.pair;
		detailedViewOpen = true;
	}
</script>


<Header {pairCount} on:openPathSelector={handleOpenPathSelector}/>

<Main {pairsData} on:saveCaption={handleSaveCaption} on:openInModal={handleOpenInModal}></Main>

<SidePanel on:searchAndReplace={handleSearchAndReplace}/>

<!-- MODALS -->
<!-- MODAL: PATH SELECTOR -->
<ModalPathSelector visible={pathSelectorOpen}/>


<!-- MODAL: DETAILED VIEW -->

<Modal visible={detailedViewOpen}>
	<Button on:click={ () => detailedViewOpen = false }>Close</Button>
	<CaptionCard maxContentWidth="false" pair={currentPair} on:saveCaption={handleSaveCaption} />
</Modal>