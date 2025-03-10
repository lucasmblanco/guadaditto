<script lang="ts">
  import FolderListB from "./lib/FolderListB.svelte";
  import FolderListA from "./lib/FolderListA.svelte";
  import { FolderInput, BadgePlus } from "lucide-svelte";
  import { db } from "./background/background";
  import List from "./lib/List.svelte";
  import EmojiList from "./lib/EmojiList.svelte";
  import { onMount } from "svelte";
  import { urlChecker } from "./utils/utils";

  let showExistingFolders = $state(false);
  let showEmojiOptions = $state(false);
  let url = $state("");
  let title = $state("");
  let selectedFolder = $state({ id: null, name: "" });
  let resize = $state(false);
  let checkedDefault = $state(true);
  let enableSubmit = $state(false);

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
        if (tab?.url && urlChecker(tab?.url)) {
          enableSubmit = true;
          url = tab.url;
          title = tab.title || ""; // trim title: (1) title - Youtube
        } else {
          title = "No youtube video found";
        }
        // if (tab?.url) {

        // }
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
  class="bg-bg-ditto border-accent-bg-ditto font-secondary w-[400px] border p-3 pt-0 text-white"
>
  <h1 class="font-main text-accent-ditto py-2 text-2xl opacity-50 select-none">
    guardaditto
  </h1>
  <form class="flex items-center justify-between gap-2" onsubmit={handleSubmit}>
    <input
      bind:value={title}
      readonly
      disabled
      name="url"
      type="text"
      class="border-accent-ditto bg-primary-ditto ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring col-span-4 flex h-8 w-full rounded-full border px-2 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
    />
    <div class="flex gap-2">
      <button
        disabled={!enableSubmit}
        type="button"
        onclick={() => {
          showExistingFolders = !showExistingFolders;
        }}
        class="inline-flex h-8 w-8 items-center justify-center border {showExistingFolders
          ? 'bg-primary-ditto'
          : ''} border-accent-ditto ring-offset-background focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground hover:bg-primary-ditto active:bg-primary-ditto/150 cursor-pointer gap-2 rounded-full text-center text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
      >
        {#if selectedFolder.id}
          {selectedFolder.name}
        {:else}
          <FolderInput class="text-xs" />
        {/if}
      </button>
      <button
        disabled={!enableSubmit}
        type="submit"
        class="border-accent-ditto ring-offset-background focus-visible:ring-ring not-first:hover:bg-accent hover:text-accent-foreground hover:bg-primary-ditto active:bg-primary-ditto/150 inline-flex h-8 w-8 cursor-pointer items-center justify-center gap-2 rounded-full border text-center text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
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
