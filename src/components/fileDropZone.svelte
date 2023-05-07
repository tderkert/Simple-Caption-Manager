<script>
    import { onMount } from "svelte";
    import { saveFiles, currentDirectoryStore} from "/src/lib/store/GlobalStore.js"

    let currentDirectory = ""

    currentDirectoryStore.subscribe(value => {
        currentDirectory = value;
    });

    let docDragOver = false
    let zoneDragOver = false
    $: docDragOverClass = docDragOver ? "bg-opacity-60" : "bg-opacity-0 opacity-0";
    $: zoneDragOverClass = zoneDragOver ? "bg-opacity-100" : "";


    onMount(() => {
        const fileDropZone = document.getElementById("fileDropZone");

        // Handle styling when drag over document
        document.addEventListener("dragover", (event) => {
            event.preventDefault();
            docDragOver = true;
        });
        document.addEventListener("dragleave", (event) => {
            event.preventDefault();
            docDragOver = false;
        });
        // Handle styling when drag over file drop zone
        fileDropZone.addEventListener("dragover", (event) => {
            event.preventDefault();
            zoneDragOver = true;
        });
        fileDropZone.addEventListener("dragleave", (event) => {
            event.preventDefault();
            zoneDragOver = false;
        });

        // Handle file drop
        fileDropZone.addEventListener("drop", (event) => {
            event.preventDefault();
            docDragOver = false;
            zoneDragOver = false;
            const files = event.dataTransfer.files;
            
            saveFiles(files, currentDirectory)
        });

    });
</script>

<div id="fileDropZone" class=" flex gap-2 justify-center items-center sticky h-full top-0 left-0 right-0 bottom-0 bg-blue-500 bg-opacity-90 transition {docDragOverClass}{zoneDragOverClass}">
    <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
    <span class="font-bold text-lg">Drop files here...</span>
</div>