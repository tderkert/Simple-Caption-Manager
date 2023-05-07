<script>
    import InputCheckbox from "/src/components/inputCheckbox.svelte";
    import InputText from "/src/components/inputText.svelte";
    import Button from "/src/components/button.svelte";
    import { pairsStore, appendToCaptions } from '/src/lib/store/GlobalStore.js';

    let pairsData = [];

    let appendString = "";
    let appendplaceholder = "Append...";
    let appendUseComma = false

    pairsStore.subscribe(value => {
        pairsData = value;
    });

    function handleAppendToCaptions(){
        appendToCaptions(appendString, appendUseComma)
    }
</script>
<div class="p-4 flex flex-col gap-4 items-stretch">
    <!-- Search and Replace -->
    <form class="flex flex-col gap-4 items-stretch">
        <label class="sr-only" for="appendString">Find:</label>
        <InputText bind:value={appendString} placeholder={appendplaceholder} id="appendString"/>
        
        <InputCheckbox bind:value={appendUseComma} label="Separate with comma"/>

        <Button on:click={ handleAppendToCaptions }>Append</Button>
    </form>
</div>