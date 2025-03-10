<script lang="ts">
  import { liveQuery } from "dexie";
  import {
    ListVideo,
    FolderPlus,
    ChevronLeft,
    ChevronRight,
    CircleDashed,
  } from "lucide-svelte";
  import { db } from "../background/background";
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";

  let scrollContainer = $state<HTMLElement | null>(null);
  let showLeftGradient = $state(false);
  let showRightGradient = $state(false);
  let {
    selectedFolder,
    selectFolder,
    showEmojiOptions = $bindable(),
    resize = $bindable(),
  } = $props();

  let folders = liveQuery(() => db.folders.toArray());

  function handleScroll() {
    if (scrollContainer) {
      requestAnimationFrame(() => {
        if (!scrollContainer) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
        showLeftGradient = Math.ceil(scrollLeft) > 0;
        showRightGradient =
          Math.ceil(scrollLeft) < scrollWidth - clientWidth - 1;
      });
    }
  }

  function scroll(direction: "left" | "right") {
    if (scrollContainer) {
      const scrollAmount = direction === "left" ? -200 : 200;
      scrollContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  }

  onMount(() => {
    handleScroll();
    const resizeObserver = new ResizeObserver(handleScroll);
    if (scrollContainer) {
      resizeObserver.observe(scrollContainer);
    }

    return () => {
      resizeObserver.disconnect();
    };
  });

  $effect(() => {
    if (resize) {
      handleScroll();

      resize = false;
    }
  });
</script>

<div
  class="relative grid min-w-0 grid-flow-col items-center justify-between gap-2 py-2 text-sm"
  transition:slide
>
  <div class=" grid min-w-0 grid-flow-col items-center gap-2">
    <label
      class="border-accent-ditto ring-offset-background focus-visible:ring-ring // hover:bg-primary-ditto active:bg-primary-ditto/150 has-[:checked]:bg-primary-ditto has-[:checked]:border-accent-ditto inline-flex h-10 w-10 items-center justify-center gap-2 rounded-full border text-lg font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:text-white disabled:pointer-events-none disabled:opacity-50 has-[:checked]:border-1 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
      for="no_folder"
      ><input
        checked={selectedFolder.id === null}
        onclick={() => {
          selectFolder(null);
          showEmojiOptions = false;
        }}
        defaultChecked={true}
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
        class=" rounded-full bg-black/50 text-white"
        aria-label="Scroll left"
      >
        <ChevronLeft size={15} />
      </button>
    {/if}
    <div
      class="scrollbar-hide grid min-w-0 grid-flow-col items-center gap-2 overflow-x-auto select-none"
      bind:this={scrollContainer}
      onscroll={handleScroll}
    >
      {#if $folders && $folders.length > 0}
        {#each $folders as folder (folder.id)}
          <label
            class="border-accent-ditto ring-offset-background focus-visible:ring-ring // hover:bg-primary-ditto active:bg-primary-ditto/150 has-[:checked]:bg-primary-ditto has-[:checked]:border-accent-ditto inline-flex h-10 w-10 items-center justify-center gap-2 rounded-full border text-lg font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 has-[:checked]:border-1 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
            for={folder.id + folder.name}
            ><input
              checked={folder.id === selectedFolder.id}
              onclick={() => {
                selectFolder(folder);
                showEmojiOptions = false;
              }}
              hidden
              type="radio"
              name="folder"
              id={folder.id + folder.name}
              value={folder.name}
            />{folder.name}</label
          >
        {/each}
      {:else}
        <CircleDashed
          class="text-primary-ditto h-10 w-10 text-2xl opacity-40"
        />
      {/if}
    </div>
    {#if showRightGradient}
      <button
        onclick={() => scroll("right")}
        class=" rounded-full bg-black/50 text-white"
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
    class="border-accent-ditto ring-offset-background {showEmojiOptions
      ? 'bg-primary-ditto'
      : ''} focus-visible:ring-ring hover:bg-primary-ditto inline-flex h-10 w-10 items-center justify-center gap-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
  >
    <FolderPlus />
  </button>
</div>

<style>
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
