<script>
    export let placeholder = "";
    export let value = "";
    export let id = "";
</script>
<input bind:value="{value}" class="px-3 py-2 rounded-xl bg-slate-900 ring-blue-500 focus:ring-2 transition placeholder-white placeholder-opacity-40" type="text" id={id} placeholder={placeholder}>