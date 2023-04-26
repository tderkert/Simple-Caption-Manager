<script>
    import { createEventDispatcher } from "svelte";

    export let pair = {};
    export let maxContentWidth = false

    let visible = false

    const dispatch = createEventDispatcher();

    // Computed classes based on props
    $: imageSizeClass = maxContentWidth ? "w-max h-full" : "h-max w-full";
    $: paragraphHeight = maxContentWidth ? "h-auto" : "h-full";

    function saveCaption() {
        console.log("CaptionCard: handleSaveCaption")
        dispatch('saveCaption', {
            pair: pair
        });
    };
    function openInModal() {
        console.log("openInModal: openInModal")
        dispatch('openInModal', {
            pair: pair
        });
    };

    // Handle visiblity when image has loaded
    const onload = el => {
        el.addEventListener('load', () => {
            visible = true
            console.log("CaptionCard: onload")
        })
    }
    $: visibilityClass = visible ? "opacity-100" : "opacity-0"

</script>

<div class="{visibilityClass} p-1 gap-3 flex items-center flex-col rounded-xl shadow-lg overflow-hidden relative group transition duration-500">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <img use:onload class="rounded-lg cursor-pointer peer {imageSizeClass} " on:click={openInModal} src={pair.image_path} alt={pair.image_alt} >
    <p bind:innerText={pair.caption_content} on:input={saveCaption} class="w-full {paragraphHeight} p-4 pb-5  whitespace-normal rounded-lg bg-slate-800 bg-opacity-40 group-hover:bg-opacity-80 focus:bg-slate-800 ring-blue-500 resize-none focus:ring-2 transition" contenteditable="true" ></p>
</div>
