<script>
    import Modal from '/src/components/modal.svelte';
    import Button from '/src/components/button.svelte';
    import CaptionCard from '/src/components/captionCard.svelte';
    import Tag from '/src/components/tag.svelte';

    import { 
        pairsStore,
		currentPairStore,
		currentPairIndexStore 
	} from '/src/lib/store/GlobalStore.js';
    import { onMount } from 'svelte';

    export let visible = false;
    let pair = {}
    let index = 0
    let pairsData = []

    pairsStore.subscribe(value => {
        pairsData = value;
    });

    currentPairStore.subscribe(value => {
        pair = value;
    });

    currentPairIndexStore.subscribe(value => {
        index = value;
    });

    ///////////////////////////////////////////////////////
	/////////// Detailed View functionality ///////////////
	///////////////////////////////////////////////////////

	function currentPairNext() {
		console.log("currentPairNext");
			if (index < pairsData.length - 1) {
				currentPairIndexStore.set(index + 1);
			}
		}
	function currentPairPrevious() {
		console.log("currentPairPrevious");
		if (index > 0) {
			currentPairIndexStore.set(index - 1);
		}
	}

    onMount(() => {
		// Listen to left/righ key + command key press and traverse between images

		window.addEventListener('keydown', function (event) {
			if (visible) {
				if (event.key == "ArrowLeft" && event.metaKey) {
					event.preventDefault();
					currentPairPrevious()
				} else if (event.key == "ArrowRight" && event.metaKey) {
					event.preventDefault();
					currentPairNext()
				}
			}
		});
    });
    
</script>

<!-- svelte-ignore missing-declaration -->
<Modal bind:visible={visible}>
	<div class="flex gap-2">
		<Button on:click={currentPairPrevious}>Previous <Tag label="Cmd + ←" /></Button>
		<Button variant="secondary" on:click={ () => visible = false }>Close</Button>
		<Button on:click={currentPairNext}>Next <Tag label="Cmd + →" /></Button>
	</div>
	<CaptionCard maxContentWidth="false" {pair} {index} on:saveCaption on:openInModal/>
</Modal>