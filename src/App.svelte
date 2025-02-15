<script lang="ts">
  import { liveQuery } from "dexie";
  import {
    FolderInput,
    BadgePlus,
    ListVideo,
    FolderPlus,
    ChevronLeft,
  } from "lucide-svelte";
  import { db } from "./background/background";
  import List from "./lib/List.svelte";
  import EmojiList from "./lib/EmojiList.svelte";
  import { onMount } from "svelte";
  import { fade, slide, blur } from "svelte/transition";
  let isDown = $state(false);
  let startX: number;
  let scrollLeft: number;

  function handleMouseDown(e: MouseEvent) {
    // Only initiate drag if clicking the container directly, not a button
    if ((e.target as HTMLElement).tagName === "BUTTON") return;

    const slider = e.currentTarget as HTMLElement;
    isDown = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  }

  function handleMouseUp(e: MouseEvent) {
    isDown = false;
  }

  function handleMouseLeave(e: MouseEvent) {
    isDown = false;
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isDown) return;
    const slider = e.currentTarget as HTMLElement;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
  }

  let showExistingFolders = $state(false);
  let showEmojiOptions = $state(false);
  let url = $state("");
  let title = $state("");

  let folders = liveQuery(() => db.folders.toArray());

  onMount(async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tab?.url) {
      url = tab.url;
      title = tab.title || "";
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await db.videos.add({
        title: title,
        folder_id: 1,
        url: url,
        created_at: new Date(),
      });
    } catch (error) {
      console.error("Error adding video", error);
    }
  };
</script>

<main class="bg-pink-300 p-2 text-black w-[400px] px-3">
  <h1>guardaditto</h1>
  <form class="flex gap-2" onsubmit={handleSubmit}>
    <input
      bind:value={url}
      readonly
      name="url"
      type="text"
      class="flex h-6 w-full rounded-sm border border-black border-input bg-background px-2 py-2 text-xs ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
    />
    <div class="flex gap-2">
      <button
        type="button"
        onclick={() => (showExistingFolders = !showExistingFolders)}
        class="border border-black h-6 border-input bg-background rounded-sm px-3 cursor-pointer hover:bg-accent hover:text-accent-foreground"
        ><FolderInput class="text-black" size={15} /></button
      >
      <button
        type="submit"
        class="border border-black h-6 border-input bg-background rounded-sm px-3 cursor-pointer hover:bg-accent hover:text-accent-foreground"
        ><BadgePlus class="text-black" size={15} /></button
      >
    </div>
  </form>
  <!-- <div>No folders</div> -->

  {#if showExistingFolders}
    <div class="flex gap-2 p-2 items-center text-sm" transition:slide>
      <div>🐟</div>
      <div>🐠</div>
      <div>🐡</div>
    </div>
  {:else}
    <div
      class="flex p-2 items-center text-sm justify-between min-w-0 gap-2"
      transition:slide
    >
      <div class="flex gap-2 items-center min-w-0">
        <div class="flex-shrink-0">
          <ListVideo size={20} />
        </div>
        <div class="h-4 bg-black w-[1px] flex-shrink-0"></div>
        <div
          class="flex gap-2 items-center overflow-x-auto min-w-0 scrollbar-hide cursor-grab select-none"
          onmousedown={handleMouseDown}
          onmouseleave={handleMouseLeave}
          onmouseup={handleMouseUp}
          onmousemove={handleMouseMove}
        >
          {#if $folders && $folders.length > 0}
            {#each $folders as folder (folder.id)}
              <div class="flex-shrink-0 whitespace-nowrap">
                {folder.name}
              </div>
            {/each}
          {:else}
            <div class="flex-shrink-0">No folders</div>
          {/if}
        </div>
      </div>
      <button class="flex-shrink-0">
        <FolderPlus
          class="text-black"
          size={15}
          onclick={() => (showEmojiOptions = !showEmojiOptions)}
        />
      </button>
    </div>
  {/if}

  <hr />
  {#if !showEmojiOptions}
    <List />
  {:else}
    <EmojiList />
  {/if}
</main>

<style>
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
