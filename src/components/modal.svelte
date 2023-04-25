<script>
    import { fly, fade } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';
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


</script>

{#if visible}
<div transition:fade={fadeProps} class="fixed inset-0 bg-slate-950 bg-opacity-90 p-10 z-40">
    <div class="flex flex-col gap-10 pb-12 items-center justify-center w-full h-full flex-shrink-0">
        <slot></slot>
    </div>
</div>	
{/if}