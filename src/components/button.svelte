<script>
    export let variant = "primary"
    
    $: variantClasses = `
        ${variant == "primary" ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
        ${variant == "secondary" ? "bg-white bg-opacity-10 text-white hover:bg-opacity-20" : ""}
    `
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-missing-attribute -->
<button on:click class="h-10 py-2 px-3 flex gap-2 justify-center items-center rounded-lg {variantClasses} transition cursor-pointer"><slot></slot></button>



