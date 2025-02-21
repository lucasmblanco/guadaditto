<script lang="ts">
  import { liveQuery } from "dexie";
  import {
    ListVideo,
    FolderPlus,
    ChevronLeft,
    ChevronRight,
  } from "lucide-svelte";
  import { db } from "../background/background";
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";

  let scrollContainer = $state<HTMLElement | null>(null);
  let showLeftGradient = $state(false);
  let showRightGradient = $state(false);
  let {
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

  function handleRightScroll() {
    if (scrollContainer) {
      requestAnimationFrame(() => {
        if (!scrollContainer) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
        showRightGradient =
          Math.ceil(scrollLeft) < scrollWidth - clientWidth - 1;
      });
    }
  }

  function handleLeftScroll() {
    if (scrollContainer) {
      requestAnimationFrame(() => {
        if (!scrollContainer) return;
        const { scrollLeft } = scrollContainer;
        showLeftGradient = Math.ceil(scrollLeft) > 0;
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
      // scrollContainer.scrollTo({
      //   left: scrollContainer.scrollWidth,
      //   behavior: "smooth",
      // });
      handleScroll();

      resize = false;
    }
  });
</script>

<div
  class="grid grid-flow-col py-2 items-center text-sm justify-between min-w-0 gap-2"
  transition:slide
>
  <div class=" grid grid-flow-col gap-2 items-center min-w-0">
    <label
      class="h-10 w-10 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 // hover:bg-ditto-secondary active:bg-ditto-tertiary active:text-white has-[:checked]:bg-ditto-secondary has-[:checked]:border-1 has-[:checked]:border-ditto-less-bright"
      for="no_folder"
      ><input
        checked
        onclick={() => {
          selectFolder(null);
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
        <div
          class="grid grid-flow-col items-center overflow-x-auto min-w-0 scrollbar-hide select-none"
        >
          No folders
        </div>
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
  <div>
    <button
      onclick={() => {
        showEmojiOptions = !showEmojiOptions;
      }}
      class="h-10 w-10 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-ditto-secondary active:bg-ditto-tertiary"
    >
      <FolderPlus />
    </button>
  </div>
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
