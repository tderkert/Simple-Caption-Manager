<script>
    export let pair = {}

    $: exifData = pair.exif

    let acceptedExifKeys = [
        "Image Height",
        "Image Width",
        "Make",
        "Model",
        // "Orientation",
        // "X Resolution",
        // "Y Resolution",
        // "Resolution Unit",
        "Software",
        "Date and Time (Modified)",
        // "Y Cb Cr Positioning",
        "Exposure Time",
        "F Number",
        // "Exposure Program",
        "ISO",
        // "Exif Version",
        "Date and Time (Original)",
        "Date and Time (Digitized)",
        // "Components Configuration",
        "Shutter Speed Value",
        "Aperture Value",
        // "Brightness Value",
        // "Exposure Compensation",
        "Metering Mode",
        "Flash",
        "Focal Length",
        // "Subject Area",
        // "Sub Sec Time Original",
        // "Sub Sec Time Digitized",
        // "Flashpix Version",
        "Color Space",
        // "Exif Image Width",
        // "Exif Image Height",
        // "Sensing Method",
        // "Scene Type",
        "Exposure Mode",
        "White Balance",
        "Focal Length In 35mm Format",
        // "Scene Capture Type",
        "Lens Info",
        "Lens Make",
        "Lens Model",
        "Lens Serial Number",
        "Lens Specification",
        "Lens Serial Number",
    ]
</script>
<div class="p-4 rounded-xl flex flex-col gap-2 bg-slate-800 w-full h-full overflow-hidden overflow-y-scroll">

    {#each Object.keys(exifData) as key}
        {#each acceptedExifKeys as acceptedKey}
            {#if key === acceptedKey}
                <div class="flex flex-row">
                    <span class="w-1/2 text-slate-400">{key}</span>
                    <span class="w-1/2 text-slate-300">{exifData[key].description}</span>
                </div>
            {/if}
        {/each}
    {/each}
</div>