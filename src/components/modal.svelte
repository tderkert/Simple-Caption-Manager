<script>
    import { fly, fade } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';
    import { onMount } from 'svelte';
    export let visible = true;    

    // Transitions
    let flyProps = {
        duration: 200,
        y: 20,
        easing: cubicOut
    }
    let fadeProps = {
        duration: 200,
        easing: cubicOut
    }

    onMount(() => {
        // Create event listener for when escape key is pressed
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && visible === true) {
                visible = false
            }
        });
    });


</script>

{#if visible}
<div transition:fade={fadeProps} class="fixed inset-0 bg-slate-950 bg-opacity-90 p-10 z-40">
    <div transition:fly={flyProps} class="flex flex-col gap-2 pb-12 items-center justify-center w-full h-full flex-shrink-0">
        <slot></slot>
    </div>
</div>	
{/if}