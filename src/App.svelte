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
  class="bg-bg-ditto p-3 w-[400px] border border-accent-bg-ditto pt-0 text-white"
>
  <h1 class="font-main text-2xl py-2 text-primary-ditto select-none">
    guardaditto
  </h1>
  <form class="flex gap-2 justify-between items-center" onsubmit={handleSubmit}>
    <input
      bind:value={title}
      readonly
      disabled
      name="url"
      type="text"
      class="col-span-4 flex h-8 w-full rounded-full border border-accent-ditto bg-primary-ditto px-2 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    />
    <div class="flex gap-2">
      <button
        type="button"
        onclick={() => {
          showExistingFolders = !showExistingFolders;
        }}
        class="h-8 w-8 inline-flex items-center justify-center border {showExistingFolders
          ? 'bg-primary-ditto'
          : ''} border-accent-ditto gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-center cursor-pointer hover:bg-accent hover:text-accent-foreground hover:bg-primary-ditto active:bg-primary-ditto/150 active:text-white"
      >
        {#if selectedFolder.id}
          {selectedFolder.name}
        {:else}
          <FolderInput class="text-xs" />
        {/if}
      </button>
      <button
        type="submit"
        class="h-8 w-8 inline-flex items-center justify-center border border-accent-ditto gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 //// text-center cursor-pointer hover:bg-accent hover:text-accent-foreground hover:bg-primary-ditto active:bg-primary-ditto/150 active:text-white"
        ><BadgePlus class="text-xs" /></button
      >
    </div>
  </form>
  <div class="relative h-14">
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
  </div>
  <div class="relative h-50">
    {#if !showEmojiOptions}
      <List bind:selectedFolder bind:checkedDefault />
    {:else}
      <EmojiList bind:showEmojiOptions bind:resize />
    {/if}
  </div>
</main>
