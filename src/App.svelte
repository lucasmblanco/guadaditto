<script lang="ts">
  import FolderListB from "./lib/FolderListB.svelte";
  import FolderListA from "./lib/FolderListA.svelte";
  import { FolderInput, BadgePlus } from "lucide-svelte";
  import { db } from "./background/background";
  import List from "./lib/List.svelte";
  import EmojiList from "./lib/EmojiList.svelte";
  import { onMount } from "svelte";

  let showExistingFolders = $state(false);
  let showEmojiOptions = $state(false);
  let url = $state("");
  let title = $state("");
  let selectedFolder = $state({ id: null, name: "" });
  let resize = $state(false);
  let checkedDefault = $state(true);

  const fetchTabData = async () => {
    chrome.storage.local.get(["videoUrl", "videoTitle"], async (data) => {
      if (data.videoUrl && data.videoTitle) {
        url = data.videoUrl;
        title = data.videoTitle;
        chrome.storage.local.remove(["videoUrl", "videoTitle"]);
      } else {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        if (tab?.url) {
          url = tab.url;
          title = tab.title || ""; // trim title: (1) title - Youtube
        }
      }
    });
  };

  onMount(() => {
    fetchTabData();
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await db.videos.add({
        title: title,
        folder_id: selectedFolder.id ?? null,
        url: url,
        created_at: new Date(),
      });
    } catch (error) {
      console.error("Error adding video", error);
    }
  };

  function selectFolder(folder) {
    if (folder === null) {
      selectedFolder = { id: null, name: "" };
    } else {
      selectedFolder.id = folder.id;
      selectedFolder.name = folder.name;
    }
    showExistingFolders = false;
  }
</script>

<main
  class="bg-ditto-primary p-3 text-black w-[400px] border-1 border-ditto-bright pt-0"
>
  <h1 class="font-main text-2xl py-2 text-ditto-tertiary/50 select-none">
    guardaditto
  </h1>
  <form class="flex gap-2 justify-between items-center" onsubmit={handleSubmit}>
    <input
      bind:value={title}
      readonly
      disabled
      name="url"
      type="text"
      class="col-span-4 flex h-6 w-full rounded-md border border-ditto-less-bright bg-ditto-secondary px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    />
    <div class="flex gap-2">
      <button
        type="button"
        onclick={() => {
          showExistingFolders = !showExistingFolders;
        }}
        class="h-6 w-6 inline-flex items-center justify-center border border-ditto-less-bright gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 //// text-center cursor-pointer hover:bg-accent hover:text-accent-foreground hover:bg-ditto-secondary active:bg-ditto-tertiary active:text-white"
      >
        {#if selectedFolder.id}
          {selectedFolder.name}
        {:else}
          <FolderInput size={15} />
        {/if}
      </button>
      <button
        type="submit"
        class="h-6 w-6 inline-flex items-center justify-center border border-ditto-less-bright gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 //// text-center cursor-pointer hover:bg-accent hover:text-accent-foreground hover:bg-ditto-secondary active:bg-ditto-tertiary active:text-white"
        ><BadgePlus size={15} /></button
      >
    </div>
  </form>
  {#if showExistingFolders}
    <FolderListA {selectFolder} bind:resize />
  {:else}
    <FolderListB
      {selectFolder}
      {selectedFolder}
      bind:showEmojiOptions
      bind:resize
    />
  {/if}
  {#if !showEmojiOptions}
    <List bind:selectedFolder bind:checkedDefault />
  {:else}
    <EmojiList bind:showEmojiOptions bind:resize />
  {/if}
</main>
