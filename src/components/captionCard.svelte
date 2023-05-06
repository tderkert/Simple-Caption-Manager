<script>
    import { createEventDispatcher } from "svelte";
    import { saveCaption } from "/src/lib/store/GlobalStore.js";

    export let pair = {};
    export let index = 0;
    export let maxContentWidth = false

    let visible = false

    // Use to display image dimensions
    $: dimensions = pair.exif["Image Height"].value + " x " + pair.exif["Image Width"].value

    const dispatch = createEventDispatcher();

    // Computed classes based on props
    $: imageSizeClass = maxContentWidth ? "w-max h-full" : "h-max w-full";
    $: paragraphHeight = maxContentWidth ? "h-auto" : "h-full";

    function handleSaveCaption() {
        console.log("CaptionCard: handleSaveCaption")
        saveCaption(pair);
    };
    function openInModal() {
        console.log("openInModal: openInModal", index)
        dispatch('openInModal', {
            pair: pair,
            index: index
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

<div class="{visibilityClass} p-1 gap-3 max-h-full flex items-center flex-col rounded-xl shadow-lg overflow-hidden relative group transition duration-500">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <img use:onload class="rounded-lg cursor-pointer peer {imageSizeClass} " on:click={openInModal} src={pair.image_path} alt={pair.image_alt} >
    <p bind:innerText={pair.caption_content} on:input={handleSaveCaption} class="w-full {paragraphHeight} p-4 pb-5  whitespace-normal rounded-lg bg-slate-800 bg-opacity-40 group-hover:bg-opacity-80 focus:bg-slate-800 ring-blue-500 resize-none focus:ring-2 transition" contenteditable="true" ></p>
</div>
