<script>
    import { createEventDispatcher } from 'svelte';

    export let value = false;
    export let label = '';
    

    const dispatch = createEventDispatcher();

    // Dispatch an event when the checkbox is changed
    function handleChange() {
        dispatch('change', value);
    }

</script>

<div class="flex gap-2 group">
    <div class="relative w-7 h-7">
        <input bind:checked="{value}" on:change={handleChange} class="peer appearance-none cursor-pointer w-7 h-7 p-0 border-2 border-white border-opacity-40 rounded-lg bg-slate-900 checked:bg-blue-500 ring-blue-500 checked:border-opacity-0 focus:ring-0 transition placeholder-white placeholder-opacity-40" type="checkbox" id={label}>
        <div class="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2.5 -translate-x-2.5 text-white opacity-0 transition-opacity peer-checked:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" stroke-width="1"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
        </div>
    </div>
    <label for={label} class="w-full pt-0.5 opacity-80 group-hover:opacity-100 cursor-pointer select-none">{label}</label>
</div>
