<script lang="ts">
  import { liveQuery } from "dexie";
  import {
    FolderInput,
    BadgePlus,
    ListVideo,
    FolderPlus,
    ChevronLeft,
    ChevronRight,
  } from "lucide-svelte";
  import { db } from "./background/background";
  import List from "./lib/List.svelte";
  import EmojiList from "./lib/EmojiList.svelte";
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";

  let showExistingFolders = $state(false);
  let showEmojiOptions = $state(false);
  let url = $state("");
  let title = $state("");
  let scrollContainer = $state<HTMLElement | null>(null);
  let showLeftGradient = $state(false);
  let showRightGradient = $state(false);
  let selectedFolder = $state({ id: null, name: "" });
  let selectedFolderId = $state(null as number | null);

  let folders = liveQuery(() => db.folders.toArray());

  function handleScroll() {
    if (scrollContainer) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
      showLeftGradient = scrollLeft > 0;
      showRightGradient = scrollLeft < scrollWidth - clientWidth - 1;
    }
  }

  function scroll(direction: "left" | "right") {
    if (scrollContainer) {
      const scrollAmount = direction === "left" ? -200 : 200;
      scrollContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  }

  onMount(() => {
    const fetchTabData = async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (tab?.url) {
        url = tab.url;
        title = tab.title || "";
      }
    };

    fetchTabData();
    handleScroll();
    const resizeObserver = new ResizeObserver(handleScroll);
    if (scrollContainer) {
      resizeObserver.observe(scrollContainer);
    }

    return () => {
      resizeObserver.disconnect();
    };
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
    if (folder === null || selectedFolder.name === folder.name) {
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
      bind:value={url}
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
          handleScroll();
        }}
        class="h-6 w-6 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 //// text-center cursor-pointer hover:bg-accent hover:text-accent-foreground hover:bg-ditto-secondary active:bg-ditto-tertiary active:text-white"
      >
        {#if selectedFolder.id}
          {selectedFolder.name}
        {:else}
          <FolderInput size={15} />
        {/if}
      </button>
      <button
        type="submit"
        class="h-6 w-6 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 //// text-center cursor-pointer hover:bg-accent hover:text-accent-foreground hover:bg-ditto-secondary active:bg-ditto-tertiary active:text-white"
        ><BadgePlus size={15} /></button
      >
    </div>
  </form>
  {#if showExistingFolders}
    <div
      class="grid grid-flow-col py-2 items-center text-sm justify-between min-w-0 gap-2"
      transition:slide
    >
      {#if showLeftGradient}
        <button
          onclick={() => scroll("left")}
          class=" bg-white rounded-full"
          aria-label="Scroll left"
        >
          <ChevronLeft size={15} />
        </button>
      {/if}

      <div
        class="grid grid-flow-col items-center overflow-x-auto min-w-0 scrollbar-hide select-none"
        bind:this={scrollContainer}
        onscroll={handleScroll}
      >
        {#if $folders && $folders.length > 0}
          {#each $folders as folder (folder.id)}
            <label
              class="h-10 w-10 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 // hover:bg-ditto-secondary active:bg-ditto-tertiary"
              for={folder.name}
              ><input
                onclick={() => selectFolder(folder)}
                hidden
                type="radio"
                name="folder"
                id={folder.name}
                value={folder.name}
              />{folder.name}</label
            >
          {/each}
        {:else}
          <div class="flex-shrink-0">No folders</div>
        {/if}
      </div>
      {#if showRightGradient}
        <button
          onclick={() => scroll("right")}
          class=" bg-white rounded-full"
          aria-label="Scroll right"
        >
          <ChevronRight size={15} />
        </button>
      {/if}
    </div>
  {:else}
    <div
      class="grid grid-flow-col py-2 items-center text-sm justify-between min-w-0 gap-2"
      transition:slide
    >
      <div class=" grid grid-flow-col gap-2 items-center min-w-0">
        <!-- <button
          onclick={() => (selectedFolderId = null)}
          class="h-10 w-10 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-pink-400/50 active:bg-pink-400/80"
        >
          <ListVideo />
        </button> -->

        <label
          class="h-10 w-10 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 // hover:bg-ditto-secondary active:bg-ditto-tertiary active:text-white has-[:checked]:bg-ditto-secondary has-[:checked]:border-1 has-[:checked]:border-ditto-less-bright"
          for="no_folder"
          ><input
            checked
            onclick={() => {
              selectFolder(null);
              selectedFolderId = null;
              showEmojiOptions = false;
            }}
            hidden
            type="radio"
            name="folder"
            id="no_folder"
          />
          <ListVideo /></label
        >
        {#if showLeftGradient}
          <button
            onclick={() => scroll("left")}
            class=" bg-white rounded-full"
            aria-label="Scroll left"
          >
            <ChevronLeft size={15} />
          </button>
        {/if}
        <div
          class="grid grid-flow-col items-center overflow-x-auto min-w-0 scrollbar-hide select-none"
          bind:this={scrollContainer}
          onscroll={handleScroll}
        >
          {#if $folders && $folders.length > 0}
            {#each $folders as folder (folder.id)}
              <label
                class="h-10 w-10 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 // hover:bg-ditto-secondary active:bg-ditto-tertiary has-[:checked]:bg-ditto-secondary has-[:checked]:border-1 has-[:checked]:border-ditto-less-bright"
                for={folder.name}
                ><input
                  onclick={() => {
                    selectFolder(folder);
                    selectedFolderId = folder.id;
                    showEmojiOptions = false;
                  }}
                  hidden
                  type="radio"
                  name="folder"
                  id={folder.name}
                  value={folder.name}
                />{folder.name}</label
              >
            {/each}
          {:else}
            <div class="flex-shrink-0">No folders</div>
          {/if}
        </div>
        {#if showRightGradient}
          <button
            onclick={() => scroll("right")}
            class=" bg-white rounded-full"
            aria-label="Scroll right"
          >
            <ChevronRight size={15} />
          </button>
        {/if}
      </div>

      <button
        onclick={() => {
          showEmojiOptions = !showEmojiOptions;
        }}
        class="h-10 w-10 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-ditto-secondary active:bg-ditto-tertiary"
      >
        <FolderPlus />
      </button>
    </div>
  {/if}

  <!-- <hr /> -->
  {#if !showEmojiOptions}
    <List {selectedFolderId} />
  {:else}
    <EmojiList bind:showEmojiOptions {handleScroll} />
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
