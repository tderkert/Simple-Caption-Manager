<script>
    import Button from '/src/components/button.svelte';
    import { cleanCaptions } from '/src/lib/store/GlobalStore.js';
</script>


<div class="p-4 flex flex-col gap-4 items-stretch">
    <!-- Tidy Captions -->
    <form class="flex flex-col gap-4 items-stretch">
        <Button on:click={ cleanCaptions }> Tidy Captions</Button>
    </form>
</div>
