<script lang="ts">
  import {
    FolderInput,
    BadgePlus,
    ListVideo,
    FolderPlus,
    ChevronLeft,
  } from "lucide-svelte";
  import { db } from "./background/background";
  import List from "./lib/List.svelte";
  import { onMount } from "svelte";

  let showExistingFolders = $state(false);
  let showEmojiOptions = $state(false);
  let url = $state("");
  let title = $state("");

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
        ><FolderInput class="text-black " size={15} /></button
      >
      <button
        type="submit"
        class="border border-black h-6 border-input bg-background rounded-sm px-3 cursor-pointer hover:bg-accent hover:text-accent-foreground"
        ><BadgePlus class="text-black " size={15} /></button
      >
    </div>
  </form>
  <!-- <div>No folders</div> -->
  {#if !showEmojiOptions}
    {#if showExistingFolders}
      <div class="flex gap-2 p-2 items-center text-sm">
        <div>🐟</div>
        <div>🐠</div>
        <div>🐡</div>
      </div>
    {:else}
      <div class="flex gap-2 p-2 items-center text-sm">
        <div><ListVideo size={20} /></div>
        <div class="h-4 bg-black w-[1px]"></div>
        <div>😍</div>
        <div>🔥</div>
        <div>👀</div>
        <div class="h-4 bg-black w-[1px]"></div>
        <button class="self-end"
          ><FolderPlus
            class="text-black "
            size={15}
            onclick={() => (showEmojiOptions = true)}
          /></button
        >
      </div>
    {/if}
  {:else}
    <div class="flex gap-2 p-2 items-center text-sm">
      <button class="self-end"
        ><ChevronLeft
          class="text-black "
          size={15}
          onclick={() => (showEmojiOptions = false)}
        /></button
      >
      <div class="h-4 bg-black w-[1px]"></div>
      <div>😍</div>
      <div>🔥</div>
      <div>👀</div>
      <div>😍</div>
      <div>🔥</div>
      <div>👀</div>
    </div>
  {/if}

  <hr />
  <List />
</main>
