<script>
	// Svelte
    import { onMount } from 'svelte';
	// Store
	import { directoriesStore, currentDirectoryStore, currentPairStore } from '/src/lib/store/GlobalStore.js';
	// Components
	import Header from "/src/components/header.svelte";
	import Main from "/src/components/main.svelte";
    import SidePanel from '/src/components/sidePanel.svelte';
    import ModalDirectorySelector from '/src/components/modalDirectorySelector.svelte';
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

	// Modal component state variables
	let directorySelectorOpen = false;
	let detailedViewOpen = false;

	// Subscribe to global state store
	directoriesStore.subscribe(value => {
		directories = value;
	});
	currentDirectoryStore.subscribe(value => {
		currentDirectory = value;
		if (currentDirectory != "") {
			fetchPairsData(currentDirectory);
			closeDirectorySelector();
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
				openDirectorySelector()
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
				pairsData = []
				setTimeout(() => {
					pairsData = data;
				}, 500);
				console.log(pairsData);
			})
	}

	///////////////////////////////////////////////////////

	function openDirectorySelector() {
		console.log("openDirectorySelector");
		directorySelectorOpen = true;
	}

	function closeDirectorySelector() {
		console.log("closeDirectorySelector");
		directorySelectorOpen = false;
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

	///////////////////////////////////////////////////////////
	/////////// Append to captions functionality //////////////
	///////////////////////////////////////////////////////////
	
	function appendToCaptions(string, useComma) {
		for (let i = 0; i < pairsData.length; i++) {
			let pair = pairsData[i];
			let captionContent = pair.caption_content;
			let newCaptionContent
			// TODO: Figure out why a comma is added if the caption is empty
			if (captionContent == "") {
				newCaptionContent = "" + string;
			}else if (useComma) {
				
				newCaptionContent = captionContent + ", " + string;
			} else {
				newCaptionContent = captionContent + " " + string;
			}
			pair.caption_content = newCaptionContent.replaceAll("\n", "");
			saveCaption(pair)
		}
	}

	////////////////////////////////////////////////////////
	/////////////// Clear all captions /////////////////////
	////////////////////////////////////////////////////////
	
	function clearAllCaptions() {
		let confirmClear = confirm("Are you sure you want to clear all captions in this directory?");
		if (confirmClear) {
			for (let i = 0; i < pairsData.length; i++) {
				let pair = pairsData[i];
				pair.caption_content = "";
				saveCaption(pair);
			}
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

	function handleAppendToCaptions(event) {
		let string = event.detail.string;
		let useComma = event.detail.useComma;
		appendToCaptions(string, useComma);
	}

	function handleSaveCaption(event) {
		console.log("handleSaveCaption", event.detail.pair);
		let pair = event.detail.pair;
		saveCaption(pair);
	}


	
	function handleOpenDirectorySelector(event) {
		console.log("handleOpenDirectorySelector");
		openDirectorySelector()
	}

	function handleOpenInModal(event) {
		console.log("handleOpenInModal", event.detail.pair);
		currentPair = event.detail.pair;
		detailedViewOpen = true;
	}
</script>


<Header {pairCount} on:openDirectorySelector={handleOpenDirectorySelector}/>

<Main {pairsData} on:saveCaption={handleSaveCaption} on:openInModal={handleOpenInModal}></Main>

<SidePanel 
	on:searchAndReplace={handleSearchAndReplace} 
	on:clearAllCaptions={clearAllCaptions}
	on:appendToCaptions={handleAppendToCaptions}
/>

<!-- MODALS -->

<!-- MODAL: PATH SELECTOR -->
<ModalDirectorySelector bind:visible={directorySelectorOpen}/>
<!-- MODAL: DETAILED VIEW -->
<Modal bind:visible={detailedViewOpen}>
	<Button on:click={ () => detailedViewOpen = false }>Close</Button>
	<CaptionCard maxContentWidth="false" pair={currentPair} on:saveCaption={handleSaveCaption} />
</Modal>